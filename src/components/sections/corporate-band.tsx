import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { homeMarketing } from "@/content/institute";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";

type CorporateBandProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

// Dark corporate-training band with proof bullets and stat tiles. Gold is used
// only for the eyebrow accent; red stays reserved for the primary CTA.
export function CorporateBand({ locale, dictionary }: CorporateBandProps) {
  const { corporate } = homeMarketing;

  return (
    <section className="band-corporate py-16 text-white">
      <div className="container-page grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="eyebrow mb-3 text-[var(--brand-gold-light)]">
            {corporate.eyebrow}
          </p>
          <h2 className="section-title on-dark text-balance">
            {dictionary.home.corporateTitle}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/75 md:text-lg">
            {dictionary.home.corporateCopy}
          </p>
          <ul className="mt-6 grid gap-3">
            {corporate.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-6 text-white/85">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[var(--brand-blue)]">
                  <Check size={14} aria-hidden="true" />
                </span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={localizePath(locale, "/corporate-training")}>
              Request a Corporate Proposal
            </ButtonLink>
            <ButtonLink
              href={localizePath(locale, "/contact")}
              variant="secondary"
            >
              {dictionary.common.speakAdmissions}
            </ButtonLink>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {corporate.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/15 bg-white/[0.06] p-5 text-center"
            >
              <p className="text-2xl font-black tracking-tight text-white md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-semibold leading-5 text-white/70">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
