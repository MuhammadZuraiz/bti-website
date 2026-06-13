# Accessibility Checklist

## Automated checks (run in CI)

`pnpm test:e2e` runs Axe (WCAG 2.0/2.1 A + AA rule sets) against the
homepage, courses, course detail, contact, placement test, corporate
training, FAQ and resources pages. Serious and critical violations fail the
suite (`e2e/accessibility.spec.ts`).

Fixed via this audit:

- Every page now renders exactly one H1 (`SectionHeading as="h1"`).
- Unlayered CSS element resets no longer override Tailwind utilities — this
  was silently turning white button text dark and breaking contrast on all
  red/navy CTAs.
- Decorative image-fallback panels use `role="img"` with a label instead of
  a prohibited bare `aria-label`.

## Manual checks before launch

- Keyboard-only navigation through every page and form.
- Screen-reader spot check (NVDA or VoiceOver): landmarks, form labels,
  error announcements, success reference announcement.
- Visible focus state on every interactive element.
- Skip-link appears on first Tab and moves focus to main content
  (also covered by `e2e/navigation.spec.ts`).
- Mobile menu: focus moves in, Escape closes, focus returns to the toggle
  (also covered by E2E).
- Touch targets at least 44×44 CSS pixels on mobile.
- Every form field keeps its label when zoomed to 200%.
- Form errors are announced (`role="alert"`) and associated with fields.
- Heading hierarchy is logical (H1 → H2 → H3, no skips).
- Colour contrast of any new colour combinations (axe covers the defaults).
- Reduced-motion preference disables transitions (media query in
  `globals.css`).
- Page remains usable at 400% zoom / 320px effective width.
- Arabic RTL review before enabling the Arabic locale: direction, icon
  mirroring, focus order, translated labels.

## Standing rules

- Semantic header, main, footer and nav landmarks.
- Descriptive alt text for meaningful images; empty alt for decorative ones.
- No essential text embedded in images.
- `aria-live` status region for form feedback.
