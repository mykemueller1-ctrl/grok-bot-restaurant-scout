#!/usr/bin/env node
/**
 * Resolves mcp/*.json env placeholders using stack/wiring.json + process env.
 * Writes stack/resolved-secrets.json for Grok Bot import.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wiring = JSON.parse(readFileSync(join(root, "stack/wiring.json"), "utf8"));

const apiUrl = process.env.NEVER86_API_URL ?? process.env.COMMERCE_ENGINE_URL ?? wiring.api.default_host;
const token = process.env.MCP_API_TOKEN ?? process.env.COMMERCE_ENGINE_TOKEN ?? "";

const envMap = {
  COMMERCE_ENGINE_URL: apiUrl,
  COMMERCE_ENGINE_TOKEN: token,
  LEAD_SHOP_TOKEN: token,
  COMPLAINT_SOURCES_TOKEN: token,
  APPROVALS_TOKEN: token,
};

function resolveString(s) {
  return s.replace(/\$\{(\w+)\}/g, (_, key) => envMap[key] ?? `\${${key}}`);
}

const resolved = { apiUrl, connectors: {} };

for (const [name, cfg] of Object.entries(wiring.mcp_connectors)) {
  const raw = JSON.parse(readFileSync(join(root, cfg.file), "utf8"));
  resolved.connectors[name] = {
    ...raw,
    url: resolveString(`${apiUrl}${cfg.path}`),
    auth: raw.auth ? resolveString(raw.auth) : undefined,
  };
}

mkdirSync(join(root, "stack"), { recursive: true });
writeFileSync(join(root, "stack/resolved-secrets.json"), JSON.stringify(resolved, null, 2));
console.log("Wrote stack/resolved-secrets.json");
