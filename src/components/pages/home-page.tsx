import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AdmissionsJourney } from "@/components/sections/admissions-journey";
import { CorporateBand } from "@/components/sections/corporate-band";
import { CourseExplorer } from "@/components/sections/course-explorer";
import { CourseTicker } from "@/components/sections/course-ticker";
import { CredentialBar } from "@/components/sections/credential-bar";
import { FinalCta } from "@/components/sections/final-cta";
import { HomeFaq } from "@/components/sections/home-faq";
import { HomeHero } from "@/components/sections/home-hero";
import { PlacementCta } from "@/components/sections/placement-cta";
import { StatsBand } from "@/components/sections/stats-band";
import { Testimonials } from "@/components/sections/testimonials";
import { ResourceGrid } from "@/components/resources/resource-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { resources } from "@/content/resources";
import { homeFaq } from "@/content/home-faq";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";
import {
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  websiteSchema
} from "@/lib/schema";

type HomePageProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

// Homepage = a composition of presentational sections. Data and CTAs come from
// existing content/config sources; the four JSON-LD blocks and the shared
// homeFaq source are preserved for SEO.
export function HomePage({ locale, dictionary }: HomePageProps) {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={localBusinessSchema()} />
      <JsonLd data={websiteSchema(locale)} />
      <JsonLd data={faqSchema(homeFaq)} />

      <HomeHero locale={locale} dictionary={dictionary} />
      <CredentialBar />
      <CourseTicker />
      <StatsBand />
      <CourseExplorer
        locale={locale}
        title={dictionary.home.coursesTitle}
        intro={dictionary.home.coursesIntro}
      />
      <CorporateBand locale={locale} dictionary={dictionary} />
      <PlacementCta locale={locale} dictionary={dictionary} />
      <AdmissionsJourney locale={locale} dictionary={dictionary} />
      <Testimonials />

      <section className="bg-white py-16">
        <div className="container-page">
          <SectionHeading title={dictionary.home.resourcesTitle} />
          <div className="mt-8">
            <ResourceGrid resources={resources.slice(0, 3)} locale={locale} />
          </div>
          <Link
            href={localizePath(locale, "/resources")}
            className="mt-8 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--brand-red)] hover:text-[var(--brand-red-dark)]"
          >
            View all resources
            <ArrowRight size={16} className="rtl-flip" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <HomeFaq
        locale={locale}
        title={dictionary.home.faqTitle}
        viewAllLabel="View full FAQ"
      />
      <FinalCta locale={locale} dictionary={dictionary} />
    </>
  );
}
