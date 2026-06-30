# BTI Website — Rebuild Handoff

**Purpose:** a single document you can hand to a designer/developer to recreate the
British Training Institute (BTI) website in a **new visual design** while preserving
everything that must not change — the information architecture, content, data model,
integrations, SEO, accessibility, and the business/compliance constraints.

It is organised in two layers:

- **KEEP (design-independent):** what the new site must still do and say. Carry this
  forward verbatim or by reference.
- **REPLACE (current design — reference only):** the look, layout, and tokens of the
  current build. Useful as a starting point, free to discard.

> Source of truth for everything below is the current repo. Where a file is named,
> the new build can either reuse the same content modules or port the data into a CMS.

---

## 1. What BTI is (business facts — KEEP, all confirmed in writing)

| Field | Value |
| --- | --- |
| Legal/brand name | British Training Institute (BTI) |
| Founded | 2002 (20+ years) |
| Location | Corniche St, Al Shiokh, Hay Al Gharb, Sharjah, United Arab Emirates |
| Landline | +971 6 568 7222 |
| Mobile / WhatsApp | +971 52 545 0385 (WhatsApp: 971525450385) |
| Toll-free | 800 284747 |
| Email | info@britishinstitute.ae |
| Hours | Saturday–Thursday 9:00 AM – 9:00 PM; Friday closed |
| Instagram | british_training.institute |
| Facebook | btiuae |
| LinkedIn | british-training-instiute |
| Map | Google Maps (share link in `src/config/site.ts`) |

**Positioning:** one of the UAE's leading professional training and language education
providers. Classroom, live online, one-to-one, corporate in-house, and hybrid delivery.

**Confirmed credibility claims** — both the **text and the third-party logos are
approved for display** (BTI has confirmed usage permission). Show the official logos
alongside the claims:
- IELTS Test Centre
- Cambridge-affiliated training / Cambridge English exam-prep partner
- ISO certified quality management system
- Licensed & regulated by the relevant educational authorities in Sharjah, UAE

> Permission is granted; high-resolution official logo files still need to be sourced
> and dropped into the asset pipeline (see Section 11).

**Key stats (marketing):** 20+ years · 10,000+ learners trained · 100+ professional
courses · 500+ corporate clients.

**Mission / Vision / "Why choose BTI" / About copy:** lifted verbatim from
`src/content/institute.ts`. Reuse that file as-is; it is the approved English-only
institutional copy.

---

## 2. Tech stack (current — REPLACE/KEEP as you choose)

The current implementation is a solid, modern baseline. A redesign can keep the stack
and re-skin, or swap the front end. The **data model, content, and integrations
(Sections 4–7) are stack-independent and should survive any rebuild.**

| Layer | Current choice |
| --- | --- |
| Framework | Next.js 16 (App Router, RSC), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (`@theme` + CSS variables in `src/app/globals.css`) |
| Forms | react-hook-form + zod validation |
| Icons | lucide-react |
| DB / ORM | PostgreSQL + Prisma 7 (via `@prisma/adapter-pg`) |
| Package manager | pnpm 11; Node 22 |
| Content | Content-as-data in `src/content/**` (no external CMS today) |

**Local dev note:** native Postgres owns port 5432 on the dev machine — the project DB
runs on `POSTGRES_PORT=5433`.

---

## 3. Information architecture & routes (KEEP)

All public routes are locale-prefixed: `/{locale}/...`. Locales are `en` and `ar`;
**Arabic is built but gated off** (`featureFlags.enableArabic = false`) until
native-reviewed copy + an RTL pass land. The app is RTL-ready.

### Public pages
| Route | Page |
| --- | --- |
| `/{locale}` | Home |
| `/{locale}/about` | About BTI |
| `/{locale}/courses` | All departments + course catalogue/finder |
| `/{locale}/courses/{department}` | Department landing (its courses) |
| `/{locale}/courses/{department}/{course}` | Course detail |
| `/{locale}/placement-test` | English placement-test request |
| `/{locale}/corporate-training` | Corporate / in-house training |
| `/{locale}/resources` | Downloadable guides / lead magnets |
| `/{locale}/faq` | FAQ |
| `/{locale}/contact` | Contact + general enquiry |
| `/{locale}/privacy` `/cookies` `/terms` `/accessibility` | Legal (shown only when `state: "published"`) |

