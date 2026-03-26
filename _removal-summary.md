# Dead Weight Removal Plan — Invicta Tools Theme

**Phase 2 of Theme Cleanup**
Generated: 2026-03-13 | Source: `_dependency-map.json` (Phase 1)
Theme: Trade 15.4.0 (Invicta Tools customisation) | Total files: 435

---

## Summary

| Category | Count | Action |
|----------|------:|--------|
| Confirmed dead | 34 | Safe to remove |
| Likely dead (verify first) | 40 | Verify with store owner before removing |
| Redundant duplicates | 3 | Safe to remove (active replacement confirmed) |
| Conditional keep | 13 | DO NOT remove — loaded under specific settings |
| Templates to verify | 4 | Check Shopify admin for corresponding pages |
| Markdown housekeeping | 9 | Safe to remove (not part of theme) |
| **Total removal candidates** | **46** | Confirmed dead + redundant duplicates + markdown |
| **Total verify candidates** | **44** | Likely dead + templates to verify |

---

## Dependency Map Overrides

Phase 1's dependency map missed these references. These files are **NOT dead** despite showing zero inbound:

- **`sections/pickup-availability.liquid`** — Referenced indirectly via `quick-add.js` custom element behaviour
- **`sections/apps.liquid`** — Loaded by Shopify platform automatically, not by theme code
- **`sections/header-group.json`** — Loaded via `{% sections 'header-group' %}` in `theme.liquid`
- **`sections/footer-group.json`** — Loaded via `{% sections 'footer-group' %}` in `theme.liquid`

---

## 1. Confirmed Dead — Sections (12 files)

All Dawn default sections with zero inbound references. These have been superseded by custom Invicta sections or are simply unused in this theme.

| File | Why it's dead |
|------|--------------|
| `sections/collage.liquid` | Dawn default. Zero inbound. Not used by any template. |
| `sections/collapsible-content.liquid` | Dawn default. Zero inbound. Not used by any template. |
| `sections/collection-list.liquid` | Dawn default. Zero inbound. `main-list-collections.liquid` serves this role. |
| `sections/custom-liquid.liquid` | Dawn default. Zero inbound, zero outbound. Completely isolated. |
| `sections/featured-blog.liquid` | Dawn default. Zero inbound. `main-blog.liquid` handles blog display. |
| `sections/image-with-text.liquid` | Dawn default. Zero inbound. Not used by any template. |
| `sections/multicolumn.liquid` | Dawn default. Zero inbound. Not used by any template. |
| `sections/multirow.liquid` | Dawn default. Zero inbound. Not used by any template. |
| `sections/page.liquid` | Dawn default. Zero inbound. `main-page.liquid` is the active section (4 template refs). |
| `sections/rich-text.liquid` | Dawn default. Zero inbound. Not used by any template. |
| `sections/slideshow.liquid` | Dawn default. Zero inbound. `invicta-hero-split` is used for homepage hero. |
| `sections/video.liquid` | Dawn default. Zero inbound. Brand pages use `brand-video.liquid` instead. |

### Cascade orphans (CSS/assets only referenced by these dead sections)

These assets become orphaned once the above sections are removed:

| Asset | Only referenced by |
|-------|-------------------|
| `assets/collage.css` | `collage.liquid` |
| `assets/component-accordion.css` | `collapsible-content.liquid` |
| `assets/collapsible-content.css` | `collapsible-content.liquid` |
| `assets/component-image-with-text.css` | `image-with-text.liquid` + `multirow.liquid` (both dead) |
| `assets/component-deferred-media.css` | `collage.liquid` + `video.liquid` (both dead) |
| `assets/component-modal-video.css` | `collage.liquid` |
| `assets/section-featured-blog.css` | `featured-blog.liquid` |
| `assets/section-multicolumn.css` | `multicolumn.liquid` |
| `assets/section-rich-text.css` | `rich-text.liquid` |
| `assets/video-section.css` | `video.liquid` |
| `assets/icon-pause.svg` | `slideshow.liquid` |
| `assets/icon-play.svg` | `collage.liquid` + `slideshow.liquid` + `video.liquid` (all dead) |

**Note:** Some shared assets (component-card.css, component-slider.css, icon-caret.svg, etc.) are also referenced by these dead sections but have valid references from active sections. They are safe and must be kept.

---

## 2. Confirmed Dead — CSS (4 files)

| File | Why it's dead |
|------|--------------|
| `assets/component-collection-hero.css` | Zero inbound. Leftover from removed Dawn collection hero. |
| `assets/component-facets.css` | Zero inbound. Dawn facets replaced by `invicta-collection.liquid` inline filters. |
| `assets/quick-add.css` | Zero inbound. Dawn quick-add CSS. `invicta-quick-add.js` is the active system. |
| `assets/template-collection.css` | Zero inbound. Dawn collection template CSS replaced by Invicta styling. |

---

## 3. Confirmed Dead — JavaScript (2 files)

| File | Why it's dead |
|------|--------------|
| `assets/recipient-form.js` | Zero inbound. Dawn gift card recipient form JS. No section loads it. |
| `assets/show-more.js` | Zero inbound. Dawn "show more" button JS. No section loads it. |

