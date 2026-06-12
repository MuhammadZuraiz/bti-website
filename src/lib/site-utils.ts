import { siteConfig } from "@/config/site";
import type { Resource } from "@/content/resources";
import { locales, type Locale } from "@/lib/locale";

export type LegalPageKey = keyof typeof siteConfig.legalPages;

export function isValidExternalUrl(value?: string) {
  if (!value || value.trim() === "#") {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isValidInternalAssetUrl(value?: string) {
  return Boolean(value && value.startsWith("/") && value !== "#");
}

export function hasValidMapUrl() {
  return isValidExternalUrl(siteConfig.mapUrl);
}

export function hasValidBusinessEmail() {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(siteConfig.email);
}

export function hasValidSocialUrl(url?: string) {
  return isValidExternalUrl(url);
}

export function isFeatureEnabled(
  flag: keyof typeof siteConfig.featureFlags
) {
  return Boolean(siteConfig.featureFlags[flag]);
}

export function isLegalPagePublished(page: LegalPageKey) {
  return siteConfig.legalPages[page].state === "published";
}

export function getEnabledLocales(): Locale[] {
  return locales.filter((locale) =>
    locale === "ar" ? isFeatureEnabled("enableArabic") : true
  );
}

export function isLocaleEnabled(locale: Locale) {
  return getEnabledLocales().includes(locale);
}

export function getAlternateEnabledLocale(locale: Locale) {
  return getEnabledLocales().find((enabledLocale) => enabledLocale !== locale);
}

export function isResourcePublished(resource: Resource) {
  return Boolean(
    resource.isAvailable &&
      resource.fileUrl &&
      resource.fileUrl !== "#" &&
      (isValidExternalUrl(resource.fileUrl) ||
        isValidInternalAssetUrl(resource.fileUrl))
  );
}

export function getPublishedLegalPages() {
  return (Object.keys(siteConfig.legalPages) as LegalPageKey[]).filter(
    isLegalPagePublished
  );
}
