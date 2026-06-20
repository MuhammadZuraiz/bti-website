import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, GraduationCap, MessageCircle, MonitorPlay } from "lucide-react";
import { LeadForm } from "@/components/forms/lead-form";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { CourseCard } from "@/components/courses/course-card";
import {
  allCourses,
  courseHref,
  getCourseBySlug,
  getDepartmentBySlug,
  getRelatedCourses
} from "@/content/catalogue";
import { resolveCourseImage } from "@/config/media";
import { siteConfig } from "@/config/site";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { breadcrumbSchema, courseSchema } from "@/lib/schema";
import { getEnabledLocales, isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string; department: string; course: string }>;

export function generateStaticParams() {
  return getEnabledLocales().flatMap((locale) =>
    allCourses.map((course) => ({
      locale,
      department: course.departmentSlug,
      course: course.slug
    }))
  );
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale, course: slug } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  const course = getCourseBySlug(slug);
  if (!course) {
    return {};
  }
  return localizedMetadata({
    locale,
    path: courseHref(course),
    title: course.seoTitle,
    description: course.seoDescription
  });
}

export default async function CoursePage({ params }: { params: Params }) {
  const { locale: rawLocale, department: departmentSlug, course: slug } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const course = getCourseBySlug(slug);
  // Guard the department segment so the URL is canonical.
  if (!course || course.departmentSlug !== departmentSlug) {
    notFound();
  }
  const department = getDepartmentBySlug(course.departmentSlug);
  const related = getRelatedCourses(course);
  const image = resolveCourseImage(course);
  const courseUrl = `${siteConfig.siteUrl}/${locale}${courseHref(course)}`;

  return (
    <>
      <JsonLd data={courseSchema(course, locale)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${siteConfig.siteUrl}/${locale}` },
          { name: "Courses", url: `${siteConfig.siteUrl}/${locale}/courses` },
          ...(department
            ? [{ name: department.name, url: `${siteConfig.siteUrl}/${locale}/courses/${department.slug}` }]
            : []),
          { name: course.title, url: courseUrl }
        ])}
      />

      <section className="hero-surface py-14">
        <div className="container-page">
          <nav className="mb-6 text-sm font-bold text-[var(--brand-muted)]" aria-label="Breadcrumb">
            <Link href={localizePath(locale)}>Home</Link>
            <span className="mx-2">/</span>
            <Link href={localizePath(locale, "/courses")}>Courses</Link>
            {department ? (
              <>
                <span className="mx-2">/</span>
                <Link href={localizePath(locale, courseHref(course).replace(`/${course.slug}`, ""))}>
                  {department.name}
                </Link>
              </>
            ) : null}
            <span className="mx-2">/</span>
            <span>{course.title}</span>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              {department ? <Badge>{department.name}</Badge> : null}
              <h1 className="page-title text-balance mt-5">{course.title}</h1>
              <p className="body-large mt-5">{course.overview}</p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={localizePath(locale, `/contact?course=${course.slug}`)}>
                  Register / Enquire
                </ButtonLink>
                <ButtonLink
                  href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(`I would like to ask about the ${course.title} course.`)}`}
                  variant="ghost"
                >
                  <MessageCircle size={18} />
                  WhatsApp About This Course
                </ButtonLink>
              </div>
            </div>
            <aside className="featured-card rounded-lg p-5">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={720}
                  height={400}
                  className="mb-5 h-40 w-full rounded-lg object-cover"
                />
              ) : null}
              <h2 className="card-title text-xl">Course information</h2>
              <dl className="mt-4 grid gap-4 text-sm">
                <div>
                  <dt className="flex items-start gap-3 font-semibold text-[var(--brand-ink)]">
                    <Clock size={18} className="mt-0.5 shrink-0 text-[var(--brand-red)]" />
                    Duration
                  </dt>
                  <dd className="mt-0.5 pl-[30px] text-[var(--brand-muted)]">{course.durationText}</dd>
                </div>
                <div>
                  <dt className="flex items-start gap-3 font-semibold text-[var(--brand-ink)]">
                    <Clock size={18} className="mt-0.5 shrink-0 text-[var(--brand-red)]" />
                    Training hours
                  </dt>
                  <dd className="mt-0.5 pl-[30px] text-[var(--brand-muted)]">{course.trainingHours}</dd>
                </div>
                <div>
                  <dt className="flex items-start gap-3 font-semibold text-[var(--brand-ink)]">
                    <MonitorPlay size={18} className="mt-0.5 shrink-0 text-[var(--brand-red)]" />
                    Delivery
                  </dt>
                  <dd className="mt-0.5 pl-[30px] text-[var(--brand-muted)]">
                    {course.deliveryMethods.join(", ")}
                  </dd>
                </div>
                <div>
                  <dt className="flex items-start gap-3 font-semibold text-[var(--brand-ink)]">
                    <GraduationCap size={18} className="mt-0.5 shrink-0 text-[var(--brand-red)]" />
                    Certification
                  </dt>
                  <dd className="mt-0.5 pl-[30px] text-[var(--brand-muted)]">{course.certificationText}</dd>
                </div>
                <div>
                  <dt className="flex items-start gap-3 font-semibold text-[var(--brand-ink)]">
                    <GraduationCap size={18} className="mt-0.5 shrink-0 text-[var(--brand-red)]" />
                    Fees
                  </dt>
                  <dd className="mt-0.5 pl-[30px] text-[var(--brand-muted)]">{course.feeText}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-10">
            {course.learningOutcomes.length ? (
              <div>
                <h2 className="section-title">What you will learn</h2>
                <ul className="mt-5 grid gap-3">
                  {course.learningOutcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-2.5">
                      <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                      <span className="supporting-copy">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {course.outline.length ? (
              <div>
                <h2 className="section-title">Course outline</h2>
                <ol className="mt-5 grid gap-3">
                  {course.outline.map((item, index) => (
                    <li key={item} className="timeline-item rounded-lg p-4">
                      <span className="meta-label text-[var(--brand-red)]">
                        Module {index + 1}
                      </span>
                      <p className="mt-1 font-semibold text-[var(--brand-navy)]">{item}</p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            {course.targetAudience.length ? (
              <div>
                <h2 className="section-title">Who should attend</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {course.targetAudience.map((audience) => (
                    <span
                      key={audience}
                      className="rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--brand-navy)]"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {course.contentStatus === "outline" ? (
              <div className="muted-panel rounded-lg p-6">
                <h2 className="card-title text-xl">Full course details</h2>
                <p className="supporting-copy mt-2">
                  A detailed outline, schedule, training hours and fees for this
                  course are available from admissions. Send an enquiry and the
                  team will share the full information.
                </p>
              </div>
            ) : null}
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <LeadForm
              leadType="course-enquiry"
              locale={locale}
              title={`Register for ${course.title}`}
              courseInterest={course.title}
              courseSlug={course.slug}
              showCourseInterestField={false}
              submitLabel="Register / Request Information"
            />
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="bg-white py-14">
          <div className="container-page">
            <h2 className="section-title">Related courses</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {related.map((relatedCourse) => (
                <CourseCard
                  key={relatedCourse.slug}
                  course={relatedCourse}
                  locale={locale}
                  departmentName={getDepartmentBySlug(relatedCourse.departmentSlug)?.name}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
