"use client";

import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { allCourses, allDepartments } from "@/content/catalogue";
import { homeMarketing } from "@/content/institute";
import { filterCourses } from "@/lib/course-filter";
import { localizePath, type Locale } from "@/lib/locale";

type CourseExplorerProps = {
  locale: Locale;
  title: string;
  intro: string;
};

const MAX_RESULTS = 6;

const departmentNames = new Map(
  allDepartments.map((department) => [department.slug, department.name])
);

// Client-side course finder: keyword search + single-department filter over the
// real catalogue, mirroring lib/course-filter. Results are capped; a link routes
// to the full /courses listing for everything else.
export function CourseExplorer({ locale, title, intro }: CourseExplorerProps) {
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<string | undefined>(undefined);
  const { explorer } = homeMarketing;

  const matches = useMemo(
    () => filterCourses(allCourses, { query, department }),
    [query, department]
  );
  const visible = matches.slice(0, MAX_RESULTS);

  return (
    <section className="py-16">
      <div className="container-page">
        <p className="eyebrow mb-3">{explorer.eyebrow}</p>
        <div className="max-w-3xl">
          <h2 className="section-title text-balance">{title}</h2>
          <p className="body-large mt-4">{intro}</p>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <label className="relative block">
            <span className="sr-only">{explorer.searchPlaceholder}</span>
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-[var(--brand-muted)]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={explorer.searchPlaceholder}
              className="field-control !ps-11"
            />
          </label>

          <div className="flex flex-wrap gap-2" role="group" aria-label={explorer.allLabel}>
            <Chip
              active={department === undefined}
              onClick={() => setDepartment(undefined)}
            >
              {explorer.allLabel}
            </Chip>
            {allDepartments.map((item) => (
              <Chip
                key={item.slug}
                active={department === item.slug}
                onClick={() => setDepartment(item.slug)}
              >
                {item.name}
              </Chip>
            ))}
          </div>
        </div>

        {visible.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visible.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                locale={locale}
                departmentName={departmentNames.get(course.departmentSlug)}
              />
            ))}
          </div>
        ) : (
          <div className="muted-panel mt-8 rounded-lg p-8 text-center">
            <p className="card-title">{explorer.emptyTitle}</p>
            <p className="supporting-copy mx-auto mt-2 max-w-md">
              {explorer.emptyCopy}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
          <p className="meta-label" aria-live="polite">
            {matches.length} {matches.length === 1 ? "course" : "courses"}
          </p>
          <Link
            href={localizePath(locale, "/courses")}
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--brand-red)] hover:text-[var(--brand-red-dark)]"
          >
            {explorer.viewAllLabel}
            <ArrowRight size={16} className="rtl-flip" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Chip({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-9 items-center rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
        active
          ? "border-[var(--brand-red)] bg-[var(--brand-red)] text-white"
          : "border-[var(--brand-border)] bg-white text-[var(--brand-navy)] hover:border-[var(--brand-red)]"
      }`}
    >
      {children}
    </button>
  );
}
