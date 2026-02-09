# INVICTA TOOLS — Principal Architect's Codebase Audit

**Date:** 9 February 2026
**Repo:** `george-itf/invictatools`
**Auditor:** Principal Software Architect (incoming)
**Classification:** Brownfield / Legacy Theme Modernisation

---

## Executive Summary

Invicta Tools is running a **heavily customised Dawn-derived Shopify theme** that is
**95% Online Store 2.0** by template count but carries significant architectural debt
beneath the surface. The *intent* of the site is clear and commercially sound — a
hybrid B2B/B2C hardware merchant serving Kent tradespeople and retail customers with
VAT-aware pricing, kit building, bulk discounts, and local SEO — but the *execution*
has accrued layers of duplicated logic, inlined CSS/JS, and hardcoded business rules
that make the codebase fragile, slow to iterate on, and heavier than it needs to be
for the 4G-connected trade customers it serves.

**The good news:** there is no jQuery, no external library bloat, and the JS is
properly deferred. The design token system (`invicta-css-variables`) is well-structured.
The custom event architecture (`invicta:vat-toggle`, `invicta:cart:added`) is modern
and decoupled. This is a codebase that was *trying* to be good — it just grew faster
than its architecture could support.

**The verdict:** This is not a teardown. This is a disciplined refactor.

---

## Table of Contents

