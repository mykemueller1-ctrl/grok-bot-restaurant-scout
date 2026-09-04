# Skill: Memory & Skills Audit

**Trigger:** weekly with tool hunt, or after adding MCP / plugins.

**Goal:** Know exactly which memory, agent, and skill surfaces Never86 can use right now — and which need auth or sync.

1. Inventory **live** surfaces for this cloud/agent environment:
   - Cursor Automations memories (if automation exists)
   - Mem0 MCP (auth status)
   - Context.dev / Pinecone / other knowledge MCPs
   - Project skills in `skills/`
   - Personal skills sync (`Settings → Agents → Sync Skills for Cloud Agents`)
   - PostHog skills store / scouts
2. Compare to ledger `ours.memory` and `ours.skills`.
3. Flag:
   - `needs_auth` — MCP present but unauthenticated (e.g. Mem0, Context)
   - `needs_sync` — personal skills not available to cloud agents
   - `stale` — skill/doc older than 90 days with no teach updates
   - `duplicate` — overlapping memory layers fighting each other
4. Recommend **one** primary memory path (don’t run three competing stores without a reason).
5. Write findings + update ledger `open_gaps`.

**Done when:** auth/sync gaps listed with a single operator ask each; no secret values written to git.
