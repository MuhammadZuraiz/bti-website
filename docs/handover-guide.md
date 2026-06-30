# BTI Website Handover Guide

A practical guide for running the website day to day. Written for non-deep
technical staff plus whoever maintains the code.

## What the website does

- Public marketing site (home, about, courses + 8 course pages, placement test,
  corporate training, resources, FAQ, contact, accessibility).
- Every enquiry form saves the lead to the database **first**, then delivers it
  to the CRM/webhook. If delivery fails, the lead is safely queued and retried —
  nothing is lost.
- Spam/abuse protection (honeypot, Turnstile, rate limits) runs on every form.

## Viewing and acting on enquiries

1. Go to `https://<your-domain>/admin/leads`.
2. Sign in with the admin username/password (the `LEAD_ADMIN_USER` /
   `LEAD_ADMIN_PASSWORD` values configured at deploy).
3. You'll see every enquiry with its reference, date, type, name, contact and
   delivery status. Filter by status (queued / delivered / failed-delivery).
4. Click a reference to see the full enquiry (message, course, company,
   attribution).
5. **Download CSV** exports all enquiries for spreadsheets or follow-up.

The admin area is private (password-protected) and is never indexed by search
engines. Share the password only with staff who handle admissions, and change
it if someone leaves (see "Rotating secrets").

### Lead statuses

- **delivered** — sent to the CRM/webhook successfully.
- **queued** — saved safely, waiting for the next delivery attempt.
- **failed-delivery** — reached the retry limit; follow up manually from the
  admin list or CSV and check the webhook/CRM.

Review queued/failed leads daily until CRM delivery is proven stable.

## Updating common content (developer)

| To change… | Edit… |
| --- | --- |
| Phone, address, email, hours, social, map | `src/config/site.ts` (and the `NEXT_PUBLIC_*` env for URLs) |
| Course details (schedule, fees, text, image) | `src/content/catalogue/<department>.ts` |
| Publish a legal page | set its `state` to `"published"` in `src/config/site.ts` (docs/legal-review.md) |
| Turn on a trust claim | the relevant `featureFlags` in `src/config/site.ts` — only with approved evidence |
| Add a photo | drop the file under `public/images/…` per `src/config/media.ts` |

After any change: open a pull request, let CI pass, then deploy (the hosting
platform redeploys on merge to `main`).

## Enabling Arabic later

The site is bilingual-ready but Arabic is off. When native-reviewed Arabic
copy exists in `src/content/i18n.ts`, set `featureFlags.enableArabic = true`.
Do an RTL review (docs/accessibility-checklist.md) before launch.

## External accounts (assign an owner for each)

Hosting (Vercel), PostgreSQL (Neon), Redis (Upstash), Turnstile (Cloudflare),
CRM/webhook (Odoo), domain registrar, DNS, monitoring (Sentry), Google Search
Console + Bing. Use MFA everywhere; no shared logins. See
`docs/operations-runbook.md`.

## Rotating secrets

Change a secret in the hosting platform's environment settings, then redeploy.
Rotate the admin password, retry/cron secret, webhook secrets and database
credentials whenever a staff member leaves or a secret may be exposed.

## Routine & support

- Daily: review new + queued enquiries (admin page); check uptime/error alerts.
- Weekly: verify a database backup restores.
- Monthly: review external-account access.
- Quarterly: review public listings (docs/seo-plan.md).
- Pre-launch and ongoing references: `docs/launch-checklist.md`,
  `docs/operations-runbook.md`, `docs/release-process.md`.
