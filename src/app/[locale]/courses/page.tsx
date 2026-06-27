import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCatalogue } from "@/components/courses/course-catalogue";
import { SectionHeading } from "@/components/ui/section-heading";
import { allCourses, allDepartments, departmentHref, getCoursesByDepartment } from "@/content/catalogue";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { isLocaleEnabled } from "@/lib/site-utils";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/courses",
    title: "Training Courses & Departments in Sharjah | British Training Institute",
    description:
      "Explore 100+ professional and language courses across 11 departments at British Training Institute, Sharjah — IELTS, Cambridge English, PMP, ACCA, AutoCAD, Python and more."
  });
}

function asString(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CoursesPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  return (
    <>
      <section className="hero-surface py-14">
        <div className="container-page">
          <SectionHeading
            as="h1"
            eyebrow="Training catalogue"
            title="Explore our training departments and courses."
            intro="Browse 100+ professional and language courses across 11 departments. Speak with admissions for current schedules, fees and available formats."
          />
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <h2 className="section-title">Departments</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {allDepartments.map((department) => (
              <Link
                key={department.slug}
                href={localizePath(locale, departmentHref(department))}
                className="compact-card group flex h-full flex-col rounded-lg p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand-red)]"
              >
                <h3 className="card-title">{department.name}</h3>
                <p className="helper-text mt-2 flex-1">{department.shortDescription}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-red)]">
                  {getCoursesByDepartment(department.slug).length} courses
                  <ArrowRight size={15} className="rtl-flip" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <h2 className="section-title">Search all courses</h2>
          <p className="supporting-copy mt-2 max-w-2xl">
            Find a specific course across every department.
          </p>
          <div className="mt-8">
            <CourseCatalogue
              courses={allCourses}
              departments={allDepartments}
              locale={locale}
              initialFilters={{
                department: asString(resolvedSearchParams.department),
                deliveryMethod: asString(resolvedSearchParams.deliveryMethod),
                query: asString(resolvedSearchParams.query)
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