---

## 4. Confirmed Dead — SVGs (10 files)

| File | Why it's dead |
|------|--------------|
| `assets/icon-3d-model.svg` | Zero inbound. Dawn 3D model viewer icon — feature not used. |
| `assets/icon-close-small.svg` | Zero inbound. Theme uses `icon-close.svg` (8 refs) instead. |
| `assets/icon-filter.svg` | Zero inbound. Dawn facets icon replaced by Invicta filter UI. |
| `assets/icon-hamburger.svg` | Zero inbound. Dawn mobile menu icon. `header-invicta.liquid` uses different nav. |
| `assets/icon-inventory-status.svg` | Zero inbound. Not loaded by any section or dynamic system. |
| `assets/icon-unavailable.svg` | Zero inbound. Not loaded by any section or dynamic system. |
| `assets/icon-zoom.svg` | Zero inbound. Dawn zoom icon. `invicta-product-v2` uses different zoom. |
| `assets/pdp.svg` | Zero inbound. Unclear purpose. Nothing loads it. |
| `assets/square.svg` | Zero inbound. Nothing loads it. |
| `assets/tools-icons.svg` | Zero inbound. SVG sprite sheet — individual icons are used instead. |

---

## 5. Confirmed Dead — PNGs (6 files)

All orphaned PWA assets not referenced by anything (including `manifest.webmanifest`):

| File | Why it's dead |
|------|--------------|
| `assets/pwa-icon-167.png` | Zero inbound. Not in webmanifest. Apple Touch icon (167px). |
| `assets/pwa-icon-180.png` | Zero inbound. Not in webmanifest. Apple Touch icon (180px). |
| `assets/splash-1170x2532.png` | Zero inbound. PWA splash screen. `pwa-head` snippet was removed. |
| `assets/splash-1179x2556.png` | Zero inbound. PWA splash screen. `pwa-head` snippet was removed. |
| `assets/splash-2048x2732.png` | Zero inbound. PWA splash screen. `pwa-head` snippet was removed. |
| `assets/splash-750x1334.png` | Zero inbound. PWA splash screen. `pwa-head` snippet was removed. |

---

## 6. Redundant Duplicates (3 files)

Files where an active replacement has been confirmed:

| Dead file | Active replacement | Evidence |
|-----------|--------------------|----------|
| `assets/quick-add.js` | `assets/invicta-quick-add.js` | quick-add.js: 0 inbound. invicta-quick-add.js: 1 inbound (theme.liquid). |
| `sections/related-products.liquid` | `sections/invicta-related-products.liquid` | related-products.liquid: 0 inbound. invicta-related-products.liquid: 1 inbound (product.json). |
| `sections/invicta-collection-filters.liquid` | `sections/invicta-collection.liquid` (inline) | Verified: invicta-collection.liquid v9.0+ has complete inline filter UI (desktop sidebar + mobile bottom-sheet). invicta-collection-filters.liquid was never added to collection.json. Its CSS and JS are listed in cascade orphans below. |

### Cascade orphans from redundant duplicates

| Asset | Only referenced by |
|-------|-------------------|
| `assets/mask-blobs.css` | `related-products.liquid` (redundant) |
| `assets/mask-arch.svg` | `related-products.liquid` (redundant) |
| `assets/section-invicta-collection-filters.css` | `invicta-collection-filters.liquid` (redundant) |
| `assets/invicta-collection-filters.js` | `invicta-collection-filters.liquid` (redundant) |

---

## 7. Likely Dead — Verify with Store Owner (8 sections + 2 snippets)

Custom sections with zero inbound references. These may have been built for future use or may be available via the Shopify theme editor. **Do not auto-remove — confirm with store owner first.**

| File | Notes |
|------|-------|
| `sections/brand-connectors.liquid` | Custom section. Only references `brand-page.css`. May be planned for brand pages. |
| `sections/brand-logos.liquid` | Custom section. Has its own CSS + snippet. Not in any template currently. |
| `sections/category-icons.liquid` | Custom section. Has its own CSS + snippet. Not in any template currently. |
| `sections/invicta-collection-hero.liquid` | Custom section. Zero outbound deps — appears to be an abandoned prototype. |
| `sections/invicta-hero-promos.liquid` | Custom section. Zero outbound deps. May have been for a promotional campaign. |
| `sections/invicta-product-qa.liquid` | Custom section. Zero outbound deps. Q&A feature not integrated into product page. |
| `sections/invicta-product-reviews.liquid` | Custom section. Zero outbound deps. Reviews feature not integrated. |
| `sections/invicta-quote-request.liquid` | Custom section. Zero outbound deps. B2B quote feature — may be planned. |
| `snippets/brand-logo-item.liquid` | Only ref from `brand-logos.liquid` (verify section above). |
| `snippets/icon-category.liquid` | Only ref from `category-icons.liquid` (verify section above). |

### PWA system — Verify (9 PNGs)

