import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("footer semantics", () => {
  const source = readFileSync("src/components/layout/footer.tsx", "utf8");

  it("uses phone links for tel actions and a WhatsApp URL for messaging", () => {
    expect(source).toContain("href={siteConfig.mobileHref}");
    expect(source).toContain("<Phone size={18} /> {siteConfig.mobileDisplay}");
    expect(source).toContain("https://wa.me/${siteConfig.whatsappNumber}");
    expect(source).toContain("<MessageCircle size={18} /> WhatsApp BTI");
  });

  it("filters draft legal links", () => {
    expect(source).toContain("getPublishedLegalPages");
    expect(source).toContain("publishedLegalPages.includes");
  });
});
