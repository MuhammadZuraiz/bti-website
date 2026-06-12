# Lead Export Runbook

## Purpose

BTI can recover leads from PostgreSQL before full Odoo integration is complete by running a protected server-side CSV export script.

## Command

```bash
pnpm leads:export
```

The command requires `DATABASE_URL` to point at the correct PostgreSQL database.

## Output

CSV files are written to:

```text
exports/
```

The directory is ignored by git.

## Security

Do not expose this as a public endpoint. Run it only from a trusted server, administrator workstation or deployment shell with database access. Store exported CSV files securely and delete them when they are no longer operationally needed.

## Fields

Exports include public reference, creation date, delivery status, attempts, contact details, course/resource context, corporate fields, placement-test fields, message, locale, source page and UTM fields.