The entire PWA system is orphaned (`pwa-head` snippet removed). These icons are referenced ONLY by `manifest.webmanifest`, which itself has zero inbound refs. However, `service-worker.js` and `.webmanifest` files are in the "never remove" exceptions list.

| File | Referenced by |
|------|--------------|
| `assets/pwa-icon-72.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-96.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-128.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-144.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-192.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-192-maskable.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-384-maskable.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-512.png` | `manifest.webmanifest` only |
| `assets/pwa-icon-512-maskable.png` | `manifest.webmanifest` only |

**Recommendation:** If the store doesn't use PWA features, remove the entire PWA system including `service-worker.js` and `manifest.webmanifest` (overriding the exceptions list with store owner approval).

### Other assets to verify (3 files)

| File | Why verify |
|------|-----------|
| `assets/icon-account.svg` | Zero inbound, but Shopify may use it internally for customer account links. |
| `assets/placeholder-image.svg` | Zero inbound, but Shopify's `placeholder_svg_tag` filter may reference it. |
| `assets/favicon.ico` | Zero inbound, but browsers request `/favicon.ico` by convention. |

---

## 8. Conditional Keep — DO NOT REMOVE (13 files)

These files have valid inbound references but are loaded conditionally. They may appear low-use but are required under specific settings.

### Cart drawer conditionals (`settings.cart_type == 'drawer'`)
- `assets/component-cart-drawer.css`
- `assets/component-cart.css` (also loaded by cart sections)
- `assets/component-totals.css` (also loaded by cart sections)
- `assets/component-price.css` (also loaded by 6 sections)
- `assets/component-discounts.css` (also loaded by cart sections)
- `assets/cart-drawer.js`

### Other setting conditionals
- `assets/animations.js` — `settings.animations_reveal_on_scroll`
- `assets/component-predictive-search.css` — `settings.predictive_search_enabled`
- `assets/predictive-search.js` — `settings.predictive_search_enabled`
- `assets/component-localization-form.css` — Multiple locales available
- `assets/localization-form.js` — Multiple locales available
- `assets/invicta-cx-improvements.css` — All pages except password/gift_card
- `assets/invicta-cx-improvements.js` — All pages except password/gift_card

---

## 9. Templates to Verify (4 files)

**Never auto-remove templates.** These may correspond to active pages in the Shopify admin.

| File | Concern |
|------|---------|
| `templates/page.workwear-2.json` | Versioned name. May duplicate `page.workwear-safety.json`. |
| `templates/page.brand.json` | Generic fallback. 11 specific brand templates exist. May be unused. |
| `templates/page.category-landing.json` | Generic fallback. 30+ specific category templates exist. May be unused. |
| `templates/page.manifest-json.json` | Unusual — serves JSON manifest via a Shopify page. May be abandoned. |

---

## 10. Markdown Housekeeping (9 files)

Not part of the Shopify theme (Shopify ignores `.md` files). From previous AI audit sessions.

| File | Note |
|------|------|
| `AUDIT.md` | Previous AI audit |
| `AUDIT-2.md` | Second AI audit |
| `AUDIT-CHECKOUT-BASKET.md` | Checkout/basket audit |
| `PLAN.md` | AI planning document |
| `THEME-GUIDE.md` | Theme guide |
| `UX AUDIT.md` | UX audit |
| `README.md` | Consider keeping if useful for developer docs |
| `ai-performance-change-log.md` | Performance change log |
| `performance-ux-audit-review.md` | Performance/UX audit review |

**Note:** `_dependency-summary.md` is Phase 1 output and is NOT included here.

---

## Duplicate Systems (Optimisation Opportunity, NOT Dead)

Both the Dawn and Invicta predictive search systems are loaded simultaneously:

| Dawn (conditional) | Invicta (always) |
|--------------------|------------------|
| `predictive-search.js` (via theme.liquid, conditional) | `invicta-predictive-search.js` (via predictive-search-inline.liquid) |
| `component-predictive-search.css` (via theme.liquid, conditional) | `invicta-predictive-search.css` (via predictive-search-inline.liquid) |

Neither system is dead — both have valid inbound references. This is a future optimisation opportunity to consolidate into one system.

Additionally, `component-cart.css`, `component-totals.css`, `component-price.css`, and `component-discounts.css` are loaded both globally in `theme.liquid` AND by individual cart sections. This is duplicate loading, not dead code.

---

## Quality Checklist

- [x] Every "confirmed dead" file has zero inbound references AND is not in the exceptions list
- [x] Dynamic JS section loading accounted for (cart-drawer, predictive-search, cart-icon-bubble, cart-live-region-text, bulk-quick-order-list, pickup-availability, apps)
- [x] Conditional CSS/JS loading accounted for (13 files in conditional_keep)
- [x] No JSON templates in "confirmed dead" (4 templates in "verify" category only)
- [x] Redundant duplicates verified by checking actual inbound refs, not by name
- [x] `sections/invicta-collection-filters.liquid` investigated by reading both it and `invicta-collection.liquid` — confirmed redundant
- [x] Phase 1 known gaps overridden (pickup-availability, apps, header-group.json, footer-group.json)
- [x] Cascade orphans identified (assets only referenced by dead sections)
