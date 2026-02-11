# Invicta Tools Theme Developer Guide

> Shopify Trade 15.4.0 — Customised for Invicta Tools & Fixings Ltd

## Naming Conventions

### Sections (`sections/`)

| Prefix | Purpose | Examples |
|--------|---------|---------|
| `invicta-` | Custom Invicta business features | `invicta-product-v2`, `invicta-footer`, `invicta-faq` |
| `main-` | Core Shopify template sections | `main-cart-items`, `main-search`, `main-404` |
| `brand-` | Brand/supplier landing page sections | `brand-hero`, `brand-categories` |
| `header-` | Header layout section | `header-invicta` |
| No prefix | Core Shopify standard sections | `featured-collection`, `announcement-bar`, `predictive-search` |

### Snippets (`snippets/`)

| Prefix | Purpose | Examples |
|--------|---------|---------|
| `invicta-` | Custom Invicta components | `invicta-product-card`, `invicta-trust-bar` |
| `icon-` | SVG icon components | `icon-cart`, `icon-account` |
| No prefix | Shopify standard / utility snippets | `price`, `pagination`, `facets` |

### Assets (`assets/`)

| Prefix | Purpose | Examples |
|--------|---------|---------|
| `invicta-` | Custom Invicta CSS/JS | `invicta-product-card.css`, `invicta-vat-toggle.js` |
| `component-` | Reusable component styles | `component-trust-bar.css`, `component-cart-breakdown.css` |
| `section-` | Section-specific styles | `section-trade-landing.css`, `section-header-invicta.css` |
| `template-` | Template-wide styles | `template-collection.css` |
| No prefix | Core / base files | `base.css`, `global.js`, `cart.js` |

### CSS Classes

| Prefix | Scope | Examples |
|--------|-------|---------|
| `inv-` | Invicta custom components | `.inv-card__title`, `.inv-del-est__row` |
| `inv-pdp--` | Product detail page | `.inv-pdp--hidden`, `.inv-pdp__row` |
| `inv-vat--` | VAT toggle visibility | `.inv-vat--hidden`, `.inv-vat--inc`, `.inv-vat--ex` |
| `invicta-` | Broader Invicta layouts | `.invicta-cart-breakdown`, `.invicta-header` |

### CSS Custom Properties

| Prefix | Scope | Examples |
|--------|-------|---------|
| `--inv-` | Invicta brand/component tokens | `--inv-accent`, `--inv-radius-card`, `--inv-space-md` |
| `--pdp-` | Product detail page | `--pdp-bg`, `--pdp-border` |
| `--color-` | Shopify theme settings | `--color-button`, `--color-foreground` |

> **Rule:** All `--inv-*` tokens are defined ONLY in `assets/invicta-css-variables.css` (v3.0). No other file should define `:root` custom properties in the `--inv-*` namespace.

---

## Design Tokens (v3.0)

All design tokens live in `assets/invicta-css-variables.css`. Loaded via `snippets/invicta-css-variables.liquid` in `theme.liquid`.

