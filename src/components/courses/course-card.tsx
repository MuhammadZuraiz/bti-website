"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import Image from "next/image";
import { ContextLink } from "@/components/conversion/context-link";
import { ButtonLink } from "@/components/ui/button-link";
import { courseHref } from "@/content/catalogue";
import { resolveCourseImage } from "@/config/media";
import type { Course } from "@/types/catalogue";
import { localizePath, type Locale } from "@/lib/locale";

type CourseCardProps = {
  course: Course;
  locale: Locale;
  /** Optional department label shown as the card eyebrow. */
  departmentName?: string;
};

// Accent palette for the color-varied "bento" card edge. Used only on the
// border + eyebrow (decorative), so body text keeps its AA-compliant colors.
const ACCENTS = [
  "var(--brand-red)",
  "var(--brand-blue)",
  "var(--brand-navy)",
  "var(--brand-green)",
  "var(--brand-gold)"
];

function accentFor(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return ACCENTS[hash % ACCENTS.length];
}

export function CourseCard({ course, locale, departmentName }: CourseCardProps) {
  const courseImage = resolveCourseImage(course);
  const accent = accentFor(course.slug);
  return (
    <article
      className="compact-card flex h-full flex-col rounded-lg p-5 transition hover:-translate-y-0.5"
      style={{ borderInlineStartWidth: 4, borderInlineStartColor: accent }}
    >
      {courseImage ? (
        <Image
          src={courseImage.src}
          alt={courseImage.alt}
          width={480}
          height={300}
          className="mb-4 h-36 w-full rounded-lg object-cover"
        />
      ) : null}
      {departmentName ? (
        <p className="meta-label text-[var(--brand-red)]">{departmentName}</p>
      ) : null}
      <h2 className="card-title mt-2">{course.title}</h2>
      <p className="helper-text mt-3 flex-1">{course.shortDescription}</p>
      <div className="mt-5 grid gap-2">
        <ButtonLink
          href={localizePath(locale, courseHref(course))}
          variant="dark"
        >
          View Course
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
