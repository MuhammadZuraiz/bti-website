import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalNoticePage } from "@/components/pages/legal-notice-page";
import { legalPageContent } from "@/content/legal";
import { isLocale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { isLegalPagePublished, isLocaleEnabled } from "@/lib/site-utils";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) && isLocaleEnabled(rawLocale) ? rawLocale : "en";
  return {
    ...localizedMetadata({
    locale,
    path: "/terms",
    title: "Terms and Conditions",
    description: "Website and enquiry terms for British Training Institute."
    }),
    robots: isLegalPagePublished("terms") ? undefined : { index: false, follow: false }
  };
}

export default async function TermsPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }

  if (!isLegalPagePublished("terms")) {
    notFound();
  }

  return <LegalNoticePage pageKey="terms" content={legalPageContent.terms} />;
}
