"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import type { Course } from "@/types/course";
import { trackEvent } from "@/lib/analytics";
import { localizePath, type Locale } from "@/lib/locale";

type CourseCardProps = {
  course: Course;
  locale: Locale;
};

export function CourseCard({ course, locale }: CourseCardProps) {
  return (
    <article className="surface flex h-full flex-col rounded-lg p-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[var(--brand-red)]">
        {course.category}
      </p>
      <h2 className="mt-3 text-xl font-extrabold leading-tight text-[var(--brand-navy)]">
        {course.title}
      </h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-[var(--brand-muted)]">
        {course.shortDescription}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {course.audience.slice(0, 2).map((audience) => (
          <span
            key={audience}
            className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-bold text-[var(--brand-muted)]"
          >
            {audience}
          </span>
        ))}
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        <Link
          href={localizePath(locale, `/courses/${course.slug}`)}
          onClick={() => trackEvent("course_card_click", { course: course.slug })}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-navy)] px-3 py-2 text-sm font-extrabold text-white"
        >
          Explore
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <Link
          href={localizePath(locale, `/contact?course=${course.slug}`)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[var(--brand-border)] px-3 py-2 text-sm font-extrabold text-[var(--brand-navy)]"
        >
          Ask
          <MessageCircle size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