### Admin (private, `noindex`, password-protected — KEEP)
| Route | Page |
| --- | --- |
| `/admin/leads` | Lead inbox: list, filter by status, CSV export |
| `/admin/leads/{id}` | Single lead detail |

### API
| Route | Purpose |
| --- | --- |
| `POST /api/leads` | Submit any enquiry form |
| `GET /api/admin/export` | CSV export (auth) |
| `POST /api/internal/retry-leads` | Cron-triggered retry of queued/failed deliveries (secret) |

### SEO routes
`sitemap.ts`, `robots.ts`, JSON-LD components, per-locale metadata with `hreflang`
alternates. Keep these in any rebuild.

---

## 4. Content model (KEEP — this is the heart of the site)

Two-level catalogue: **Department → Course**. One source of truth drives web pages
(and was designed to also drive PDF brochures). Lives in `src/content/catalogue/`.

### Department (11 total)
Fields: `slug`, `name`, `title` (H1), `seoTitle`, `seoDescription`,
`shortDescription`, `overview`, `icon` (lucide key), `order`, `isFeatured`.

| # | Department | Slug | Featured |
| --- | --- | --- | --- |
| 1 | Languages (IELTS Test Centre) | `languages` | ✔ |
| 2 | Business & Management | `business-management` | ✔ |
| 3 | Project Management | `project-management` | ✔ |
| 4 | Human Resources | `human-resources` | |
| 5 | Accounting & Finance | `accounting-finance` | ✔ |
| 6 | Quality & Operational Excellence | `quality-operational-excellence` | |
| 7 | Engineering | `engineering` | |
| 8 | Engineering Software & Design | `engineering-software-design` | |
| 9 | Information Technology & Programming | `information-technology` | ✔ |
| 10 | Digital Marketing | `digital-marketing` | |
| 11 | Medical & Healthcare | `medical-healthcare` | |

### Course (~101 total across the departments)
Fields: `slug`, `departmentSlug`, `title`, `seoTitle`, `seoDescription`,
`shortDescription`, `overview`, `durationText`, `trainingHours`, `deliveryMethods[]`,
`learningOutcomes[]`, `targetAudience[]`, `outline[]` (modules/topics),
`certificationText`, `feeText`, `relatedCourseSlugs[]`, `isFeatured`,
`contentStatus` (`"complete"` = full BTI copy, `"outline"` = name + neutral
placeholders), `imageSrc?`, `imageAlt?`.

URL shape: `/courses/{departmentSlug}/{courseSlug}`. Helper functions
(`getCourseBySlug`, `getCoursesByDepartment`, `getRelatedCourses`, `courseHref`,
`departmentHref`) live in `src/content/catalogue/index.ts` — reuse the data, re-skin
the rendering.

### Other content sources (KEEP)
- `src/content/institute.ts` — About paragraphs, mission, vision, "why choose",
  key stats, delivery methods, accreditation claims, **homepage marketing copy**
  (hero badge/stats, corporate points, placement steps, admissions-journey steps,
  course-finder labels).
- `src/content/i18n.ts` — navigation labels, common CTA strings, and homepage
  headings, for `en` and `ar`. All UI strings come from here (no hardcoded copy in
  components).
- `src/content/home-faq.ts` — homepage FAQ (also feeds FAQ JSON-LD).
- `src/content/resources.ts` — downloadable resources (`isAvailable`,
  `requiresLeadCapture` flags). Most are placeholders until BTI provides files.
- `src/content/legal.ts` — legal page bodies.

---

## 5. Lead capture (KEEP — this is the primary conversion system)

Every enquiry form posts to `POST /api/leads`. The flow is **save-to-DB-first, then
deliver**: the lead is persisted, then pushed to the CRM/webhook; if delivery fails it
is queued and retried by the cron endpoint. Nothing is lost. This reliability contract
must survive the redesign.

