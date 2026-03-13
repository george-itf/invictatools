# Invicta Tools — Theme Architecture

> **Base theme:** Shopify Trade 15.4.0 (Dawn-derived)
> **Customised for:** Invicta Tools & Fixings — B2B trade tools supplier, Kent, UK
> **Last updated:** 2026-03-13 (Phase 4 — Consolidation & Architecture)

---

## Quick Orientation

This is a Shopify Online Store 2.0 theme. If you're new to this codebase, read sections 1–3 first (~5 minutes), then refer to sections 4–8 as needed.

---

## 1. Directory Structure

```
invictatools/
├── layout/           # 2 files — page shells (theme.liquid, password.liquid)
├── sections/         # 71 files — UI components rendered into templates
│   ├── *.liquid      # Section templates with schema blocks
│   └── *-group.json  # Section groups (header-group, footer-group)
├── snippets/         # 29 files — reusable partials ({% render 'x' %})
├── templates/        # 52 files — page-type definitions (JSON + Liquid)
│   └── customers/    # 7 files — account pages
├── assets/           # 193 files — CSS, JS, SVGs, images, fonts
├── config/           # 2 files — settings_schema.json, settings_data.json
├── locales/          # 2 files — en-GB translations
└── _*.json           # Build artifacts (dependency maps, cleanup logs)
```

---

## 2. Dependency Flow

```
Template (.json)
  └── defines which Sections to render and their order
        └── Section (.liquid)
              ├── renders Snippets ({% render 'x' %})
              ├── loads CSS ({{ 'x.css' | asset_url | stylesheet_tag }})
              ├── loads JS (<script src="{{ 'x.js' | asset_url }}" defer>)
              └── references SVGs ({{ 'x.svg' | asset_url }})

Layout (theme.liquid)
  ├── renders global Snippets (meta-tags, invicta-css-variables, cart-drawer, etc.)
  ├── loads global CSS/JS (base.css, global.js, etc.)
  ├── outputs {% sections 'header-group' %} and {% sections 'footer-group' %}
  └── outputs {{ content_for_layout }} (where template content appears)
```

### Section Groups

Two section groups define the persistent header and footer:

| Group | File | Sections |
|-------|------|----------|
| Header | `sections/header-group.json` | announcement-bar → header-invicta → invicta-simple-nav |
| Footer | `sections/footer-group.json` | invicta-footer → footer (disabled) |

---

## 3. Naming Conventions

The theme has three naming eras. All are valid and documented here. **New files should use the `invicta-*` convention.**

| Prefix | Scope | CSS Class Prefix | Examples | Status |
|--------|-------|-----------------|----------|--------|
| `main-*` | Shopify core sections | Unprefixed Dawn classes | `main-cart-items`, `main-login`, `main-search` | **Keep** — standard Shopify pattern |
| `brand-*` | Brand landing page sections | Inline styles / `brand-page.css` | `brand-hero`, `brand-categories`, `brand-faq` | **Keep** — coherent module for brand pages |
| `invicta-*` | Custom business logic | `inv-*` | `invicta-product-v2`, `invicta-collection`, `invicta-trust-bar` | **Standard** — use for all new files |
| `component-*` | Shared component CSS/JS | Mixed (Dawn unprefixed + `inv-*`) | `component-cart.css`, `component-trust-bar.css` | **Keep** — some are Dawn originals, some are invicta CSS with legacy filenames |
| `section-*` | Section-specific CSS | Mixed | `section-header-invicta.css`, `section-invicta-collection.css` | **Keep** — loaded on-demand per section |
| `local-*` | Local SEO sections | Inline styles | `local-hero`, `local-hub`, `local-content` | **Keep** — coherent module for SEO pages |

### CSS Class Naming

- **Invicta components** use the `inv-` prefix: `.inv-trust-bar`, `.inv-del-est`, `.inv-search-*`
- **Dawn components** use unprefixed classes: `.cart`, `.predictive-search`, `.button`
- **Never** mix — each component's CSS targets only its own namespace

### Note on `component-*.css` Files

Several `component-*.css` files contain Invicta-authored CSS with `inv-*` classes despite the `component-*` filename:

