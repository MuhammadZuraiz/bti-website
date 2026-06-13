# Local SEO Checklist

Internal documentation only. Unresolved values below are marked
**Pending BTI** and must never be rendered on the public website.

## NAP source of truth

Once BTI approves each value, every listing must match it exactly
(character for character). Working values currently in `src/config/site.ts`:

| Field | Working value | Approval |
| ----- | ------------- | -------- |
| Canonical business name | British Training Institute | Pending BTI (vs. trade-licence wording) |
| Short name | BTI | Pending BTI |
| Address | Bank Street, CB Building, Apartments 303-304, Al Meraijah, Sharjah, UAE | Pending BTI |
| Landline | 06 568 7222 (+971 6 568 7222) | Pending BTI |
| Mobile | +971 52 608 3950 | Pending BTI |
| WhatsApp | +971 52 608 3950 | Pending BTI |
| Public email | info@britain-institute.com | Pending BTI (domain also a legacy-redirect candidate) |
| Opening hours | None published | Pending BTI |
| Map URL | None published | Pending BTI |
| Canonical domain | Not decided | Pending BTI |

## Consistency table

Update every surface to the approved NAP after sign-off:

| Surface | Name | Address | Phone | Email | Hours | Status |
| ------- | ---- | ------- | ----- | ----- | ----- | ------ |
| Website (`src/config/site.ts`) | ✓ working | ✓ working | ✓ working | ✓ working | hidden | Pending approval |
| Google Business Profile | — | — | — | — | — | Pending BTI access |
| Facebook | — | — | — | — | — | Pending BTI access |
| Instagram | — | — | — | — | — | Pending BTI access |
| LinkedIn | — | — | — | — | — | Pending BTI access |
| Map listings (Google/Apple) | — | — | — | — | — | Pending BTI access |
| IELTS partner listing | — | — | — | — | — | Pending BTI confirmation |
| Brochures / print | — | — | — | — | — | Pending BTI |
| Email signatures | — | — | — | — | — | Pending BTI |
| Legacy domains (btiuae.com, britain-institute.com, btiuk.org) | — | — | — | — | — | See docs/redirect-map.md |

## Search-engine setup (after canonical domain approval)

1. Verify the canonical domain in Google Search Console (domain property).
2. Verify in Bing Webmaster Tools (can import from Search Console).
3. Submit `https://<canonical-domain>/sitemap.xml` in both.
4. Review Coverage/Pages reports for unexpected 404s after launch.
5. Review legacy indexed URLs and align with docs/redirect-map.md.
6. Confirm `robots.txt` allows crawling and the production build was made
   with `DEPLOYMENT_ENV=production` (otherwise everything is noindexed).

## Recurring

- Quarterly: re-check every listing against the NAP source of truth.
- Quarterly: review Search Console queries and 404s.
- After any contact-detail change: update `src/config/site.ts` first, then
  every listing in the table above.
