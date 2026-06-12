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

  it("hides map and social links when URLs are invalid", () => {
    expect(hasValidMapUrl()).toBe(false);
    expect(hasValidSocialUrl("")).toBe(false);
  });

  it("publishes only approved legal pages", () => {
    expect(isLegalPagePublished("privacy")).toBe(false);
    expect(isLegalPagePublished("accessibility")).toBe(true);
    expect(getPublishedLegalPages()).toEqual(["accessibility"]);
  });
});
