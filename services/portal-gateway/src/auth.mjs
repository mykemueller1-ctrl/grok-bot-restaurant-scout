/**
 * Timing-safe house-code verification (scrypt) + HMAC session tokens.
 * Sessions are venue-scoped: a Community cookie cannot read Bamba data.
 */
import crypto from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HASH_PATH = join(__dirname, "../hashes/house-codes.json");

const SESSION_TTL_SEC = Number(process.env.PORTAL_SESSION_TTL_SEC || 60 * 60 * 8);
const COOKIE_NAME = "never86_portal_session";

/** Public-hosting bootstrap only — replace via PORTAL_SESSION_SECRET ASAP. */
const PUBLIC_DEMO_SECRET =
  "never86-ctap-phone-demo-session-hmac-rotate-via-portal-session-secret";

function requireSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  // Vercel / explicit public demo: allow boot so phone HTTPS works before secrets UI.
  if (process.env.VERCEL === "1" || process.env.PORTAL_DEMO_PUBLIC === "1") {
    return PUBLIC_DEMO_SECRET;
  }
  throw new Error(
    "PORTAL_SESSION_SECRET must be set (≥32 chars). Generate: openssl rand -base64 48"
  );
}

export function loadHouseCodeHashes() {
  return JSON.parse(readFileSync(HASH_PATH, "utf8"));
}

export function verifyHouseCode(venueId, code, store = loadHouseCodeHashes()) {
  const entry = store.codes?.[venueId];
  if (!entry || entry.algo !== "scrypt") return false;
  const salt = Buffer.from(entry.salt, "base64");
  const expected = Buffer.from(entry.hash, "base64");
  let actual;
  try {
    actual = crypto.scryptSync(String(code || ""), salt, entry.dkLen || 64, {
      N: entry.N || 16384,
      r: entry.r || 8,
      p: entry.p || 1,
    });
  } catch {
    return false;
  }
  if (actual.length !== expected.length) return false;
  return crypto.timingSafeEqual(actual, expected);
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromB64url(s) {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/") + pad, "base64");
}

export function mintSession({ venueId, loginId, seatId }, secret = requireSecret()) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    v: 1,
    venue_id: venueId,
    login_id: loginId,
    seat_id: seatId || null,
    iat: now,
    exp: now + SESSION_TTL_SEC,
    jti: crypto.randomBytes(16).toString("hex"),
  };
  const body = b64url(JSON.stringify(payload));
  const sig = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifySession(token, secret = requireSecret()) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = b64url(crypto.createHmac("sha256", secret).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  let payload;
  try {
    payload = JSON.parse(fromB64url(body).toString("utf8"));
  } catch {
    return null;
  }
  if (payload.v !== 1 || !payload.venue_id || !payload.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

export function sessionCookie(token, { secure = false } = {}) {
  const parts = [
    `${COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    `Max-Age=${SESSION_TTL_SEC}`,
  ];
  if (secure || process.env.PORTAL_COOKIE_SECURE === "1") parts.push("Secure");
  return parts.join("; ");
}

export function clearSessionCookie({ secure = false } = {}) {
  const parts = [
    `${COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Strict",
    "Max-Age=0",
  ];
  if (secure || process.env.PORTAL_COOKIE_SECURE === "1") parts.push("Secure");
  return parts.join("; ");
}

export function parseCookies(header = "") {
  const out = {};
  for (const part of String(header).split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  }
  return out;
}

export function readSessionFromRequest(req, secret = requireSecret()) {
  const cookies = parseCookies(req.headers.cookie || "");
  return verifySession(cookies[COOKIE_NAME], secret);
}

export { COOKIE_NAME, SESSION_TTL_SEC, requireSecret };
