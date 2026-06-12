import { describe, expect, it } from "vitest";
import { deliverLeadToWebhook } from "@/services/lead-webhooks";
import type { LeadDeliveryRecord } from "@/services/lead-repository";

const lead: LeadDeliveryRecord = {
  id: "lead_1",
  publicReference: "BTI-A7F29C",
  createdAt: new Date("2026-06-12T00:00:00.000Z"),
  updatedAt: new Date("2026-06-12T00:00:00.000Z"),
  leadType: "course-enquiry",
  deliveryStatus: "queued",
  deliveryAttempts: 0,
  fullName: "Sample Learner",
  phone: "+971500000000",
  email: "learner@example.com",
  preferredContact: "phone",
  courseSlug: "ielts-preparation-course-sharjah",
  locale: "en",
  sourcePage: "/en/contact",
  consent: true
};

function okResponse(headers?: HeadersInit) {
  return new Response("{}", { status: 200, headers });
}

describe("lead webhooks", () => {
  it("delivers to Odoo when available", async () => {
    const result = await deliverLeadToWebhook(lead, {
      destinations: [{ name: "odoo", url: "https://odoo.example.test", secret: "secret" }],
      fetcher: async () => okResponse({ "x-delivery-id": "odoo-1" })
    });

    expect(result).toEqual({
      ok: true,
      destination: "odoo",
      webhookDeliveryId: "odoo-1"
    });
  });

  it("falls back to the generic webhook when Odoo fails", async () => {
    const calls: string[] = [];
    const result = await deliverLeadToWebhook(lead, {
      destinations: [
        { name: "odoo", url: "https://odoo.example.test" },
        { name: "generic", url: "https://hooks.example.test" }
      ],
      fetcher: async (url) => {
        calls.push(String(url));
        return calls.length === 1 ? new Response("bad", { status: 500 }) : okResponse();
      }
    });

    expect(result.ok && result.destination).toBe("generic");
    expect(calls).toHaveLength(2);
  });

  it("returns failure for webhook timeout", async () => {
    const result = await deliverLeadToWebhook(lead, {
      destinations: [{ name: "odoo", url: "https://odoo.example.test" }],
      timeoutMs: 1,
      fetcher: async (_url, init) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("aborted", "AbortError"));
          });
        })
    });

    expect(result).toEqual({ ok: false, failureReason: "Webhook timed out." });
  });

  it("returns safe failure for webhook 500", async () => {
    const result = await deliverLeadToWebhook(lead, {
      destinations: [{ name: "odoo", url: "https://odoo.example.test" }],
      fetcher: async () => new Response("bad", { status: 500 })
    });

    expect(result).toEqual({ ok: false, failureReason: "Webhook HTTP 500" });
  });

  it("keeps the lead queued when both destinations are unavailable", async () => {
    const result = await deliverLeadToWebhook(lead, {
      destinations: [],
      fetcher: async () => okResponse()
    });

    expect(result).toEqual({
      ok: false,
      failureReason: "No lead webhook destination configured."
    });
  });

  it("sends the public reference as an idempotency key", async () => {
    let headers: HeadersInit | undefined;
    await deliverLeadToWebhook(lead, {
      destinations: [{ name: "odoo", url: "https://odoo.example.test", secret: "secret" }],
      fetcher: async (_url, init) => {
        headers = init?.headers;
        return okResponse();
      }
    });

    expect(headers).toMatchObject({
      "idempotency-key": "BTI-A7F29C",
      "x-bti-lead-reference": "BTI-A7F29C"
    });
  });
});
