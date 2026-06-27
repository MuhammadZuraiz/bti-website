# Claude Code — Phase 1 Prompt: BTI Homepage Visual Redesign

> Paste everything below into Claude Code, run from the repository root of the BTI Next.js site.
> Read `README.md` (in this same handoff folder) and the prototype in `prototype/BTI Homepage.dc.html` first — they are the visual source of truth.

---

You are implementing **Phase 1** of an approved homepage visual redesign for the British Training Institute (BTI) marketing site. This is a **homepage-only visual change**. Treat the design prototype as a reference, not code to copy — recreate it idiomatically in this Next.js 15 (App Router) + Tailwind v4 + TypeScript codebase using existing components, content, and patterns.

## Scope — do ONLY this
1. Rebuild the homepage as a composition of new presentational section components plus restyles of a few existing layout components.
2. Add the new design tokens (colors, gradients, shadows, radii, keyframes) to `src/app/globals.css`.
3. Wire every section to **existing content sources** and **existing CTAs/routes** — no new data, no embedded forms.

## Hard constraints — DO NOT TOUCH
- **Lead capture & backend:** `src/components/forms/lead-form.tsx`, `src/app/api/**`, `prisma/**`, Cloudflare Turnstile, lead analytics/events (`src/lib/lead-*`, `src/lib/analytics*`), CSV export, `src/app/admin/**`.
- **Routes & flow:** do not add/rename/remove routes. Homepage CTAs link into existing pages: `/courses`, `/courses/[department]`, `/placement-test`, `/corporate-training`, `/contact`, `/faq`, `/resources`. Use `localizePath(locale, ...)`.
- **Content & config:** read from `src/content/catalogue/*`, `src/content/institute.ts`, `src/content/i18n.ts`, `src/content/resources`, `src/config/site.ts`, `src/lib/trust.ts`. Add any new homepage copy to `i18n.ts`/`institute.ts` — do not hardcode strings in components.
- **SEO:** keep the existing JSON-LD blocks (`organizationSchema`, `localBusinessSchema`, `websiteSchema`, `faqSchema`) on the homepage; keep `homeFaq` feeding `faqSchema`.
- **i18n / locale routing**, `siteConfig.featureFlags` (respect `showKeyStats`, `showTestimonials`, `showAccreditationLogos`, `showAccreditationLogos`), and existing **Playwright e2e tests** in `e2e/`.
- **No unrelated changes** — do not refactor unrelated files, bump dependencies, or reformat untouched code.
- **No heavy libraries.** Do **not** add Framer Motion or any animation/UI library. Use CSS keyframes + minimal React state + IntersectionObserver. If you believe a dependency is truly required, STOP and ask first.

## Build these components (new) under `src/components/sections/`
`home-hero.tsx`, `hero-course-cards.tsx`, `credential-bar.tsx`, `course-ticker.tsx`, `course-explorer.tsx`, `corporate-band.tsx`, `placement-cta.tsx`, `admissions-journey.tsx`, `testimonials.tsx` (gate behind `siteConfig.featureFlags.showTestimonials` — render nothing if false), `home-faq.tsx`, `final-cta.tsx`.

Mark only the components that need state/effects (`course-explorer`, `stats-band` count-up, `home-faq`, `testimonials`, header scroll) as `"use client"`. Keep everything else a server component.

## Restyle (visual only, keep all logic) 
`src/components/layout/header.tsx` (transparent over hero → solid navy after ~40px scroll; white nav), `footer.tsx`, `mobile-sticky-cta.tsx` (reuse existing `--mobile-sticky-offset` / `.mobile-safe-bottom`), `src/components/sections/stats-band.tsx` (add count-up on view), `src/components/courses/course-card.tsx` and `resources/resource-grid.tsx` (color-varied cards).

## Recompose 
`src/components/pages/home-page.tsx` → render the sections in this order, keeping the existing `<JsonLd>` blocks:
`HomeHero → CredentialBar → CourseTicker → StatsBand → CourseExplorer → CorporateBand → PlacementCta → AdmissionsJourney → Testimonials → ResourceGrid → HomeFaq → FinalCta`.

## Design system
- Add tokens from `README.md` §4 to `globals.css` (new electric blue `#2f62f0`, blue-dark `#1f4fd6`, blue-light `#5b8bff`, red-bright `#e0294a`, gold-light `#d6a93f`, navy-900 `#100d38`, navy-footer `#0d0b2e`, the dark-band gradients, card shadows, radius scale). Keep existing `--brand-*`.
- **Color discipline:** navy/blue dominant; **red only for primary CTAs / urgency**. Gold only for credential accents.
- **Typography (Phase 1 = Option A):** keep the existing self-hosted **Geist** font; achieve the display feel via weight (700–800) and the type scale in `README.md` §5. Do **not** add `next/font/google`. (A self-hosted display font is a later option — skip in Phase 1.)
- Prefer responsive `repeat(auto-fit, minmax(...))` grids + `clamp()` so layout reflows without new breakpoints.

## Motion
CSS keyframes for: hero mesh/blobs/load-reveal, pulse dot, floating cards, ticker marquee. React + IntersectionObserver for: stats count-up and scroll-reveal (default content visible; hide-then-reveal only when JS present and motion allowed; `unobserve` after). React state for: FAQ accordion and testimonial carousel (autoplay disabled under reduced motion). Add the global `@media (prefers-reduced-motion: reduce)` guard to `globals.css`. Animate only `transform`/`opacity`.

## Accessibility (must pass)
One `<h1>` (hero), `<h2>`/`<h3>` hierarchy; accordion uses `aria-expanded`/`aria-controls`; carousel dots are labelled `<button>`s with `aria-current`; decorative SVG/gradients `aria-hidden`; icon-only controls get `aria-label`; keep `.skip-link` + `#main-content`; visible focus on dark sections; AA contrast. Reuse `--mobile-sticky-offset` so the sticky bar never overlaps content.

## Verify before finishing (run what exists)
Run, in order, and fix anything you introduced:
```
# use the repo's package manager (pnpm/npm/yarn — detect from lockfile)
<pm> run typecheck   # or: npx tsc --noEmit
<pm> run lint
<pm> run test        # and/or the Playwright e2e if configured
<pm> run build
```
All existing tests must still pass and the production build must succeed. Do not edit tests to make them pass unless a test asserts old homepage copy/markup that legitimately changed — if so, update only those assertions and explain why.

## Deliverable
A scoped diff touching: `src/components/sections/*` (new), `src/components/pages/home-page.tsx`, the restyled layout/section/card/resource components listed above, and `src/app/globals.css`. Summarize what changed, confirm the constraints above were respected, and report the results of typecheck/lint/test/build.

If anything is ambiguous or would require touching a constrained area, **stop and ask** rather than guessing.