| File | Actually Styles | Loaded By |
|------|----------------|-----------|
| `component-trust-bar.css` | `.inv-trust-bar` classes | `snippets/invicta-trust-bar.liquid` |
| `component-section-header.css` | `.inv-sheader` classes | `snippets/invicta-section-header.liquid` |
| `component-cta-banner.css` | `.inv-cta-banner` classes | `snippets/invicta-cta-banner.liquid` |
| `component-free-delivery-bar.css` | `.inv-delivery-bar` classes | `snippets/invicta-free-delivery-bar.liquid` |
| `component-delivery-estimate.css` | `.inv-del-est` classes | `snippets/invicta-delivery-estimate.liquid` |
| `component-tiered-pricing.css` | `.invicta-tier` classes | `sections/invicta-product-v2.liquid` |

These are legacy filenames. Renaming them is not worth the risk (Shopify CDN cache, reference breakage). They work correctly as-is.

---

## 4. CSS Architecture

### Load Order (defined in `layout/theme.liquid`)

```
1. Design Tokens          invicta-css-variables.css (via snippet)
2. Foundation             base.css (synchronous, high priority)
3. Global Components      invicta-brand-pill.css, invicta-product-card.css,
                          invicta-radius-reset.css (lazy: print→all)
4. Breakpoints            mobile.css (max-width: 749px)
                          desktop.css (min-width: 750px)
5. UX Improvements        invicta-ux-improvements.css (lazy)
6. Cart Components        component-cart-items.css (lazy)
                          component-cart-drawer.css, component-cart.css,
                          component-totals.css, component-price.css,
                          component-discounts.css (conditional: cart drawer)
7. Conditional            component-localization-form.css (if multiple locales)
                          component-predictive-search.css (if predictive search)
8. CX Improvements        invicta-cx-improvements.css (lazy, not on password/gift_card)
9. Per-Section CSS        Loaded by individual sections (not in layout)
```

### Design Tokens

**File:** `assets/invicta-css-variables.css` (loaded via `snippets/invicta-css-variables.liquid`)

All custom design tokens live in a single `:root` block. Tokens use the `--inv-*` namespace:

| Category | Examples |
|----------|---------|
| Brand colours | `--inv-accent`, `--inv-accent-hover`, `--inv-accent-soft` |
| Semantic colours | `--inv-success`, `--inv-warning`, `--inv-error`, `--inv-info` |
| Backgrounds | `--inv-bg`, `--inv-bg-elevated`, `--inv-bg-soft`, `--inv-bg-muted` |
| Text | `--inv-fg`, `--inv-fg-muted`, `--inv-fg-subtle` |
| Borders | `--inv-border`, `--inv-border-subtle`, `--inv-border-strong` |
| Shadows | `--inv-shadow-sm` through `--inv-shadow-xl` |
| Radii | `--inv-radius-none` (0) through `--inv-radius-pill` (999px) |
| Spacing | `--inv-space-xs` (4px) through `--inv-space-3xl` (64px) |
| Layout | `--inv-page-width` (1320px), `--inv-container`, `--inv-page-gutter` |
| Z-index | `--inv-z-base` (0) through `--inv-z-toast` (100000) |
| Animation | `--inv-duration-instant` through `--inv-duration-slowest` |
| Easing | `--inv-ease-default`, `--inv-ease-bounce`, etc. |

**Rules:**
- All `--inv-*` tokens are defined **only** in `invicta-css-variables.css`
- Dawn tokens (`--color-*`, `--font-*`, etc.) are generated dynamically in `theme.liquid` `{% style %}` block from Shopify admin settings
- Do not override `--inv-*` tokens elsewhere — extend the file if new tokens are needed
- Legacy aliases (e.g., `--inv-brand` → `--inv-accent`) exist for backwards compatibility

### CSS File Inventory (57 files)

