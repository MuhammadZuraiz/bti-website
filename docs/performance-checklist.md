# Performance Checklist

## Measured results (Phase 3, local production build)

Lighthouse 12, Chromium headless, local `next start` build with
`DEPLOYMENT_ENV=production`. Local numbers exclude real-network latency and
CDN behaviour; re-measure on staging and production hosting.

| Page | Profile | Performance | Accessibility | Best Practices | SEO |
| ---- | ------- | ----------- | ------------- | -------------- | --- |
| Home `/en` | Mobile (default emulation) | 97 | 96* | 100 | 100 |
| Home `/en` | Desktop preset | 100 | 96* | 100 | 100 |
| IELTS course | Mobile | 93 | 100 | 96** | 100 |

\* The 96 was a prohibited `aria-label` on the image-fallback panel — fixed
afterwards (`role="img"`); re-measure on the next pass.
\*\* The 96 is a single logged DevTools issue: Zod v4 attempts one JIT
`new Function` call which the strict CSP intentionally blocks; Zod falls
back to interpreted validation with no functional impact. Documented in
`src/config/security-headers.ts` — do not add `unsafe-eval`.

Reports are written to the git-ignored `artifacts/qa/` directory.

## How to re-run

```bash
DEPLOYMENT_ENV=production NEXT_PUBLIC_SITE_URL=https://<domain> pnpm build
DEPLOYMENT_ENV=production pnpm start --port 3210
npx lighthouse@12 http://localhost:3210/en --output=html \
  --output-path=artifacts/qa/lighthouse.html
```

If Chrome fails to launch from the sandboxed shell, start Chromium with
`--remote-debugging-port=9222` (e.g. via Playwright) and pass `--port=9222`
to Lighthouse.

## Standing rules

- Images go through `next/image` (`OptionalImagePanel` wraps the optional
  ones); no oversized raw `<img>` assets.
- Fonts are local woff2 via `next/font/local` with `display: swap` — no
  font CDN request.
- No autoplay media; no third-party scripts except Turnstile (form pages)
  and analytics (only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set).
- Map embeds: none today; the map link is plain `<a>`. If an embed is added
  later it must be conditional and the CSP `frame-src` updated.
- Keep client components limited to interactive islands (forms, header,
  sticky CTA); pages remain server components.
- Reduced-motion media query disables transitions.
- Avoid layout shift: hero and cards have reserved heights; icon fallbacks
  are fixed-size. Re-check CLS in Lighthouse after any hero change.
- Re-run Lighthouse after adding photography (largest expected regression
  source) and compress to web sizes first.
