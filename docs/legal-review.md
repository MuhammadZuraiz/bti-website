# Legal Content Review & Publishing

The privacy, cookie and terms pages now contain **draft** copy in
`src/content/legal.ts`. The copy is written to accurately reflect how the site
actually handles data (form fields collected, hashed-IP rate limiting, no raw IP
storage, CRM delivery, optional consented analytics). It is **not published**:
each page is gated by `legalPages.<page>.state` in `src/config/site.ts`, and
while `state` is `"draft"` the route returns 404 and is excluded from the
sitemap and footer.

## What BTI / legal must do

1. Review each page's wording for accuracy and local compliance, in particular:
   - The legal entity name and any trade-licence details to appear.
   - **Data retention period** — replace the neutral "as long as needed" wording
     with BTI's actual retention policy if a specific period is required.
   - The **named contact** (or email) for privacy/data requests, if BTI wants a
     specific one instead of "the admissions team / contact page".
   - Which **CRM and service providers** receive enquiry data (e.g. Odoo, the
     hosting provider, the rate-limit provider), if they must be named.
   - The **cookie-consent decision** (see docs/analytics-events.md): whether
     optional analytics will run at all, and therefore whether the analytics
     cookie section applies.
   - **Governing law** wording.

2. Edit the copy directly in `src/content/legal.ts` (plain strings).

3. When approved, publish by setting the page's `state` to `"published"` in
   `src/config/site.ts`:

   ```ts
   legalPages: {
     privacy: { state: "published" },
     cookies: { state: "published" },
     terms: { state: "published" },
     accessibility: { state: "published" }
   }
   ```

   Publishing automatically adds the page to the footer and sitemap and makes the
   route reachable.

## Do not

- Do not publish copy that has not been reviewed.
- Do not invent specifics (retention days, registration numbers, DPO names) —
  leave the neutral wording until BTI confirms real values.