| Category | Count | Files |
|----------|-------|-------|
| Foundation | 4 | `base.css`, `invicta-css-variables.css`, `mobile.css`, `desktop.css` |
| Invicta components | 11 | `invicta-brand-pill.css`, `invicta-cart.css`, `invicta-cx-improvements.css`, `invicta-predictive-search.css`, `invicta-product-card.css`, `invicta-product-v2.css`, `invicta-product-v2-trust.css`, `invicta-radius-reset.css`, `invicta-related-products.css`, `invicta-ux-improvements.css` |
| Component CSS | 18 | `component-article-card.css`, `component-card.css`, `component-cart.css`, `component-cart-breakdown.css`, `component-cart-drawer.css`, `component-cart-items.css`, `component-cta-banner.css`, `component-delivery-estimate.css`, `component-discounts.css`, `component-free-delivery-bar.css`, `component-list-menu.css`, `component-list-social.css`, `component-localization-form.css`, `component-newsletter.css`, `component-pagination.css`, `component-predictive-search.css`, `component-price.css`, `component-section-header.css`, `component-slider.css`, `component-slideshow.css`, `component-tiered-pricing.css`, `component-totals.css`, `component-trust-bar.css` |
| Section CSS | 14 | `section-blog-post.css`, `section-collection-list.css`, `section-contact-form.css`, `section-email-signup-banner.css`, `section-footer.css`, `section-header-invicta.css`, `section-image-banner.css`, `section-invicta-brand-hero.css`, `section-invicta-collection.css`, `section-invicta-product-v2.css`, `section-main-blog.css`, `section-main-page.css`, `section-main-search.css`, `section-password.css`, `section-trade-landing.css` |
| Other | 6 | `brand-page.css`, `customer.css`, `newsletter-section.css`, `quantity-popover.css`, `quick-order-list.css`, `template-giftcard.css` |

### Key Rule: On-Demand Loading

Every CSS file that is NOT in the global load order (section 4 above) is loaded on-demand by the section or snippet that needs it. This is the correct Shopify OS 2.0 pattern — it ensures pages only load CSS they actually use.

---

## 5. JavaScript Architecture

### Global JS (loaded on every page via `layout/theme.liquid`)

| File | Lines | Purpose |
|------|-------|---------|
| `constants.js` | 9 | PubSub event name constants |
| `pubsub.js` | 25 | Lightweight event bus (subscribe/publish pattern) |
| `global.js` | 1394 | Core Dawn custom elements: `quantity-input`, `menu-drawer`, `header-drawer`, `modal-dialog`, `bulk-modal`, `modal-opener`, `deferred-media`, `slider-component`, `slideshow-component`, `variant-selects`, `product-recommendations`, `account-icon` |
| `details-disclosure.js` | 53 | `<details-disclosure>` custom element |
| `details-modal.js` | 47 | `<details-modal>` custom element |
| `search-form.js` | 47 | `<search-form>` custom element |
| `invicta-cart-api.js` | 163 | Shared `/cart/add.js` utility with request deduplication |
| `invicta-cart-handler.js` | 88 | Cart count/drawer UI updates (loaded via snippet) |
| `invicta-brand-pill.js` | 74 | `<invicta-brand-pill>` — brand logo badges on product cards |
| `invicta-quick-add.js` | 72 | Quick-add pill button handler (delegates to InvictaCartAPI) |
| `invicta-vat-toggle.js` | 233 | VAT inc/ex price toggle across all pages |
| `invicta-quantity-enhancer.js` | 316 | Enhanced quantity inputs with +/- buttons, box quantity logic |
| `invicta-cx-improvements.js` | 736 | CX improvements: sticky ATC, mobile scroll, focus management |

### Conditionally Loaded JS

| File | Lines | Condition | Purpose |
|------|-------|-----------|---------|
| `animations.js` | 102 | `settings.animations_reveal_on_scroll` | Scroll-reveal animations |
| `localization-form.js` | 206 | Multiple locales | Country/language selector |
| `predictive-search.js` | 334 | `settings.predictive_search_enabled` | Dawn search results page search |
| `cart-drawer.js` | 136 | `settings.cart_type == 'drawer'` | Cart drawer component |
| `cart.js` | 296 | Cart page sections | Full cart page form handler |
| `invicta-predictive-search.js` | 264 | Header snippet | Inline header search |
| `invicta-product-v2.js` | 930 | Product page | PDP gallery, variants, ATC, buy now |
| `invicta-recently-viewed.js` | 277 | Recently viewed section | localStorage product history |
| `component-tiered-pricing.js` | 47 | Product page | Tiered pricing tier highlighting |
| `component-delivery-estimate.js` | 93 | Product page snippet | Delivery date calculation |
| `component-free-delivery-bar.js` | 106 | Cart snippet | Free delivery progress bar |
| `price-per-item.js` | 103 | Cart sections | Unit price display |
| `quantity-popover.js` | 89 | Cart sections | Quantity update popover |
| `quick-order-list.js` | 485 | Quick order section | Bulk order form |
| `customer.js` | 85 | Customer sections | Address forms |
| `share.js` | 56 | Share button snippet | Web Share API |
| `password-modal.js` | 9 | Password layout | Password page modal |
| `theme-editor.js` | 54 | Shopify editor only | Theme editor integration |

