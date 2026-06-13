# Redirect Map (planning only — nothing is activated)

Do not activate any redirect until BTI confirms the canonical domain and
proves registrar/DNS access for each legacy domain. Activating redirects
without ownership confirmation risks breaking mail or live listings.

## Required access (to be confirmed with BTI)

| Item | Needed for | Owner | Status |
| ---- | ---------- | ----- | ------ |
| Registrar logins for all three domains | Domain control, renewal | Unconfirmed | Pending BTI |
| DNS hosting access | Redirect records | Unconfirmed | Pending BTI |
| Cloudflare account (recommended) | Bulk redirects, SSL | Unconfirmed | Pending BTI |
| Redirect owner (named person) | Launch + rollback | Unconfirmed | Pending BTI |

## Planned redirects

| Legacy domain or URL | New destination | Redirect type | Approval status | Owner | Verification status |
| -------------------- | --------------- | ------------- | --------------- | ----- | ------------------- |
| `btiuae.com/*` | Canonical domain, path-for-path where pages exist, else home | 301 | Pending BTI | Pending | Not verified |
| `britain-institute.com/*` | Canonical domain (note: current public email uses this domain — confirm mail impact first) | 301 | Pending BTI | Pending | Not verified |
| `btiuk.org/*` | Canonical domain home | 301 | Pending BTI | Pending | Not verified |
| Stale indexed paths (collect from Search Console after verification) | Closest live page or home | 301 | Pending BTI | Pending | Not verified |

## Launch verification process

1. Confirm canonical domain in writing from BTI.
2. Inventory currently indexed URLs for each legacy domain
   (`site:btiuae.com` etc. plus Search Console once verified).
3. Configure 301s (Cloudflare bulk redirects or registrar forwarding).
4. Verify with `curl -I` per legacy URL: expect a single 301 hop to the
   canonical HTTPS URL.
5. Submit change-of-address in Search Console where applicable.
6. Keep legacy domains registered and renewing — expired domains break
   redirects permanently.

## Rollback

Redirects are DNS/edge-level and reversible: remove the redirect rule and
restore previous records. Document the previous record set before changing
anything.
