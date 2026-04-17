# Invicta Theme Audit & Action Plan

**Date:** 17 April 2026
**Source:** SimGym AI Review cross-referenced against actual theme code (`invictatools-main`)
**Theme version:** Trade 15.4.0 compatible, 397 files

---

## Audit Summary

SimGym flagged 16 issues. After auditing the code, **7 are genuinely missing or broken**, **5 are partially implemented** (foundations exist but incomplete), and **4 are already handled or overstated**. Below is the reality check, then the phased plan.

---

## Findings: What's Real vs What's Noise

### ALREADY HANDLED (No action needed)

**Slide-out mini-cart** — Fully implemented. `cart-drawer.liquid` (675 lines) with overlay, animations, keyboard accessibility, focus trap.

**Cross-sells in cart** — Working. `cart-drawer-crosssell.js` fetches complementary products via Shopify Recommendations API, filters out items already in cart, falls back to configured collection. Up to 4 products shown.

**Free delivery progress bar** — Working. `invicta-free-delivery-bar.liquid` shows £99 threshold progress, pulses at 75-99%, updates on cart changes.

**Delivery estimator on PDP** — Working. `invicta-delivery-estimate.liquid` shows next-day delivery countdown (2pm cutoff on weekdays), supplier items show "3-5 working days". Shown in PDP stock banner (lines 818-871 of `invicta-product-v2.liquid`).

**Zero-state guidance on collections** — Implemented. Empty state shows remove-filter chips, clear-all link, and helpful messaging (lines 469-510 of `invicta-collection.liquid`).

**Filter counts and disabled facets** — Implemented. Facet counts shown `({{ value.count }})`, zero-count facets disabled (line 366/568 of `invicta-collection.liquid`).

**Breadcrumbs** — Exist on brand pages via `breadcrumb-simple.liquid`. Static config (parent URL + current page via schema settings). Not context-aware, but functional for the brand page use case.

---

### PARTIALLY IMPLEMENTED (Foundation exists, needs completing)

**1. Express pay in cart drawer**
Status: Missing from drawer, exists on full cart page.
The cart drawer (line 634-645 of `cart-drawer.liquid`) has a standard checkout form submit only. `main-cart-items.liquid` (line 523) has dynamic checkout buttons (Apple Pay, Google Pay, PayPal) but the drawer doesn't.
Severity: **HIGH** — mobile conversion impact.
Fix: Add Shopify Payment Button component after checkout button in drawer.

**2. Collection filtering is full page reload, not AJAX**
Status: Filters work, but every filter change triggers `window.location.href = buildFilterUrl()` (lines 826/834 of `invicta-collection.liquid`). Search page *does* have AJAX filtering (`invicta-search-page.js`).
Severity: **MEDIUM** — friction on collections, especially mobile. The search page already proves the AJAX pattern works.
Fix: Port the AJAX pattern from `invicta-search-page.js` to collection filtering.

**3. Product cards lack specs/quick-add**
Status: Cards (`invicta-product-card.liquid`) show image, stock status bar, sale badge, brand pill, title, VAT-toggle pricing. No spec chips (voltage, disc size, etc.), no Quick Add button, no Quick View, no Compare.
Severity: **MEDIUM** — scanning and conversion from collection/search grids.
Fix: Add metafield-driven spec chips and a Quick Add button to the card template.

**4. Reviews not on PDP**
Status: `invicta-trust-reviews.liquid` exists but it's a homepage section showing aggregate platform ratings (Google, Facebook, Trustpilot). No per-product reviews on the PDP. Dealer badge exists (lines 877-907 of `invicta-product-v2.liquid`) with brand-coloured styling. Warranty details section exists (line 1259+).
Severity: **MEDIUM** — trust signal gap on the page that matters most.
Fix: Integrate a reviews app (Judge.me, Loox, etc.) into `product.json` template.

