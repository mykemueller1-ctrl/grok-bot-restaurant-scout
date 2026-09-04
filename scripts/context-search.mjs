#!/usr/bin/env node
/**
 * Headless Context.dev web search via REST (Bearer CONTEXT_DEV_API_KEY).
 * MCP Context is OAuth-desktop-only; this closes research auth for cloud/CI.
 * Usage: node scripts/context-search.mjs "query here"
 * Exit: 0 ok, 2 missing key, 1 API error. Never prints the key.
 */
const key = process.env.CONTEXT_DEV_API_KEY;
const query = process.argv.slice(2).join(" ").trim();

if (!key) {
  console.error(
    "context-search: CONTEXT_DEV_API_KEY not set (ctxt_secret_… from https://context.dev — see docs/DESKTOP-UNLOCKS.md)"
  );
  process.exit(2);
}
if (!query) {
  console.error('context-search: pass a query, e.g. node scripts/context-search.mjs "Owner.com restaurant AI"');
  process.exit(2);
}

const res = await fetch("https://api.context.dev/v1/web/search", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  },
  // API requires numResults 10–100 (default 10)
  body: JSON.stringify({ query, numResults: 10 }),
});

if (!res.ok) {
  console.error("context-search: failed", res.status, await res.text());
  process.exit(1);
}

const data = await res.json();
const results = data.results || data.data || data;
const n = Array.isArray(results) ? results.length : Object.keys(results || {}).length;
console.log(`context-search: ok (${n} result units) for query length ${query.length}`);
if (Array.isArray(results)) {
  for (const r of results.slice(0, 5)) {
    const title = r.title || r.name || "";
    const url = r.url || r.link || "";
    if (title || url) console.log(` - ${title} ${url}`.trim());
  }
}