### Five lead types (one form component, variant props)
1. `general-enquiry` (contact page)
2. `course-enquiry` (course + department pages)
3. `placement-test-request` (placement page; requires English-learning goal)
4. `corporate-training-enquiry` (corporate page; requires company, learner count,
   training area, message)
5. `resource-request` (resources; requires a known resource slug)

### Form fields (zod-validated — `src/lib/lead-schema.ts`)
Base: `fullName` (req), `phone` / `email` (at least one required; UAE phone
normalisation), `preferredContactMethod` (phone/whatsapp/email), `courseInterest`,
`courseSlug`, `resourceInterest`, `resourceSlug`, `companyName`, `jobTitle`,
`learnerCount`, `trainingArea`, `preferredDeliveryMode`, `englishLearningGoal`,
`preferredTime`, `message`, `consent` (must be true), `locale`, `sourcePage`,
UTM params (`utmSource/Medium/Campaign/Content/Term`), `turnstileToken`, and a
honeypot `website` field (must be empty).

### Anti-spam (KEEP)
Honeypot field + Cloudflare Turnstile + rate limiting run on every submission
(`src/services/spam-protection.ts`).

### Persistence model — `LeadSubmission` (Prisma)
Carry these columns into any new backend:
`id`, `publicReference` (unique, shown to the user), `createdAt`, `updatedAt`,
`leadType`, `deliveryStatus` (`queued` / `delivered` / `failed-delivery`),
`deliveryAttempts`, `lastDeliveryAttemptAt`, `deliveredAt`, `failureReason`,
`fullName`, `phone`, `email`, `preferredContact`, `courseInterest`, `courseSlug`,
`resourceSlug`, `companyName`, `jobTitle`, `learnerCount`, `trainingArea`,
`preferredDeliveryMode`, `englishLearningGoal`, `preferredTime`, `message`,
`locale`, `sourcePage`, `referrer`, UTM fields, `consent`, `requestFingerprint`,
`webhookDeliveryId`. Indexed on `createdAt`, `deliveryStatus`, `leadType`.

### Contact actions (KEEP)
Phone, WhatsApp (`https://wa.me/{number}`), email, and a mobile sticky CTA bar are
present site-wide. All clicks fire analytics events.

---

## 6. Homepage composition (REPLACE the visuals, KEEP the intent)

Current section order (`src/components/pages/home-page.tsx`). Each is a self-contained
section pulling copy from content/config — re-skin freely, but keep the conversion
arc (hero → proof → explore → corporate → placement → journey → reassurance → CTA).

1. **HomeHero** — dark navy gradient hero, headline + dual CTA, compact stat proof
   points, decorative floating course cards + animated mesh (all `aria-hidden`).
2. **CredentialBar** — IELTS / Cambridge / ISO / Licensed claims (text).
3. **CourseTicker** — marquee of course names (decorative; toggleable).
4. **StatsBand** — 20+ / 10,000+ / 100+ / 500+ stats.
5. **CourseExplorer** — searchable/filterable course finder by department.
6. **CorporateBand** — corporate training pitch + CTA.
7. **PlacementCta** — English placement-test prompt + 3-step explainer.
8. **AdmissionsJourney** — 3-step "explore → speak to admissions → begin" timeline.
9. **Testimonials** — gated **off** until BTI supplies approved testimonials.
10. **Resources** — first 3 resource cards + "view all".
11. **HomeFaq** — accordion (feeds FAQ JSON-LD).
12. **FinalCta** — closing navy CTA band with reassurance points.

Header: floats transparent over the dark hero, turns solid navy on scroll; primary nav
= Courses (mega-dropdown of departments) + Placement + Corporate + About + Contact +
language switch + "Speak to Admissions". Footer: contact block, course areas, useful
links, legal/social, opening hours. Mobile uses accordion sections + sticky CTA.

---

## 7. Integrations & infrastructure (KEEP — assign an owner each)

| Service | Role |
| --- | --- |
| Vercel | Hosting / deploy on merge to `main` |
| Neon | PostgreSQL (leads) |
| Upstash (Redis) | Rate limiting |
| Cloudflare Turnstile | Form anti-spam |
| Odoo | CRM / lead webhook destination |
| Sentry | Error monitoring |
| Google Search Console + Bing | Search indexing |

