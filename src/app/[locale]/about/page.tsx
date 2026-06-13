import type { Metadata } from "next";
import { CheckCircle2, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { courseCategories } from "@/content/courses";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/about",
    title: "About British Training Institute Sharjah",
    description:
      "Learn about British Training Institute in Sharjah, its training areas, learning-support approach and admissions guidance."
  });
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  return (
    <section className="py-14">
      <div className="container-page grid gap-10">
        <SectionHeading
          as="h1"
          eyebrow="About BTI"
          title="Training support for learners, professionals, and organisations in Sharjah."
          intro="BTI is a Sharjah-based training centre offering English, IELTS preparation and professional training options for learners, parents, professionals and organisations."
        />
        <div className="split-panel grid gap-6 rounded-lg p-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="eyebrow">BTI approach</p>
            <h2 className="section-title mt-3">Clearer guidance before visitors choose a course.</h2>
            <p className="supporting-copy mt-4">
              The website is structured to help visitors understand options,
              ask better questions, and move toward a suitable next step.
            </p>
          </div>
          <div className="grid gap-3">
          {["Practical guidance", "Clear course discovery", "Admissions support"].map((value) => (
            <article key={value} className="compact-card flex items-start gap-3 rounded-lg p-4">
              <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-[var(--brand-green)]" />
              <h3 className="card-title">{value}</h3>
            </article>
          ))}
          </div>
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="muted-panel rounded-lg p-6">
            <h2 className="card-title text-2xl">Training areas</h2>
            <div className="mt-4 grid gap-2">
              {courseCategories.map((category) => (
                <p key={category} className="flex gap-2 text-[var(--brand-muted)]">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                  {category}
                </p>
              ))}
            </div>
          </article>
          <article className="featured-card rounded-lg p-6">
            <MapPin size={30} className="text-[var(--brand-red)]" />
            <h2 className="section-title mt-4">Location</h2>
            <p className="supporting-copy mt-3">
              {siteConfig.businessName} is configured as a {siteConfig.city}
              -based training centre in {siteConfig.area}. Speak with admissions
              for directions and current visit information before travelling.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={localizePath(locale, "/courses")}>Explore Courses</ButtonLink>
              <ButtonLink href={localizePath(locale, "/contact")} variant="secondary">
                Speak with Admissions
              </ButtonLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
