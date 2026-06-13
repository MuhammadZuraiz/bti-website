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
    path: "/cookies",
    title: "Cookie Notice",
    description: "Cookie information for the British Training Institute website."
    }),
    robots: isLegalPagePublished("cookies") ? undefined : { index: false, follow: false }
  };
}

export default async function CookiesPage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }

  if (!isLegalPagePublished("cookies")) {
    notFound();
  }

  return <LegalNoticePage pageKey="cookies" content={legalPageContent.cookies} />;
}
