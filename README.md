# grok-bot-restaurant-scout
Grok Bot configuration, skills, routines, and MCP connectors for a restaurant social commerce scout agent that finds trending food creators, drafts shoppable videos, and feeds the TikTok Shop catalog.

## Repository layout

| Path | Purpose |
| --- | --- |
| [`agent/restaurant-scout.agent.json`](agent/restaurant-scout.agent.json) | Agent definition (identity, config, guardrails) |
| [`skills/`](skills) | Morning scan, script drafting, catalog sync, approval gate, weekly report |
| [`routines/daily-scout.routine.json`](routines/daily-scout.routine.json) | Saved routine that runs the pipeline on a schedule |
| [`mcp/`](mcp) | MCP connector specs for the social plugin, commerce engine, and notifications |
| [`docs/RUNBOOK.md`](docs/RUNBOOK.md) | Copy-paste setup steps for the Grok Bot desktop app |

Every outbound action (publish, spend, product create/update, order action)
requires owner approval via `skills/approval-gate.skill.json` before any
connector write call is made. See [`docs/RUNBOOK.md`](docs/RUNBOOK.md) for the
full setup and approval-flow walkthrough.
