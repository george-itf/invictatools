# CLS & Loading Performance Fixes — Changelog

## Changes Made

### 1. CRITICAL: Lazy CSS → Synchronous (layout/theme.liquid)
**Files:** `layout/theme.liquid`
**What:** Moved `invicta-brand-pill.css`, `invicta-product-card.css`, and `invicta-radius-reset.css` from lazy-load (`media="print" onload="this.media='all'"`) to synchronous `<link rel="stylesheet">`.
**Why:** These files contain layout-critical properties (`display`, `flex`, `aspect-ratio`, `border-radius` with `overflow`). Lazy loading caused product cards, brand pills, and styled elements to reflow after first paint — the biggest CLS source.
**Risk:** Slightly increases render-blocking CSS. However, these files are used on virtually every product-listing page and are relatively small. The CLS reduction far outweighs the minor render-blocking cost.

### 2. CRITICAL: Announcement bar min-height (sections/announcement-bar.liquid)
**Files:** `sections/announcement-bar.liquid`
**What:** Added `min-height: 30px` to `.utility-bar`.
**Why:** The bar had no height reservation. Calculated from: `padding-block: 5px` (10px total) + content height (~20px from 1.1rem font + h5 line-height) = ~30px.
**Risk:** None — matches current computed height. If announcement text wraps to 2 lines, the bar grows naturally beyond min-height.

### 3. CRITICAL: Simple nav min-height (sections/invicta-simple-nav.liquid)
**Files:** `sections/invicta-simple-nav.liquid`
**What:** Added dynamically calculated `min-height` based on section settings: `(font_size * 1.2 line-height) + (11px * 2 padding) + 3px borders`.
**Why:** No height reservation meant font loading or delayed rendering shifted content below.
**Risk:** None — calculated from the actual CSS values. If font size setting changes in customizer, min-height recalculates automatically.

### 4. HIGH: Header min-height (assets/section-header-invicta.css)
**Files:** `assets/section-header-invicta.css`
**What:** Added min-height to `.invicta-header__inner` at each breakpoint:
- Mobile (≤749px): 108px
- Tablet (750-989px): 80px
- Desktop (≥990px): 112px
**Why:** Prevents flash of unstyled/collapsed header during CSS loading.
**Risk:** Low — values are calculated from padding + logo heights at each breakpoint. If the logo image is significantly taller/shorter than the heights set in CSS, the min-height may be slightly off, but the header will grow to accommodate.
**Edge case to review:** If the store changes logo dimensions significantly (e.g., a very tall logo), the min-height may need updating. Current values match the CSS-defined logo heights (40px mobile, 56px tablet, 80px desktop).

### 5. HIGH: Hero split mobile image — No fix needed
**Assessment:** The mobile image already has `width` and `height` attributes and CSS `width: 100%; height: auto;`. The browser calculates the intrinsic aspect ratio correctly. No CLS issue found.

### 6. HIGH: Product card aspect-ratio safety net (snippets/invicta-product-card.liquid)
**Files:** `snippets/invicta-product-card.liquid`
**What:** Added inline `style="aspect-ratio:1/1"` to `.inv-card__media`.
**Why:** Belt-and-suspenders safety net. The CSS already defines `aspect-ratio: 1/1`, and fix #1 makes the CSS synchronous, but the inline style ensures the ratio is reserved even in edge cases.
**Risk:** None — duplicates the existing CSS rule. Inline styles take precedence, but since the value is identical, there's no visual difference.

### 7. MEDIUM: Brand pill fallback (assets/invicta-brand-pill.js)
**Files:** `assets/invicta-brand-pill.js`
**What:** Changed logo-bg hiding from `display: none` to `visibility: hidden; position: absolute;`.
**Why:** `display: none` triggers layout reflow. `visibility: hidden` with `position: absolute` removes the element from flow without reflow. The pill's fixed `--pill-height: 30px` keeps dimensions stable.
**Risk:** Low — the logo-bg element becomes invisible and positioned absolutely instead of removed from flow. The pill class `invicta-brand-pill--text` still applies correctly.

### 8. MEDIUM: VAT toggle — No fix needed
**Assessment:** The VAT CSS rules (`.inv-vat--hidden`, `html.inv-vat-ex` selectors) are in `base.css` which loads synchronously. The inline script in `<head>` applies the class before first paint. No CLS issue.

### 9. MEDIUM: invicta-cx-improvements.css — No fix needed
**Assessment:** Audited the file. Layout-affecting rules are limited to:
- `content-visibility: auto` — actually *helps* performance, reserves space with `contain-intrinsic-size`
- Fixed-position elements (social proof toast) — don't cause CLS
- All other rules are cosmetic (focus states, colors, hover effects)
No changes required.

### 10. MEDIUM: Cart CSS conditional loading (layout/theme.liquid)
**Files:** `layout/theme.liquid`
**What:** Changed `component-cart-items.css` to load synchronously on the cart template, lazy everywhere else.
**Why:** Was lazy-loaded globally, including on the cart page where it caused CLS as cart items reflowed.
**Risk:** None — same CSS, just loaded synchronously when actually needed.

### 11. LOW: SVG optimization — No changes
**Assessment:** Ran SVGO with conservative settings on all brand SVGs. All showed 0% reduction — they're already optimized.

### 12-13. LOW: Font loading & content_for_header — No fix needed
**Assessment:** Fonts are already preloaded with `font-display: swap`. `content_for_header` is Shopify-controlled.

## Files NOT Touched (as specified)
- `templates/*.json`
- `config/settings_schema.json`
- `config/settings_data.json`
- `locales/*`
- No `{% schema %}` blocks were modified