### JS Dependency Chain

```
constants.js ← pubsub.js ← global.js
                              ↑
                    All custom elements depend on
                    classes defined in global.js

invicta-cart-api.js ← invicta-cart-handler.js
                    ← invicta-quick-add.js
                    ← invicta-product-v2.js
                    (All cart operations flow through InvictaCartAPI)

pubsub.js ← invicta-vat-toggle.js (publishes cart-update)
           ← cart.js, cart-drawer.js (subscribe to cart-update)
```

---

## 6. Key Business Logic

### VAT Toggle

**Files:** `invicta-vat-toggle.js`, `invicta-css-variables.css` (`.inv-vat-ex` class)

- Tradespeople can toggle between VAT-inclusive and VAT-exclusive prices
- State persisted in `localStorage('invicta-vat-mode')`
- Applied before first paint via inline script in `theme.liquid` `<head>` to prevent price flash
- When mode is "ex", `document.documentElement` gets class `inv-vat-ex`
- CSS hides `.inv-price-inc` elements and shows `.inv-price-ex` elements
- VAT rate configured in Shopify admin: `settings.inv_vat_rate`

### Tiered Pricing

**Files:** `component-tiered-pricing.js`, `component-tiered-pricing.css`

- Product pages show quantity-based price tiers
- Tier data stored in product metafields
- JS highlights the active tier based on quantity input value
- CSS class `.invicta-tier--active` applied to matching tier row

### Cart Modes

**Files:** `cart-drawer.js`, `cart.js`, `invicta-cart.css`, `component-cart-drawer.css`

- **Drawer cart** (default): Slide-out drawer, configured via `settings.cart_type == 'drawer'`
- **Page cart**: Full page cart at `/cart`
- Both use `InvictaCartAPI` for add operations
- Free delivery bar (`component-free-delivery-bar.js/css`) shows progress to free shipping threshold

### Trade Account Features

**Files:** `invicta-trade-cta` section, `trade-landing` section, theme.liquid config

- `window.invictaConfig.isTradeCustomer` — set based on customer tag `'trade'`
- Trade customers see different pricing, delivery terms
- Trade CTA section on homepage with registration form
- Trade landing page with dedicated template (`page.trade-landing.json`)

### Delivery Estimation

**Files:** `component-delivery-estimate.js`, `component-delivery-estimate.css`, `snippets/invicta-delivery-estimate.liquid`

- Shows estimated delivery date on PDP
- Uses `settings.inv_delivery_cutoff_hour` for same-day dispatch cutoff
- Accounts for weekends and bank holidays
- Supplier-specific delivery estimates configured via section blocks

### Product Display Page (PDP)

**Files:** `invicta-product-v2.js`, `invicta-product-v2.css`, `section-invicta-product-v2.css`, `invicta-product-v2-trust.css`

- Custom product page with image gallery, variant selection, sticky ATC
- Supplier stock status with configurable messaging per supplier
- Trust bar with delivery/returns/warranty info
- Key specs display from product metafields
- Buy Now (skip cart) for orders under configurable threshold

---

## 7. Template Map

### Core Pages

| Template | Sections Used |
|----------|--------------|
| `index.json` | invicta-hero-split → invicta-promo-banners → invicta-quick-cats → invicta-usp-strip-v2 → invicta-brand-strip → featured-collection (x3) → invicta-trade-cta → invicta-trust-bar → review-carousel → invicta-recently-viewed → invicta-newsletter |
| `product.json` | invicta-product-v2 → invicta-related-products → invicta-recently-viewed |
| `collection.json` | invicta-collection |
| `collection.brand.json` | invicta-brand-collection |
| `cart.json` | main-cart-items → main-cart-footer → featured-collection |
| `search.json` | main-search |
| `blog.json` | main-blog |
| `article.json` | main-article |
| `404.json` | main-404 |
| `list-collections.json` | main-list-collections |
| `password.json` | email-signup-banner |

