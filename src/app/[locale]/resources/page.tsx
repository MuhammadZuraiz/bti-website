import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { resources } from "@/content/resources";
import { isLocale, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/resources",
    title: "BTI Course Guides and Resources",
    description:
      "Download or request British Training Institute course guides, IELTS checklists and corporate training resources."
  });
}

export default async function ResourcesPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  return (
    <section className="py-14">
      <div className="container-page grid gap-8">
        <SectionHeading
          eyebrow="Resources"
          title="Start with a helpful guide."
          intro="Request course guides, IELTS preparation checklists and corporate-training resources from admissions."
        />
        <ResourceGrid resources={resources} locale={locale} />
      </div>
    </section>
  );
}
