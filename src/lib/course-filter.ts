import type { Course } from "@/types/course";

export type CourseFilters = {
  category?: string;
  audience?: string;
  deliveryMode?: string;
  query?: string;
};

export function filterCourses(courses: Course[], filters: CourseFilters) {
  const query = filters.query?.trim().toLowerCase();

  return courses.filter((course) => {
    const matchesCategory =
      !filters.category || course.category === filters.category;
    const matchesAudience =
      !filters.audience || course.audience.includes(filters.audience);
    const matchesMode =
      !filters.deliveryMode ||
      course.deliveryModes.includes(filters.deliveryMode);
    const matchesQuery =
      !query ||
      [course.title, course.category, course.shortDescription, course.overview]
        .join(" ")
        .toLowerCase()
        .includes(query);

    return matchesCategory && matchesAudience && matchesMode && matchesQuery;
  });
}

export function getCourseFilterOptions(courses: Course[]) {
  return {
    categories: Array.from(new Set(courses.map((course) => course.category))),
    audiences: Array.from(new Set(courses.flatMap((course) => course.audience))),
    deliveryModes: Array.from(
      new Set(courses.flatMap((course) => course.deliveryModes))
    )
  };
}