### Brand Landing Pages (8 templates, identical structure)

Templates: `page.brand-dewalt.json`, `page.brand-faithfull.json`, `page.brand-hikoki.json`, `page.brand-lamello.json`, `page.brand-makita.json`, `page.brand-pdp.json`, `page.brand-stanley.json`, `page.brand-timco.json`

All use: brand-hero → brand-about → brand-video → brand-categories → brand-new-products → brand-applications → brand-why-choose → brand-faq → brand-schema → featured-collection → cta-bar → invicta-usp-strip-v2

`page.brand.json` is a generic version with slightly fewer sections (no brand-faq, no brand-schema, adds breadcrumb-simple).

### Category Landing Pages (18 templates)

15 templates use `invicta-category-grid` + `invicta-recently-viewed`, differing only in settings.
3 templates use `invicta-category-grid` alone.

### Utility Pages

| Template | Sections |
|----------|----------|
| `page.contact.json` | image-banner, main-page, contact-form |
| `page.delivery-info.json` | invicta-delivery-info |
| `page.faq.json` | invicta-faq |
| `page.returns.json` | invicta-returns |
| `page.trade-landing.json` | trade-landing |
| `page.thank-you-trade.json` | trade-thank-you |
| `page.kent-hub.json` | breadcrumb-simple, local-hero, local-hub, cta-bar, invicta-usp-strip-v2 |
| `page.local-seo.json` | breadcrumb-simple, local-hero, local-content, cta-bar, invicta-usp-strip-v2 |

### Customer Account Pages (7 templates)

Each uses a single `main-*` section: main-account, main-activate-account, main-addresses, main-login, main-order, main-register, main-reset-password.

---

## 8. Rules for Future Development

### Adding a New Section

1. Create `sections/invicta-your-section.liquid` with a `{% schema %}` block
2. Create `assets/section-invicta-your-section.css` for section-specific styles
3. Load CSS inside the section: `{{ 'section-invicta-your-section.css' | asset_url | stylesheet_tag }}`
4. If JS is needed, create `assets/invicta-your-section.js` and load it in the section
5. Use `inv-` prefix for all CSS classes
6. Use design tokens from `invicta-css-variables.css` — do not hardcode colours/spacing
7. Add the section to a template via Shopify admin or by editing the template JSON

### Adding New CSS

- **Section-specific CSS**: Load in the section file, not in `theme.liquid`
- **Global CSS**: Only add to `theme.liquid` if the CSS is needed on literally every page
- **Use lazy loading**: `media="print" onload="this.media='all'"` for non-critical CSS
- **Use design tokens**: `var(--inv-accent)` not `#e11d26`
- **Use `inv-` class prefix**: Prevents collisions with Dawn classes

### Adding New JS

- **Section-specific JS**: Load in the section with `defer`
- **Global JS**: Only if needed on every page. Add to `theme.liquid` with `defer`
- **Use InvictaCartAPI**: For any cart operations — do not make direct `/cart/add.js` calls
- **Use PubSub**: For cross-component communication — `subscribe()` and `publish()`
- **Use Custom Elements**: For stateful UI components — `customElements.define()`

### Naming Conventions for New Files

| File Type | Convention | Example |
|-----------|-----------|---------|
| Section | `invicta-{feature}.liquid` | `invicta-comparison-table.liquid` |
| Snippet | `invicta-{component}.liquid` | `invicta-size-guide.liquid` |
| Section CSS | `section-invicta-{feature}.css` | `section-invicta-comparison-table.css` |
| Component CSS | `invicta-{component}.css` | `invicta-size-guide.css` |
| JS | `invicta-{feature}.js` | `invicta-comparison-table.js` |

### Things to Never Do

- **Never rename section files** — downstream impact on JSON templates, Shopify admin, and customer content is severe
- **Never modify `config/settings_schema.json` or `config/settings_data.json`** manually — these are managed by Shopify admin
- **Never modify locale files** without coordinating with translation workflows
- **Never define `--inv-*` CSS custom properties outside `invicta-css-variables.css`**
- **Never make direct `/cart/add.js` fetch calls** — use `window.InvictaCartAPI.add()`
- **Never load section-specific CSS globally in `theme.liquid`** — load it in the section

