# Skill: Tool Frontier Scan

**Trigger:** weekly routine `tool-hunt-weekly`, or on-demand (“hunt new tools”, “what’s new in Cursor”).

**Goal:** Find the latest and greatest AI tooling — Cursor agents / Automations / memories / skills, MCP servers, memory layers, knowledge stores — so Never86 can pivot fast.

1. Read `stack/tooling-ledger.json` (what we already use + last scan date).
2. Read prior findings under `stack/tool-hunt-findings/` — skip re-emitting noise.
3. Research (prefer Bright Data `search_engine` / `search_engine_batch`; fall back to WebSearch if MCP auth fails):
   - Cursor Cloud Agents, Automations, Skills, Memories
   - Memory: Mem0, Zep/Graphiti, Letta, Cursor automation memories
   - Skills / knowledge: Cursor Skills Store, PostHog skills, team marketplace
   - MCP: new high-signal servers relevant to ops / GTM / restaurant stack
   - Competitor coding stacks: Claude Code, Windsurf/Devin Desktop, Copilot, Codex
4. For each novel signal, write a `ToolFinding` JSON to `stack/tool-hunt-findings/YYYY-MM-DD-<slug>.json` matching `schemas/tool-finding.json`.
5. Update `stack/tooling-ledger.json` → `last_scan`, `watchlist`, and `open_gaps`.
6. Cite every factual claim with source URLs.

**Done when:** ≥3 findings written (or an explicit empty-scan note with why), ledger `last_scan` bumped, no secrets committed.
