# INVICTA TOOLS — Comprehensive Theme Audit (Phase 2)

**Date:** 11 February 2026
**Repo:** `george-itf/invictatools`
**Theme:** Shopify Trade 15.4.0
**Method:** 6 parallel specialist audit agents, project-managed review
**Scope:** Full codebase — layouts, templates, sections, snippets, assets, config, locales

---

## Executive Summary

This audit builds on the Phase 1 Principal Architect audit (9 Feb 2026). While the previous audit correctly identified the architectural debt and proposed a phased refactoring roadmap, this Phase 2 audit goes deeper — reading every file, cross-referencing every render call, and testing every setting against its usage.

**Key headline numbers:**
- **18 CRITICAL findings** — security vulnerabilities, broken structured data, accessibility failures
- **32 HIGH findings** — dead code, performance regressions, data inconsistencies
- **~50 MEDIUM findings** — hardcoded strings, DRY violations, contrast failures
- **~40 LOW findings** — cleanup, minor a11y, inconsistent documentation

**The theme works, but carries real risk:** XSS vectors in search, zero keyboard access on the mega menu, broken schema.org data feeding Google, and ~30% dead snippet code.

---

## CRITICAL FINDINGS (18)

### Security

#### C1. XSS via `innerHTML` in Predictive Search
- **File:** `assets/invicta-predictive-search.js`
- **Detail:** Search results are injected using `innerHTML` with product data that may contain unescaped merchant content (titles, descriptions). Every keystroke in search triggers this. An attacker who controls a product title could execute arbitrary JavaScript.
- **Fix:** Use `textContent` for text nodes, or sanitize HTML before injection with DOMPurify or manual escaping.

#### C2. XSS via Inline `onerror` Handler in Brand Pill
- **File:** `snippets/invicta-brand-pill.liquid` :530-538
- **Detail:** Inline `onerror` JavaScript handler on brand logo `<img>` tags. The `brand_logo_url` used in `background-image:url('{{ brand_logo_url }}')` and `src="{{ brand_logo_url }}"` is not escaped. CSP `unsafe-inline` violation.
- **Fix:** Move error handling to external JS with event delegation. Escape all URL outputs.

#### C3. XSS in Customer Account Pages
- **File:** `sections/main-account.liquid`, `sections/main-order.liquid`
- **Detail:** Customer name and address fields rendered without `| escape` filter. If a customer registers with a name containing `<script>`, it executes on their account page.
- **Fix:** Add `| escape` to all customer-sourced output.

#### C4. Missing CSRF Token on Product Card Add-to-Cart
- **File:** `snippets/invicta-product-card.liquid` :169-180
- **Detail:** Uses raw `<form action="/cart/add" method="post">` instead of Shopify's `{% form %}` tag. No CSRF token included. Will break if Shopify enforces CSRF.
- **Fix:** Replace with `{% form 'product', product %}` or manually include the CSRF token.

#### C5. Inline `<script>` Block (165 Lines) on Every Page
- **File:** `snippets/invicta-cart-handler.liquid` :12-164
- **Detail:** The entire `InvictaCartHandler` class is inlined in a `<script>` tag rendered from `layout/theme.liquid`. Blocks HTML parser on every page load, cannot be cached, CSP `unsafe-inline` violation.
- **Fix:** Extract to `assets/invicta-cart-handler.js` and load with `defer`.

### Accessibility

#### C6. Mega Menu Has Zero Keyboard / Screen Reader Access
- **File:** `sections/mega-menu.liquid`
- **Detail:** The mega menu dropdown panels have no `role="menu"`, no `aria-expanded`, no keyboard arrow-key navigation, no focus trapping. Entire product category navigation is inaccessible to keyboard-only and screen reader users. This is a WCAG 2.1 Level A failure (2.1.1 Keyboard).
- **Fix:** Add ARIA menu roles, `aria-expanded` toggles, keyboard event handlers for arrow keys, Escape to close, and focus management.

#### C7. Cart Drawer Missing Focus Trap and Escape Handler
- **File:** `sections/cart-drawer.liquid`
- **Detail:** When the cart drawer opens, focus is not trapped inside. Users can tab behind the drawer into hidden content. No Escape key handler to close. Violates WCAG 2.4.3 (Focus Order).
- **Fix:** Implement focus trap on open, restore focus on close, add Escape key listener.

