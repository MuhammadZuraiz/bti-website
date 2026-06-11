import { siteConfig } from "@/config/site";
import type { Course } from "@/types/course";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.businessName,
    alternateName: siteConfig.shortName,
    url: siteConfig.siteUrl,
    email: siteConfig.email,
    telephone: siteConfig.landlineDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressCountry: "AE"
    }
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.businessName,
    url: siteConfig.siteUrl,
    telephone: siteConfig.landlineDisplay,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: siteConfig.city,
      addressCountry: "AE"
    }
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

export function courseSchema(course: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.seoDescription,
    provider: {
      "@type": "EducationalOrganization",
      name: siteConfig.businessName,
      sameAs: siteConfig.siteUrl
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
