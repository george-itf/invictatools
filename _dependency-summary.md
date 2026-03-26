# Theme Dependency Map Summary
Generated: 2026-03-13

## Overview
- **Total files:** 437 (excluding 9 root markdown files from previous audits)
- **Sections:** 91 (89 .liquid + 2 .json section groups)
- **Snippets:** 31
- **Templates:** 55 (48 root + 7 customer)
- **Assets:** 245 (76 CSS, 36 JS, 103 SVG, 15 PNG, 1 ICO, 1 webmanifest)
- **Config:** 2
- **Layout:** 2
- **Locales:** 2

---

## 1. Files with Zero Inbound References (Potential Dead Weight)

### Sections Not Referenced by Any Template, Section Group, Config, or JS
These sections exist but have no inbound references. Some may be available via the Shopify theme editor.

| Section | Likely Status | Notes |
|---------|--------------|-------|
| `sections/apps.liquid` | **Shopify system** | Required by Shopify for app blocks — KEEP |
| `sections/brand-connectors.liquid` | **Potentially dead** | Not used in any template |
| `sections/brand-logos.liquid` | **Potentially dead** | Not used in any template |
| `sections/collage.liquid` | **Theme editor section** | Available via theme editor, may be in use on custom pages |
| `sections/collapsible-content.liquid` | **Theme editor section** | Available via theme editor (FAQ-style accordions) |
| `sections/collection-list.liquid` | **Theme editor section** | Available via theme editor |
| `sections/custom-liquid.liquid` | **Theme editor section** | Available via theme editor for custom code blocks |
| `sections/image-with-text.liquid` | **Theme editor section** | Available via theme editor |
| `sections/invicta-collection-filters.liquid` | **Functionally active** | Part of the collection filtering system — loaded alongside invicta-collection |
| `sections/invicta-collection-hero.liquid` | **Potentially dead** | Not used in any template |
| `sections/invicta-hero-promos.liquid` | **Potentially dead** | Not used in any template |
| `sections/invicta-product-qa.liquid` | **Potentially dead** | Not used in any template |
| `sections/invicta-product-reviews.liquid` | **Potentially dead** | Not used in any template |
| `sections/invicta-quote-request.liquid` | **Potentially dead** | Not used in any template |
| `sections/multicolumn.liquid` | **Theme editor section** | Available via theme editor |
| `sections/multirow.liquid` | **Theme editor section** | Available via theme editor |
| `sections/page.liquid` | **Theme editor section** | Generic page section, available via theme editor |
| `sections/pickup-availability.liquid` | **Shopify system** | Used for pickup availability display — KEEP |
| `sections/related-products.liquid` | **Potentially dead** | Shopify default section; invicta-related-products.liquid is used instead |
| `sections/rich-text.liquid` | **Theme editor section** | Available via theme editor |
| `sections/slideshow.liquid` | **Theme editor section** | Available via theme editor |
| `sections/video.liquid` | **Theme editor section** | Available via theme editor |

### CSS Files with No References
| File | Notes |
|------|-------|
| `assets/component-collection-hero.css` | No section loads this. invicta-collection-hero section has no CSS ref. |
| `assets/component-facets.css` | Not referenced anywhere. Likely from Dawn's default facets system. |
| `assets/quick-add.css` | Not referenced. The theme uses invicta-quick-add.js instead. |
| `assets/template-collection.css` | Not referenced. Collection pages use section-invicta-collection.css. |

### JS Files with No References
| File | Notes |
|------|-------|
| `assets/quick-add.js` | Superseded by invicta-quick-add.js |
| `assets/recipient-form.js` | Dawn gift card feature — not used in this theme |
| `assets/service-worker.js` | PWA service worker — pwa-head snippet was removed, so this is orphaned |
| `assets/show-more.js` | Dawn "show more" widget — not referenced anywhere |

### SVG Files with No Direct or Dynamic References
| File | Notes |
|------|-------|
| `assets/icon-3d-model.svg` | Dawn 3D model viewer icon — not used |
| `assets/icon-account.svg` | Not used (header uses inline SVG for account icon) |
| `assets/icon-close-small.svg` | Not used (icon-close.svg is used instead) |
| `assets/icon-filter.svg` | Not used (filtering uses different approach) |
| `assets/icon-hamburger.svg` | Not used (header uses different mobile menu icon) |
| `assets/icon-inventory-status.svg` | Not used |
| `assets/pdp.svg` | Unknown purpose — not referenced anywhere |
| `assets/placeholder-image.svg` | Not referenced (Shopify uses its own placeholder system) |
| `assets/square.svg` | Unknown purpose — not referenced anywhere |
| `assets/tools-icons.svg` | Unknown purpose — not referenced anywhere |

