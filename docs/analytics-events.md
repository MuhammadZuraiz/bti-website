# Analytics Events

Implemented event names:

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

The helper in `src/lib/analytics.ts` is a safe no-op unless `window.gtag` exists. Lead conversion events fire only after the API returns `ok: true` following durable persistence. Do not send raw phone numbers, emails or messages to analytics.
