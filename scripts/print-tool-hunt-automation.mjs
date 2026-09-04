#!/usr/bin/env node
/**
 * Print paste-ready Cursor Automation payload for Beyond the Hunt weekly.
 * No network. No secrets. Exit 0.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const routinePath = join(root, "routines", "tool-hunt-weekly.json");
const docPath = join(root, "docs", "CURSOR-AUTOMATION-TOOL-HUNT.md");

if (!existsSync(routinePath)) {
  console.error("print-tool-hunt-automation: missing routines/tool-hunt-weekly.json");
  process.exit(1);
}

const routine = JSON.parse(readFileSync(routinePath, "utf8"));
const ca = routine.cursor_automation || {};
const prompt =
  ca.prompt_hint ||
  "Run Beyond the Hunt — see docs/CURSOR-AUTOMATION-TOOL-HUNT.md";

const out = {
  ok: true,
  automation: {
    url: "https://cursor.com/automations",
    memories: ca.memories !== false,
    schedule: routine.schedule || "0 9 * * 1",
    timezone: routine.timezone || "America/Chicago",
    docs: ca.docs || "docs/TOOL-HUNT.md",
    paste_doc: existsSync(docPath) ? "docs/CURSOR-AUTOMATION-TOOL-HUNT.md" : null,
    out_of_scope: routine.out_of_scope || [],
    prompt,
  },
  checklist: [
    "Create Automation at cursor.com/automations with memories on",
    "Paste prompt from automation.prompt (or docs/CURSOR-AUTOMATION-TOOL-HUNT.md)",
    "Unlock MEM0_API_KEY + CONTEXT_DEV_API_KEY (docs/DESKTOP-UNLOCKS.md)",
    "node scripts/unlock-beyond-the-hunt.mjs → exit 0",
    "Fee catalog paused — no new fee dogfoods unless cite sharpens love→buy-now / Cursor stack",
  ],
};

console.log(JSON.stringify(out, null, 2));
process.exit(0);
