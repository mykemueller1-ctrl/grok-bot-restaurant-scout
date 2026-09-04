#!/usr/bin/env python3
"""Build Never86 report-ops swarm: parent + teacher + sub-agents per report type."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OWNER = "mykemueller1-ctrl"
FAMILY = "never86-report-ops"
VERSION = "1.1.0"

# ICP scale tiers — parent + subs (who holds the clipboard)
ICP_TIERS = [
    {
        "id": "owner-1-5",
        "label": "Owner-Operator 1–5",
        "color": "#2A9D8F",
        "units": "1–5",
        "buyer": "Owner / GM (still in the building)",
        "job": "Single-owner ops: paper labor cards, weekly schedules, Toast day exports, and a firehose of phone invoice photos",
        "pains": [
            "owner burnout and cash-flow gut feel",
            "labor % without group targets",
            "second unit ~130% ops surface for ~60% revenue capacity",
            "millions of invoice photos — rotated, stapled, blurry — instead of clean AP",
            "inventory = invoice photos + Hy-Vee runs",
            "human staple/photograph loop — not a repeatable system yet",
        ],
        "report_ids": [
            "kitchen-labor-card",
            "paper-weekly-schedule",
            "time-entries",
            "labor-summary",
            "sales-summary",
            "item-selection",
            "liquor-beer-par",
            "vendor-invoice",
            "daily-pnl",
            "prime-cost",
            "recipe-cost",
            "beer-cost",
            "vendor-spend",
        ],
        "example_packs": ["ctap-physical", "courser/grill"],
        "never86_wedge": "Photo OCR + SKU unit costs → recipe/beer cost + forensic P&L — daily leak dollars not enterprise BI",
    },
    {
        "id": "area-leader",
        "label": "Area / District Leader Scale",
        "color": "#E76F51",
        "units": "5–15+ under an area leader; brand may be 15–50+",
        "buyer": "Area Leader / District Manager / Dir of Ops",
        "job": "Coach GMs across stores; Daily/WTD CY vs PY boards; region then System rollups",
        "pains": [
            "margin lost between locations",
            "labor swings 8pts across GMs on same brand",
            "inconsistent coding / wrong labor grain",
            "must coach not run shifts",
        ],
        "report_ids": [
            "multi-unit-sales-labor",
            "weekly-sales-pack",
            "labor-summary",
            "sales-summary",
            "z-report",
        ],
        "example_packs": ["courser/taco-bamba-sales-labor-mp-v5"],
        "never86_wedge": "Store/region exceptions for area leaders — not 30 unread tabs",
    },
    {
        "id": "cfo-ceo",
        "label": "CFO / CEO Portfolio",
        "color": "#1D3557",
        "units": "10–50+ (or PE-backed)",
        "buyer": "CFO / Controller / CEO / COO",
        "job": "Location P&Ls weekly, prime cost, SSS, institutional consolidations across POS+labor+ERP",
        "pains": [
            "stale Excel consolidations",
            "days to assemble portfolio view",
            "no real-time variance alerts",
            "four-wall EBITDA vs corporate overhead",
        ],
        "report_ids": [
            "multi-unit-sales-labor",
            "labor-summary",
            "sales-summary",
            "sku-depletion",
            "vendor-intake",
        ],
        "example_packs": ["courser/taco-bamba System rollup"],
        "never86_wedge": "Faster time-to-leak-dollar across portfolio + action layer",
    },
]

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
            {
                "id": "kitchen-labor-card",
                "label": "Kitchen Labor Card (paper)",
                "source": "Printed AM/PM station card filled by hand",
                "formats": ["photo", "pdf", "scan"],
                "signals": ["day", "shift", "station", "employee"],
                "file_globs": ["*Labor*Card*", "*kitchen*labor*"],
                "icp_tiers": ["owner-1-5"],
            },
            {
                "id": "paper-weekly-schedule",
                "label": "Paper Weekly Schedule",
                "source": "Calendarpedia / handwritten week grid",
                "formats": ["photo", "pdf", "xlsx"],
                "signals": ["employee", "day", "shift_window", "station_code", "events"],
                "file_globs": ["*Weekly schedule*", "*Work Schedule*"],
                "icp_tiers": ["owner-1-5"],
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
            {
                "id": "sales-summary",
                "label": "Sales Summary (Toast)",
                "source": "Toast → Sales → Sales Summary export",
                "formats": ["xlsx", "csv"],
                "signals": [
                    "net_sales",
                    "gross_sales",
                    "tips",
                    "sales_categories",
                    "revenue_centers",
                    "dayparts",
                    "voids",
                ],
                "file_globs": ["SalesSummary*", "*Sales*Summary*"],
            },
            {
                "id": "multi-unit-sales-labor",
                "label": "Multi-Unit Sales Labor Report (MP)",
                "source": "Sales Labor Report (MP) v5 — Daily / WTD / daypart boards",
                "formats": ["xlsx"],
                "signals": [
                    "location",
                    "cy_sales",
                    "py_sales",
                    "cy_checks",
                    "yoy",
                    "region_rollups",
                ],
                "file_globs": ["*Sales Labor Report*", "*Sales_Labor_Report*", "*MP*v5*"],
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
            {
                "id": "vendor-invoice",
                "label": "Distributor / Store Invoice",
                "source": "Primary: phone photos of distributor invoices, grocery receipts, Register#2 payout slips (OCR). Bonus: emailed PDF/CSV when they forward.",
                "formats": ["photo", "email", "pdf", "csv"],
                "signals": [
                    "vendor",
                    "vendor_type",
                    "cogs_category",
                    "sku",
                    "qty",
                    "amount",
                    "account",
                    "payout_pair",
                    "handwritten_credit",
                    "email_forward",
                    "source_channel",
                    "ocr_confidence",
                    "rotation_deg",
                ],
                "file_globs": [
                    "*invoice*",
                    "*Hopkins*",
                    "*Distributing*",
                    "*Hy-Vee*",
                    "*Hyvee*",
                    "*Fareway*",
                    "*Walmart*",
                    "*Menards*",
                    "*Sawyer*",
                    "*Sysco*",
                    "*Performance*Food*",
                    "*Northern*Lights*",
                    "*Confluence*",
                    "*Humes*",
                    "*Pay Out*",
                    "*payout*",
                    "*.jpg",
                    "*.jpeg",
                    "*.png",
                    "*.heic",
                    "*.webp",
                ],
                "schema": "schemas/vendor-invoice.json",
                "icp_tiers": ["owner-1-5", "area-leader", "cfo-ceo"],
                "example_packs": [
                    "ctap-physical/weekly-invoice-photo-pack-2026-08",
                    "ctap-physical/ocr-batch-2026-08",
                ],
                "skills_extra": ["invoice-photo-ocr"],
                "teach_memory": [
                    {
                        "label": "keep",
                        "icp_tier": "owner_1_5",
                        "venue_id": "community-pizza",
                        "as_is": "Small ICPs dump phone photos of every invoice — food, beer, liquor, pop, meat, grocery, payout slips — rotated/stapled/blurry.",
                        "truth": "Leaders (MarginEdge, Ottimate, R365, xtraCHEF) win by photo/email intake + coding to restaurant COA (food/beer/wine/liquor/NA) + daily P&L. Pure OCR alone is not enough — teach on exceptions.",
                        "coach_to": "RapidOCR+Tesseract intake → vendor_type + cogs_category → finance advisor swarm (prime cost / daily P&L / vendor spend). Email forward is bonus.",
                        "good_looks_like": "Each photo → vendor + amount + cogs_category (food|beer|wine|liquor|na_beverage|…). Category rollups feed P&L advisor. Low-confidence teach-batched.",
                        "pack": "fixtures/toast/ctap-physical/normalized/ocr-batch-2026-08.json",
                        "research": "docs/RESTAURANT-AP-OCR.md",
                        "taxonomy": "agent/report-ops/taxonomy/cogs-categories.json",
                    }
                ],
            },
        ],
    },
    {
        "id": "finance",
        "label": "Finance / P&L / Prime Cost",
        "color": "#1D3557",
        "job": "Forensic P&L advisor — coded invoices + sales + labor → leak dollars by category",
        "reports": [
            {
                "id": "daily-pnl",
                "label": "Daily P&L Flash",
                "source": "Invoice category rollups + Toast sales summary + labor %",
                "formats": ["json", "csv"],
                "signals": ["net_sales", "cogs_by_category", "labor_percent", "prime_cost_pct", "leak_dollars"],
                "file_globs": ["*daily*pnl*", "*flash*pnl*", "ocr-batch*.json"],
                "icp_tiers": ["owner-1-5", "area-leader", "cfo-ceo"],
            },
            {
                "id": "prime-cost",
                "label": "Prime Cost Advisor",
                "source": "Food/beer/wine/liquor/NA COGS + labor vs targets (55–65% prime)",
                "formats": ["json", "csv"],
                "signals": [
                    "food_cost_pct",
                    "beer_cost_pct",
                    "wine_cost_pct",
                    "liquor_cost_pct",
                    "na_bev_cost_pct",
                    "labor_percent",
                    "prime_cost_pct",
                ],
                "file_globs": ["*prime*cost*", "*food*cost*"],
                "icp_tiers": ["owner-1-5", "area-leader", "cfo-ceo"],
                "skills_extra": ["invoice-photo-ocr"],
            },
            {
                "id": "recipe-cost",
                "label": "Food Recipe Cost from Vendor SKUs",
                "source": "Invoice SKU unit costs × recipe BOM → plate food cost %",
                "formats": ["json", "csv", "xlsx"],
                "signals": [
                    "vendor_sku",
                    "unit_cost",
                    "recipe_id",
                    "portion_cost",
                    "food_cost_pct",
                    "menu_item",
                ],
                "file_globs": ["*recipe*cost*", "*sku*invoice*", "sku-directory*", "*BOM*"],
                "schema": "schemas/vendor-sku-line.json",
                "icp_tiers": ["owner-1-5", "area-leader", "cfo-ceo"],
                "example_packs": [
                    "ctap-physical/sku-invoice-pack-2026-08",
                    "ctap-physical/sku-ocr-batch-2026-08",
                ],
                "skills_extra": ["invoice-photo-ocr", "sku-recipe-cost"],
            },
            {
                "id": "beer-cost",
                "label": "Beer / Pour Cost from Distributor SKUs",
                "source": "Beer distributor invoice SKUs (keg/case) + pour size → beer cost %",
                "formats": ["json", "csv", "xlsx"],
                "signals": [
                    "vendor_sku",
                    "upc",
                    "keg_size",
                    "case_cost",
                    "pour_oz",
                    "beer_cost_pct",
                    "deposit",
                ],
                "file_globs": ["*beer*cost*", "*Humes*", "*FT*Dodge*Dist*", "*Confluence*", "*pour*"],
                "schema": "schemas/vendor-sku-line.json",
                "icp_tiers": ["owner-1-5", "area-leader", "cfo-ceo"],
                "example_packs": ["ctap-physical/sku-invoice-pack-2026-08"],
                "skills_extra": ["invoice-photo-ocr", "sku-recipe-cost"],
            },
            {
                "id": "vendor-spend",
                "label": "Vendor Spend Forensic",
                "source": "Per-vendor invoice totals + price creep vs prior week",
                "formats": ["json", "csv"],
                "signals": ["vendor", "vendor_type", "cogs_category", "amount", "price_change", "credit"],
                "file_globs": ["*vendor*spend*", "ocr-batch*.json", "*invoice*", "sku-invoice*"],
                "icp_tiers": ["owner-1-5", "area-leader", "cfo-ceo"],
            },
        ],
    },
]

VENUES = [
    {
        "id": "grill",
        "label": "The New American Grill",
        "aliases": ["Grill", "the grill", "The New American Grill"],
        "holy_grail_source": "Drive Courser folder + Kristen packs",
        "status": "courser_indexed",
    },
    {
        "id": "taco-bamba",
        "label": "Taco Bamba",
        "aliases": ["Taco Bomb", "Taco Bamba", "Bamba"],
        "holy_grail_source": "Drive Courser — Sales Labor Report (MP) v5",
        "status": "courser_indexed",
    },
    {
        "id": "community-pizza",
        "label": "Community Pizza / CTAP",
        "aliases": ["CTAP", "Community Pizza", "Community Tap"],
        "holy_grail_source": "Google Drive communitypizza2026@gmail.com",
        "status": "seats_sold_demo",
        "seats_ledger": "fixtures/ctap-portal/seats.json",
        "front_door": "fixtures/ctap-portal/login.html",
        "historical_sales": "fixtures/ctap-portal/historical-sales.json",
        "seats_doc": "docs/CTAP-SEATS.md",
        "sold_seats": [
            {"role": "owner", "assignee": "Mychael Mueller", "price": "free"},
            {"role": "manager_foh", "assignee": "Kenzy Thompson", "price": "paid"},
            {"role": "manager_boh", "assignee": "Tom Dorothy", "price": "paid"},
        ],
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
            "wrong_icp",
            "needs_research",
        ],
        "skills": ["teach-label", "report-teach-batch", "icp-scale-classify", "recurse-learn"],
        "icp_tiers": ["owner-1-5", "area-leader", "cfo-ceo"],
        "docs": "docs/ICP-SCALE.md",
        "holy_grail": {
            "inbox": "mykemueller1@gmail.com (Mike Mueller Gmail)",
            "from": "Kristen",
            "venues": ["grill", "taco-bamba"],
            "want": [
                "csv",
                "xlsx",
                "xls",
                "pdf",
                "google sheets links",
                "sales reportings",
                "phone photos of vendor invoices (primary owner-1-5 AP intake)",
                "payout slips stapled to store receipts",
                "forwarded email vendor invoices (bonus when they do it)",
            ],
        },
        "swarm": True,
    }


def sub_agent(domain: dict, report: dict) -> dict:
    agent = {
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
        "skills": ["report-ingest", "report-normalize", "teach-label"]
        + report.get("skills_extra", []),
        "venues": [v["id"] for v in VENUES],
        "swarm": True,
    }
    if report.get("example_packs"):
        agent["example_packs"] = report["example_packs"]
    if report.get("teach_memory"):
        agent["teach_memory"] = report["teach_memory"]
    return agent


def icp_parent() -> dict:
    return {
        "name": "ICP Scale Parent",
        "title": "Never86 ICP parent — owner 1–5 vs area-leader vs CFO/CEO",
        "role": "parent",
        "shape": "fox",
        "color": "#264653",
        "family": FAMILY,
        "domain_id": "icp-scale",
        "version": VERSION,
        "owner": OWNER,
        "description": (
            "Routes every report pack to the right buyer tier. Owner-operator paper cards "
            "are not area-leader WTD boards and not CFO consolidations. Spawns ICP subs "
            "owner-1-5, area-leader, cfo-ceo. Docs: docs/ICP-SCALE.md."
        ),
        "job_to_be_done": "Never pitch the wrong altitude of problem to the wrong buyer.",
        "sub_agents": [t["id"] for t in ICP_TIERS],
        "skills": ["report-route", "teach-label", "icp-scale-classify"],
        "docs": "docs/ICP-SCALE.md",
        "swarm": True,
    }


def icp_sub(tier: dict) -> dict:
    return {
        "name": f"{tier['label']} ICP Sub",
        "title": f"Never86 ICP — {tier['label']}",
        "role": "icp_sub",
        "shape": "fox",
        "color": tier["color"],
        "family": FAMILY,
        "icp_tier": tier["id"],
        "parent": "icp-scale",
        "version": VERSION,
        "owner": OWNER,
        "description": (
            f"Owns {tier['label']} ({tier['units']}). Buyer: {tier['buyer']}. "
            f"{tier['job']}. Pains: {'; '.join(tier['pains'])}. "
            f"Wedge: {tier['never86_wedge']}."
        ),
        "units": tier["units"],
        "buyer": tier["buyer"],
        "pains": tier["pains"],
        "report_ids": tier["report_ids"],
        "example_packs": tier["example_packs"],
        "never86_wedge": tier["never86_wedge"],
        "skills": ["icp-scale-classify", "teach-label", "report-ingest"],
        "swarm": True,
    }


def venue_scout(venue: dict) -> dict:
    desc = (
        f"Hunts and indexes every CSV/Excel/PDF sales+labor+inventory report for "
        f"{venue['label']}. Source: {venue['holy_grail_source']}. Status: {venue['status']}."
    )
    if venue.get("seats_ledger"):
        desc = (
            f"Hunts and indexes every CSV/Excel/PDF sales+labor+inventory report for "
            f"{venue['label']}. Source: {venue['holy_grail_source']}. "
            f"Front door + sold seats: {venue['seats_ledger'].rsplit('/', 1)[0]}/. "
            f"Status: {venue['status']}."
        )
    scout = {
        "name": f"{venue['label']} Report Scout",
        "title": f"Never86 venue scout — {venue['label']} report packs",
        "role": "venue_scout",
        "shape": "fox",
        "color": "#457B9D",
        "family": FAMILY,
        "venue_id": venue["id"],
        "version": VERSION,
        "owner": OWNER,
        "description": desc,
        "aliases": venue["aliases"],
        "holy_grail_source": venue["holy_grail_source"],
        "status": venue["status"],
        "skills": ["report-ingest", "report-route", "teach-label"],
        "swarm": True,
    }
    for key in (
        "seats_ledger",
        "front_door",
        "historical_sales",
        "seats_doc",
        "sold_seats",
    ):
        if key in venue:
            scout[key] = venue[key]
    return scout


def main() -> None:
    parents_dir = ROOT / "parents"
    subs_dir = ROOT / "subs"
    venues_dir = ROOT / "venues"
    icp_dir = ROOT / "icp"
    for d in (parents_dir, subs_dir, venues_dir, icp_dir):
        d.mkdir(parents=True, exist_ok=True)

    parent_index = []
    sub_index = []
    venue_index = []
    icp_index = []

    teacher = teacher_agent()
    write_json(ROOT / "teacher.json", teacher)

    icp = icp_parent()
    write_json(parents_dir / "icp-scale.json", icp)
    parent_index.append(
        {
            "id": "icp-scale",
            "file": "parents/icp-scale.json",
            "label": "ICP Scale",
            "sub_count": len(ICP_TIERS),
        }
    )
    for tier in ICP_TIERS:
        sub = icp_sub(tier)
        write_json(icp_dir / f"{tier['id']}.json", sub)
        icp_index.append(
            {
                "id": tier["id"],
                "file": f"icp/{tier['id']}.json",
                "label": tier["label"],
                "units": tier["units"],
                "buyer": tier["buyer"],
            }
        )

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
        "icp_tiers": ICP_TIERS,
    }
    write_json(ROOT / "catalog.json", catalog)

    family = {
        "family": FAMILY,
        "platform": "Never86",
        "version": VERSION,
        "swarm_mode": True,
        "purpose": (
            "Parent / teacher / sub-agent swarm for restaurant sales, labor, and inventory "
            "reports — plus ICP scale subs (owner 1–5 vs area-leader vs CFO/CEO). "
            "Holy grail: Courser Grill + Taco Bamba packs; CTAP physical labor cards as "
            "owner-operator ground truth."
        ),
        "owner": OWNER,
        "teacher": "teacher.json",
        "parent_count": len(parent_index),
        "sub_count": len(sub_index),
        "icp_sub_count": len(icp_index),
        "venue_scout_count": len(venue_index),
        "agent_count": 1
        + len(parent_index)
        + len(sub_index)
        + len(icp_index)
        + len(venue_index),
        "shared_skills": [
            "report-ingest",
            "report-route",
            "report-normalize",
            "report-teach-batch",
            "icp-scale-classify",
            "teach-label",
            "recurse-learn",
        ],
        "parents": parent_index,
        "subs": sub_index,
        "icp": icp_index,
        "venues": venue_index,
        "parser": "scripts/parse-toast-reports.mjs",
        "docs": ["docs/TOAST-REPORTS.md", "docs/ICP-SCALE.md"],
    }
    write_json(ROOT / "family.json", family)
    print(
        json.dumps(
            {
                "family": FAMILY,
                "agents": family["agent_count"],
                "parents": family["parent_count"],
                "subs": family["sub_count"],
                "icp": family["icp_sub_count"],
                "venues": family["venue_scout_count"],
                "teacher": True,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
