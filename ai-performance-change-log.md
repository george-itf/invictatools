# AI Performance Change Log

All changes made automatically by the performance & UX audit on **2026-02-19**.
Branch: `claude/audit-theme-performance-ux-bzvwB`

---

## Changes

| # | File | Type | Change | Reason | Expected Impact |
|---|------|------|--------|--------|-----------------|
| 1 | `layout/theme.liquid:361` | Performance | Deferred `invicta-ux-improvements.css` — changed from `stylesheet_tag` to `media="print" onload="this.media='all'"` | CSS was render-blocking but contains non-critical styles (focus states, sticky ATC) | -100–300ms FCP; 10.5 KB removed from critical render path |
| 2 | `layout/theme.liquid:528` | Performance | Deferred `invicta-cx-improvements.css` — changed from `stylesheet_tag` to `media="print" onload="this.media='all'"` | CSS was render-blocking but contains CX enhancements not needed for first paint | -50–150ms FCP; 17.6 KB removed from critical render path |
| 3 | `layout/theme.liquid:447` | Accessibility | Removed redundant `role="main"` from `<main>` element | `<main>` has implicit ARIA role of `main`; redundant attribute flagged by a11y linters | Standards compliance; cleaner DOM |
| 4 | `snippets/cart-drawer.liquid:8` | Performance | Deferred `quantity-popover.css` — changed from `stylesheet_tag` to `media="print" onload="this.media='all'"` | Cart drawer CSS is off-screen on initial load; blocks first paint unnecessarily | -25–75ms FCP; removes render-blocking resource |
| 5 | `snippets/cart-drawer.liquid:9` | Performance | Deferred `component-card.css` — changed from `stylesheet_tag` to `media="print" onload="this.media='all'"` | Same as above; component-card.css (14 KB) not needed for initial paint | -25–75ms FCP; 14 KB off critical path |
| 6 | `sections/invicta-product-v2.liquid:287-288` | Performance | Added `loading="eager"` and `fetchpriority="high"` to PDP main product image | Main product image is the LCP element on PDP; was missing priority hints | -200–500ms LCP on product pages |
| 7 | `sections/invicta-collection.liquid:65-72` | Performance | Added responsive `srcset` (600w, 900w, 1200w, 1920w), `sizes="100vw"`, dynamic `width`/`height` to collection hero image | Previously served 1920px image to all devices; mobile downloaded ~4× more data than needed | 50–70% bandwidth reduction on mobile; CLS reduction ~0.10 |
| 8 | `snippets/invicta-brand-pill.liquid:317` | Performance | Changed detector `<img>` from `loading="eager"` to `loading="lazy"` | Invisible 1×1px images were eagerly loaded, consuming HTTP connections needed for visible content | Removes 80+ unnecessary eager requests on collection pages |
| 9 | `sections/brand-hero.liquid:27` | CLS | Fixed `height="auto"` (invalid) to calculated `height="{{ 120 \| divided_by: section.settings.brand_logo.aspect_ratio \| default: 120 \| round }}"` | `height="auto"` is not valid HTML; browser cannot reserve layout space, causing CLS | CLS reduction ~0.05–0.10 on brand landing pages |
| 10 | `sections/brand-hero.liquid:108-109` | CLS | Added `width` and `height` attributes to hero image | Missing dimensions prevent browser from reserving layout space | CLS reduction ~0.05 on brand landing pages |
| 11 | `sections/brand-video.liquid:44-45` | CLS | Added `width` and `height` attributes to video thumbnail image | Missing dimensions cause layout shift when image loads | CLS reduction ~0.03–0.05 on brand pages |
| 12 | `snippets/mega-dropdown-menu.liquid:110` | Accessibility | Added `aria-label="Main categories"` to `<nav>` | Screen readers could not identify the navigation landmark's purpose | WCAG 2.1 SC 1.3.1 compliance |
| 13 | `snippets/mega-dropdown-menu.liquid:115` | Accessibility | Added `aria-expanded="false"`, `aria-haspopup="true"`, `aria-controls` to dropdown trigger buttons | Screen readers could not communicate dropdown behaviour to users | WCAG 2.1 SC 4.1.2 compliance |
| 14 | `snippets/mega-dropdown-menu.liquid:118` | Accessibility | Added `aria-hidden="true"` to decorative chevron SVGs | Decorative icons were exposed to assistive technology | Cleaner screen reader output |
| 15 | `snippets/mega-dropdown-menu.liquid:122` | Accessibility | Added `id` attributes to dropdown panels (linked via `aria-controls`) | Required for `aria-controls` to establish programmatic relationship | WCAG 2.1 SC 4.1.2 compliance |

---

## Summary

- **Files modified:** 8
- **Total insertions:** 26 lines
- **Total deletions:** 16 lines
- **Net change:** +10 lines
- **Change categories:**
  - Performance (render-blocking CSS, image loading): 8 changes
  - CLS prevention (image dimensions): 3 changes
  - Accessibility (ARIA, semantic HTML): 4 changes
- **Breaking changes:** None
- **Risk level:** Low — all changes are additive or replace attributes with standards-compliant equivalents
- **Rollback:** `git revert <commit-hash>` or restore individual lines per file
