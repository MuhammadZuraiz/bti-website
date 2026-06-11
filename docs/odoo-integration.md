# Odoo Integration

The current lead API lives at `src/app/api/leads/route.ts`. It validates submissions with Zod, rejects honeypot spam, adds a timestamp and sends the payload through `src/services/leads.ts`.

## Production Options

1. Set `ODOO_LEAD_WEBHOOK_URL` to an Odoo controller, Odoo.sh endpoint or middleware service.
2. Set `ODOO_LEAD_WEBHOOK_SECRET` and verify it server-side.
3. Map payload fields into `crm.lead`:
   - `leadType`
   - `fullName`
   - `phone`
   - `email`
   - `preferredContactMethod`
   - `courseInterest`
   - `companyName`
   - `numberOfLearners`
   - `trainingArea`
   - `preferredDeliveryMode`
   - `message`
   - `locale`
   - `sourcePage`
   - UTM fields
   - `timestamp`

## Rate Limiting

Replace `developmentRateLimitAdapter` with Redis, Upstash, Cloudflare Turnstile, WAF-level rate limiting or an Odoo-side spam queue before production.

## Fallback

If Odoo variables are absent, development logs only non-sensitive metadata. The UI does not claim the form is connected to Odoo.
