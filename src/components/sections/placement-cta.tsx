import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";
import { homeMarketing } from "@/content/institute";
import type { dictionaries } from "@/content/i18n";
import { localizePath, type Locale } from "@/lib/locale";

type PlacementCtaProps = {
  locale: Locale;
  dictionary: (typeof dictionaries)[Locale];
};

// Light placement-test panel with a simple 3-step "how it works". Links into
// the existing /placement-test route — no embedded form here.
export function PlacementCta({ locale, dictionary }: PlacementCtaProps) {
  const { placement } = homeMarketing;

  return (
    <section className="py-16">
      <div className="container-page">
        <div className="split-panel grid gap-10 rounded-xl p-7 md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">{placement.eyebrow}</p>
            <h2 className="section-title text-balance">
              {dictionary.home.placementTitle}
            </h2>
            <p className="supporting-copy mt-3 max-w-md">
              {dictionary.home.placementCopy}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={localizePath(locale, "/placement-test")}>
                Request a Placement Test
              </ButtonLink>
              <Link
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[var(--brand-green)] px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-px hover:brightness-110"
              >
                <MessageCircle size={18} aria-hidden="true" />
                {dictionary.common.whatsapp}
              </Link>
            </div>
          </div>

          <ol className="grid gap-4">
            {placement.steps.map((step, index) => (
              <li
                key={step.title}
                className="flex items-start gap-4 rounded-lg border border-[var(--brand-border)] bg-white p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] text-sm font-black text-[var(--brand-red)]">
                  {index + 1}
                </span>
                <div>
                  <p className="card-title text-base">{step.title}</p>
                  <p className="helper-text mt-1">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
