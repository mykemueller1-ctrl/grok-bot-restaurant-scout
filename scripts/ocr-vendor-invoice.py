#!/usr/bin/env python3
"""OCR phone photos of restaurant vendor invoices / payout slips / store receipts.

Owner 1–5 ICPs dump millions of countertop photos (rotated, stapled, shadowed).
This is the primary intake path for vendor-invoice — email PDFs are bonus.

Usage:
  python3 scripts/ocr-vendor-invoice.py IMG.jpg [IMG2.jpg ...] \\
    [--out fixtures/toast/ctap-physical/normalized/ocr-batch.json] \\
    [--venue community-pizza]

Emits schemas/vendor-invoice.json shaped docs + pack rollup.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

try:
    import pytesseract
    from PIL import Image, ImageEnhance, ImageFilter, ImageOps
except ImportError as e:  # pragma: no cover
    print("Need pillow + pytesseract. pip install pillow pytesseract", file=sys.stderr)
    raise SystemExit(1) from e

VENDOR_PATTERNS = [
    (r"PERFORMANCE\s+FOODSERVICE|formance\s+Foodservice|Performance\s+Foodservice", "Performance Foodservice"),
    (r"\bSYSCO\b", "Sysco"),
    (r"NORTHERN\s+LIGHTS|Northernlights", "Northern Lights Distributing"),
    (r"FAREWAY", "Fareway"),
    (r"HY[\-\s]?VEE|Hyvee", "Hy-Vee"),
    (r"WALMART|Waimart|WM\s+SUPERCENTER", "Walmart"),
    (r"MENARDS", "Menards"),
    (r"SAWYER['’`]?S?\s+MEATS", "Sawyer's Meats of Iowa"),
    (r"HUMES\s+DISTRIBUTING", "Humes Distributing"),
    (r"FT\.?\s*DODGE\s+DISTRIBUTING|FORT\s+DODGE\s+DISTRIBUTING", "FT Dodge Distributing"),
    (r"CONFLUENCE", "Confluence Distribution"),
    (r"HOPKINS\s+DISTRIBUTING", "Hopkins Distributing"),
    (r"COMMUNITY\s+PIZZA|Commurri\s*ty\s+Pizza|Commun\s*ity\s+Pizza", "Community Pizza"),
    (r"COMMUNITY\s+TAP", "Community Tap"),
]

# OCR often mangling TOTAL → Toral / JBTOTAL / Sub-Total ==>
AMOUNT_PATTERNS = [
    r"(?:PAY\s+THIS\s+AMOUNT|INVOICE\s+TOTAL|TOTAL\s+DUE|TOTAL\s+SALE|GRAND\s+TOTAL|INVOICE\s+TOTAL)\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"(?:Amount|AMOUNT)\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"(?:Sub[\-\s]?Total|TOTAL|Toral|Totai|J?B?TOTAL)\s*(?:==>)?\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"(?:SALES|TOTAL)\s*[:\-]?\s*\$?\s*([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]{2}))",
    r"\$\s*([0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})",
    r"\b([0-9]{1,3}(?:,[0-9]{3})*\.[0-9]{2})\s*$",
]

DATE_PATTERNS = [
    r"(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-](?:20)?2[0-9]",
    r"(?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12]\d|3[01])[\/\-]2[0-9]",
]

INVOICE_NUM_PATTERNS = [
    r"(?:INVOICE\s*(?:NUM(?:BER)?|#|NO\.?)|INV\s*#?)\s*[:\-]?\s*([A-Z0-9\-]{4,})",
    r"(?:Invoice\s*#)\s*([A-Z0-9\-]{4,})",
]

ACCOUNT_RE = re.compile(
    r"Account\s*(?:Number|Name)?\s*[:\-]?\s*(\d{3,5})(?:\s+([A-Za-z][A-Za-z\s\/]+))?",
    re.I,
)
EMPLOYEE_RE = re.compile(
    r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s*\((\d{2,4})\)",
)
PAYOUT_HINT = re.compile(r"Pay\s*Out|Manager\s*Sign|Payee\s*Sign|Register\s*#\s*:\s*\d", re.I)


def preprocess(img: Image.Image) -> Image.Image:
    """Countertop photo hygiene: grayscale, autocontrast, light sharpen."""
    g = ImageOps.grayscale(img)
    g = ImageOps.autocontrast(g, cutoff=1)
    g = ImageEnhance.Contrast(g).enhance(1.35)
    g = g.filter(ImageFilter.SHARPEN)
    # Upscale small / soft phone shots for Tesseract
    w, h = g.size
    if max(w, h) < 1600:
        scale = 1600 / max(w, h)
        g = g.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)
    return g


def ocr_orientation(path: Path) -> tuple[str, float, int, list[str]]:
    """Try orientations — prefer 90/0 first (phone landscape of portrait slips)."""
    base = Image.open(path)
    flags: list[str] = []
    order = (90, 0, 270, 180)
    best = ("", -1.0, 0)
    for deg in order:
        rotated = base.rotate(-deg, expand=True) if deg else base
        prep = preprocess(rotated)
        data = pytesseract.image_to_data(prep, output_type=pytesseract.Output.DICT)
        confs = [float(c) for c in data["conf"] if str(c).lstrip("-").isdigit() and float(c) >= 0]
        mean = sum(confs) / len(confs) if confs else 0.0
        if mean > best[1]:
            text = pytesseract.image_to_string(prep)
            best = (text, mean, deg)
        if mean >= 70 and len((best[0] or "").strip()) > 80:
            break
    text, mean, deg = best
    if deg:
        flags.append("rotated")
    if mean < 45:
        flags.append("low_confidence")
    if len(text.strip()) < 40:
        flags.append("partial")
    return text, mean, deg, flags


def parse_money(s: str) -> float | None:
    try:
        return float(s.replace(",", ""))
    except ValueError:
        return None


def detect_vendor(text: str) -> str | None:
    for pat, name in VENDOR_PATTERNS:
        if re.search(pat, text, re.I):
            return name
    # CTAP Register #2 payout slips often OCR-mangle the header
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
            if i <= 3:  # labeled TOTAL / Amount / Sub-Total
                labeled.append((m.start(), v))
            else:
                bare.append(v)
    if labeled:
        # Prefer last labeled hit in document (footer totals)
        labeled.sort(key=lambda x: x[0])
        return labeled[-1][1]
    if bare:
        return max(bare)
    # Last-resort: money-looking tokens in bottom third of text
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
    if vendor and vendor not in ("Community Pizza", "Community Tap"):
        return "distributor_invoice"
    return "unknown"


def extract_doc(path: Path, venue_id: str | None) -> dict:
    text, mean, deg, flags = ocr_orientation(path)
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
    # Handwritten credit hints
    handwritten_credit = None
    cm = re.search(r"(?:Empty|credit|return).{0,20}\-?\s*\$?\s*([0-9]+(?:\.[0-9]{2})?)", text, re.I)
    if cm:
        handwritten_credit = parse_money(cm.group(1))
        if handwritten_credit:
            handwritten_credit = -abs(handwritten_credit)

    if amount is None:
        flags.append("partial")

    return {
        "source_channel": "photo",
        "doc_kind": doc_kind,
        "vendor": vendor or "unknown",
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
        "ocr_confidence": round(mean, 1),
        "rotation_deg": deg,
        "quality_flags": sorted(set(flags)),
        "source_images": [str(path)],
        "venue_id": venue_id,
        "raw_text_excerpt": text[:2000].strip(),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("images", nargs="+", type=Path)
    ap.add_argument("--out", type=Path, default=Path("fixtures/toast/ctap-physical/normalized/ocr-batch.json"))
    ap.add_argument("--venue", default="community-pizza")
    args = ap.parse_args()

    docs = []
    for img in args.images:
        if not img.exists():
            print(f"skip missing: {img}", file=sys.stderr)
            continue
        print(f"OCR {img.name} …", flush=True)
        docs.append(extract_doc(img, args.venue))

    pack = {
        "venue_id": args.venue,
        "icp_tier": "owner_1_5",
        "report_id": "vendor-invoice",
        "source_channel": "photo",
        "engine": "tesseract",
        "schema": "schemas/vendor-invoice.json",
        "note": "Photo OCR is the primary owner-1-5 invoice spine. Email PDFs are bonus when they forward.",
        "documents": docs,
        "stats": {
            "count": len(docs),
            "mean_confidence": round(sum(d["ocr_confidence"] for d in docs) / len(docs), 1) if docs else 0,
            "rotated": sum(1 for d in docs if d["rotation_deg"]),
            "low_confidence": sum(1 for d in docs if "low_confidence" in d["quality_flags"]),
            "vendors": sorted({d["vendor"] for d in docs}),
        },
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(pack, indent=2) + "\n")
    print(json.dumps(pack["stats"], indent=2))
    print(f"wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
