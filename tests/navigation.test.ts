import { describe, expect, it } from "vitest";
import { courses } from "@/content/courses";
import { getEnabledLocales } from "@/lib/site-utils";

describe("navigation basics", () => {
  it("has localized course routes for every course", () => {
    const routes = getEnabledLocales().flatMap((locale) =>
      courses.map((course) => `/${locale}/courses/${course.slug}`)
    );
    expect(routes).toContain("/en/courses/english-language-courses-sharjah");
    expect(routes).not.toContain("/ar/courses/ielts-preparation-course-sharjah");
  });
});