---

## 9. File Reference

### Snippets (29 files)

| Snippet | Purpose | Used By |
|---------|---------|---------|
| `meta-tags.liquid` | SEO meta tags | Both layouts |
| `invicta-css-variables.liquid` | Loads design token CSS | theme.liquid |
| `invicta-cart-handler.liquid` | Loads cart handler JS | theme.liquid |
| `cart-drawer.liquid` | Cart drawer markup | theme.liquid (conditional) |
| `cart-breakdown.liquid` | Cart line item breakdown | Cart sections |
| `invicta-product-card.liquid` | Product card component | Collection/grid sections |
| `invicta-brand-pill.liquid` | Brand logo badge | Product cards |
| `invicta-brand-hero.liquid` | Brand hero header | Brand sections |
| `invicta-section-header.liquid` | Section header with breadcrumbs | Collection/brand sections |
| `invicta-trust-bar.liquid` | Trust indicators bar | Multiple sections |
| `invicta-cta-banner.liquid` | Call-to-action banner | Multiple sections |
| `invicta-delivery-estimate.liquid` | Delivery date estimate | PDP |
| `invicta-free-delivery-bar.liquid` | Free delivery progress | Cart |
| `predictive-search-inline.liquid` | Header inline search | Header section |
| `article-card.liquid` | Blog article card | Blog sections |
| `card-collection.liquid` | Collection card | Collection list |
| `country-localization.liquid` | Country selector | Footer/header |
| `language-localization.liquid` | Language selector | Footer/header |
| `icon-accordion.liquid` | Accordion icon SVG | FAQ sections |
| `loading-spinner.liquid` | Loading spinner | Cart, quick order |
| `pagination.liquid` | Pagination component | Collection, blog |
| `progress-bar.liquid` | Progress bar | Quick order |
| `quantity-input.liquid` | Quantity input | Cart, PDP |
| `quick-order-list-row.liquid` | Quick order row | Quick order |
| `quick-order-list.liquid` | Quick order list | Quick order section |
| `schema-jsonld.liquid` | Structured data | theme.liquid |
| `share-button.liquid` | Share button | Article, product |
| `social-icons.liquid` | Social media links | Footer |
| `unit-price.liquid` | Unit price display | Product cards |

### Section Groups Composition

**Header Group** (`sections/header-group.json`):
1. `announcement-bar` — Rotating announcement messages
2. `header-invicta` — Red branded header with search, account, cart
3. `invicta-simple-nav` — Dark secondary navigation bar

**Footer Group** (`sections/footer-group.json`):
1. `invicta-footer` — Custom footer with columns, contact, social
2. `footer` — Dawn default footer (disabled)

---

## 10. Breakpoints

| Name | Media Query | CSS File |
|------|-------------|----------|
| Mobile | `max-width: 749px` | `mobile.css` |
| Tablet | `min-width: 750px` and `max-width: 989px` | `desktop.css` (shares with desktop) |
| Desktop | `min-width: 750px` | `desktop.css` |
| Wide | `min-width: 990px` | (within `desktop.css`) |
| Extra Wide | `min-width: 1200px` | (within `desktop.css`) |

The primary breakpoint is **750px** — this is the Dawn standard and is used consistently throughout. Mobile and desktop CSS are loaded with media-query `<link>` tags, so browsers only download the relevant file.

---

## 11. Build Artifacts (Root Directory)

These JSON files are generated by the cleanup project and are not part of the theme itself:

| File | Phase | Purpose |
|------|-------|---------|
| `_dependency-map.json` | Phase 1 | Original dependency map (pre-cleanup, now outdated) |
| `_removal-plan.json` | Phase 2 | Dead file identification |
| `_cleanup-log.json` | Phase 3 | Record of 87 deleted files |
| `_dependency-map-v2.json` | Phase 4 | Current dependency map (post-cleanup) |
| `_consolidation-log.json` | Phase 4 | This phase's analysis and decisions |

These files should not be deployed to Shopify (they're not in a Shopify directory).
