#!/usr/bin/env node
/**
 * Inventory project skills + print Sync Skills desktop checklist.
 * No network. No secrets. Exit 0 if skills/ present; 1 if empty/missing.
 */
import { readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const doc = "docs/CURSOR-SYNC-SKILLS.md";

const huntCritical = [
  "tool-frontier-scan.md",
  "vertical-rival-watch.md",
  "memory-skills-audit.md",
  "morning-scan.md",
  "script-draft.md",
  "tool-hunt-brief.md",
  "auth-gap-check.md",
  "stack-vs-competitors.md",
  "lead-shop-enrich.md",
  "sales-lead-form.md",
];

if (!existsSync(skillsDir)) {
  console.error("print-sync-skills-checklist: missing skills/");
  process.exit(1);
}

const files = readdirSync(skillsDir)
  .filter((f) => f.endsWith(".md"))
  .sort();

if (!files.length) {
  console.error("print-sync-skills-checklist: skills/ empty");
  process.exit(1);
}

const missingCritical = huntCritical.filter((f) => !files.includes(f));

const out = {
  ok: true,
  sync_skills_checklist: {
    desktop_ask: "Settings → Agents → Sync Skills for Cloud Agents = On",
    docs: doc,
    project_skills_count: files.length,
    project_skills: files,
    hunt_critical: huntCritical,
    hunt_critical_missing: missingCritical,
    fee_catalog_pause: true,
    still_need: [
      "MEM0_API_KEY or Mem0 MCP OAuth",
      "CONTEXT_DEV_API_KEY or Context MCP OAuth",
      "node scripts/unlock-beyond-the-hunt.mjs → READY",
    ],
  },
};

console.log(JSON.stringify(out, null, 2));
process.exit(missingCritical.length ? 1 : 0);
