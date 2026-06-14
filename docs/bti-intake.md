# BTI Information Intake

Everything the website needs from British Training Institute to go live. The
website is built and deploy-ready; these are the only remaining inputs. Fill in
each item; the "Where it goes" column tells the developer exactly what to update.

Until an item is provided, the site safely hides the related section or uses
neutral wording — nothing is fabricated.

## 1. Identity & contact (NAP)

| Item | Value to confirm | Where it goes |
| --- | --- | --- |
| Official/legal business name | | `src/config/site.ts` businessName |
| Address wording (public) | | `src/config/site.ts` address |
| Landline (display + tel) | | `src/config/site.ts` landlineDisplay/landlineHref |
| Mobile (display + tel) | | `src/config/site.ts` mobileDisplay/mobileHref |
| WhatsApp number | | `src/config/site.ts` whatsappNumber |
| Public email | | `src/config/site.ts` email |
| Opening hours | | `src/config/site.ts` openingHours[] |

## 2. Domain & email

| Item | Decision | Where it goes |
| --- | --- | --- |
| Canonical domain (btiuae.com / britain-institute.com / btiuk.org / other) | | `NEXT_PUBLIC_SITE_URL` env |
| Resolve email-domain vs redirect conflict (public email currently uses britain-institute.com, also a redirect candidate) | | site.ts email + docs/redirect-map.md |
| Registrar / DNS access owner | | docs/redirect-map.md |

## 3. Social & map

| Item | URL | Where it goes |
| --- | --- | --- |
| Instagram | | `NEXT_PUBLIC_INSTAGRAM_URL` |
| Facebook | | `NEXT_PUBLIC_FACEBOOK_URL` |
| LinkedIn | | `NEXT_PUBLIC_LINKEDIN_URL` |
| Google Business Profile | | `NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL` |
| Map / directions URL | | `NEXT_PUBLIC_MAP_URL` |

## 4. Course data (per course)

For each of the 8 courses in `src/content/courses.ts`, confirm or keep the
neutral "on request" wording:

- Duration, schedule, fees, certificate wording.
- Any correction to outcomes/audience/overview.

## 5. Trust evidence (each is OFF until proven — `siteConfig.featureFlags`)

| Flag | Evidence required to enable |
| --- | --- |
| showSpeaListing | Official SPEA profile URL/document |
| showCentreId | Official Centre ID evidence + approved wording |
| showIeltsVenueStatement | Official IELTS partner/venue listing + wording |
| showFoundingYearText | Proof reconciling logo (2002) vs records (2004) |
| showGraduateCount | Auditable source + approved wording |
| showTestimonials | Written consent + name/display approval + date |
| showAccreditationLogos | Permission to display + current certificate |
| showPartnerLogos | Display permission + brand guidelines |

## 6. Photography (optional — no placeholders shown without them)

Provide approved, licensed images with alt text per `docs/image-shot-list.md`
and the slots in `src/config/media.ts`:

- Homepage hero, About/Contact location, Corporate training.
- Per-course images: drop at `public/images/courses/<slug>.jpg` and set
  `imageSrc`/`imageAlt` on that course in `src/content/courses.ts`.

## 7. Legal & consent

| Item | Where it goes |
| --- | --- |
| Review/approve draft privacy, cookies, terms | `src/content/legal.ts` + publish via `legalPages.*.state` (docs/legal-review.md) |
| Cookie-consent decision (banner vs none) | `requireCookieConsent` flag + docs/analytics-events.md |
| Data retention period, privacy contact, named processors | `src/content/legal.ts` |

## 8. Analytics

| Item | Where it goes |
| --- | --- |
| Use website analytics? (Google Analytics ID) | `NEXT_PUBLIC_GA_MEASUREMENT_ID` |

## 9. Arabic (later)

Native-reviewed Arabic translations for every page → `src/content/i18n.ts`,
then enable `featureFlags.enableArabic`. English-first launch does not need this.

## 10. Service credentials (for the developer to provision/configure)

Hosted PostgreSQL, Upstash Redis REST, Cloudflare Turnstile keys, Odoo/generic
webhook endpoint + secret, retry cron secret, admin password, monitoring
(Sentry). Captured in `.env.production.example`.