### Environment variables (representative)
`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MAP_URL`, `NEXT_PUBLIC_GOOGLE_BUSINESS_PROFILE_URL`,
`NEXT_PUBLIC_INSTAGRAM_URL` / `_FACEBOOK_URL` / `_LINKEDIN_URL`,
`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `LEAD_ADMIN_USER`, `LEAD_ADMIN_PASSWORD`,
webhook/CRM secret(s), retry/cron secret, database credentials. Rotate on staff
departure. See `docs/operations-runbook.md`, `docs/odoo-integration.md`.

---

## 8. SEO, analytics, accessibility, compliance (KEEP — non-negotiable)

- **SEO:** per-page metadata (title/description), canonical URLs, `hreflang`
  alternates, OpenGraph/Twitter images, XML sitemap, robots. JSON-LD: Organization,
  LocalBusiness, Website, FAQ. Local-SEO targeting "Sharjah". Don't regress these.
- **Analytics:** event tracking on CTAs (phone, WhatsApp, language switch, lead
  submit). Consent-gated loader available (`requireCookieConsent` flag). See
  `docs/analytics-events.md`.
- **Accessibility:** skip link, visible focus rings (light + dark variants),
  `prefers-reduced-motion` guard (all decorative animation degrades to static),
  semantic landmarks, labelled form fields, ARIA on menus/dialogs, ≥44px touch
  targets, keyboard-operable nav. Target WCAG 2.1 AA. See
  `docs/accessibility-checklist.md`.
- **Compliance:** consent checkbox required on every form; legal pages publish only
  when approved (`state` flag); credibility claims are gated by feature flags. The
  IELTS / Cambridge / ISO / regulator logos are **approved for use** — display the
  official files only (never recreate or fabricate a logo).

---

## 9. Feature flags (KEEP the safety mechanism — `src/config/site.ts`)

These let BTI turn claims/sections on only when evidence exists. Preserve the concept.

| Flag | Current | Meaning |
| --- | --- | --- |
| `enableArabic` | off | Arabic locale + RTL |
| `showFoundingYearText` | on | "Established 2002" |
| `showKeyStats` | on | Stat bands |
| `showIeltsTestCentre` / `showCambridgePartner` / `showIsoCertified` | on | Credibility text |
| `showAccreditationLogos` / `showPartnerLogos` | **on** | Permission confirmed — display official logos once files are in place |
| `showTestimonials` | off | Awaiting approved testimonials |
| `showCourseTicker` | on | Decorative marquee |
| `requireLeadCaptureForDownloads` | off | Gate resource downloads behind a form |
| `requireCookieConsent` | off | Consent banner before analytics |

---

## 10. Design system — palette is LOCKED, the rest is REPLACE

The redesign defines its own layout, type, and motion. **The colour palette, however,
is a hard constraint:** it must match the BTI **logo palette exactly**. Do not
introduce blues, purples, greens, golds, or off-whites as brand colours.

### Brand palette (KEEP — strict, from the logo)
| Role | Hex |
| --- | --- |
| Navy (primary) | `#221E51` |
| Crimson (accent / CTA) | `#B12830` |
| White | `#FFFFFF` |
| Black | `#000000` |

Everything is built from these four. Neutral greys (for borders, muted text, subtle
fills) are permitted **only** as tints/shades derived from black/navy/white — keep them
genuinely neutral, not a new accent hue.

> **Migration note:** the current code uses different values — navy `#171448`, red
> `#b51f36`, plus purple/blue/green/gold accents in `src/app/globals.css`. These are
> **superseded**. The rebuild must adopt `#221E51` / `#B12830` and drop the extra accent
> hues.

### Current design (REPLACE — reference only)
The current build (for reference; free to discard) layered extra colours on top of the
brand: purple `#28124f`, blue `#2f62f0`, green/gold accents, cream page bg `#fbfaf8`,
and dark navy surfaces `#100d38`–`#0d0b2e`. Defined in `src/app/globals.css`.

