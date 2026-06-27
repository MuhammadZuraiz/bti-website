import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseCard } from "@/components/courses/course-card";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  allDepartments,
  getCoursesByDepartment,
  getDepartmentBySlug
} from "@/content/catalogue";
import { siteConfig } from "@/config/site";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { getEnabledLocales, isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string; department: string }>;

export function generateStaticParams() {
  return getEnabledLocales().flatMap((locale) =>
    allDepartments.map((department) => ({ locale, department: department.slug }))
  );
}

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale: rawLocale, department: slug } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  const department = getDepartmentBySlug(slug);
  if (!department) {
    return {};
  }
  return localizedMetadata({
    locale,
    path: `/courses/${department.slug}`,
    title: department.seoTitle,
    description: department.seoDescription
  });
}

export default async function DepartmentPage({ params }: { params: Params }) {
  const { locale: rawLocale, department: slug } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const department = getDepartmentBySlug(slug);
  if (!department) {
    notFound();
  }

  const courses = getCoursesByDepartment(department.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${siteConfig.siteUrl}/${locale}` },
          { name: "Courses", url: `${siteConfig.siteUrl}/${locale}/courses` },
          {
            name: department.name,
            url: `${siteConfig.siteUrl}/${locale}/courses/${department.slug}`
          }
        ])}
      />

      <section className="hero-surface py-14">
        <div className="container-page">
          <nav className="mb-6 text-sm font-bold text-[var(--brand-muted)]" aria-label="Breadcrumb">
            <Link href={localizePath(locale)}>Home</Link>
            <span className="mx-2">/</span>
            <Link href={localizePath(locale, "/courses")}>Courses</Link>
            <span className="mx-2">/</span>
            <span>{department.name}</span>
          </nav>
          <SectionHeading as="h1" eyebrow="Department" title={department.title} intro={department.overview} />
        </div>
      </section>

      <section className="py-14">
        <div className="container-page">
          <h2 className="section-title">
            Courses in {department.name} ({courses.length})
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.slug}
                course={course}
                locale={locale}
                departmentName={department.name}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
