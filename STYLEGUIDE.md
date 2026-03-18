# INVICTA TOOLS SHOPIFY THEME — STYLE GUIDE
**Last updated: 18 March 2026 | Theme version: Trade 15.4.0 | Token system: v3.0**

This is the single source of truth for every convention in this codebase. Read this before making any changes.

---

## 1. GOLDEN RULES

1. **Use the token system.** Every colour, shadow, radius, z-index, and spacing value has a CSS custom property in `assets/invicta-css-variables.css`. Use it. Never hardcode hex values, pixel shadows, or z-index numbers.
2. **Prefix everything.** All custom classes use `inv-` prefix. All custom Liquid variables use `inv_` prefix. All custom events use `invicta:` prefix. All translation keys use `invicta.` prefix.
3. **No frameworks.** Vanilla JS only. No jQuery, no React, no Tailwind. IIFEs with `'use strict'`.
4. **Mobile first.** Base styles are mobile. Larger breakpoints progressively enhance.
5. **Accessibility is not optional.** Every interactive element needs keyboard support, focus indicators, and ARIA attributes.
6. **Match existing patterns.** Before writing new code, find the closest existing pattern and follow it exactly.

---

## 2. CSS

### 2.1 Naming

BEM with `inv-` prefix: `.inv-block__element--modifier`

```
.inv-card                     Block
.inv-card__title              Element
.inv-card__price--sale        Modifier
.inv-card__btn--add           Element + Modifier
```

Component prefixes in use: `inv-card`, `inv-search`, `inv-compare`, `inv-product`, `inv-collection`, `inv-hero`, `inv-btn`, `inv-badge`, `inv-price`. Legacy components use `invicta-` (e.g., `invicta-header`, `invicta-brand-pill`).

Never create unprefixed classes. Never create utility classes (.flex, .mb-4, etc.).

### 2.2 Colours

Every colour comes from a token. The mapping:

| Use case | Token |
|----------|-------|
| Brand red (CTAs, links) | `--inv-accent` |
| Brand red hover | `--inv-accent-hover` |
| Primary text | `--inv-fg` |
| Bold/heading text | `--inv-fg-strong` |
| Secondary text | `--inv-fg-secondary` |
| Muted/meta text | `--inv-fg-muted` |
| Subtle/placeholder text | `--inv-fg-subtle` |
| White backgrounds/text | `--inv-white` (alias for `--inv-bg-elevated`) |
| Page background | `--inv-bg` |
| Card background | `--inv-bg-elevated` |
| Soft background | `--inv-bg-soft` |
| Primary border | `--inv-border` |
| Darker border | `--inv-border-dark` |
| In stock | `--inv-success` family |
| Low stock | `--inv-warning` family |
| Out of stock | `--inv-fg-muted` on `--inv-bg-soft` |
| Supplier stock | `--inv-info` family |
| Error states | `--inv-error` family |

### 2.3 Z-Index

Ten levels. Use the token. Never a raw number above 10.

```
--inv-z-base: 0              Normal flow
--inv-z-dropdown: 100        Dropdown menus
--inv-z-sticky: 500          Sticky elements
--inv-z-header: 999          Main header
--inv-z-overlay: 1000        Overlays, backdrops
--inv-z-drawer: 2000         Side drawers
--inv-z-search-dropdown: 9999 Search results
--inv-z-modal: 10000         Modals, dialogs
--inv-z-search-active: 99999 Full-page search
--inv-z-toast: 100000        Toast notifications
```

Local stacking (z-index: 1, 2) within a component is fine without tokens.

### 2.4 Spacing

Base unit is 4px. Use multiples.

```
--inv-space-xs: 4px     --inv-space-md: 16px    --inv-space-2xl: 48px
--inv-space-sm: 8px     --inv-space-lg: 24px    --inv-space-3xl: 64px
--inv-space-sm-plus: 12px  --inv-space-xl: 32px
```

Page gutters: `--inv-page-gutter: 1.5rem` (mobile), `--inv-page-gutter-desktop: 3rem` (desktop). Container max-width: `--inv-container: 1400px`.

### 2.5 Shadows

Seven levels, no more:

```
--inv-shadow-sm           Subtle (inputs)
--inv-shadow-card         Product cards
--inv-shadow-md           Hover states
--inv-shadow-elevated     Dropdowns, popovers
--inv-shadow-lg           Drawers
--inv-shadow-soft         Hero images
--inv-shadow-xl           Modals
```

