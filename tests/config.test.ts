import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";

describe("site configuration", () => {
  it("keeps logo display and testimonials gated until assets/consent exist", () => {
    // Text claims are BTI-approved; logo IMAGES and testimonials stay off until
    // official files / consent are provided.
    expect(siteConfig.featureFlags.showAccreditationLogos).toBe(false);
    expect(siteConfig.featureFlags.showPartnerLogos).toBe(false);
    expect(siteConfig.featureFlags.showTestimonials).toBe(false);
  });

  it("reflects BTI-confirmed credibility claims", () => {
    expect(siteConfig.featureFlags.showFoundingYearText).toBe(true);
    expect(siteConfig.featureFlags.showKeyStats).toBe(true);
    expect(siteConfig.featureFlags.showIeltsTestCentre).toBe(true);
    expect(siteConfig.featureFlags.showCambridgePartner).toBe(true);
    expect(siteConfig.featureFlags.showIsoCertified).toBe(true);
  });

  it("keeps Arabic gated until translations are reviewed", () => {
    expect(siteConfig.featureFlags.enableArabic).toBe(false);
  });

  it("centralises public contact details", () => {
    expect(siteConfig.businessName).toBe("British Training Institute");
    expect(siteConfig.landlineHref).toMatch(/^tel:/);
    expect(siteConfig.whatsappNumber).toMatch(/^\d+$/);
    expect(siteConfig.email).toBe("info@britishinstitute.ae");
    expect(siteConfig.openingHours.length).toBeGreaterThan(0);
  });
});
