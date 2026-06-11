import type { Metadata } from "next";
import { CheckCircle2, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { courseCategories } from "@/content/courses";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
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
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  return (
    <section className="py-14">
      <div className="container-page grid gap-10">
        <SectionHeading
          eyebrow="About BTI"
          title="Training support for learners, professionals, and organisations in Sharjah."
          intro="BTI is presented here as a Sharjah-based training centre offering English, IELTS preparation and professional training options. Unverified claims remain disabled until approved."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {["Practical guidance", "Clear course discovery", "Admissions support"].map((value) => (
            <article key={value} className="surface rounded-lg p-6">
              <CheckCircle2 size={28} className="text-[var(--brand-green)]" />
              <h2 className="mt-4 text-xl font-extrabold text-[var(--brand-navy)]">{value}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                The website is structured to help visitors understand options,
                ask better questions, and move toward a suitable next step.
              </p>
            </article>
          ))}
        </div>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="surface rounded-lg p-6">
            <h2 className="text-2xl font-extrabold text-[var(--brand-navy)]">Training areas</h2>
            <div className="mt-4 grid gap-2">
              {courseCategories.map((category) => (
                <p key={category} className="flex gap-2 text-[var(--brand-muted)]">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                  {category}
                </p>
              ))}
            </div>
          </article>
          <article className="surface rounded-lg p-6">
            <MapPin size={30} className="text-[var(--brand-red)]" />
            <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-navy)]">Location</h2>
            <p className="mt-3 leading-7 text-[var(--brand-muted)]">
              {siteConfig.businessName} is configured as a {siteConfig.city}
              -based training centre in {siteConfig.area}. Final address wording,
              opening hours, parking notes, and map URL require business approval.
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
