#!/usr/bin/env node
/**
 * Smoke-test Mem0 Platform when MEM0_API_KEY is present (headless auth path).
 * Does not print the key. Exit 0 if search works; 2 if key missing; 1 on API error.
 */
const key = process.env.MEM0_API_KEY;
if (!key) {
  console.error("mem0-smoke: MEM0_API_KEY not set (desktop OAuth or set secret — see docs/DESKTOP-UNLOCKS.md)");
  process.exit(2);
}

const userId = "never86-beyond-the-hunt";
const headers = {
  Authorization: `Token ${key}`,
  "Content-Type": "application/json",
};

const addRes = await fetch("https://api.mem0.ai/v3/memories/add/", {
  method: "POST",
  headers,
  body: JSON.stringify({
    messages: [
      { role: "user", content: "Never86 hunts best-in-vertical: love→buy-now and pain→sales-lead. Never sales/labor forecasting research." },
      { role: "assistant", content: "Remembered Never86 Beyond the Hunt standing orders." },
    ],
    user_id: userId,
  }),
});

if (!addRes.ok) {
  console.error("mem0-smoke: add failed", addRes.status, await addRes.text());
  process.exit(1);
}

const searchRes = await fetch("https://api.mem0.ai/v3/memories/search/", {
  method: "POST",
  headers,
  body: JSON.stringify({
    query: "What does Never86 hunt?",
    filters: { user_id: userId },
  }),
});

if (!searchRes.ok) {
  console.error("mem0-smoke: search failed", searchRes.status, await searchRes.text());
  process.exit(1);
}

const data = await searchRes.json();
const n = (data.results || data || []).length;
console.log(`mem0-smoke: ok (${n} memories returned for ${userId})`);
