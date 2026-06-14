import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { legalPageContent } from "@/content/legal";
import { buildSitemap } from "@/lib/seo";
import { getPublishedLegalPages, isLegalPagePublished } from "@/lib/site-utils";

describe("legal content", () => {
  it("has draft copy ready for review but keeps privacy/cookies/terms gated", () => {
    // Copy exists (so BTI has something to review)...
    expect(legalPageContent.privacy.sections.length).toBeGreaterThan(0);
    expect(legalPageContent.cookies.sections.length).toBeGreaterThan(0);
    expect(legalPageContent.terms.sections.length).toBeGreaterThan(0);

    // ...but the pages are not published, so they must not be exposed.
    expect(isLegalPagePublished("privacy")).toBe(false);
    expect(isLegalPagePublished("cookies")).toBe(false);
    expect(isLegalPagePublished("terms")).toBe(false);
    expect(isLegalPagePublished("accessibility")).toBe(true);
  });

  it("excludes draft legal pages from the production sitemap", () => {
    const urls = buildSitemap("production").map((entry) => entry.url);
    expect(urls).not.toContain(`${siteConfig.siteUrl}/en/privacy`);
    expect(urls).not.toContain(`${siteConfig.siteUrl}/en/cookies`);
    expect(urls).not.toContain(`${siteConfig.siteUrl}/en/terms`);
    expect(urls).toContain(`${siteConfig.siteUrl}/en/accessibility`);
  });

  it("never renders developer-facing wording in published-capable copy", () => {
    const allCopy = JSON.stringify(legalPageContent).toLowerCase();
    for (const banned of [
      "placeholder",
      "draft",
      "todo",
      "lorem",
      "awaiting approval",
      "tbd"
    ]) {
      expect(allCopy).not.toContain(banned);
    }
  });

  it("getPublishedLegalPages returns only accessibility for now", () => {
    expect(getPublishedLegalPages()).toEqual(["accessibility"]);
  });
});
