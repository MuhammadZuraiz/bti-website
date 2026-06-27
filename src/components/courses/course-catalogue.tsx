"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { ButtonLink } from "@/components/ui/button-link";
import {
  filterCourses,
  getDeliveryMethodOptions,
  type CourseFilters
} from "@/lib/course-filter";
import { trackEvent } from "@/lib/analytics";
import type { Locale } from "@/lib/locale";
import type { Course, Department } from "@/types/catalogue";

type Props = {
  courses: Course[];
  departments: Department[];
  locale: Locale;
  initialFilters: CourseFilters;
};

export function CourseCatalogue({ courses, departments, locale, initialFilters }: Props) {
  const router = useRouter();
  const [filters, setFilters] = useState<CourseFilters>(initialFilters);
  const deliveryMethods = useMemo(() => getDeliveryMethodOptions(courses), [courses]);
  const departmentName = useMemo(
    () => new Map(departments.map((d) => [d.slug, d.name])),
    [departments]
  );
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
      <div className="split-panel grid gap-4 rounded-lg p-4 lg:grid-cols-[1.4fr_1fr_1fr]">
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
              placeholder="IELTS, PMP, AutoCAD, Python..."
            />
          </span>
        </label>
        <label className="field-label">
          Department
          <select
            className="field-control"
            value={filters.department ?? ""}
            onChange={(event) => updateFilter("department", event.target.value)}
          >
            <option value="">All departments</option>
            {departments.map((department) => (
              <option key={department.slug} value={department.slug}>
                {department.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-label">
          Delivery method
          <select
            className="field-control"
            value={filters.deliveryMethod ?? ""}
            onChange={(event) => updateFilter("deliveryMethod", event.target.value)}
          >
            <option value="">All methods</option>
            {deliveryMethods.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="helper-text">
        Showing {filteredCourses.length} course{filteredCourses.length === 1 ? "" : "s"}.
      </p>

      {filteredCourses.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.slug}
              course={course}
              locale={locale}
              departmentName={departmentName.get(course.departmentSlug)}
            />
          ))}
        </div>
      ) : (
        <div className="muted-panel rounded-lg p-8 text-center">
          <h2 className="section-title">We could not find an exact match.</h2>
          <p className="supporting-copy mx-auto mt-3 max-w-xl">
            Speak with admissions and tell us what you want to learn.
          </p>
          <ButtonLink href={`/${locale}/contact`} className="mt-5">
            Ask About a Course
          </ButtonLink>
        </div>
      )}
    </div>
  );
}
