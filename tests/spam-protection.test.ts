import { describe, expect, it } from "vitest";
import { hashIdentifier } from "@/lib/server/lead-security";
import {
  protectLeadSubmission,
  type RateLimitStore
} from "@/services/spam-protection";

const lead = {
  leadType: "general-enquiry",
  fullName: "Sample Learner",
  phone: "+971500000000",
  preferredContactMethod: "phone",
  message: "Please contact me.",
  consent: true,
  locale: "en",
  sourcePage: "/en/contact",
  turnstileToken: "token"
} as const;

const request = new Request("https://bti.example/en/contact", {
  headers: { "x-forwarded-for": "203.0.113.10" }
});

function storeWithCounts(counts: Record<string, number> = {}): RateLimitStore {
  return {
    async increment(key) {
      const match = Object.entries(counts).find(([prefix]) => key.includes(prefix));
      return match?.[1] ?? 1;
    }
  };
}

describe("spam protection", () => {
  it("accepts Turnstile success", async () => {
    const result = await protectLeadSubmission({
      lead,
      request,
      env: { TURNSTILE_SECRET_KEY: "secret" },
      store: storeWithCounts(),
      fetcher: async () => Response.json({ success: true })
    });

    expect(result.ok).toBe(true);
  });

  it("rejects Turnstile failure", async () => {
    const result = await protectLeadSubmission({
      lead,
      request,
      env: { TURNSTILE_SECRET_KEY: "secret" },
      store: storeWithCounts(),
      fetcher: async () => Response.json({ success: false })
    });

    expect(result).toMatchObject({ ok: false, reason: "turnstile" });
  });

  it("rejects rate limit overage", async () => {
    const result = await protectLeadSubmission({
      lead,
      request,
      env: {},
      store: storeWithCounts({ "lead:ip10": 6 })
    });

    expect(result).toMatchObject({ ok: false, reason: "rate-limit" });
  });

  it("rejects duplicate submissions", async () => {
    const result = await protectLeadSubmission({
      lead,
      request,
      env: {},
      store: storeWithCounts({ "lead:duplicate": 2 })
    });

    expect(result).toMatchObject({ ok: false, reason: "duplicate" });
  });

  it("hashes identifiers without storing the raw value", () => {
    const first = hashIdentifier("learner@example.com", "salt");
    const second = hashIdentifier("learner@example.com", "salt");

    expect(first).toBe(second);
    expect(first).not.toContain("learner@example.com");
  });
});
