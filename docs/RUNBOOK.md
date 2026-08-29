# Restaurant Scout — Grok Bot Setup Runbook

This runbook walks through configuring the **Restaurant Scout** Grok Bot agent
in the Grok Bot desktop app, using the files in this repository. Everything
here is copy-paste ready.

Reference: https://cursor.com/help/grok-bot/getting-started

## 1. Prerequisites

- Grok Bot desktop app installed and signed in as the restaurant owner/operator.
- Access to the `restaurant-social-commerce-engine` API (production + sandbox base URLs).
- Accounts/admin access for: TikTok for Business (app key/secret), Meta/Instagram,
  Stripe, one social connector (OmniSocials, Blotato, or Zernio), and one
  notifications channel (Slack or Telegram).

## 2. Store secrets (never in chat or repo)

In the Grok Bot desktop app, open **Settings → Secrets** and add:

| Secret name | Purpose |
| --- | --- |
| `TIKTOK_APP_KEY` | TikTok app key |
| `TIKTOK_APP_SECRET` | TikTok app secret |
| `META_ACCESS_TOKEN` | Instagram/Meta Graph API token |
| `STRIPE_API_KEY` | Payment processor used by the commerce engine |
| `SOCIAL_CONNECTOR_API_KEY` | API key for OmniSocials / Blotato / Zernio (pick one) |
| `XAI_API_KEY` | Grok model access |
| `OPENAI_API_KEY` | Optional secondary model access |
| `COMMERCE_ENGINE_API_KEY` | ****** for `restaurant-social-commerce-engine` |
| `NOTIFICATIONS_WEBHOOK_URL` | Slack webhook URL or Telegram bot token |

Do not paste secret values into chat with the agent. Use the desktop app's
secret store UI only.

## 3. Create the agent

1. In the Grok Bot desktop app, choose **New Agent → Import from file**.
2. Import [`agent/restaurant-scout.agent.json`](../agent/restaurant-scout.agent.json).
3. Fill in the placeholder fields in `config`:
   - `city` — the restaurant's local market (e.g. `"Austin, TX"`).
   - `cuisine_tags` — 2-5 hashtags/cuisine categories matching the menu.
   - `menu_reference` — a URL or doc ID the agent can read the current menu from.
   - `timezone` — IANA timezone (e.g. `"America/Chicago"`).

## 4. Add skills

Import each skill file from [`skills/`](../skills):

- `skills/morning-scan.skill.json`
- `skills/script-drafting.skill.json`
- `skills/catalog-sync.skill.json`
- `skills/approval-gate.skill.json`
- `skills/weekly-report.skill.json`

Attach all five to the Restaurant Scout agent.

## 5. Connect plugins / MCP connectors

Import each connector spec from [`mcp/`](../mcp) and fill in the placeholders:

1. **Social connector** (`mcp/social-connector.mcp.json`) — pick exactly one
   provider block (OmniSocials, Blotato, or Zernio), fill in its
   `server_url`, and point `auth.secret_ref` at `SOCIAL_CONNECTOR_API_KEY`.
2. **Commerce engine** (`mcp/commerce-engine.mcp.json`) — set `server.base_url`
   to the production `restaurant-social-commerce-engine` API and
   `sandbox_mode.sandbox_base_url` to its sandbox environment. Leave
   `payments.charge` disabled.
3. **Notifications** (`mcp/notifications.mcp.json`) — pick Slack or Telegram,
   fill in the channel/chat ID, and point the secret ref at
   `NOTIFICATIONS_WEBHOOK_URL`.

## 6. Browser takeover for TikTok/Instagram

1. In the agent settings, open **Browser Takeover**.
2. Add `tiktok.com` and `instagram.com` as takeover targets (already declared
   in `agent/restaurant-scout.agent.json`).
3. Click **Sign in now** for each site. Complete the login as the restaurant
   owner. Grok Bot persists the session so future scans don't require
   re-authentication.

## 7. Save the routine

1. Import [`routines/daily-scout.routine.json`](../routines/daily-scout.routine.json).
2. Confirm the schedule: `0 6 * * *` (daily 6am, agent's configured timezone),
   plus a Monday 8am weekly report add-on.
3. Toggle **Run while owner is away** on.
4. Save the routine and attach it to the Restaurant Scout agent.

## 8. Approval gate — how it works

Every outbound action (`publish`, `schedule_post`, `spend`, `product_create`,
`product_update`, `order_action`) is routed through
`skills/approval-gate.skill.json` before any connector write call is made:

1. A skill (e.g. `catalog-sync`) builds the payload it wants to send.
2. It calls the approval-gate skill instead of the connector directly.
3. Approval-gate sends an Approve/Reject ping via the notifications connector.
4. On approval, it mints an `approval_token` bound to the exact payload hash.
5. Only requests carrying a valid `approval_token` are accepted by the
   commerce engine and social connectors (`requires_approval_token: true` on
   each write capability).
6. Rejections and timeouts are logged and surfaced in the weekly report; no
   write call is made.

## 9. Test the end-to-end approval flow (sandbox)

1. Point `mcp/commerce-engine.mcp.json` at `sandbox_base_url`.
2. Manually trigger `skills/morning-scan.skill.json`, then
   `skills/script-drafting.skill.json`.
3. Approve one script when prompted.
4. Confirm `skills/catalog-sync.skill.json` runs and a draft product appears
   in the sandbox commerce engine dashboard.
5. Repeat once rejecting the prompt and confirm no product is created.
6. Once verified, switch the commerce engine connector back to the production
   `base_url`.

## 10. Acceptance criteria checklist

- [ ] Agent created in Grok Bot desktop app with the description above.
- [ ] Plugins connected; browser session for TikTok/Instagram authenticated by owner.
- [ ] Routine saved and runs on schedule.
- [ ] First real scan produces a verifiable list of 5 creators within 30 minutes.
- [ ] Approval flow tested end-to-end (draft → ping → approve → product created in sandbox).
