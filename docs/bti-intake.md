# BTI Information Intake

Tracks what British Training Institute has provided and what is still outstanding
before launch. The website is built and deploy-ready; nothing is fabricated —
until an item is provided, the site hides the related section or uses neutral
wording.

**Legend:** ✅ confirmed / done · ⏳ pending. Run `pnpm check:readiness` for the
live launch gate.

## 1. Identity & contact (NAP) — ✅ Confirmed by BTI

All set in `src/config/site.ts`.

| Item | Confirmed value |
| --- | --- |
| Official/legal business name | British Training Institute |
| Public address | Corniche St, Al Shiokh, Hay Al Gharb, Sharjah, United Arab Emirates |
| Landline | +971 6 568 7222 |
| Mobile | +971 52 545 0385 |
| WhatsApp | +971 52 545 0385 |
| Toll-free | 800 284747 |
| Public email | info@britishinstitute.ae |
| Opening hours | Saturday–Thursday 9:00 AM – 9:00 PM; Friday closed |

## 2. Domain & email — ✅ Decided

| Item | Decision | Where it goes |
| --- | --- | --- |
| Canonical domain | `britishinstitute.ae` (registrar tasjeel.ae, hosting on GoDaddy) | set `NEXT_PUBLIC_SITE_URL=https://britishinstitute.ae` at deploy |
| Public email | `info@britishinstitute.ae` | `src/config/site.ts` email |

No legacy domains require redirects — `britishinstitute.ae` is the only domain.
Remaining at launch: point DNS at the host and confirm email auth (SPF/DKIM/DMARC).

## 3. Social & map — ✅ Confirmed (defaults set in `src/config/site.ts`)

| Channel | URL |
| --- | --- |
| Instagram | https://www.instagram.com/british_training.institute |
| Facebook | https://www.facebook.com/btiuae |
| LinkedIn | https://www.linkedin.com/company/british-training-instiute/ |
| Google Business Profile | https://share.google/klnD7wkVJfpjWuH0v |
| Map / directions | https://maps.app.goo.gl/VsEtaMCcnPVDb99Y6 |

Each can be overridden per environment via the matching `NEXT_PUBLIC_*` env var.

## 4. Course data (per course) — ⏳ Pending

~88 of 101 courses still publish neutral "available on request" placeholders. For
each, BTI supplies the nine detail fields — see `docs/course-content-needed.md`
(run `pnpm courses:audit` for the live count). Content lives in
`src/content/catalogue/<department>.ts`; setting `contentStatus: "complete"`
fills the page and the PDF brochure automatically.

## 5. Trust evidence (`siteConfig.featureFlags`)

Text claims BTI confirmed in writing are **live**; logo image files and
testimonials stay hidden until official assets + permission arrive.

| Flag | Status | Notes |
| --- | --- | --- |
| showFoundingYearText | ✅ on | Established 2002, confirmed in writing. |
| showKeyStats | ✅ on | 20+ years, 10,000+ learners, 100+ courses, 500+ corporate clients. |
| showIeltsTestCentre | ✅ on | IELTS Test Centre, confirmed in writing. |
| showCambridgePartner | ✅ on | Cambridge-affiliated / Cambridge English prep, confirmed in writing. |
| showIsoCertified | ✅ on | ISO-certified QMS claim, confirmed in writing. |
| showAccreditationLogos | ⏳ off | Needs official logo files + permission. The ISO logo on hand is watermarked stock and Cambridge needs the correct mark — see `docs/website-rebuild-handoff.md` §11. |
| showPartnerLogos | ⏳ off | Display permission + brand guidelines. |
| showTestimonials | ⏳ off | Written consent + name/display approval + date. |

BTI also requested a dedicated **Accreditations & Partnerships page** — not built yet.

## 6. Photography — ⏳ Pending real BTI photos

Stock placeholders are in place for the homepage hero, About/Contact location and
Corporate training (see `docs/image-credits.md`). The real BTI signboard
(`public/images/Building_Board.jpg`) is already used on the homepage credibility
band and the Contact page. Replace the stock images with approved, licensed BTI
photography in the `src/config/media.ts` slots — drop-in, no code change.
Per-course images: drop at `public/images/courses/<slug>.jpg` and set
`imageSrc`/`imageAlt` on the course. See `docs/visual-polish-deferred-items.md`.

## 7. Legal & consent — ⏳ Draft, not published

| Item | Where it goes |
| --- | --- |
| Review/approve privacy, cookies, terms (currently `state: "draft"`) | `src/content/legal.ts` + publish via `legalPages.*.state` (docs/legal-review.md) |
| Cookie-consent decision (banner vs none) | `requireCookieConsent` flag + docs/analytics-events.md |
| Data retention period, privacy contact, named processors | `src/content/legal.ts` |

The accessibility statement is already published.

## 8. Analytics — ⏳ Pending decision

Google Analytics is off (no `NEXT_PUBLIC_GA_MEASUREMENT_ID`). BTI to decide
whether to use analytics and, if so, the cookie-consent approach
(docs/analytics-events.md).

## 9. Arabic (later)

`featureFlags.enableArabic` is off. Native-reviewed Arabic translations for every
page → `src/content/i18n.ts`, then enable the flag. English-first launch does not
need this.

## 10. Service credentials (provision at launch) — ⏳ Pending

Hosted PostgreSQL, Upstash Redis REST, Cloudflare Turnstile keys, Odoo/generic
webhook endpoint + secret, retry cron secret, admin password, monitoring
(Sentry). Captured in `.env.production.example`.

---

**Confirmed and built-in:** identity/NAP, domain, socials, map/GBP, and the
written credibility claims. **Outstanding before launch:** detailed course
content, trust *assets* (logos/certs/testimonials), real photography, legal-page
review + publish, the analytics/consent decision, and production service
credentials.
