# Skill: Stack vs Competitors

**Trigger:** after `tool-frontier-scan`, or when Myke asks “what are we using vs them?”

**Goal:** Clear matrix — Never86 stack vs competitor / peer stacks — so pivots are evidence-based.

1. Load `stack/tooling-ledger.json` sections: `ours`, `competitors`, `open_gaps`.
2. For each competitor row, refresh from latest public sources (docs, changelogs, comparison writeups). Do not invent usage.
3. Fill gaps only when evidence exists:
   - IDE / agent surface
   - Memory layer
   - Skills / knowledge
   - MCP / connectors
   - Orchestration / automations
4. Update `competitors[]` and `open_gaps[]` in the ledger.
5. Produce a short operator table in the brief (see `tool-hunt-brief`): **Us | Them | Gap | Pivot speed**.

**Done when:** ledger competitor rows are dated, every gap has a verdict (`close` / `watch` / `ignore`), and the brief can be generated without extra research.
