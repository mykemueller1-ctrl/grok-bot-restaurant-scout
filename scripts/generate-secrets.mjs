#!/usr/bin/env node
/**
 * Generates MCP_API_TOKEN + Grok Bot secret bundle for Never86 stack.
 * Run: node scripts/generate-secrets.mjs
 * Cloud agents run this after Render blueprint deploy and paste output into Grok Bot secrets.
 */
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const wiring = JSON.parse(readFileSync(join(root, "stack/wiring.json"), "utf8"));

const token = randomBytes(32).toString("hex");
const apiUrl = process.env.NEVER86_API_URL ?? wiring.api.default_host;

const secrets = {};
for (const [key, template] of Object.entries(wiring.grok_bot_secrets)) {
  secrets[key] = template
    .replace(/\$\{NEVER86_API_URL\}/g, apiUrl)
    .replace(/\$\{MCP_API_TOKEN\}/g, token)
    .replace(/\$\{OWNER_EMAIL\}/g, process.env.OWNER_EMAIL ?? "ops@never86.ai");
}

console.log(JSON.stringify({ MCP_API_TOKEN: token, NEVER86_API_URL: apiUrl, grok_bot_secrets: secrets }, null, 2));
