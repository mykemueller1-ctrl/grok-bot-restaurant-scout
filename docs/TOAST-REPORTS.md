# Toast reports → Labor / Sales / Inventory

Operator teaching map for Never86. Two Toast exports feed one ops card.

## Labor — Schedule & Labor cards

**Report:** Employee → **Time Entries**  
**File shape:** `TimeEntries_*.csv`

These are the punches that come off **Schedule & Labor**. Each row is a labor card entry for someone who was **actually scheduled / clocked**:

| Column | Meaning |
| --- | --- |
| Employee | Name on the labor card |
| Job Title | Role they were scheduled under |
| In Date / Out Date | Punch window |
| Payable Hours | Hours that hit labor cost |

Roll by **employee** and **job** for staffing vs sales.

## Sales — Menu Sales / Product Mix → SKUs

**Report:** Menus → **Item Selection Details** (Menu Sales)  
**File shape:** `ItemSelectionDetails_*.csv`

This is the POS **product mix**. Hierarchy goes all the way down to SKUs:

```
Sales Category  (Food / Liquor / …)
  └─ Menu         (Dinner / Lunch / Beer / …)
       └─ Menu Group  (Entrees / Burgers / Draft / …)
            └─ Menu Item  ← SKU
```

| Column | Meaning |
| --- | --- |
| Menu Item | SKU name |
| Menu Group / Menu / Sales Category | Mix tree above the SKU |
| Qty | Units sold (= theoretical inventory depletion) |
| Net Price | Line net (already qty-inclusive) |
| Void? | Skip when true; also skip `**********` course separators |

## Inventory bridge

Toast does not need a separate mix export for theoretical usage: **SKU qty on the product mix is inventory draw**. Pair labor hours with SKU sales for labor $ / sales and depletion signals. Actual inventory counts (MarketMan, R365, xtraCHEF, …) still live in silo agents when hunting that pain.

Align **the same calendar window** on both exports before trusting `sales_per_labor_hour`. A single labor day next to a week of Item Selection is fine for SKU mix teaching — not for labor %.

## Parse

```bash
node scripts/parse-toast-reports.mjs \
  --labor path/to/TimeEntries.csv \
  --sales path/to/ItemSelectionDetails.csv \
  --out fixtures/toast/labor-sales-inventory.json
```
