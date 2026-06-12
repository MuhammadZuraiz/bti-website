# Spam Protection

## Layers

- Hidden honeypot field
- Cloudflare Turnstile
- Per-IP rate limits
- Email/phone fingerprint soft limits
- Duplicate-submission protection
- 32 KB request-body limit

## Recommended Production Services

Use Cloudflare Turnstile and Upstash Redis REST or an equivalent managed Redis REST service.

## Limits

- 5 submissions per IP fingerprint per 10 minutes
- 15 submissions per IP fingerprint per day
- 3 repeated submissions for the same email or phone fingerprint per hour
- Duplicate payload fingerprint rejected within 5 minutes

## Privacy

IP addresses, emails and phone numbers are hashed before being used as rate-limit keys. Logs do not include raw identifiers.

## Development

Every protection layer fails closed unless an explicit development bypass is enabled. The bypasses are environment variables that default to off, only activate when set to `true`, and are rejected by production environment validation:

- `ALLOW_DEV_TURNSTILE_BYPASS=true` lets submissions pass when no `TURNSTILE_SECRET_KEY` is configured.
- `ALLOW_DEV_LOCAL_RATE_LIMIT=true` uses an in-memory rate-limit store when Redis REST is not configured.
- `ALLOW_DEV_SPAM_PROTECTION_BYPASS=true` skips Turnstile and rate limiting entirely (the honeypot still applies). Intended only for local integration smoke tests.

Without these flags, development behaves like production: missing Turnstile or rate-limit configuration blocks submissions. The flags are double-guarded — production environment validation rejects them, and the runtime check ignores them whenever `NODE_ENV` is `production`.

## Staging Test

Use a Turnstile test key or staging key. Submit a valid lead, then submit the same payload again and confirm duplicate rejection. Submit repeated unique payloads from the same browser and confirm rate-limit rejection.
