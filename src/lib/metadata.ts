import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/locale";

type MetadataInput = {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
};

export function localizedMetadata({
  locale,
  path = "",
  title,
  description
}: MetadataInput): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const suffix = cleanPath === "/" ? "" : cleanPath;
  const canonical = `${siteConfig.siteUrl}/${locale}${suffix}`;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${siteConfig.siteUrl}/en${suffix}`,
        ar: `${siteConfig.siteUrl}/ar${suffix}`,
        "x-default": `${siteConfig.siteUrl}/en${suffix}`
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: `${siteConfig.businessName} ${siteConfig.city}`,
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}
