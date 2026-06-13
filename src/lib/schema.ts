import { siteConfig } from "@/config/site";
import { getEnabledLocales, hasValidSocialUrl } from "@/lib/site-utils";
import type { Course } from "@/types/course";

// E.164 telephone derived from the approved tel: link, never the display text.
const telephone = siteConfig.landlineHref.replace(/^tel:/, "");

function approvedSameAs() {
  return [
    siteConfig.googleBusinessProfileUrl,
    siteConfig.socialLinks.instagram,
    siteConfig.socialLinks.facebook,
    siteConfig.socialLinks.linkedin
  ].filter((url) => hasValidSocialUrl(url));
}

function availableLanguages() {
  return getEnabledLocales().map((locale) =>
    locale === "ar" ? "Arabic" : "English"
  );
}

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: "Bank Street, CB Building, Apartments 303-304, Al Meraijah",
    addressLocality: siteConfig.city,
    addressCountry: "AE"
  };
}

function contactPoint() {
  return {
    "@type": "ContactPoint",
    contactType: "admissions",
    telephone,
    email: siteConfig.email,
    availableLanguage: availableLanguages()
  };
}

export function organizationSchema() {
  const sameAs = approvedSameAs();

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.businessName,
    alternateName: siteConfig.shortName,
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/images/bti-logo.jpg`,
    email: siteConfig.email,
    telephone,
    address: postalAddress(),
    contactPoint: contactPoint(),
    ...(sameAs.length ? { sameAs } : {}),
    // Opening hours are only published once BTI approves them.
    ...(siteConfig.openingHours.length
      ? { openingHours: siteConfig.openingHours }
      : {})
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.businessName,
    url: siteConfig.siteUrl,
    image: `${siteConfig.siteUrl}/images/bti-logo.jpg`,
    telephone,
    email: siteConfig.email,
    address: postalAddress(),
    ...(siteConfig.openingHours.length
      ? { openingHours: siteConfig.openingHours }
      : {})
  };
}

export function websiteSchema(locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${siteConfig.businessName} ${siteConfig.city}`,
    url: `${siteConfig.siteUrl}/${locale}`,
    inLanguage: locale
  };
}

export function courseSchema(course: Course, locale = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.seoDescription,
    inLanguage: locale,
    url: `${siteConfig.siteUrl}/${locale}/courses/${course.slug}`,
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.businessName,
      url: siteConfig.siteUrl
    }
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}
