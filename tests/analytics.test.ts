import { describe, expect, it } from "vitest";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

describe("analytics helper", () => {
  it("contains required conversion events", () => {
    expect(analyticsEvents).toContain("course_card_click");
    expect(analyticsEvents).toContain("corporate_enquiry_confirmed");
    expect(analyticsEvents).toContain("lead_submission_failed");
    expect(analyticsEvents).toContain("map_directions_click");
  });

  it("does nothing safely when analytics is unavailable", () => {
    expect(() => trackEvent("phone_click")).not.toThrow();
  });
});
