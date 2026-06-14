# British Training Institute Sharjah — Website

Production Next.js website for British Training Institute (BTI) Sharjah, focused
on credibility and capturing qualified admissions and corporate-training
enquiries without losing leads.

## Tech stack

Next.js (App Router) · TypeScript · React · Tailwind CSS · Prisma · PostgreSQL ·
Zod · Vitest · Playwright. Package manager: pnpm (Node version in `.nvmrc`).

## What's included

- Public site: home, about, courses + 8 course pages, placement test, corporate
  training, resources, FAQ, contact, accessibility.
- Database-first lead capture with spam protection (honeypot, Cloudflare
  Turnstile, Redis rate limits), durable queueing and a protected retry endpoint.
- Staff lead admin at `/admin/leads` (view, filter, detail, CSV export).
- Deployment-environment indexing model, env-gated robots/sitemap/canonical,
  JSON-LD, security headers (CSP/HSTS/…), GitHub Actions CI, and Playwright E2E +
  Axe accessibility tests.
- Draft legal pages (privacy/cookies/terms) gated until reviewed; accessibility
  statement published.
- Bilingual-ready (Arabic behind a flag until translations are reviewed).

## Run locally

```bash
pnpm install
POSTGRES_PORT=5433 docker compose up -d postgres   # native PG may own 5432
cp .env.example .env.local                          # then fill local values
pnpm db:generate
pnpm db:deploy
pnpm dev
```

## Scripts

```bash
pnpm dev / build / start
pnpm lint        # ESLint (JS + TS/TSX) across src, tests, e2e, scripts
pnpm lint:ts     # focused TypeScript lint
pnpm typecheck
pnpm test        # Vitest unit tests
pnpm test:e2e    # Playwright browser E2E + Axe (needs PostgreSQL)
pnpm db:deploy / db:verify / leads:export
pnpm check:seo-headers <url> <env>   # verify headers/robots/sitemap
pnpm check:readiness                 # what still needs BTI inputs/credentials
```

## Deployment environments

`DEPLOYMENT_ENV` (build time) selects `development | preview | staging |
production`. Only `production` is indexable; everything else emits noindex
(robots, sitemap, meta, `X-Robots-Tag`). A deployed build without the variable
defaults to `preview` and is never indexed. See `docs/staging-deployment.md`.

## Staff lead admin

Authenticated staff view and export enquiries at `/admin/leads` (HTTP Basic auth
via `LEAD_ADMIN_USER` / `LEAD_ADMIN_PASSWORD`, required in production). The area
is noindexed and disallowed in robots.txt. See `docs/handover-guide.md`.

## Key documentation

- `docs/handover-guide.md` — day-to-day operation (viewing leads, editing content)
- `docs/bti-intake.md` — the business inputs/credentials needed to go live
- `docs/launch-checklist.md` — full pre-launch checklist
- `docs/staging-deployment.md` — recommended hosting + deploy procedure
- `docs/operations-runbook.md` — backups, monitoring, incident response
- `docs/legal-review.md` — reviewing and publishing the legal pages
- `docs/lead-capture-architecture.md`, `docs/odoo-integration.md`,
  `docs/spam-protection.md`, `docs/seo-plan.md`, `docs/release-process.md`,
  `docs/redirect-map.md`, `docs/local-seo-checklist.md`,
  `docs/analytics-events.md`, `docs/accessibility-checklist.md`,
  `docs/performance-checklist.md`, `docs/client-demo.md`

## Not production-ready until BTI confirms

Canonical domain + redirect ownership, trade-licence details, final course
catalogue/fees/schedules, contact NAP + hours, social/map URLs, legal-page
approvals + cookie-consent decision, Arabic copy, email + DNS (SPF/DKIM/DMARC),
and service credentials (PostgreSQL, Redis, Turnstile, Odoo/webhook, monitoring).
Run `pnpm check:readiness` for the live status and see `docs/bti-intake.md`.
