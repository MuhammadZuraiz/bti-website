import { describe, expect, it } from "vitest";
import { courses } from "@/content/courses";
import { filterCourses } from "@/lib/course-filter";

describe("course data", () => {
  it("contains the required initial course pages", () => {
    expect(courses).toHaveLength(8);
    expect(courses.map((course) => course.slug)).toContain(
      "ielts-preparation-course-sharjah"
    );
  });

  it("keeps course details admissions-ready without invented fixed fees", () => {
    for (const course of courses) {
      expect(course.slug).toMatch(/^[a-z0-9-]+$/);
      expect(course.title).toBeTruthy();
      expect(course.feeText?.toLowerCase()).toContain("contact");
      expect(course.faq.length).toBeGreaterThan(0);
    }
  });

  it("filters by search, category, audience and delivery mode", () => {
    expect(filterCourses(courses, { query: "ielts" })).toHaveLength(1);
    expect(
      filterCourses(courses, {
        category: "Accounting & Finance",
        audience: "Finance staff",
        deliveryMode: "Workshop"
      })[0]?.slug
    ).toBe("accounting-finance-courses-sharjah");
  });
});