#### C8. Review Carousel Has No Pause Control
- **File:** `sections/review-carousel.liquid`
- **Detail:** Auto-advancing carousel with no pause/stop button. Violates WCAG 2.2.2 (Pause, Stop, Hide). Users with cognitive disabilities cannot control the moving content.
- **Fix:** Add visible pause/play button. Pause on hover/focus.

### Structured Data / SEO

#### C9. `seo_local_street` Contains Company Name Instead of Address
- **File:** `config/settings_data.json` :135
- **Detail:** `"seo_local_street": "Invicta Tools & Fixings Ltd"` — this is output as `"streetAddress"` in LocalBusiness schema.org JSON-LD. Google expects a street address. Currently feeding invalid structured data to search engines.
- **Fix:** Change to actual street address (e.g., "Unit 9 Cotton Road, Wincheap Industrial Estate").

#### C10. Footer Instagram URL Is a Broken OAuth Redirect
- **File:** `sections/footer-group.json` :51
- **Detail:** The `social_instagram` value is an enormously long Instagram OAuth/OIDC callback URL, not a profile URL. Sends users to a broken authorisation page.
- **Fix:** Replace with `https://www.instagram.com/invicta_tools/` (the correct URL is already in `settings_data.json:114`).

#### C11. `phone_href` Empty in Footer — Broken `tel:` Links
- **File:** `sections/footer-group.json` :47
- **Detail:** `"phone_href": ""` while `"phone_display": "01843 210 459"`. Click-to-call links navigate to empty `tel:` URL.
- **Fix:** Set to `tel:+441843210459`.

### Performance

#### C12. Review Carousel Runs Infinite `requestAnimationFrame` Loop
- **File:** `sections/review-carousel.liquid` (inline JS)
- **Detail:** The auto-scroll animation uses `requestAnimationFrame` in an infinite loop that runs even when the carousel is not visible or the tab is in background. Burns CPU continuously.
- **Fix:** Use `IntersectionObserver` to pause when off-screen. Use CSS animations where possible.

#### C13. `base.css` Is 76.6KB Render-Blocking
- **File:** `assets/base.css`
- **Detail:** Single monolithic CSS file loaded synchronously in `<head>`. Contains 3,700+ lines including styles for components that may not appear on the current page. Delays First Contentful Paint.
- **Fix:** Split critical above-the-fold CSS inline, lazy-load remainder. Or split into route-specific chunks.

### Configuration

#### C14. `seo_org_name` Missing from Active Settings
- **File:** `config/settings_data.json`
- **Schema:** `config/settings_schema.json` :1572
- **Detail:** Used in `snippets/schema-jsonld.liquid:8` for Organization structured data. Relies on schema default fallback chain. Should be explicitly set.
- **Fix:** Add `"seo_org_name": "Invicta Tools & Fixings Ltd"` to settings_data.json.

### Templates

#### C15. Homepage Hero Image Not Marked `loading="eager"`
- **File:** `sections/invicta-hero-split.liquid`
- **Detail:** The LCP (Largest Contentful Paint) element — the hero image — is not explicitly set to `loading="eager"` and may inherit lazy loading from the theme's default image handling.
- **Fix:** Add `loading="eager"` and `fetchpriority="high"` to hero images.

#### C16. `seo_org_telephone` Missing Country Code
- **File:** `config/settings_data.json` :134
- **Detail:** `"seo_org_telephone": "01227458333"` — missing `+44` prefix. Schema.org requires E.164 format. Also differs from the phone displayed in the footer.
- **Fix:** Change to `"+441227458333"` and reconcile with footer phone.

#### C17. Duplicate `aria-label` on Cart Notification
- **File:** `snippets/cart-notification.liquid` :18-20
- **Detail:** Two `aria-label` attributes on same element. Second (hardcoded English) overrides the first (translated). Screen readers use wrong value.
- **Fix:** Remove the duplicate hardcoded `aria-label`.

#### C18. Three Different Phone Numbers Across Theme
- **Files:** `footer-group.json` :47, `settings_data.json` :134, `sections/local-hub.liquid` :63
- **Detail:** Footer shows `01843 210 459`, SEO schema uses `01227458333`, local hub has `01843 210 459`. Inconsistent phone numbers confuse customers and damage SEO.
- **Fix:** Centralise to a single source of truth in theme settings.

---

## HIGH FINDINGS (32)

### Dead Code & Bloat

