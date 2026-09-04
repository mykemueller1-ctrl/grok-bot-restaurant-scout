#!/usr/bin/env node
/**
 * When MEM0_API_KEY is set, push stack/tool-hunt-memory.md into Mem0
 * (user_id never86-beyond-the-hunt) so Beyond the Hunt has durable memory.
 * Exit: 0 ok, 2 missing key, 1 API error. Never prints the key.
 */
import { readFileSync } from "node:fs";

const key = process.env.MEM0_API_KEY;
if (!key) {
  console.error(
    "mem0-import: MEM0_API_KEY not set — see docs/DESKTOP-UNLOCKS.md"
  );
  process.exit(2);
}

const userId = "never86-beyond-the-hunt";
const path = "stack/tool-hunt-memory.md";
let body;
try {
  body = readFileSync(path, "utf8").trim();
} catch (e) {
  console.error("mem0-import: cannot read", path, e.message);
  process.exit(1);
}

if (!body) {
  console.error("mem0-import: memory file empty");
  process.exit(1);
}

// Chunk by dated sections so Mem0 can retrieve recent hunt bullets.
const chunks = body
  .split(/\n(?=### )/)
  .map((c) => c.trim())
  .filter(Boolean)
  .slice(-12); // latest ~12 sections

const headers = {
  Authorization: `Token ${key}`,
  "Content-Type": "application/json",
};

let ok = 0;
for (const chunk of chunks) {
  const res = await fetch("https://api.mem0.ai/v3/memories/add/", {
    method: "POST",
    headers,
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content:
            "Import Never86 Beyond the Hunt git memory (love→buy-now + pain→sales-lead only; never forecasting):",
        },
        { role: "assistant", content: chunk.slice(0, 6000) },
      ],
      user_id: userId,
      metadata: { source: path, lane: "beyond_the_hunt" },
    }),
  });
  if (!res.ok) {
    console.error("mem0-import: add failed", res.status, await res.text());
    process.exit(1);
  }
  ok += 1;
}

console.log(
  `mem0-import: ok (${ok} chunks → user_id=${userId} from ${path})`
);
