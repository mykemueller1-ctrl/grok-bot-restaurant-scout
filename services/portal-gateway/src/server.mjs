/**
 * Never86 secure venue portal gateway.
 *
 * - Hashed house codes (scrypt) — no plaintext in portal packs
 * - HMAC-signed HttpOnly sessions scoped to venue_id
 * - Server-side exclusive data boundary
 * - Rate-limited login, enterprise security headers
 */
import http from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname, dirname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  verifyHouseCode,
  mintSession,
  sessionCookie,
  clearSessionCookie,
  readSessionFromRequest,
  requireSecret,
} from "./auth.mjs";
import {
  assertVenueId,
  loadTenant,
  resolveVenuePath,
  classifyAsset,
  publicTenantView,
  readVenueJson,
  assertSessionOwnsVenue,
  VENUE_IDS,
} from "./boundary.mjs";
import { securityHeaders } from "./security-headers.mjs";
import { createRateLimiter } from "./rate-limit.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
/** Prefer packaged portals (Vercel/Render); fall back to repo fixtures for local monorepo. */
function resolvePortalsRoot() {
  const bundled = join(__dirname, "../portals");
  if (existsSync(join(bundled, "tenants.json"))) return bundled;
  return join(ROOT, "fixtures/portals");
}
const PORTALS_ROOT = resolvePortalsRoot();
const SHARED_ROOT = join(PORTALS_ROOT, "shared");
const PORT = Number(process.env.PORT || process.env.PORTAL_PORT || 5174);
const HOST = process.env.HOST || "0.0.0.0";
const ON_HTTPS =
  process.env.VERCEL === "1" || process.env.PORTAL_COOKIE_SECURE === "1";

const loginLimiter = createRateLimiter({ windowMs: 60_000, max: 8 });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function send(res, status, body, extra = {}) {
  const headers = {
    ...securityHeaders(),
    ...extra.headers,
  };
  if (typeof body === "string" || Buffer.isBuffer(body)) {
    headers["Content-Type"] = extra.contentType || "text/plain; charset=utf-8";
    headers["Content-Length"] = Buffer.byteLength(body);
    res.writeHead(status, headers);
    res.end(body);
    return;
  }
  const json = JSON.stringify(body);
  headers["Content-Type"] = "application/json; charset=utf-8";
  headers["Content-Length"] = Buffer.byteLength(json);
  res.writeHead(status, headers);
  res.end(json);
}

function clientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (typeof xf === "string" && xf.length) return xf.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > 16_384) {
        reject(Object.assign(new Error("payload too large"), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8") || "{}";
        resolve(JSON.parse(raw));
      } catch {
        reject(Object.assign(new Error("invalid json"), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function audit(event, fields = {}) {
  // Never log house codes or session tokens.
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    event,
    ...fields,
  });
  console.log(line);
}

function serveFile(res, abs, contentType) {
  const data = readFileSync(abs);
  send(res, 200, data, { contentType, headers: { "Cache-Control": contentType.includes("html") ? "no-store" : "private, max-age=60" } });
}

async function handleAuthLogin(req, res) {
  const ip = clientIp(req);
  let body;
  try {
    body = await readJson(req);
  } catch (e) {
    return send(res, e.status || 400, { error: e.message });
  }
  const venueId = String(body.venue_id || "");
  const houseCode = String(body.house_code || "");
  const loginId = String(body.login_id || "");
  const rl = loginLimiter.check(`${ip}:${venueId || "na"}`);
  if (!rl.ok) {
    audit("auth.rate_limited", { ip, venue_id: venueId });
    res.setHeader("Retry-After", String(rl.retryAfterSec));
    return send(res, 429, { error: "too many attempts — try again shortly" });
  }
  try {
    assertVenueId(venueId);
  } catch {
    audit("auth.fail", { ip, venue_id: venueId, reason: "unknown_venue" });
    return send(res, 401, { error: "invalid credentials" });
  }
  if (!verifyHouseCode(venueId, houseCode)) {
    audit("auth.fail", { ip, venue_id: venueId, reason: "bad_code" });
    // Constant-ish response shape; no hint which field failed.
    return send(res, 401, { error: "invalid credentials" });
  }
  let seats;
  try {
    seats = readVenueJson(PORTALS_ROOT, venueId, "seats.json");
  } catch {
    return send(res, 500, { error: "seat ledger unavailable" });
  }
  const seat = (seats.seats || []).find((s) => s.login_id === loginId);
  if (!seat || (seat.status !== "sold" && seat.status !== "available")) {
    audit("auth.fail", { ip, venue_id: venueId, reason: "bad_seat" });
    return send(res, 401, { error: "invalid credentials" });
  }
  const token = mintSession({
    venueId,
    loginId,
    seatId: seat.seat_id,
  });
  audit("auth.ok", { ip, venue_id: venueId, login_id: loginId, seat_id: seat.seat_id });
  send(
    res,
    200,
    {
      ok: true,
      venue_id: venueId,
      login_id: loginId,
      seat_id: seat.seat_id,
      assignee: seat.assignee?.name || null,
    },
    {
      headers: {
        "Set-Cookie": sessionCookie(token, {
          secure: ON_HTTPS,
        }),
      },
    }
  );
}

function handleAuthLogout(req, res) {
  const session = (() => {
    try {
      return readSessionFromRequest(req);
    } catch {
      return null;
    }
  })();
  audit("auth.logout", { venue_id: session?.venue_id || null, login_id: session?.login_id || null });
  send(
    res,
    200,
    { ok: true },
    {
      headers: {
        "Set-Cookie": clearSessionCookie({
          secure: ON_HTTPS,
        }),
      },
    }
  );
}

function handleAuthMe(req, res) {
  let session;
  try {
    session = readSessionFromRequest(req);
  } catch {
    return send(res, 500, { error: "session secret misconfigured" });
  }
  if (!session) return send(res, 401, { error: "unauthorized" });
  return send(res, 200, {
    venue_id: session.venue_id,
    login_id: session.login_id,
    seat_id: session.seat_id,
    exp: session.exp,
  });
}

function handleDoorPublic(req, res, venueId) {
  try {
    assertVenueId(venueId);
    const tenant = publicTenantView(loadTenant(PORTALS_ROOT, venueId));
    const seats = readVenueJson(PORTALS_ROOT, venueId, "seats.json");
    const picker = (seats.seats || []).map((s) => ({
      login_id: s.login_id,
      label: s.label,
      assignee_name: s.assignee?.name || null,
      price: s.price,
      status: s.status,
    }));
    return send(res, 200, {
      venue_id: venueId,
      venue_name: seats.venue_name || tenant.venue_name,
      status: tenant.status,
      access_gate: tenant.access_gate,
      seats: picker,
    });
  } catch (e) {
    return send(res, e.status || 500, { error: e.message || "error" });
  }
}

function handleVenueData(req, res, venueId, relPath) {
  let session;
  try {
    session = readSessionFromRequest(req);
  } catch {
    return send(res, 500, { error: "session secret misconfigured" });
  }
  try {
    assertSessionOwnsVenue(session, venueId);
    const doc = readVenueJson(PORTALS_ROOT, venueId, relPath);
    return send(res, 200, doc);
  } catch (e) {
    audit("data.deny", {
      venue_id: venueId,
      path: relPath,
      status: e.status || 500,
      session_venue: session?.venue_id || null,
    });
    return send(res, e.status || 500, { error: e.message || "error" });
  }
}

function safeUnder(root, relPath) {
  const clean = String(relPath || "")
    .replace(/^\/+/, "")
    .replace(/\\/g, "/");
  if (!clean || clean.includes("\0") || clean.split("/").some((p) => p === "..")) {
    const err = new Error("invalid path");
    err.status = 400;
    throw err;
  }
  const rootAbs = resolve(root);
  const abs = resolve(rootAbs, clean);
  if (abs !== rootAbs && !abs.startsWith(rootAbs + sep)) {
    const err = new Error("path escapes boundary");
    err.status = 403;
    throw err;
  }
  return abs;
}

function handleStatic(req, res, urlPath) {
  // /shared/*
  if (urlPath.startsWith("/shared/")) {
    const rel = urlPath.slice("/shared/".length);
    let abs;
    try {
      abs = safeUnder(SHARED_ROOT, rel);
    } catch (e) {
      return send(res, e.status || 400, { error: e.message });
    }
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      return send(res, 404, { error: "not found" });
    }
    return serveFile(res, abs, MIME[extname(abs)] || "application/octet-stream");
  }

  if (urlPath === "/" || urlPath === "/index.html") {
    return serveFile(res, join(PORTALS_ROOT, "index.html"), MIME[".html"]);
  }
  if (urlPath === "/tenants.json") {
    return serveFile(res, join(PORTALS_ROOT, "tenants.json"), MIME[".json"]);
  }

  // /:venue/...
  const parts = urlPath.replace(/^\/+/, "").split("/");
  const venueId = parts[0];
  if (!VENUE_IDS.has(venueId)) return send(res, 404, { error: "not found" });
  const rel = parts.slice(1).join("/") || "login.html";
  const kind = classifyAsset(rel);

  if (kind === "public_tenant") {
    try {
      const tenant = loadTenant(PORTALS_ROOT, venueId);
      return send(res, 200, publicTenantView(tenant));
    } catch (e) {
      return send(res, e.status || 500, { error: e.message });
    }
  }

  if (kind === "protected") {
    return handleVenueData(req, res, venueId, rel);
  }

  try {
    const abs = resolveVenuePath(PORTALS_ROOT, venueId, rel);
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      return send(res, 404, { error: "not found" });
    }
    return serveFile(res, abs, MIME[extname(abs)] || "application/octet-stream");
  } catch (e) {
    return send(res, e.status || 400, { error: e.message });
  }
}

function createServer() {
  // Fail fast if secret missing when not in test-defer mode
  if (process.env.PORTAL_DEFER_SECRET !== "1") {
    requireSecret();
  }

  return http.createServer(async (req, res) => {
    try {
      const host = req.headers.host || `127.0.0.1:${PORT}`;
      const url = new URL(req.url || "/", `http://${host}`);
      const path = decodeURIComponent(url.pathname);

      if (req.method === "GET" && path === "/healthz") {
        return send(res, 200, { ok: true, service: "portal-gateway" });
      }
      if (req.method === "POST" && path === "/api/auth/login") {
        return await handleAuthLogin(req, res);
      }
      if (req.method === "POST" && path === "/api/auth/logout") {
        return handleAuthLogout(req, res);
      }
      if (req.method === "GET" && path === "/api/auth/me") {
        return handleAuthMe(req, res);
      }
      if (req.method === "GET" && /^\/api\/venue\/[^/]+\/door$/.test(path)) {
        const venueId = path.split("/")[3];
        return handleDoorPublic(req, res, venueId);
      }
      if (req.method === "GET" && path.startsWith("/api/venue/")) {
        const segs = path.slice("/api/venue/".length).split("/");
        const venueId = segs[0];
        const rel = segs.slice(1).join("/");
        return handleVenueData(req, res, venueId, rel);
      }
      if (req.method === "GET") {
        return handleStatic(req, res, path);
      }
      return send(res, 405, { error: "method not allowed" });
    } catch (e) {
      audit("server.error", { message: e.message || String(e) });
      return send(res, 500, { error: "internal error" });
    }
  });
}

export { createServer, PORTALS_ROOT, loginLimiter, safeUnder };

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const server = createServer();
  server.listen(PORT, HOST, () => {
    audit("server.listen", { host: HOST, port: PORT });
    console.error(`portal-gateway listening on http://${HOST}:${PORT}`);
  });
}
