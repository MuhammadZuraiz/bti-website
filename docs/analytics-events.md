# Analytics Events

Implemented event names:

- `course_card_click`
- `course_filter_use`
- `course_enquiry_submit`
- `general_enquiry_submit`
- `placement_test_request_submit`
- `corporate_enquiry_submit`
- `whatsapp_click`
- `phone_click`
- `email_click`
- `resource_download`
- `language_switch`
- `map_directions_click`

The helper in `src/lib/analytics.ts` is a safe no-op unless `window.gtag` exists.
