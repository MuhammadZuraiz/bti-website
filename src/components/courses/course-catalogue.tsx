"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { filterCourses, getCourseFilterOptions, type CourseFilters } from "@/lib/course-filter";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/locale";
import type { Course } from "@/types/course";

type Props = {
  courses: Course[];
  locale: Locale;
  initialFilters: CourseFilters;
};

export function CourseCatalogue({ courses, locale, initialFilters }: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState<CourseFilters>(initialFilters);
  const options = useMemo(() => getCourseFilterOptions(courses), [courses]);
  const filteredCourses = useMemo(
    () => filterCourses(courses, filters),
    [courses, filters]
  );

  function updateFilter(key: keyof CourseFilters, value: string) {
    const next = { ...filters, [key]: value || undefined };
    setFilters(next);
    const params = new URLSearchParams();
    Object.entries(next).forEach(([paramKey, paramValue]) => {
      if (paramValue) {
        params.set(paramKey, paramValue);
      }
    });
    trackEvent("course_filter_use", { key, value });
    router.replace(`/${locale}/courses${params.size ? `?${params}` : ""}`, {
      scroll: false
    });
  }

  return (
    <div className="grid gap-8">
      <div className="surface grid gap-4 rounded-lg p-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <label className="field-label">
          Search courses
          <span className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="absolute inset-inline-start-3 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]"
            />
            <input
              className="field-control ps-10"
              value={filters.query ?? ""}
              onChange={(event) => updateFilter("query", event.target.value)}
              placeholder="IELTS, English, accounting..."
            />
          </span>
        </label>
        <label className="field-label">
          Category
          <select
            className="field-control"
            value={filters.category ?? ""}
            onChange={(event) => updateFilter("category", event.target.value)}
          >
            <option value="">All categories</option>
            {options.categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Audience
          <select
            className="field-control"
            value={filters.audience ?? ""}
            onChange={(event) => updateFilter("audience", event.target.value)}
          >
            <option value="">All learners</option>
            {options.audiences.map((audience) => (
              <option key={audience} value={audience}>
                {audience}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Delivery mode
          <select
            className="field-control"
            value={filters.deliveryMode ?? ""}
            onChange={(event) => updateFilter("deliveryMode", event.target.value)}
          >
            <option value="">All modes</option>
            {options.deliveryModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredCourses.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.slug} course={course} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="surface rounded-lg p-8 text-center">
          <h2 className="text-2xl font-extrabold text-[var(--brand-navy)]">
            We could not find an exact match.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--brand-muted)]">
            Speak with admissions and tell us what you want to learn.
          </p>
          <a
            href={`/${locale}/contact`}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-lg bg-[var(--brand-red)] px-4 py-2 text-sm font-extrabold text-white"
          >
            Ask About a Course
          </a>
        </div>
      )}
    </div>
  );
}
