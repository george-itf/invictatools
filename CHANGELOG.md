# CHANGELOG

## 2026-05-11 — Homepage performance audit (claude/shopify-performance-audit-UYWbq)

Targeted Core Web Vitals work on the homepage based on a PageSpeed
Insights report that scored 38/100 (CLS 1.94, LCP 7.5s, TBT 330ms,
FCP 1.7s, SI 5.6s). Changes are grouped by metric and were committed
separately so individual fixes can be reverted without touching others.

### CLS — `perf(cls): reserve space for hero and recently-viewed sections`

- `sections/invicta-recently-viewed.liquid` — replaced the `display:none`
  loading state with a visible skeleton plus reserved `min-height` and
  `content-visibility: auto`. The section previously expanded from 0px
  → ~360px once JS resolved local-storage history, which was a major
  contributor to the 1.94 CLS score on first scroll. Empty state still
  collapses the section but only after products fail to load, which is
  below-the-fold and does not count against the viewport CLS budget.
- `assets/invicta-recently-viewed.js` — updated to toggle the new
  `inv-recent--hidden` class instead of the old `inv-recent--loading`
  reveal, and stopped force-applying inline `display: none` on empty.
- `sections/invicta-hero-v3.liquid` —
  - Added a mobile `min-height: 320px` on `.inv-hero-v3__container`.
    Previously only desktop reserved 380px, so the LCP block had no
    reserved height on the viewport that scores lowest.
  - Scoped the preload `<link>` to `min-width: 990px` so we no longer
    waste mobile bandwidth on an image that is `display:none` there
    (the heading is the real LCP on mobile).
  - Removed the 340w srcset entry — it was never selected once `sizes`
    is taken into account on the relevant breakpoint, just bloat.

### LCP — `perf(lcp): serve hero/feature images as webp + decoding=async`

- `sections/invicta-hero-v3.liquid`
- `sections/invicta-deal-feature.liquid`
- `sections/invicta-trust-reviews.liquid` (both branch images)
- `snippets/invicta-product-card.liquid` (shared snippet used by the
  product wall, recently-viewed and several PLPs)

All `image_url` calls on the homepage critical path now request
`format: 'webp'`, which Shopify's CDN serves directly when the browser
supports it (≈ 95% of UK traffic) for typically 25–35% smaller payloads
vs JPEG/PNG. `decoding="async"` added so the HTML parser doesn't block
on decode.

### TBT — `perf(tbt): lazy-load gtag.js and recently-viewed JS off critical path`

- `snippets/invicta-ga4.liquid` — kept the Consent Mode v2 shim
  (`dataLayer` + `gtag` stubs + initial consent defaults) inline so any
  events fired during page load are still captured, but moved the
  `gtag/js` library load behind `requestIdleCallback` (falling back to
  `setTimeout(2.5s)`) on the `load` event. The audit attributed ~250ms
  of TBT to gtag — this moves all of it off the FCP/LCP critical path.
  Added a `preconnect` to `googletagmanager.com` so the deferred fetch
  is still warm.
- `sections/invicta-recently-viewed.liquid` — replaced the always-on
  `<script defer src="invicta-recently-viewed.js">` with an
  IntersectionObserver gate (400px rootMargin). The section is below
  the fold on every homepage and many visitors never scroll there, so
  the JS + AJAX product fetches no longer run in the FCP window.

### FCP — `perf(fcp): high-priority preload for header + search CSS`

- `sections/header-invicta.liquid`
- `snippets/predictive-search-inline.liquid`

The header CSS (`section-header-invicta.css`, 17KB) and search CSS
(`invicta-search.css`, 22KB) both style above-the-fold elements with
specific dimensions, so they have to stay render-blocking — async
loading caused FOUC and CLS in initial testing and was reverted. The
final change is to add `<link rel="preload" as="style"
fetchpriority="high">` ahead of the `<link rel="stylesheet">`, which
moves them onto the high-priority fetch queue alongside `mobile.css` /
`desktop.css` so the browser starts downloading earlier in the parse.

### Robots.txt — `chore(seo): rewrite robots.txt to fix newline-stripping bug`

