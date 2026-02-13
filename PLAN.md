# Plan: Supplier Stock Source Feature

## Context

Products are tagged with stock source tags indicating where inventory is held:
- **`invicta-stock`** — Held in Invicta's warehouse. Ships same/next day.
- **`trend-stock`**, **`toolbank-stock`**, **`timco-stock`**, **`pdp-stock`** — Held by supplier. Must be ordered in from supplier first, then dispatched to customer. Longer lead time.

Currently, all products show the same "In Stock — Ready to Ship" / delivery estimate regardless of where stock actually sits. Customers need to know *when* they'll realistically receive their order, and Invicta needs the disclaimer coverage.

---

## Files to Modify

| File | What Changes |
|------|-------------|
| `sections/invicta-product-v2.liquid` | Tag detection logic, stock banner, delivery section, new dispatch info block, schema settings |
| `assets/invicta-product-v2.js` | `updateStockStatus()` to handle supplier-stock states + delivery messaging swap |
| `snippets/invicta-delivery-estimate.liquid` | Accept `stock_source` param, show different messaging per source |
| `assets/component-delivery-estimate.js` | Supplier-aware delivery day calculation (add lead days) |
| `snippets/invicta-product-card.liquid` | Tag detection, stock label + bar colour for supplier-stock |
| `assets/invicta-product-card.css` | New `--supplier` stock bar/label colour |
| `assets/invicta-product-v2.css` OR `section-invicta-product-v2.css` | New `--supplier-stock` banner variant + dispatch info styling |

---

## Step-by-Step Implementation

### Step 1: Tag Detection Logic in PDP Liquid

**File:** `sections/invicta-product-v2.liquid` (after line 71, inside the stock logic block)

Add supplier-stock detection right after the existing stock variables:

```liquid
comment
  Fulfillment source detection — which tags does this product carry?
  Priority: invicta-stock (ships from us) > supplier tags (drop-ship / order-in)
endcomment
assign stock_source = 'unknown'
assign supplier_name = ''
for tag in product.tags
  assign tag_lower = tag | downcase | strip
  if tag_lower == 'invicta-stock'
    assign stock_source = 'invicta'
    break
  elsif tag_lower == 'trend-stock'
    assign stock_source = 'supplier'
    assign supplier_name = 'Trend'
  elsif tag_lower == 'toolbank-stock'
    assign stock_source = 'supplier'
    assign supplier_name = 'Toolbank'
  elsif tag_lower == 'timco-stock'
    assign stock_source = 'supplier'
    assign supplier_name = 'Timco'
  elsif tag_lower == 'pdp-stock'
    assign stock_source = 'supplier'
    assign supplier_name = 'PDP'
  endif
endfor

comment
  If no stock tag found, fall back to invicta (safe default = fast shipping promise)
endcomment
if stock_source == 'unknown'
  assign stock_source = 'invicta'
endif
```

**Why `invicta` wins with `break`:** If a product somehow has both `invicta-stock` AND a supplier tag, the warehouse copy takes priority since it ships faster.

---

### Step 2: Update the Stock Banner (PDP)

**File:** `sections/invicta-product-v2.liquid` (lines 355-372)

Replace the current stock banner block. The banner needs a 4th state: **supplier-stock** (blue, distinct from green/amber/grey).

```liquid
{%- comment -%} STOCK BANNER {%- endcomment -%}
<div
  class="inv-pdp__stock-banner
    {%- if is_in_stock and stock_source == 'invicta' %} inv-pdp__stock-banner--in-stock
    {%- elsif is_in_stock and stock_source == 'supplier' %} inv-pdp__stock-banner--supplier-stock
    {%- else %} inv-pdp__stock-banner--out-of-stock
    {%- endif -%}"
  role="status"
  aria-live="polite"
  data-stock-banner
  data-stock-source="{{ stock_source }}"
>
  <span class="inv-pdp__stock-dot" aria-hidden="true"></span>
  <span data-stock-text>
    {%- if is_in_stock == false -%}
      {{ section.settings.oos_text | default: 'Out of Stock' }}
    {%- elsif stock_source == 'supplier' -%}
      {{ section.settings.supplier_stock_text | default: 'In Stock with Supplier — Usually Dispatched within 2–3 Working Days' }}
    {%- elsif show_low_stock -%}
      Only {{ stock_qty }} left in stock — order soon
    {%- else -%}
      {{ section.settings.in_stock_text | default: 'In Stock — Ready to Ship' }}
    {%- endif -%}
  </span>
</div>
```

**Key decisions:**
- Supplier stock gets a **blue** banner (distinct from green = instant, amber = low, grey = OOS)
- The message says "In Stock with Supplier" — honest but reassuring. Not "out of stock", it IS available
- "Usually Dispatched within 2–3 Working Days" sets the expectation + provides disclaimer coverage
- `data-stock-source` attribute lets JS know the source for dynamic updates

