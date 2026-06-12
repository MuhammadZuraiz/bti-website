# Lead Capture Architecture

## Data Flow

1. Visitor submits a lead form.
2. `/api/leads` enforces a 32 KB request-body limit and parses JSON.
3. Zod validates the payload by `leadType`.
4. Honeypot, Turnstile, IP rate limits, contact fingerprint limits and duplicate checks run.
5. The lead is saved to PostgreSQL through Prisma.
6. Webhook delivery is attempted to Odoo first, then the generic fallback.
7. Delivery success marks the row `delivered`; delivery failure keeps the row `queued`.
8. The visitor receives success only after PostgreSQL persistence.

## Reliability Rule

No durable persistence means no success message. A webhook attempt by itself is never treated as receipt by BTI.

## Lead Statuses

- `queued`: saved in PostgreSQL and awaiting successful webhook delivery.
- `delivered`: accepted by Odoo or the generic webhook.
- `failed-delivery`: retry attempts reached the configured maximum.

## Public Reference

Visitors see a public-safe reference such as `BTI-A7F29C`. Internal database IDs are not exposed.

## PostgreSQL

Local development can use:

```bash
docker compose up -d postgres
pnpm db:generate
pnpm db:migrate
```

Managed PostgreSQL options include platform-managed Postgres, Neon, Supabase, Railway, Render, Aiven, AWS RDS, Azure Database for PostgreSQL and Google Cloud SQL. BTI is not locked to one vendor.

## Prisma Workflow

Use `pnpm db:migrate` for local migration development and `pnpm db:deploy` in production deployment.

## Monitoring

The structured logger records public reference, lead type, persistence result, delivery result, retry result and spam blocks. It avoids raw email, phone, message, payload and IP values. Compatible monitoring targets include platform logs, Sentry, Axiom and Better Stack.