### 2.6 Border Radius

Buttons, cards, and inputs are square (radius 0). This is intentional. The canonical radius for rounded elements is 8px (`--inv-radius-md`). Modals use 12px (`--inv-radius-lg`). Pills use 999px (`--inv-radius-pill`).

### 2.7 Breakpoints

```
Mobile:   0 - 749px        (base styles, no query needed)
Tablet:   750px - 989px     @media (min-width: 750px)
Desktop:  990px+            @media (min-width: 990px)
```

Mobile-first. Base styles target mobile. Layer up with min-width queries. Separate files exist: `base.css` (shared), `mobile.css` (max-width: 749px overrides), `desktop.css` (min-width: 750px).

### 2.8 Transitions

```
--inv-duration-fast: 100ms       Colour changes, borders
--inv-duration-normal: 150ms     Most interactions
--inv-duration-moderate: 200ms   Transforms
--inv-duration-slow: 300ms       Drawers, modals
```

Default easing is `ease`. Always include `@media (prefers-reduced-motion: reduce)` that disables animation.

### 2.9 Overriding Shopify Base Theme

Increase specificity with `html.js body` prefix. Never use `!important`.

```css
/* DO */
html.js body .header__icon--cart { background: var(--inv-dark); }

/* DON'T */
.header__icon--cart { background: var(--inv-dark) !important; }
```

### 2.10 Data Attributes

Use `data-*` for JS hooks. Never style on data attributes. Use them for state storage and element selection only.

```html
<span data-price-inc>£35.99</span>
<span data-price-ex class="inv-vat--hidden">£29.99</span>
<button data-compare-toggle data-product-handle="makita-dhp486z">
<div data-stock="low">
```

### 2.11 File Organisation

```
invicta-css-variables.css    Tokens (load first)
base.css                     Foundation
desktop.css                  Desktop (media="min-width:750px")
mobile.css                   Mobile (media="max-width:749px")
component-*.css              Reusable components
section-*.css                Section-specific
invicta-*.css                Feature-specific
invicta-print.css            Print only (media="print")
```

### 2.12 Print

All print rules live in `invicta-print.css`, loaded with `media="print"`. Hide all interactive elements (nav, footer, cart drawer, search, comparison badge/drawer, buttons). Show content at full width with black text on white. Include "Invicta Tools" branding and page URL. Use `page-break-inside: avoid` on cards and tables.

---

## 3. JAVASCRIPT

### 3.1 Module Structure

Every Invicta JS file follows:

```javascript
(function() {
  'use strict';
  const DEBUG = false;

  // Private state and functions
  function init() { /* ... */ }

  // Public API (if needed)
  window.ModuleName = { /* ... */ };

  // Two-tier initialisation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

All scripts loaded with `defer`. No `async`. No ES modules (CSP constraints).

### 3.2 File Header

```javascript
/**
 * Invicta [Feature Name] - [One-line description]
 * ================================================
 * [Feature bullets]
 *
 * Usage: [How to call/use]
 * @version X.Y.Z
 */
