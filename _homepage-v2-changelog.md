# Homepage v2 Changelog

## Overview
Converted the Invicta Tools homepage to a new layout with clean image rendering, no gradients, no glows, and no dark overlays on images.

## Changes

### Phase 1: Hero v3 (`sections/invicta-hero-v3.liquid`)
- **Removed** radial glow circle behind product image (`inv-hero-v3__glow` div and its CSS)
- **Removed** box-shadow glow on primary CTA hover (`var(--inv-accent-glow)`)
- **Removed** box-shadow from button transition list
- **Added** `padding_top` and `padding_bottom` range settings to schema (0-80px)
- **Fixed** heading sizes: 26px mobile, 34px tablet, 44px desktop (was 28/36/46)
- **Fixed** eyebrow padding to 5px 14px (was 5px 12px)
- **Fixed** description max-width to 400px (was 420px)
- **Fixed** min-height to 380px (was 300/400)
- **Added** `grid-column: 1 / -1` when no hero image is set
- **Added** mobile padding breakpoint at 749px (16px padding)
- **Added** focus-visible with 2px solid accent, 2px offset on all CTAs
- Image renders clean with no overlay, no filter, no opacity change

### Phase 2: Trust Strip (`sections/invicta-trust-strip.liquid`)
- No changes needed — already compliant with all gates
- Red accent background, circle icons, proper responsive breakpoints
- Icons via case statement (truck, shield, location, phone, etc.)
- ARIA attributes present, prefers-reduced-motion present

### Phase 3: Promo Banners (`sections/invicta-promo-banners.liquid`)
- **Removed** gradient backgrounds on cards (`linear-gradient` on `.inv-promos__card--1` and `--2`)
- **Removed** `::after` pseudo-element gradient overlay on images
- **Restructured** layout: image displays CLEAN on top, text sits BELOW in a footer div
- **Added** `inv-promos__image-area` wrapper with `aspect-ratio: 16/9`
- **Added** `inv-promos__footer` div for tag, title, subtitle text
- **Changed** card to `flex-direction: column` with `var(--inv-dark)` solid background
- **Changed** hover to `translateY(-2px)` with `var(--inv-shadow-md)` (no glow)
- **Removed** gradient colour settings from schema (`banner_X_gradient_start`, `banner_X_gradient_end`)
- **Kept** all existing settings: images, links, tags, titles, subtitles, date windows
- **Added** focus-visible with 2px solid accent, 2px offset
- **Added** `aria-label` on section element

### Phase 4: Quick Categories (`sections/invicta-quick-cats.liquid`)
- No changes needed — already compliant with all gates
- 12px border-radius, card body with `var(--inv-bg-card-body)`, product count
- Hover matches product cards (lift + shadow, no glow)
- Grid: 6 desktop, 3 tablet, 2 mobile

### Phase 5: Index JSON (`templates/index.json`)
- **Changed** hero section key from `invicta_hero_v3_HEkjRd` to `hero_v3`
- **Changed** trust strip key from `invicta_trust_strip_KM6y8M` to `trust_strip`
- **Updated** hero_image to `shopify://shop_images/PDP_HOMEPAGE_2.png`
- **Added** button_link: `shopify://products/p6-twc-125mm`
- **Added** secondary_link: `shopify://collections/deals-and-sales`
- **Removed** gradient settings from promo_banners entry
- **Updated** order array to: hero_v3, trust_strip, promo_banners, quick_cats, product_wall, trust_reviews, recently_viewed, invicta_newsletter_t9TTnj

### Phase 6: Print & A11y (`assets/invicta-print.css`)
- **Updated** hero v3 print rules: removed `.inv-hero-v3__glow` reference
- **Updated** promo banners print rules: targets new `.inv-promos__image-area` and `.inv-promos__footer` classes
- All new sections have `<section>` with `aria-label`
- Trust strip uses `<ul role="list">` for USP list
- `prefers-reduced-motion: reduce` present in all new/modified sections
- `focus-visible` on all interactive elements (CTAs, card links)

## Untouched Files
- `sections/invicta-hero-split.liquid` — unchanged
- `sections/invicta-usp-strip-v2.liquid` — unchanged
- `sections/header-invicta.liquid` — unchanged
- `sections/invicta-footer.liquid` — unchanged
- `sections/invicta-product-wall.liquid` — unchanged
- `sections/invicta-trust-reviews.liquid` — unchanged
- `sections/invicta-recently-viewed.liquid` — unchanged
- `sections/invicta-newsletter.liquid` — unchanged

## Gate Check Results
- Zero `gradient` in CSS (only in comments)
- Zero `glow`, `radial`, `mesh`, `blur`, `frosted`, `backdrop-filter` in CSS
- Zero `::before`/`::after` overlay pseudo-elements
- All colours use `var(--inv-*)` tokens or `rgba()` functions
- Valid JSON (passes `json.load()`)
- 8 entries in order array in correct sequence
- Hero image path: `shopify://shop_images/PDP_HOMEPAGE_2.png`
- USP text matches: Free Next-Day Delivery, Authorised Dealer, Click & Collect, Hassle-Free Returns
