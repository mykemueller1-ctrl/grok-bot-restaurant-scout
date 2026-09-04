#!/usr/bin/env node
/**
 * Hash a house code into services/portal-gateway/hashes/house-codes.json
 * Usage:
 *   node scripts/hash-house-code.mjs --venue community-pizza --code 'ctap-fort-dodge'
 * Never commit plaintext codes into tenant.json.
 */
import crypto from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HASH_PATH = join(__dirname, "../services/portal-gateway/hashes/house-codes.json");

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--venue") out.venue = argv[++i];
    else if (a === "--code") out.code = argv[++i];
    else if (a === "--print-only") out.printOnly = true;
  }
  return out;
}

function hashCode(code) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(code, salt, 64, { N: 16384, r: 8, p: 1 });
  return {
    algo: "scrypt",
    N: 16384,
    r: 8,
    p: 1,
    dkLen: 64,
    salt: salt.toString("base64"),
    hash: hash.toString("base64"),
    rotated_at: new Date().toISOString(),
  };
}

const args = parseArgs(process.argv);
if (!args.venue || !args.code) {
  console.error("Usage: node scripts/hash-house-code.mjs --venue <id> --code <secret>");
  process.exit(1);
}

const entry = hashCode(args.code);
if (args.printOnly) {
  console.log(JSON.stringify(entry, null, 2));
  process.exit(0);
}

const store = existsSync(HASH_PATH)
  ? JSON.parse(readFileSync(HASH_PATH, "utf8"))
  : { version: 1, note: "Demo house-code hashes only.", codes: {} };
store.codes = store.codes || {};
store.codes[args.venue] = entry;
writeFileSync(HASH_PATH, JSON.stringify(store, null, 2) + "\n");
console.log(`Updated hash for ${args.venue} in ${HASH_PATH}`);
console.log("Plaintext code was NOT written to disk beyond this process argv — rotate shells if needed.");
