import type { ServerEnv } from "@/config/env.server";
import { logger } from "@/lib/server/logger";
import {
  prismaLeadRepository,
  type LeadDeliveryRecord,
  type LeadRepository
} from "@/services/lead-repository";
import {
  deliverLeadToWebhook,
  type WebhookDeliveryResult
} from "@/services/lead-webhooks";

export type RetrySummary = {
  attempted: number;
  delivered: number;
  stillQueued: number;
  skipped: number;
};

type RetryOptions = {
  repository?: LeadRepository;
  deliver?: (lead: LeadDeliveryRecord) => Promise<WebhookDeliveryResult>;
  env?: Partial<ServerEnv>;
  maxAttempts?: number;
  maxBatchSize?: number;
};

function secretFromRequest(request: Request) {
  const bearer = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  return request.headers.get("x-bti-cron-secret") ?? bearer;
}

export async function handleRetryLeads(
  request: Request,
  options: RetryOptions = {}
): Promise<{ status: number; body: RetrySummary | { error: string } }> {
  const env = options.env ?? process.env;
  const configuredSecret = env.LEAD_RETRY_CRON_SECRET;

  if (!configuredSecret) {
    return { status: 503, body: { error: "Retry secret is not configured." } };
  }

  if (secretFromRequest(request) !== configuredSecret) {
    return { status: 401, body: { error: "Unauthorized." } };
  }

  const url = new URL(request.url);
  const requestedLimit = Number(url.searchParams.get("limit") ?? 25);
  const maxBatchSize = options.maxBatchSize ?? 50;
  const limit = Math.max(1, Math.min(requestedLimit || 25, maxBatchSize));
  const maxAttempts = options.maxAttempts ?? 5;
  const repository = options.repository ?? prismaLeadRepository;
  const deliver = options.deliver ?? deliverLeadToWebhook;
  const candidates = await repository.findForRetry({ limit, maxAttempts });
  const summary: RetrySummary = {
    attempted: 0,
    delivered: 0,
    stillQueued: 0,
    skipped: 0
  };

  for (const lead of candidates) {
    if (lead.deliveryAttempts >= maxAttempts) {
      summary.skipped += 1;
      continue;
    }

    summary.attempted += 1;
    const result = await deliver(lead);

    if (result.ok) {
      await repository.updateDelivery(lead.id, {
        status: "delivered",
        webhookDeliveryId: result.webhookDeliveryId
      });
      summary.delivered += 1;
      logger.info("lead_retry_delivered", {
        publicReference: lead.publicReference,
        leadType: lead.leadType,
        retryResult: "delivered"
      });
      continue;
    }

    const nextStatus =
      lead.deliveryAttempts + 1 >= maxAttempts ? "failed-delivery" : "queued";
    await repository.updateDelivery(lead.id, {
      status: nextStatus,
      failureReason: result.failureReason
    });
    summary.stillQueued += 1;
    logger.warn("lead_retry_still_queued", {
      publicReference: lead.publicReference,
      leadType: lead.leadType,
      retryResult: nextStatus
    });
  }

  return { status: 200, body: summary };
}
