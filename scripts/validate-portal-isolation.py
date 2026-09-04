#!/usr/bin/env python3
"""Validate secure venue portal isolation + enterprise security invariants."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PORTALS = ROOT / "fixtures" / "portals"
HASHES = ROOT / "services" / "portal-gateway" / "hashes" / "house-codes.json"
DEMO_CODES = ("ctap-fort-dodge", "bamba-system", "grill-kristen-ready")


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)
    raise SystemExit(1)


def main() -> None:
    tenants_path = PORTALS / "tenants.json"
    if not tenants_path.exists():
        fail("fixtures/portals/tenants.json missing")
    registry = json.loads(tenants_path.read_text())
    tenants = registry["tenants"]
    if len(tenants) < 3:
        fail("expected community-pizza, taco-bamba, grill")

    ids = [t["venue_id"] for t in tenants]
    for required in ("community-pizza", "taco-bamba", "grill"):
        if required not in ids:
            fail(f"missing tenant {required}")

    if not HASHES.exists():
        fail("house-codes.json hashes missing")
    hashes = json.loads(HASHES.read_text())
    for vid in ids:
        entry = (hashes.get("codes") or {}).get(vid)
        if not entry or entry.get("algo") != "scrypt":
            fail(f"missing scrypt hash for {vid}")
        # hashes file must not contain plaintext demo codes
        blob = json.dumps(entry)
        for code in DEMO_CODES:
            if code in blob:
                fail(f"plaintext demo code leaked into hash entry for {vid}")

    for t in tenants:
        slug = t["slug"]
        door = PORTALS / slug / "login.html"
        app = PORTALS / slug / "app.js"
        tenant_file = PORTALS / slug / "tenant.json"
        seats = PORTALS / slug / "seats.json"
        if not door.exists():
            fail(f"{slug}: login.html missing")
        if not app.exists():
            fail(f"{slug}: app.js missing (CSP requires external scripts)")
        if not tenant_file.exists():
            fail(f"{slug}: tenant.json missing")
        if not seats.exists():
            fail(f"{slug}: seats.json missing")

        tenant = json.loads(tenant_file.read_text())
        if tenant["venue_id"] != t["venue_id"]:
            fail(f"{slug}: tenant venue_id mismatch")
        if tenant.get("access_gate", {}).get("kind") != "server_verified":
            fail(f"{slug}: access_gate.kind must be server_verified")
        if "code" in (tenant.get("access_gate") or {}):
            fail(f"{slug}: plaintext access_gate.code forbidden")
        tenant_blob = tenant_file.read_text()
        for code in DEMO_CODES:
            # Exact secret string must not appear; allow unrelated substrings only if not the full code token.
            if re.search(rf"(?<![A-Za-z0-9_-]){re.escape(code)}(?![A-Za-z0-9_-])", tenant_blob):
                fail(f"{slug}: plaintext demo house code in tenant.json")
            if '"code"' in tenant_blob and code in tenant_blob:
                fail(f"{slug}: house code field present in tenant.json")

        seats_doc = json.loads(seats.read_text())
        if seats_doc["venue_id"] != t["venue_id"]:
            fail(f"{slug}: seats venue_id mismatch")

        boundary = tenant.get("data_boundary") or {}
        if boundary.get("mode") != "exclusive":
            fail(f"{slug}: data_boundary.mode must be exclusive")
        forbidden = set(boundary.get("forbidden_venue_ids") or [])
        others = set(ids) - {t["venue_id"]}
        if not others.issubset(forbidden):
            fail(f"{slug}: forbidden_venue_ids must include all other tenants ({others})")

        html = door.read_text()
        if re.search(r"<script(?![^>]*\bsrc=)[^>]*>", html):
            fail(f"{slug}: inline <script> blocks forbidden (use app.js)")
        for other in others:
            if f"/{other}/" in html or f"../{other}/" in html:
                fail(f"{slug}: login.html references sibling path {other}")

        for rel in boundary.get("allowed_paths") or []:
            if rel.endswith("tenant.json") or rel.endswith("seats.json"):
                continue
            path = (PORTALS / slug / rel).resolve()
            if not str(path).startswith(str((PORTALS / slug).resolve())):
                fail(f"{slug}: allowed path escapes tenant dir: {rel}")
            if not path.exists():
                fail(f"{slug}: missing allowed data {rel}")
            doc = json.loads(path.read_text())
            if doc.get("venue_id") != t["venue_id"]:
                fail(f"{slug}: {rel} venue_id mismatch")

    by_id = {t["venue_id"]: t for t in tenants}
    if by_id["community-pizza"]["status"] != "live_demo":
        fail("community-pizza must be live_demo")
    if by_id["taco-bamba"]["status"] != "live_demo":
        fail("taco-bamba must be live_demo")
    if by_id["grill"]["status"] != "ready_after_community":
        fail("grill must be ready_after_community")

    grill_tenant = json.loads((PORTALS / "grill" / "tenant.json").read_text())
    if grill_tenant.get("handoff", {}).get("after") != "community-pizza":
        fail("grill handoff.after must be community-pizza")
    if "Kristen" not in (grill_tenant.get("handoff") or {}).get("from", ""):
        fail("grill handoff must credit Kristen")

    gateway = ROOT / "services" / "portal-gateway" / "src" / "server.mjs"
    if not gateway.exists():
        fail("portal-gateway server missing")
    if not (ROOT / "docs" / "PORTAL-SECURITY.md").exists():
        fail("docs/PORTAL-SECURITY.md missing")

    print("OK: secure venue portals isolation + enterprise invariants passed")


if __name__ == "__main__":
    main()