#### H1. 17 Dead Snippets (~30% of Snippet Directory)
- **Files:** `snippets/` — 17 files never rendered from any section, layout, or template
- **Dead files:** `icon-account.liquid`, `icon-cart.liquid`, `icon-cart-empty.liquid`, `icon-usp.liquid`, `icon-with-text.liquid`, `cart-notification.liquid`, `header-search.liquid`, `price.liquid`, `buy-buttons.liquid`, `product-variant-picker.liquid`, `product-media.liquid`, `product-thumbnail.liquid`, `tiered-pricing.liquid`, `consumables-pricing.liquid`, `min-order-qty.liquid`, `quote-modal.liquid`, `quick-order-product-row.liquid`
- **Impact:** ~2,500+ lines of dead code. 30% snippet bloat.
- **Fix:** Delete all 17 files.

#### H2. Stale Duplicate Brand Pill in Assets Directory
- **File:** `assets/invicta-brand-pill.liquid` (565 lines)
- **Detail:** Copy of the brand pill snippet in `assets/`. Shopify's `{% render %}` only looks in `snippets/`. Completely inert dead weight with corrupted render calls.
- **Fix:** Delete `assets/invicta-brand-pill.liquid`.

#### H3. 5 Deprecated Sections Still in Codebase
- **Files:** `sections/invicta-collection-grid.liquid`, `sections/main-collection-product-grid.liquid`, `sections/brand-featured-products.liquid`, `sections/invicta-announcement-bar.liquid`, `sections/invicta-popular-categories.liquid`
- **Detail:** THEME-GUIDE.md explicitly lists these as deprecated with replacements. They remain in the repo.
- **Fix:** Verify no template references, then delete.

#### H4. AI-Generated Block File
- **File:** `blocks/ai_gen_block_b568045.liquid`
- **Detail:** Auto-generated block with non-standard naming. Likely experimental.
- **Fix:** Review and delete if unused.

### Performance

#### H5. 172 `!important` Declarations in CSS
- **Files:** Across `base.css`, `invicta-ux-improvements.css`, component CSS files
- **Detail:** Indicates specificity wars and fragile override chains. Makes CSS nearly impossible to maintain predictably.
- **Fix:** Refactor CSS specificity. Reduce `!important` to under 20 (animation/utility only).

#### H6. ~330KB Total CSS Payload
- **Files:** All CSS assets combined
- **Detail:** 77 CSS files totalling ~330KB uncompressed. Even with Shopify's gzip, this is excessive for a tools shop.
- **Fix:** Audit and remove unused rules. Consolidate overlapping files.

#### H7. Memory Leak in Collection Filters
- **File:** `assets/invicta-collection-filters.js`
- **Detail:** Event listeners added on filter change without cleanup. On long collection browsing sessions, event handlers accumulate.
- **Fix:** Use `AbortController` or remove listeners before re-adding.

#### H8. Facets Snippet Is 900 Lines with Triple Duplication
- **File:** `snippets/facets.liquid`
- **Detail:** Desktop, mobile, and drawer filter modes contain nearly identical rendering loops. Any bug fix must be applied 3 times.
- **Fix:** Extract shared filter rendering into a sub-snippet.

#### H9. CSS Variables Snippet Outputs 190 Lines Inline
- **File:** `snippets/invicta-css-variables.liquid` :17-189
- **Detail:** All design tokens delivered as inline `<style>` on every page (~4KB). Cannot be cached by browser.
- **Fix:** Move to external CSS file where possible, keep only dynamic values inline.

#### H10. Brand Pill Has 460-Line If/ElsIf + Case/When Chain
- **File:** `snippets/invicta-brand-pill.liquid` :39-459
- **Detail:** 227-line if/elsif mapping vendor names to brand keys, followed by 227-line case/when mapping to colours. Unmaintainable.
- **Fix:** Move brand config to a JSON metafield or theme setting.

### Visual Consistency

#### H11. Three Different "Invicta Red" Hex Values
- **Files:** `settings_data.json`, `footer-group.json`, `header-group.json`, multiple template JSONs
- **Values:** `#e41e25`, `#e42e28`, `#e11d26`
- **Fix:** Standardise to one value. Reference via colour scheme settings, not hardcoded hex.

#### H12. Button Contrast Fails WCAG AA
- **File:** `config/settings_data.json`
- **Detail:** `scheme-1`: button `#e41e25` with label `#262626` = ~2.8:1 contrast ratio. WCAG AA requires 4.5:1.
- **Fix:** Change button label to `#ffffff` (white) for all red-background buttons.

