// Rendered visual QA: captures key pages and form states at mobile, tablet
// and desktop widths into the git-ignored artifacts/qa/ directory.
//
// Usage: node scripts/qa-screenshots.mjs [baseUrl]
//   (defaults to http://localhost:3210)
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.argv[2] ?? "http://localhost:3210";
const outputDir = path.join(process.cwd(), "artifacts", "qa");

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1280", width: 1280, height: 800 }
];

const pages = [
  ["home", "/en"],
  ["courses", "/en/courses"],
  ["course-english", "/en/courses/english-language-courses-sharjah"],
  ["course-ielts", "/en/courses/ielts-preparation-course-sharjah"],
  ["contact", "/en/contact"],
  ["placement-test", "/en/placement-test"],
  ["corporate-training", "/en/corporate-training"],
  ["resources", "/en/resources"],
  ["faq", "/en/faq"],
  ["accessibility", "/en/accessibility"]
];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch();

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height }
  });
  const page = await context.newPage();

  for (const [name, route] of pages) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(outputDir, `${name}--${viewport.name}.png`),
      fullPage: true
    });
    // Above-the-fold view for the homepage hero review.
    if (name === "home") {
      await page.screenshot({
        path: path.join(outputDir, `${name}-fold--${viewport.name}.png`),
        fullPage: false
      });
    }
  }

  // Form validation errors: submit an empty general enquiry.
  await page.goto(`${baseUrl}/en/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(outputDir, `form-errors--${viewport.name}.png`),
    fullPage: true
  });

  // Submission failure state (stubbed 503).
  await page.route("**/api/leads", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        error:
          "We could not send your enquiry right now. Please call BTI or message the admissions team on WhatsApp."
      })
    })
  );
  await page.goto(`${baseUrl}/en/contact`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Full name" }).fill("QA Synthetic Person");
  await page.getByRole("textbox", { name: "Email" }).fill("qa-visual@bti.invalid");
  await page.getByRole("textbox", { name: "Message" }).fill("QA visual review synthetic message.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(outputDir, `form-failure--${viewport.name}.png`),
    fullPage: true
  });

  // Submission success state (stubbed ok response).
  await page.unroute("**/api/leads");
  await page.route("**/api/leads", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        referenceId: "BTI-QA0001",
        deliveryStatus: "delivered",
        message: "Thank you."
      })
    })
  );
  await page.goto(`${baseUrl}/en/contact`, { waitUntil: "networkidle" });
  await page.getByRole("textbox", { name: "Full name" }).fill("QA Synthetic Person");
  await page.getByRole("textbox", { name: "Email" }).fill("qa-visual@bti.invalid");
  await page.getByRole("textbox", { name: "Message" }).fill("QA visual review synthetic message.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send Enquiry" }).click();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(outputDir, `form-success--${viewport.name}.png`),
    fullPage: true
  });

  await context.close();
}

await browser.close();
console.info(`QA screenshots written to ${outputDir}`);
