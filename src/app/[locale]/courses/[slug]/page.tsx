import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { LeadForm } from "@/components/forms/lead-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { courses, getCourseBySlug } from "@/content/courses";
import { siteConfig } from "@/config/site";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { breadcrumbSchema, courseSchema, faqSchema } from "@/lib/schema";
import { localizedMetadata } from "@/lib/metadata";
import type { Course } from "@/types/course";
import { getEnabledLocales, isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return getEnabledLocales().flatMap((locale) =>
    courses.map((course) => ({ locale, slug: course.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  const course = getCourseBySlug(slug);

  if (!course) {
    return localizedMetadata({
      locale,
      title: "Course Not Found",
      description: "This BTI course page could not be found."
    });
  }

  return localizedMetadata({
    locale,
    path: `/courses/${course.slug}`,
    title: course.seoTitle,
    description: course.seoDescription
  });
}

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const course = getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const relatedCourses = course.relatedCourseSlugs
    .map(getCourseBySlug)
    .filter((related): related is Course => Boolean(related));
  const courseUrl = `${siteConfig.siteUrl}/${locale}/courses/${course.slug}`;

  return (
    <>
      <JsonLd data={courseSchema(course, locale)} />
      <JsonLd data={faqSchema(course.faq)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${siteConfig.siteUrl}/${locale}` },
          { name: "Courses", url: `${siteConfig.siteUrl}/${locale}/courses` },
          { name: course.title, url: courseUrl }
        ])}
      />
      <section className="bg-[var(--brand-soft)] py-14">
        <div className="container-page">
          <nav className="mb-6 text-sm font-bold text-[var(--brand-muted)]" aria-label="Breadcrumb">
            <Link href={localizePath(locale)}>Home</Link>
            <span className="mx-2">/</span>
            <Link href={localizePath(locale, "/courses")}>Courses</Link>
            <span className="mx-2">/</span>
            <span>{course.category}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <Badge>{course.category}</Badge>
              <h1 className="page-title text-balance mt-5">
                {course.title}
              </h1>
              <p className="body-large mt-5">
                {course.overview}
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={localizePath(locale, `/contact?course=${course.slug}`)}>
                  Speak to Admissions
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`I would like to ask about ${course.title}.`)}`}
                  variant="ghost"
                >
                  <MessageCircle size={18} />
                  WhatsApp About This Course
                </ButtonLink>
              </div>
            </div>
            <aside className="featured-card rounded-lg p-5">
              <h2 className="card-title text-xl">
                Course information
              </h2>
              <dl className="mt-4 grid gap-4 text-sm">
                <div>
                  <dt className="font-semibold text-[var(--brand-ink)]">Duration</dt>
                  <dd className="mt-1 text-[var(--brand-muted)]">{course.durationText}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--brand-ink)]">Schedule</dt>
                  <dd className="mt-1 text-[var(--brand-muted)]">{course.scheduleText}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--brand-ink)]">Fees</dt>
                  <dd className="mt-1 text-[var(--brand-muted)]">{course.feeText}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--brand-ink)]">Certificate</dt>
                  <dd className="mt-1 text-[var(--brand-muted)]">{course.certificateText}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="grid gap-8">
            <article className="split-panel rounded-lg p-6">
              <h2 className="section-title">
                Programme overview
              </h2>
              <p className="supporting-copy mt-3">
                {course.overview}
              </p>
            </article>
            <article className="compact-card rounded-lg p-6">
              <h2 className="section-title">
                Who this programme may suit
              </h2>
              <ul className="mt-4 grid gap-3">
                {course.audience.map((item) => (
                  <li key={item} className="flex gap-2 text-[var(--brand-muted)]">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="compact-card rounded-lg p-6">
              <h2 className="section-title">
                What learners can work toward
              </h2>
              <ul className="mt-4 grid gap-3">
                {course.outcomes.map((item) => (
                  <li key={item} className="flex gap-2 text-[var(--brand-muted)]">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
            <article className="muted-panel rounded-lg p-6">
              <h2 className="section-title">
                Delivery modes
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.deliveryModes.map((mode) => (
                  <span
                    key={mode}
                    className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-[var(--brand-navy)]"
                  >
                    {mode}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--brand-muted)]">
                Available formats may vary by intake. Speak with admissions for
                the latest schedule, availability, and fee details.
              </p>
            </article>
            <article className="compact-card rounded-lg p-6">
              <h2 className="section-title">
                Course FAQ
              </h2>
              <div className="mt-4 grid gap-4">
                {course.faq.map((item) => (
                  <div key={item.question} className="text-row first:border-t-0 first:pt-0">
                    <h3 className="card-title">
                      {item.question}
                    </h3>
                    <p className="helper-text mt-1">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
          <aside className="grid content-start gap-6">
            <LeadForm
              leadType="course-enquiry"
              locale={locale}
              courseInterest={course.title}
              courseSlug={course.slug}
              compact
              title="Ask admissions about this programme"
              submitLabel="Ask Admissions"
            />
            <article className="muted-panel rounded-lg p-5">
              <h2 className="card-title text-xl">
                Related programmes
              </h2>
              <div className="mt-4 grid gap-2">
                {relatedCourses.map((related) => (
                  <Link
                    key={related.slug}
                    href={localizePath(locale, `/courses/${related.slug}`)}
                    className="rounded-lg border border-[var(--brand-border)] bg-white p-3 text-sm font-semibold text-[var(--brand-navy)] hover:border-[var(--brand-red)]"
                  >
                    {related.title}
                  </Link>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>
    </>
  );
}