**5. Tiered pricing exists but not rendered on PDP**
Status: `component-tiered-pricing.js` exists and is functional (listens for quantity changes, highlights active tier). The tiered pricing HTML *is* in `invicta-product-v2.liquid` (line 982-1009) and renders when price breaks exist. SimGym may have tested a product without volume pricing.
Severity: **LOW** — already working for products with price breaks configured.
Fix: Verify it renders on products with actual volume pricing. No code change likely needed.

---

### GENUINELY MISSING (Needs building)

**6. Category landing pages link to pages, not collections**
Status: This is the biggest structural issue. `page.power-tool-accessories.json` links to `shopify://pages/sds-bits`, `shopify://pages/drill-bits`, etc. These go to more static landing pages, not to filterable `/collections/` URLs. The `invicta-category-grid` section does fall back to collection URLs when the `link` field is blank (the grid pulls from `block.settings.collection`), but several templates override this with explicit page links.
Severity: **HIGH** — shoppers hit page after page instead of reaching a product grid with filters. Direct revenue impact.
Fix: Update category grid block settings to point to `/collections/` handles instead of `/pages/`. Remove or redirect orphan landing pages.

**7. No mega-menu on desktop**
Status: `header-invicta.liquid` is 300 lines. Desktop shows logo, search, VAT toggle, account, cart. The navigation menu is a `link_list` reference (`main-menu`) but only renders in the mobile drawer. There is no desktop mega-menu flyout.
Severity: **HIGH** — desktop users have no visible category navigation. They must search or scroll the homepage.
Fix: Build a desktop mega-menu from the same `link_list`, with flyout panels for subcategories.

**8. No cookie consent**
Status: Zero implementation. Searched `cookie`, `consent`, `gdpr`, `privacy` across all liquid files — nothing. Only a privacy policy link in the footer.
Severity: **HIGH** — GDPR/PECR compliance risk. UK ICO can fine. Also blocks analytics implementation.
Fix: Implement a non-blocking bottom banner. Shopify's Customer Privacy API or a lightweight consent manager (CookieYes, Termly).

**9. No analytics event tracking**
Status: Zero. No `gtag`, `dataLayer`, `analytics`, `fbq`, or `track` calls anywhere in the theme. `schema-jsonld.liquid` has good structured data (Product, Organization, LocalBusiness, SearchAction) but that's SEO, not analytics.
Severity: **HIGH** — flying blind. No product view, add-to-cart, or purchase event data. Can't measure anything the SimGym report recommends.
Fix: Implement GA4 via Shopify's Customer Events (server-side, consent-aware). Add product_view, add_to_cart, begin_checkout, purchase events minimum.

**10. No search synonyms or typo handling**
Status: `invicta-search.js` and `invicta-search-page.js` have no synonym maps, typo tolerance, or fuzzy matching. Predictive search uses Shopify's native API (`/search/suggest.json`). Full search is Shopify's native `/search?q=`.
Severity: **MEDIUM** — trade terms have many variants (vise/vice, multi tool/multitool, SDS/sds-plus). Shopify's native search handles some basics but not trade-specific synonyms.
Fix: Either add a client-side synonym redirect map, or move to a search service (Searchanise, Algolia, Boost Commerce) that supports synonyms natively.

**11. Tools vs Accessories not separated**
Status: No product_type scoping, no chip-based filtering at top of results, no default scoping logic. Search and collection pages treat all products equally.
Severity: **MEDIUM** — accessory results crowd tool queries.
Fix: Add a product_type chip bar above results on search and collection pages. Could be done with existing tag/type data.

**12. Breadcrumbs not context-aware on PDP**
Status: `breadcrumb-simple.liquid` only appears on brand pages. PDPs have no breadcrumbs at all. No back-to-collection link that preserves filters/sort/scroll.
Severity: **LOW-MEDIUM** — breaks comparison flow when browsing collections.
Fix: Add dynamic breadcrumbs to PDP that read the referring collection from URL or sessionStorage.

---

## Phased Action Plan

### Phase 1: Foundations (Week 1-2) — Compliance + Measurement