### PNG Files — ALL Unreferenced from Theme Code
All 15 PNG files were part of the PWA implementation whose `pwa-head` snippet has been removed:
- `pwa-icon-72.png`, `pwa-icon-96.png`, `pwa-icon-128.png`, `pwa-icon-144.png`
- `pwa-icon-167.png`, `pwa-icon-180.png` (not even in the webmanifest)
- `pwa-icon-192.png`, `pwa-icon-192-maskable.png`
- `pwa-icon-384-maskable.png`
- `pwa-icon-512.png`, `pwa-icon-512-maskable.png`
- `splash-1170x2532.png`, `splash-1179x2556.png`, `splash-2048x2732.png`, `splash-750x1334.png`

### Other Unreferenced Assets
| File | Notes |
|------|-------|
| `assets/favicon.ico` | Not used — favicon comes from theme settings via `settings.favicon` |
| `assets/manifest.webmanifest` | Not referenced from any liquid file — orphaned with PWA removal |

---

## 2. Dynamic References (Cannot Be Statically Resolved)

| Location | Code Pattern | Resolves To | Notes |
|----------|-------------|-------------|-------|
| `snippets/invicta-brand-pill.liquid:273` | `brand_key \| append: '.svg' \| asset_url` | `{brand}.svg` | References brand logo SVGs dynamically |
| `snippets/invicta-brand-hero.liquid:26` | `brand_handle \| append: '.svg' \| asset_url` | `{brand}.svg` | References brand logo SVGs dynamically |
| `snippets/invicta-brand-hero.liquid:27` | `brand_handle \| append: '-wide.svg' \| asset_url` | `{brand}-wide.svg` | **No wide SVGs exist in assets** |
| `snippets/icon-accordion.liquid:2` | `icon \| replace: '_', '-' \| prepend: 'icon-' \| append: '.svg'` | `icon-{name}.svg` | 43 possible icons from collapsible-content schema |
| `assets/global.js:1207` | `this.dataset.sectionId` in fetch URL | Dynamic section ID | Product recommendations section |
| `assets/quick-order-list.js:181` | `this.dataset.section` in fetch URL | Dynamic section ID | Quick order list's own section |
| `assets/invicta-collection-filters.js:23` | `container.dataset.sectionId` | Dynamic section ID | Collection filter section |

### Brand SVGs (referenced dynamically via brand-pill and brand-hero snippets)
bahco.svg, bosch.svg, ct1.svg, dewalt.svg, dormer.svg, einhell.svg, everbuild.svg, evostik.svg, faithfull.svg, fiskars.svg, gorilla.svg, hikoki.svg, irwin.svg, kamtec.svg, lamello.svg, makita.svg, metabo.svg, milwaukee.svg, paslode.svg, siroflex.svg, sitetuff.svg, soudal.svg, spit.svg, stanley.svg, starrett.svg, tengtools.svg, timco.svg

### Accordion Icon SVGs (referenced dynamically via icon-accordion snippet)
icon-apple.svg, icon-banana.svg, icon-bottle.svg, icon-box.svg, icon-carrot.svg, icon-chat-bubble.svg, icon-check-mark.svg, icon-clipboard.svg, icon-dairy.svg, icon-dairy-free.svg, icon-dryer.svg, icon-eye.svg, icon-fire.svg, icon-gluten-free.svg, icon-heart.svg, icon-iron.svg, icon-leaf.svg, icon-leather.svg, icon-lightning-bolt.svg, icon-lipstick.svg, icon-lock.svg, icon-map-pin.svg, icon-nut-free.svg, icon-pants.svg, icon-paw-print.svg, icon-pepper.svg, icon-perfume.svg, icon-plane.svg, icon-plant.svg, icon-price-tag.svg, icon-question-mark.svg, icon-recycle.svg, icon-return.svg, icon-ruler.svg, icon-serving-dish.svg, icon-shirt.svg, icon-shoe.svg, icon-silhouette.svg, icon-snowflake.svg, icon-star.svg, icon-stopwatch.svg, icon-truck.svg, icon-washing.svg

---

## 3. Full Dependency Chains for Key Pages

