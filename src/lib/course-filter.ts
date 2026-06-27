import type { Course } from "@/types/catalogue";

export type CourseFilters = {
  department?: string;
  deliveryMethod?: string;
  query?: string;
};

export function filterCourses(courses: Course[], filters: CourseFilters) {
  const query = filters.query?.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesDepartment =
      !filters.department || course.departmentSlug === filters.department;
    const matchesMode =
      !filters.deliveryMethod ||
      course.deliveryMethods.includes(filters.deliveryMethod);
    const matchesQuery =
      !query ||
      [course.title, course.shortDescription, course.overview]
        .join(" ")
        .toLowerCase()
        .includes(query);

    return matchesDepartment && matchesMode && matchesQuery;
  });
}

export function getDeliveryMethodOptions(courses: Course[]) {
  return Array.from(new Set(courses.flatMap((course) => course.deliveryMethods)));
}
