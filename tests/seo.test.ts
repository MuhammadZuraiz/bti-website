import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { buildRobots, buildRobotsMetadata, buildSitemap } from "@/lib/seo";

const nonProduction = ["development", "preview", "staging"] as const;

describe("robots", () => {
  it.each(nonProduction)("blocks all crawling in %s", (environment) => {
    const robots = buildRobots(environment);
    expect(robots.rules).toMatchObject({ userAgent: "*", disallow: "/" });
    expect(robots.sitemap).toBeUndefined();
  });

  it("allows public routes but blocks API routes in production", () => {
    const robots = buildRobots("production");
    expect(robots.rules).toMatchObject({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"]
    });
    expect(robots.sitemap).toBe(`${siteConfig.siteUrl}/sitemap.xml`);
  });
});

describe("robots metadata", () => {
  it.each(nonProduction)("noindexes %s", (environment) => {
    expect(buildRobotsMetadata(environment)).toEqual({
      index: false,
      follow: false
    });
  });

  it("indexes production", () => {
    expect(buildRobotsMetadata("production")).toEqual({
      index: true,
      follow: true
    });
  });
});

describe("sitemap", () => {
  it.each(nonProduction)("is empty in %s", (environment) => {
    expect(buildSitemap(environment)).toEqual([]);
  });

  it("includes enabled-locale public pages and courses in production", () => {
    const urls = buildSitemap("production").map((entry) => entry.url);

    expect(urls).toContain(`${siteConfig.siteUrl}/en`);
    expect(urls).toContain(`${siteConfig.siteUrl}/en/courses`);
    expect(urls).toContain(
      `${siteConfig.siteUrl}/en/courses/english-language-courses-sharjah`
    );
    expect(urls).toContain(`${siteConfig.siteUrl}/en/contact`);
  });

  it("excludes draft legal pages and includes published ones", () => {
    const urls = buildSitemap("production").map((entry) => entry.url);

    // Draft in current config: privacy, cookies, terms. Published: accessibility.
    expect(urls).not.toContain(`${siteConfig.siteUrl}/en/privacy`);
    expect(urls).not.toContain(`${siteConfig.siteUrl}/en/cookies`);
    expect(urls).not.toContain(`${siteConfig.siteUrl}/en/terms`);
    expect(urls).toContain(`${siteConfig.siteUrl}/en/accessibility`);
  });

  it("excludes disabled Arabic routes and internal endpoints", () => {
    const urls = buildSitemap("production").map((entry) => entry.url);

    expect(urls.some((url) => url.includes("/ar"))).toBe(false);
    expect(urls.some((url) => url.includes("/api"))).toBe(false);
  });

  it("never fabricates lastModified dates", () => {
    const entries = buildSitemap("production");
    const withDates = entries.filter((entry) => entry.lastModified);

    // No business review dates exist yet, so no entry may carry one.
    expect(withDates).toEqual([]);
  });
});
