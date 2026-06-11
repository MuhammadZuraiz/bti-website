import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home-page";
import { getDictionary } from "@/content/i18n";
import { isLocale, type Locale } from "@/lib/locale";
import { localizedMetadata } from "@/lib/metadata";
import { notFound } from "next/navigation";

type Params = Promise<{ locale: string }>;

export async function generateMetadata({
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : "en";
  return localizedMetadata({
    locale,
    path: "/",
    title:
      "British Training Institute Sharjah | English, IELTS & Professional Courses",
    description:
      "Explore English, IELTS preparation, business, accounting, HR and professional training options at British Training Institute in Sharjah. Speak with admissions to find the right course."
  });
}

export default async function LocaleHomePage({ params }: { params: Params }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) {
    notFound();
  }
  const locale: Locale = rawLocale;
  return <HomePage locale={locale} dictionary={getDictionary(locale)} />;
}
