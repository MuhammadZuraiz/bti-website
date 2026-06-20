import { ButtonLink } from "@/components/ui/button-link";
import { homeMarketing } from "@/content/institute";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";

type AdmissionsJourneyProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

// Navy admissions-journey band: three numbered steps with the final step
// highlighted, and a single CTA into /contact.
export function AdmissionsJourney({ locale, dictionary }: AdmissionsJourneyProps) {
  const { journey } = homeMarketing;

  return (
    <section className="section-navy py-16 text-white">
      <div className="container-page grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="eyebrow mb-3 text-[var(--brand-gold-light)]">
            {journey.eyebrow}
          </p>
          <h2 className="section-title on-dark text-balance">
            {dictionary.home.journeyTitle}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/75 md:text-lg">
            {journey.intro}
          </p>
          <ButtonLink
            href={localizePath(locale, "/contact")}
            className="mt-7 hidden lg:inline-flex"
          >
            {dictionary.common.requestGuidance}
          </ButtonLink>
        </div>

        <ol className="grid gap-4 md:grid-cols-3">
          {journey.steps.map((step, index) => {
            const isLast = index === journey.steps.length - 1;
            return (
              <li
                key={step.title}
                className={`rounded-xl border p-5 ${
                  isLast
                    ? "border-[var(--brand-red)] bg-[var(--grad-cta-red)]"
                    : "border-white/15 bg-white/[0.06]"
                }`}
              >
                <p
                  className={`text-3xl font-black ${
                    isLast ? "text-white" : "text-white/35"
                  }`}
                >
                  0{index + 1}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p
                  className={`mt-2 text-sm leading-6 ${
                    isLast ? "text-white/90" : "text-white/72"
                  }`}
                >
                  {step.copy}
                </p>
              </li>
            );
          })}
        </ol>

        <ButtonLink
          href={localizePath(locale, "/contact")}
          className="lg:hidden"
        >
          {dictionary.common.requestGuidance}
        </ButtonLink>
      </div>
    </section>
  );
}
