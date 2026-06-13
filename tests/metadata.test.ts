import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { localizedMetadata } from "@/lib/metadata";

describe("localized metadata", () => {
  it("builds the home canonical without a trailing path", () => {
    const metadata = localizedMetadata({
      locale: "en",
      path: "/",
      title: "Home",
      description: "Home description."
    });

    expect(metadata.alternates?.canonical).toBe(`${siteConfig.siteUrl}/en`);
    expect(metadata.openGraph?.url).toBe(`${siteConfig.siteUrl}/en`);
  });

  it("builds canonical and Open Graph URLs for nested paths", () => {
    const metadata = localizedMetadata({
      locale: "en",
      path: "/courses/ielts-preparation-course-sharjah",
      title: "IELTS Preparation",
      description: "IELTS course."
    });

    const expected = `${siteConfig.siteUrl}/en/courses/ielts-preparation-course-sharjah`;
    expect(metadata.alternates?.canonical).toBe(expected);
    expect(metadata.openGraph?.url).toBe(expected);
  });

  it("omits Arabic alternates while Arabic is disabled", () => {
    const metadata = localizedMetadata({
      locale: "en",
      path: "/contact",
      title: "Contact",
      description: "Contact us."
    });

    const languages = metadata.alternates?.languages ?? {};
    expect(Object.keys(languages)).toEqual(["en", "x-default"]);
    expect(languages["x-default"]).toBe(`${siteConfig.siteUrl}/en/contact`);
  });

  it("references the social preview images", () => {
    const metadata = localizedMetadata({
      locale: "en",
      path: "/",
      title: "Home",
      description: "Home description."
    });

    const ogImages = metadata.openGraph?.images;
    expect(JSON.stringify(ogImages)).toContain(siteConfig.metadataImages.openGraph);
    expect(JSON.stringify(metadata.twitter?.images)).toContain(
      siteConfig.metadataImages.twitter
    );
  });

  it("never references example.com", () => {
    const metadata = localizedMetadata({
      locale: "en",
      path: "/faq",
      title: "FAQ",
      description: "Questions."
    });

    expect(JSON.stringify(metadata)).not.toContain("example.com");
  });
});
