import { expect, test } from "@playwright/test";

test.describe("skip link", () => {
  test("focuses main content", async ({ page }) => {
    await page.goto("/en");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: "Skip to content" });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
  });
});

test.describe("desktop navigation", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop-only navigation");
  });

  test("header links navigate", async ({ page }) => {
    await page.goto("/en");
    const header = page.locator("header");
    await header.getByRole("link", { name: "Placement Test" }).click();
    await expect(page).toHaveURL(/\/en\/placement-test$/);
    await header.getByRole("link", { name: "Corporate Training" }).click();
    await expect(page).toHaveURL(/\/en\/corporate-training$/);
    await header.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
  });

  test("course menu lists programmes", async ({ page }) => {
    await page.goto("/en");
    await page.locator("header summary", { hasText: "Courses" }).click();
    await page.getByRole("link", { name: "View all programmes" }).click();
    await expect(page).toHaveURL(/\/en\/courses$/);
  });

  test("Arabic switcher is hidden while Arabic is disabled", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("header").getByRole("link", { name: "AR" })).toHaveCount(0);
  });
});

test.describe("mobile navigation", () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name !== "mobile", "mobile-only navigation");
  });

  test("menu opens, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/en");
    const menuButton = page.getByRole("button", { name: "Open menu" });
    await menuButton.click();
    const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("menu link navigates and closes the menu", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Mobile navigation" });
    await dialog.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/en\/contact$/);
    await expect(dialog).toBeHidden();
  });

  test("sticky CTA shows call, WhatsApp and enquire actions", async ({ page }) => {
    await page.goto("/en");
    const sticky = page.locator("div.fixed.inset-x-0.bottom-0");
    await expect(sticky.getByRole("link", { name: "Call" })).toBeVisible();
    await expect(sticky.getByRole("link", { name: "WhatsApp" })).toBeVisible();
    await expect(sticky.getByRole("link", { name: "Enquire" })).toBeVisible();
    await expect(sticky.getByRole("link", { name: "Call" })).toHaveAttribute(
      "href",
      "tel:+97165687222"
    );
  });
});

test.describe("conditional rendering", () => {
  test("map link is hidden when no map URL is configured", async ({ page }) => {
    await page.goto("/en/contact");
    await expect(page.getByRole("link", { name: /directions/i })).toHaveCount(0);
  });

  test("social links are hidden when not configured", async ({ page }) => {
    await page.goto("/en");
    const footer = page.locator("footer");
    // includeHidden so a stray link in a collapsed mobile accordion or the
    // CSS-hidden desktop block would still be caught.
    for (const name of ["Instagram", "Facebook", "LinkedIn"]) {
      await expect(
        footer.getByRole("link", { name, includeHidden: true })
      ).toHaveCount(0);
    }
  });

  test("footer hides draft legal links and shows published ones", async ({ page }) => {
    await page.goto("/en");
    const footer = page.locator("footer");
    // The footer renders both a mobile (accordion) and a desktop block in the
    // DOM, toggled by CSS. Links inside a collapsed <details> and the hidden
    // block are excluded from the accessibility tree, so use includeHidden to
    // assert DOM presence/absence regardless of layout. The security-critical
    // part is that draft pages never render at all.
    await expect(
      footer.getByRole("link", { name: "Accessibility", includeHidden: true }).first()
    ).toBeAttached();
    for (const name of ["Privacy", "Cookies", "Terms"]) {
      await expect(
        footer.getByRole("link", { name, includeHidden: true })
      ).toHaveCount(0);
    }
  });

  test("no analytics or consent banner loads by default", async ({ page }) => {
    await page.goto("/en");
    // No GA measurement ID configured → no third-party analytics script...
    await expect(
      page.locator('script[src*="googletagmanager.com"]')
    ).toHaveCount(0);
    // ...and no cookie-consent dialog.
    await expect(
      page.getByRole("dialog", { name: "Cookie consent" })
    ).toHaveCount(0);
  });
});
