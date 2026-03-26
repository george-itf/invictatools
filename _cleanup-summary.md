# Phase 3 — Cleanup Summary

**Generated:** 2026-03-13
**Source:** `_removal-plan.json` (Phase 2 output)
**Theme:** Trade 15.4.0 (Invicta Tools customisation)

---

## Results

| Metric | Count |
|--------|-------|
| Files deleted | **87** |
| Files skipped | **0** |
| Errors | **0** |

### Breakdown by Tier

| Tier | Description | Files Deleted |
|------|-------------|---------------|
| 1 | Confirmed Dead | 75 |
| 2 | Redundant Duplicates | 3 |
| 3 | Markdown Housekeeping | 9 |

---

## Tier 1: Confirmed Dead (75 files)

### Sections Removed (20)
- `sections/collage.liquid` — Dawn default, zero inbound refs
- `sections/collapsible-content.liquid` — Dawn default, zero inbound refs
- `sections/collection-list.liquid` — Dawn default, replaced by main-list-collections.liquid
- `sections/custom-liquid.liquid` — Dawn default, zero inbound/outbound refs
- `sections/featured-blog.liquid` — Dawn default, replaced by main-blog.liquid
- `sections/image-with-text.liquid` — Dawn default, zero inbound refs
- `sections/multicolumn.liquid` — Dawn default, zero inbound refs
- `sections/multirow.liquid` — Dawn default, zero inbound refs
- `sections/page.liquid` — Dawn default, replaced by main-page.liquid
- `sections/rich-text.liquid` — Dawn default, zero inbound refs
- `sections/slideshow.liquid` — Dawn default, replaced by invicta-hero-split
- `sections/video.liquid` — Dawn default, replaced by brand-video.liquid
- `sections/brand-connectors.liquid` — Custom, zero inbound refs (owner approved)
- `sections/brand-logos.liquid` — Custom, zero inbound refs (owner approved)
- `sections/category-icons.liquid` — Custom, zero inbound refs (owner approved)
- `sections/invicta-collection-hero.liquid` — Abandoned prototype (owner approved)
- `sections/invicta-hero-promos.liquid` — Unused promo section (owner approved)
- `sections/invicta-product-qa.liquid` — Unintegrated Q&A section (owner approved)
- `sections/invicta-product-reviews.liquid` — Unintegrated reviews section (owner approved)
- `sections/invicta-quote-request.liquid` — Unintegrated quote request (owner approved)

### Snippets Removed (2)
- `snippets/brand-logo-item.liquid` — Cascade orphan (brand-logos.liquid removed)
- `snippets/icon-category.liquid` — Cascade orphan (category-icons.liquid removed)

### CSS Removed (17)
- `assets/component-collection-hero.css` — Zero inbound refs
- `assets/component-facets.css` — Zero inbound refs (Dawn facets replaced)
- `assets/quick-add.css` — Zero inbound refs (Dawn quick-add replaced)
- `assets/template-collection.css` — Zero inbound refs (Dawn collection replaced)
- `assets/section-brand-logos.css` — Cascade orphan
- `assets/section-category-icons.css` — Cascade orphan
- `assets/section-invicta-collection-filters.css` — Cascade orphan
- `assets/collage.css` — Cascade orphan
- `assets/component-accordion.css` — Cascade orphan
- `assets/collapsible-content.css` — Cascade orphan
- `assets/section-featured-blog.css` — Cascade orphan
- `assets/section-multicolumn.css` — Cascade orphan
- `assets/mask-blobs.css` — Cascade orphan
- `assets/section-rich-text.css` — Cascade orphan
- `assets/video-section.css` — Cascade orphan
- `assets/component-image-with-text.css` — Cascade orphan
- `assets/component-deferred-media.css` — Cascade orphan
- `assets/component-modal-video.css` — Cascade orphan

