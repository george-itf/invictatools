# Homepage Conversion Changelog

**Date:** 2026-03-18
**Branch:** claude/convert-homepage-layout-DH0iQ
**Theme version:** Trade 15.4.0

## Files Created

### sections/invicta-hero-v3.liquid
- New full-bleed dark hero section with 2-column layout
- Left: eyebrow tag, condensed uppercase title, description, dual CTAs
- Right: product image with radial gradient glow
- Barlow Condensed font loaded via Google Fonts
- Responsive: single column below 990px, reduced sizing below 750px
- All text from section settings (no hardcoded content)
- Complete schema with presets

### sections/invicta-trust-strip.liquid
- New red accent trust strip with circle icons and dividers
- 4-column desktop, 2-column tablet, single column mobile
- Reuses same SVG icon system from invicta-usp-strip-v2.liquid
- Same block structure (type: "usp" with icon, title, subtitle)
- Semantic HTML: `<ul>` with `role="list"`, items as `<li>`

## Files Modified

### sections/invicta-promo-banners.liquid (v8.0 → v9.0)
- Converted from image-only cards to dark gradient cards with overlay text
- Added: tag badge, title, subtitle text overlays
- Added: configurable gradient colours per banner (start/end colour pickers)
- Background images now render as card backgrounds with gradient overlay on top
- Preserved: date-windowed visibility, existing image/link settings
- Added: descriptive aria-label on banner links

### sections/invicta-quick-cats.liquid (v1.4 → v2.0)
- Card-style visual treatment: 12px border-radius, card body background
- Border-top separator between image and body
- Hover lift (translateY -4px) with shadow matching product card pattern
- Added product count below category title
- Added show_count checkbox per block
- Preserved: icon fallback system, collection image logic, URL resolution

### templates/index.json
- Added: hero_v3 section with settings populated from original hero_split data
- Added: trust_strip section with blocks matching original USP content
- Updated: promo_banners settings with new text fields and gradient colours
- Updated: quick_cats blocks with show_count setting
- Updated: order array to new homepage sequence (8 entries)
- Preserved: hero_split and invicta_usp_strip_v2_eepGaQ in sections object (not in order)
- Preserved: all original section IDs (product_wall, trust_reviews, recently_viewed, newsletter)

### assets/invicta-print.css
- Added: Hero v3 print rules (hide visual column, show text at full width)
- Added: Trust strip print rules (simple text list, hide circle icons)
- Added: Promo banners v9.0 print rules (hide gradients/images, show text)

## Untouched Files (verified)
- sections/invicta-hero-split.liquid — UNMODIFIED
- sections/invicta-usp-strip-v2.liquid — UNMODIFIED
- sections/header-invicta.liquid — UNTOUCHED
- sections/invicta-footer.liquid — UNTOUCHED
- sections/invicta-product-wall.liquid — UNTOUCHED
- sections/invicta-trust-reviews.liquid — UNTOUCHED
- sections/invicta-recently-viewed.liquid — UNTOUCHED
- sections/invicta-newsletter.liquid — UNTOUCHED

## New Homepage Section Order
1. hero_v3 (invicta-hero-v3)
2. trust_strip (invicta-trust-strip)
3. promo_banners (invicta-promo-banners)
4. quick_cats (invicta-quick-cats)
5. product_wall (invicta-product-wall)
6. trust_reviews (invicta-trust-reviews)
7. recently_viewed (invicta-recently-viewed)
8. invicta_newsletter_t9TTnj (invicta-newsletter)

## Compliance
- All new CSS classes use inv- prefix with BEM naming
- All colours use var(--inv-*) tokens (hex only in rgba(), schema defaults, and Google Fonts URL)
- No hardcoded z-index values >= 10
- No !important in section CSS (only in print.css per convention)
- No outline: none in new code
- All interactive elements have focus-visible states using var(--inv-accent)
- All sections include @media (prefers-reduced-motion: reduce)
- Mobile-first responsive: 750px and 990px breakpoints
