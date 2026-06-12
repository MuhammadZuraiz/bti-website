# Odoo Integration

## Delivery Priority

Lead delivery attempts run in this order:

1. `ODOO_LEAD_WEBHOOK_URL`
2. `GENERIC_LEAD_WEBHOOK_URL`
3. Retain the lead as `queued` for retry

The website can tell a visitor the enquiry was received after PostgreSQL persistence, but it does not claim CRM delivery unless the webhook succeeds.

## Authentication

Set `ODOO_LEAD_WEBHOOK_SECRET` for the Odoo endpoint. Requests include:

- `Authorization: Bearer <secret>`
- `x-bti-webhook-signature: sha256=<hmac>`
- `x-bti-webhook-timestamp`
- `idempotency-key: <publicReference>`
- `x-bti-lead-reference: <publicReference>`

The Odoo controller or middleware should verify the bearer token or HMAC signature and treat the idempotency key as unique.

## Payload Fields

The webhook payload includes public reference, lead type, contact fields, course slug, resource slug, corporate fields, placement-test fields, locale, source page, referrer, UTM fields and consent. It does not include the internal database ID.

## Timeout And Failure

Webhook calls time out after roughly 9 seconds. Non-2xx responses, timeouts and network failures leave the lead queued in PostgreSQL.

## Staging Test

Use a staging Odoo endpoint or a webhook inspector. Submit one lead, confirm `deliveryStatus = delivered`, then force the endpoint to return 500 and confirm the next lead remains `queued`.