1. [Architecture Classification](#1-architecture-classification)
2. [The "Spaghetti" Factor — Global Dependencies](#2-the-spaghetti-factor--global-dependencies)
3. [B2B / Trade Logic Analysis](#3-b2b--trade-logic-analysis)
4. [Performance Audit](#4-performance-audit)
5. [Zombie Code & Anomalies](#5-zombie-code--anomalies)
6. [Inline CSS/JS Debt](#6-inline-cssjs-debt)
7. [The Red Flags List](#7-the-red-flags-list)
8. [Refactoring Roadmap](#8-refactoring-roadmap)
9. [Branching Strategy](#9-branching-strategy)
10. [Appendix: File Inventory](#10-appendix-file-inventory)

---

## 1. Architecture Classification

### Verdict: **Hybrid / "Frankenstein" (95% OS 2.0)**

| Indicator | Count | Assessment |
|-----------|-------|------------|
| `templates/*.json` | 47 | Modern OS 2.0 |
| `templates/*.liquid` | 2 | Legacy (`gift_card.liquid`, `page.offline.liquid`) |
| `templates/customers/*.json` | 7 | Modern OS 2.0 |
| Section groups (`.json`) | 2 | `header-group.json`, `footer-group.json` |
| Sections (`.liquid`) | 94 | Extensive custom layer |
| Snippets (`.liquid`) | 62 | Modular component library |

**Evidence:**
- All primary routes (index, product, collection, cart, blog, article, search, customer/*) use JSON templates.
- Only `gift_card.liquid` and `page.offline.liquid` remain as Liquid templates — both are edge cases that Shopify still commonly ships as `.liquid`.
- Section groups for header/footer are properly configured.
- The `blocks/` directory contains a single AI-generated block (`ai_gen_block_b568045.liquid`) — evidence of Shopify's theme editor AI being used ad-hoc.

**Custom template sprawl (concern):**
- **11 local SEO page templates** (`page.local-seo-ashford.json` through `page.local-seo-whitstable.json`) — each is a near-duplicate JSON template for a different Kent town. These should be consolidated into a single `page.local-seo.json` template driven by metafields or section data.
- **4 brand page templates** (`page.brand-dewalt.json`, `page.brand-makita.json`, etc.) — same pattern. One template, different data.
- **Multiple product category pages** (`page.power-tools.json`, `page.hand-tools.json`, `page.fixings-fasteners.json`, etc.) — consolidatable.

**Template count could drop from ~47 to ~20** with a metafield-driven approach, making the theme dramatically easier to maintain.

---

## 2. The "Spaghetti" Factor — Global Dependencies

### `layout/theme.liquid` — 533 lines

**What loads in the `<head>` (every page, every visit):**

| Asset | Type | Load | Concern |
|-------|------|------|---------|
| `gtagSendEvent()` inline function | JS | **Render-blocking** | 15-line sync script in `<head>` before anything else. Calls `gtag()` which may not exist yet. |
| `invicta-cart-handler` snippet | JS | Render-blocking (inline `<script>` via snippet) | Class-based cart handler injected into `<head>`. Contains `fetch()` calls — should be deferred. |
| `invicta-css-variables` snippet | CSS | Inline `<style>` | 190 lines of design tokens. Acceptable as critical CSS but large. |
| `constants.js` | JS | `defer` | OK |
| `pubsub.js` | JS | `defer` | OK |
| `global.js` | JS | `defer` | OK |
| `details-disclosure.js` | JS | `defer` | OK |
| `details-modal.js` | JS | `defer` | OK |
| `search-form.js` | JS | `defer` | OK |
| `animations.js` | JS | `defer` (conditional) | OK — only loads if `settings.animations_reveal_on_scroll` |
| `base.css` | CSS | **Render-blocking** `<link>` | Foundation styles — necessary but should be audited for dead rules |
| `invicta-card.css` | CSS | **Render-blocking** `<link>` | Card component styles loaded on every page, even pages with no product cards |
| `invicta-brand-pill.css` | CSS | **Render-blocking** `<link>` | Brand pill badge styles — every page |
| `invicta-radius-reset.css` | CSS | **Render-blocking** `<link>` | A file that exists solely to reset border-radius — loaded globally |
| `inv-product-card.css` | CSS | **Render-blocking** `<link>` | Product card styles — every page including blog, about, contact |
| `mobile.css` / `desktop.css` | CSS | Media-query split | Good practice. Also preloaded. |
| `component-cart-items.css` | CSS | Lazy (`print` → `all` onload) | Good practice |
| Cart drawer CSS (5 files) | CSS | Conditional on `settings.cart_type == 'drawer'` | Acceptable |
| `pwa-head` snippet | Meta + JS | Inline | PWA registration — render-blocking service worker script in `<head>` |

**What loads before `</body>` (every page):**

| Asset | Type | Load | Concern |
|-------|------|------|---------|
| `invicta-brand-pill.js` | JS | `defer` | Brand badge component — loaded on every page |
| `predictive-search.js` | JS | `defer` (conditional) | OK |
| `cart-drawer.js` | JS | `defer` (conditional) | OK |
| `invicta-quick-add.js` | JS | `defer` | Quick-add component — loaded on every page |
| `invicta-vat-toggle.js` | JS | `defer` | VAT toggle — needed site-wide, acceptable |
| `invicta-quantity-enhancer.js` | JS | `defer` | Quantity input enhancer — loaded on every page |

### Global CSS Verdict

**5 render-blocking CSS files** are loaded on every page that are only relevant to
product listing and product card contexts:

1. `invicta-card.css`
2. `invicta-brand-pill.css`
3. `invicta-radius-reset.css`
4. `inv-product-card.css`
5. `base.css` (partially — contains rules for components not on every page)

**Impact:** On a blog post, contact page, or search results page with no products,
these files still block rendering. For a trade customer on 4G loading the homepage,
every unnecessary kilobyte matters.

### What's Missing (Good Signs)

- No jQuery
- No Lodash / Underscore
- No Bootstrap / Tailwind CDN
- No old tracking pixels (Facebook/TikTok/etc.) in the theme — presumably managed via Shopify's native pixel system or Google Tag Manager
- No external font CDN calls (uses Shopify's `fonts.shopifycdn.com`)

---

## 3. B2B / Trade Logic Analysis

### VAT Handling — Hardcoded But Consistent

The UK 20% VAT rate is calculated in **three separate files** using the same formula:

```liquid
# Integer-safe rounding: times: 100 | plus: 60 | divided_by: 120
assign price_ex_vat = price | times: 100 | plus: 60 | divided_by: 120
```

**Files containing VAT calculation logic:**

| File | Method | Notes |
|------|--------|-------|
| `snippets/invicta-product-card.liquid:39` | Liquid integer math | Card-level ex-VAT price |
| `sections/invicta-product-v2.liquid:122` | Liquid integer math | PDP-level ex-VAT price |
| `sections/invicta-product-v2.liquid:1389` | JavaScript `Math.round(price * 100 / 120)` | Dynamic variant switching |
| `snippets/cart-breakdown.liquid:21` | Liquid `divided_by: 1.2` | Cart totals — **uses different formula** (floating point, not integer-safe) |

**Red Flag:** `cart-breakdown.liquid` uses `divided_by: 1.2` (floating point) while
the product card and PDP use the integer-safe `times: 100 | plus: 60 | divided_by: 120`
formula. This can produce penny-rounding discrepancies between the cart and the product page.

**Assessment:** VAT rate is hardcoded as `120` (the divisor) and `1.2` in four places.
If the UK VAT rate changes (it has changed before — from 17.5% to 20% in 2011), every
file must be manually updated. This should be a **single theme setting or snippet variable**.

### VAT Toggle System — Well-Architected

The VAT toggle (`assets/invicta-vat-toggle.js`) is the **best-architected piece of the
codebase:**

- Persists preference to `localStorage` under key `invicta-vat-mode`
- Dispatches `invicta:vat-toggle` custom event with `{ detail: { mode: 'inc' | 'ex' } }`
- Uses delegated click handlers on `[data-vat-btn]` elements
- Supports multiple CSS class conventions for hiding (`inv-pdp__price-row--hidden`, `is-hidden`)
- Exposes a public API: `window.InvictaVAT.getMode()`, `window.InvictaVAT.setMode()`
- Pushes to `dataLayer` for Google Analytics tracking

**However:** The multiple hidden class conventions (`inv-pdp__price-row--hidden`,
`inv-pdp__price-view--hidden`, `is-hidden`) suggest the system was bolt-on retrofitted
to different page types rather than designed once. A single `.vat-hidden` utility class
would be cleaner.

### Free Shipping Threshold — Hardcoded in Multiple Files

The `£30` / `3000` pence free delivery threshold appears in:

| File | Location |
|------|----------|
| `snippets/invicta-free-delivery-bar.liquid:19` | `assign threshold_pence = 3000` |
| `snippets/cart-breakdown.liquid:31` | `assign free_shipping_threshold = 3000` |
| Multiple template JSON files | Text content: "free delivery over £30" |

**Assessment:** Should be a single theme setting (`settings_schema.json`) referenced everywhere.

### Trade Account Logic — **Marketing Only, Not Functional**

Search results for `customer.tags` and `customer.metafields`: **zero matches in any Liquid file.**

The "Trade" branding is extensive across the site:
- `sections/trade-landing.liquid` — A conversion landing page for Google Ads
- `sections/trade-thank-you.liquid` — Post-registration thank you page
- `templates/page.trade-landing.json` and `templates/page.thank-you-trade.json`
- Config: `settings_schema.json` theme name is literally `"Trade"`
- `snippets/meta-tags.liquid:20` — noindexes trade pages

**But there is no logic anywhere that:**
- Checks `customer.tags` for a "trade" or "wholesale" tag
- Shows different pricing to logged-in trade customers
- Applies automatic trade discounts
- Restricts B2B features behind authentication

**Assessment:** The trade system is **marketing theatre** — it collects leads via the
trade landing page form but does not differentiate pricing or functionality. Real B2B
would require `customer.tags`-based conditional rendering and Shopify's B2B pricing
features or a Shopify Function for automatic discounts.

### Tiered / Volume Pricing — Clean Implementation

- `snippets/tiered-pricing.liquid` — Uses Shopify's native `variant.quantity_price_breaks` with a metafield fallback (`custom.bulk_pricing`)
- `snippets/consumables-pricing.liquid` — Pack size pricing via `custom.pack_pricing` metafield (supports JSON and simple string formats)
- `snippets/min-order-qty.liquid` — Minimum order quantity via `custom.min_qty` metafield

**Assessment:** This is the cleanest part of the B2B logic. Proper use of native Shopify
features with metafield fallbacks. The only concern is that each snippet embeds its own
`<style>` and `<script>` blocks (see section 6).

### Kit Builder — Clever But Vendor-Locked

`snippets/kit-builder.liquid` (1,182 lines) is a "build your own kit" experience for
power tools (battery + charger + case). It's brand-aware (Makita/DeWalt) and pulls
from specific collections.

**Concerns:**
- Hardcoded brand detection: `if vendor_down == 'makita'` / `if vendor_down == 'dewalt'`
- Hardcoded collection handles: `collections['makita-18v-batteries']`, `collections['dewalt-18v-chargers']`
- If a third brand is added (Milwaukee, HiKoki), the entire file needs manual extension
- All CSS and JS is inlined (1,182 lines in a single snippet)

### Quote Request System — Good

`snippets/quote-modal.liquid` — Clean modal with proper accessibility (`aria-modal`,
`aria-labelledby`, escape-to-close, focus management). Posts to Shopify's contact form
with hidden fields for product context. No issues.

---

## 4. Performance Audit

### Critical Path Analysis (First Contentful Paint)

For a trade customer on 4G (typical: 5-12 Mbps, 50-100ms latency):

**Render-blocking chain:**
1. `invicta-css-variables` inline style (190 lines) — unavoidable, design tokens
2. Dawn's CSS variables inline style (300+ lines) — unavoidable, theme settings
3. `base.css` — external render-blocking stylesheet
4. `invicta-card.css` — external render-blocking stylesheet
5. `invicta-brand-pill.css` — external render-blocking stylesheet
6. `invicta-radius-reset.css` — external render-blocking stylesheet
7. `inv-product-card.css` — external render-blocking stylesheet
8. `mobile.css` or `desktop.css` — media-query conditional (good)

**That's 5 unnecessary render-blocking CSS requests** on non-product pages. Each
CSS file requires a full HTTP round-trip even over HTTP/2 due to the render-blocking
nature of `<link rel="stylesheet">`.

### Monster Files (Largest Sections)

| File | Lines | Bytes | Concern |
|------|-------|-------|---------|
| `sections/main-search.liquid` | 2,280 | 66.9 KB | Inlines full filter UI, grid, pagination, and all CSS/JS |
| `sections/invicta-product-v2.liquid` | 1,829 | 65.3 KB | Full PDP with gallery, pricing, specs, trust panel, and all JS |
| `sections/invicta-collection-filters.liquid` | 1,802 | 54.3 KB | Full collection filter system with AJAX |
| `sections/invicta-product-grid.liquid` | — | 40.5 KB | Product grid for collection pages |
| `snippets/kit-builder.liquid` | 1,182 | 35.6 KB | Kit builder with all CSS/JS inline |
| `sections/invicta-collection.liquid` | — | 34.3 KB | Collection page section |
| `sections/main-cart-items.liquid` | — | 34.0 KB | Cart items display |
| `sections/invicta-recently-viewed.liquid` | — | 33.3 KB | Recently viewed products |
| `sections/featured-collection.liquid` | — | 32.0 KB | Featured collection on homepage |
| `snippets/facets.liquid` | 932 | 48.1 KB | Faceted navigation component |
| `snippets/invicta-brand-pill.liquid` | — | 20.1 KB | Brand logo pill badge — giant `if/elsif` chain |

### The Brand Pill Problem

`snippets/invicta-brand-pill.liquid` is a 500+ line `if/elsif` chain that normalises
vendor names to brand keys:

```liquid
if vendor_clean contains 'dewalt'
  assign brand_key = 'dewalt'
elsif vendor_clean contains 'makita'
  assign brand_key = 'makita'
elsif vendor_clean contains 'milwaukee'
  assign brand_key = 'milwaukee'
...
```

This renders on **every product card on every collection page**. With 24+ products per
page, that's 24 executions of a 500-line snippet. If the brand list grows, the file
grows linearly.

**Better approach:** A lookup metafield on the product (`custom.brand_key`) or a simple
hash map via `assign brand_map` with Liquid's `map` filter.

### Locale Bloat

**27 languages** are shipped in the `locales/` directory totalling **~2.5 MB**. Invicta
Tools is a UK-based hardware merchant. Only `en.default.json` is needed.

The other 55 locale files (`bg.json`, `cs.json`, `da.json`, `de.json`, `el.json`, ...,
`zh-TW.json`, `zh-TW.schema.json`) are Dawn defaults that should have been stripped on
theme export. They don't affect page load (Shopify only loads the active locale) but they:

- Bloat the repo by 2.5 MB
- Create noise in file searches and diffs
- May confuse future developers into thinking i18n is supported

---

## 5. Zombie Code & Anomalies

### Files Flagged for Review

| File | Issue | Action |
|------|-------|--------|
| `assets/invicta-brand-pill` (no extension) | 188-byte HTML/CSS file with no extension. Related `.js`, `.css`, and `.liquid` versions exist. | **Delete** — orphaned fragment |
| `assets/evostik.svg` + `assets/evostick.svg` | Two SVGs for the same brand (Evo-Stik). One is likely a typo. | **Verify correct spelling, delete duplicate** |
| `blocks/ai_gen_block_b568045.liquid` | AI-generated responsive banner block with random hash ID. No documentation. | **Review** — determine if in active use or was an experiment |
| `sections/featured-collection-v2.liquid` | "v2" variant alongside `featured-collection.liquid` | **Audit** — determine which is active in templates, retire the other |
| `sections/invicta-product-v2.liquid` | "v2" alongside `featured-product.liquid` (Dawn default) | **Audit** — the v2 is clearly the active custom PDP, but the original Dawn section still exists |
| `sections/invicta-usp-strip-v2.liquid` | "v2" alongside `invicta-usp-bar.liquid` | **Audit** — same pattern |

### Duplicate / Overlapping Components

| Component | Files | Issue |
|-----------|-------|-------|
| Product cards | `snippets/invicta-product-card.liquid`, `snippets/card-product.liquid` | Two competing product card snippets — which is canonical? |
| Trust bar | `snippets/invicta-trust-bar.liquid`, `sections/invicta-trust-bar.liquid` | Snippet AND section for same component |
| Cart drawer | `snippets/cart-drawer.liquid`, `sections/cart-drawer.liquid` | Snippet AND section — section renders the snippet |
| Newsletter | `sections/invicta-newsletter.liquid`, `sections/newsletter.liquid` | Two newsletter sections |
| USP bar | `sections/invicta-usp-bar.liquid`, `sections/invicta-usp-strip-v2.liquid` | Two USP bar variants |

### No Classic Zombie Files Found

No files with suffixes like `-backup`, `-old`, `-copy`, `-bak`, `-unused`, `-temp`, or
`-original`. The repo is relatively clean of obvious backup files — the debt is
structural, not archaeological.

---

## 6. Inline CSS/JS Debt

This is the codebase's biggest hidden problem. **24 snippets** and **34 sections** embed
`<style>` and/or `<script>` blocks directly in their Liquid files.

### Snippets with Inline `<style>` or `<script>`

| Snippet | Inline `<style>` + `<script>` Count |
|---------|-------------------------------------|
| `facets.liquid` | 1 |
| `kit-builder.liquid` | 2 |
| `mega-dropdown-menu.liquid` | 3 |
| `cart-drawer.liquid` | 3 |
| `invicta-delivery-estimate.liquid` | 2 |
| `invicta-free-delivery-bar.liquid` | 2 |
| `min-order-qty.liquid` | 2 |
| `quote-modal.liquid` | 2 |
| `tiered-pricing.liquid` | 2 |
| `consumables-pricing.liquid` | 1 |
| `invicta-product-card.liquid` | 0 (correctly externalised to `inv-product-card.css`) |
| ...and 13 more | 1 each |

**Total: ~35 inline `<style>`/`<script>` occurrences across snippets alone.**

### Why This Matters

1. **No caching:** Inline styles/scripts are re-downloaded with every page. A separate
   `.css`/`.js` file is cached by the browser.
2. **No minification:** Shopify minifies `.css` and `.js` asset files automatically.
   Inline code gets zero optimization.
3. **CSP conflicts:** Inline scripts may conflict with Content Security Policy headers
   if CSP is ever tightened.
4. **Duplicate rendering:** If a snippet renders 24 times (e.g., product cards on a
   collection page), and it contains `<style>`, that CSS is injected 24 times. The
   `invicta-product-card.liquid` v7.7 changelog literally says *"P1.3: Removed CSS
   injection per card (now loaded once in theme.liquid)"* — this fix was applied to
   product cards but not to other snippets.

---

## 7. The Red Flags List

Ordered by severity (business impact × effort to fix):

### P0 — Critical (Fix Immediately)

| # | Issue | File(s) | Impact |
|---|-------|---------|--------|
| P0.1 | **Render-blocking inline JS in `<head>`** — `gtagSendEvent()` and `invicta-cart-handler` snippet inject synchronous JavaScript before any CSS loads | `layout/theme.liquid:19-35`, `snippets/invicta-cart-handler.liquid` | Delays First Contentful Paint on every page load |
| P0.2 | **VAT calculation inconsistency** — `cart-breakdown.liquid` uses `divided_by: 1.2` (float) while product card/PDP use integer-safe `times: 100 \| plus: 60 \| divided_by: 120` | `snippets/cart-breakdown.liquid:21` vs `snippets/invicta-product-card.liquid:39` | Potential penny-rounding errors at checkout — trust killer for trade customers |
| P0.3 | **PWA service worker registered in `<head>` with inline script** | `snippets/pwa-head.liquid:71-139` | Render-blocking 60-line script on every page. SW registration should be deferred. |

### P1 — High (Fix This Sprint)

| # | Issue | File(s) | Impact |
|---|-------|---------|--------|
| P1.1 | **5 render-blocking CSS files loaded globally** that are only needed on product listing pages | `layout/theme.liquid:347-350` (`invicta-card.css`, `invicta-brand-pill.css`, `invicta-radius-reset.css`, `inv-product-card.css`) | ~15-25 KB of unnecessary CSS blocking render on blog, contact, about pages |
| P1.2 | **VAT rate hardcoded in 4 separate files** | See section 3 | If VAT rate changes, 4 files need manual updates. One will be missed. |
| P1.3 | **Free shipping threshold hardcoded in 2+ files** | `invicta-free-delivery-bar.liquid`, `cart-breakdown.liquid` | Same risk as VAT — business rule buried in code instead of settings |
| P1.4 | **Monster files** exceeding 1,500 lines | `main-search.liquid` (2,280), `invicta-product-v2.liquid` (1,829), `invicta-collection-filters.liquid` (1,802), `kit-builder.liquid` (1,182) | Unmaintainable. One bug fix in `main-search.liquid` means reviewing 2,280 lines. |
| P1.5 | **Brand pill 500-line if/elsif chain** executes per product card (24× on collection pages) | `snippets/invicta-brand-pill.liquid` | O(n×m) complexity where n = products, m = brands. Will only get worse. |

### P2 — Medium (Fix This Month)

| # | Issue | File(s) | Impact |
|---|-------|---------|--------|
| P2.1 | **Template sprawl** — 11 near-duplicate local SEO templates, 4 brand templates | `templates/page.local-seo-*.json`, `templates/page.brand-*.json` | Maintenance burden — changing the local SEO layout means editing 11 files |
| P2.2 | **35 inline `<style>`/`<script>` blocks** across snippets | See section 6 | Uncacheable, unminified, potentially duplicated per render |
| P2.3 | **Duplicate/overlapping components** — 2 product cards, 2 trust bars, 2 newsletter sections, 2 USP bars | See section 5 | Confusion about which is canonical; both may be loading |
| P2.4 | **27 unused locale files** (~2.5 MB) | `locales/*.json` (all except `en.default.*`) | Repo bloat, developer confusion |
| P2.5 | **No `customer.tags` trade logic** — trade accounts are marketing-only | Entire codebase | The theme is called "Trade" but has no trade pricing differentiation |

### P3 — Low (Backlog)

| # | Issue | File(s) | Impact |
|---|-------|---------|--------|
| P3.1 | Extension-less asset file | `assets/invicta-brand-pill` | Minor cleanup |
| P3.2 | Duplicate brand SVG | `assets/evostik.svg` + `assets/evostick.svg` | Minor cleanup |
| P3.3 | AI-generated block with no documentation | `blocks/ai_gen_block_b568045.liquid` | Maintenance confusion |
| P3.4 | Kit builder hardcoded to 2 brands | `snippets/kit-builder.liquid` | Won't scale to Milwaukee/HiKoki |
| P3.5 | Multiple hidden class conventions for VAT toggle | `assets/invicta-vat-toggle.js:99` | Technical debt — 3 class names where 1 would do |

---

## 8. Refactoring Roadmap

### Priority 1: Performance — Global CSS/JS Cleanup

**The single most critical file:** `layout/theme.liquid`

**Why:** Every byte in `theme.liquid`'s `<head>` affects every page load for every
customer. The compounding effect is enormous.

**Actions:**

1. **Move `gtagSendEvent()` to a deferred script** or remove it (Google's own docs
   now recommend using `gtag()` event callback directly).
2. **Move `invicta-cart-handler` from `<head>` to before `</body>`** — it uses
   `fetch()` and DOM manipulation, neither of which need to be in `<head>`.
3. **Move PWA service worker registration to deferred script** — wrap the registration
   in a `requestIdleCallback` or at minimum move from `<head>` to before `</body>`.
4. **Convert 4 globally-loaded CSS files to lazy-loaded:**
   ```html
   <!-- BEFORE: render-blocking -->
   {{ 'invicta-card.css' | asset_url | stylesheet_tag }}

   <!-- AFTER: non-blocking -->
   <link rel="stylesheet" href="{{ 'invicta-card.css' | asset_url }}" media="print" onload="this.media='all'">
   ```
5. **Delete or merge `invicta-radius-reset.css`** into `base.css` — a file that exists
   solely to reset border-radius should not be a separate HTTP request.

**Estimated impact:** 200-400ms improvement in First Contentful Paint on 4G connections.

### Priority 2: Quick Win — Centralise Business Constants

**Low effort, high impact.** Create a single snippet that defines all business constants:

```liquid
{% comment %}
  snippets/invicta-config.liquid — Single source of truth
{% endcomment %}
{%- liquid
  # VAT
  assign inv_vat_rate = 20
  assign inv_vat_divisor = 120
  assign inv_vat_multiplier = 1.2

  # Shipping
  assign inv_free_shipping_pence = 3000

  # Delivery
  assign inv_delivery_cutoff_hour = 14
-%}
```

Then reference it everywhere:
```liquid
{% render 'invicta-config' %}
assign price_ex_vat = price | times: 100 | plus: 60 | divided_by: inv_vat_divisor
```

**Time to implement:** 1-2 hours. **Risk eliminated:** VAT rate change disaster.

### Priority 3: Template Consolidation

Replace 11 `page.local-seo-*.json` templates with a single `page.local-seo.json`
template that uses section settings or metaobjects for town-specific data. Same approach
for brand pages.

### Priority 4: Inline CSS/JS Extraction

For each snippet/section with inline `<style>`/`<script>`:
1. Extract CSS to `assets/component-{name}.css`
2. Extract JS to `assets/component-{name}.js`
3. Load CSS conditionally: `{{ 'component-{name}.css' | asset_url | stylesheet_tag }}`
4. Load JS with `defer`: `<script src="{{ 'component-{name}.js' | asset_url }}" defer></script>`

**Start with the biggest offenders:** `kit-builder` (1,182 lines), `facets` (932 lines),
`mega-dropdown-menu`, `tiered-pricing`, `quote-modal`.

### Priority 5: Monster File Decomposition

Break down the 2,000+ line sections into composable sub-sections and snippets:

- `main-search.liquid` → extract filter UI to `snippets/search-filters.liquid`, grid to
  `snippets/search-grid.liquid`, styles to `assets/search-page.css`
- `invicta-product-v2.liquid` → extract gallery to `snippets/pdp-gallery.liquid`, pricing
  to `snippets/pdp-pricing.liquid`, trust panel to `snippets/pdp-trust.liquid`
- `invicta-collection-filters.liquid` → extract filter row rendering to
  `snippets/collection-filter-row.liquid`

### Priority 6: Dead Code Cleanup

1. Delete unused locale files (keep only `en.default.json` and `en.default.schema.json`)
2. Delete `assets/invicta-brand-pill` (extension-less orphan)
3. Resolve `evostik.svg` vs `evostick.svg` duplicate
4. Audit `featured-product.liquid` vs `invicta-product-v2.liquid` — retire the unused one
5. Audit `card-product.liquid` vs `invicta-product-card.liquid` — retire the unused one
6. Audit `newsletter.liquid` vs `invicta-newsletter.liquid` — retire the unused one

### Priority 7: Real B2B Implementation (Future)

When the business is ready for actual trade pricing:
1. Tag trade customers with `customer.tags` containing `"trade"` or `"b2b"`
2. Use conditional Liquid: `{% if customer.tags contains 'trade' %}` to show trade pricing
3. Implement Shopify B2B catalogs or Shopify Functions for automatic discounts
4. Consider Shopify's native B2B features (company accounts, quantity rules, volume pricing)

---

## 9. Branching Strategy

### Naming Convention

```
{type}/{area}-{description}
```

**Types:**
- `fix/` — Bug fixes (`fix/vat-rounding-cart-breakdown`)
- `refactor/` — Code restructuring, no behaviour change (`refactor/theme-liquid-css-loading`)
- `feature/` — New functionality (`feature/trade-customer-pricing`)
- `perf/` — Performance improvements (`perf/lazy-load-global-css`)
- `cleanup/` — Dead code removal (`cleanup/remove-unused-locales`)
- `docs/` — Documentation only (`docs/add-audit-report`)

### Recommended Branch Flow

```
main (production)
  └── develop (staging)
        ├── perf/theme-liquid-head-cleanup        ← Priority 1
        ├── fix/centralise-vat-constants           ← Priority 2
        ├── refactor/consolidate-local-seo-templates ← Priority 3
        ├── perf/extract-inline-css-js             ← Priority 4
        ├── refactor/decompose-monster-sections    ← Priority 5
        ├── cleanup/remove-dead-code               ← Priority 6
        └── feature/trade-customer-pricing         ← Priority 7 (future)
```

### PR Discipline

- Every PR must reference a Priority number from this audit (e.g., "Addresses P0.1")
- No PR should touch more than 1 Priority unless the changes are tightly coupled
- Every PR must include before/after evidence (Lighthouse scores, file sizes, line counts)

---

## 10. Appendix: File Inventory

### Directory Sizes

| Directory | Files | Size | Notes |
|-----------|-------|------|-------|
| `assets/` | 251 | 3.2 MB | 35 JS, 79 CSS, 118 SVG, 15 PNG, 2 other |
| `locales/` | 56 | 2.5 MB | 27 languages — only English needed |
| `sections/` | 96 | 1.3 MB | 94 `.liquid` + 2 `.json` groups |
| `snippets/` | 62 | 417 KB | All `.liquid` |
| `templates/` | 49 | 234 KB | 47 `.json` + 2 `.liquid` |
| `config/` | 2 | 54 KB | `settings_schema.json`, `settings_data.json` |
| `layout/` | 2 | 44 KB | `theme.liquid`, `password.liquid` |
| `blocks/` | 1 | 15 KB | AI-generated block |
| **Total** | **519** | **~7.9 MB** | |

### Asset Breakdown

| Type | Count | Purpose |
|------|-------|---------|
| `.svg` (brand logos) | 31 | Brand identity pills in product cards |
| `.svg` (icons) | 80 | UI icons (cart, search, social, product attributes) |
| `.svg` (utility) | 7 | Backgrounds, spinners, placeholders |
| `.css` (component) | 37 | `component-*.css` — Dawn component styles |
| `.css` (section) | 12 | `section-*.css` — Dawn section styles |
| `.css` (invicta custom) | 11 | `inv-*.css`, `invicta-*.css` — Custom styles |
| `.css` (other) | 19 | `base.css`, `desktop.css`, `mobile.css`, etc. |
| `.js` (core) | 12 | Dawn core (`global.js`, `pubsub.js`, etc.) |
| `.js` (invicta custom) | 7 | `invicta-*.js` — Custom functionality |
| `.js` (other) | 16 | Product forms, search, cart, etc. |
| `.png` (PWA) | 15 | App icons + splash screens |

### Key Custom Metafields Referenced

| Namespace.Key | Type | Used In |
|---------------|------|---------|
| `custom.bulk_pricing` | String/JSON | `tiered-pricing.liquid` |
| `custom.pack_pricing` | String/JSON | `consumables-pricing.liquid` |
| `custom.min_qty` | Number | `min-order-qty.liquid` |
| `custom.range` | List (single-line text) | `invicta-collection-filters.liquid` |
| `custom.stocked` | Boolean | `invicta-collection-filters.liquid` |
| `custom.voltage` | String | `invicta-product-v2.liquid` |
| `custom.max_torque` | String | `invicta-product-v2.liquid` |
| `custom.motor_type` | String | `invicta-product-v2.liquid` |
| `custom.features` | String (CSV) | `invicta-product-v2.liquid` |

---

*This document should be kept as a living reference and updated as each Priority
item is addressed. Each PR should update the relevant section with a completion date
and link to the merged PR.*
