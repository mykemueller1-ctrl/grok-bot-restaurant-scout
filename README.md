# Grok Bot — Never86 Agents

Agent configs, skills, routines, and MCP connectors for Never86.

## Agents

### Restaurant Scout
Shoppable content scout — find love-proven food brands / UGC and draft buy-now scripts.

- `agent/restaurant-scout.json`
- Skills: `morning-scan`, `script-draft`, `catalog-sync`
- Routine: `routines/daily.json` (07:00 America/Chicago)

### Pain Shoppers (sales lead hunters)
Six agents that **shop customers** for Never86 by scanning TikTok, Reddit, Facebook groups, and forums for operator complaints — then capture identity + complaint context, let you teach/label, recurse-learn, and automate the sales lead form.

| Agent | Pain |
| --- | --- |
| `agent/pain-shoppers/toast-pos.json` | Fuck Toast / POS hate |
| `agent/pain-shoppers/labor.json` | Labor / staffing / scheduling |
| `agent/pain-shoppers/tech-stack.json` | Tech stack suck / siloed vendors |
| `agent/pain-shoppers/cost.json` | Cost / fees / margins |
| `agent/pain-shoppers/drift.json` | Menu / price / data drift |
| `agent/pain-shoppers/marketplace-3p.json` | DoorDash / Grubhub / Uber Eats (3P) |

Family index: `agent/pain-shoppers/family.json`  
Shared loop skills: `pain-complaint-scan` → `lead-shop-enrich` → `teach-label` → `recurse-learn` → `sales-lead-form`  
Schemas: `schemas/pain-lead.json`, `teach-feedback.json`, `sales-lead.json`  
Routine: `routines/pain-shoppers-daily.json` (08:00 America/Chicago)

**Shop** = get their info + the context window of what they're complaining about.  
**Teach** = you label keeps/rejects so agents learn.  
**Automate** = fill Never86 sales lead forms; outreach still needs approval.

## MCP

- `mcp/commerce-engine.json` — menu / TikTok product drafts
- `mcp/social-connector.json` — trends + social read
- `mcp/complaint-sources.json` — TikTok / Reddit / FB groups / forums search
- `mcp/lead-shop.json` — pain leads, teach memory, sales forms
- `mcp/approvals.json` — gates outbound

## Setup

See `SETUP.md`.

Sibling repo: `restaurant-social-commerce-engine` (API + dashboard).
