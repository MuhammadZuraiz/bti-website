import type { Metadata } from "next";
import { CheckCircle2, Compass, MapPin, Target } from "lucide-react";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/button-link";
import { OptionalImagePanel } from "@/components/media/optional-image-panel";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatsBand } from "@/components/sections/stats-band";
import { siteConfig } from "@/config/site";
import {
  aboutParagraphs,
  deliveryMethods,
  mission,
  vision,
  whyChoose
} from "@/content/institute";
import { allDepartments } from "@/content/catalogue";
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
      "Established in 2002, British Training Institute is a leading Sharjah provider of professional training, IELTS preparation, Cambridge-affiliated and corporate learning solutions."
  });
}

export default async function AboutPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
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
            eyebrow="About BTI"
            title="Two decades of professional training and language education in the UAE."
            intro="Established in 2002, British Training Institute delivers internationally focused learning for individuals, professionals, and organizations."
          />
        </div>
      </section>

      <StatsBand />

      <section className="py-14">
        <div className="container-page grid gap-10">
          <Reveal className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="grid gap-4">
              {aboutParagraphs.map((paragraph) => (
                <p key={paragraph} className="supporting-copy">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="media-zoom relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--brand-border)] shadow-[var(--shadow-md)]">
              <OptionalImagePanel
                src="/images/about-location.jpg"
                alt="Learners studying at British Training Institute in Sharjah"
                fallbackTitle="Learning at BTI"
                fallbackCopy="A focused environment for individuals, professionals and teams."
              />
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal as="article" className="featured-card rounded-lg p-6">
              <Target size={30} className="text-[var(--brand-red)]" />
              <h2 className="section-title mt-4">Mission</h2>
              <p className="supporting-copy mt-3">{mission}</p>
            </Reveal>
            <Reveal as="article" delay={90} className="featured-card rounded-lg p-6">
              <Compass size={30} className="text-[var(--brand-red)]" />
              <h2 className="section-title mt-4">Vision</h2>
              <p className="supporting-copy mt-3">{vision}</p>
            </Reveal>
          </div>

          <div>
            <h2 className="section-title">Why choose British Training Institute</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {whyChoose.map((item) => (
                <p key={item} className="flex gap-2.5 text-[var(--brand-ink)]">
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                  <span className="font-semibold">{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="muted-panel rounded-lg p-6">
              <h2 className="card-title text-2xl">Training areas</h2>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {allDepartments.map((department) => (
                  <p key={department.slug} className="flex gap-2 text-[var(--brand-muted)]">
                    <CheckCircle2 size={18} className="mt-1 shrink-0 text-[var(--brand-green)]" />
                    {department.name}
                  </p>
                ))}
              </div>
              <h3 className="card-title mt-6">Delivery methods</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {deliveryMethods.map((method) => (
                  <span
                    key={method}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--brand-navy)]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </article>
            <article className="featured-card rounded-lg p-6">
              <MapPin size={30} className="text-[var(--brand-red)]" />
              <h2 className="section-title mt-4">Visit BTI</h2>
              <p className="supporting-copy mt-3">{siteConfig.address}</p>
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
    </>
  );
}