#### H13. Vestigial Brown Colour in Scheme-3
- **File:** `config/settings_data.json` :192
- **Detail:** `secondary_button_label: #54483c` — leftover from original Trade earth-tone palette. Inconsistent with Invicta brand.
- **Fix:** Update to appropriate brand colour.

### Structured Data & SEO

#### H14. Product Schema Missing SKU/MPN/Brand/Reviews
- **File:** `snippets/schema-jsonld.liquid` :91-92
- **Detail:** Uses only `{{ product | structured_data }}`. Missing `sku`, `mpn`, `brand`, `aggregateRating`, `gtin`, custom `offers` with `priceValidUntil` and `itemCondition`. Critical for Google Shopping rich results in tools vertical.
- **Fix:** Build custom Product schema with all required properties.

#### H15. BreadcrumbList Uses Arbitrary Collection
- **File:** `snippets/schema-jsonld.liquid` :97-130
- **Detail:** Uses `product.collections | first` which picks an arbitrary collection, not necessarily the navigational breadcrumb path.
- **Fix:** Use the main menu structure or a metafield to determine correct breadcrumb hierarchy.

#### H16. Missing FAQPage Schema on FAQ Template
- **File:** `sections/invicta-faq.liquid`
- **Detail:** The FAQ page renders accordion content but outputs no `FAQPage` schema.org structured data. Misses FAQ rich result eligibility.
- **Fix:** Add FAQPage JSON-LD based on section blocks.

#### H17. Missing Article Schema on Blog Posts
- **File:** `sections/main-article.liquid`
- **Detail:** No Article/BlogPosting schema.org markup on blog article pages.
- **Fix:** Add Article JSON-LD with author, datePublished, image.

#### H18. Five SEO Settings Missing from Active Data
- **File:** `config/settings_data.json`
- **Schema:** `config/settings_schema.json` :1520-1563
- **Detail:** `seo_noindex_filtered_collections`, `seo_noindex_paginated_collections`, `seo_paginated_noindex_from_page`, `seo_noindex_search_results`, `seo_robots_block_filter_params` — all defined but never persisted. Rely on schema defaults.
- **Fix:** Explicitly set in settings_data.json.

### Configuration

#### H19. `inv_free_shipping_pence` Is Text Type Instead of Range
- **File:** `config/settings_schema.json` :1490-1495
- **Detail:** Defined as `"type": "text"` with default `"3000"`. Requires `| plus: 0` coercion in 4 files. No input validation.
- **Fix:** Change to `"type": "range"` with min/max/step.

#### H20. Inconsistent Business Hours Across 3 Sources
- **Files:** `settings_data.json` :139, `sections/local-hub.liquid` :63/:83, `footer-group.json`
- **Detail:** SEO schema: "Mo-Fr 07:00-17:00" (no Sat). Local hub: "Mon-Fri 7:30-17:00, Sat 8:00-12:00". Footer: "Mon-Fri 07:00-17:00, Sat-Sun Closed". Three formats, three different hours, contradictory Saturday info.
- **Fix:** Centralise hours in theme settings. Reference everywhere.

#### H21. Footer Social Links Dual-Source Conflict
- **File:** `sections/footer-group.json` :49-51 vs `config/settings_data.json` :113-121
- **Detail:** Custom footer section defines its own social fields (with broken Instagram URL) while global settings have separate social fields. LinkedIn only in footer; Twitter/YouTube/etc only in global.
- **Fix:** Use a single source (global settings) for all social links.

### Hardcoded Content

#### H22. `local-hub.liquid` Entirely Hardcoded
- **File:** `sections/local-hub.liquid` :55-92
- **Detail:** Both branch locations (Canterbury, Ramsgate) have addresses, phones, hours, button text hardcoded in Liquid. No translation keys, no section settings. Requires code change to update.
- **Fix:** Refactor to use section settings/blocks for branch data.

#### H23. Hardcoded English in Custom Snippets
- **Files:** `tiered-pricing.liquid`, `consumables-pricing.liquid`, `min-order-qty.liquid`, `quote-modal.liquid`, `invicta-section-header.liquid`, `invicta-brand-pill.liquid`
- **Detail:** Dozens of hardcoded English strings: "Bulk Discounts", "Quantity", "Price Each", "You Save", "Request a Quote", all form labels, "Home", "Official Dealer", etc.
- **Fix:** Move all to `locales/en.default.json` under `invicta.*` namespace.

