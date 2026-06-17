import { describe, expect, it } from "vitest";
import { siteConfig } from "@/config/site";
import { courses } from "@/content/courses";
import {
  breadcrumbSchema,
  courseSchema,
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  websiteSchema
} from "@/lib/schema";

describe("structured data", () => {
  it("outputs organization schema without fake ratings/reviews", () => {
    const schema = organizationSchema();
    expect(schema["@type"]).toBe("EducationalOrganization");
    const text = JSON.stringify(schema);
    expect(text).not.toContain("aggregateRating");
    expect(text).not.toContain("review");
  });

  it("includes the BTI-confirmed founding date", () => {
    expect(organizationSchema().foundingDate).toBe("2002");
  });

  it("uses a normalised E.164 telephone, not the display format", () => {
    const schema = organizationSchema();
    expect(schema.telephone).toBe("+97165687222");
    expect(JSON.stringify(schema)).not.toContain("06 568");
  });

  it("uses an absolute logo URL and structured address fields", () => {
    const schema = organizationSchema();
    expect(schema.logo).toBe(`${siteConfig.siteUrl}/images/bti-logo.jpg`);
    expect(schema.address).toMatchObject({
      "@type": "PostalAddress",
      addressLocality: "Sharjah",
      addressCountry: "AE"
    });
  });

  it("includes an admissions contact point with enabled languages only", () => {
    const schema = organizationSchema();
    expect(schema.contactPoint).toMatchObject({
      "@type": "ContactPoint",
      contactType: "admissions",
      telephone: "+97165687222"
    });
    // Arabic is disabled, so it must not be advertised.
    expect(schema.contactPoint.availableLanguage).toEqual(["English"]);
  });

  it("includes approved social profiles and opening hours", () => {
    const schema = organizationSchema();
    // BTI confirmed social links and opening hours.
    expect(Array.isArray(schema.sameAs)).toBe(true);
    expect((schema.sameAs as string[]).length).toBeGreaterThan(0);
    expect(schema).toHaveProperty("openingHours");
    expect(localBusinessSchema()).toHaveProperty("openingHours");
  });

  it("outputs course schema without fake prices or guarantees", () => {
    const schema = courseSchema(courses[0]);
    const text = JSON.stringify(schema);
    expect(schema["@type"]).toBe("Course");
    expect(schema.url).toContain(`/en/courses/${courses[0].slug}`);
    expect(schema.inLanguage).toBe("en");
    expect(text).not.toContain("offers");
    expect(text).not.toContain("guarantee");
    expect(text).not.toContain("aggregateRating");
  });

  it("outputs website schema with locale URL", () => {
    const schema = websiteSchema("en");
    expect(schema.url).toBe(`${siteConfig.siteUrl}/en`);
    expect(schema.inLanguage).toBe("en");
  });

  it("outputs FAQ and breadcrumb structures", () => {
    const faq = faqSchema([{ question: "Q?", answer: "A." }]);
    expect(faq.mainEntity).toHaveLength(1);

    const breadcrumb = breadcrumbSchema([
      { name: "Home", url: "https://site/en" },
      { name: "Courses", url: "https://site/en/courses" }
    ]);
    expect(breadcrumb.itemListElement[1]).toMatchObject({
      position: 2,
      name: "Courses"
    });
  });
});
