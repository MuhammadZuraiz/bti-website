import { createHmac } from "node:crypto";
import type { ServerEnv } from "@/config/env.server";
import type { LeadDeliveryRecord } from "@/services/lead-repository";

export type WebhookDestination = {
  name: "odoo" | "generic";
  url: string;
  secret?: string;
};

export type WebhookDeliveryResult =
  | {
      ok: true;
      destination: WebhookDestination["name"];
      webhookDeliveryId?: string;
    }
  | {
      ok: false;
      failureReason: string;
    };

export type WebhookFetch = typeof fetch;

const webhookTimeoutMs = 9000;

export function getWebhookDestinations(env: Partial<ServerEnv> = process.env) {
  const destinations: WebhookDestination[] = [];

  if (env.ODOO_LEAD_WEBHOOK_URL) {
    destinations.push({
      name: "odoo",
      url: env.ODOO_LEAD_WEBHOOK_URL,
      secret: env.ODOO_LEAD_WEBHOOK_SECRET
    });
  }

  if (env.GENERIC_LEAD_WEBHOOK_URL) {
    destinations.push({
      name: "generic",
      url: env.GENERIC_LEAD_WEBHOOK_URL,
      secret: env.GENERIC_LEAD_WEBHOOK_SECRET
    });
  }

  return destinations;
}

function signatureFor(body: string, secret?: string) {
  if (!secret) {
    return undefined;
  }

  return `sha256=${createHmac("sha256", secret).update(body).digest("hex")}`;
}

function safeFailureReason(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Webhook timed out.";
  }

  if (error instanceof Error && /^Webhook HTTP \d{3}$/.test(error.message)) {
    return error.message;
  }

  return "Webhook delivery failed.";
}

function toWebhookPayload(lead: LeadDeliveryRecord) {
  return {
    publicReference: lead.publicReference,
    leadType: lead.leadType,
    createdAt: lead.createdAt.toISOString(),
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    preferredContact: lead.preferredContact,
    courseInterest: lead.courseInterest,
    courseSlug: lead.courseSlug,
    resourceSlug: lead.resourceSlug,
    companyName: lead.companyName,
    jobTitle: lead.jobTitle,
    learnerCount: lead.learnerCount,
    trainingArea: lead.trainingArea,
    preferredDeliveryMode: lead.preferredDeliveryMode,
    englishLearningGoal: lead.englishLearningGoal,
    preferredTime: lead.preferredTime,
    message: lead.message,
    locale: lead.locale,
    sourcePage: lead.sourcePage,
    referrer: lead.referrer,
    utmSource: lead.utmSource,
    utmMedium: lead.utmMedium,
    utmCampaign: lead.utmCampaign,
    utmContent: lead.utmContent,
    utmTerm: lead.utmTerm,
    consent: lead.consent
  };
}

async function postDestination(
  destination: WebhookDestination,
  lead: LeadDeliveryRecord,
  fetcher: WebhookFetch,
  timeoutMs: number
) {
  const body = JSON.stringify(toWebhookPayload(lead));
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const timestamp = new Date().toISOString();
  const signature = signatureFor(body, destination.secret);

  try {
    const response = await fetcher(destination.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": lead.publicReference,
        "x-bti-lead-reference": lead.publicReference,
        "x-bti-webhook-timestamp": timestamp,
        ...(destination.secret
          ? { authorization: `Bearer ${destination.secret}` }
          : {}),
        ...(signature ? { "x-bti-webhook-signature": signature } : {})
      },
      body,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Webhook HTTP ${response.status}`);
    }

    return response.headers.get("x-delivery-id") ?? undefined;
  } finally {
    clearTimeout(timeout);
  }
}

export async function deliverLeadToWebhook(
  lead: LeadDeliveryRecord,
  options: {
    destinations?: WebhookDestination[];
    fetcher?: WebhookFetch;
    timeoutMs?: number;
  } = {}
): Promise<WebhookDeliveryResult> {
  const destinations = options.destinations ?? getWebhookDestinations();
  const fetcher = options.fetcher ?? fetch;
  const timeoutMs = options.timeoutMs ?? webhookTimeoutMs;
  let lastFailure = "No lead webhook destination configured.";

  for (const destination of destinations) {
    try {
      const webhookDeliveryId = await postDestination(
        destination,
        lead,
        fetcher,
        timeoutMs
      );
      return { ok: true, destination: destination.name, webhookDeliveryId };
    } catch (error) {
      lastFailure = safeFailureReason(error);
    }
  }

  return { ok: false, failureReason: lastFailure };
}
