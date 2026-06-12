import type { Metadata } from "next";
import { Info, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactActions } from "@/components/conversion/contact-actions";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { getContactContext } from "@/lib/contact-context";
import { hasValidMapUrl, isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/contact",
    title: "Contact British Training Institute Sharjah | Course Enquiries",
    description:
      "Contact British Training Institute in Sharjah to ask about English, IELTS preparation and professional training options, schedules and admissions."
  });
}

export default async function ContactPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { locale: rawLocale } = await params;
  const resolvedSearchParams = await searchParams;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  const context = getContactContext(resolvedSearchParams);

  return (
    <section className="py-14">
      <div className="container-page grid gap-10">
        <SectionHeading
          eyebrow="Contact BTI"
          title="Speak with BTI in Sharjah."
          intro="Ask about course options, placement-test guidance, corporate training, schedules, and current availability."
        />
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid content-start gap-6">
            <article className="surface rounded-lg p-6">
              <MapPin size={30} className="text-[var(--brand-red)]" />
              <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-navy)]">Visit or contact</h2>
              <p className="mt-3 leading-7 text-[var(--brand-muted)]">{siteConfig.address}</p>
              <ContactActions />
            </article>
            {siteConfig.openingHours.length ? (
              <article className="surface rounded-lg p-6">
                <Info size={28} className="text-[var(--brand-red)]" />
                <h2 className="mt-4 text-xl font-extrabold text-[var(--brand-navy)]">
                  Opening hours
                </h2>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-[var(--brand-muted)]">
                  {siteConfig.openingHours.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </article>
            ) : null}
            {siteConfig.parkingNotes || siteConfig.landmarkNotes ? (
              <article className="surface rounded-lg p-6">
                <Info size={28} className="text-[var(--brand-red)]" />
                <h2 className="mt-4 text-xl font-extrabold text-[var(--brand-navy)]">
                  Visiting BTI
                </h2>
                {siteConfig.landmarkNotes ? (
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                    {siteConfig.landmarkNotes}
                  </p>
                ) : null}
                {siteConfig.parkingNotes ? (
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                    {siteConfig.parkingNotes}
                  </p>
                ) : null}
              </article>
            ) : null}
            <article className="surface rounded-lg p-6">
              <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">What happens next?</h2>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                <li>1. Submit your enquiry.</li>
                <li>2. An admissions team member reviews your request.</li>
                <li>3. BTI contacts you to discuss suitable options and the latest availability.</li>
              </ol>
            </article>
            {hasValidMapUrl() ? (
              <article className="surface rounded-lg bg-[var(--brand-soft)] p-6">
                <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">
                  Directions
                </h2>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                  Use the directions link above to confirm the best route before
                  visiting BTI.
                </p>
              </article>
            ) : null}
          </div>
          <LeadForm
            leadType={
              context.kind === "resource"
                ? "resource-request"
                : context.kind === "course"
                  ? "course-enquiry"
                  : "general-enquiry"
            }
            locale={locale}
            title={context.formTitle}
            courseInterest={context.courseInterest}
            courseSlug={context.courseSlug}
            resourceInterest={context.resourceInterest}
            resourceSlug={context.resourceSlug}
            showCourseInterestField={context.kind !== "resource"}
            submitLabel={context.submitLabel}
          />
        </div>
      </div>
    </section>
  );
}
