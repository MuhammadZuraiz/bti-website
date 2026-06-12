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

Local Prisma commands use the Docker Compose PostgreSQL URL when `DATABASE_URL` is absent. The production API path still fails closed if required database, spam, retry or webhook variables are missing, and the Prisma client refuses to start in production without `DATABASE_URL`.

If another PostgreSQL already occupies port 5432 locally, start the container on a different host port and point `DATABASE_URL` at it:

```bash
POSTGRES_PORT=5433 docker compose up -d postgres
# DATABASE_URL=postgresql://bti:bti_local_password@localhost:5433/bti_website?schema=public
```

## Development Bypass Flags

`ALLOW_DEV_SPAM_PROTECTION_BYPASS`, `ALLOW_DEV_TURNSTILE_BYPASS` and `ALLOW_DEV_LOCAL_RATE_LIMIT` are development-only. Each defaults to off and must be set to `true` explicitly. Production environment validation rejects any of them set to `true`, and the runtime ignores them in production regardless. Never set them in a deployed environment.

## Deployment Checklist

1. Provision hosted PostgreSQL.
2. Run `pnpm db:deploy`.
3. Configure Turnstile site and secret keys.
4. Configure Upstash Redis REST or an equivalent Redis REST endpoint.
5. Configure Odoo or generic lead webhook.
6. Configure `LEAD_RETRY_CRON_SECRET`.
7. Add the retry cron job.
8. Submit a staging test lead and confirm persistence plus delivery state.
