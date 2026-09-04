# Portal security (enterprise)

Never86 venue portals are served by **`services/portal-gateway`** — not raw `python -m http.server`.

## Controls

| Control | Implementation |
| --- | --- |
| House codes | scrypt hashes only (`hashes/house-codes.json`) — no plaintext in `tenant.json` |
| Sessions | HMAC-SHA256 tokens, **HttpOnly** + **SameSite=Strict** cookies, venue-scoped claims |
| Data boundary | Server refuses cross-venue reads even with a stolen sibling URL |
| Path traversal | Normalized path resolve; `..` rejected |
| Brute force | Per-IP+venue rate limit on `/api/auth/login` |
| Headers | CSP, `X-Frame-Options: DENY`, `nosniff`, COOP/CORP, no-store |
| Audit | JSON logs for auth ok/fail/rate-limit — **never** logs codes or tokens |
| CSP scripts | External `app.js` / `isolation.js` only (no inline script) |

## Run (local)

```bash
export PORTAL_SESSION_SECRET="$(openssl rand -base64 48)"
# optional prod cookie flag:
# export PORTAL_COOKIE_SECURE=1
# export PORTAL_HSTS=1
node services/portal-gateway/src/server.mjs
# http://127.0.0.1:5174/
```

## Demo operator house codes

These are **demo-only**. Rotate before any real customer deploy (`scripts/hash-house-code.mjs`).

| Venue | Demo code |
| --- | --- |
| Community Tap & Pizza | `ctap-fort-dodge` |
| Taco Bamba | `bamba-system` |
| The New American Grill | `grill-kristen-ready` |

## Rotate a house code

```bash
node scripts/hash-house-code.mjs --venue community-pizza --code 'new-long-random-code'
# then update the operator vault / password manager — never commit plaintext
```

## Tests

```bash
export PORTAL_SESSION_SECRET="$(openssl rand -base64 48)"
cd services/portal-gateway && npm test
python3 scripts/validate-portal-isolation.py
```

## Production checklist

1. Fresh `PORTAL_SESSION_SECRET` (≥32 chars) in secrets manager — never git
2. Rotate all three house codes; store only in vault
3. TLS terminator + `PORTAL_COOKIE_SECURE=1` + `PORTAL_HSTS=1`
4. Confirm CI job `portal-gateway` is green
5. Grill stays `ready_after_community` until Community pattern is proven
