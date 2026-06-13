"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { ContextLink } from "@/components/conversion/context-link";
import type { Course } from "@/types/course";
import { trackEvent } from "@/lib/analytics";
import { localizePath, type Locale } from "@/lib/locale";

type CourseCardProps = {
  course: Course;
  locale: Locale;
};

export function CourseCard({ course, locale }: CourseCardProps) {
  return (
    <article className="compact-card flex h-full flex-col rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-[rgba(181,31,54,0.34)]">
      <p className="meta-label text-[var(--brand-red)]">
        {course.category}
      </p>
      <h2 className="card-title mt-3">
        {course.title}
      </h2>
      <p className="helper-text mt-3 flex-1">
        {course.shortDescription}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {course.audience.slice(0, 2).map((audience) => (
          <span
            key={audience}
            className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand-muted)]"
          >
            {audience}
          </span>
        ))}
      </div>
      <div className="mt-5 grid gap-2">
        <Link
          href={localizePath(locale, `/courses/${course.slug}`)}
          onClick={() => trackEvent("course_card_click", { course: course.slug })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-purple)]"
        >
          Explore programme
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <ContextLink
          href={localizePath(locale, `/contact?course=${course.slug}`)}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-[var(--brand-red)] transition hover:bg-[var(--brand-soft)]"
        >
          Ask admissions
          <MessageCircle size={16} aria-hidden="true" />
        </ContextLink>
      </div>
    </article>
  );
}
