import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeading } from "@/components/ui/section-heading";
import { isLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/terms",
    title: "Terms and Conditions",
    description: "Terms placeholder for British Training Institute website use."
  });
}

export default async function TermsPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return (
    <section className="py-14">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="Legal review required"
          title="Terms and Conditions"
          intro="This placeholder should be replaced with approved terms covering course enquiries, bookings, payments, refunds and website use."
        />
        <div className="surface mt-8 rounded-lg p-6 leading-7 text-[var(--brand-muted)]">
          <p>
            This website does not publish unverified fees, schedules,
            guarantees or confirmed booking terms. Admissions must confirm all
            programme details before enrolment.
          </p>
        </div>
      </div>
    </section>
  );
}
