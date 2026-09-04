#!/usr/bin/env python3
"""OCR phone photos of restaurant vendor invoices — RapidOCR primary, Tesseract fallback.

Owner 1–5 ICPs dump millions of messy countertop photos (food / beer / liquor / pop /
meat / grocery / payout slips). This is the primary vendor-invoice intake path.

Usage:
  python3 scripts/ocr-vendor-invoice.py IMG.jpg [IMG2.jpg ...] \\
    [--out fixtures/toast/ctap-physical/normalized/ocr-batch.json] \\
    [--venue community-pizza] [--engine auto|rapid|tesseract]

Emits schemas/vendor-invoice.json docs with cogs_category + vendor_type coding.
Taxonomy: agent/report-ops/taxonomy/cogs-categories.json
Research: docs/RESTAURANT-AP-OCR.md
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
TAXONOMY_PATH = ROOT / "agent/report-ops/taxonomy/cogs-categories.json"

try:
    import pytesseract
except ImportError:  # pragma: no cover
    pytesseract = None  # type: ignore

try:
    from rapidocr_onnxruntime import RapidOCR
except ImportError:  # pragma: no cover
    RapidOCR = None  # type: ignore

_RAPID = None


def load_taxonomy() -> dict:
    if TAXONOMY_PATH.exists():
        return json.loads(TAXONOMY_PATH.read_text())
    return {"categories": [], "vendor_directory_seed": [], "payout_account_map": {}}


TAX = load_taxonomy()
VENDOR_DIR = {v["name"].lower(): v for v in TAX.get("vendor_directory_seed", [])}
PAYOUT_MAP = {str(k).lower(): v for k, v in TAX.get("payout_account_map", {}).items()}

VENDOR_PATTERNS = [
    (r"PERFORMANCE\s+FOODSERVICE|formance\s+Foodservice|Performance\s+Foodservice", "Performance Foodservice"),
    (r"\bSYSCO\b", "Sysco"),
    (r"US\s*FOODS", "US Foods"),
    (r"NORTHERN\s+LIGHTS|Northernlights", "Northern Lights Distributing"),
    (r"FAREWAY", "Fareway"),
    (r"HY[\-\s]?VEE\s+WINE|WINE\s*&\s*SPIRITS", "Hy-Vee Wine & Spirits"),
    (r"HY[\-\s]?VEE|Hyvee", "Hy-Vee"),
    (r"WALMART|Waimart|WM\s+SUPERCENTER", "Walmart"),
    (r"MENARDS", "Menards"),
    (r"SAWYER['’`]?S?\s+MEATS", "Sawyer's Meats of Iowa"),
    (r"HUMES\s+DISTRIBUTING", "Humes Distributing"),
    (r"FT\.?\s*DODGE\s+DISTRIBUTING|FORT\s+DODGE\s+DISTRIBUTING", "FT Dodge Distributing"),
    (r"HOPKINS\s+DISTRIBUTING", "Hopkins Distributing"),
    (r"CONFLUENCE", "Confluence Distribution"),
    (r"COMMUNITY\s+PIZZA|Commurri\s*ty\s+Pizza|Commun\s*ity\s+Pizza", "Community Pizza"),
    (r"COMMUNITY\s+TAP", "Community Tap"),
    (r"RESTAURANT\s+DEPOT", "Restaurant Depot"),
]

AMOUNT_PATTERNS = [
    r"(?:PAY\s+THIS\s+AMOUNT|INVOICE\s+TOTAL|TOTAL\s+DUE|TOTAL\s+SALE|GRAND\s+TOTAL)\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"(?:Amount|AMOUNT)\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"(?:Invoice\s+Total|TOTAL)\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"(?:Sub[\-\s]?Total|TOTAL|Toral|Totai|J?B?TOTAL|SALES)\s*(?:==>)?\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"\$\s*([0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})",
]

DATE_PATTERNS = [
    r"(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:20)?2[0-9]",
]

INVOICE_NUM_PATTERNS = [
    r"(?:INVOICE\s*(?:NUM(?:BER)?|#|NO\.?)|INV\s*#?)\s*[:\-]?\s*([A-Z0-9\-]{4,})",
]

ACCOUNT_RE = re.compile(
    r"Account\s*(?:Number|Name)?\s*[:\-]?\s*(\d{3,5})(?:\s+([A-Za-z][A-Za-z\s\/]+))?",
    re.I,
)
EMPLOYEE_RE = re.compile(r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*\((\d{2,4})\)")
PAYOUT_HINT = re.compile(r"Pay\s*Out|Manager\s*Sign|Payee\s*Sign|Register\s*#\s*:?\s*\d", re.I)

# Line-item keyword → category overrides (for mixed broadline invoices)
LINE_CATEGORY_HINTS = [
    (r"\b(KEG|BBL|DRAFT|BEER|LAGERS?|ALE|IPA|PABST|COORS|BUD|YUENGLING|BUSCH|MIC\s*ULTRA)\b", "beer"),
    (r"\b(VODKA|WHISKEY|WHISKY|TEQUILA|RUM|GIN|LIQUEUR|CORDIAL|SPIRIT|CROWN|TITO|PATRON)\b", "liquor"),
    (r"\b(WINE|PINOT|CHARD|ZINFANDEL|MERLOT|CABERNET|PROSECCO|SPUMANTE)\b", "wine"),
    (r"\b(SODA|POP|COLA|7UP|SPRITE|TONIC|GINGER\s*BEER|COFFEE|JUICE|MIXER)\b", "na_beverage"),
    (r"\b(FOAM|LINER|NAPKIN|BAG|GLOVE|STRAW|PAPER|PACKAGING|TO[\-\s]?GO)\b", "paper_packaging"),
    (r"\b(DETERGENT|SOAP|CHEM|RINSE|CLEAN|SHARPIE|HARDWARE)\b", "ops_supplies"),
]


def get_rapid():
    global _RAPID
    if RapidOCR is None:
        return None
    if _RAPID is None:
        _RAPID = RapidOCR()
    return _RAPID


def preprocess(img: Image.Image) -> Image.Image:
    g = ImageOps.grayscale(img)
    g = ImageOps.autocontrast(g, cutoff=1)
    g = ImageEnhance.Contrast(g).enhance(1.4)
    g = ImageEnhance.Sharpness(g).enhance(1.6)
    g = g.filter(ImageFilter.MedianFilter(size=3))
    w, h = g.size
    if max(w, h) < 1800:
        scale = 1800 / max(w, h)
        g = g.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    return g.convert("RGB")


def score_text(text: str) -> float:
    """Heuristic quality: money tokens + vendor hits + length."""
    if not text or len(text.strip()) < 20:
        return 0.0
    score = min(len(text.strip()) / 40.0, 40.0)
    if detect_vendor(text):
        score += 25
    if detect_amount(text) is not None:
        score += 25
    if detect_date(text):
        score += 10
    money_hits = len(re.findall(r"\d+\.\d{2}", text))
    score += min(money_hits * 2, 20)
    return score


def ocr_rapid(img: Image.Image) -> tuple[str, float]:
    eng = get_rapid()
    if eng is None:
        return "", 0.0
    import numpy as np

    arr = np.array(img)
    result, _ = eng(arr)
    if not result:
        return "", 0.0
    lines = []
    confs = []
    for row in result:
        # row: [box, text, conf]
        if len(row) >= 3:
            lines.append(str(row[1]))
            try:
                confs.append(float(row[2]) * 100.0)
            except (TypeError, ValueError):
                pass
    text = "\n".join(lines)
    mean = sum(confs) / len(confs) if confs else score_text(text)
    return text, mean


def ocr_tesseract(img: Image.Image) -> tuple[str, float]:
    if pytesseract is None:
        return "", 0.0
    data = pytesseract.image_to_data(img, output_type=pytesseract.Output.DICT)
    confs = [float(c) for c in data["conf"] if str(c).lstrip("-").isdigit() and float(c) >= 0]
    mean = sum(confs) / len(confs) if confs else 0.0
    text = pytesseract.image_to_string(img)
    return text, mean


def ocr_orientation(path: Path, engine: str) -> tuple[str, float, int, list[str], str]:
    """Try orientations; return text, conf, rotation, flags, engine_used."""
    base = Image.open(path)
    flags: list[str] = []
    order = (90, 0, 270, 180)
    best = ("", -1.0, 0, "none")
    engines = []
    if engine in ("auto", "rapid") and RapidOCR is not None:
        engines.append("rapid")
    if engine in ("auto", "tesseract") and pytesseract is not None:
        engines.append("tesseract")
    if not engines:
        raise RuntimeError("No OCR engine available. pip install rapidocr-onnxruntime pillow pytesseract")

    for deg in order:
        rotated = base.rotate(-deg, expand=True) if deg else base
        prep = preprocess(rotated)
        for eng_name in engines:
            if eng_name == "rapid":
                text, mean = ocr_rapid(prep)
            else:
                text, mean = ocr_tesseract(prep)
            # Blend engine conf with content score for messy photos
            blended = min(100.0, 0.6 * mean + 0.4 * score_text(text))
            if blended > best[1]:
                best = (text, blended, deg, eng_name)
            if blended >= 75 and len(text.strip()) > 100:
                break
        if best[1] >= 75 and len(best[0].strip()) > 100:
            break

    text, mean, deg, eng_used = best
    if deg:
        flags.append("rotated")
    if mean < 45:
        flags.append("low_confidence")
    if len(text.strip()) < 40:
        flags.append("partial")
    return text, mean, deg, flags, eng_used


def parse_money(s: str) -> float | None:
    try:
        return float(s.replace(",", ""))
    except ValueError:
        return None


def detect_vendor(text: str) -> str | None:
    for pat, name in VENDOR_PATTERNS:
        if re.search(pat, text, re.I):
            return name
    if re.search(r"Register\s*#?\s*:?\s*\d", text, re.I) and re.search(
        r"Manager\s*Sign|Payee\s*Sign|Account\s*Number", text, re.I
    ):
        return "Community Pizza"
    return None


def detect_amount(text: str) -> float | None:
    labeled: list[tuple[int, float]] = []
    bare: list[float] = []
    for i, pat in enumerate(AMOUNT_PATTERNS):
        for m in re.finditer(pat, text, re.I | re.M):
            v = parse_money(m.group(1))
            if v is None or not (0.5 <= v <= 50000):
                continue
            if i <= 3:
                labeled.append((m.start(), v))
            else:
                bare.append(v)
    if labeled:
        labeled.sort(key=lambda x: x[0])
        # Prefer last labeled; if "Amount:" near payout, that wins
        return labeled[-1][1]
    if bare:
        return max(bare)
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    tail = "\n".join(lines[max(0, len(lines) * 2 // 3) :])
    nums = [parse_money(m.group(1)) for m in re.finditer(r"\b([0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})\b", tail)]
    nums = [n for n in nums if n and 1 <= n <= 50000]
    return max(nums) if nums else None


def detect_date(text: str) -> str | None:
    for pat in DATE_PATTERNS:
        m = re.search(pat, text)
        if not m:
            continue
        raw = m.group(0).replace("-", "/")
        parts = raw.split("/")
        if len(parts) != 3:
            continue
        mm, dd, yy = parts
        year = int(yy) if len(yy) == 4 else 2000 + int(yy)
        try:
            return date(year, int(mm), int(dd)).isoformat()
        except ValueError:
            continue
    return None


def detect_invoice_num(text: str) -> str | None:
    for pat in INVOICE_NUM_PATTERNS:
        m = re.search(pat, text, re.I)
        if m:
            return m.group(1).strip()
    return None


def detect_doc_kind(text: str, vendor: str | None) -> str:
    if PAYOUT_HINT.search(text) and re.search(r"Account\s*(Number|Name)", text, re.I):
        if vendor and vendor not in ("Community Pizza", "Community Tap"):
            return "payout_slip_plus_receipt"
        return "payout_slip"
    if vendor in ("Fareway", "Hy-Vee", "Walmart", "Menards"):
        return "store_receipt"
    if vendor == "Sawyer's Meats of Iowa":
        return "handwritten_invoice"
    if vendor == "Hy-Vee Wine & Spirits":
        return "wholesale_invoice_plus_receipt"
    if vendor and vendor not in ("Community Pizza", "Community Tap"):
        return "distributor_invoice"
    return "unknown"


def classify_cogs(vendor: str | None, text: str, account: str | None, description: str | None) -> dict:
    """Map vendor + payout account + line hints → COGS category (food/beer/liquor/pop/…)."""
    # 1) Payout account / description wins for Register slips
    for key in filter(None, [account, description]):
        for token in re.split(r"[\s/]+", str(key)):
            mapped = PAYOUT_MAP.get(token.lower())
            if mapped:
                return {
                    "cogs_category": mapped,
                    "vendor_type": VENDOR_DIR.get((vendor or "").lower(), {}).get("vendor_type"),
                    "category_source": "payout_account",
                }

    # 2) Vendor directory default
    if vendor:
        meta = VENDOR_DIR.get(vendor.lower())
        if meta and meta.get("default_category"):
            # Mixed broadline: peek for beer/liquor/pop line hints
            for pat, cat in LINE_CATEGORY_HINTS:
                if re.search(pat, text, re.I) and cat != meta["default_category"]:
                    # If beer/liquor distributor keywords dominate, override
                    if cat in ("beer", "wine", "liquor") and meta.get("vendor_type") in (
                        "beer_distributor",
                        "wine_spirits",
                        "grocery_liquor",
                    ):
                        return {
                            "cogs_category": cat,
                            "vendor_type": meta.get("vendor_type"),
                            "category_source": "line_hint",
                        }
            return {
                "cogs_category": meta["default_category"],
                "vendor_type": meta.get("vendor_type"),
                "category_source": "vendor_directory",
            }

    # 3) Line hints anywhere
    for pat, cat in LINE_CATEGORY_HINTS:
        if re.search(pat, text, re.I):
            return {"cogs_category": cat, "vendor_type": None, "category_source": "line_hint"}

    return {"cogs_category": "unknown", "vendor_type": None, "category_source": "unmapped"}


def extract_doc(path: Path, venue_id: str | None, engine: str) -> dict:
    text, mean, deg, flags, eng_used = ocr_orientation(path, engine)
    vendor = detect_vendor(text)
    amount = detect_amount(text)
    doc_kind = detect_doc_kind(text, vendor)
    account = None
    employee = None
    description = None
    am = ACCOUNT_RE.search(text)
    if am:
        account = am.group(1)
        if am.group(2):
            account = f"{am.group(1)} {am.group(2).strip().splitlines()[0][:40]}"
    em = EMPLOYEE_RE.search(text)
    if em:
        employee = em.group(1)
    dm = re.search(r"Description\s*[:\-]?\s*([A-Za-z0-9][A-Za-z0-9\s\-]{1,40})", text, re.I)
    if dm:
        description = dm.group(1).strip()

    handwritten_credit = None
    cm = re.search(r"(?:Empty|credit|return).{0,20}\-?\s*\$?\s*([0-9]+(?:\.[0-9]{2})?)", text, re.I)
    if cm:
        handwritten_credit = parse_money(cm.group(1))
        if handwritten_credit:
            handwritten_credit = -abs(handwritten_credit)

    coding = classify_cogs(vendor, text, account, description)

    if amount is None:
        flags.append("partial")
    if coding["cogs_category"] == "unknown":
        flags.append("uncategorized")

    return {
        "source_channel": "photo",
        "doc_kind": doc_kind,
        "vendor": vendor or "unknown",
        "vendor_type": coding.get("vendor_type"),
        "cogs_category": coding.get("cogs_category"),
        "category_source": coding.get("category_source"),
        "date": detect_date(text),
        "invoice_num": detect_invoice_num(text),
        "amount": amount if amount is not None else 0.0,
        "printed_total": amount,
        "tax": None,
        "account": account,
        "employee": employee,
        "description": description,
        "customer": None,
        "line_items": [],
        "handwritten_credit": handwritten_credit,
        "ocr_engine": eng_used,
        "ocr_confidence": round(mean, 1),
        "rotation_deg": deg,
        "quality_flags": sorted(set(flags)),
        "source_images": [str(path)],
        "venue_id": venue_id,
        "raw_text_excerpt": text[:500].strip(),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("images", nargs="+", type=Path)
    ap.add_argument("--out", type=Path, default=Path("fixtures/toast/ctap-physical/normalized/ocr-batch.json"))
    ap.add_argument("--venue", default="community-pizza")
    ap.add_argument("--engine", choices=["auto", "rapid", "tesseract"], default="auto")
    args = ap.parse_args()

    docs = []
    for img in args.images:
        if not img.exists():
            print(f"skip missing: {img}", file=sys.stderr)
            continue
        print(f"OCR {img.name} …", flush=True)
        docs.append(extract_doc(img, args.venue, args.engine))

    by_cat: dict[str, float] = {}
    for d in docs:
        cat = d.get("cogs_category") or "unknown"
        by_cat[cat] = by_cat.get(cat, 0.0) + float(d.get("amount") or 0)

    pack = {
        "venue_id": args.venue,
        "icp_tier": "owner_1_5",
        "report_id": "vendor-invoice",
        "source_channel": "photo",
        "engine": args.engine,
        "engines_used": sorted({d["ocr_engine"] for d in docs}),
        "schema": "schemas/vendor-invoice.json",
        "taxonomy": "agent/report-ops/taxonomy/cogs-categories.json",
        "docs_ref": "docs/RESTAURANT-AP-OCR.md",
        "note": "Photo OCR + COGS category coding (food/beer/wine/liquor/pop). RapidOCR primary; Tesseract fallback.",
        "documents": docs,
        "category_rollups": {k: round(v, 2) for k, v in sorted(by_cat.items())},
        "stats": {
            "count": len(docs),
            "mean_confidence": round(sum(d["ocr_confidence"] for d in docs) / len(docs), 1) if docs else 0,
            "rotated": sum(1 for d in docs if d["rotation_deg"]),
            "low_confidence": sum(1 for d in docs if "low_confidence" in d["quality_flags"]),
            "amounts_found": sum(1 for d in docs if d["amount"] > 0),
            "categorized": sum(1 for d in docs if d.get("cogs_category") not in (None, "unknown")),
            "vendors": sorted({d["vendor"] for d in docs}),
            "categories": sorted({d.get("cogs_category") or "unknown" for d in docs}),
        },
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    # relativize image names for fixtures
    for d in docs:
        d["source_images"] = [Path(s).name for s in d["source_images"]]
    args.out.write_text(json.dumps(pack, indent=2) + "\n")
    print(json.dumps(pack["stats"], indent=2))
    print("category_rollups", json.dumps(pack["category_rollups"], indent=2))
    print(f"wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
