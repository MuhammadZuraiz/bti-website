import type { MetadataRoute } from "next";
import {
  getDeploymentEnvironment,
  isIndexingAllowed,
  type DeploymentEnvironment
} from "@/config/deployment";
import { siteConfig } from "@/config/site";
import { courses } from "@/content/courses";
import { getEnabledLocales, isLegalPagePublished } from "@/lib/site-utils";

const legalRoutes = ["privacy", "cookies", "terms", "accessibility"] as const;

function publicStaticRoutes() {
  return [
    "",
    "/about",
    "/courses",
    "/placement-test",
    "/corporate-training",
    "/resources",
    "/faq",
    "/contact",
    ...legalRoutes
      .filter((page) => isLegalPagePublished(page))
      .map((page) => `/${page}`)
  ];
}

/**
 * Robots rules per deployment environment. Anything that is not explicitly
 * production blocks all crawling.
 */
export function buildRobots(
  environment: DeploymentEnvironment = getDeploymentEnvironment()
): MetadataRoute.Robots {
  if (!isIndexingAllowed(environment)) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/"
      }
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`
  };
}

/**
 * Sitemap entries per deployment environment. Non-production environments
 * publish an empty sitemap. lastModified is only emitted when a real
 * review date exists — dates are never fabricated.
 */
export function buildSitemap(
  environment: DeploymentEnvironment = getDeploymentEnvironment()
): MetadataRoute.Sitemap {
  if (!isIndexingAllowed(environment)) {
    return [];
  }

  const enabledLocales = getEnabledLocales();

  const localizedStatic = enabledLocales.flatMap((locale) =>
    publicStaticRoutes().map((route) => ({
      url: `${siteConfig.siteUrl}/${locale}${route}`,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.75
    }))
  );

  const courseRoutes = enabledLocales.flatMap((locale) =>
    courses.map((course) => ({
      url: `${siteConfig.siteUrl}/${locale}/courses/${course.slug}`,
      ...(course.lastReviewedAt
        ? { lastModified: course.lastReviewedAt }
        : {}),
      changeFrequency: "weekly" as const,
      priority: 0.85
    }))
  );

  return [...localizedStatic, ...courseRoutes];
}

/** Explicit robots metadata for the root layout. */
export function buildRobotsMetadata(
  environment: DeploymentEnvironment = getDeploymentEnvironment()
) {
  if (isIndexingAllowed(environment)) {
    return { index: true, follow: true };
  }

  return { index: false, follow: false };
}
