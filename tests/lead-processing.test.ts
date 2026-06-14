import { describe, expect, it } from "vitest";
import {
  LeadPersistenceError,
  submitLead
} from "@/services/lead-processing";
import type {
  LeadDeliveryRecord,
  LeadRecordInput,
  LeadRepository,
  RetryQuery
} from "@/services/lead-repository";

const validLead = {
  leadType: "course-enquiry",
  fullName: "Sample Learner",
  phone: "+971500000000",
  preferredContactMethod: "phone",
  courseSlug: "ielts-preparation-course-sharjah",
  consent: true,
  locale: "en",
  sourcePage: "/en/courses/ielts-preparation-course-sharjah"
} as const;

function createRecord(input: LeadRecordInput): LeadDeliveryRecord {
  return {
    ...input,
    id: "lead_1",
    createdAt: new Date("2026-06-12T00:00:00.000Z"),
    updatedAt: new Date("2026-06-12T00:00:00.000Z"),
    deliveryAttempts: 0,
    lastDeliveryAttemptAt: null,
    deliveredAt: null,
    failureReason: null,
    webhookDeliveryId: null
  };
}

function fakeRepository(options: { failCreate?: boolean } = {}) {
  const records: LeadDeliveryRecord[] = [];
  const repository: LeadRepository = {
    async create(input) {
      if (options.failCreate) {
        throw new Error("database unavailable");
      }
      const record = createRecord(input);
      records.push(record);
      return record;
    },
    async updateDelivery(id, update) {
      const record = records.find((item) => item.id === id);
      if (!record) {
        throw new Error("missing record");
      }
      record.deliveryStatus = update.status;
      record.deliveryAttempts += 1;
      record.lastDeliveryAttemptAt = update.attemptedAt ?? new Date();
      record.failureReason =
        update.status === "delivered" ? null : update.failureReason ?? null;
      record.webhookDeliveryId = update.webhookDeliveryId ?? null;
      record.deliveredAt =
        update.status === "delivered" ? record.lastDeliveryAttemptAt : null;
      return record;
    },
    async findForRetry(_query: RetryQuery) {
      return records;
    },
    async list() {
      return { records, total: records.length };
    },
    async findById(id: string) {
      return records.find((item) => item.id === id) ?? null;
    }
  };
  return { repository, records };
}

describe("lead processing", () => {
  it("persists before returning success and generates a public reference", async () => {
    const { repository, records } = fakeRepository();
    const result = await submitLead(validLead, {
      repository,
      deliver: async () => ({ ok: false, failureReason: "Webhook unavailable." })
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected success");
    }
    expect(result.referenceId).toMatch(/^BTI-[A-F0-9]{6}$/);
    expect(records).toHaveLength(1);
    expect(records[0].publicReference).toBe(result.referenceId);
  });

  it("returns queued when persistence succeeds but webhook delivery fails", async () => {
    const { repository, records } = fakeRepository();
    const result = await submitLead(validLead, {
      repository,
      deliver: async () => ({ ok: false, failureReason: "Webhook HTTP 500" })
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected success");
    }
    expect(result.deliveryStatus).toBe("queued");
    expect(records[0].deliveryStatus).toBe("queued");
    expect(records[0].deliveryAttempts).toBe(1);
  });

  it("marks a lead delivered when webhook delivery succeeds", async () => {
    const { repository, records } = fakeRepository();
    const result = await submitLead(validLead, {
      repository,
      deliver: async () => ({
        ok: true,
        destination: "odoo",
        webhookDeliveryId: "odoo-123"
      })
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      throw new Error("expected success");
    }
    expect(result.deliveryStatus).toBe("delivered");
    expect(records[0].deliveryStatus).toBe("delivered");
    expect(records[0].webhookDeliveryId).toBe("odoo-123");
  });

  it("does not return success when database persistence fails", async () => {
    const { repository } = fakeRepository({ failCreate: true });

    await expect(
      submitLead(validLead, {
        repository,
        deliver: async () => ({ ok: true, destination: "odoo" })
      })
    ).rejects.toBeInstanceOf(LeadPersistenceError);
  });
});
