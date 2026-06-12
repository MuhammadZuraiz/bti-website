import type { LeadPayload } from "@/lib/lead-schema";
import {
  createContactFingerprint,
  generatePublicReference,
  sanitizePath,
  sanitizeReferrer
} from "@/lib/server/lead-security";
import { logger } from "@/lib/server/logger";
import {
  prismaLeadRepository,
  type LeadDeliveryRecord,
  type LeadRecordInput,
  type LeadRepository
} from "@/services/lead-repository";
import {
  deliverLeadToWebhook,
  type WebhookDeliveryResult
} from "@/services/lead-webhooks";
import type { DeliveryStatus, LeadSubmissionResponse } from "@/types/leads";

type SubmitLeadOptions = {
  repository?: LeadRepository;
  deliver?: (lead: LeadDeliveryRecord) => Promise<WebhookDeliveryResult>;
  referrer?: string | null;
  requestFingerprint?: string;
};

export class LeadPersistenceError extends Error {
  constructor() {
    super("Lead persistence failed.");
  }
}

function clean(value?: string | null) {
  return value?.trim() || undefined;
}

function mapLeadToRecordInput(
  lead: LeadPayload,
  publicReference: string,
  options: SubmitLeadOptions
): LeadRecordInput {
  return {
    publicReference,
    leadType: lead.leadType,
    deliveryStatus: "queued",
    fullName: lead.fullName,
    phone: clean(lead.phone),
    email: clean(lead.email),
    preferredContact: lead.preferredContactMethod,
    courseInterest: clean(lead.courseInterest),
    courseSlug: clean(lead.courseSlug),
    resourceSlug: clean(lead.resourceSlug),
    companyName: clean(lead.companyName),
    jobTitle: clean(lead.jobTitle),
    learnerCount: lead.learnerCount,
    trainingArea: clean(lead.trainingArea),
    preferredDeliveryMode: clean(lead.preferredDeliveryMode),
    englishLearningGoal: clean(lead.englishLearningGoal),
    preferredTime: clean(lead.preferredTime),
    message: clean(lead.message),
    locale: lead.locale,
    sourcePage: sanitizePath(lead.sourcePage),
    referrer: sanitizeReferrer(options.referrer),
    utmSource: clean(lead.utmSource),
    utmMedium: clean(lead.utmMedium),
    utmCampaign: clean(lead.utmCampaign),
    utmContent: clean(lead.utmContent),
    utmTerm: clean(lead.utmTerm),
    consent: lead.consent,
    requestFingerprint:
      options.requestFingerprint ?? createContactFingerprint(lead)
  };
}

async function persistWithReferenceRetry(
  repository: LeadRepository,
  lead: LeadPayload,
  options: SubmitLeadOptions
) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const publicReference = generatePublicReference();
    try {
      return await repository.create(
        mapLeadToRecordInput(lead, publicReference, options)
      );
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function safeRecordDelivery(
  repository: LeadRepository,
  lead: LeadDeliveryRecord,
  status: DeliveryStatus,
  result: WebhookDeliveryResult
) {
  try {
    return await repository.updateDelivery(lead.id, {
      status,
      failureReason: result.ok ? undefined : result.failureReason,
      webhookDeliveryId: result.ok ? result.webhookDeliveryId : undefined
    });
  } catch {
    logger.error("lead_delivery_status_update_failed", {
      publicReference: lead.publicReference,
      leadType: lead.leadType,
      intendedStatus: status
    });
    return lead;
  }
}

export async function submitLead(
  lead: LeadPayload,
  options: SubmitLeadOptions = {}
): Promise<LeadSubmissionResponse> {
  const repository = options.repository ?? prismaLeadRepository;
  const deliver = options.deliver ?? deliverLeadToWebhook;
  let persisted: LeadDeliveryRecord;

  try {
    persisted = await persistWithReferenceRetry(repository, lead, options);
    logger.info("lead_persisted", {
      publicReference: persisted.publicReference,
      leadType: persisted.leadType,
      persistenceResult: "success"
    });
  } catch {
    logger.error("lead_persistence_failed", {
      leadType: lead.leadType,
      persistenceResult: "failed"
    });
    throw new LeadPersistenceError();
  }

  const delivery = await deliver(persisted);

  if (delivery.ok) {
    await safeRecordDelivery(repository, persisted, "delivered", delivery);
    logger.info("lead_delivery_succeeded", {
      publicReference: persisted.publicReference,
      leadType: persisted.leadType,
      deliveryResult: delivery.destination
    });
    return {
      ok: true,
      referenceId: persisted.publicReference,
      deliveryStatus: "delivered",
      message:
        "Thank you. Your enquiry has been received. The admissions team will review your request and contact you using your preferred method."
    };
  }

  await safeRecordDelivery(repository, persisted, "queued", delivery);
  logger.warn("lead_delivery_queued", {
    publicReference: persisted.publicReference,
    leadType: persisted.leadType,
    deliveryResult: "queued"
  });

  return {
    ok: true,
    referenceId: persisted.publicReference,
    deliveryStatus: "queued",
    message:
      "Thank you. Your enquiry has been received. The admissions team will review your request and contact you using your preferred method."
  };
}
