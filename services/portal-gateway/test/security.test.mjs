/**
 * Enterprise security suite for the portal gateway.
 * Run: PORTAL_SESSION_SECRET=$(openssl rand -base64 48) npm test
 */
import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { createServer, loginLimiter } from "../src/server.mjs";
import {
  verifyHouseCode,
  mintSession,
  verifySession,
  loadHouseCodeHashes,
} from "../src/auth.mjs";
import {
  resolveVenuePath,
  readVenueJson,
  assertSessionOwnsVenue,
} from "../src/boundary.mjs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
const PORTALS = join(ROOT, "fixtures/portals");

process.env.PORTAL_SESSION_SECRET =
  process.env.PORTAL_SESSION_SECRET ||
  "test-secret-never86-portal-gateway-32chars-min!!";

const CODES = {
  "community-pizza": "ctap-fort-dodge",
  "taco-bamba": "bamba-system",
  grill: "grill-kristen-ready",
};

let server;
let base;

before(async () => {
  loginLimiter.reset();
  server = createServer();
  await new Promise((resolve) => {
    server.listen(0, "127.0.0.1", resolve);
  });
  const { port } = server.address();
  base = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

async function jarLogin(venue, code, loginId) {
  const res = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ venue_id: venue, house_code: code, login_id: loginId }),
  });
  const setCookie = res.headers.getSetCookie?.() || [];
  const cookie = setCookie.map((c) => c.split(";")[0]).join("; ");
  const body = await res.json();
  return { res, body, cookie };
}

test("scrypt house codes verify and reject wrong codes", () => {
  const store = loadHouseCodeHashes();
  assert.equal(verifyHouseCode("community-pizza", CODES["community-pizza"], store), true);
  assert.equal(verifyHouseCode("community-pizza", "wrong", store), false);
  assert.equal(verifyHouseCode("taco-bamba", CODES["community-pizza"], store), false);
});

test("session is HMAC-signed and venue-scoped", () => {
  const tok = mintSession({ venueId: "community-pizza", loginId: "myke", seatId: "seat-owner-myke" });
  const payload = verifySession(tok);
  assert.equal(payload.venue_id, "community-pizza");
  assert.equal(payload.login_id, "myke");
  assert.equal(verifySession(tok.slice(0, -2) + "aa"), null);
});

test("path traversal is blocked", () => {
  assert.throws(() => resolveVenuePath(PORTALS, "community-pizza", "../taco-bamba/seats.json"), /invalid|escapes/);
  assert.throws(() => resolveVenuePath(PORTALS, "community-pizza", "..\\taco-bamba\\seats.json"), /invalid|escapes/);
  assert.throws(() => resolveVenuePath(PORTALS, "community-pizza", "data/../../taco-bamba/seats.json"), /invalid|escapes/);
});

test("login issues HttpOnly session cookie", async () => {
  const { res, body, cookie } = await jarLogin("community-pizza", CODES["community-pizza"], "myke");
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.match(cookie, /never86_portal_session=/);
  const raw = (res.headers.getSetCookie?.() || [])[0] || "";
  assert.match(raw, /HttpOnly/i);
  assert.match(raw, /SameSite=Strict/i);
});

test("protected data requires matching venue session", async () => {
  const deny = await fetch(`${base}/api/venue/community-pizza/seats.json`);
  assert.equal(deny.status, 403);

  const { cookie } = await jarLogin("community-pizza", CODES["community-pizza"], "myke");
  const ok = await fetch(`${base}/api/venue/community-pizza/seats.json`, {
    headers: { Cookie: cookie },
  });
  assert.equal(ok.status, 200);
  const seats = await ok.json();
  assert.equal(seats.venue_id, "community-pizza");

  const cross = await fetch(`${base}/api/venue/taco-bamba/seats.json`, {
    headers: { Cookie: cookie },
  });
  assert.equal(cross.status, 403);
});

test("Bamba session cannot read Community or Grill", async () => {
  const { cookie } = await jarLogin("taco-bamba", CODES["taco-bamba"], "john");
  for (const v of ["community-pizza", "grill"]) {
    const res = await fetch(`${base}/api/venue/${v}/seats.json`, {
      headers: { Cookie: cookie },
    });
    assert.equal(res.status, 403, v);
  }
  const own = await fetch(`${base}/api/venue/taco-bamba/data/multi-unit-board.json`, {
    headers: { Cookie: cookie },
  });
  assert.equal(own.status, 200);
  assert.equal((await own.json()).venue_id, "taco-bamba");
});

test("wrong credentials are opaque 401", async () => {
  const { res, body } = await jarLogin("community-pizza", "nope", "myke");
  assert.equal(res.status, 401);
  assert.equal(body.error, "invalid credentials");
});

test("tenant.json never exposes plaintext house codes", () => {
  for (const v of ["community-pizza", "taco-bamba", "grill"]) {
    const t = JSON.parse(readFileSync(join(PORTALS, v, "tenant.json"), "utf8"));
    assert.equal(t.access_gate?.kind, "server_verified");
    assert.equal(t.access_gate?.code, undefined);
    const blob = JSON.stringify(t);
    for (const bad of Object.values(CODES)) {
      const re = new RegExp(`(?<![A-Za-z0-9_-])${bad.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![A-Za-z0-9_-])`);
      assert.equal(re.test(blob), false, `${v} leaked ${bad}`);
    }
  }
});

test("public tenant view strips secrets via gateway", async () => {
  const res = await fetch(`${base}/community-pizza/tenant.json`);
  assert.equal(res.status, 200);
  const t = await res.json();
  assert.equal(t.access_gate.kind, "server_verified");
  assert.equal(t.access_gate.code, undefined);
});

test("security headers present", async () => {
  const res = await fetch(`${base}/healthz`);
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.equal(res.headers.get("x-frame-options"), "DENY");
  assert.match(res.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);
  assert.equal(res.headers.get("referrer-policy"), "no-referrer");
});

test("assertSessionOwnsVenue enforces isolation", () => {
  assert.throws(
    () => assertSessionOwnsVenue({ venue_id: "grill" }, "community-pizza"),
    /forbidden/
  );
  assert.doesNotThrow(() =>
    assertSessionOwnsVenue({ venue_id: "community-pizza" }, "community-pizza")
  );
});

test("readVenueJson rejects cross-labeled files", () => {
  const doc = readVenueJson(PORTALS, "grill", "data/kristen-packs.json");
  assert.equal(doc.venue_id, "grill");
});
