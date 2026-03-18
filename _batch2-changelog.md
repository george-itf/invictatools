# Batch 2 Changelog — Invicta Tools Theme Fixes

## Phase 1: Critical Bugs

### Fix 1.1 — Comparison price formatting
- **File:** `assets/invicta-comparison.js`
- **Issue:** Double multiplication `* 100 * 100` in ex-VAT calculation inflated prices by 100x
- **Fix:** Convert API price string to pence first (`Math.round(parseFloat(variant.price) * 100)`), then apply standard VAT formula via `invictaVat.exFromInc()`

### Fix 1.2 — Comparison CSS loading
- **File:** `sections/invicta-comparison.liquid`
- **Issue:** `media="print" onload="this.media='all'"` caused flash of unstyled content on drawer open
- **Fix:** Changed to standard `<link rel="stylesheet">` load (comparison CSS is small, only loaded on pages with the section)

## Phase 2: Network Resilience

### Fix 2.1 — Comparison fetch timeouts
- **File:** `assets/invicta-comparison.js`
- **Fix:** Added `fetchWithTimeout()` helper with 8s timeout. AbortError catch shows "Products took too long to load" message.

### Fix 2.2 — Recently-viewed fetch timeouts
- **File:** `assets/invicta-recently-viewed.js`
- **Fix:** Added `fetchWithTimeout()` with 8s timeout. On abort, product is silently skipped.

### Fix 2.3 — Cart API fetch timeouts
- **File:** `assets/invicta-cart-api.js`
- **Fix:** Added `fetchWithTimeout()` with 10s timeout. On timeout, fires `invicta:cart:error` CustomEvent with timeout message.

### Fix 2.4 — CX improvements fetch timeouts
- **File:** `assets/invicta-cx-improvements.js`
- **Fix:** Added `fetchWithTimeout()` with 8s timeout for load-more and back-in-stock notify requests.

## Phase 3: Accessibility & Quality

### Fix 3.1 — Focus trap for comparison drawer
- **File:** `assets/invicta-comparison.js`
- **Fix:** `openDrawer()` saves `previousFocus`, focuses first focusable element after render. `closeDrawer()` restores focus. Tab-trap keydown handler prevents focus from leaving the drawer.

### Fix 3.2 — MutationObserver cleanup
- **File:** `assets/invicta-cx-improvements.js` — Both search observers disconnect on `visibilitychange` (hidden) and reconnect when visible.
- **File:** `assets/invicta-quantity-enhancer.js` — Observer target narrowed from `document.body` to `#MainContent`. Existing `destroy()` method already calls `disconnect()`.

### Fix 3.3 — Print stylesheet hides comparison elements
- **File:** `assets/invicta-print.css`
- **Fix:** Added `.inv-compare__badge`, `.inv-compare__drawer`, `.inv-compare__overlay`, `.inv-compare__max-msg` to the existing hide rule.

### Fix 3.4 — Volume pricing hint font size
- **File:** `assets/invicta-product-card.css`
- **Fix:** Changed `.inv-card__volume-hint` from `font-size: 11px` to `font-size: 12px` (WCAG minimum for secondary text).

### Fix 3.5 — Brand pill rogue hex values
- **File:** `assets/invicta-brand-pill.css`
- **Fix:** Replaced 5 hardcoded hex values:
  - `#ffffff` (x3) → `var(--inv-white)`
  - `#111827` → `var(--inv-fg-strong)`
  - `#fff` → `var(--inv-white)`

## Phase 4: Internationalisation & Maintainability

### Fix 4.1 — Comparison strings to translation system
- **Files:** `sections/invicta-comparison.liquid`, `assets/invicta-comparison.js`, `locales/en.default.json`
- **Fix:** Added 16 translation keys under `invicta.compare` namespace. Liquid passes them via `window.invictaCompareStrings`. JS reads from `strings` object with English fallbacks.

### Fix 4.2 — Centralised VAT calculation
- **File:** `assets/invicta-vat-utils.js` (new)
- **Fix:** Created shared `window.invictaVat` utility with `exFromInc()` and `formatPounds()`. Loaded in `layout/theme.liquid` before other scripts. Updated `invicta-comparison.js`, `invicta-search.js`, and `invicta-product-v2.js` to use it.

### Fix 4.3 — Footer addresses to section settings
- **File:** `sections/invicta-footer.liquid`
- **Fix:** Added 6 settings (ramsgate_name, ramsgate_address, ramsgate_phone, canterbury_name, canterbury_address, canterbury_phone) to schema. Template uses `{{ ss.ramsgate_address | newline_to_br }}` pattern.

### Fix 4.4 — Cart quantity respects MOQ
- **File:** `snippets/invicta-product-card.liquid`
- **Fix:** Added `quantity_rule.min` check before the action button. `data-quantity` now uses `{{ default_qty }}` instead of hardcoded `1`.

## Phase 5: Final Verification Sweep

### Check 5.1 — Remaining issues fixed
- **Hex values:** Replaced `#fff` in `invicta-cx-improvements.css` gradient with `var(--inv-white)`
- **Z-index tokens:** Replaced 5 hardcoded z-index values >= 100 with `var(--inv-z-*)` tokens across `invicta-cx-improvements.css`, `invicta-ux-improvements.css`, `invicta-brand-pill.css`, and `invicta-product-v2.css`
- **Console statements:** All guarded by `DEBUG &&` or `if (DEBUG)` — no unguarded instances
- **Bare fetch:** All Invicta-authored files use `fetchWithTimeout()` or their own `AbortController` pattern

### Check 5.2 — Cross-file consistency
- All JS VAT math uses `window.invictaVat` from `invicta-vat-utils.js`
- Comparison events use `CustomEvent` pattern matching existing `invicta:cart:updated`, `invicta:vat:changed`
- New CSS classes follow `inv-compare__*` BEM pattern
