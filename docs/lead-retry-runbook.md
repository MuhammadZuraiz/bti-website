# Lead Retry Runbook

## Endpoint

```text
POST /api/internal/retry-leads
```

Send either:

```text
x-bti-cron-secret: <LEAD_RETRY_CRON_SECRET>
```

or:

```text
Authorization: Bearer <LEAD_RETRY_CRON_SECRET>
```

## Behavior

The endpoint retries queued or failed-delivery leads below the maximum attempt count. It limits batch size, updates attempt counters and timestamps, marks successes as `delivered`, and leaves failures queued until the maximum is reached.

The response contains only counts:

```json
{
  "attempted": 1,
  "delivered": 1,
  "stillQueued": 0,
  "skipped": 0
}
```

No PII is returned.

## Cron Setup

Configure the hosting platform cron scheduler to call the endpoint every 5 to 15 minutes. Keep the secret outside source control.

## When Delivery Fails

1. Check platform logs for `lead_delivery_queued` and `lead_retry_still_queued`.
2. Confirm Odoo or generic webhook availability.
3. Run the retry endpoint manually after the webhook is healthy.
4. Use `pnpm leads:export` if admissions needs temporary manual recovery.
