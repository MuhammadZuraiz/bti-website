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
    path: "/privacy",
    title: "Privacy Notice",
    description: "Privacy information for British Training Institute website enquiries."
  });
}

export default async function PrivacyPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }

  return (
    <section className="py-14">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="Legal review required"
          title="Privacy Notice"
          intro="This page is a production placeholder and must be reviewed by BTI's legal or compliance owner before launch."
        />
        <div className="surface mt-8 grid gap-4 rounded-lg p-6 leading-7 text-[var(--brand-muted)]">
          <p>
            BTI may collect enquiry details such as name, phone number, email,
            course interest, message, source page, locale and campaign
            parameters to respond to admissions and training enquiries.
          </p>
          <p>
            Production deployment should define the privacy contact, retention
            period, data-subject request process, analytics consent approach and
            Odoo CRM processing details.
          </p>
        </div>
      </div>
    </section>
  );
}
