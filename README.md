# BTI Website Rebuild

Static implementation of the British Training Institute Sharjah trust-and-conversion website, prepared from the BTI digital and Odoo readiness plan.

## What Is Included

- Responsive bilingual public website in `index.html`
- English/Arabic language switch with RTL layout
- Searchable and filterable course catalogue
- Admissions lead form with validation, consent capture and Odoo-ready payload shape
- Draft legal pages for privacy, terms, cookies and accessibility
- SEO files: `robots.txt`, `sitemap.xml`, canonical and structured data metadata
- Implementation docs for Odoo, workflow and launch readiness

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static server.

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Odoo Lead Handoff

The form stores recent lead payloads in browser local storage under `bti.website.leads`. To post to Odoo or an integration middleware, set `leadWebhookUrl` in `scripts.js`:

```js
const BTI_CONFIG = {
  canonicalDomain: "https://btiuae.com/",
  leadWebhookUrl: "https://your-integration-endpoint.example.com/bti/leads",
  leadStorageKey: "bti.website.leads",
};
```

The generated payload contains both a website-friendly `lead` object and an `odooFields` object mapped for `crm.lead`.

## Launch Dependencies

Do not treat this as production-ready until BTI confirms:

- Canonical domain and redirect ownership
- Current SEDD trade licence details
- VAT and corporate tax status
- Final course catalogue, fees and schedules
- Arabic copy owner and reviewer
- Email provider and SPF/DKIM/DMARC status
- Odoo.sh instance, users, roles and CRM stages
- Privacy, terms, cookie and accessibility approvals

## Generated Asset

Hero image generated with the built-in image generation tool and copied to:

`assets/bti-hero-classroom.png`

Original generated source remains under the Codex generated images directory.
