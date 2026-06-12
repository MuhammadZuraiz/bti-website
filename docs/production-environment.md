# Production Environment

## Required Variables

Production requires:

- `DATABASE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `LEAD_RETRY_CRON_SECRET`

At least one webhook URL is also required:

- `ODOO_LEAD_WEBHOOK_URL`
- `GENERIC_LEAD_WEBHOOK_URL`

## Optional Variables

- `ODOO_LEAD_WEBHOOK_SECRET`
- `GENERIC_LEAD_WEBHOOK_SECRET`
- `LEAD_HASH_SALT`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- Public contact/social/map variables from `.env.example`

## Rules

Production URLs must use HTTPS. `NEXT_PUBLIC_SITE_URL` must be the canonical BTI domain and must not use `example.com`.

Server-only secrets must not be prefixed with `NEXT_PUBLIC_`.

## Development Defaults

Local Prisma commands use the Docker Compose PostgreSQL URL when `DATABASE_URL` is absent. The production API path still fails closed if required database, spam, retry or webhook variables are missing.

## Deployment Checklist

1. Provision hosted PostgreSQL.
2. Run `pnpm db:deploy`.
3. Configure Turnstile site and secret keys.
4. Configure Upstash Redis REST or an equivalent Redis REST endpoint.
5. Configure Odoo or generic lead webhook.
6. Configure `LEAD_RETRY_CRON_SECRET`.
7. Add the retry cron job.
8. Submit a staging test lead and confirm persistence plus delivery state.
