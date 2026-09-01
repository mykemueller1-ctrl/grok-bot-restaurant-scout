# Grok Bot — Never86 Setup

## Shared

1. Download Grok Bot desktop app, sign in with your Cursor account.
2. Secrets → store all tokens in the secret store (never chat): commerce, social, lead-shop, complaint-sources, approvals.
3. Agent Computer → browser takeover → sign into TikTok + Instagram (+ Reddit / Facebook if used). Session persists.

## Restaurant Scout

1. New agent → import `agent/restaurant-scout.json`.
2. Plugins → `social-trends` + `restaurant-commerce-engine` + `approvals`.
3. Routines → import `routines/daily.json`. Test once, then enable.
4. First run: confirm 5 leads within 30 min; approve one draft end-to-end.

## Pain Shoppers (one agent per pain)

1. Create **six** agents — import each file under `agent/pain-shoppers/`:
   - `toast-pos.json`
   - `labor.json`
   - `tech-stack.json`
   - `cost.json`
   - `drift.json`
   - `marketplace-3p.json`
2. Plugins on each → `complaint-sources` + `social-trends` + `lead-shop` + `approvals`.
3. Attach shared skills: `pain-complaint-scan`, `lead-shop-enrich`, `teach-label`, `recurse-learn`, `sales-lead-form`.
4. Routines → import `routines/pain-shoppers-daily.json` (or one routine per agent using the same step list).
5. First week is **teach mode**:
   - Agents shop complaints and ping you teach batches.
   - Label: `keep` / `reject` / `wrong_pain` / `wrong_icp` / `needs_research`.
   - Add one-line notes ("this is the shit we want").
   - Recurse-learn updates query banks automatically after each batch.
6. When keep-rate looks right, allow high-confidence auto-fill of `SalesLead` forms. Outreach / DM / email still requires approval.

### What a good teach batch looks like

You get: venue + role guess, quotes, vendors named, why the agent scored it, and a place to say keep/kill. That feedback is the training data — no separate fine-tune step.

Reference: https://cursor.com/help/grok-bot/getting-started