```

### 3.3 Events

Two systems coexist. Use the right one:

**CustomEvent (for cross-feature communication):**

```javascript
document.dispatchEvent(new CustomEvent('invicta:cart:updated', {
  detail: { source: 'cart-api', item: data }
}));
```

Event names in use: `invicta:cart:updated`, `invicta:cart:error`, `invicta:cart:count-updated`, `invicta:vat-toggle`, `invicta:compare:updated`, `invicta:collection:updated`, `cart:item-added`, `cart:refresh`.

**Pub/Sub (for internal Shopify component communication):**

```javascript
subscribe(PUB_SUB_EVENTS.cartUpdate, callback);
publish(PUB_SUB_EVENTS.cartUpdate, data);
```

Events defined in `constants.js`: `cartUpdate`, `quantityUpdate`, `optionValueSelectionChange`, `variantChange`, `cartError`.

Rule: Invicta features use CustomEvent. Shopify base components use pub/sub.

### 3.4 Global Objects

| Object | Purpose | File |
|--------|---------|------|
| `window.invictaConfig` | Theme config (VAT rate, trade customer flag) | Set by Liquid in theme.liquid |
| `window.invictaVat` | VAT calculation utility | invicta-vat-utils.js |
| `window.InvictaCartAPI` | Add-to-cart, cart count | invicta-cart-api.js |
| `window.InvictaVAT` | VAT toggle state | invicta-vat-toggle.js |
| `window.invictaCompareStrings` | Comparison i18n strings | Set by Liquid in invicta-comparison.liquid |
| `window.InvictaAnnouncer` | Screen reader announcements | invicta-cx-improvements.js |

### 3.5 Fetch Pattern

All network requests use AbortController with timeout:

```javascript
function fetchWithTimeout(url, options, timeoutMs) {
  var controller = new AbortController();
  var id = setTimeout(function() { controller.abort(); }, timeoutMs || 8000);
  return fetch(url, Object.assign({}, options, { signal: controller.signal }))
    .finally(function() { clearTimeout(id); });
}
```

Timeouts: 8s for browse operations (search, recently viewed, comparison). 10s for cart operations.

Handle AbortError specifically in catch blocks. Fire `invicta:cart:error` for cart timeouts.

### 3.6 VAT Calculation (JS)

Always use the centralised utility:

```javascript
var pence = Math.round(parseFloat(variant.price) * 100);
var exVatPence = window.invictaVat.exFromInc(pence);
var display = '£' + window.invictaVat.formatPounds(exVatPence);
```

Never calculate VAT divisor inline. Never do `* 100 * 100`. Shopify API returns price as a decimal string (e.g., "12.50"), so convert to pence first with `Math.round(parseFloat(price) * 100)`.

### 3.7 State Management

| Pattern | When to use | Example |
|---------|-------------|---------|
| localStorage | User preferences persisting across sessions | VAT mode, comparison list |
| sessionStorage | Session-only cache | Product data, recent searches |
| CSS classes | Visual state | `.inv-vat--hidden`, `.inv-card__btn--loading` |
| aria-* attributes | Accessibility state | `aria-pressed`, `aria-expanded` |
| In-memory objects | Transient feature state | Search cache Map, modal open/close |

Always wrap localStorage/sessionStorage in try/catch (fails in private browsing).

### 3.8 DOM Patterns

Event delegation over direct binding:

```javascript
document.addEventListener('click', function(e) {
  var btn = e.target.closest('[data-add-to-cart]');
  if (!btn) return;
  e.preventDefault();
  handleAddToCart(btn);
});
```

Use `createElement` + `textContent` for user-supplied data. `innerHTML` is acceptable for trusted template strings from Shopify. Always escape attributes with `escapeAttr()`.

### 3.9 Debug Logging

```javascript
const DEBUG = false;
DEBUG && console.log('[ModuleName] message');
if (DEBUG) console.error('[ModuleName] Error:', err);
```

Every Invicta JS file has a DEBUG constant at the top, set to `false` in production. Every console statement is guarded.

### 3.10 Accessibility in JS

Focus traps for modals/drawers (save previousFocus, trap Tab, restore on close). Keyboard navigation (ArrowUp/Down for lists, Enter to select, Escape to close). ARIA attribute management (`aria-pressed`, `aria-expanded`, `aria-selected`, `aria-activedescendant`). Live region announcements via `InvictaAnnouncer.announce()`.

### 3.11 Naming

Variables: `camelCase` (variantId, priceInPence). Constants: `UPPER_CASE` (STORAGE_KEY, MAX_PRODUCTS, DEBOUNCE_MS). Private functions: `_underscore` prefix. Files: `invicta-{feature}.js` (kebab-case).

---

## 4. LIQUID

### 4.1 File Headers

```liquid
{% comment %}
  ============================================================
  INVICTA [COMPONENT NAME] v[X.Y] ([PATCH NOTES])
  ============================================================
  [Description]

  Updates in v[X.Y]:
  - Change 1
  - Change 2

  Trade 15.4.0 Compatible
  Usage: {% render '[snippet-name]', param: value %}
  ============================================================
{% endcomment %}
```

Version in format `vX.Y` with optional patch note in parentheses (e.g., `v7.7 (P1.3 FIX)`).

### 4.2 Snippets

Always `{% render %}`, never `{% include %}`. Pass all dependencies as explicit parameters:

```liquid
{% render 'invicta-product-card',
    product: product,
    card_index: forloop.index
%}
```

Defaults inside the snippet use pipe chaining:

```liquid
assign brand_pill_type = brand_pill_type | default: 'pill'
```

### 4.3 Variable Naming

| Prefix | Use | Example |
|--------|-----|---------|
| `inv_` | Custom calculated values | `inv_vat_rate`, `inv_vat_divisor`, `inv_best_pb` |
| `has_` | Boolean flags | `has_multiple_variants` |
| `is_` | Boolean flags | `is_supplier_stock`, `is_brand` |
| `current_` | Current context | `current_variant`, `current_sort` |
| `*_url` | URL strings | `product_url`, `pill_url` |

Never shadow Shopify globals (product, collection, cart, variant, shop, page, section, forloop, settings, customer, template).

### 4.4 Section Schema

Group settings under `"type": "header"` blocks. Use `"type": "range"` for numbers (always include min, max, step, default, unit). Include `"info"` tooltips on non-obvious settings. One preset per section with all critical defaults populated.

Settings that control text content should use `"type": "text"` or `"type": "textarea"`. Multi-line text uses `| newline_to_br` in the template.

### 4.5 Translation Keys

Namespace: `invicta.[feature].[key_name]`

```
invicta.product.stock_in_stock
invicta.product.add_to_cart
invicta.compare.max_message
invicta.cart.subtotal_ex_vat
invicta.delivery_bar.remaining_html
```

Use `_html` suffix only when the value contains HTML markup. Fallback pattern:

```liquid
{{ 'invicta.product.select_options' | t | default: 'Select Options' }}
```

When passing translations to JS, use `| t | json` to safely escape:

```liquid
<script>
  window.invictaCompareStrings = {
    maxMessage: {{ 'invicta.compare.max_message' | t | json }}
  };
