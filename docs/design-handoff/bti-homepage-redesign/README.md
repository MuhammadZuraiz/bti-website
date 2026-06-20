# Handoff: BTI Homepage Redesign — "Lively Homepage" (01+02 Hybrid)

## Overview
This package documents the approved visual redesign of the **British Training Institute (BTI)** homepage. The new homepage is an energetic, navy-dominant, blue/red brand experience with a strong animated hero, floating course cards, a live course ticker, prominent accreditation/credibility proof, a premium corporate-training band, an interactive course finder, animated stats, an admissions journey, testimonials, an FAQ accordion, and a multi-option final CTA — replacing the current flat, static, white-card-heavy layout.

## About the design files
The files in `prototype/` are **design references created as HTML/JS prototypes** — they demonstrate the intended look, motion, and behavior. **They are NOT production code to copy directly.** The task is to **recreate this design inside the existing BTI Next.js 15 (App Router) + Tailwind v4 codebase**, reusing its established components, content sources, lead-capture flow, and patterns. The prototype is a single self-contained component runtime; production must be idiomatic React/TSX.

> **Do not** port the prototype's inline-style approach or its mock data. Wire every section to the repo's existing content modules (`src/content/*`, `src/config/site.ts`) and existing components where possible.

## Fidelity
**High-fidelity (hifi).** Colors, gradients, typography intent, spacing, motion, and interaction are final and should be matched closely. Exact hex values, shadows, radii, and animation specs are in the **Design Tokens** and **Animation** sections below. Where the prototype font differs from the repo (see **Typography**), follow the chosen option — not the prototype literally.

## Source prototype files
- `prototype/BTI Homepage.dc.html` — the approved interactive homepage prototype (the reference for this handoff).
- `prototype/BTI Homepage Visual Directions.dc.html` — the earlier 3-direction exploration (context only).

Best viewed inside the design tool where this was built (they depend on a small component runtime). Use them as the visual source of truth alongside this README.

---

## 1. Implementation summary

### What the homepage should become
A single composed page (`src/components/pages/home-page.tsx`) made of discrete section components, with deliberate **dark → light → tinted** rhythm, one orchestrated hero load animation, scroll-reveal on lower sections, and a disciplined CTA hierarchy. Navy/blue is the dominant identity; red is reserved for primary actions and urgency only.

### What to preserve (do NOT change)
- **Lead capture**: `LeadForm`, `/api/leads`, Prisma schema/migrations, Cloudflare Turnstile, lead analytics/events, CSV export, admin (`/admin/leads`).
- **Routes & flow**: `/courses`, `/courses/[department]`, `/courses/[department]/[course]`, `/placement-test`, `/corporate-training`, `/contact`, `/about`, `/faq`, `/resources`, legal pages. The homepage CTAs link **into** these existing flows; they do not embed new forms.
- **Content sources**: `src/content/catalogue/*`, `src/content/institute.ts`, `src/content/i18n.ts`, `src/content/resources`, `src/config/site.ts`. All copy, stats, departments, accreditations, FAQ, contact details come from here.
- **SEO**: JSON-LD (`organizationSchema`, `localBusinessSchema`, `websiteSchema`, `faqSchema`), metadata, sitemap, robots.
- **i18n / locale routing** (`[locale]`, `localizePath`, direction handling) and feature flags in `siteConfig.featureFlags` (e.g. `showKeyStats`, `showTestimonials`, `showAccreditationLogos`).
- **Existing tests** (Playwright e2e in `e2e/`).

### What changes visually
- New hero (dark animated gradient + floating cards + credential bar) replacing the current text-left/image-right hero.
- New section components and ordering; alternating section backgrounds.
- Restyled header (transparent over hero → solid navy on scroll).
- Restyled stats band with count-up; restyled course cards with color-varied "bento" treatment + a homepage course finder.
- New corporate band, testimonials, admissions-journey, final-CTA treatments.
- New/extended design tokens (electric blue, gold-light, dark gradients, shadows, radii).
- Optional new display font (see Typography).

