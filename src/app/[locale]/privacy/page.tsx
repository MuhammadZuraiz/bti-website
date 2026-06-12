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
    path: "/privacy",
    title: "Privacy Notice",
    description: "Privacy information for British Training Institute website enquiries."
    }),
    robots: isLegalPagePublished("privacy") ? undefined : { index: false, follow: false }
  };
}

export default async function PrivacyPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }

  return <LegalNoticePage pageKey="privacy" content={legalPageContent.privacy} />;
}
