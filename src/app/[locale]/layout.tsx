import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { getDictionary } from "@/content/i18n";
import { getDirection, isLocale, type Locale } from "@/lib/locale";
import { getEnabledLocales, isLocaleEnabled } from "@/lib/site-utils";

export function generateStaticParams() {
  return getEnabledLocales().map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale) || !isLocaleEnabled(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const dir = getDirection(locale);

  return (
    <div lang={locale} dir={dir} className="mobile-safe-bottom min-h-screen">
      <a href="#main-content" className="skip-link">
        {dictionary.common.skipToContent}
      </a>
      <Header locale={locale} dictionary={dictionary} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
      <MobileStickyCta locale={locale} dictionary={dictionary} />
    </div>
  );
}
