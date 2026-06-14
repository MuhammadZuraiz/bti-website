# Staging Deployment

Deploy to staging only when credentials exist and the owner authorises it.
This document describes the procedure; nothing has been deployed.

## Hostname

Recommended: `staging.<canonical-domain>` once the canonical domain is
approved. Until then, the hosting provider's generated URL is acceptable —
staging is fully noindexed either way.

## Required environment variables

Build-time and runtime (set both in the hosting platform):

```text
DEPLOYMENT_ENV=staging
NEXT_PUBLIC_SITE_URL=https://<staging-hostname>
DATABASE_URL=<staging PostgreSQL connection string>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<Cloudflare test site key>
TURNSTILE_SECRET_KEY=<Cloudflare test secret key>
UPSTASH_REDIS_REST_URL=<staging Redis REST URL>
UPSTASH_REDIS_REST_TOKEN=<staging Redis REST token>
GENERIC_LEAD_WEBHOOK_URL=<safe staging destination, e.g. a webhook.site-style inspector or internal test receiver>
GENERIC_LEAD_WEBHOOK_SECRET=<staging secret>
LEAD_RETRY_CRON_SECRET=<staging-only secret, 16+ chars>
LEAD_HASH_SALT=<staging-only salt>
```

Notes:

- `DEPLOYMENT_ENV=staging` must be present **at build time**: robots,
  sitemap and metadata are generated during the build.
- Staging validation requires `NEXT_PUBLIC_SITE_URL` to be HTTPS and not
  example.com.
- Cloudflare publishes official Turnstile test keys (always-pass /
  always-fail); use them on staging only.
- Never point the staging webhook at the production Odoo endpoint.
- `ALLOW_DEV_*` flags must NOT be set — staging runs the real protections.

## Database migration

```bash
DATABASE_URL=<staging url> pnpm db:deploy
DATABASE_URL=<staging url> pnpm db:verify
```

## Post-deploy verification

```bash
pnpm check:seo-headers https://<staging-hostname> staging
```

This asserts: noindex header and meta, robots.txt disallow-all, empty
sitemap, security headers (CSP, HSTS, nosniff, Referrer-Policy,
Permissions-Policy, X-Frame-Options), canonical presence and single H1.

Then smoke test manually:

1. Submit a synthetic lead with the Turnstile test widget.
2. Confirm the reference is shown and the row exists in the staging DB.
3. Force the staging webhook to fail; confirm the lead queues.
4. Call the retry endpoint with the staging cron secret; confirm delivery.
5. Run `pnpm leads:export` against the staging database.

If a future integration conflicts with the CSP, set `CSP_REPORT_ONLY=true`
on staging to observe violations without breakage, fix the origin list in
`src/config/security-headers.ts`, then remove the flag. Production should
always run the enforced policy.

## Rollback

Redeploy the previous build (platform rollback) — staging is stateless
outside its database. For migration problems, drop and recreate the staging
database, then `pnpm db:deploy` again.

## Promotion to production

Production launch is a separate checklist: docs/launch-checklist.md.
Key differences from staging: `DEPLOYMENT_ENV=production`, the canonical
`NEXT_PUBLIC_SITE_URL`, real Turnstile keys, the real webhook endpoint,
production database with backups, and the retry cron.

## Recommended stack (Vercel + Neon + Upstash + Turnstile)

This is the lowest-ops fit for the architecture; the project is not locked to
it (portable fallback below).

| Concern | Service | Notes |
| --- | --- | --- |
| App hosting | Vercel | Native Next.js App Router; per-environment env vars. |
| PostgreSQL | Neon | Use the **pooled** connection string for `DATABASE_URL` (serverless opens many short-lived connections). Supabase/RDS are drop-in. |
| Rate limiting | Upstash Redis REST | The code already speaks Upstash REST. |
| Bot protection | Cloudflare Turnstile | Test keys on staging, real keys in production. |
| Retry cron | Vercel Cron | Defined in `vercel.json` (every 10 min → `/api/internal/retry-leads`). |
| Monitoring | Vercel logs + Sentry | The structured logger is provider-agnostic. |

### Vercel setup

1. Import the GitHub repo into Vercel. Build command is the default
   (`pnpm build`, which runs `prisma generate && next build`).
2. Set environment variables per environment (Production / Preview). Use
   `.env.production.example` as the checklist. Critically:
   - **Production env**: `DEPLOYMENT_ENV=production` + the canonical
     `NEXT_PUBLIC_SITE_URL`.
   - **Preview env**: `DEPLOYMENT_ENV=preview` (preview deploys are noindexed
     by the fail-safe default even if unset).
3. **Cron auth**: Vercel Cron calls the cron path with
   `Authorization: Bearer $CRON_SECRET`. Set a Vercel env var
   `CRON_SECRET` equal to `LEAD_RETRY_CRON_SECRET` so the retry endpoint
   accepts the scheduled call. The cron schedule itself lives in `vercel.json`.
4. Point DNS at Vercel and attach the canonical domain (production only).

### Portable single-platform fallback (Railway / Render / Fly / VPS)

If BTI prefers one platform for app + database: run the app as a Node server
(`pnpm build` then `pnpm start`), use the platform's managed PostgreSQL for
`DATABASE_URL`, and replace Vercel Cron with the platform scheduler (or any
external cron) issuing:

```
POST https://<domain>/api/internal/retry-leads
x-bti-cron-secret: <LEAD_RETRY_CRON_SECRET>
```

Everything else (env vars, migrations, verification) is identical.

## Deploy-readiness gate

Before any deploy, with the target env loaded:

```bash
pnpm check:readiness
```

It exits non-zero if a production-required variable is missing and lists the
remaining business/content TODOs.
