# Secure venue portals

Each restaurant gets its **own** portal and its **own** data. No shared dump across houses.

**As of: Fri 2026-09-04.**

## Tenants

| Venue | ICP | Security | Status |
| --- | --- | --- | --- |
| **Community Tap & Pizza** | owner 1–5 | secure | **live demo** — Myke / Kenzy / Tom seats |
| **Taco Bamba** | area-leader multi-unit | secure | **live demo** — System + John / Red / Travis / Yas |
| **The New American Grill** | owner 1–5 | secure ready | **ready after Community** — Kristen packs staged |

Registry: `fixtures/portals/tenants.json`

## Serve

```bash
python3 -m http.server 5174 --bind 0.0.0.0 --directory fixtures/portals
# http://127.0.0.1:5174/
```

## Isolation rule

- A portal may only `fetch` JSON under its own folder (`./tenant.json`, `./seats.json`, `./data/…`).
- Each `tenant.json` lists `forbidden_venue_ids` for every other house.
- Session keys are venue-scoped (`never86.portal.<venue_id>`).
- CI: `python3 scripts/validate-portal-isolation.py`

Demo house codes (not production credentials):

| Venue | Code |
| --- | --- |
| Community | `ctap-fort-dodge` |
| Taco Bamba | `bamba-system` |
| Grill | `grill-kristen-ready` |

## Grill handoff (Kristen)

Grill comes **after** Community. Kristen’s Courser labor + sales packs are already staged in
`fixtures/portals/grill/data/kristen-packs.json`.

When Community’s pattern is proven: copy the Community door rails and drop Kristen’s work into Grill
the same way Community holds `historical-sales` — Grill-only data, same secure boundary.

## Compat

Old path `fixtures/ctap-portal/login.html` redirects to `fixtures/portals/community-pizza/login.html`.
Seat ledger for CTAP still mirrored under `fixtures/ctap-portal/seats.json` for older links; canonical
portal seats live under `fixtures/portals/community-pizza/`.

See also: `docs/CTAP-SEATS.md`, `docs/ICP-SCALE.md`.