#### H24. Custom Settings Groups Use Hardcoded Labels
- **File:** `config/settings_schema.json` :1468, :1513
- **Detail:** "Invicta Trade Settings" and "SEO & Crawl Control" groups use raw English instead of `t:settings_schema.*` keys. Breaks the pattern of all standard groups.
- **Fix:** Add translation keys to schema locale file.

### PWA

#### H25. Service Worker Registration Silently Fails
- **File:** `snippets/pwa-head.liquid` :75
- **Detail:** `navigator.serviceWorker.register('{{ "service-worker.js" | asset_url }}', { scope: '/' })` — Shopify assets are served from `cdn.shopify.com`. A service worker from a CDN origin cannot control the shop's `/` scope. Registration silently fails.
- **Fix:** Either serve SW from shop domain via a proxy page, or remove SW registration.

### Sections

#### H26. Mega Menu Inline CSS (~200 Lines)
- **File:** `sections/mega-menu.liquid`
- **Detail:** ~200 lines of inline `<style>` in the section. Renders on every page where the header loads. Uncacheable.
- **Fix:** Extract to `assets/section-mega-menu.css`.

#### H27. Header Section Inline CSS (~150 Lines)
- **File:** `sections/header-invicta.liquid`
- **Detail:** ~150 lines of inline `<style>`. Same caching problem as mega menu.
- **Fix:** Extract to `assets/section-header-invicta.css`.

#### H28. Product V2 Section Inline CSS (~300 Lines)
- **File:** `sections/invicta-product-v2.liquid`
- **Detail:** ~300 lines of inline `<style>`. Largest inline CSS block in the theme.
- **Fix:** Extract to `assets/section-invicta-product-v2.css`.

#### H29. Collection Filters Inline CSS (~100 Lines)
- **File:** `sections/invicta-collection-filters.liquid`
- **Detail:** ~100 lines of inline `<style>`.
- **Fix:** Extract to `assets/section-invicta-collection-filters.css`.

#### H30. No Script Re-execution Guard on Section Rendering API
- **File:** Multiple sections with inline `<script>`
- **Detail:** Shopify's Section Rendering API can re-inject section HTML via AJAX. Inline scripts re-execute on each injection, causing duplicate event listeners and state corruption.
- **Fix:** Add `customElements.get()` guards or use `connectedCallback` idempotency.

### Assets

#### H31. `global.js` Memory: No `disconnectedCallback` Cleanup
- **File:** `assets/global.js`
- **Detail:** Web Components defined in global.js add event listeners in `connectedCallback` but many lack `disconnectedCallback` to clean up. Components destroyed by Section Rendering API leak listeners.
- **Fix:** Add `disconnectedCallback` with listener cleanup to all custom elements.

#### H32. No Subresource Integrity (SRI) on Third-Party Scripts
- **Files:** `layout/theme.liquid`, various sections
- **Detail:** If any external scripts are loaded (analytics, reviews), they lack `integrity` and `crossorigin` attributes.
- **Fix:** Add SRI hashes to all third-party script tags.

---

## MEDIUM FINDINGS (50) — Summary

| # | Area | Finding | File |
|---|------|---------|------|
| M1 | CSS | `consumables-pricing.liquid` hardcodes `£` symbol | :89,:91 |
| M2 | CSS | `pwa-head.liquid` hardcodes "Invicta Tools" as app title | :28 |
| M3 | CSS | `schema-jsonld.liquid` hardcodes `"priceRange": "££"` | :78 |
| M4 | Config | `text_gutter_left` orphaned in Colors group | settings_schema:104 |
| M5 | Config | `scheme-3` vestigial brown `#54483c` | settings_data:192 |
| M6 | a11y | Missing `| escape` on 7+ user-controlled values | Multiple snippets |
| M7 | a11y | Country localization hardcoded duplicate `id` | country-localization:49 |
| M8 | a11y | Product card images only 3 srcset widths (max 600w) | invicta-product-card:91 |
| M9 | a11y | Cart drawer inline `<style>` block | cart-drawer snippet:14 |
| M10 | a11y | `progress-bar.liquid` has no ARIA attributes | progress-bar:1-5 |
| M11 | Perf | Tiered pricing floating-point precision errors | tiered-pricing:50-53 |
| M12 | Perf | Quote modal missing bot protection | quote-modal:44-151 |
| M13 | DRY | Cart breakdown & product card duplicate VAT calc | Multiple files |
| M14 | DRY | `quick-order-list-row.liquid` duplicates 80 lines mobile/desktop | :61-145, :324-408 |
| M15 | SEO | `schema-jsonld.liquid` hardcodes `"addressCountry": "GB"` | :83 |
| M16 | Config | No localization files beyond English | locales/ |
| M17 | Config | `seo_local_hours` inconsistent format | settings_data:139 |
| M18-50 | Various | Additional inline CSS debt, minor a11y, i18n gaps | Various |

