import { expect, test } from "@playwright/test";

// The E2E dev server is started with LEAD_ADMIN_USER/PASSWORD (see
// playwright.config.ts). These tests run once on the desktop project.
const adminUser = "admin";
const adminPassword = "e2e-admin-password";

test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "admin runs on the desktop profile");
});

test.describe("admin auth", () => {
  test("blocks /admin without credentials", async ({ page }) => {
    const response = await page.goto("/admin/leads");
    expect(response?.status()).toBe(401);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
  });

  test("blocks the admin export without credentials", async ({ request }) => {
    const response = await request.get("/api/admin/export");
    expect(response.status()).toBe(401);
  });
});

test.describe("admin with credentials", () => {
  test.use({ httpCredentials: { username: adminUser, password: adminPassword } });

  test("lists enquiries and opens a detail page", async ({ page }) => {
    const response = await page.goto("/admin/leads");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(page.getByRole("heading", { name: /Enquiries/ })).toBeVisible();

    // There should be at least one lead from the journey specs; if a reference
    // link exists, the detail page should load.
    const firstRef = page.getByRole("link", { name: /^BTI-/ }).first();
    if (await firstRef.count()) {
      await firstRef.click();
      await expect(page).toHaveURL(/\/admin\/leads\/[^/]+$/);
      await expect(page.getByText("Attribution")).toBeVisible();
    }
  });

  test("downloads a CSV export", async ({ request }) => {
    const response = await request.get("/api/admin/export");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/csv");
    expect(response.headers()["content-disposition"]).toContain("attachment");
    expect(await response.text()).toContain("publicReference");
  });
});