### Homepage (`templates/index.json`)
```
layout/theme.liquid (entry point)
├── snippets/meta-tags.liquid
├── snippets/invicta-css-variables.liquid → assets/invicta-css-variables.css
├── snippets/cart-drawer.liquid → assets/invicta-cart.css, assets/cart.js, ...
│   ├── snippets/card-collection.liquid
│   ├── snippets/loading-spinner.liquid → assets/loading-spinner.svg
│   ├── snippets/unit-price.liquid
│   ├── snippets/invicta-free-delivery-bar.liquid → assets/component-free-delivery-bar.css, .js
│   ├── snippets/invicta-delivery-estimate.liquid → assets/component-delivery-estimate.css, .js
│   ├── snippets/cart-breakdown.liquid → assets/component-cart-breakdown.css
│   └── snippets/invicta-trust-bar.liquid → assets/component-trust-bar.css
├── snippets/invicta-cart-handler.liquid → assets/invicta-cart-handler.js
├── snippets/schema-jsonld.liquid
├── [16 CSS files loaded globally]
├── [16 JS files loaded globally]
│
├── sections/header-group.json
│   ├── sections/announcement-bar.liquid → assets/component-slideshow.css, component-slider.css, component-list-social.css
│   │   └── snippets/social-icons.liquid, country-localization.liquid, language-localization.liquid
│   ├── sections/header-invicta.liquid → assets/section-header-invicta.css
│   │   └── snippets/predictive-search-inline.liquid → assets/invicta-predictive-search.css, .js
│   └── sections/invicta-simple-nav.liquid
│
├── sections/invicta-hero-split.liquid
├── sections/invicta-promo-banners.liquid
├── sections/invicta-quick-cats.liquid
├── sections/invicta-usp-strip-v2.liquid
├── sections/invicta-brand-strip.liquid → assets/invicta-brand-pill.css
│   └── snippets/invicta-brand-pill.liquid → {brand}.svg (dynamic)
├── sections/featured-collection.liquid (x3) → assets/invicta-product-card.css (already loaded globally)
│   └── snippets/invicta-product-card.liquid
│       └── snippets/invicta-brand-pill.liquid
├── sections/invicta-trade-cta.liquid
├── sections/invicta-trust-bar.liquid
├── sections/review-carousel.liquid
├── sections/invicta-recently-viewed.liquid → assets/invicta-recently-viewed.js
├── sections/invicta-newsletter.liquid
│
├── sections/footer-group.json
│   ├── sections/invicta-footer.liquid
│   └── sections/footer.liquid → assets/section-footer.css, component-newsletter.css, component-list-menu.css, component-list-social.css
│       └── snippets/social-icons.liquid, country-localization.liquid, language-localization.liquid
```

### Product Page (`templates/product.json`)
```
layout/theme.liquid (+ all global CSS/JS/snippets as above)
│
├── sections/invicta-product-v2.liquid
│   ├── assets/invicta-product-v2.css, invicta-product-v2-trust.css, section-invicta-product-v2.css
│   ├── assets/component-tiered-pricing.css, component-tiered-pricing.js
│   ├── assets/invicta-product-v2.js
│   ├── snippets/invicta-brand-pill.liquid → {brand}.svg (dynamic)
│   └── snippets/invicta-delivery-estimate.liquid → assets/component-delivery-estimate.css, .js
│
├── sections/invicta-related-products.liquid → assets/invicta-related-products.css
│   └── snippets/invicta-product-card.liquid
│       └── snippets/invicta-brand-pill.liquid
│
└── sections/invicta-recently-viewed.liquid → assets/invicta-recently-viewed.js

JS dynamic loads: cart-drawer, cart-icon-bubble (via invicta-product-v2.js → InvictaCartAPI)
```

### Collection Page (`templates/collection.json`)
```
layout/theme.liquid (+ all global CSS/JS/snippets as above)
│
├── sections/invicta-collection.liquid
│   ├── assets/section-invicta-collection.css, invicta-product-card.css
│   └── snippets/invicta-product-card.liquid
│       └── snippets/invicta-brand-pill.liquid → {brand}.svg (dynamic)

Related sections (not in template but functionally linked):
├── sections/invicta-collection-filters.liquid (loaded alongside collection)
│   ├── assets/section-invicta-collection-filters.css
│   └── assets/invicta-collection-filters.js → dynamically fetches invicta-product-grid section
│
└── sections/invicta-product-grid.liquid (loaded via JS Section Rendering API)
    ├── snippets/invicta-section-header.liquid → assets/component-section-header.css
    ├── snippets/invicta-product-card.liquid
    ├── snippets/invicta-trust-bar.liquid → assets/component-trust-bar.css
    └── snippets/invicta-cta-banner.liquid → assets/component-cta-banner.css
```