</script>
```

### 4.6 VAT Calculation (Liquid)

```liquid
assign inv_vat_rate = settings.inv_vat_rate | default: 20
assign inv_vat_divisor = 100 | plus: inv_vat_rate
assign inv_vat_rounding = inv_vat_divisor | divided_by: 2
assign price_ex_vat = price | times: 100 | plus: inv_vat_rounding | divided_by: inv_vat_divisor
```

Integer-safe rounding. No floating point. All Shopify prices are in pence.

### 4.7 Stock Detection

Tag-based system. Products tagged with source: `invicta-stock`, `trend-stock`, `toolbank-stock`, `timco-stock`, `pdp-stock`. Brand tags: `brand-makita`, `brand-dewalt`, etc.

Detection runs in a single tag loop. Status values: `in-stock` (default), `low` (1-5 units), `supplier` (non-Invicta stock), `out` (unavailable). If no stock tag found, defaults to `invicta` source.

### 4.8 Asset Loading

```liquid
{{ 'file.css' | asset_url | stylesheet_tag }}
<script src="{{ 'file.js' | asset_url }}" defer></script>
<link rel="stylesheet" href="{{ 'file.css' | asset_url }}" media="print">
```

Conditional loading wraps in `{%- if section.settings.feature_enabled -%}`. When a feature is disabled, load a minimal `<style>` block that hides its UI elements.

### 4.9 Conditionals

Prefer `if/else` over `unless` for clarity. Use `unless` only for simple single-condition negations:

```liquid
{%- unless card_index <= 4 -%}loading="lazy"{%- endunless -%}
```

For complex logic, always `if`:

```liquid
{%- if available == false -%}
  <!-- out of stock -->
{%- endif -%}
```

### 4.10 Edge Cases to Handle

Every product card/PDP must handle: no image (SVG placeholder), no brand (skip pill), out of stock (notify button), single variant (direct ATC), multi-variant (link to PDP), no price breaks (render nothing), unavailable variant (check `available` before price display).

---

## 5. FILE STRUCTURE

```
layout/
  theme.liquid               Master layout, global CSS/JS loading
  password.liquid             Password page layout

sections/
  header-invicta.liquid       Header with search, VAT toggle, mobile drawer
  invicta-footer.liquid        Footer with settings-based addresses
  invicta-product-v2.liquid    Product page
  invicta-collection.liquid    Collection page
  invicta-comparison.liquid    Comparison feature
  invicta-*.liquid             All custom sections (22 total)
  header-group.json            Header section group
  footer-group.json            Footer section group