---

### Step 3: Add Dispatch Info Block (PDP — new element)

**File:** `sections/invicta-product-v2.liquid` (after stock banner, before buybox-body ~line 373)

Add a secondary info line specifically for supplier-sourced products — this is the disclaimer:

```liquid
{%- if is_in_stock and stock_source == 'supplier' -%}
  <div class="inv-pdp__dispatch-info" data-dispatch-info>
    <svg class="inv-pdp__dispatch-info-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
    <span>{{ section.settings.supplier_dispatch_text | default: 'This item is sourced from our supplier. Once received, we inspect and dispatch it to you. Estimated delivery: 3–5 working days.' }}</span>
  </div>
{%- endif -%}
```

**Why a separate block (not just the banner)?**
- The banner is a short status label (keeps scanning fast)
- The dispatch info block is the detailed disclaimer/explanation
- Visually distinct — light blue background with info icon — signals "extra info" not "warning"

---

### Step 4: Update the Delivery Estimate Snippet

**File:** `snippets/invicta-delivery-estimate.liquid`

The snippet currently always shows next-day delivery. It needs to accept the stock source and show different messaging.

```liquid
{% comment %}
  INVICTA DELIVERY ESTIMATE v2.0
  Now supports stock_source parameter for supplier-sourced items

  Usage:
    {% render 'invicta-delivery-estimate' %}
    {% render 'invicta-delivery-estimate', stock_source: 'supplier' %}
    {% render 'invicta-delivery-estimate', compact: true, stock_source: stock_source %}
{% endcomment %}

{% liquid
  assign is_compact = compact | default: false
  assign source = stock_source | default: 'invicta'
%}
```

The render call in `invicta-product-v2.liquid` (line 532) changes to:
```liquid
{% render 'invicta-delivery-estimate', stock_source: stock_source %}
```

For **invicta-stock** products: keep existing behaviour (next-day countdown).

For **supplier-stock** products: replace the countdown row with a static "Estimated delivery: 3–5 working days" message (no countdown — it doesn't make sense when it's not shipping today).

Add a `data-stock-source` attribute to the container `div` so the JS knows which mode to run:
```html
<div class="inv-del-est{% if is_compact %} inv-del-est--compact{% endif %}"
     data-inv-delivery-estimate
     data-stock-source="{{ source }}">
```

For supplier source, the delivery row changes to:
```liquid
{%- if source == 'supplier' -%}
  <span class="inv-del-est__text">
    Estimated delivery <strong class="inv-del-est__day">3–5 working days</strong> from order
  </span>
{%- else -%}
  {%- comment -%} existing next-day countdown markup {%- endcomment -%}
  <span class="inv-del-est__text">
    <span data-inv-del-order-text>...</span>
    <strong data-inv-del-countdown ...></strong>
    ...
  </span>
{%- endif -%}
```

---

### Step 5: Update Delivery Estimate JS

**File:** `assets/component-delivery-estimate.js`

Currently runs countdown for ALL delivery estimate instances. Needs to skip countdown for supplier-stock:

```javascript
document.querySelectorAll('[data-inv-delivery-estimate]').forEach(function(el) {
  var source = el.dataset.stockSource || 'invicta';

  // Supplier-sourced items: no countdown, static message — nothing to do
  if (source === 'supplier') return;

  // ... existing countdown logic unchanged ...
});
```

This is clean — supplier items simply don't get a countdown timer since there's no same-day cutoff that applies.

---

### Step 6: Update JavaScript Stock Status Updates

**File:** `assets/invicta-product-v2.js` (lines 587-630, `updateStockStatus` function)

The JS needs to know the stock source (read from the `data-stock-source` attribute we added in Step 2) and handle the supplier state when variants change:

```javascript
function updateStockStatus(available, variant) {
  const stockBanner = section.querySelector('[data-stock-banner]');
  const stockText = section.querySelector('[data-stock-text]');
  const dispatchInfo = section.querySelector('[data-dispatch-info]');
  const lowStockThreshold = parseInt(section.dataset.lowStockThreshold, 10) || 5;
  var stockSource = stockBanner ? stockBanner.dataset.stockSource : 'invicta';

  if (stockBanner && stockText) {
    stockBanner.classList.remove(
      'inv-pdp__stock-banner--in-stock',
      'inv-pdp__stock-banner--out-of-stock',
      'inv-pdp__stock-banner--low-stock',
      'inv-pdp__stock-banner--supplier-stock'
    );

    if (available) {
      if (stockSource === 'supplier') {
        stockBanner.classList.add('inv-pdp__stock-banner--supplier-stock');
        stockText.textContent = 'In Stock with Supplier \u2014 Usually Dispatched within 2\u20133 Working Days';
      } else {
        var qty = variant && variant.inventory_quantity;
        var tracked = variant && variant.inventory_management === 'shopify';
        if (tracked && qty > 0 && qty <= lowStockThreshold) {
          stockBanner.classList.add('inv-pdp__stock-banner--low-stock');
          stockText.textContent = 'Only ' + qty + ' left in stock \u2014 order soon';
        } else {
          stockBanner.classList.add('inv-pdp__stock-banner--in-stock');
          stockText.textContent = 'In Stock \u2014 Ready to Ship';
        }
      }
    } else {
      stockBanner.classList.add('inv-pdp__stock-banner--out-of-stock');
      stockText.textContent = 'Out of Stock';
    }
  }

  // Show/hide dispatch info block for supplier items
  if (dispatchInfo) {
    dispatchInfo.style.display = (available && stockSource === 'supplier') ? '' : 'none';
  }

  // ... rest of ATC/notify logic unchanged ...
}
```