### Cart Page (`templates/cart.json`)
```
layout/theme.liquid (+ all global CSS/JS/snippets as above)
│
├── sections/main-cart-items.liquid
│   ├── assets/component-cart.css, component-cart-items.css, component-totals.css
│   ├── assets/component-price.css, component-discounts.css, quantity-popover.css, invicta-cart.css
│   ├── assets/cart.js, quantity-popover.js
│   ├── SVGs: icon-discount, icon-info, icon-minus, icon-plus, icon-remove, icon-close, icon-error
│   ├── snippets/invicta-free-delivery-bar.liquid
│   ├── snippets/invicta-delivery-estimate.liquid
│   ├── snippets/loading-spinner.liquid
│   └── snippets/unit-price.liquid
│
├── sections/main-cart-footer.liquid
│   ├── assets/component-cart.css, component-totals.css, component-price.css, component-discounts.css, invicta-cart.css
│   ├── SVGs: icon-discount
│   └── snippets/cart-breakdown.liquid → assets/component-cart-breakdown.css
│
└── sections/featured-collection.liquid
    └── snippets/invicta-product-card.liquid

JS dynamic loads: cart-drawer, main-cart-items, cart-icon-bubble, cart-live-region-text, main-cart-footer (via cart.js)
```

---

## 4. Anomalies and Issues Found

### Missing Assets (Referenced but Don't Exist)
1. **`icon-search.svg`** — Referenced in `snippets/country-localization.liquid:73` via `inline_asset_content`, but no such file exists in `assets/`. This will cause a rendering issue.
2. **`pwa-icon-152.png`** and **`pwa-icon-384.png`** — Referenced in `manifest.webmanifest` but don't exist in `assets/`.
3. **`{brand}-wide.svg`** — `snippets/invicta-brand-hero.liquid:27` builds wide SVG filenames, but no wide SVG variants exist in assets.

### Code Issues
4. **Missing `.svg` extension** — `sections/main-password-header.liquid:84` references `'icon-error' | inline_asset_content` without the `.svg` extension. This may fail silently.

### Duplicate/Redundant Patterns
5. **Two predictive search systems** — `predictive-search.js` (Dawn default, references `sections/predictive-search.liquid`) AND `invicta-predictive-search.js` (custom, loaded via `snippets/predictive-search-inline.liquid`). Both are loaded in `theme.liquid`.
6. **Two quick-add systems** — `quick-add.js` (Dawn default, unreferenced) and `invicta-quick-add.js` (custom, loaded in theme.liquid).
7. **Two related products sections** — `sections/related-products.liquid` (Dawn default, unreferenced from templates) and `sections/invicta-related-products.liquid` (custom, used in product.json).
8. **Duplicate cart CSS loading** — `component-cart.css`, `component-totals.css`, `component-price.css`, `component-discounts.css` are loaded both in `layout/theme.liquid` AND in `sections/main-cart-items.liquid` and `sections/main-cart-footer.liquid`.

### Orphaned PWA System
9. The entire PWA system (service-worker.js, manifest.webmanifest, all pwa-icon PNGs, all splash PNGs) is orphaned — the `pwa-head` snippet that registered the service worker has been removed, but the assets remain.

### No Circular Dependencies Found
All dependency chains are acyclic. Snippets never render themselves or create loops.

---

## 5. Section Usage Frequency

| Section | Used In (template count) |
|---------|------------------------|
| `invicta-category-grid` | 20 templates |
| `invicta-recently-viewed` | 18 templates |
| `invicta-usp-strip-v2` | 13 templates |
| `featured-collection` | 12 templates (index x3, cart, brand x9) |
| `brand-hero` | 9 templates |
| `brand-about` | 9 templates |
| `brand-applications` | 9 templates |
| `brand-new-products` | 9 templates |
| `brand-why-choose` | 9 templates |
| `brand-categories` | 9 templates |
| `brand-video` | 9 templates |
| `brand-faq` | 8 templates |
| `brand-schema` | 8 templates |
| `cta-bar` | 4 templates |
| `breadcrumb-simple` | 3 templates |
| `main-page` | 3 templates |
| Most others | 1 template each |

---

## 6. Root Markdown Files (Not Theme Files)
These 9 files are from previous audit/planning sessions and are NOT part of the Shopify theme:
- `AUDIT.md`, `AUDIT-2.md`, `AUDIT-CHECKOUT-BASKET.md`
- `PLAN.md`, `README.md`, `THEME-GUIDE.md`
- `UX AUDIT.md`
- `ai-performance-change-log.md`, `performance-ux-audit-review.md`
