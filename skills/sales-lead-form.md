# Skill: Sales Lead Form

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** after owner `keep` (manual), or high-confidence auto after recurse-learn unlocks it.

**Goal:** Turn a shopped + taught complaint into a Never86 sales lead form Myke (or later automation) can work.

Fill and save `SalesLead`:

| Field | Source |
| --- | --- |
| `pain_id` | agent |
| `account_name` | venue |
| `contact_name` / `role` / `handles` | identity shop |
| `city` / `market` | enrich |
| `complaint_thesis` | taught summary |
| `quotes` | raw |
| `vendors_to_displace` | Toast, DoorDash, etc. |
| `why_never86_now` | map pain → Never86 wedge |
| `suggested_angle` | 1 outreach angle (draft only) |
| `sources` | URLs |
| `confidence` | score + teach history |
| `status` | `DRAFT` → owner approve → `QUALIFIED` |

Rules:
- Draft outreach copy may be suggested; **sending** requires approvals MCP.
- Same human/venue across pain agents → merge / link, don't spam duplicate leads.
- Output digest: "N new qualified leads for {pain_id}."

**Done when:** `SalesLead` saved and owner notified.
