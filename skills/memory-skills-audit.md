# Skill: Memory & Skills Audit

**Trigger:** weekly with tool hunt, or after adding MCP / plugins.

**Goal:** Know which memory, agent, and skill surfaces Never86 can use for **vertical GTM** — and which need desktop auth or sync.

1. Inventory **live** surfaces:
   - Cursor Automations memories (if automation exists)
   - Mem0 MCP (auth status — cloud cannot complete interactive auth)
   - Context.dev / Pinecone / other knowledge MCPs
   - Project skills in `skills/`
   - Personal skills sync (`Settings → Agents → Sync Skills for Cloud Agents`)
   - Optional peer: Zapier [gtm-cheat-codes](https://github.com/zapier/gtm-cheat-codes) GTM skills for Cursor (watch — do not replace project `skills/`)
   - PostHog skills store / scouts
2. Compare to ledger `ours.memory` and `ours.skills_knowledge`.
3. Flag `needs_auth` / `needs_sync` / `stale` / `duplicate`.
4. Recommend **one** primary memory path for ops (teach_memory stays GTM source of truth; Mem0/automation memories for cross-run ops).
5. Do **not** recommend forecasting/labor analytics memory products.
6. Write findings + update ledger `open_gaps`.

**Done when:** auth/sync gaps listed with a single desktop ask each; no secrets in git.
