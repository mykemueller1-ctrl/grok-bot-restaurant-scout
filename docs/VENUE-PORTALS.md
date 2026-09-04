# Secure venue portals

Each restaurant gets its **own** portal and its **own** data. No shared dump across houses.

**As of: Fri 2026-09-04.** Served by the **enterprise portal gateway** (`docs/PORTAL-SECURITY.md`).

## Tenants

| Venue | ICP | Security | Status |
| --- | --- | --- | --- |
| **Community Tap & Pizza** | owner 1–5 | enterprise secure | **live demo** — Myke / Kenzy / Tom |
| **Taco Bamba** | area-leader multi-unit | enterprise secure | **live demo** — System + John / Red / Travis / Yas |
| **The New American Grill** | owner 1–5 | enterprise secure ready | **ready after Community** — Kristen packs staged |

Registry: `fixtures/portals/tenants.json`

## Serve (required)

```bash
export PORTAL_SESSION_SECRET="$(openssl rand -base64 48)"
node services/portal-gateway/src/server.mjs
# http://127.0.0.1:5174/
```

Do **not** use raw `python3 -m http.server` for real trials — that bypasses auth, cookies, and server-side boundaries.

## Isolation + cyber controls

- scrypt-hashed house codes (no plaintext in `tenant.json`)
- HMAC HttpOnly `SameSite=Strict` sessions scoped to `venue_id`
- Server refuses cross-venue data reads
- Rate-limited login, CSP, clickjacking denials, audit logs without secrets
- CI: `python3 scripts/validate-portal-isolation.py` + `cd services/portal-gateway && npm test`

Demo house codes (rotate before production): see `docs/PORTAL-SECURITY.md`.

## Grill handoff (Kristen)

Grill comes **after** Community. Kristen’s Courser packs are staged in
`fixtures/portals/grill/data/kristen-packs.json`.

When Community’s pattern is proven: same door rails, drop Kristen’s work into Grill like Community’s book — Grill-only data, same secure boundary.

## Compat

Old path `fixtures/ctap-portal/login.html` redirects to Community’s portal.
Canonical seats: `fixtures/portals/community-pizza/seats.json`.

See also: `docs/CTAP-SEATS.md`, `docs/ICP-SCALE.md`, `docs/PORTAL-SECURITY.md`.
