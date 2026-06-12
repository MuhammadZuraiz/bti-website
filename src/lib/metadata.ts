import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/lib/locale";
import { getEnabledLocales } from "@/lib/site-utils";

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
  const languages = Object.fromEntries(
    getEnabledLocales().map((enabledLocale) => [
      enabledLocale,
      `${siteConfig.siteUrl}/${enabledLocale}${suffix}`
    ])
  );

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        "x-default": `${siteConfig.siteUrl}/en${suffix}`
      }
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: `${siteConfig.businessName} ${siteConfig.city}`,
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_AE",
      images: [
        {
          url: siteConfig.metadataImages.openGraph,
          width: 1200,
          height: 630,
          alt: `${siteConfig.businessName} ${siteConfig.city}`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.metadataImages.twitter]
    }
  };
}
