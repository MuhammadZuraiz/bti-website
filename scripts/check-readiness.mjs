// Delivery-readiness report: shows what still needs BTI inputs / credentials
// before go-live. Read-only; safe to run anytime. Exits non-zero if any
// production-required environment variable is missing so it can gate a deploy.
//
// Usage: pnpm check:readiness
import { readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(file) {
  try {
    return readFileSync(path.join(root, file), "utf8");
  } catch {
    return "";
  }
}

const siteConfigSource = read("src/config/site.ts");

// Placeholder values that must be confirmed by BTI before launch. Update these
// if any field is reverted to an unconfirmed value. (BTI confirmed the core
// identity details on 2026-06-16.)
const placeholderChecks = [
  ["address (old placeholder)", "Bank Street, CB Building"],
  ["email (old placeholder)", "info@britain-institute.com"],
  ["siteUrl localhost", "localhost:3000"]
];

const sections = [];

// 1. Business data still at placeholder values.
const placeholders = placeholderChecks
  .filter(([, value]) => siteConfigSource.includes(value))
  .map(([label]) => label);
sections.push({
  title: "Business data still using placeholder values (confirm with BTI)",
  items: placeholders,
  okWhenEmpty: true
});

// 2. Empty business fields.
const emptyFields = [];
if (/openingHours:\s*\[\]/.test(siteConfigSource)) emptyFields.push("openingHours (empty)");
if (/parkingNotes:\s*""/.test(siteConfigSource)) emptyFields.push("parkingNotes (empty)");
if (/landmarkNotes:\s*""/.test(siteConfigSource)) emptyFields.push("landmarkNotes (empty)");
sections.push({
  title: "Business fields not yet provided",
  items: emptyFields,
  okWhenEmpty: true
});

// 3. Feature flags still off (need evidence/approval before enabling).
const offFlags = [...siteConfigSource.matchAll(/(\w+):\s*false/g)]
  .map((match) => match[1])
  .filter((name) => name.startsWith("show") || name === "enableArabic" || name === "requireCookieConsent");
sections.push({
  title: "Feature flags off (enable only with approved evidence)",
  items: offFlags,
  okWhenEmpty: true
});

// 4. Draft legal pages.
const draftLegal = [...siteConfigSource.matchAll(/(\w+):\s*\{\s*state:\s*"draft"\s*\}/g)].map(
  (match) => match[1]
);
sections.push({
  title: "Legal pages still draft (review + publish per docs/legal-review.md)",
  items: draftLegal,
  okWhenEmpty: true
});

// 5. Production-required environment variables.
const requiredEnv = [
  "DEPLOYMENT_ENV",
  "NEXT_PUBLIC_SITE_URL",
  "DATABASE_URL",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "TURNSTILE_SECRET_KEY",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
  "LEAD_RETRY_CRON_SECRET",
  "LEAD_ADMIN_PASSWORD"
];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
const hasWebhook =
  process.env.ODOO_LEAD_WEBHOOK_URL || process.env.GENERIC_LEAD_WEBHOOK_URL;
if (!hasWebhook) {
  missingEnv.push("ODOO_LEAD_WEBHOOK_URL or GENERIC_LEAD_WEBHOOK_URL");
}
sections.push({
  title: "Production environment variables not set in this shell",
  items: missingEnv,
  okWhenEmpty: true,
  gating: true
});

// Report.
let gatingFailures = 0;
console.info("BTI delivery-readiness report\n" + "=".repeat(40));
for (const section of sections) {
  if (section.items.length === 0) {
    console.info(`\n[ok] ${section.title}: none`);
    continue;
  }
  console.info(`\n[${section.gating ? "MISSING" : "todo"}] ${section.title}:`);
  for (const item of section.items) {
    console.info(`   - ${item}`);
  }
  if (section.gating) {
    gatingFailures += section.items.length;
  }
}

console.info("\n" + "=".repeat(40));
if (gatingFailures > 0) {
  console.info(
    `Not deploy-ready: ${gatingFailures} required environment variable(s) missing.`
  );
  console.info("(Business/content TODOs above are informational, not blocking.)");
  process.exit(1);
}
console.info("All production environment variables are set.");
console.info("Review the business/content TODOs above before public launch.");
