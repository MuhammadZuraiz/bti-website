import { expect, type Page } from "@playwright/test";
import { Client } from "pg";
import { e2eDatabaseUrl } from "../playwright.config";

export function uniqueId() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function syntheticLead(label: string) {
  const id = uniqueId();
  return {
    name: `E2E ${label} ${id}`,
    email: `e2e-${label}-${id}@bti.invalid`
  };
}

export async function fillBaseLeadFields(
  page: Page,
  lead: { name: string; email: string }
) {
  await page.getByRole("textbox", { name: "Full name" }).fill(lead.name);
  await page.getByRole("textbox", { name: "Email" }).fill(lead.email);
  await page.getByLabel("Preferred contact").selectOption("email");
  await page.getByRole("checkbox").check();
}

export async function submitAndCaptureReference(page: Page, submitLabel: string | RegExp) {
  await page.getByRole("button", { name: submitLabel }).click();
  const reference = page.getByText(/Reference: BTI-[A-F0-9]+/);
  await expect(reference).toBeVisible({ timeout: 20_000 });
  const text = await reference.innerText();
  const match = text.match(/BTI-[A-F0-9]+/);
  expect(match).not.toBeNull();
  return match![0];
}

type LeadRow = {
  publicReference: string;
  leadType: string;
  deliveryStatus: string;
  fullName: string;
  email: string | null;
  courseSlug: string | null;
  resourceSlug: string | null;
  sourcePage: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

export async function fetchLeadByReference(reference: string): Promise<LeadRow | undefined> {
  const client = new Client({ connectionString: e2eDatabaseUrl });
  await client.connect();
  try {
    const result = await client.query<LeadRow>(
      'SELECT "publicReference", "leadType", "deliveryStatus", "fullName", "email", "courseSlug", "resourceSlug", "sourcePage", "utmSource", "utmMedium", "utmCampaign" FROM "LeadSubmission" WHERE "publicReference" = $1',
      [reference]
    );
    return result.rows[0];
  } finally {
    await client.end();
  }
}
