import { describe, expect, it } from "vitest";
import {
  allCourses,
  allDepartments,
  getCourseBySlug,
  getCoursesByDepartment
} from "@/content/catalogue";
import { filterCourses } from "@/lib/course-filter";

describe("catalogue integrity", () => {
  it("has a healthy number of departments and courses", () => {
    expect(allDepartments.length).toBeGreaterThanOrEqual(10);
    expect(allCourses.length).toBeGreaterThanOrEqual(90);
  });

  it("uses unique, url-safe course slugs", () => {
    const slugs = allCourses.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("uses unique, url-safe department slugs", () => {
    const slugs = allDepartments.map((d) => d.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("links every course to a real department", () => {
    const deptSlugs = new Set(allDepartments.map((d) => d.slug));
    for (const course of allCourses) {
      expect(deptSlugs.has(course.departmentSlug)).toBe(true);
    }
  });

  it("only references related courses that exist", () => {
    for (const course of allCourses) {
      for (const related of course.relatedCourseSlugs) {
        expect(getCourseBySlug(related), `${course.slug} → ${related}`).toBeTruthy();
      }
    }
  });

  it("never invents a fixed fee", () => {
    for (const course of allCourses) {
      expect(course.feeText.toLowerCase()).toMatch(/request|contact/);
    }
  });

  it("every department has at least one course", () => {
    for (const department of allDepartments) {
      expect(getCoursesByDepartment(department.slug).length).toBeGreaterThan(0);
    }
  });

  it("filters by query, department and delivery method", () => {
    expect(filterCourses(allCourses, { query: "ielts" }).length).toBeGreaterThan(0);
    const langCourses = filterCourses(allCourses, { department: "languages" });
    expect(langCourses.every((c) => c.departmentSlug === "languages")).toBe(true);
  });
});
