import { prisma } from "@/lib/server/prisma";
import type { DeliveryStatus } from "@/types/leads";

export type LeadRecordInput = {
  publicReference: string;
  leadType: string;
  deliveryStatus: DeliveryStatus;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  preferredContact?: string | null;
  courseInterest?: string | null;
  courseSlug?: string | null;
  resourceSlug?: string | null;
  companyName?: string | null;
  jobTitle?: string | null;
  learnerCount?: number | null;
  trainingArea?: string | null;
  preferredDeliveryMode?: string | null;
  englishLearningGoal?: string | null;
  preferredTime?: string | null;
  message?: string | null;
  locale: string;
  sourcePage: string;
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
  consent: boolean;
  requestFingerprint?: string | null;
};

export type LeadDeliveryRecord = LeadRecordInput & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deliveryAttempts: number;
  lastDeliveryAttemptAt?: Date | null;
  deliveredAt?: Date | null;
  failureReason?: string | null;
  webhookDeliveryId?: string | null;
};

export type DeliveryUpdate = {
  status: DeliveryStatus;
  failureReason?: string;
  webhookDeliveryId?: string;
  attemptedAt?: Date;
};

export type RetryQuery = {
  limit: number;
  maxAttempts: number;
};

export interface LeadRepository {
  create(data: LeadRecordInput): Promise<LeadDeliveryRecord>;
  updateDelivery(id: string, update: DeliveryUpdate): Promise<LeadDeliveryRecord>;
  findForRetry(query: RetryQuery): Promise<LeadDeliveryRecord[]>;
}

function toDeliveryStatus(value: string): DeliveryStatus {
  if (value === "delivered" || value === "failed-delivery") {
    return value;
  }

  return "queued";
}

function toLeadRecord(record: Omit<LeadDeliveryRecord, "deliveryStatus"> & { deliveryStatus: string }): LeadDeliveryRecord {
  return {
    ...record,
    deliveryStatus: toDeliveryStatus(record.deliveryStatus)
  };
}

export const prismaLeadRepository: LeadRepository = {
  async create(data) {
    const record = await prisma.leadSubmission.create({
      data
    });
    return toLeadRecord(record);
  },

  async updateDelivery(id, update) {
    const attemptedAt = update.attemptedAt ?? new Date();
    const record = await prisma.leadSubmission.update({
      where: { id },
      data: {
        deliveryStatus: update.status,
        deliveryAttempts: { increment: 1 },
        lastDeliveryAttemptAt: attemptedAt,
        deliveredAt: update.status === "delivered" ? attemptedAt : undefined,
        failureReason:
          update.status === "delivered" ? null : update.failureReason ?? "Delivery failed.",
        webhookDeliveryId: update.webhookDeliveryId
      }
    });

    return toLeadRecord(record);
  },

  async findForRetry({ limit, maxAttempts }) {
    const records = await prisma.leadSubmission.findMany({
      where: {
        deliveryStatus: { in: ["queued", "failed-delivery"] },
        deliveryAttempts: { lt: maxAttempts }
      },
      orderBy: { createdAt: "asc" },
      take: limit
    });

    return records.map(toLeadRecord);
  }
};
