# Skill: Tool Frontier Scan

**Trigger:** weekly routine `tool-hunt-weekly`, or on-demand (“hunt new tools”, “best in vertical”).

**Goal:** Find the latest and greatest tools for **Never86’s vertical** — social commerce GTM, pain→sales-lead, Cursor agents/memory/skills — so we stay best-in-class and can pivot fast.

### In scope
- Cursor Cloud Agents, Automations, Skills, Memories
- Memory layers that help teach/label + ops memory (Mem0, automation memories; watch Zep/Letta)
- MCP relevant to GTM / social / approvals / research
- Vertical rivals: Owner, Trenz, Restomas, Feedia, BrandPal, CreatOK, Straunt, Zayos, TextOrder, FOSA (Messenger), Menami, Seekadu, Klikit (APAC+US), Deliverect/Zyda/ChatFood/BentoBox/Toast/Flipdish/Kyte/Square Online/GloriaFood (IG/FB Order Food — FBE peer count 9), Ressto/FoodBooking/Tablevibe (CTA linkers only), Menusso (branded app ≠ Meta Order Food), DirectOrders/RAY/Mirar/Mando/Orderlya (IG DM), Palmate/DMHub (WA/IG order+reserve), BiteSight/Smiilen (video marketplace), CheckIt/FeedGrid/SwipeReel (Shopify shoppable feeds), linkboo + NullMark (webview / IAB escape), OrderPost, Beebz, Seared, Moast, Ainisa, similar

### Out of scope (skip / verdict `skip`)
- Historical sales forecasting products
- Labor forecasting / schedule optimization research
- Generic restaurant BI platform bake-offs
- Features inside otherwise-relevant rivals that are forecasting/labor-only (e.g. Menami staff-forecast) — watch the GTM slice only

1. Read `stack/tooling-ledger.json` + prior `stack/tool-hunt-findings/`.
2. Research (Composio `COMPOSIO_SEARCH_WEB` Active primary + `COMPOSIO_SEARCH_TAVILY` secondary; Bright Data when auth works; Context when keys/OAuth ready).
3. Write `ToolFinding` JSON files matching `schemas/tool-finding.json`.
4. Update ledger `last_scan`, `watchlist`, `open_gaps`, `competitors` (vertical + coding).
5. Cite every factual claim with source URLs.

**Done when:** ≥3 findings (or explicit empty-scan note), ledger bumped, no secrets, no forecasting drift.
