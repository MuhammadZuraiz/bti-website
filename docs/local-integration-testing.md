# Local Integration Testing

How to run the full lead-capture flow on a development machine with a real PostgreSQL and a local webhook receiver. Everything here is development-only.

## 1. Start PostgreSQL

```bash
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
pnpm db:verify
```

If another PostgreSQL already uses port 5432:

```bash
POSTGRES_PORT=5433 docker compose up -d postgres
# and set in .env.local:
# DATABASE_URL=postgresql://bti:bti_local_password@localhost:5433/bti_website?schema=public
```

`pnpm db:verify` inserts a synthetic lead, reads it back, checks fields and indexes, then deletes it. It exits non-zero on any failure.

## 2. Configure .env.local

```text
DATABASE_URL=postgresql://bti:bti_local_password@localhost:5432/bti_website?schema=public
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ALLOW_DEV_TURNSTILE_BYPASS=true
ALLOW_DEV_LOCAL_RATE_LIMIT=true
GENERIC_LEAD_WEBHOOK_URL=http://localhost:4567/test-webhook
GENERIC_LEAD_WEBHOOK_SECRET=local-test-secret
LEAD_RETRY_CRON_SECRET=local-retry-secret-0123
LEAD_HASH_SALT=local-dev-salt
```

The `ALLOW_DEV_*` flags are explained in `docs/spam-protection.md`. They are rejected in production.

## 3. Start the webhook receiver

```bash
pnpm test:webhook-server
```

It listens on `http://localhost:4567/test-webhook`, verifies the HMAC signature or bearer secret, responds with an `x-delivery-id` header, and logs only the public reference and lead type — never contact details.

Switch behaviour at runtime:

```bash
curl -X POST http://localhost:4567/mode/fail      # simulate CRM outage
curl -X POST http://localhost:4567/mode/success   # restore delivery
```

The script refuses to start when `NODE_ENV=production` and is never part of the production runtime.

## 4. Run the flow

```bash
pnpm dev
```

Submit a form, or POST synthetic JSON to `/api/leads`. Then confirm:

- delivered lead: row in `LeadSubmission` with `deliveryStatus = delivered`
- queued lead: switch the receiver to fail mode first, then `deliveryStatus = queued`
- retry: switch back to success mode and call
  `POST /api/internal/retry-leads` with `x-bti-cron-secret: <LEAD_RETRY_CRON_SECRET>`
- outage: `docker compose stop postgres`, submit, expect HTTP 503 with `ok: false`

Use synthetic names, `@bti.invalid` email addresses and reserved test phone numbers only. Never use real personal data in local testing.

## 5. Export

```bash
pnpm leads:export
```

Writes a CSV under the git-ignored `exports/` directory.
