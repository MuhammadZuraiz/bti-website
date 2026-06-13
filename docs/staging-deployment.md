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

## Platform notes

Any Node-capable Next.js host works (Vercel, Netlify, Railway, Render,
Fly.io, a VPS with a process manager). On Vercel specifically: map
`DEPLOYMENT_ENV` per environment (production → `production`, preview →
`preview`), and remember preview deployments are noindexed automatically by
the fail-safe default even if the variable is missing. The project is not
locked to any provider.
