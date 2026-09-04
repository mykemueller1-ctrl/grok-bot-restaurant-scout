/**
 * Server-side exclusive data boundary.
 * A session for venue A can never read venue B files — even with a crafted URL.
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, normalize, resolve, sep } from "node:path";

const VENUE_IDS = new Set(["community-pizza", "taco-bamba", "grill"]);

export function assertVenueId(venueId) {
  if (!VENUE_IDS.has(venueId)) {
    const err = new Error("unknown venue");
    err.status = 404;
    throw err;
  }
  return venueId;
}

export function loadTenant(portalsRoot, venueId) {
  assertVenueId(venueId);
  const path = join(portalsRoot, venueId, "tenant.json");
  const tenant = JSON.parse(readFileSync(path, "utf8"));
  if (tenant.venue_id !== venueId) {
    const err = new Error("tenant venue mismatch");
    err.status = 500;
    throw err;
  }
  return tenant;
}

/**
 * Resolve a relative data path under a venue folder. Rejects traversal.
 * @returns {string} absolute path inside venue dir
 */
export function resolveVenuePath(portalsRoot, venueId, relPath) {
  assertVenueId(venueId);
  let clean = String(relPath || "");
  try {
    clean = decodeURIComponent(clean);
  } catch {
    const err = new Error("invalid path encoding");
    err.status = 400;
    throw err;
  }
  clean = clean.replace(/^\/+/, "").replace(/\\/g, "/");
  if (!clean || clean.includes("\0") || clean.split("/").some((p) => p === "..")) {
    const err = new Error("invalid path");
    err.status = 400;
    throw err;
  }
  const venueRoot = resolve(portalsRoot, venueId);
  const abs = resolve(venueRoot, normalize(clean));
  if (abs !== venueRoot && !abs.startsWith(venueRoot + sep)) {
    const err = new Error("path escapes venue boundary");
    err.status = 403;
    throw err;
  }
  return abs;
}

/**
 * Public assets (html/css/js) may be served without a session.
 * Tenant metadata is public minus secrets. Seats + data require auth.
 */
export function classifyAsset(relPath) {
  const p = String(relPath || "").replace(/^\/+/, "");
  if (!p || p === "login.html" || p.endsWith(".html")) return "public_html";
  if (p === "tenant.json") return "public_tenant";
  if (p.startsWith("data/") || p === "seats.json") return "protected";
  return "public_static";
}

export function publicTenantView(tenant) {
  const { access_gate, ...rest } = tenant;
  return {
    ...rest,
    access_gate: {
      kind: "server_verified",
      auth_path: "/api/auth/login",
      logout_path: "/api/auth/logout",
      note: "House codes are verified server-side. Hashes only — no plaintext in the portal pack.",
    },
  };
}

export function readVenueJson(portalsRoot, venueId, relPath) {
  const abs = resolveVenuePath(portalsRoot, venueId, relPath);
  if (!existsSync(abs) || !statSync(abs).isFile()) {
    const err = new Error("not found");
    err.status = 404;
    throw err;
  }
  const doc = JSON.parse(readFileSync(abs, "utf8"));
  if (doc.venue_id && doc.venue_id !== venueId) {
    const err = new Error("isolation breach: file venue_id mismatch");
    err.status = 500;
    throw err;
  }
  return doc;
}

export function assertSessionOwnsVenue(session, venueId) {
  if (!session || session.venue_id !== venueId) {
    const err = new Error("forbidden: session venue mismatch");
    err.status = 403;
    throw err;
  }
}

export { VENUE_IDS };
