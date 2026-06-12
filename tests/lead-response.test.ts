import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isSuccessfulLeadResponse } from "@/lib/lead-response";

describe("lead response handling", () => {
  it("accepts success only when data.ok is true", () => {
    expect(
      isSuccessfulLeadResponse({
        ok: true,
        referenceId: "BTI-A7F29C",
        deliveryStatus: "queued",
        message: "Received"
      })
    ).toBe(true);
    expect(isSuccessfulLeadResponse({ ok: false, error: "Failed" })).toBe(false);
    expect(
      isSuccessfulLeadResponse({
        referenceId: "BTI-A7F29C",
        deliveryStatus: "queued"
      })
    ).toBe(false);
  });

  it("keeps failed submissions from clearing the form", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/forms/lead-form.tsx"),
      "utf8"
    );

    expect(source).toContain("if (!data)");
    expect(source.indexOf("if (!data)")).toBeLessThan(source.indexOf("reset({"));
  });

  it("shows the reference and fallback CTAs in client copy", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/forms/lead-form.tsx"),
      "utf8"
    );

    expect(source).toContain("Reference: {referenceId}");
    expect(source).toContain("Call {siteConfig.landlineDisplay}");
    expect(source).toContain("WhatsApp admissions");
  });

  it("fires analytics only after durable success", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/forms/lead-form.tsx"),
      "utf8"
    );

    expect(source.indexOf("const data = await parseLeadSubmissionResponse")).toBeLessThan(
      source.indexOf("trackEvent(confirmedEventByLeadType")
    );
    expect(source).toContain("lead_submission_failed");
  });
});
