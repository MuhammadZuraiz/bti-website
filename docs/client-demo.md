# Management Demo Guide (5 minutes)

Run locally with the database and webhook receiver up
(docs/local-integration-testing.md), or on staging. Use synthetic data only.

## Script

1. **Open the homepage on a phone** (or 390px responsive view). Point out
   the crest, the clear "Professional training in Sharjah" positioning and
   the two CTAs above the fold.
2. **Credibility**: scroll the trust strip and course categories — no fake
   ratings or invented claims anywhere; everything shown is approved or
   neutral.
3. **Browse course categories** from the Courses menu — each category has
   its own SEO landing page.
4. **Open the English or IELTS page**: overview, who it suits, outcomes,
   FAQ, and an enquiry form that already knows which course it belongs to.
5. **Submit a safe test enquiry** (use an obviously synthetic name).
6. **Show the reference number** the visitor receives (BTI-XXXXXX).
7. **Show the persisted record** (Prisma Studio `pnpm db:studio`, or the
   CSV from `pnpm leads:export`): the enquiry is stored before any CRM is
   involved — nothing depends on a third party being up.
8. **Show attribution on the record**: source page, course slug, locale and
   UTM fields captured automatically (open the site with
   `?utm_source=demo` first to make the point).
9. **Placement-test flow**: goal + preferred time fields, same durable
   capture.
10. **Corporate-training flow**: company, learner count, training area —
    a qualified B2B lead, not a generic message.
11. **Mobile sticky bar**: Call, WhatsApp and Enquire are always one thumb
    away.
12. **Local SEO foundations**: Sharjah-focused titles, structured data
    (organisation, courses, FAQs), sitemap and robots — ready for Search
    Console once the domain is confirmed.
13. **Arabic later, safely**: the Arabic locale exists behind a flag and
    stays completely hidden until translations are approved.
14. **Resilience**: if the CRM webhook is down, the lead stays safely queued
    and a retry job delivers it later — show the queued → delivered states
    if time allows.
15. **The point**: every enquiry is captured, attributed and recoverable —
    the website stops leads leaking away.

## Value summary

| Current-state problem | Website improvement | Business value |
| --------------------- | ------------------- | -------------- |
| Broken or fragmented web presence | One polished canonical site | Stronger trust |
| Social-media-only enquiries | Structured lead capture | Better follow-up |
| Generic contact experience | Course-specific pages and forms | More qualified enquiries |
| Weak search visibility | Local SEO landing pages and structured data | Better discoverability |
| Mobile friction | Mobile-first UX and sticky CTAs | Easier contact |
| Webhook outage risk | Durable queued persistence and retries | Fewer lost leads |
| No attribution | Source, locale, and UTM tracking | Better marketing decisions |
