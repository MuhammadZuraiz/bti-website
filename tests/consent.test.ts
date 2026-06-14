import { describe, expect, it } from "vitest";
import { shouldLoadAnalytics, shouldShowConsentBanner } from "@/lib/consent";

describe("analytics consent gating", () => {
  it("never loads analytics without a measurement ID (default state)", () => {
    expect(
      shouldLoadAnalytics({ requireConsent: false, consent: "granted" })
    ).toBe(false);
    expect(
      shouldShowConsentBanner({ requireConsent: true, consent: "unset" })
    ).toBe(false);
  });

  it("loads analytics immediately when consent is not required", () => {
    expect(
      shouldLoadAnalytics({ measurementId: "G-X", requireConsent: false, consent: "unset" })
    ).toBe(true);
    expect(
      shouldShowConsentBanner({ measurementId: "G-X", requireConsent: false, consent: "unset" })
    ).toBe(false);
  });

  it("requires granted consent before loading when consent is required", () => {
    const base = { measurementId: "G-X", requireConsent: true } as const;
    expect(shouldLoadAnalytics({ ...base, consent: "unset" })).toBe(false);
    expect(shouldLoadAnalytics({ ...base, consent: "denied" })).toBe(false);
    expect(shouldLoadAnalytics({ ...base, consent: "granted" })).toBe(true);
  });

  it("shows the banner only while consent is undecided", () => {
    const base = { measurementId: "G-X", requireConsent: true } as const;
    expect(shouldShowConsentBanner({ ...base, consent: "unset" })).toBe(true);
    expect(shouldShowConsentBanner({ ...base, consent: "granted" })).toBe(false);
    expect(shouldShowConsentBanner({ ...base, consent: "denied" })).toBe(false);
  });
});