**Note:** `stockSource` is set per-product (from tags), not per-variant. A product either comes from Invicta or from a supplier — it doesn't change when you pick a different size/colour. So we read it once from the data attribute.

---

### Step 7: CSS for New Stock States

**File:** `assets/invicta-product-v2.css` or `section-invicta-product-v2.css`

#### Supplier Stock Banner (blue theme)
```css
/* Supplier stock — blue to differentiate from in-stock green */
.inv-pdp__stock-banner--supplier-stock {
  background-color: #dbeafe;
  color: #1e40af;
}
.inv-pdp__stock-banner--supplier-stock .inv-pdp__stock-dot {
  background-color: #3b82f6;
  /* No pulse animation — it's not "urgent" */
  animation: none;
}
```

#### Dispatch Info Block (new element)
```css
.inv-pdp__dispatch-info {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: #1e40af;
  margin-top: -4px;
  margin-bottom: 12px;
}
.inv-pdp__dispatch-info-icon {
  flex-shrink: 0;
  margin-top: 1px;
  color: #3b82f6;
}
```

---

### Step 8: Update Product Cards

**File:** `snippets/invicta-product-card.liquid` (lines 44-58)

Add supplier detection to the card's stock logic. Cards need a lighter touch — just the bar colour and an optional label:

```liquid
# -------------------------
# Stock status + source
# -------------------------
assign available = current_variant.available
assign inventory_qty = current_variant.inventory_quantity | default: 0
assign stock_status = 'in-stock'
assign stock_label = 'invicta.product.stock_in_stock' | t
assign is_supplier_stock = false

for tag in product.tags
  assign tag_lower = tag | downcase | strip
  if tag_lower == 'trend-stock' or tag_lower == 'toolbank-stock' or tag_lower == 'timco-stock' or tag_lower == 'pdp-stock'
    assign is_supplier_stock = true
    break
  endif
  if tag_lower == 'invicta-stock'
    assign is_supplier_stock = false
    break
  endif
endfor

if available == false
  assign stock_status = 'out'
  assign stock_label = 'invicta.product.stock_sold_out' | t
elsif is_supplier_stock
  assign stock_status = 'supplier'
  assign stock_label = '3–5 Day Delivery'
elsif inventory_qty > 0 and inventory_qty <= 5
  assign stock_status = 'low'
  assign stock_label = 'invicta.product.stock_low' | t: quantity: inventory_qty
endif
```

The existing markup already uses `{{ stock_status }}` dynamically:
```liquid
<div class="inv-card__stock-bar inv-card__stock-bar--{{ stock_status }}"></div>
<span class="inv-card__stock inv-card__stock--{{ stock_status }}">{{ stock_label }}</span>
```

So adding `supplier` as a status value automatically creates the right classes.

---

### Step 9: Product Card CSS

**File:** `assets/invicta-product-card.css`

```css
/* Supplier stock — blue bar + visible label */
.inv-card__stock-bar--supplier {
  background-color: var(--inv-stock-supplier, #3b82f6);
}
.inv-card__stock--supplier {
  display: inline-block;
  background-color: #3b82f6;
  color: #ffffff;
}
```

Unlike in-stock (hidden label), supplier-stock **shows the label** ("3–5 Day Delivery") so customers know before they click through. This is key for managing expectations.

---

### Step 10: Schema Settings (Customiser Controls)

**File:** `sections/invicta-product-v2.liquid` schema (after the existing "Stock & Dispatch" header, ~line 998)

Add new configurable text fields so the wording can be tweaked from the Shopify Customiser without code changes:

