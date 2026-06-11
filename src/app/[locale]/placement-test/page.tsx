import type { Metadata } from "next";
import { ClipboardCheck, MessageCircle, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";
import { isLocale, localizePath, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/placement-test",
    title: "English Placement Test Guidance in Sharjah | British Training Institute",
    description:
      "Request a placement-test conversation with British Training Institute in Sharjah and ask admissions about suitable English course options."
  });
}

export default async function PlacementTestPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

  return (
    <>
      <section className="bg-[var(--brand-soft)] py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.14em] text-[var(--brand-red)]">
              Placement-test request
            </p>
            <h1 className="text-balance mt-4 text-4xl font-black leading-tight text-[var(--brand-navy)] md:text-5xl">
              Find a clearer starting point for your English learning journey.
            </h1>
            <p className="mt-5 text-lg leading-8 text-[var(--brand-muted)]">
              Tell BTI about your current goal and request a placement-test
              conversation. The admissions team can help you explore a suitable
              next step.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="#placement-form">Request Placement-Test Guidance</ButtonLink>
              <ButtonLink href={`https://wa.me/${siteConfig.whatsappNumber}`} variant="secondary">
                <MessageCircle size={18} />
                WhatsApp BTI
              </ButtonLink>
            </div>
          </div>
          <div className="surface rounded-lg p-6">
            <ClipboardCheck size={42} className="text-[var(--brand-red)]" />
            <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-navy)]">
              What this request does
            </h2>
            <p className="mt-3 leading-7 text-[var(--brand-muted)]">
              It helps admissions understand your English goal before they
              respond. It is not a confirmed appointment until BTI contacts you.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container-page grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid content-start gap-6">
            <SectionHeading
              title="How the guidance works"
              intro="A simple admissions conversation can reduce guesswork before you choose an English level."
            />
            {[
              ["Share your goal", "Tell BTI why you want to improve English."],
              ["Discuss your current level", "Admissions can advise what information is needed next."],
              ["Confirm the next step", "BTI responds with current options, availability, and guidance."]
            ].map(([title, copy]) => (
              <div key={title} className="surface rounded-lg p-5">
                <h2 className="font-extrabold text-[var(--brand-navy)]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{copy}</p>
              </div>
            ))}
            <div className="surface rounded-lg p-5">
              <h2 className="font-extrabold text-[var(--brand-navy)]">Contact alternatives</h2>
              <div className="mt-4 grid gap-2">
                <a href={siteConfig.landlineHref} className="inline-flex gap-2 font-bold text-[var(--brand-navy)]">
                  <Phone size={18} /> {siteConfig.landlineDisplay}
                </a>
                <a href={`https://wa.me/${siteConfig.whatsappNumber}`} className="inline-flex gap-2 font-bold text-[var(--brand-navy)]">
                  <MessageCircle size={18} /> WhatsApp {siteConfig.mobileDisplay}
                </a>
              </div>
            </div>
          </div>
          <div id="placement-form">
            <LeadForm
              leadType="placement-test-request"
              locale={locale}
              placement
              title="Request placement-test guidance"
              submitLabel="Request Placement-Test Guidance"
            />
          </div>
        </div>
      </section>
    </>
  );
}
