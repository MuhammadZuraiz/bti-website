import { describe, expect, it } from "vitest";
import { leadPayloadSchema } from "@/lib/lead-schema";

const baseLead = {
  fullName: "Sample Learner",
  phone: "+971500000000",
  email: "learner@example.com",
  preferredContactMethod: "phone",
  consent: true,
  locale: "en",
  sourcePage: "/en/contact"
} as const;

describe("lead validation", () => {
  it("accepts a valid general enquiry", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "general-enquiry",
      message: "I want to ask about English courses."
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid course enquiry", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "course-enquiry",
      courseSlug: "ielts-preparation-course-sharjah"
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid placement-test request", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "placement-test-request",
      englishLearningGoal: "Improve speaking for work",
      preferredTime: "Weekday evening"
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid corporate-training enquiry", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "corporate-training-enquiry",
      companyName: "Sharjah Example LLC",
      learnerCount: "12",
      trainingArea: "Business English",
      message: "We need training for our customer-service team."
    });
    expect(result.success).toBe(true);
  });

  it("accepts a valid resource request", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "resource-request",
      resourceSlug: "corporate-training-profile"
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing consent", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "general-enquiry",
      message: "Please contact me.",
      consent: false
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing contact path", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "general-enquiry",
      phone: "",
      email: "",
      message: "Please contact me."
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "general-enquiry",
      email: "not-an-email",
      message: "Please contact me."
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid course slug", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "course-enquiry",
      courseSlug: "made-up-course"
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid resource slug", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "resource-request",
      resourceSlug: "made-up-resource"
    });
    expect(result.success).toBe(false);
  });

  it("rejects oversized messages", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "general-enquiry",
      message: "x".repeat(1201)
    });
    expect(result.success).toBe(false);
  });

  it("rejects honeypot submissions", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "general-enquiry",
      message: "Please contact me.",
      website: "bot"
    });
    expect(result.success).toBe(false);
  });

  it("normalises UAE mobile numbers where possible", () => {
    const result = leadPayloadSchema.safeParse({
      ...baseLead,
      leadType: "general-enquiry",
      phone: "052 608 3950",
      message: "Please contact me."
    });
    expect(result.success && result.data.phone).toBe("+971526083950");
  });
});
