import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const auditedRoutes = [
  "/en",
  "/en/courses",
  "/en/courses/english-language-courses-sharjah",
  "/en/contact",
  "/en/placement-test",
  "/en/corporate-training",
  "/en/faq",
  "/en/resources"
];

// Axe runs once per route on the desktop profile; viewport-specific issues
// are covered by manual checks in docs/accessibility-checklist.md.
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "axe audit runs on the desktop profile");
});

for (const route of auditedRoutes) {
  test(`axe audit: ${route}`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const blocking = results.violations.filter((violation) =>
      ["serious", "critical"].includes(violation.impact ?? "")
    );

    expect(
      blocking,
      blocking
        .map(
          (violation) =>
            `${violation.id} (${violation.impact}): ${violation.nodes
              .map((node) => node.target.join(" "))
              .join(", ")}`
        )
        .join("\n")
    ).toEqual([]);
  });
}
