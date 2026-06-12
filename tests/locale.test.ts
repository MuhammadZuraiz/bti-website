import { describe, expect, it } from "vitest";
import { getDirection, isLocale, localizePath } from "@/lib/locale";
import { getEnabledLocales, isLocaleEnabled } from "@/lib/site-utils";

describe("locale helpers", () => {
  it("identifies supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });

  it("sets Arabic direction to RTL", () => {
    expect(getDirection("ar")).toBe("rtl");
    expect(getDirection("en")).toBe("ltr");
  });

  it("excludes Arabic from public locales while the review flag is disabled", () => {
    expect(getEnabledLocales()).toEqual(["en"]);
    expect(isLocaleEnabled("ar")).toBe(false);
  });

  it("builds locale-aware routes", () => {
    expect(localizePath("en", "/courses")).toBe("/en/courses");
    expect(localizePath("ar")).toBe("/ar");
  });
});
