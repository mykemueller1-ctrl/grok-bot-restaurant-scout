# Skill: Auth Gap Check

**Trigger:** first step of `tool-hunt-weekly`, or any Beyond the Hunt run.

**Goal:** Prove Mem0 + Context are actually usable before claiming the stack is ready.

1. Run `node scripts/print-beyond-the-hunt-status.mjs` (one-screen auth + love live_proof + gaps).
2. Run `node scripts/check-auth-gaps.mjs`.
3. Want `STATUS: READY` (both `MEM0_API_KEY` smoke + `CONTEXT_DEV_API_KEY` search OK), **or** confirm desktop OAuth MCP tools are live in-session.
4. When READY: `node scripts/unlock-beyond-the-hunt.mjs` (Mem0 import + Context smoke) — or `node scripts/mem0-import-tool-hunt-memory.mjs` alone.
5. Append one-line status to `stack/tool-hunt-memory.md`.
6. If blocked: continue hunt with Composio fallbacks, keep `open_gaps` accurate, brief Myke with `docs/DESKTOP-UNLOCKS.md`.
7. Never claim auth closed without smoke evidence.

**Done when:** status logged with evidence.
