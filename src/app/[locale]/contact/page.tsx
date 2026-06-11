import type { Metadata } from "next";
import { Clock, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { ContactActions } from "@/components/conversion/contact-actions";
import { LeadForm } from "@/components/forms/lead-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { siteConfig } from "@/config/site";
import { isLocale, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/contact",
    title: "Contact British Training Institute Sharjah | Course Enquiries",
    description:
      "Contact British Training Institute in Sharjah to ask about English, IELTS preparation and professional training options, schedules and admissions."
  });
}

export default async function ContactPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;

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
            <article className="surface rounded-lg p-6">
              <Clock size={28} className="text-[var(--brand-red)]" />
              <h2 className="mt-4 text-xl font-extrabold text-[var(--brand-navy)]">
                Opening hours placeholder
              </h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                Opening hours must be approved by BTI before production. Do not
                publish guessed timings.
              </p>
            </article>
            <article className="surface rounded-lg p-6">
              <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">What happens next?</h2>
              <ol className="mt-4 grid gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                <li>1. Submit your enquiry.</li>
                <li>2. An admissions team member reviews your request.</li>
                <li>3. BTI contacts you to discuss suitable options and the latest availability.</li>
              </ol>
            </article>
            <div className="surface min-h-64 rounded-lg bg-[var(--brand-soft)] p-6">
              <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">Map placeholder</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                Add the approved Google Maps embed or directions URL through
                environment configuration before launch.
              </p>
            </div>
          </div>
          <LeadForm
            leadType="general-enquiry"
            locale={locale}
            title="Send a general enquiry"
            submitLabel="Send Enquiry"
          />
        </div>
      </div>
    </section>
  );
}
