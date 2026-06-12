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
    path: "/accessibility",
    title: "Accessibility Statement",
    description:
      "Accessibility statement for British Training Institute Sharjah website."
    }),
    robots: isLegalPagePublished("accessibility")
      ? undefined
      : { index: false, follow: false }
  };
}

export default async function AccessibilityPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }

  return (
    <LegalNoticePage
      pageKey="accessibility"
      content={legalPageContent.accessibility}
    />
  );
}
