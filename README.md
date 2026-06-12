# British Training Institute Sharjah Website

Production-oriented Next.js website for British Training Institute Sharjah, built to improve credibility, course discovery, admissions enquiries, placement-test requests, corporate-training leads, local SEO readiness and future Odoo CRM integration.

## Tech Stack

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- `next/image`
- Lucide icons
- Zod validation
- React Hook Form
- Prisma ORM
- PostgreSQL
- Vitest tests
- ESLint

## Local Setup

```bash
pnpm install
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm dev
```

This project is managed with pnpm. Do not add npm or Yarn lockfiles.

## Scripts

```bash
pnpm lint                # ESLint across JS and TypeScript (src, tests, scripts, configs)
pnpm lint:ts             # focused TypeScript-only lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:generate
pnpm db:migrate          # local migration development
pnpm db:deploy           # staging and production deployment
pnpm db:verify           # synthetic insert/read/delete round-trip + index check
pnpm db:studio
pnpm test:webhook-server # development-only webhook receiver for smoke tests
pnpm leads:export
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill approved values:

```text
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_MAP_URL=
NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL=
NEXT_PUBLIC_INSTAGRAM_URL=
NEXT_PUBLIC_FACEBOOK_URL=
NEXT_PUBLIC_LINKEDIN_URL=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
DATABASE_URL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
ODOO_LEAD_WEBHOOK_URL=
ODOO_LEAD_WEBHOOK_SECRET=
GENERIC_LEAD_WEBHOOK_URL=
GENERIC_LEAD_WEBHOOK_SECRET=
LEAD_RETRY_CRON_SECRET=
LEAD_HASH_SALT=
```

## Update Contact Information

Edit `src/config/site.ts`. All public business details should flow from `siteConfig`; avoid hardcoding contact values in components.

## Add a Course

Add an object to `src/content/courses.ts` using the `Course` type in `src/types/course.ts`. Keep fees, schedules, duration, certificate details and claims approval-based unless confirmed by BTI.

## Add Arabic Translations

Update `src/content/i18n.ts`. Arabic routes already exist under `/ar` and the locale wrapper sets RTL direction.

## Replace Placeholder Images

Keep the logo unchanged at `public/images/bti-logo.jpg`. Add approved photography under `public/images/` and update components only after usage rights, consent and alt text are confirmed.

## Analytics

The helper in `src/lib/analytics.ts` safely does nothing unless `window.gtag` is configured. Conversion events fire only after durable lead persistence returns `ok: true`.

## Lead Capture

Lead capture is database-first: `/api/leads` validates submissions, applies spam controls, saves the lead in PostgreSQL, then attempts Odoo and generic webhook delivery. Visitors receive a success message only after PostgreSQL persistence.

Read:

- `docs/lead-capture-architecture.md`
- `docs/odoo-integration.md`
- `docs/production-environment.md`
- `docs/spam-protection.md`
- `docs/lead-retry-runbook.md`
- `docs/lead-export-runbook.md`
- `docs/local-integration-testing.md`

## Deployment

Deploy on a platform that supports Next.js App Router and PostgreSQL. Set `NEXT_PUBLIC_SITE_URL` to the canonical production domain before launch, run `pnpm db:deploy`, configure Turnstile, Redis, a lead webhook, the retry cron secret, and verify sitemap, robots, form delivery and Search Console indexing.

## Facts Requiring Approval

Canonical domain, email domain, WhatsApp number, full address wording, opening hours, course list, schedules, fees, durations, certificates, Arabic translations, privacy/cookie/terms wording, photography, accreditation, partner logos, testimonials, Google Business Profile URL, map URL and Odoo endpoint all require business approval before production.
