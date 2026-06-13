import { expect, test } from "@playwright/test";

const publicRoutes = [
  "/en",
  "/en/about",
  "/en/courses",
  "/en/courses/english-language-courses-sharjah",
  "/en/courses/ielts-preparation-course-sharjah",
  "/en/placement-test",
  "/en/corporate-training",
  "/en/resources",
  "/en/faq",
  "/en/contact",
  "/en/accessibility"
];

test.describe("public routes", () => {
  for (const route of publicRoutes) {
    test(`${route} renders with a single H1`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("h1")).toBeVisible();
    });
  }

  test("unknown route returns 404", async ({ page }) => {
    const response = await page.goto("/en/this-page-does-not-exist");
    expect(response?.status()).toBe(404);
  });

  test("disabled Arabic locale is not publicly exposed", async ({ page }) => {
    const response = await page.goto("/ar");
    expect(response?.status()).toBe(404);
  });

  test("draft legal routes are hidden", async ({ page }) => {
    for (const route of ["/en/privacy", "/en/cookies", "/en/terms"]) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should be hidden while draft`).toBe(404);
    }
  });
});
