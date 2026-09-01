#!/usr/bin/env python3
"""Generate per-vendor pain-shopper agent JSON files from vendors/catalog.json."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "vendors" / "catalog.json"
POS_DIR = ROOT / "pos"
SILO_DIR = ROOT / "silo"

COLORS_POS = [
    "#E63946",
    "#457B9D",
    "#1D3557",
    "#2A9D8F",
    "#E76F51",
    "#F4A261",
    "#9B2226",
    "#264653",
    "#6A4C93",
    "#118AB2",
]
COLORS_SILO = [
    "#D62828",
    "#F77F00",
    "#FCBF49",
    "#003049",
    "#669BBC",
    "#80B918",
    "#5C4D7D",
    "#BC4749",
    "#386641",
    "#A7C957",
    "#6D6875",
    "#B5838D",
    "#E5989B",
    "#FFB4A2",
    "#6C757D",
]


def agent_doc(vendor: dict, *, kind: str, color: str) -> dict:
    vendor_id = vendor["id"]
    name = vendor["name"]
    category = vendor["category"]
    aliases = vendor.get("aliases", [])
    seeds = vendor.get("seed_queries", [])
    domain = vendor.get("domain")
    legal = vendor.get("legal", name)

    if kind == "pos":
        title = f"Never86 lead shopper — {name} POS complaints"
        description = (
            f"Scans TikTok, Reddit, Facebook groups, and operator forums for restaurants, "
            f"GMs, owners, and managers complaining about {name} ({legal}). Learns complaint "
            f"language at scale (aliases, crash/fee/lock-in rants, switch-off talk). Shops each "
            f"lead (identity + full complaint context), teach/labels with Myke, recurse-learns "
            f"what real {name} hate looks like, then automates Never86 sales leads. "
            f"Never outreaches without approval."
        )
        icp = [
            "independent or small multi-unit restaurants",
            "GM / owner / ops manager voice",
            f"explicit {name} / alias mention",
            "active complaint in last 90 days",
            "US markets first",
        ]
    else:
        title = f"Never86 lead shopper — {name} silo complaints"
        description = (
            f"Scans for operators complaining about siloed vendor {name}"
            + (f" ({domain})" if domain else "")
            + f". Captures stack-pain where {name} doesn't talk to POS/ordering/accounting. "
            f"Learns complaint patterns at scale, shops identity + context, teach/labels with Myke, "
            f"recurse-learns, automates Never86 sales leads positioned against vendor sprawl. "
            f"Never outreaches without approval."
        )
        icp = [
            "ops / owner / back-office voice",
            f"named {name} in complaint",
            "multi-tool stack signals (doesn't sync / double entry)",
            "US markets first",
        ]

    return {
        "name": f"{name} Pain Shopper",
        "title": title,
        "shape": "fox",
        "color": color,
        "family": "never86-pain-shoppers",
        "vendor_id": vendor_id,
        "pain_id": f"{category}_{vendor_id}",
        "category": category,
        "domain": domain,
        "legal_name": legal,
        "aliases": aliases,
        "version": "1.1.0",
        "owner": "mykemueller1-ctrl",
        "description": description,
        "seed_queries": seeds,
        "icp_hints": icp,
        "learning": {
            "track_aliases": True,
            "track_complaint_phrases": True,
            "displace_narrative": f"Operator hate on {name} → Never86 wedge",
        },
    }


def main() -> None:
    catalog = json.loads(CATALOG.read_text())
    POS_DIR.mkdir(parents=True, exist_ok=True)
    SILO_DIR.mkdir(parents=True, exist_ok=True)

    pos_agents = []
    for i, vendor in enumerate(catalog["pos_top10"]):
        doc = agent_doc(vendor, kind="pos", color=COLORS_POS[i % len(COLORS_POS)])
        path = POS_DIR / f"{vendor['id']}.json"
        path.write_text(json.dumps(doc, indent=2) + "\n")
        pos_agents.append(
            {
                "id": vendor["id"],
                "file": f"pos/{vendor['id']}.json",
                "pain": f"pos_{vendor['id']}",
                "label": vendor["name"],
                "rank": vendor.get("rank"),
            }
        )
        print(f"wrote {path.relative_to(ROOT.parent.parent)}")

    silo_agents = []
    for i, vendor in enumerate(catalog["silo_vendors"]):
        doc = agent_doc(vendor, kind="silo", color=COLORS_SILO[i % len(COLORS_SILO)])
        path = SILO_DIR / f"{vendor['id']}.json"
        path.write_text(json.dumps(doc, indent=2) + "\n")
        silo_agents.append(
            {
                "id": vendor["id"],
                "file": f"silo/{vendor['id']}.json",
                "pain": f"silo_{vendor['id']}",
                "label": vendor["name"],
                "domain": vendor.get("domain"),
            }
        )
        print(f"wrote {path.relative_to(ROOT.parent.parent)}")

    family = {
        "family": "never86-pain-shoppers",
        "platform": "Never86",
        "version": "1.1.0",
        "purpose": (
            "Shop sales customers for Never86 by finding restaurants/managers publicly "
            "complaining about specific POS (top 10) and silo vendors — learn complaint "
            "language at scale per vendor, capture context, teach with owner, recurse, "
            "automate sales lead forms."
        ),
        "shop_means": (
            "Collect identity + complaint context window (vendor, quotes, venue, role, channels). "
            "Owner teaches what good looks like per vendor; agents recurse and auto-fill sales forms."
        ),
        "vendor_catalog": "vendors/catalog.json",
        "sources": [
            "tiktok",
            "instagram",
            "reddit",
            "facebook_groups",
            "x",
            "forums",
            "discord",
            "linkedin",
        ],
        "shared_skills": [
            "pain-complaint-scan",
            "lead-shop-enrich",
            "teach-label",
            "recurse-learn",
            "sales-lead-form",
            "vendor-complaint-learn",
        ],
        "pos_agents": pos_agents,
        "silo_agents": silo_agents,
        "thematic_agents": catalog["thematic"],
        "approval_required_for": [
            "outreach",
            "dm",
            "email",
            "comment",
            "spend",
            "publish",
        ],
    }
    (ROOT / "family.json").write_text(json.dumps(family, indent=2) + "\n")
    print("wrote family.json")


if __name__ == "__main__":
    main()
