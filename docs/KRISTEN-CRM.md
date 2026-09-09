# Kristen CRM — The New American Grill

Operator CRM for **Kristin Aduna** (`ktmaduna@gmail.com`) at **The New American Grill**, plus the Taco Bamba reports she already sends. This is not the CTAP Jessica / Fellers social desk.

`operator_id`: `kristin-grill` · schema: `tenant_kristin_grill`

**Account owner:** Myke Mueller (`myke@n86.app`)
**Holy-grail inbox:** `mykemueller1@gmail.com`
**Repo home:** `grok-bot-restaurant-scout` · branch `cursor/kristen-crm-d405`
**Agent on this job:** [Crm for kristen](https://cursor.com/agents/bc-01a0842a-52b6-7e38-b81b-cd2f38e4d405)

## Why this exists

Grok Bot report-ops already treat Kristen as the holy-grail sender:

- Grill + Taco Bamba CSV / Excel / PDF / sales reportings
- Courser packs staged in `fixtures/portals/grill/data/kristen-packs.json`
- Grill portal ready **after** Community Tap’s pattern is proven

This CRM is the operator layer on top of that: who she is, what we owe her, what pack is current, and what the next seat sale looks like.

## Record

| Field | Value |
| --- | --- |
| Contact | Kristin Aduna (`ktmaduna@gmail.com`) — phone still missing |
| Account | The New American Grill |
| Also sends | Taco Bamba |
| ICP | Owner 1–5 |
| Product | Never 86'd Action Shift — one owner seat free |
| Pipeline stage | Packs staged |
| Latest pack | 2026-08-31 |
| Net sales | $3,408.15 |
| Labor $ | $1,211.85 |
| Labor % | 35.56% |
| SPLH | 35.17 |
| Guests | 119 |
| Tips | $560.38 |

Labor is **above** the CTAP rail (labor < 28%). That is the first teach / Action Shift card, not a verdict.

## Pipeline

1. Lead
2. Packs received
3. **Packs staged** ← here
4. Community pattern proven
5. Grill portal live
6. Owner seat active
7. Teach batches running

Do not skip Community. Same door rails, Grill-only data.

## Next actions

1. Connect Gmail so this agent can file Kristen mail and pull attachments.
2. Connect Drive Courser so newer packs replace the 8/31 snapshot.
3. Capture Kristin’s phone from the next inbound (email is `ktmaduna@gmail.com`).
4. Open a Report Teacher batch on the 8/31 labor + sales files.
5. Keep Jessica / Fellers work in `ctap-social-desk` — different person, different house.
6. Finish draft [PR 22](https://github.com/mykemueller1-ctrl/grok-bot-restaurant-scout/pull/22) (Neon tenant data lake) after Gmail can pull the 9/1 Toast Reports and 9/4 Week 10 invoice.

## Related houses (do not mix)

| House | Kristen? | Status |
| --- | --- |
| The New American Grill | Yes | Ready after Community |
| Taco Bamba | Yes (reports) | Live multi-unit demo |
| Community Tap & Pizza | No | Live demo — Myke / Kenzy / Tom. Jessica Gailey is a CTAP bartender. |