**Type scale (utility classes):** `hero-title`, `page-title`, `section-title`,
`card-title`, `body-large`, `supporting-copy`, `eyebrow`, `meta-label`, `helper-text`.
Body font Geist; an `institutional-heading` serif option exists.

**Radii:** 8 / 12 / 18 / 24 px + pill. **Shadows:** layered brand-tinted `sm`→`float`
scale. **Gradients:** hero, dark-band, corporate, final, cta-red.

**Motion:** `--ease-out` cubic-bezier; keyframes for fade-up, float-y, mesh-spin,
pulse-dot, marquee; staggered hero reveal; scroll-reveal (JS adds classes, content
visible without JS). All decorative motion respects reduced-motion.

---

## 11. Assets still pending from BTI (carry into the rebuild brief)

- Clean, correct **logo files** for the partners flagged below (see "Logo assets on
  hand"). Usage permission is confirmed; the practical blockers are file quality and
  using the *right* mark.
- Approved **testimonials**.
- Real **photography** (see `docs/visual-polish-deferred-items.md`, `docs/trust-assets-needed.md`).
- Downloadable **resource PDFs** (course guide, IELTS checklist, corporate profile).
- Native-reviewed **Arabic copy** for full bilingual launch.
- Final **course content** for `contentStatus: "outline"` courses
  (`docs/course-content-needed.md`).

### Logo assets on hand
Source folder (not yet in the repo): `C:\Users\zurai\Desktop\MZ\BTI\Logos`.
Permission to display is confirmed; status below is about **file quality and using the
correct mark**, not permission.

| File | Mark | Status / action |
| --- | --- | --- |
| `IELTS.png` | IELTS wordmark (crimson + black tagline) | ✅ Clean and on-brand. Ready to use. Confirm background is transparent for placement on white *and* navy. |
| `ACCA.png` | ACCA (white on red square) | ✅ Clean. Note: ACCA accredits *accountants*, not BTI — present it as a qualification BTI **prepares learners for** (Accounting & Finance dept), not as a BTI accreditation. |
| `Cambridge.png` | University of Cambridge crest on a **black** background | ⚠️ Two issues: (1) it's a black-background raster, so it won't sit on white sections cleanly — get a transparent version. (2) The BTI claim is "Cambridge-affiliated / Cambridge **English** exam prep" — the **University of Cambridge** crest implies a stronger institutional tie. Verify which mark BTI is licensed to use; the correct partner mark is usually **Cambridge English / Cambridge Assessment**, not the university crest. |
| `ISO_9001.png` | "ISO 9001 Certified Company" badge | ⛔ This is a **watermarked stock image** ("pngtree" tiled across it) — not usable, and it's a generic graphic rather than BTI's own certificate mark. Replace with the official mark from the **registrar that issued BTI's ISO 9001 certificate** (they provide an approved logo + certificate number). |
| `WhatsApp / Instagram / LinkedIn / Facebook.png` | Social brand icons | Optional. The site currently uses generic line icons; these official glyphs can replace them in the footer/contact if desired. |

**Net:** IELTS and ACCA are ready; Cambridge needs the right mark + a transparent file;
ISO needs the real registrar-issued mark. Don't ship the watermarked ISO image.

---

## 12. Recommended rebuild order

1. Stand up the new design system / tokens (Section 10 is your "before").
2. Port the content modules unchanged (Section 4) — or migrate them into a CMS.
3. Rebuild shared chrome: header, footer, mobile sticky CTA, skip link.
4. Rebuild page templates: home, department, course detail, then the conversion pages
   (placement, corporate, contact), then resources/FAQ/legal/about.
5. Wire the lead form to `/api/leads` and keep the save-first-then-deliver contract
   and anti-spam (Section 5).
6. Re-attach SEO, JSON-LD, analytics, accessibility (Section 8).
7. Verify feature flags, then run the launch checklist (`docs/launch-checklist.md`).

---

### Existing docs worth reading alongside this
`docs/handover-guide.md` (day-to-day ops), `docs/lead-capture-architecture.md`,
`docs/odoo-integration.md`, `docs/operations-runbook.md`,
`docs/accessibility-checklist.md`, `docs/seo-plan.md`,
`docs/launch-checklist.md`.