- `templates/robots.txt.liquid` — the previous version used overly
  aggressive whitespace-trim controls (`{%- ... -%}`) which collapsed
  consecutive `User-agent:` and rule lines onto a single line, producing
  malformed output that PageSpeed Insights flagged as "144 errors".
  Rewrote to mirror Shopify's stock template (one directive per line,
  preserves `group.sitemap`) and kept the existing custom block that
  blocks faceted-filter / sort-by URLs.

## Files changed

```
assets/invicta-recently-viewed.js
sections/header-invicta.liquid
sections/invicta-deal-feature.liquid
sections/invicta-hero-v3.liquid
sections/invicta-recently-viewed.liquid
sections/invicta-trust-reviews.liquid
snippets/invicta-ga4.liquid
snippets/invicta-product-card.liquid
snippets/predictive-search-inline.liquid
templates/robots.txt.liquid
```

## Estimated impact

These numbers are projections based on the audit's reported costs, not
measured. Re-run PageSpeed Insights after the theme deploys to validate.

| Metric | Before | Projected after | Drivers |
|---|---|---|---|
| CLS  | 1.94  | < 0.3 (target < 0.1) | Recently-viewed no longer pops in; hero mobile min-height; no FOUC from async header/search CSS. The remaining shift is likely from `content_for_header` app injections we can't control — see "Out of scope" below. |
| LCP  | 7.5s  | ~3.5–4.5s | webp on hero / above-fold images (~30% byte savings), mobile-scoped hero preload, `decoding=async`. Won't hit 2.5s until app/web-pixel bloat is addressed server-side. |
| TBT  | 330ms | ~80–120ms | gtag.js (~250ms) moved off the critical path; recently-viewed JS no longer blocking. |
| FCP  | 1.7s  | ~1.1–1.4s | Header + search CSS now on high-priority queue; gtag library no longer blocks the head; preconnect for analytics origin. |
| SI   | 5.6s  | ~3.5s    | Composite of the above. |

## Out of scope / can't fix from theme code alone

1. **Shopify `content_for_header` payload** — this is a single
   ~150–250KB block of inline JSON + scripts (Web Pixels, Shop Pay,
   shop analytics, app embeds) that Shopify injects. We can't trim or
   defer individual pieces from theme code; this needs to be tackled
   in admin → Online Store → Preferences and the customer-events
   pixel manager. App embeds in particular are a likely cause of the
   remaining CLS and TBT.
2. **`global.js` (43KB) is loaded on every page** even though most of
   its classes (QuickAddModal, MenuDrawer, SliderComponent, etc.) are
   not needed on the homepage. Splitting this into per-template entry
   points would meaningfully cut TBT but is a non-trivial refactor and
   was flagged rather than done silently.
3. **Render-blocking `mobile.css` (65KB) and `desktop.css` (64KB)**.
   The theme already inlines critical above-fold CSS and uses media
   queries to keep only one of the two render-blocking per viewport,
   but the synchronous file is still a large chunk. Splitting out
   below-fold rules to a deferred sheet would cut another ~30KB from
   the critical CSS budget. Refactor flagged, not attempted.
4. **`spotlight` section has 3 images with `loading="eager"`** — only
   the first card should be eager. The section is currently disabled
   on the homepage so the bug has no live impact; flagged for fixing
   if/when it's re-enabled.
5. **The 558 KiB of "unused JS"** reported by PageSpeed is almost
   entirely from Shopify-injected app scripts. Theme assets are
   already deferred. To make further progress, audit the installed
   apps in Shopify admin and remove any that aren't earning their
   keep on the homepage.

## Recommended next steps

1. Re-run PageSpeed Insights against the production homepage after the
   theme deploys.
2. In Shopify admin, audit Web Pixels and app embeds. Disable any that
   aren't strictly needed on the homepage — this is the highest-yield
   remaining lever.
3. If CLS is still > 0.1 after the above, instrument with `web-vitals`
   library to identify the specific shifting element (likely an app
   embed near the footer).
4. Consider splitting `global.js` and `mobile.css` / `desktop.css` into
   per-template bundles (Shopify's `section-X.css` filter already supports
   this pattern for sections).
