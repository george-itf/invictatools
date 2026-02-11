# Invicta Tools Theme Developer Guide

> Shopify Trade 15.4.0 — Customised for Invicta Tools & Fixings Ltd

## Naming Conventions

### Sections (`sections/`)

| Prefix | Purpose | Examples |
|--------|---------|---------|
| `invicta-` | Custom Invicta business features | `invicta-product-v2`, `invicta-collection-filters` |
| `main-` | Core Shopify template sections | `main-cart-items`, `main-search`, `main-404` |
| `brand-` | Brand/supplier landing page sections | `brand-hero`, `brand-categories` |
| `header-` | Header layout section | `header-invicta` |
| No prefix | Core Shopify standard sections | `featured-collection`, `announcement-bar`, `footer` |

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
| `section-` | Section-specific styles | `section-footer.css`, `section-main-search.css` |
| `template-` | Template-wide styles | `template-collection.css` |
| No prefix | Core / base files | `base.css`, `global.js`, `cart.js` |

### CSS Classes

| Prefix | Scope | Examples |
|--------|-------|---------|
| `inv-` | Invicta custom components | `.inv-card__title`, `.inv-del-est__row` |
| `inv-pdp--` | Product detail page | `.inv-pdp--hidden`, `.inv-pdp__row` |
| `invicta-` | Broader Invicta layouts | `.invicta-cart-breakdown`, `.invicta-header` |

### CSS Custom Properties

| Prefix | Scope | Examples |
|--------|-------|---------|
| `--inv-` | Invicta brand/component tokens | `--inv-brand-red`, `--inv-stock-in` |
| `--pdp-` | Product detail page | `--pdp-bg`, `--pdp-border` |
| `--color-` | Shopify theme settings | `--color-button`, `--color-foreground` |

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
| `invicta-css-variables` (v2.0) | `theme.liquid` | Global CSS custom property definitions |
| `invicta-cart-handler` | `theme.liquid` | AJAX cart operations |
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

- **VAT Toggle**: `invicta-vat-toggle.js` + `[data-price-inc-container]`/`[data-price-ex-container]` pattern
- **Tiered Pricing**: `snippets/tiered-pricing.liquid` using `quantity_price_breaks`
- **Quick Order**: `sections/bulk-quick-order-list.liquid`
- **Minimum Order Qty**: `snippets/min-order-qty.liquid` via metafields
- **Consumables Pricing**: `snippets/consumables-pricing.liquid`
- **Trade Account**: `customer.tags contains 'trade'` checks
- **Free Shipping**: Threshold from `settings.inv_free_shipping_pence`
- **VAT Rate**: Centralised at `settings.inv_vat_rate` (integer, e.g. 20)

---

## CSS Architecture

```
base.css              → Core foundations (3700+ lines)
desktop.css           → Desktop-specific overrides
mobile.css            → Mobile-specific overrides
invicta-product-card.css → Product card component
invicta-product-v2.css   → PDP styles
invicta-brand-pill.css   → Brand pill component
invicta-radius-reset.css → Sharp corner overrides
component-*.css       → Lazy-loaded component styles
section-*.css         → Lazy-loaded section styles
```

Global CSS loads in `theme.liquid`. Component/section CSS loads on demand via `{{ 'file.css' | asset_url | stylesheet_tag }}` at the bottom of each snippet/section.