These must come first because everything else depends on being able to measure impact and being legally compliant.

| # | Task | Effort | Revenue Impact |
|---|------|--------|----------------|
| 1 | **Cookie consent banner** — Non-blocking bottom banner using Shopify Customer Privacy API. | 1 day | Compliance (risk removal) |
| 2 | **GA4 analytics events** — Product view, add_to_cart, begin_checkout, purchase via Shopify Customer Events. Consent-gated. | 2-3 days | Enables all measurement |
| 3 | **Desktop mega-menu** — Build flyout navigation from existing `main-menu` link_list. Categories, subcategories, featured items. | 3-4 days | HIGH — desktop users currently have no nav |

### Phase 2: Fix the Purchase Path (Week 3-4)

Remove friction between "I found it" and "I bought it."

| # | Task | Effort | Revenue Impact |
|---|------|--------|----------------|
| 4 | **Category pages → collections** — Update `page.power-tool-accessories.json`, `page.saw-blades.json` etc. to link to `/collections/` handles instead of `/pages/`. Redirect orphan pages. | 1 day | HIGH — unblocks browsing-to-buying |
| 5 | **Express pay in cart drawer** — Add Shopify dynamic checkout buttons to `cart-drawer.liquid`. | 0.5 day | HIGH — mobile checkout conversion |
| 6 | **AJAX filtering on collections** — Port pattern from `invicta-search-page.js` to `invicta-collection.liquid`. Replace `window.location.href` with fetch + DOM swap. | 2-3 days | MEDIUM — reduces filter friction |
| 7 | **PDP breadcrumbs** — Dynamic breadcrumbs showing originating collection, preserving filters on back-click. | 1 day | LOW-MEDIUM — improves comparison flow |

### Phase 3: Convert Better (Week 5-6)

Improve conversion rate on pages people already reach.

| # | Task | Effort | Revenue Impact |
|---|------|--------|----------------|
| 8 | **Product reviews on PDP** — Integrate Judge.me or equivalent. Star rating above fold, review section below. | 1-2 days | MEDIUM — trust signal |
| 9 | **Product card enrichment** — Spec chips from metafields (voltage, size, etc.), Quick Add button. | 2-3 days | MEDIUM — faster scanning, fewer clicks |
| 10 | **Tools vs Accessories chips** — Product type chip bar above collection/search results for scoping. | 1 day | MEDIUM — relevance improvement |

### Phase 4: Polish (Week 7-8)

Nice-to-haves that improve the experience but aren't blocking revenue.

| # | Task | Effort | Revenue Impact |
|---|------|--------|----------------|
| 11 | **Search synonyms** — Client-side redirect map for trade terms, or evaluate Searchanise/Algolia. | 1-2 days | LOW-MEDIUM |
| 12 | **Delivery info on collection cards** — Surface free shipping threshold and ETA outside PDP. | 1 day | LOW |

---

## What I'd Skip

**"Make breadcrumbs context-aware and preserve list state"** on brand pages — The current static breadcrumbs on brand pages are fine. Brand pages are landing pages, not mid-funnel. The PDP breadcrumb fix (item 7) covers the real problem.

**"Add domain-specific facets to key collections"** (saw blade diameter, battery voltage, etc.) — This requires metafield population across the catalogue first. It's a data project, not a theme project. Worth doing eventually but not in this roadmap. Once metafields exist, Shopify's native filtering will expose them automatically.

**"Enrich collection cards with ratings, warranty badges, brand logos"** — Brand pills already show on cards. Ratings need a reviews app first (item 8). Warranty badges on cards add visual noise for marginal benefit. Revisit after Phase 3.

---

## Total Estimated Effort

Phases 1-3 (the work that matters): **~15-20 dev days**
Phase 4 (polish): **~3-4 dev days**

The mega-menu and category-to-collection fixes will have the biggest immediate impact on revenue because they directly unblock the browse-to-buy path that's currently broken for desktop users.
