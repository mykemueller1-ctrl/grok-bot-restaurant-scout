#!/usr/bin/env python3
"""Build Never86 report-ops swarm: parent + teacher + sub-agents per report type."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OWNER = "mykemueller1-ctrl"
FAMILY = "never86-report-ops"
VERSION = "1.0.0"

# Domains = parents. Each report = sub-agent. Teacher sits above all.
DOMAINS = [
    {
        "id": "labor",
        "label": "Labor",
        "color": "#F4A261",
        "job": "Schedule & Labor cards — who was actually scheduled/clocked",
        "reports": [
            {
                "id": "time-entries",
                "label": "Time Entries",
                "source": "Toast → Employee → Time Entries",
                "formats": ["csv", "xlsx"],
                "schema": "schemas/labor-time-entry.json",
                "signals": ["payable_hours", "job_title", "employee", "punches"],
                "file_globs": ["TimeEntries*.csv", "*time*entr*.xlsx"],
            },
            {
                "id": "labor-summary",
                "label": "Labor Summary / Cost",
                "source": "Toast → Labor → Labor Summary",
                "formats": ["csv", "xlsx", "pdf"],
                "signals": ["labor_percent", "hours_by_job", "overtime"],
                "file_globs": ["*Labor*Summary*", "*labor*cost*"],
            },
            {
                "id": "bar-kitchen-schedule",
                "label": "Bar / Kitchen / Driver Schedules",
                "source": "Ops sheets (Google Sheets / Excel)",
                "formats": ["xlsx", "gsheet"],
                "signals": ["shift_grid", "role_coverage"],
                "file_globs": ["*SCHEDULE*", "*schedule*"],
            },
        ],
    },
    {
        "id": "sales",
        "label": "Sales / Product Mix",
        "color": "#E63946",
        "job": "POS menu sales → product mix all the way down to SKUs",
        "reports": [
            {
                "id": "item-selection",
                "label": "Item Selection Details",
                "source": "Toast → Menus → Item Selection Details",
                "formats": ["csv", "xlsx"],
                "schema": "schemas/product-mix-sku.json",
                "signals": ["sku", "qty", "net_sales", "menu_group", "sales_category"],
                "hierarchy": ["sales_category", "menu", "menu_group", "menu_item"],
                "file_globs": ["ItemSelectionDetails*.csv", "*item*selection*", "*product*mix*"],
            },
            {
                "id": "menu-sales",
                "label": "Menu Sales Summary",
                "source": "Toast → Menus → Sales",
                "formats": ["csv", "xlsx", "pdf"],
                "signals": ["menu_totals", "category_mix"],
                "file_globs": ["*Menu*Sales*", "*menu*sales*"],
            },
            {
                "id": "sales-category",
                "label": "Sales Category Mix",
                "source": "Toast → Sales → Sales Category",
                "formats": ["csv", "xlsx"],
                "signals": ["food_vs_liquor", "category_net"],
                "file_globs": ["*Sales*Category*", "*category*mix*"],
            },
            {
                "id": "z-report",
                "label": "Z-Report / Day End",
                "source": "POS Historical Prev Day Z Report / ZReport Summary",
                "formats": ["pdf", "csv", "xlsx"],
                "signals": ["day_net", "tenders", "voids", "comps"],
                "file_globs": ["*Z_Report*", "*ZReport*", "*z-report*"],
            },
            {
                "id": "weekly-sales-pack",
                "label": "Weekly Sales Pack",
                "source": "Operator folder of daily Z + week rollup",
                "formats": ["folder", "pdf", "xlsx"],
                "signals": ["week_net", "day_parts", "comp_week"],
                "file_globs": ["*Weekly sales*", "*weekly*sales*"],
            },
        ],
    },
    {
        "id": "inventory",
        "label": "Inventory / Par / Ordering",
        "color": "#2A9D8F",
        "job": "SKU depletion from mix + par/ordering sheets → theoretical vs actual",
        "reports": [
            {
                "id": "sku-depletion",
                "label": "SKU Depletion from Product Mix",
                "source": "Derived from Item Selection qty",
                "formats": ["json", "csv"],
                "schema": "schemas/labor-sales-inventory.json",
                "signals": ["inventory_depletion_qty", "sku", "net_sales"],
                "file_globs": ["labor-sales-inventory.json", "*depletion*"],
            },
            {
                "id": "liquor-beer-par",
                "label": "Liquor / Beer Par & Ordering",
                "source": "Bar ordering Excel / Google Sheets",
                "formats": ["xlsx", "gsheet", "pdf"],
                "signals": ["par_amount", "qty_to_order", "cost", "over_under_budget"],
                "file_globs": ["*LIQUOR*", "*BEER*ORDER*", "*PAR*SHEET*", "*Optimization*"],
            },
            {
                "id": "vendor-intake",
                "label": "Vendor Intake",
                "source": "Hospitality vendor intake sheets",
                "formats": ["xlsx", "gsheet"],
                "signals": ["vendor", "sku", "cost", "unit"],
                "file_globs": ["*Vendor*Intake*", "*vendor*intake*"],
            },
        ],
    },
]

VENUES = [
    {
        "id": "grill",
        "label": "The Grill",
        "aliases": ["Grill", "the grill"],
        "holy_grail_source": "Mike Mueller Gmail — Kristen attachments",
        "status": "awaiting_gmail_auth",
    },
    {
        "id": "taco-bamba",
        "label": "Taco Bamba",
        "aliases": ["Taco Bomb", "Taco Bamba", "Bamba"],
        "holy_grail_source": "Mike Mueller Gmail — Kristen attachments",
        "status": "awaiting_gmail_auth",
    },
    {
        "id": "community-pizza",
        "label": "Community Pizza / CTAP",
        "aliases": ["CTAP", "Community Pizza", "Community Tap"],
        "holy_grail_source": "Google Drive communitypizza2026@gmail.com",
        "status": "drive_indexed",
    },
]


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")


def parent_agent(domain: dict) -> dict:
    report_ids = [r["id"] for r in domain["reports"]]
    return {
        "name": f"{domain['label']} Report Parent",
        "title": f"Never86 report parent — {domain['label']}",
        "role": "parent",
        "shape": "fox",
        "color": domain["color"],
        "family": FAMILY,
        "domain_id": domain["id"],
        "version": VERSION,
        "owner": OWNER,
        "description": (
            f"Parent agent for {domain['label']} reports. {domain['job']}. "
            f"Spawns/routes sub-agents: {', '.join(report_ids)}. "
            "Hands teach batches to the Report Teacher. Never posts or outreaches without approval."
        ),
        "job_to_be_done": domain["job"],
        "sub_agents": report_ids,
        "skills": [
            "report-ingest",
            "report-route",
            "teach-label",
            "recurse-learn",
        ],
        "venues": [v["id"] for v in VENUES],
        "swarm": True,
    }


def teacher_agent() -> dict:
    all_reports = [r["id"] for d in DOMAINS for r in d["reports"]]
    return {
        "name": "Report Teacher",
        "title": "Never86 report teacher — Myke labels holy-grail packs",
        "role": "teacher",
        "shape": "fox",
        "color": "#FF6B35",
        "family": FAMILY,
        "version": VERSION,
        "owner": OWNER,
        "description": (
            "Teacher for every sales/labor/inventory report agent. Packages Kristen / Grill / "
            "Taco Bamba / CTAP exports into teach batches. Myke labels keep/reject/wrong_report/"
            "wrong_venue/needs_research. Writes teach_memory so sub-agents learn what a good "
            "Time Entry, Item Selection, Z-Report, or Par sheet looks like."
        ),
        "job_to_be_done": "Turn operator report dumps into labeled ground truth for the swarm.",
        "teaches_reports": all_reports,
        "label_enum": [
            "keep",
            "reject",
            "wrong_report",
            "wrong_venue",
            "needs_research",
        ],
        "skills": ["teach-label", "report-teach-batch", "recurse-learn"],
        "holy_grail": {
            "inbox": "mykemueller1@gmail.com (Mike Mueller Gmail)",
            "from": "Kristen",
            "venues": ["grill", "taco-bamba"],
            "want": ["csv", "xlsx", "xls", "pdf", "google sheets links", "sales reportings"],
        },
        "swarm": True,
    }


def sub_agent(domain: dict, report: dict) -> dict:
    return {
        "name": f"{report['label']} Sub-Agent",
        "title": f"Never86 report sub — {domain['label']} / {report['label']}",
        "role": "sub",
        "shape": "fox",
        "color": domain["color"],
        "family": FAMILY,
        "domain_id": domain["id"],
        "report_id": report["id"],
        "parent": domain["id"],
        "version": VERSION,
        "owner": OWNER,
        "description": (
            f"Owns the {report['label']} report ({report['source']}). "
            f"Ingests {', '.join(report['formats'])}. "
            f"Signals: {', '.join(report['signals'])}. "
            "Routes findings up to the domain parent; teach labels via Report Teacher."
        ),
        "source_report": report["source"],
        "formats": report["formats"],
        "signals": report["signals"],
        "file_globs": report.get("file_globs", []),
        "schema": report.get("schema"),
        "hierarchy": report.get("hierarchy"),
        "skills": ["report-ingest", "report-normalize", "teach-label"],
        "venues": [v["id"] for v in VENUES],
        "swarm": True,
    }


def venue_scout(venue: dict) -> dict:
    return {
        "name": f"{venue['label']} Report Scout",
        "title": f"Never86 venue scout — {venue['label']} report packs",
        "role": "venue_scout",
        "shape": "fox",
        "color": "#457B9D",
        "family": FAMILY,
        "venue_id": venue["id"],
        "version": VERSION,
        "owner": OWNER,
        "description": (
            f"Hunts and indexes every CSV/Excel/PDF sales+labor+inventory report for "
            f"{venue['label']}. Source: {venue['holy_grail_source']}. Status: {venue['status']}."
        ),
        "aliases": venue["aliases"],
        "holy_grail_source": venue["holy_grail_source"],
        "status": venue["status"],
        "skills": ["report-ingest", "report-route", "teach-label"],
        "swarm": True,
    }


def main() -> None:
    parents_dir = ROOT / "parents"
    subs_dir = ROOT / "subs"
    venues_dir = ROOT / "venues"
    for d in (parents_dir, subs_dir, venues_dir):
        d.mkdir(parents=True, exist_ok=True)

    parent_index = []
    sub_index = []
    venue_index = []

    teacher = teacher_agent()
    write_json(ROOT / "teacher.json", teacher)

    for domain in DOMAINS:
        parent = parent_agent(domain)
        write_json(parents_dir / f"{domain['id']}.json", parent)
        parent_index.append(
            {
                "id": domain["id"],
                "file": f"parents/{domain['id']}.json",
                "label": domain["label"],
                "sub_count": len(domain["reports"]),
            }
        )
        for report in domain["reports"]:
            sub = sub_agent(domain, report)
            write_json(subs_dir / f"{report['id']}.json", sub)
            sub_index.append(
                {
                    "id": report["id"],
                    "file": f"subs/{report['id']}.json",
                    "parent": domain["id"],
                    "label": report["label"],
                    "formats": report["formats"],
                }
            )

    for venue in VENUES:
        scout = venue_scout(venue)
        write_json(venues_dir / f"{venue['id']}.json", scout)
        venue_index.append(
            {
                "id": venue["id"],
                "file": f"venues/{venue['id']}.json",
                "label": venue["label"],
                "status": venue["status"],
            }
        )

    catalog = {
        "family": FAMILY,
        "version": VERSION,
        "domains": DOMAINS,
        "venues": VENUES,
    }
    write_json(ROOT / "catalog.json", catalog)

    family = {
        "family": FAMILY,
        "platform": "Never86",
        "version": VERSION,
        "swarm_mode": True,
        "purpose": (
            "Parent / teacher / sub-agent swarm for restaurant sales, labor, and inventory "
            "reports (CSV, Excel, PDF). Holy grail: Kristen → Mike Mueller Gmail packs for "
            "The Grill + Taco Bamba; CTAP Drive indexed as live practice set."
        ),
        "owner": OWNER,
        "teacher": "teacher.json",
        "parent_count": len(parent_index),
        "sub_count": len(sub_index),
        "venue_scout_count": len(venue_index),
        "agent_count": 1 + len(parent_index) + len(sub_index) + len(venue_index),
        "shared_skills": [
            "report-ingest",
            "report-route",
            "report-normalize",
            "report-teach-batch",
            "teach-label",
            "recurse-learn",
        ],
        "parents": parent_index,
        "subs": sub_index,
        "venues": venue_index,
        "parser": "scripts/parse-toast-reports.mjs",
        "docs": "docs/TOAST-REPORTS.md",
    }
    write_json(ROOT / "family.json", family)
    print(
        json.dumps(
            {
                "family": FAMILY,
                "agents": family["agent_count"],
                "parents": family["parent_count"],
                "subs": family["sub_count"],
                "venues": family["venue_scout_count"],
                "teacher": True,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
