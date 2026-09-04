#!/usr/bin/env python3
"""Validate secure venue portal isolation boundaries."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PORTALS = ROOT / "fixtures" / "portals"


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

    for t in tenants:
        slug = t["slug"]
        door = PORTALS / slug / "login.html"
        tenant_file = PORTALS / slug / "tenant.json"
        seats = PORTALS / slug / "seats.json"
        if not door.exists():
            fail(f"{slug}: login.html missing")
        if not tenant_file.exists():
            fail(f"{slug}: tenant.json missing")
        if not seats.exists():
            fail(f"{slug}: seats.json missing")

        tenant = json.loads(tenant_file.read_text())
        if tenant["venue_id"] != t["venue_id"]:
            fail(f"{slug}: tenant venue_id mismatch")
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

        # HTML must not hardcode sibling venue data paths
        html = door.read_text()
        for other in others:
            if f"/{other}/" in html or f"../{other}/" in html:
                fail(f"{slug}: login.html references sibling path {other}")

        # Allowed data files exist and declare the correct venue_id
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

    # Status expectations
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

    print("OK: secure venue portals isolation checks passed")


if __name__ == "__main__":
    main()
