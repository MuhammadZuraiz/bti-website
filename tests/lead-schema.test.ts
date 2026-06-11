import { describe, expect, it } from "vitest";
import { leadPayloadSchema } from "@/lib/lead-schema";

const validLead = {
  leadType: "general-enquiry",
  fullName: "Sample Learner",
  phone: "+971500000000",
  email: "learner@example.com",
  preferredContactMethod: "phone",
  consent: true,
  locale: "en",
  sourcePage: "/en/contact"
} as const;

describe("lead validation", () => {
  it("accepts a valid lead", () => {
    expect(leadPayloadSchema.safeParse(validLead).success).toBe(true);
  });

  it("rejects missing consent", () => {
    const result = leadPayloadSchema.safeParse({
      ...validLead,
      consent: false
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot submissions", () => {
    const result = leadPayloadSchema.safeParse({
      ...validLead,
      website: "bot"
    });
    expect(result.success).toBe(false);
  });
});
