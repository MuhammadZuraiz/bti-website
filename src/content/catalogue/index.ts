import type { Course, Department } from "@/types/catalogue";
import { departments } from "./departments";
import { languagesCourses } from "./languages";
import { businessManagementCourses } from "./business-management";
import { projectManagementCourses } from "./project-management";
import { humanResourcesCourses } from "./human-resources";
import { accountingFinanceCourses } from "./accounting-finance";
import { qualityCourses } from "./quality";
import { engineeringCourses } from "./engineering";
import { engineeringSoftwareCourses } from "./engineering-software";
import { informationTechnologyCourses } from "./information-technology";
import { digitalMarketingCourses } from "./digital-marketing";
import { medicalHealthcareCourses } from "./medical-healthcare";

export const allDepartments: Department[] = [...departments].sort(
  (a, b) => a.order - b.order
);

export const allCourses: Course[] = [
  ...languagesCourses,
  ...businessManagementCourses,
  ...projectManagementCourses,
  ...humanResourcesCourses,
  ...accountingFinanceCourses,
  ...qualityCourses,
  ...engineeringCourses,
  ...engineeringSoftwareCourses,
  ...informationTechnologyCourses,
  ...digitalMarketingCourses,
  ...medicalHealthcareCourses
];

export const featuredDepartments = allDepartments.filter((d) => d.isFeatured);
export const featuredCourses = allCourses.filter((c) => c.isFeatured);

export function getDepartmentBySlug(slug: string): Department | undefined {
  return allDepartments.find((d) => d.slug === slug);
}

export function getCourseBySlug(slug: string): Course | undefined {
  return allCourses.find((c) => c.slug === slug);
}

export function getCoursesByDepartment(departmentSlug: string): Course[] {
  return allCourses.filter((c) => c.departmentSlug === departmentSlug);
}

export function getDepartmentForCourse(course: Course): Department | undefined {
  return getDepartmentBySlug(course.departmentSlug);
}

export function getRelatedCourses(course: Course, limit = 3): Course[] {
  const related = course.relatedCourseSlugs
    .map(getCourseBySlug)
    .filter((c): c is Course => Boolean(c));
  if (related.length >= limit) {
    return related.slice(0, limit);
  }
  // Fill from the same department if not enough explicit relations.
  const sameDept = getCoursesByDepartment(course.departmentSlug).filter(
    (c) => c.slug !== course.slug && !course.relatedCourseSlugs.includes(c.slug)
  );
  return [...related, ...sameDept].slice(0, limit);
}

/** Course URL path (locale-prefixed by the caller via localizePath). */
export function courseHref(course: Course): string {
  return `/courses/${course.departmentSlug}/${course.slug}`;
}

export function departmentHref(department: Department): string {
  return `/courses/${department.slug}`;
}
