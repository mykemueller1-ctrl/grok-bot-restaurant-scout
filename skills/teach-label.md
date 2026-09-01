# Skill: Teach Label

**Used by:** all `never86-pain-shoppers` agents.  
**Trigger:** after `lead-shop-enrich`, or when owner opens a teach batch.

**Goal:** Give Myke leads in a form he can teach — what is / isn't a real Never86 customer signal.

1. Package a teach batch (default 5–10 leads) as a Telegram/Slack digest + structured form fields:
   - Why this lead was picked
   - Complaint one-liner + 1–3 quotes
   - Venue / role / vendors
   - Agent's guessed `pain_id` fit and confidence
2. Owner labels each lead:
   - `keep` | `reject` | `wrong_pain` | `wrong_icp` | `needs_research`
   - Optional: corrected pain tag, notes ("this is the shit we want", "influencer not operator", "already customer")
   - Optional: rewrite of what "good" looks like in one sentence
3. Persist labels on `PainLead` + append to the pain agent's `teach_memory`.
4. If `keep` → status `READY_FOR_FORM` and queue `sales-lead-form`.
5. If `wrong_pain` → reassign or spawn note for the sibling agent.
6. Always ack owner: what was learned in this batch (1–3 bullets).

**Done when:** every item in the batch has an owner label.
