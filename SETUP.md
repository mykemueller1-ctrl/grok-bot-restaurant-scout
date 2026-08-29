# Grok Bot — Restaurant Scout Setup

1. Download Grok Bot desktop app, sign in with your Cursor account.
2. New agent → import `agent/restaurant-scout.json` (or paste the description).
3. Settings → Plugins → connect `social-trends` (OmniSocials/Blotato/Zernio) + `restaurant-commerce-engine` + `approvals`.
4. Agent Computer → browser takeover → sign into TikTok + Instagram once. Session persists.
5. Secrets → store all tokens in the secret store (never chat).
6. Routines → import `routines/daily.json`. Test once manually, then enable.
7. First run: confirm 5 leads arrive within 30 min. Then approve a draft end-to-end.

Reference: https://cursor.com/help/grok-bot/getting-started