| Category | Key Tokens |
|----------|-----------|
| Brand colours | `--inv-accent` (#e11d26), `--inv-accent-hover`, `--inv-success`, `--inv-error` |
| Backgrounds | `--inv-bg`, `--inv-bg-elevated`, `--inv-bg-soft`, `--inv-bg-muted` |
| Text | `--inv-fg`, `--inv-fg-muted`, `--inv-fg-subtle` |
| Borders | `--inv-border`, `--inv-border-subtle`, `--inv-border-strong` |
| Radius | `--inv-radius-sm` (4px), `--inv-radius-md` (8px), `--inv-radius-lg` (12px), `--inv-radius-pill` |
| Component radii | `--inv-radius-button` (8px), `--inv-radius-card` (8px), `--inv-radius-input` (8px) |
| Spacing | `--inv-space-xs` through `--inv-space-3xl` |
| Layout | `--inv-page-width`, `--inv-container`, `--inv-page-gutter` |
| Mobile | `--inv-mobile-gutter`, `--inv-mobile-section-gap`, `--inv-touch-target-min` |
| Z-index | `--inv-z-dropdown` through `--inv-z-toast` |
| Duration | `--inv-duration-fast` through `--inv-duration-slowest` |

---

## Active Section Map

### Homepage (`index.json`)
| Order | Section | Purpose |
|-------|---------|---------|
| 1 | `invicta-hero-split` | Hero banner with split layout |
| 2 | `invicta-quick-cats` | Quick category navigation grid |
| 3 | `invicta-usp-strip-v2` | USP/trust strip |
| 4 | `featured-collection` | Featured product collection (x2) |
| 5 | `invicta-brand-strip` | Brand logo carousel |
| 6 | `review-carousel` | Customer reviews |
| 7 | `invicta-trust-bar` | Trust/confidence bar |
| 8 | `invicta-newsletter` | Newsletter signup |

### Product Page (`product.json`)
| Section | Purpose |
|---------|---------|
| `invicta-product-v2` | Main PDP (v3.0) — pricing, variants, gallery, trust |
| `invicta-product-qa` | Product Q&A |
| `invicta-recently-viewed` | Recently viewed products |

### Collection Page (`collection.json`)
| Section | Purpose |
|---------|---------|
| `invicta-collection-filters` | Sidebar filters with AJAX |
| `invicta-product-grid` | Product grid (v3.0) — grid/list toggle |

### Cart (`cart.json`)
| Section | Purpose |
|---------|---------|
| `main-cart-items` | Cart line items with breakdown |
| `main-cart-footer` | Cart totals and checkout CTA |
| `featured-collection` | Cross-sell products |

### Footer (`footer-group.json`)
| Section | Purpose |
|---------|---------|
| `invicta-footer` | Full-width footer with columns, newsletter, trust logos |

### Information Pages
| Template | Section | Purpose |
|----------|---------|---------|
| `page.faq.json` | `invicta-faq` | Searchable FAQ with categorised accordion |
| `page.delivery-info.json` | `invicta-delivery-info` | Delivery methods, areas, tracking |
| `page.returns.json` | `invicta-returns` | Returns process, exceptions, warranty |

### Other Active Sections
| Template | Section(s) |
|----------|-----------|
| `search.json` | `main-search` |
| `page.json` | `main-page` |
| `blog.json` | `main-blog` |
| `article.json` | `main-article` |
| `404.json` | `main-404` |
| `page.trade-landing.json` | `trade-landing` |
| `page.brand.json` | `brand-hero`, `brand-about`, `brand-categories`, `featured-collection` |
| `page.shop-by-brand.json` | `invicta-category-grid` |
| `page.contact.json` | `image-banner`, `contact-form` |

---

## Deprecated Sections (Do Not Use)

| Section | Replacement | Reason |
|---------|-------------|--------|
| `invicta-collection-grid` | `invicta-product-grid` | Duplicate functionality |
| `main-collection-product-grid` | `invicta-product-grid` | Duplicate functionality |
| `brand-featured-products` | `featured-collection` | Duplicate functionality |
| `invicta-announcement-bar` | `announcement-bar` (core) | Duplicate functionality |
| `invicta-popular-categories` | `invicta-category-grid` or `invicta-quick-cats` | Duplicate functionality |

---

## Key Snippets Reference

| Snippet | Used By | Purpose |
|---------|---------|---------|
| `invicta-product-card` (v7.7) | Product grids, collections, featured | Standard product card |
| `invicta-trust-bar` (v2.0) | PDP, cart, homepage | Trust/confidence strip |
| `invicta-delivery-estimate` (v1.0) | PDP, cart drawer | Delivery day estimate with countdown |
| `invicta-free-delivery-bar` | Cart, cart drawer | Free shipping progress bar |
| `invicta-brand-pill` | Product cards, PDP | Brand/vendor label pill |
| `invicta-css-variables` (v3.0) | `theme.liquid` | Global CSS design tokens |
| `invicta-cart-handler` | `theme.liquid` | AJAX cart operations |
| `cart-drawer` | `theme.liquid` | Cart drawer (when `cart_type = drawer`) |
| `cart-notification` | `theme.liquid` | Cart notification popup |
| `cart-breakdown` | Cart page | Itemised VAT/subtotal/shipping breakdown |
| `tiered-pricing` | PDP | Volume/tiered pricing table |
| `consumables-pricing` | PDP | Consumables pack pricing |
| `min-order-qty` | PDP | Minimum order quantity display |

---

## Translation Keys

All custom strings use the `invicta.*` namespace in `locales/en.default.json`:

| Namespace | Coverage |
|-----------|----------|
| `invicta.trust_bar.*` | Trust bar labels |
| `invicta.delivery.*` | Delivery estimate strings |
| `invicta.delivery_bar.*` | Free shipping progress |
| `invicta.cart.*` | Cart breakdown labels |
| `invicta.product.*` | Stock labels, buttons |
| `invicta.header.*` | Header UI strings |
| `invicta.pricing.*` | VAT/pricing labels |
| `invicta.sections.*` | Section-specific strings |

---

## B2B/Trade Features

These features are critical business logic — preserve when making changes:

- **VAT Toggle**: `invicta-vat-toggle.js` v5.0 — canonical markup contract:
  - Price elements: `[data-price-inc]` / `[data-price-ex]` with `.inv-vat--hidden`
  - Toggle buttons: `[data-vat-toggle]` with `aria-pressed`
  - Storage: `localStorage` key `invicta-vat-mode` ('inc' | 'ex')
  - Event: `invicta:vat-toggle` with `{ detail: { mode } }`
  - API: `window.InvictaVAT.getMode()` / `.setMode(mode)`
- **Tiered Pricing**: `snippets/tiered-pricing.liquid` using `quantity_price_breaks`
- **Quick Order**: `sections/bulk-quick-order-list.liquid`
- **Minimum Order Qty**: `snippets/min-order-qty.liquid` via metafields
- **Consumables Pricing**: `snippets/consumables-pricing.liquid`
- **Trade Account**: `customer.tags contains 'trade'` checks
- **Free Shipping**: Threshold from `settings.inv_free_shipping_pence`
- **VAT Rate**: Centralised at `settings.inv_vat_rate` (integer, e.g. 20)

---

## Cart Architecture

The theme supports three cart modes via `settings.cart_type`:

| Mode | Behaviour | Key Files |
|------|-----------|-----------|
| `drawer` | Slide-out cart drawer | `cart-drawer.js`, `snippets/cart-drawer.liquid`, `component-cart-drawer.css` |
| `notification` | Toast notification on add (default) | `cart-notification.js`, `snippets/cart-notification.liquid`, `component-cart-notification.css` |
| `page` | Redirect to `/cart` page | `cart.js`, `sections/main-cart-items.liquid` |

Detection in `product-form.js`: checks for `<cart-notification>` or `<cart-drawer>` element; falls back to page redirect.

---

## CSS Architecture

```
invicta-css-variables.css   → Design tokens v3.0 (THE canonical layer)
base.css                    → Core foundations (Trade 15.4.0)
desktop.css                 → Desktop-specific overrides
mobile.css                  → Mobile-specific overrides
invicta-ux-improvements.css → UX enhancements (container, focus, skip-link)
invicta-radius-reset.css    → Global border-radius enforcement
invicta-product-card.css    → Product card component
invicta-product-v2.css      → PDP styles
section-*.css               → Section-specific styles (lazy-loaded)
component-*.css             → Component styles (lazy-loaded)
```

Global CSS loads in `theme.liquid`. Component/section CSS loads on demand via `{{ 'file.css' | asset_url | stylesheet_tag }}` at the bottom of each snippet/section.

### JSON Templates

All `.json` templates and section groups use strict JSON — no comment headers. The Shopify theme editor may regenerate these files at any time.
