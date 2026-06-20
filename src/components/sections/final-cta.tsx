import { CheckCircle2, ClipboardCheck, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";
import { homeMarketing } from "@/content/institute";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";

type FinalCtaProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

const actionBase =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition";

// Dark closing band with the four primary contact actions. Red stays the single
// emphasis CTA; blue/green/outline differentiate the secondary paths.
export function FinalCta({ locale, dictionary }: FinalCtaProps) {
  const { home } = dictionary;

  return (
    <section className="band-final py-16 text-white">
      <div className="container-page grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <h2 className="section-title on-dark text-balance">{home.finalTitle}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-white/75 md:text-lg">
            {home.finalCopy}
          </p>
          <ul className="mt-6 grid gap-2.5">
            {home.finalPoints.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-sm font-semibold text-white/85">
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-[var(--brand-gold-light)]"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-white/15 bg-white/[0.06] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.11em] text-[var(--brand-gold-light)]">
            {home.finalActionLabel}
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
            <ButtonLink href={localizePath(locale, "/contact")} className="w-full">
              {dictionary.common.speakAdmissions}
            </ButtonLink>
            <Link
              href={localizePath(locale, "/placement-test")}
              className={`${actionBase} w-full bg-[var(--brand-blue)] text-white shadow-[var(--shadow-blue)] hover:-translate-y-px hover:bg-[var(--brand-blue-dark)]`}
            >
              <ClipboardCheck size={18} aria-hidden="true" />
              Request Placement Test
            </Link>
            <Link
              href={`https://wa.me/${siteConfig.whatsappNumber}`}
              className={`${actionBase} w-full bg-[var(--brand-green)] text-white hover:-translate-y-px hover:brightness-110`}
            >
              <MessageCircle size={18} aria-hidden="true" />
              {dictionary.common.whatsapp}
            </Link>
            <a
              href={siteConfig.landlineHref}
              className={`${actionBase} w-full border border-white/30 text-white hover:bg-white/10`}
            >
              <Phone size={18} aria-hidden="true" />
              {siteConfig.landlineDisplay}
            </a>
          </div>
          <p className="mt-4 text-xs leading-5 text-white/60">
            {homeMarketing.finalNote}
          </p>
        </div>
      </div>
    </section>
  );
}
