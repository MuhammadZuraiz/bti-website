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
- Vitest tests
- ESLint

## Local Setup

```bash
pnpm install
pnpm dev
```

If using npm:

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run lint
npm run typecheck
npm run test
npm run build
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
ODOO_LEAD_WEBHOOK_URL=
ODOO_LEAD_WEBHOOK_SECRET=
GENERIC_LEAD_WEBHOOK_URL=
GENERIC_LEAD_WEBHOOK_SECRET=
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

The helper in `src/lib/analytics.ts` safely does nothing unless `window.gtag` is configured. Add the GA script only after cookie/consent decisions are approved.

## Odoo Webhook Integration

Set `ODOO_LEAD_WEBHOOK_URL` and optional `ODOO_LEAD_WEBHOOK_SECRET`. The lead API validates submissions, captures UTM fields and can post CRM-ready payloads to Odoo or a middleware endpoint.

## Deployment

Deploy on a platform that supports Next.js App Router. Set `NEXT_PUBLIC_SITE_URL` to the canonical production domain before launch, then verify sitemap, robots, form delivery and Search Console indexing.

## Facts Requiring Approval

Canonical domain, email domain, WhatsApp number, full address wording, opening hours, course list, schedules, fees, durations, certificates, Arabic legal copy, photography, accreditation, partner logos, testimonials, Google Business Profile URL, map URL and Odoo endpoint all require business approval before production.