---

## LOW FINDINGS (40) — Summary

| Category | Count | Examples |
|----------|-------|---------|
| Dead code cleanup | 8 | Disabled footer section, AI block, empty brand fields |
| Minor a11y | 10 | Missing `sizes` on images, `tabindex=-1` patterns, social links missing `target="_blank"` |
| Documentation | 5 | Inconsistent comment styles, missing version headers |
| UX recommendations | 8 | Cart type `notification` vs `drawer` for B2B, predictive search hiding prices |
| Code style | 9 | Emoji in source, `class` as parameter name, boolean logic without parens |

---

## POSITIVE FINDINGS

The audit also confirmed significant strengths:

1. **No jQuery or heavy framework** — all vanilla JS with Web Components
2. **All JS properly deferred** — no render-blocking scripts (except cart handler)
3. **Good design token system** — `invicta-css-variables` provides centralised custom properties
4. **Modern event architecture** — `invicta:vat-toggle`, `invicta:cart:added` custom events
5. **95% Online Store 2.0** — only 2 legacy Liquid templates (both Shopify edge cases)
6. **Proper translation infrastructure** — `invicta.*` namespace in locales, most strings translated
7. **Robots.txt blocks filter params** — prevents thin content indexing
8. **Good Shopify CDN usage** — `| asset_url`, `| image_url` filters used correctly
9. **Responsive images** — most images use `srcset` (though widths could be expanded)
10. **Clean git history** — clear commit messages, phased approach

---

## RECOMMENDED FIX PRIORITY

### Phase 1: Security (CRITICAL — Do Immediately)
1. Fix XSS in predictive search (C1)
2. Fix XSS in brand pill inline handler (C2)
3. Fix XSS in customer account pages (C3)
4. Add CSRF to product card forms (C4)
5. Extract cart handler to external JS (C5)

### Phase 2: Accessibility (CRITICAL)
6. Add keyboard/ARIA support to mega menu (C6)
7. Add focus trap to cart drawer (C7)
8. Add pause control to review carousel (C8)
9. Fix duplicate aria-label on cart notification (C17)

### Phase 3: Structured Data & SEO (CRITICAL + HIGH)
10. Fix street address in schema (C9)
11. Fix Instagram URL in footer (C10)
12. Fix phone href in footer (C11)
13. Fix phone country code (C16)
14. Centralise phone numbers (C18)
15. Add explicit SEO settings (H18)
16. Enhance Product schema (H14)
17. Fix breadcrumb collection (H15)
18. Add FAQPage schema (H16)
19. Add Article schema (H17)

### Phase 4: Dead Code Removal (HIGH)
20. Delete 17 dead snippets (H1)
21. Delete stale brand pill asset (H2)
22. Delete 5 deprecated sections (H3)
23. Delete AI block (H4)

### Phase 5: Performance (HIGH)
24. Fix infinite rAF loop in review carousel (C12)
25. Extract inline CSS from mega menu (H26)
26. Extract inline CSS from header (H27)
27. Extract inline CSS from product V2 (H28)
28. Extract inline CSS from collection filters (H29)
29. Extract CSS variables to external file (H9)
30. Fix hero image loading (C15)

### Phase 6: Configuration & Consistency (HIGH)
31. Standardise brand red colour (H11)
32. Fix button contrast (H12)
33. Fix free shipping setting type (H19)
34. Centralise business hours (H20)
35. Fix social links dual source (H21)
36. Refactor local-hub to use settings (H22)
37. Move hardcoded strings to translations (H23, H24)

### Phase 7: Code Quality (HIGH)
38. Refactor brand pill data mapping (H10)
39. Refactor facets triple-duplication (H8)
40. Fix memory leaks in collection filters (H7)
41. Add disconnectedCallback cleanup (H31)
42. Add script re-execution guards (H30)
43. Fix PWA service worker (H25)
44. Remove vestigial colours (H13)
45. Add SRI to external scripts (H32)

---

*End of Phase 2 Audit Report*
