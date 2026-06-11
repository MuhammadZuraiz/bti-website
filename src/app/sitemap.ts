import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { courses } from "@/content/courses";
import { locales } from "@/lib/locale";

const staticRoutes = [
  "",
  "/about",
  "/courses",
  "/placement-test",
  "/corporate-training",
  "/resources",
  "/faq",
  "/contact",
  "/privacy",
  "/cookies",
  "/terms",
  "/accessibility"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const localizedStatic = locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: `${siteConfig.siteUrl}/${locale}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.75
    }))
  );

  const courseRoutes = locales.flatMap((locale) =>
    courses.map((course) => ({
      url: `${siteConfig.siteUrl}/${locale}/courses/${course.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85
    }))
  );

  return [...localizedStatic, ...courseRoutes];
}
