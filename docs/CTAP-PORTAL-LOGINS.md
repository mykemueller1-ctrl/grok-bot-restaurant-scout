# Never86 venue portal logins

**Ship (local gateway):** already running via `bash scripts/ship-portals.sh`  
**Directory:** http://127.0.0.1:5174/  
**Community door:** http://127.0.0.1:5174/community-pizza/login.html

These are **demo house codes** for the Never86 portal gateway (not Toast / POS station passwords). Rotate before production — `docs/PORTAL-SECURITY.md`.

Restart anytime:

```bash
export PORTAL_SESSION_SECRET="$(openssl rand -base64 48)"
bash scripts/ship-portals.sh
```

---

## Community Tap & Pizza — three seats

| Field | Value |
| --- | --- |
| URL | http://127.0.0.1:5174/community-pizza/login.html |
| House code | `ctap-fort-dodge` |
| Venue id | `community-pizza` |

| Role | Seat pick on door | login_id | Person | Price |
| --- | --- | --- | --- | --- |
| Owner | Owner seat · Mychael Mueller (free) | `myke` | Mychael Mueller | free |
| Manager FOH | Manager FOH · Kenzy Thompson (paid) | `kenzy` | Kenzy Thompson | paid |
| Manager BOH | Manager BOH · Tom Dorothy (paid) | `tom` | Tom Dorothy | paid |

**How to sign in:** open Community URL → enter house code `ctap-fort-dodge` → choose your seat → **Open the door**.

API shape (operators / agents):

```bash
curl -X POST http://127.0.0.1:5174/api/auth/login \
  -H 'content-type: application/json' \
  -d '{"venue_id":"community-pizza","house_code":"ctap-fort-dodge","login_id":"myke"}'
```

---

## Taco Bamba (multi-unit)

| Field | Value |
| --- | --- |
| URL | http://127.0.0.1:5174/taco-bamba/login.html |
| House code | `bamba-system` |

| Seat | login_id |
| --- | --- |
| System desk | `system` |
| Area · John | `john` |
| Area · Red | `red` |
| Area · Travis | `travis` |
| Area · Yas | `yas` |

---

## Grill (staged after Community)

| Field | Value |
| --- | --- |
| URL | http://127.0.0.1:5174/grill/login.html |
| House code | `grill-kristen-ready` |
| login_ids | `owner`, `gm` |

---

## What was sucked into Community from Google Drive

Account: `communitypizza2026@gmail.com` → `fixtures/portals/community-pizza/data/`

| Pack | Contents |
| --- | --- |
| Archive Z week | 9/14–9/20/2025 · **$40,274.06** net |
| Sample Zs | 7/15 + 7/16/2026 (+ 10/5/2025 historical) |
| Bar ordering | Liquor/beer sheets · pars · optimization |
| Schedules | Bar · kitchen · driver · X1 week |
| Ops | Weekly numbers guide · menu · vendor intake · schedule how-to |

Live book **8/31–9/6/2026** still open through Fri 9/4 (no invented Sat/Sun closes).

**Excluded on purpose:** Drive doc `CTAP ACCOUNTS` (POS station passwords) — not portal logins; leave in Drive vault.

---

## Security note

Do **not** serve portals with raw `python -m http.server` for real trials — that bypasses the gateway. Always use `portal-gateway`.
