"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { ContextLink } from "@/components/conversion/context-link";
import { ButtonLink } from "@/components/ui/button-link";
import { resolveCourseImage } from "@/config/media";
import type { Course } from "@/types/course";
import { trackEvent } from "@/lib/analytics";
import { localizePath, type Locale } from "@/lib/locale";

type CourseCardProps = {
  course: Course;
  locale: Locale;
};

export function CourseCard({ course, locale }: CourseCardProps) {
  const courseImage = resolveCourseImage(course);
  return (
    <article className="compact-card flex h-full flex-col rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-[rgba(181,31,54,0.34)]">
      {courseImage ? (
        <Image
          src={courseImage.src}
          alt={courseImage.alt}
          width={480}
          height={300}
          className="mb-4 h-36 w-full rounded-lg object-cover"
        />
      ) : null}
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
        <ButtonLink
          href={localizePath(locale, `/courses/${course.slug}`)}
          variant="dark"
          onClick={() => trackEvent("course_card_click", { course: course.slug })}
        >
          Explore programme
          <ArrowUpRight size={16} aria-hidden="true" />
        </ButtonLink>
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
