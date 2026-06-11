import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";

describe("site configuration", () => {
  it("keeps approval-required trust claims disabled by default", () => {
    expect(siteConfig.featureFlags.showSpeaListing).toBe(false);
    expect(siteConfig.featureFlags.showCentreId).toBe(false);
    expect(siteConfig.featureFlags.showIeltsVenueStatement).toBe(false);
    expect(siteConfig.featureFlags.showFoundingYearText).toBe(false);
    expect(siteConfig.featureFlags.showGraduateCount).toBe(false);
    expect(siteConfig.featureFlags.showTestimonials).toBe(false);
    expect(siteConfig.featureFlags.showAccreditationLogos).toBe(false);
    expect(siteConfig.featureFlags.showPartnerLogos).toBe(false);
  });

  it("centralises public contact details", () => {
    expect(siteConfig.businessName).toBe("British Training Institute");
    expect(siteConfig.landlineHref).toMatch(/^tel:/);
    expect(siteConfig.whatsappNumber).toMatch(/^\d+$/);
  });
});