snippets/
  invicta-product-card.liquid  Product card (used everywhere)
  invicta-brand-pill.liquid    Brand logo/text rendering
  invicta-free-delivery-bar.liquid  Cart threshold progress
  invicta-delivery-estimate.liquid  Delivery countdown
  schema-jsonld.liquid         Structured data
  meta-tags.liquid             OG/Twitter/noindex
  cart-breakdown.liquid        Cart VAT breakdown
  invicta-css-variables.liquid CSS token wrapper

assets/
  invicta-css-variables.css    Design tokens (LOAD FIRST)
  base.css                     Foundation
  desktop.css / mobile.css     Responsive
  invicta-*.css                Feature CSS
  invicta-*.js                 Feature JS
  invicta-vat-utils.js         Centralised VAT math
  invicta-print.css            Print styles

templates/
  product.json                 PDP layout
  collection.json              Collection layout
  page.brand.json              Brand landing template
  *.json                       All other templates

locales/
  en.default.json              English translations

config/
  settings_schema.json         Theme settings
  settings_data.json           Setting values
```

---

## 6. DO / DON'T

### CSS

| DO | DON'T |
|----|-------|
| `color: var(--inv-fg-muted)` | `color: #6b7280` |
| `z-index: var(--inv-z-modal)` | `z-index: 10000` |
| `.inv-card__title` | `.card-title` or `.title` |
| `html.js body .shopify-class { }` | `.shopify-class { ... !important }` |
| `@media (min-width: 750px) { }` | `@media (max-width: 749px) { }` for base |
| Include `prefers-reduced-motion` | Animations without motion query |
| `transition: transform 150ms ease` | `transition: all 0.5s` |

### JavaScript

| DO | DON'T |
|----|-------|
| `fetchWithTimeout(url, {}, 8000)` | `fetch(url)` with no timeout |
| `window.invictaVat.exFromInc(pence)` | `Math.round(price * 100 / 120)` inline |
| `DEBUG && console.log(...)` | `console.log(...)` unguarded |
| `e.target.closest('[data-action]')` | `document.getElementById('btn').onclick` |
| `new CustomEvent('invicta:feature:event')` | `new Event('featureEvent')` |
| `try { localStorage.setItem(...) } catch(e) {}` | `localStorage.setItem(...)` bare |
| IIFE with `'use strict'` | Global function declarations |

### Liquid

| DO | DON'T |
|----|-------|
| `{% render 'snippet', param: value %}` | `{% include 'snippet' %}` |
| `assign inv_vat_rate = settings.inv_vat_rate` | `assign vat = 20` hardcoded |
| `{{ 'invicta.product.add_to_cart' \| t }}` | `Add to Cart` hardcoded in template |
| `{{ string \| t \| json }}` for JS injection | `'{{ string \| t }}'` unescaped |
| `data-quantity="{{ default_qty }}"` | `data-quantity="1"` always |
| `assign has_variants = true` | `assign hv = true` |

---

## 7. ADDING NEW FEATURES

When adding a new feature, follow this checklist:

1. **CSS file:** Create `assets/invicta-{feature}.css`. Use `inv-{feature}__` BEM prefix. Use tokens for all colours, shadows, z-index, spacing.
2. **JS file:** Create `assets/invicta-{feature}.js`. IIFE with `'use strict'`. DEBUG constant. `fetchWithTimeout` for any network calls. Expose public API on `window` if needed.
3. **Section:** Create `sections/invicta-{feature}.liquid`. Include schema with proper headers, defaults, and info text. Load CSS and JS conditionally based on enable toggle.
4. **Translations:** Add keys to `locales/en.default.json` under `invicta.{feature}.*`. Pass to JS via `window.invicta{Feature}Strings` using `| t | json`.
5. **Accessibility:** Keyboard navigation, focus trap (if modal/drawer), ARIA attributes, screen reader announcements.
6. **Print:** Add hide rules to `invicta-print.css` for any interactive elements.
7. **Mobile:** Test at 375px width. Touch targets minimum 44px. No horizontal scroll unless explicitly designed.

---

## 8. KEY FILES TO READ FIRST

If you're new to this codebase, read these in order:

1. `assets/invicta-css-variables.css` (the entire token system)
2. `snippets/invicta-product-card.liquid` (the core reusable component)
3. `assets/invicta-cart-api.js` (the fetch/event/error pattern)
4. `layout/theme.liquid` (how everything loads)
5. `snippets/invicta-brand-pill.liquid` (the brand detection system)
6. `locales/en.default.json` (translation structure)