### What NOT to change
No changes to data models, API behavior, validation rules, analytics event names, route structure, or the LeadForm's fields/logic. No new heavy dependencies. No content rewrites beyond what's already in the content modules (the prototype's headline/credential copy can be added to `i18n.ts`/`institute.ts`).

---

## 2. Component breakdown (prototype → production)

Each section becomes a presentational component under `src/components/sections/` (new ones) or a restyle of an existing component. `home-page.tsx` becomes a thin composition that passes locale/dictionary/content down.

| # | Section | Production component | Type | Notes |
|---|---------|----------------------|------|-------|
| 1 | Hero | `sections/home-hero.tsx` | **New** | Dark gradient bg, animated mesh/blobs (CSS), staggered load reveal, eyebrow + h1 + intro + dual CTA + credential bar. Uses `ButtonLink`. |
| 2 | Header | `layout/header.tsx` | **Restyle** | Keep all nav/menu/locale logic. Add transparent-over-hero state that turns solid navy after ~40px scroll (small client scroll listener). White nav text. |
| 3 | Hero floating cards | `sections/hero-course-cards.tsx` | **New** | 3 absolutely-positioned cards (CSS float). Data: top featured departments from `featuredDepartments` / catalogue. Decorative — `aria-hidden` acceptable since real list is below. |
| 4 | Credential / proof bar | `sections/credential-bar.tsx` | **New** | Inline bordered bar under hero CTAs: Est. 2002 · IELTS Test Centre · Cambridge · ISO Certified · Sharjah. Source: `institute.ts` accreditations + `siteConfig`. Reuse `getTrustItems()`. |
| 5 | Course ticker | `sections/course-ticker.tsx` | **New** | CSS marquee of department/course names from catalogue. Pause on hover; gated by a flag. Duplicate track marked `aria-hidden`. |
| 6 | Stats band | `sections/stats-band.tsx` | **Restyle + behavior** | Keep `keyStats` + `showKeyStats` flag. Add count-up-on-view (client, IntersectionObserver + rAF). Dark gradient bg. |
| 7 | Course finder / cards | `sections/course-explorer.tsx` (+ restyle `courses/course-card.tsx`) | **New wrapper, reuse cards** | Search input + category chips filtering `allDepartments` (mirror the existing `/courses` `CourseCatalogue` filter logic). Color-varied cards, one dark highlight, example-course chips. Links to `departmentHref` / `/contact?course=`. |
| 8 | Corporate band | `sections/corporate-band.tsx` | **New** | Dark navy/purple band, bullet proofs, stat tiles, gold accent. CTA → `/corporate-training` via `ButtonLink`. |
| 9 | Placement test CTA | `sections/placement-cta.tsx` | **New** | Tinted panel, 3-step "how it works", CTA → `/placement-test`, secondary WhatsApp. No embedded form. |
| 10 | Admissions journey | `sections/admissions-journey.tsx` | **New** | 3 numbered steps (last one dark), CTA → `/contact`. Replaces inline journey markup in current `home-page.tsx`. |
| 11 | Testimonials / proof | `sections/testimonials.tsx` | **New (flag-gated)** | Client carousel: autoplay + dots, rotating quote on dark band. **Gate behind `siteConfig.featureFlags.showTestimonials`** — render nothing (or a static proof stat) until BTI supplies approved quotes. |
| 12 | Resources / guides | `resources/resource-grid.tsx` | **Restyle** | Reuse component + `resources` data + `isResourcePublished`. Accent-bordered cards; "Request guide" → `/contact?resource=slug` (existing pattern). |
| 13 | FAQ accordion | `sections/home-faq.tsx` | **New (client)** | Accordion using existing `homeFaq` data. Keep feeding `faqSchema` JSON-LD from the same array. |
| 14 | Final CTA | `sections/final-cta.tsx` | **New** | Dark band, 4 distinct actions: Speak to Admissions (red) · Request Placement Test (blue) · WhatsApp (green) · Call (outline). Reuse `ButtonLink` / `ContactActions` + `siteConfig` contacts. |
| — | Footer | `layout/footer.tsx` | **Restyle** | Keep structure/links; deep-navy treatment. |
| — | Mobile sticky CTA | `layout/mobile-sticky-cta.tsx` | **Reuse + restyle** | Keep existing `--mobile-sticky-offset` / `.mobile-safe-bottom` mechanism (already in `globals.css`) so the bar never covers content. Restyle to navy + red primary + green WhatsApp. |

**Composition target** — `home-page.tsx`:
```
<HomeHero/> <CredentialBar/> <CourseTicker/> <StatsBand/> <CourseExplorer/>
<CorporateBand/> <PlacementCta/> <AdmissionsJourney/> <Testimonials/>
<ResourceGrid/> <HomeFaq/> <FinalCta/>
```
Keep the existing `<JsonLd .../>` blocks at the top of the page.

---

## 3. Current repo mapping

From the codebase audit (Next.js App Router, `src/`):

**Reuse as-is (logic untouched, restyle only):**
- `components/layout/header.tsx`, `footer.tsx`, `mobile-sticky-cta.tsx`
- `components/sections/stats-band.tsx`
- `components/ui/button-link.tsx` (variants: primary/secondary/dark/ghost/outline/text), `badge.tsx`, `section-heading.tsx`
- `components/courses/course-card.tsx`, `course-catalogue.tsx` (reuse its filter logic for the homepage finder)
- `components/resources/resource-grid.tsx`
- `components/conversion/context-link.tsx`, `contact-actions.tsx`
- `components/media/optional-image-panel.tsx` (image-with-fallback — use for any hero/section imagery)
- `components/forms/lead-form.tsx` — **do not touch**
- `components/seo/json-ld.tsx`
- Content: `content/catalogue/*` (`allDepartments`, `featuredDepartments`, `getCoursesByDepartment`, `departmentHref`, `courseHref`), `content/institute.ts` (`keyStats`, `accreditations`, `whyChoose`, `foundingYear`), `content/i18n.ts`, `content/resources`, `config/site.ts`, `lib/trust.ts` (`getTrustItems`), `lib/locale.ts`, `lib/schema.ts`, `lib/site-utils.ts`

**Restyle (visual change, same role):** `header.tsx`, `footer.tsx`, `mobile-sticky-cta.tsx`, `stats-band.tsx`, `course-card.tsx`, `resource-grid.tsx`, and `app/globals.css` (token additions).

**Create new (presentational, under `components/sections/`):** `home-hero.tsx`, `hero-course-cards.tsx`, `credential-bar.tsx`, `course-ticker.tsx`, `course-explorer.tsx`, `corporate-band.tsx`, `placement-cta.tsx`, `admissions-journey.tsx`, `testimonials.tsx`, `home-faq.tsx`, `final-cta.tsx`.

**Rewrite (composition only):** `components/pages/home-page.tsx` → compose the sections above; keep JSON-LD and the `homeFaq` data (move to a shared const if shared with `home-faq.tsx`).

New copy the prototype introduces (hero headline, intro, credential labels, corporate bullets) should be added to `content/i18n.ts` (`home` dictionary) and/or `content/institute.ts`, not hardcoded in components.

---

## 4. Design tokens

Add to `src/app/globals.css`. Existing `--brand-*` tokens stay; **new** tokens are marked. Keep the `@theme` radius block and extend it.

### Colors
| Token | Value | Role |
|-------|-------|------|
| `--brand-navy` | `#171448` | Primary identity, headings, dark surfaces *(exists)* |
| `--brand-purple` | `#28124f` | Gradient depth partner *(exists)* |
| `--brand-blue` *(new)* | `#2f62f0` | Electric blue — energy, glow, secondary action, focus |
| `--brand-blue-dark` *(new)* | `#1f4fd6` | Blue button hover |
| `--brand-blue-light` *(new)* | `#5b8bff` | Light blue accents, gradient text |
| `--brand-red` | `#b51f36` | Primary CTA / urgency only *(exists)* |
| `--brand-red-bright` *(new)* | `#e0294a` | Top stop of red CTA gradient |
| `--brand-red-dark` | `#8e192c` | Red gradient base, error text *(exists)* |
| `--brand-gold` | `#b98b2f` | Credential accent *(exists)* |
| `--brand-gold-light` *(new)* | `#d6a93f` | Credential tick icons |
| `--brand-green` | `#176b5a` | WhatsApp / success *(exists)*; hover `#125443` |
| `--brand-cream` | `#fbfaf8` | Page background *(exists)* |
| `--brand-soft` | `#f6f7fb` | Tinted sections *(exists)* |
| `--brand-ink` | `#151525` | Body text *(exists)* |
| `--brand-muted` | `#5e6472` | Secondary copy *(exists)* |
| `--brand-border` | `#e5e7ee` | Hairlines *(exists)*; also `#ececf4`, `#e8e8f2` for cards |
| `--navy-900` *(new)* | `#100d38` | Hero gradient base |
| `--navy-850` *(new)* | `#12103a` | Mobile menu / sticky bar bg |
| `--navy-800` *(new)* | `#13103c` | Dark band base |
| `--navy-footer` *(new)* | `#0d0b2e` | Footer |

### Dark-section gradients
```css
--grad-hero:      linear-gradient(160deg,#100d38 0%,#1a1550 55%,#241a63 100%);
--grad-dark-band: linear-gradient(160deg,#13103c,#1d1656);          /* stats */
--grad-corporate: linear-gradient(155deg,#14113f,#28124f 70%,#3a1a52);
--grad-final:     linear-gradient(155deg,#100d38,#28124f 75%,#3a1340);
--grad-cta-red:   linear-gradient(180deg,#e0294a,#b51f36);          /* primary buttons */
```

### Card shadows
```css
--shadow-card:        0 8px 26px rgba(20,18,60,.06);
--shadow-card-hover:  0 24px 50px rgba(20,18,60,.16);
--shadow-red:         0 14px 32px rgba(181,31,54,.45);   /* update existing */
--shadow-blue:        0 14px 30px rgba(47,98,240,.40);
--shadow-float:       0 26px 54px rgba(0,0,0,.40);       /* hero cards on dark */
```

### Radius scale (extend the `@theme` block)
```css
--radius-sm: .5rem;     /*  8px  inputs, chips, small cards */
--radius-md: .75rem;    /* 12px  buttons, mid cards (existing --radius-lg) */
--radius-lg: 1.125rem;  /* 18px  course/section cards (existing --radius-xl) */
--radius-xl: 1.5rem;    /* 24px  large panels */
--radius-pill: 999px;   /* pills, CTAs, ticker label */
```

### Spacing rhythm
- Content container: `max-width: 1120px` (keep existing `.container-page`) — the prototype used 1200px; **1120px is fine, keep repo value** for consistency.
- Standard section padding (vertical): `clamp(56px, 8vw, 96px)`.
- Dark accent bands (stats/ticker): `clamp(44px, 6vw, 64px)`.
- Card grid gap: `16px`; card padding: `24px`; inline element gaps: `8–12px`; CTA gaps: `12–13px`.
- Grids: prefer `repeat(auto-fit, minmax(240–270px, 1fr))` for natural responsiveness (no media query needed).

---

## 5. Typography

The prototype pairs **Bricolage Grotesque** (display) + **Hanken Grotesk** (body). The repo currently self-hosts **Geist** via `next/font/local` (`src/app/fonts/geist-latin.woff2`). **Do not use `next/font/google` / external Google Fonts at build time.** Two options:

### Option A — Keep Geist, adjust weights & scale (lowest risk)
Reuse the existing semantic classes in `globals.css` (`.hero-title`, `.page-title`, `.section-title`, `.card-title`, `.eyebrow`, etc.) and:
- Push heading weights to **700–800**, tighten tracking (hero `-0.03em`, sections `-0.02em`).
- Increase hero scale to `clamp(40px, 6.2vw, 72px)`, line-height `~1.0`.
- Keep eyebrows uppercase, `0.16em`, 12px, weight 700.
- Stat numbers / monograms: weight 800, tabular where possible.
No new files. Ships immediately. Geist at heavy weights reads modern and clean — acceptable substitute for the display feel.

### Option B — Add a self-hosted display font (closer to prototype)
1. Download **Bricolage Grotesque** woff2 (variable, or 700 + 800 static) from its open-source release.
2. Place at `src/app/fonts/bricolage-grotesque.woff2`.
3. Register with `next/font/local`:
   ```ts
   const display = localFont({
     src: "./fonts/bricolage-grotesque.woff2",
     variable: "--font-display",
     display: "swap",
   });
   ```
   Add `display.variable` to the `<body>` className alongside the existing body font.
4. Apply `var(--font-display)` to heading classes (`.hero-title`, `.section-title`, `.card-title`, stat numbers, monograms). Keep **Geist** (or add Hanken Grotesk, also self-hosted) for body.
5. Provide a fallback stack: `var(--font-display), "Bricolage Grotesque", Georgia, serif` is wrong for a grotesque — use `var(--font-display), ui-sans-serif, system-ui, sans-serif`.

**Recommendation:** Option B for the headline character BTI asked for, but only if the team is comfortable self-hosting. Option A is a safe Phase-1 default; Option B can be a small follow-up.

### Type scale (both options)
| Role | Size | Weight | Tracking / LH |
|------|------|--------|---------------|
| Hero h1 | `clamp(40px,6.2vw,72px)` | 800 | `-0.03em` / `0.98` |
| Section h2 | `clamp(26px,3.8vw,46px)` | 800 | `-0.02em` / `1.05` |
| Card h3 | `18px` | 700 | `-0.01em` / `1.3` |
| Body large | `clamp(16px,1.8vw,19px)` | 400 | `1.6` |
| Body | `14–15px` | 400/600 | `1.55` |
| Eyebrow / meta | `12px` upper | 700 | `0.16em` |
| Stat number | `clamp(40px,5vw,58px)` | 800 | `-0.01em` |

---

## 6. Animation handoff

Prefer **CSS keyframes** + a tiny amount of React state. **No Framer Motion** (not needed; adds weight). All motion must honor `prefers-reduced-motion`.

Add once to `globals.css` (keyframes) and a global guard:
```css
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{ animation:none!important; transition-duration:.01ms!important; }
}
```

| Animation | Implementation | Details / safety |
|-----------|----------------|------------------|
| Hero gradient mesh | **CSS** `@keyframes` rotate, 40s linear infinite on a blurred conic-gradient layer | `pointer-events:none`, `will-change:transform`. Decorative. |
| Hero blobs drift | **CSS** 14–18s ease-in-out infinite | Decorative, `aria-hidden`. |
| Hero load reveal (staggered) | **CSS** `fade-up` with `animation-delay` 0–0.32s on hero children | One orchestrated entrance. Base opacity must resolve to 1 so reduced-motion shows content. |
| Pulse "live" dot | **CSS** 1.6–2s | Tiny; decorative. |
| Floating course cards | **CSS** `float` 6–7s ease-in-out infinite; hover lift via `:hover` | Use `transform` only. |
| Course ticker (marquee) | **CSS** `translateX(0 → -50%)` linear infinite; duplicate track (`aria-hidden` on the copy); pause on `:hover` | Gate behind a flag; keep speed ~32s. |
| Stats count-up | **React**: `IntersectionObserver` triggers a `requestAnimationFrame` tween (client component) | Render the final value in markup as the no-JS/SSR fallback; only animate when in view AND not reduced-motion. |
| Scroll reveal (sections/cards) | **React `IntersectionObserver`** toggling `opacity`/`translateY` (preferred over experimental `animation-timeline` for browser support) | **Default to visible**; only hide-then-reveal when JS is present and motion allowed. `threshold ~0.12`, `rootMargin: 0 0 -40px 0`, `unobserve` after reveal. |
| FAQ accordion | **React** state + `max-height`/`opacity` transition | Animate `max-height` (or use a measured height); rotate the +/× icon via `transform`. |
| Testimonial carousel | **React** state; `setInterval` autoplay + manual dots | Pause/disable autoplay under reduced-motion; allow manual control always. |
| Hover states | **CSS** `:hover` (Tailwind utilities) | Buttons lift + shadow; cards lift + border/shadow; links gap/underline. |

**Mobile behavior:** keep heavy blur/conic layers modest on small screens (they're the main perf risk). Floating cards stack **below** the headline on mobile (grid auto-fit), so they never overlap copy. Ticker remains but consider a slightly shorter track.

**Performance risks:** (1) large blurred gradient + conic rotate can cost GPU — cap size, use `will-change`, avoid animating `filter`. (2) Multiple infinite animations — keep to transforms/opacity. (3) Count-up and reveal observers should `disconnect`/`unobserve` once done. (4) Avoid layout-thrash: never animate width/height/top — use `transform`.

---

## 7. Accessibility requirements

- **Contrast (WCAG AA):** body text ≥ 4.5:1, large text ≥ 3:1. On dark navy use white / `rgba(255,255,255,≥0.74)` for body; muted `0.6–0.7` only for non-essential meta. Verify red `#b51f36` on white (passes for ≥18px/bold) and white on red CTA. Gold `#b98b2f`/`#d6a93f` only as icon/decoration, not body text on light.
- **Keyboard navigation:** all CTAs are real `<a>`/`<button>`; finder input, chips, accordion headers, carousel dots must be tab-reachable and operable with Enter/Space. Maintain logical DOM order. Keep the existing **skip link** (`.skip-link`) and `#main-content`.
- **Reduced motion:** the global guard above; carousel autoplay off; count-up shows final value; reveal shows content.
- **Accordion:** use `<button aria-expanded={open} aria-controls="panel-id">`; panel `id` + `role="region"` (or `hidden` when closed). One source of truth feeds both UI and `faqSchema`.
- **Carousel/testimonials:** wrap in a labelled region (`aria-roledescription="carousel"` optional); dots are `<button>` with `aria-label="Show testimonial N"` and `aria-current`; provide a visible pause or rely on manual control; never trap focus; quotes use `<blockquote>`/`<figure>`+`<figcaption>`.
- **Mobile sticky CTA spacing:** reuse the existing `--mobile-sticky-offset` / `.mobile-safe-bottom` system so the fixed bar never overlaps the footer or final CTA; include `env(safe-area-inset-bottom)`.
- **Focus states:** keep the global `:focus-visible` outline (currently red, 3px) and ensure it's visible on dark backgrounds (use a light/blue focus ring on dark sections).
- **Semantic headings:** one `<h1>` (hero). Section titles `<h2>`, card titles `<h3>`. Don't skip levels. Decorative SVGs `aria-hidden="true"`; icon-only links/buttons get `aria-label`.
- **Images:** real photos via `OptionalImagePanel` keep descriptive `alt`; gradient/fallback panels are decorative.

---

## 8. Implementation phases

**Phase 1 — Homepage visual redesign only.** Build the section components + token additions; recompose `home-page.tsx`. Reuse existing content/components/CTAs. No changes to forms, APIs, routes, tests. Ship behind nothing (homepage is self-contained) but keep diffs scoped to home + `globals.css` + new `sections/*`.

**Phase 2 — Reusable visual components & tokens.** Promote shared primitives (section shell, dark-band wrapper, stat counter, reveal hook `useReveal`, ticker, accordion, carousel) and finalize tokens in `globals.css`. Refactor Phase-1 inline pieces to these.

**Phase 3 — Course page styling alignment.** Apply the new card/finder styling to `/courses` and department/course pages using the restyled `CourseCard`/`CourseCatalogue`. No catalogue logic changes.

**Phase 4 — Placement / contact / corporate page alignment.** Restyle these pages' headers/intros/panels to match; **LeadForm untouched** (only surrounding layout/visuals).

**Phase 5 — Performance & accessibility polish.** Lighthouse/axe passes, contrast audit, motion audit, image optimization, font loading (`display:swap`, preload), reduce-motion QA, bundle check.

---

## 9. Claude Code prompt (Phase 1)

The ready-to-paste prompt is in **`claude-code-phase1-prompt.md`** in this folder. Paste it into Claude Code from the repo root. It is scoped to the homepage only and explicitly preserves lead capture, APIs, Prisma, Turnstile, analytics, SEO, routes, and tests.

---

## Files in this bundle
- `README.md` — this document.
- `claude-code-phase1-prompt.md` — Phase-1 implementation prompt for Claude Code.
- `prototype/BTI Homepage.dc.html` — approved homepage prototype (visual source of truth).
- `prototype/BTI Homepage Visual Directions.dc.html` — earlier direction exploration (context).
