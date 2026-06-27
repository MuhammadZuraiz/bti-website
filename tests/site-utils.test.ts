import { describe, expect, it } from "vitest";
import { resources } from "@/content/resources";
import {
  getPublishedLegalPages,
  hasValidMapUrl,
  hasValidSocialUrl,
  isLegalPagePublished,
  isResourcePublished,
  isValidExternalUrl
} from "@/lib/site-utils";

describe("site safety utilities", () => {
  it("rejects hash and empty URLs", () => {
    expect(isValidExternalUrl("#")).toBe(false);
    expect(isValidExternalUrl("")).toBe(false);
    expect(isValidExternalUrl("https://example.org")).toBe(true);
  });

  it("does not publish resource downloads without real URLs", () => {
    expect(resources.some((resource) => resource.fileUrl === "#")).toBe(false);
    expect(resources.every((resource) => !isResourcePublished(resource))).toBe(true);
  });

  it("treats empty/invalid URLs as not displayable", () => {
    expect(hasValidSocialUrl("")).toBe(false);
    expect(hasValidSocialUrl("#")).toBe(false);
  });

  it("shows the configured map link", () => {
    // BTI confirmed the Google Maps link.
    expect(hasValidMapUrl()).toBe(true);
  });

  it("publishes only approved legal pages", () => {
    expect(isLegalPagePublished("privacy")).toBe(false);
    expect(isLegalPagePublished("accessibility")).toBe(true);
    expect(getPublishedLegalPages()).toEqual(["accessibility"]);
  });
});