```json
{
  "type": "text",
  "id": "supplier_stock_text",
  "label": "Supplier stock banner text",
  "default": "In Stock with Supplier — Usually Dispatched within 2–3 Working Days"
},
{
  "type": "text",
  "id": "supplier_dispatch_text",
  "label": "Supplier dispatch disclaimer",
  "default": "This item is sourced from our supplier. Once received, we inspect and dispatch it to you. Estimated delivery: 3–5 working days."
},
{
  "type": "text",
  "id": "supplier_delivery_estimate",
  "label": "Supplier delivery estimate (shown in delivery row)",
  "default": "3–5 working days"
}
```

---

### Step 11: Click & Collect Handling

**File:** `sections/invicta-product-v2.liquid` (lines 535-545)

Supplier-sourced products should NOT show "Want to collect in store?" since the item isn't in the shop:

```liquid
{% if section.settings.show_click_collect and stock_source == 'invicta' %}
  <div class="inv-pdp__collect">
    ...existing markup...
  </div>
{% endif %}
```

One-line change: add `and stock_source == 'invicta'` to the condition.

---

### Step 12: Buy Now Button Handling

**File:** `sections/invicta-product-v2.liquid` (lines 76-80)

Consider hiding "Buy Now — Skip the Cart" for supplier items since delivery is slower and customers might want to review the dispatch info in cart. This is optional but recommended:

```liquid
if show_buy_now and is_in_stock and current_variant.price <= buy_now_threshold_pence and stock_source == 'invicta'
  assign show_buy_now_final = true
endif
```

---

## Visual Summary

### PDP — Invicta Stock (ships from warehouse)
```
┌─────────────────────────────────────────┐
│ 🟢 In Stock — Ready to Ship            │  ← Green banner (unchanged)
├─────────────────────────────────────────┤
│ Product Title                           │
│ ...                                     │
│ 🚚 Order within 02:15:30 for delivery  │  ← Next-day countdown (unchanged)
│    on Thursday                          │
│ 📞 Want to collect in store?            │  ← Shows (unchanged)
│ [1] [  Add to Cart  ]                  │
│ ⚡ Buy Now — Skip the Cart              │  ← Shows (unchanged)
└─────────────────────────────────────────┘
```

### PDP — Supplier Stock (Trend/Toolbank/Timco/PDP)
```
┌─────────────────────────────────────────┐
│ 🔵 In Stock with Supplier — Usually    │  ← Blue banner (NEW)
│    Dispatched within 2–3 Working Days   │
├─────────────────────────────────────────┤
│ ℹ️ This item is sourced from our        │  ← Dispatch disclaimer (NEW)
│   supplier. Once received, we inspect   │
│   and dispatch it to you. Estimated     │
│   delivery: 3–5 working days.           │
├─────────────────────────────────────────┤
│ Product Title                           │
│ ...                                     │
│ 🚚 Estimated delivery 3–5 working days │  ← Static estimate, NO countdown (NEW)
│    from order                           │
│                                         │  ← NO click & collect (hidden)
│ [1] [  Add to Cart  ]                  │
│                                         │  ← NO Buy Now (hidden)
└─────────────────────────────────────────┘
```

### Product Card — Supplier Stock
```
┌──────────────────┐
│ ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬ │  ← Blue bar (instead of green)
│ [3–5 Day Delivery]│  ← Blue label VISIBLE (new)
│                  │
│   [Product Img]  │
│                  │
├──────────────────┤
│ Brand            │
│ Product Title... │
│ £XX.XX           │
│ [ADD TO CART]    │
└──────────────────┘
```

---

## Summary of All Changes

| # | File | Change | Lines of Code |
|---|------|--------|:---:|
| 1 | `invicta-product-v2.liquid` | Tag detection block | ~25 |
| 2 | `invicta-product-v2.liquid` | Stock banner with supplier state | ~15 |
| 3 | `invicta-product-v2.liquid` | Dispatch info disclaimer block | ~12 |
| 4 | `invicta-product-v2.liquid` | Pass `stock_source` to delivery snippet | ~1 |
| 5 | `invicta-product-v2.liquid` | Hide click & collect for supplier | ~1 |
| 6 | `invicta-product-v2.liquid` | Hide Buy Now for supplier | ~1 |
| 7 | `invicta-product-v2.liquid` | Schema: 3 new text settings | ~18 |
| 8 | `invicta-delivery-estimate.liquid` | Accept `stock_source`, branch markup | ~15 |
| 9 | `component-delivery-estimate.js` | Skip countdown for supplier source | ~3 |
| 10 | `invicta-product-v2.js` | `updateStockStatus` supplier handling | ~20 |
| 11 | `invicta-product-v2.css` / `section-*` | Supplier banner + dispatch info styles | ~25 |
| 12 | `invicta-product-card.liquid` | Tag detection + supplier stock status | ~15 |
| 13 | `invicta-product-card.css` | Supplier bar + label styles | ~10 |
| | | **Total** | **~160** |

No new files created. No dependencies added. All changes are additive — existing invicta-stock behaviour is completely unchanged.
