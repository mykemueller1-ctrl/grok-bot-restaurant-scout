# Skill: Report Teach Batch

**Used by:** Report Teacher (`agent/report-ops/teacher.json`).  
**Trigger:** Kristen packs, unlabeled dumps, or parent requests teach.

**Goal:** Myke teaches what each report *is* — keep / reject / wrong_report / wrong_venue.

1. Package 5–10 items (files or normalized cards) with:
   - Guessed `report_id` + `venue_id`
   - Why (headers, globs, source path)
   - Top signals (hours, top SKUs, day net, par over/under)
2. Owner labels:
   - `keep` | `reject` | `wrong_report` | `wrong_venue` | `needs_research`
   - Optional: “this is Schedule & Labor”, “this is product mix down to SKUs”, venue correction
3. Persist on teach_memory for the sub-agent + parent.
4. `wrong_report` → re-route to sibling sub.
5. `keep` on Grill / Taco Bamba Kristen packs → mark holy-grail ground truth.

**Done when:** every item in the batch has an owner label.
