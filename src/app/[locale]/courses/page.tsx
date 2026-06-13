import type { Metadata } from "next";
import { CourseCatalogue } from "@/components/courses/course-catalogue";
import { SectionHeading } from "@/components/ui/section-heading";
import { courses } from "@/content/courses";
import { isLocale, type Locale } from "@/lib/locale";
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
    title: "Courses in Sharjah | British Training Institute",
    description:
      "Search English, IELTS, business, accounting, HR, computer and professional courses at British Training Institute in Sharjah."
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
    <section className="py-14">
      <div className="container-page grid gap-8">
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <SectionHeading
            as="h1"
            eyebrow="Course catalogue"
            title="Compare training options in Sharjah."
            intro="Search by category, learner type, delivery mode, or topic. Speak with admissions for current schedules, availability and fee details."
          />
          <div className="muted-panel rounded-lg p-5">
            <p className="helper-text">
              Course details, schedules, fees, and available formats should be
              confirmed with admissions before enrolment.
            </p>
          </div>
        </div>
        <CourseCatalogue
          courses={courses}
          locale={locale}
          initialFilters={{
            category: asString(resolvedSearchParams.category),
            audience: asString(resolvedSearchParams.audience),
            deliveryMode: asString(resolvedSearchParams.deliveryMode),
            query: asString(resolvedSearchParams.query)
          }}
        />
      </div>
    </section>
  );
}
