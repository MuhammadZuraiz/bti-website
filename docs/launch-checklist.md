# Production Launch Checklist

The single source of truth for launching the BTI website. See also
`docs/bti-intake.md` (inputs to collect) and `docs/staging-deployment.md`.

## Discovery & ownership

- [ ] Obtain latest SEDD trade-licence copy
- [ ] Obtain VAT certificate or written VAT-status confirmation
- [ ] Obtain corporate-tax registration evidence (if applicable)
- [ ] Confirm authorised signatory / production approver
- [ ] Confirm owners for registrar, DNS, hosting and email
- [ ] Confirm owners for social accounts
- [ ] Confirm admissions, finance and content owners

## Business approvals

- [ ] Canonical domain decision
- [ ] Official business name (trade-licence wording)
- [ ] Trade-licence details for legal pages
- [ ] Address wording
- [ ] Landline number
- [ ] WhatsApp number
- [ ] Public email address
- [ ] Opening hours
- [ ] Map URL / Google Business Profile link
- [ ] Social URLs (Instagram, Facebook, LinkedIn)
- [ ] Course list, schedules, delivery modes
- [ ] Fees or fee-hiding decision
- [ ] Certificate wording
- [ ] SPEA wording and centre ID display decision
- [ ] IELTS wording (venue/partner claims)
- [ ] Accreditation assets and permission to display
- [ ] Testimonials (real, with consent)
- [ ] Photography (rights + consent)
- [ ] Arabic translations review
- [ ] Legal pages (privacy, cookies, terms) wording
- [ ] Cookie-consent decision (see docs/analytics-events.md)
- [ ] Founding-year wording decision (logo shows 2002; records reportedly say 2004 — keep text silent until resolved)

## Infrastructure

- [ ] Hosting provider account + project
- [ ] DNS access confirmed
- [ ] Cloudflare (or equivalent) configured
- [ ] SSL active on canonical domain
- [ ] Email authentication configured (SPF, DKIM, DMARC)
- [ ] Hosted PostgreSQL provisioned, `DATABASE_URL` set
- [ ] Backups enabled (daily) + restore test performed
- [ ] Upstash Redis REST configured
- [ ] Turnstile site + secret keys (production widget)
- [ ] Odoo or generic webhook endpoint + secret
- [ ] Retry cron scheduled (5–15 min) with `LEAD_RETRY_CRON_SECRET`
      (on Vercel set `CRON_SECRET` to the same value)
- [ ] Staff lead-admin password set (`LEAD_ADMIN_PASSWORD`, ≥12 chars)
- [ ] Monitoring/log forwarding + alerts (docs/operations-runbook.md)
- [ ] MFA on all provider accounts
- [ ] Secrets in host secret store only
- [ ] `pnpm check:readiness` passes with the production env loaded
- [ ] `DEPLOYMENT_ENV=production` set on the production build environment
- [ ] Preview environment sets `DEPLOYMENT_ENV=preview` (noindex verified)
- [ ] Staging sets `DEPLOYMENT_ENV=staging` (noindex verified)

## SEO

- [ ] `NEXT_PUBLIC_SITE_URL=https://<canonical-domain>` at build time
- [ ] `pnpm check:seo-headers https://<domain> production` passes
- [ ] robots.txt allows crawling, blocks `/api/`
- [ ] Sitemap lists only enabled-locale, published routes
- [ ] JSON-LD validated with an external tool (see docs/seo-plan.md)
- [ ] Search Console verified + sitemap submitted
- [ ] Bing Webmaster Tools verified
- [ ] Social preview renders (OG/Twitter images)
- [ ] Favicon and icons render
- [ ] 404 page renders correctly
- [ ] Local listings aligned (docs/seo-plan.md)

## QA

- [ ] `CI=true pnpm install --frozen-lockfile`
- [ ] `pnpm lint` and `pnpm lint:ts`
- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm test:e2e` (includes Axe accessibility)
- [ ] `pnpm build` with production env
- [ ] `pnpm db:deploy` + `pnpm db:verify` against production database
- [ ] Mobile, tablet, desktop visual review (scripts/qa-screenshots.mjs)
- [ ] Form success path on staging (real Turnstile test keys)
- [ ] Form outage failure path (stop staging DB briefly or stub)
- [ ] Retry flow on staging
- [ ] `pnpm leads:export` against staging
- [ ] Analytics events verified if enabled
- [ ] Security headers verified (`pnpm check:seo-headers`)
- [ ] Lighthouse pass recorded (docs/performance-checklist.md)
- [ ] Database restore test performed
- [ ] Staff lead-admin reachable with credentials, blocked without
- [ ] Arabic RTL layout review (only if launching Arabic)

## Odoo / CRM (when integrated)

- [ ] Odoo.sh project with dev/staging/production branches
- [ ] Company details configured after licence verification
- [ ] User groups and named users created
- [ ] Lead fields + CRM stages configured
- [ ] Course products created; tax rules after finance review
- [ ] Test lead → quote → invoice → payment → enrolment/cohort
- [ ] Confirm a website enquiry appears in CRM and staff are notified

## Launch day

- [ ] Take a fresh database backup
- [ ] Deploy the tagged release
- [ ] Run `pnpm db:deploy` (production migrations)
- [ ] Verify SSL + canonical URL
- [ ] Verify robots.txt + X-Robots-Tag absent
- [ ] Verify sitemap.xml
- [ ] Enable approved redirects
- [ ] Smoke test: one synthetic lead end-to-end, confirm persistence,
      webhook delivery and reference display; delete the synthetic lead
- [ ] Confirm retry cron fired at least once (logs)
- [ ] Submit sitemap in Search Console
- [ ] Monitor logs for the first hours
- [ ] Confirm launch with stakeholders

## First week after launch

- [ ] Review new leads daily
- [ ] Review queued leads daily
- [ ] Review uptime and error logs daily
- [ ] Review Search Console coverage
- [ ] Review analytics (if enabled)
- [ ] Collect staff feedback on enquiry quality
- [ ] Fix urgent issues via the normal PR + CI flow
- [ ] Confirm backups ran every day
