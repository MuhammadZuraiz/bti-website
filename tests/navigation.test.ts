import { describe, expect, it } from "vitest";
import { allCourses, allDepartments, courseHref, departmentHref } from "@/content/catalogue";
import { getEnabledLocales } from "@/lib/site-utils";

describe("navigation basics", () => {
  it("builds localized department routes", () => {
    const routes = getEnabledLocales().flatMap((locale) =>
      allDepartments.map((d) => `/${locale}${departmentHref(d)}`)
    );
    expect(routes).toContain("/en/courses/languages");
    expect(routes).not.toContain("/ar/courses/languages");
  });

  it("builds two-level localized course routes", () => {
    const ielts = allCourses.find((c) => c.slug === "ielts-preparation");
    expect(ielts).toBeTruthy();
    expect(courseHref(ielts!)).toBe("/courses/languages/ielts-preparation");
  });
});
