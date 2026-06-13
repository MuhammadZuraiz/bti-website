# Operations Runbook

Recommendations for running the site in production. Nothing here claims an
external system is already configured — treat every section as setup work
with its own owner.

## Recommended operational baseline

- Daily automated database backup.
- Weekly restore verification (restore into a scratch database, run
  `pnpm db:verify` against it).
- Lead retry cron every 5–15 minutes.
- Daily queued-lead review.
- Monthly access review (hosting, database, DNS, Cloudflare, registrar).
- Quarterly public-listing review (see docs/local-seo-checklist.md).

## Hosted PostgreSQL

- Any managed provider works (Neon, Supabase, RDS, Railway, Render, etc.).
- Create the production database, set `DATABASE_URL`, run `pnpm db:deploy`.
- Enable provider backups (daily minimum) and point-in-time recovery if
  available.
- Restore test: restore the latest backup into a scratch database, set
  `DATABASE_URL` to it locally, run `pnpm db:verify`, drop the scratch DB.

## Redis REST (rate limiting)

- Upstash Redis REST or compatible. Set `UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN`.
- Without these, production lead submission fails closed (by design).

## Turnstile

- Create a Cloudflare Turnstile widget for the canonical domain.
- Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`.
- Use the official test keys on staging only.

## Webhook delivery

- Set `ODOO_LEAD_WEBHOOK_URL` (+ secret) when the Odoo endpoint exists, or
  `GENERIC_LEAD_WEBHOOK_URL` (+ secret) as the interim destination.
- Delivery failures keep leads queued in PostgreSQL — nothing is lost.
- See docs/odoo-integration.md for payload and signature details.

## Retry cron

- Schedule `POST /api/internal/retry-leads` with header
  `x-bti-cron-secret: <LEAD_RETRY_CRON_SECRET>` every 5–15 minutes.
- See docs/lead-retry-runbook.md for behaviour and manual recovery.

## Queued-lead review (daily)

1. Check logs for `lead_delivery_queued` / `lead_retry_still_queued`.
2. Or query: `SELECT "publicReference", "createdAt", "deliveryAttempts",
   "failureReason" FROM "LeadSubmission" WHERE "deliveryStatus" != 'delivered'
   ORDER BY "createdAt";`
3. If a webhook outage caused a backlog, fix the webhook, then trigger the
   retry endpoint manually.
4. `pnpm leads:export` produces a CSV for admissions if manual follow-up is
   needed (docs/lead-export-runbook.md).

## Monitoring and logs

- The app logs structured JSON events (no PII): persistence, delivery,
  retries, spam blocks, environment validation failures.
- Forward platform logs to a provider (Sentry/Axiom/Better Stack — BTI's
  choice). Alert on: `lead_persistence_failed`, `lead_environment_invalid`,
  sustained `lead_delivery_queued`, and HTTP 5xx rates.
- Uptime check on `/en` plus a weekly synthetic form submission on staging.

## Incident response: submissions failing

1. Confirm via uptime check and a synthetic submission.
2. Check logs: `lead_environment_invalid` (config), `lead_persistence_failed`
   (database), `lead_submission_blocked` spikes (spam config).
3. Database down → restore service; visitors meanwhile see the fail-closed
   message with phone/WhatsApp fallback, so calls still arrive.
4. Webhook down → no action urgent; leads queue and retry automatically.
5. After recovery: run the retry endpoint, export a CSV, confirm admissions
   received everything.

## Ownership and security

- Named owners required for: domain renewals, DNS, Cloudflare, hosting,
  database, webhook endpoint, retry cron, monitoring.
- MFA on every provider account; no shared logins.
- Secrets live in the hosting provider's secret store — never in Git.
- Rotate `LEAD_RETRY_CRON_SECRET`, webhook secrets and database credentials
  on staff departure or suspected exposure; rotation is a config change plus
  redeploy.
- Staff handover: walk through this runbook, transfer ownership rows, rotate
  all secrets the departing person held.
