import { describe, expect, it } from "vitest";
import { handleRetryLeads } from "@/services/lead-retry";
import type {
  LeadDeliveryRecord,
  LeadRepository,
  RetryQuery
} from "@/services/lead-repository";

function lead(overrides: Partial<LeadDeliveryRecord> = {}): LeadDeliveryRecord {
  return {
    id: "lead_1",
    publicReference: "BTI-A7F29C",
    createdAt: new Date("2026-06-12T00:00:00.000Z"),
    updatedAt: new Date("2026-06-12T00:00:00.000Z"),
    leadType: "course-enquiry",
    deliveryStatus: "queued",
    deliveryAttempts: 0,
    fullName: "Sample Learner",
    locale: "en",
    sourcePage: "/en/contact",
    consent: true,
    ...overrides
  };
}

function repo(records: LeadDeliveryRecord[]) {
  let lastQuery: RetryQuery | undefined;
  const repository: LeadRepository = {
    async create() {
      throw new Error("not used");
    },
    async updateDelivery(id, update) {
      const record = records.find((item) => item.id === id);
      if (!record) {
        throw new Error("missing record");
      }
      record.deliveryStatus = update.status;
      record.deliveryAttempts += 1;
      record.webhookDeliveryId = update.webhookDeliveryId ?? null;
      return record;
    },
    async findForRetry(query) {
      lastQuery = query;
      return records.slice(0, query.limit);
    }
  };
  return { repository, getLastQuery: () => lastQuery };
}

function request(secret?: string, limit?: number) {
  return new Request(`https://bti.example/api/internal/retry-leads${limit ? `?limit=${limit}` : ""}`, {
    method: "POST",
    headers: secret ? { "x-bti-cron-secret": secret } : undefined
  });
}

describe("lead retry", () => {
  it("rejects missing secret", async () => {
    const result = await handleRetryLeads(request(), {
      env: { LEAD_RETRY_CRON_SECRET: "secret" }
    });

    expect(result.status).toBe(401);
  });

  it("rejects invalid secret", async () => {
    const result = await handleRetryLeads(request("wrong"), {
      env: { LEAD_RETRY_CRON_SECRET: "secret" }
    });

    expect(result.status).toBe(401);
  });

  it("replays queued leads successfully", async () => {
    const record = lead();
    const { repository } = repo([record]);
    const result = await handleRetryLeads(request("secret"), {
      env: { LEAD_RETRY_CRON_SECRET: "secret" },
      repository,
      deliver: async () => ({ ok: true, destination: "odoo" })
    });

    expect(result.body).toMatchObject({ attempted: 1, delivered: 1 });
    expect(record.deliveryStatus).toBe("delivered");
  });

  it("skips leads already at maximum attempts", async () => {
    const record = lead({ deliveryAttempts: 5 });
    const { repository } = repo([record]);
    const result = await handleRetryLeads(request("secret"), {
      env: { LEAD_RETRY_CRON_SECRET: "secret" },
      repository,
      maxAttempts: 5,
      deliver: async () => ({ ok: true, destination: "odoo" })
    });

    expect(result.body).toMatchObject({ attempted: 0, skipped: 1 });
  });

  it("caps requested batch size", async () => {
    const { repository, getLastQuery } = repo([]);
    await handleRetryLeads(request("secret", 500), {
      env: { LEAD_RETRY_CRON_SECRET: "secret" },
      repository,
      maxBatchSize: 25
    });

    expect(getLastQuery()?.limit).toBe(25);
  });
});
