import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileStickyCta } from "@/components/layout/mobile-sticky-cta";
import { getDictionary } from "@/content/i18n";
import { getDirection, isLocale, locales, type Locale } from "@/lib/locale";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dictionary = getDictionary(locale);
  const dir = getDirection(locale);

  return (
    <div lang={locale} dir={dir} className="mobile-safe-bottom min-h-screen">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header locale={locale} dictionary={dictionary} />
      <main id="main-content">{children}</main>
      <Footer locale={locale} dictionary={dictionary} />
      <MobileStickyCta locale={locale} dictionary={dictionary} />
    </div>
  );
}
