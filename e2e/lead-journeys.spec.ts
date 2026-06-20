import { expect, test } from "@playwright/test";
import {
  fetchLeadByReference,
  fillBaseLeadFields,
  submitAndCaptureReference,
  syntheticLead
} from "./helpers";

// Conversion journeys exercise the real API, PostgreSQL and webhook
// receiver. They run once, on the mobile profile (the primary persona);
// route rendering across widths is covered by public-routes.spec.ts.
test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "journeys run on the mobile profile");
});

test("homepage to English course enquiry", async ({ page }) => {
  const lead = syntheticLead("english");
  await page.goto("/en");
  // The homepage course finder links straight to the course page.
  await page
    .locator('a[href="/en/courses/languages/general-english"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/en\/courses\/languages\/general-english$/);

  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Message" }).fill("E2E synthetic English course enquiry.");
  const reference = await submitAndCaptureReference(page, "Register / Request Information");

  const row = await fetchLeadByReference(reference);
  expect(row).toMatchObject({
    leadType: "course-enquiry",
    courseSlug: "general-english",
    fullName: lead.name,
    deliveryStatus: "delivered",
    sourcePage: "/en/courses/languages/general-english"
  });
});

test("homepage to IELTS course enquiry", async ({ page }) => {
  const lead = syntheticLead("ielts");
  await page.goto("/en");
  await page
    .locator('a[href="/en/courses/languages/ielts-preparation"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/en\/courses\/languages\/ielts-preparation$/);

  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Message" }).fill("E2E synthetic IELTS enquiry.");
  const reference = await submitAndCaptureReference(page, "Register / Request Information");

  const row = await fetchLeadByReference(reference);
  expect(row).toMatchObject({
    leadType: "course-enquiry",
    courseSlug: "ielts-preparation"
  });
});

test("general enquiry from the contact page", async ({ page }) => {
  const lead = syntheticLead("general");
  await page.goto("/en/contact");
  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Message" }).fill("E2E synthetic general enquiry.");
  const reference = await submitAndCaptureReference(page, "Send Admission Enquiry");

  const row = await fetchLeadByReference(reference);
  expect(row).toMatchObject({
    leadType: "general-enquiry",
    email: lead.email,
    deliveryStatus: "delivered"
  });
});

test("placement-test request", async ({ page }) => {
  const lead = syntheticLead("placement");
  await page.goto("/en/placement-test");
  await fillBaseLeadFields(page, lead);
  await page
    .getByRole("textbox", { name: "Current English-learning goal" })
    .fill("Improve general English for work.");
  await page.getByRole("textbox", { name: "Preferred date or time range" }).fill("Weekday evenings");
  const reference = await submitAndCaptureReference(
    page,
    "Request Placement-Test Guidance"
  );

  const row = await fetchLeadByReference(reference);
  expect(row).toMatchObject({ leadType: "placement-test-request" });
});

test("corporate-training enquiry", async ({ page }) => {
  const lead = syntheticLead("corporate");
  await page.goto("/en/corporate-training");
  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Company name" }).fill("E2E Synthetic Trading LLC");
  await page.getByRole("spinbutton", { name: "Number of learners" }).fill("12");
  await page.getByRole("textbox", { name: "Training area" }).fill("Business English");
  await page
    .getByRole("textbox", { name: "Message" })
    .fill("E2E synthetic corporate training enquiry for twelve staff.");
  const reference = await submitAndCaptureReference(
    page,
    "Request a Corporate Training Conversation"
  );

  const row = await fetchLeadByReference(reference);
  expect(row).toMatchObject({ leadType: "corporate-training-enquiry" });
});

test("resource-request journey preserves resource context", async ({ page }) => {
  const lead = syntheticLead("resource");
  await page.goto("/en/resources");
  await page
    .getByRole("link", { name: /Request/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/en\/contact\?resource=/);

  await fillBaseLeadFields(page, lead);
  const reference = await submitAndCaptureReference(page, "Request Guide");

  const row = await fetchLeadByReference(reference);
  expect(row?.leadType).toBe("resource-request");
  expect(row?.resourceSlug).toBeTruthy();
});

test("course query-parameter context reaches the lead record", async ({ page }) => {
  const lead = syntheticLead("course-context");
  await page.goto("/en/contact?course=ielts-preparation");
  // The course context drives the form heading ("Register for <course>").
  await expect(
    page.getByRole("heading", { name: /Register for/ }).first()
  ).toBeVisible();

  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Message" }).fill("E2E synthetic course-context enquiry.");
  const reference = await submitAndCaptureReference(page, "Ask Admissions");

  const row = await fetchLeadByReference(reference);
  expect(row?.courseSlug).toBe("ielts-preparation");
});

test("UTM parameters are stored with the lead", async ({ page }) => {
  const lead = syntheticLead("utm");
  await page.goto(
    "/en/contact?utm_source=e2e-source&utm_medium=e2e-medium&utm_campaign=e2e-campaign"
  );
  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Message" }).fill("E2E synthetic UTM enquiry.");
  const reference = await submitAndCaptureReference(page, "Send Admission Enquiry");

  const row = await fetchLeadByReference(reference);
  expect(row).toMatchObject({
    utmSource: "e2e-source",
    utmMedium: "e2e-medium",
    utmCampaign: "e2e-campaign"
  });
});

test("failed submission keeps values and offers phone and WhatsApp fallback", async ({
  page
}) => {
  const lead = syntheticLead("failure");
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

  await page.goto("/en/contact");
  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Message" }).fill("E2E synthetic failure-state enquiry.");
  await page.getByRole("button", { name: "Send Admission Enquiry" }).click();

  await expect(
    page.getByRole("alert").filter({ hasText: /could not send/i })
  ).toBeVisible();
  const form = page.locator("form");
  await expect(form.getByRole("link", { name: /^Call/ })).toHaveAttribute(
    "href",
    "tel:+97165687222"
  );
  await expect(
    form.getByRole("link", { name: /WhatsApp admissions/ })
  ).toHaveAttribute("href", /wa\.me/);

  // The visitor's input must survive the failure.
  await expect(page.getByRole("textbox", { name: "Full name" })).toHaveValue(lead.name);
  await expect(page.getByRole("textbox", { name: "Message" })).toHaveValue(
    "E2E synthetic failure-state enquiry."
  );
});

test("submit button blocks duplicate submissions while loading", async ({ page }) => {
  const lead = syntheticLead("noduplicate");
  let requestCount = 0;

  await page.route("**/api/leads", async (route) => {
    requestCount += 1;
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        referenceId: "BTI-E2E001",
        deliveryStatus: "delivered",
        message: "Thank you."
      })
    });
  });

  await page.goto("/en/contact");
  await fillBaseLeadFields(page, lead);
  await page.getByRole("textbox", { name: "Message" }).fill("E2E synthetic duplicate-click test.");

  await page.getByRole("button", { name: "Send Admission Enquiry" }).click();

  // While the request is in flight the button is disabled and reads "Sending...".
  const sending = page.getByRole("button", { name: "Sending..." });
  await expect(sending).toBeDisabled();
  // Clicks while in flight must not produce additional requests.
  await sending.click({ force: true });
  await sending.click({ force: true });

  await expect(page.getByText(/Reference: BTI-E2E001/)).toBeVisible({
    timeout: 15_000
  });
  expect(requestCount).toBe(1);
});
