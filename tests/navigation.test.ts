import { describe, expect, it } from "vitest";
import { courses } from "@/content/courses";
import { locales } from "@/lib/locale";

describe("navigation basics", () => {
  it("has localized course routes for every course", () => {
    const routes = locales.flatMap((locale) =>
      courses.map((course) => `/${locale}/courses/${course.slug}`)
    );
    expect(routes).toContain("/en/courses/english-language-courses-sharjah");
    expect(routes).toContain("/ar/courses/ielts-preparation-course-sharjah");
  });
});
