# Restaurant AP / invoice OCR / COGS leaders → Never86 intake

Research for the owner-1-5 photo firehose: who already wins at invoice → coded COGS → P&L, and what Never86 must steal.

## Landscape (2026)

| Player | Job | Intake | Altitude |
| --- | --- | --- | --- |
| [MarginEdge](https://www.marginedge.com/how-it-works) | Photo/email/EDI invoices → line coding → daily P&L / food cost (on top of QBO/Sage) | App photo, email, upload, EDI | Owner → multi-unit |
| [Ottimate (ex Plate IQ)](https://restauranttools.ai/tools/plate-iq) | AP OCR, GL coding, VendorPay | Email/upload/scan | Mid-size AP teams |
| [Restaurant365](https://www.restaurant365.com/) | Full restaurant ERP + AI on full P&L | Integrated AP + inventory + labor | Multi-unit / finance |
| [xtraCHEF by Toast](https://pos.toasttab.com/products/xtrachef) | Toast-native invoice + recipe costing | Invoice automation tied to Toast | Toast shops |
| [MarketMan](https://www.marketman.com/platform/restaurant-management-software) | Inventory + invoice snap + purchasing | Photo/upload | Inventory-first |
| BevSpot / Partender | Bar pour cost / beverage inventory | Bar counts + invoices | Bar-heavy |
| ClearCOGS | AI COGS from POS + invoices | Purchasing stream | Predictive COGS |

Comparisons used: [Best restaurant invoice processing 2026](https://restaurantinventorytools.com/best-restaurant-inventory-software-for-invoice-processing-2026/), [Operator accounting buyer’s guide](https://restaurantvelocity.com/blog/restaurant-accounting-software/), [7 platforms 2026](https://saasrat.com/blog/best-accounting-software-for-restaurants/).

## What the winners do that we must match

1. **Photo-first intake** — staff snap at delivery; messy/handwritten accepted ([MarginEdge how it works](https://www.marginedge.com/how-it-works), [automated invoice](https://www.marginedge.com/automated-invoice)).
2. **Line + total extract** — not just a total; SKU/qty/price when possible.
3. **Code to restaurant COA** — food / beer / wine / liquor / NA bev (pop) split so pour cost and food cost % are real ([KoreFi COA](https://www.korefi.ai/blog/restaurant-chart-of-accounts), [MarketMan COA](https://www.marketman.com/blog/restaurant-chart-of-accounts), [Blue Cloud CPA](https://bluecloudcpa.com/guides/restaurant-bookkeeping-food-cost-prime-cost), [Restaurant Association COA](https://restaurantassociation.com/blog/the-blueprint-for-financial-clarity-how-to-set-up-a-chart-of-accounts-for-your-restaurant/)).
4. **Human-in-the-loop on exceptions** — OCR alone fails; teach/label is the product ([MarginEdge](https://www.marginedge.com/blog/why-automated-invoice-processing-is-a-must-for-restaurant-accountants)).
5. **Daily P&L / prime cost** — invoices + POS sales + labor → leak dollars this week, not month-end.

## Never86 taxonomy (canonical)

See `agent/report-ops/taxonomy/cogs-categories.json`:

- `food` (5100) · `beer` (5200) · `wine` (5210) · `liquor` (5220) · `na_beverage` / pop (5300) — includes milk, juice, coffee · `paper_goods_boxes_chemicals` (5400, **under food costs**) · `misc_opex` (6900)

CTAP Register #2 payout accounts map: Food/Bread → food, Beverage → na_beverage, Misc → misc_opex.

**Operator private teach (Hy-Vee):** grocery Hy-Vee → `food`. Hy-Vee wine / Wine & Spirits receipts → `liquor` (liquor order). See `agent/report-ops/taxonomy/private-teaches/hy-vee.json`.

**Operator private teach (COGS sections):** milk / pop / juice / coffee → Pop. Paper goods, boxes, cleaning & chemicals → `paper_goods_boxes_chemicals` under food costs. See `private-teaches/cogs-sections.json`.

## Never86 wedge

Owner-1-5 dumps millions of messy photos. We OCR + **vendor-type + COGS category** + teach exceptions + **finance advisor swarm** (prime cost / daily P&L / vendor spend). We do not pretend to replace Restaurant365 overnight — we beat MarginEdge-class speed-to-leak-dollar for the photo firehose.

## Runtime

```bash
pip install -r scripts/requirements-ocr.txt
python3 scripts/ocr-vendor-invoice.py photos/*.jpg --venue community-pizza \
  --out fixtures/toast/ctap-physical/normalized/ocr-batch.json
```

Engine: **RapidOCR (ONNX)** primary + Tesseract fallback; auto-rotate; category coding from vendor directory + payout account map.
