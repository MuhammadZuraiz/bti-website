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

When Turnstile or Redis is absent in development, local adapters allow safe testing. Production fails closed if bot verification or rate limiting is not configured.

## Staging Test

Use a Turnstile test key or staging key. Submit a valid lead, then submit the same payload again and confirm duplicate rejection. Submit repeated unique payloads from the same browser and confirm rate-limit rejection.
