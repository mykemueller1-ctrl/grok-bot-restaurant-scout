# Skill: Auth Gap Check

**Trigger:** first step of `tool-hunt-weekly`, or any Beyond the Hunt run.

**Goal:** Fail soft and loud if Mem0 / Context are still closed — do not pretend the memory/research stack is complete.

1. Run `node scripts/check-auth-gaps.mjs`.
2. If `MEM0_API_KEY` is set, also run `node scripts/mem0-smoke.mjs` (must exit 0).
3. Probe Mem0 / Context MCP namespaces when available; record `needsAuth` vs ready.
4. Append a one-line status to `stack/tool-hunt-memory.md`.
5. Continue the hunt using Composio / git memory fallbacks, but keep ledger `open_gaps` accurate.
6. Brief Myke with any remaining desktop unlocks from `docs/DESKTOP-UNLOCKS.md`.

**Done when:** status logged; hunt may continue blocked but never claims auth is closed without evidence.
