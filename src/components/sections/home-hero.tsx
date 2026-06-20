import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { HeroCourseCards } from "@/components/sections/hero-course-cards";
import { homeMarketing } from "@/content/institute";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";

type HomeHeroProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

// Dark, navy-dominant hero. Decorative animated mesh/blobs sit behind the
// content (aria-hidden, pointer-events:none) and the global reduced-motion
// guard freezes them. The headline is the page's single <h1>.
export function HomeHero({ locale, dictionary }: HomeHeroProps) {
  const { home } = dictionary;

  return (
    <section className="band-hero relative isolate overflow-hidden">
      {/* Decorative animated background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-mesh" />
        <div
          className="hero-blob h-72 w-72"
          style={{
            top: "-4rem",
            right: "8%",
            background: "rgba(47, 98, 240, 0.32)"
          }}
        />
        <div
          className="hero-blob h-80 w-80"
          style={{
            bottom: "-6rem",
            left: "6%",
            background: "rgba(224, 41, 74, 0.2)",
            animationDelay: "2s"
          }}
        />
      </div>

      <div className="container-page relative grid min-h-[calc(100vh-80px)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div className="hero-reveal">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/85 backdrop-blur">
            {homeMarketing.hero.badge}
          </span>
          <h1 className="hero-title display-title on-dark text-balance mt-5">
            {home.headline}
          </h1>
          <p className="body-large on-dark-muted mt-5 max-w-2xl">{home.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localizePath(locale, "/courses")}>
              {dictionary.common.findCourse}
              <ArrowRight size={18} className="rtl-flip" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink
              href={localizePath(locale, "/contact")}
              variant="secondary"
            >
              {dictionary.common.speakAdmissions}
            </ButtonLink>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            {homeMarketing.hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-3xl font-black tracking-tight text-white">
                  {stat.value}
                  <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.1em] text-white/60">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroCourseCards />
      </div>
    </section>
  );
}