### JS Removed (3)
- `assets/recipient-form.js` — Zero inbound refs (Dawn gift card)
- `assets/show-more.js` — Zero inbound refs (Dawn show-more)
- `assets/invicta-collection-filters.js` — Cascade orphan

### SVG Removed (13)
- `assets/icon-3d-model.svg` — Zero inbound refs
- `assets/icon-close-small.svg` — Zero inbound refs (icon-close.svg used instead)
- `assets/icon-filter.svg` — Zero inbound refs
- `assets/icon-hamburger.svg` — Zero inbound refs
- `assets/icon-inventory-status.svg` — Zero inbound refs
- `assets/icon-unavailable.svg` — Zero inbound refs
- `assets/icon-zoom.svg` — Zero inbound refs
- `assets/pdp.svg` — Zero inbound refs
- `assets/square.svg` — Zero inbound refs
- `assets/tools-icons.svg` — Zero inbound refs (sprite sheet)
- `assets/icon-pause.svg` — Cascade orphan
- `assets/mask-arch.svg` — Cascade orphan
- `assets/icon-play.svg` — Cascade orphan

### PNG Removed (15)
- `assets/pwa-icon-167.png` — Orphaned PWA icon
- `assets/pwa-icon-180.png` — Orphaned PWA icon
- `assets/pwa-icon-72.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-96.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-128.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-144.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-192.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-192-maskable.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-384-maskable.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-512.png` — Orphaned PWA icon (owner approved)
- `assets/pwa-icon-512-maskable.png` — Orphaned PWA icon (owner approved)
- `assets/splash-1170x2532.png` — Orphaned PWA splash
- `assets/splash-1179x2556.png` — Orphaned PWA splash
- `assets/splash-2048x2732.png` — Orphaned PWA splash
- `assets/splash-750x1334.png` — Orphaned PWA splash

### Other Removed (2)
- `assets/manifest.webmanifest` — PWA system fully orphaned (owner approved)
- `assets/service-worker.js` — PWA system fully orphaned (owner approved)

### Templates Removed (2)
- `templates/page.workwear-2.json` — Superseded versioned template (owner approved)
- `templates/page.manifest-json.json` — Unusual JSON manifest template (owner approved)

---

## Tier 2: Redundant Duplicates (3 files)

- `assets/quick-add.js` — Replaced by `assets/invicta-quick-add.js`
- `sections/related-products.liquid` — Replaced by `sections/invicta-related-products.liquid`
- `sections/invicta-collection-filters.liquid` — Replaced by `sections/invicta-collection.liquid` inline filter UI

---

## Tier 3: Markdown Housekeeping (9 files)

- `AUDIT.md`
- `AUDIT-2.md`
- `AUDIT-CHECKOUT-BASKET.md`
- `PLAN.md`
- `THEME-GUIDE.md`
- `UX AUDIT.md`
- `README.md`
- `ai-performance-change-log.md`
- `performance-ux-audit-review.md`

---

## Not Removed

- **likely_dead_verify:** 0 files (list was empty — all items were resolved by owner)
- **conditional_keep:** 13 files (legitimately used with conditional loading)
- **templates_to_verify:** 2 files (`page.brand.json`, `page.category-landing.json` — left for owner verification)

---

## Updated File Counts Per Directory

| Directory | Files After Cleanup |
|-----------|-------------------|
| sections/ | 71 |
| snippets/ | 29 |
| assets/ | 193 |
| layout/ | 2 |
| templates/ | 51 |
| config/ | 2 |
| locales/ | 2 |
| **Total** | **350** |

**Files removed:** 87 (from ~435 total, a 20% reduction)

---

## Verification

- No remaining `.liquid` file references any deleted CSS/JS/SVG asset
- No remaining `.json` template references any deleted section
- Final sweep found 2 substring matches — both confirmed false positives:
  - `invicta-product-grid.liquid` references DOM element ID `invicta-collection-filters`, not the section file
  - `theme.liquid` references `invicta-quick-add.js`, not `quick-add.js`
- Theme should function identically to before, just with fewer files
