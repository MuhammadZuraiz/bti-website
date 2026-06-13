# Analytics Events

## Loading model

Google Analytics loads only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. With
no ID (the default), `src/components/seo/analytics-scripts.tsx` renders
nothing and no third-party request is made. The CSP adds Google Analytics
origins only when the ID is configured.

Keep the ID unset until BTI approves:

1. The analytics provider.
2. The cookie-consent approach (see below).

## Consent

UAE PDPL does not mirror the EU cookie-banner regime, but BTI serves
international learners. A decision is required from BTI before enabling
analytics:

- **Option A — no banner:** enable analytics with IP anonymisation only
  (currently configured via `anonymize_ip`), document it in the privacy
  notice, and accept residual risk.
- **Option B — consent banner:** gate the analytics scripts behind a consent
  state. Render the banner only when analytics is configured.

No consent banner is implemented today because no legal wording has been
approved — do not fabricate one. Until then analytics stays off by default.

## Event names

- `course_view`
- `course_card_click`
- `course_filter_use`
- `general_enquiry_confirmed`
- `course_enquiry_confirmed`
- `placement_test_request_confirmed`
- `corporate_enquiry_confirmed`
- `resource_request_confirmed`
- `lead_submission_failed`
- `whatsapp_click`
- `phone_click`
- `email_click`
- `resource_download`
- `language_switch`
- `map_directions_click`

## Safety rules

- The helper in `src/lib/analytics.ts` is a safe no-op unless `window.gtag`
  exists.
- Lead conversion events fire only after the API returns `ok: true` following
  durable PostgreSQL persistence (`tests/analytics.test.ts`,
  `tests/lead-response.test.ts`).
- Failure events carry lead type, locale, page and slugs only — never names,
  phone numbers, emails or messages.
- UTM values are stored on the lead record itself, so attribution survives
  even with analytics disabled.
