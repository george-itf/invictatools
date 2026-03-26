# Invicta Brand Audit Report
Generated: 2026-03-26
Files scanned: 51

---

## 1. Colours

### 1A. Token Inventory

Every `--inv-*` token defined in `assets/invicta-css-variables.css`, with its raw value and whether it is referenced elsewhere in the codebase.

**BRAND / ACCENT**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-accent` | `#e11d26` | Yes — 282 occurrences across 34 files |
| `--inv-accent-hover` | `#b91c1c` | Yes |
| `--inv-accent-soft` | `rgba(225, 29, 38, 0.08)` | Yes |
| `--inv-accent-ring` | `rgba(225, 29, 38, 0.1)` | Yes |
| `--inv-accent-light` | `rgba(225, 29, 38, 0.12)` | Yes |
| `--inv-accent-glow` | `rgba(225, 29, 38, 0.25)` | Yes |
| `--inv-primary` | `var(--inv-accent)` | Yes — 5 occurrences in `brand-page.css`, `invicta-trade-cta.liquid` |
| `--inv-primary-hover` | `var(--inv-accent-hover)` | Yes — 5 occurrences same files |

**SEMANTIC — SUCCESS**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-success` | `#16a34a` | Yes |
| `--inv-success-light` | `#f0fdf4` | Yes |
| `--inv-success-border` | `#bbf7d0` | Yes |
| `--inv-success-dark` | `#166534` | Yes |
| `--inv-success-bright` | `#22c55e` | Yes |
| `--inv-success-bg` | `#d1fae5` | Yes |
| `--inv-success-bg-light` | `#dcfce7` | Yes |
| `--inv-success-medium` | `#059669` | Yes |
| `--inv-success-text` | `#065f46` | Yes |
| `--inv-success-heading` | `#15803d` | Yes |

**SEMANTIC — WARNING**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-warning` | `#f59e0b` | Yes |
| `--inv-warning-dark` | `#d97706` | Yes |
| `--inv-warning-darker` | `#b45309` | Yes |
| `--inv-warning-text` | `#92400e` | Yes |
| `--inv-warning-bg` | `#fef3c7` | Yes |
| `--inv-warning-border` | `#fbbf24` | Yes |

**SEMANTIC — ERROR**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-error` | `#dc2626` | Yes |
| `--inv-error-bg` | `#fef2f2` | Yes |
| `--inv-error-light` | `#fee2e2` | Yes |
| `--inv-error-border` | `#fecaca` | Yes |
| `--inv-error-dark` | `#991b1b` | Yes |
| `--inv-error-text` | `#ef4444` | Yes |

**SEMANTIC — INFO**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-info` | `#3b82f6` | Yes |
| `--inv-info-bg` | `#dbeafe` | Yes |
| `--inv-info-dark` | `#1d4ed8` | Yes |

**LEGACY SEMANTIC ALIASES**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-green` | `var(--inv-success)` | No |
| `--inv-amber` | `var(--inv-warning)` | No |

**BACKGROUNDS**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-bg` | `#f5f5f6` | Yes |
| `--inv-bg-elevated` | `#ffffff` | Yes |
| `--inv-bg-soft` | `#f3f4f6` | Yes |
| `--inv-bg-muted` | `#f9fafb` | Yes |
| `--inv-bg-subtle` | `#f8fafc` | Yes |
| `--inv-bg-card-body` | `#f7f7f8` | Yes |
| `--inv-bg-card-border` | `#ececec` | Yes |
| `--inv-bg-skeleton` | `#f0f0f0` | Yes |
| `--inv-bg-skeleton-highlight` | `#e0e0e0` | Yes |
| `--inv-bg-skeleton-border` | `#e8e8e8` | Yes |
| `--inv-white` | `var(--inv-bg-elevated)` | Yes |
| `--inv-black` | `#000000` | No |

**TEXT**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-fg` | `#0f172a` | Yes |
| `--inv-fg-muted` | `#6b7280` | Yes |
| `--inv-fg-subtle` | `#9ca3af` | Yes |
| `--inv-fg-secondary` | `#374151` | Yes |
| `--inv-fg-strong` | `#111827` | Yes |
| `--inv-fg-dim` | `#4b5563` | Yes |
| `--inv-fg-near-black` | `#1a1a1a` | Yes |
| `--inv-fg-medium` | `#525252` | Yes |
| `--inv-text` | `var(--inv-fg)` | Yes — 5 occurrences |
| `--inv-text-muted` | `var(--inv-fg-muted)` | Yes — 3 occurrences |
| `--inv-text-light` | `var(--inv-fg-subtle)` | No |
| `--inv-dark` | `#2d2d2d` | Yes |
| `--inv-dark-hover` | `#404040` | Yes |
| `--inv-dark-hover-deep` | `#1a1a1a` | Yes |

**BORDERS**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-border` | `#e5e7eb` | Yes |
| `--inv-border-dark` | `#d1d5db` | Yes |
| `--inv-border-subtle` | `rgba(148, 163, 184, 0.4)` | No |
| `--inv-border-strong` | `rgba(15, 23, 42, 0.25)` | Yes |
| `--inv-border-light` | `#e5e7eb` | No |
| `--inv-border-muted` | `#e2e8f0` | Yes |
| `--inv-border-notify` | `#d0d0d0` | Yes |
| `--inv-border-skeleton` | `#e5e5e5` | Yes |
| `--inv-border-skeleton-dark` | `#ddd` | Yes |

**GREY SCALE**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-grey-50` | `#fafafa` | Yes |
| `--inv-grey-100` | `#f5f5f5` | Yes |
| `--inv-grey-200` | `#e5e5e5` | Yes |
| `--inv-grey-300` | `#d4d4d4` | Yes |
| `--inv-grey-400` | `#a3a3a3` | Yes |
| `--inv-grey-500` | `#737373` | Yes |
| `--inv-grey-600` | `#525252` | Yes |
| `--inv-grey-700` | `#404040` | No |
| `--inv-grey-placeholder` | `#ccc` | Yes |
| `--inv-grey-was` | `#999` | Yes |
| `--inv-grey-vat` | `#666` | Yes |

**SHADOWS**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-shadow-color` | `rgba(0, 0, 0, 0.1)` | Yes |
| `--inv-shadow-sm` | `0 1px 2px rgba(0, 0, 0, 0.05)` | No |
| `--inv-shadow-card` | `0 1px 3px rgba(0, 0, 0, 0.08)` | Yes |
| `--inv-shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1)` | Yes |
| `--inv-shadow-elevated` | `0 4px 12px rgba(0, 0, 0, 0.1)` | Yes |
| `--inv-shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1)` | No |
| `--inv-shadow-soft` | `0 18px 40px -28px rgba(15, 23, 42, 0.35)` | No |
| `--inv-shadow-xl` | `0 20px 25px -5px rgba(0, 0, 0, 0.1)` | No |

**HEADER / NAV**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-header-bg` | `var(--inv-accent, #e11d26)` | No |
| `--inv-header-fg` | `#ffffff` | No |
| `--inv-header-border` | `none` | No |
| `--inv-header-icon-bg` | `rgba(255, 255, 255, 0.15)` | No |
| `--inv-header-icon-fg` | `#ffffff` | No |
| `--inv-header-icon-hover-bg` | `rgba(255, 255, 255, 0.25)` | No |
| `--inv-nav-bg` | `#ffffff` | Yes |
| `--inv-nav-fg` | `#444444` | Yes |
| `--inv-nav-hover-fg` | `var(--inv-accent)` | Yes |
| `--inv-nav-active-fg` | `var(--inv-accent)` | Yes |
| `--inv-nav-border` | `#eeeeee` | Yes |
| `--inv-nav-indicator` | `var(--inv-accent)` | Yes |

**FOCUS**

| Token | Value | Referenced? |
|---|---|---|
| `--inv-focus-ring-width` | `2px` | Yes |
| `--inv-focus-ring-color` | `rgba(225, 29, 38, 0.5)` | Yes |
| `--inv-focus-ring-offset` | `2px` | Yes |
| `--inv-focus-shadow` | `0 0 0 3px rgba(45, 45, 45, 0.3)` | Yes |

---

### 1B. Hardcoded Hex Values

Every hex colour appearing outside `assets/invicta-css-variables.css`.

**assets/invicta-product-v2.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 659 | `#2d2d2d` | `.inv-pdp__dealer-badge` fallback bg | `--inv-dark` |
| 660 | `#fff` | `.inv-pdp__dealer-badge` fallback text | `--inv-bg-elevated` |

**assets/section-invicta-product-v2.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 10 | `#f5f5f5` | VAT toggle bg fallback | `--inv-grey-100` |
| 48 | `#fff` | VAT toggle thumb | `--inv-bg-elevated` |
| 67 | `#f0f9ff` | Click & collect bg | None (sky-50) |
| 68 | `#bae6fd` | Click & collect border | None (sky-200) |
| 74 | `#0284c7` | Collect icon + link colour | None (sky-600) |
| 92 | `#0284c7` | Collect text link | None (sky-600) |
| 131 | `#fffbeb` | Low stock banner bg | None (amber-50) |
| 132 | `#92400e` | Low stock banner text | `--inv-warning-text` |
| 133 | `#fde68a` | Low stock border | None (amber-200) |
| 136 | `#f59e0b` | Low stock dot | `--inv-warning` |
| 142 | `#dbeafe` | Supplier stock banner bg | `--inv-info-bg` |
| 143 | `#1e40af` | Supplier stock text | None (blue-800) |
| 146 | `#3b82f6` | Supplier stock dot | `--inv-info` |

**assets/invicta-print.css** (print stylesheet)

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 20, 183, 615, 748, 761 | `#666` | Secondary text | `--inv-grey-vat` |
| 25, 546 | `#999` | Tertiary text | `--inv-grey-was` |
| 81 | `#fff` | Background reset | `--inv-bg-elevated` |
| 82, 100, 106, 135, 175+ | `#000` | Black text/borders | `--inv-black` |
| 130, 484, 551 | `#555` | Mid-grey text | No direct token |
| 186, 314, 338, 419+ | `#ccc` | Light borders | `--inv-grey-placeholder` |
| 245, 714 | `#333` | Dark text | No direct token |
| 516 | `#ddd` | Light border | `--inv-border-skeleton-dark` |

**sections/invicta-faq.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 106 | `#ffffff` | Accordion bg fallback | `--inv-bg-elevated` |
| 290 | `#f3f4f6` | Active accordion bg fallback | `--inv-bg-soft` |
| 321 | `#ffffff` | Icon colour on active | `--inv-bg-elevated` |
| 331 | `#c4191f` | Accent hover fallback | No token (different from `--inv-accent-hover`) |

**sections/invicta-trust-bar.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 176, 216, 272, 291, 376 | `#fff` | Various text/bg | `--inv-bg-elevated` |
| 324 | `#555` | Secondary text | No direct token |
| 442 | `#f59e0b` | Star fill | `--inv-warning` |
| 446 | `#d1d5db` | Empty star fill | `--inv-border-dark` |
| 452 | `#444` | Text colour | `--inv-nav-fg` |
| 488 | `#d1d5db` | Divider | `--inv-border-dark` |

**sections/invicta-newsletter.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 167, 218, 239, 269, 287, 308, 330 | `#fff` | Various text/input bg | `--inv-bg-elevated` |
| 353 | `#fca5a5` | Error message text | None (red-300) |
| 357, 382 | `#4ade80` | Success message text | None (green-400) |
| 581, 587 (schema defaults) | `#2d2d2d`, `#e11d26` | — | `--inv-dark`, `--inv-accent` |

**sections/invicta-footer.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 215 | `#101010` | Footer bg | None (darker than any token) |
| 340 | `#00b67a` | Trustpilot green badge | None (brand colour) |
| 353 | `#1877f2` | Facebook badge | None (brand colour) |
| 502, 555, 592 (schema) | `#D5453E` | — | Near `--inv-accent` but different shade |
| 543, 776 (schema) | `#1f1f1f`, `#121212` | — | No token |

**sections/invicta-trust-reviews.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 50 | `#16a34a` | SVG checkmark | `--inv-success` |
| 77–80 | `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335` | Google G logo | None (brand) |
| 83, 233, 858 | `#1877F2` | Facebook logo | None (brand) |
| 87, 237, 861 | `#00b67a` | Trustpilot logo | None (brand) |
| 466, 621 | `#fbbf24` | Star colour | `--inv-warning-border` |
| 602, 603, 637 | `#ffffff`, `#e5e7eb` | Card bg/border | `--inv-bg-elevated`, `--inv-border` |

**sections/invicta-trade-cta.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 10 | `#1a1a1a` | Section bg | `--inv-fg-near-black` |
| 29, 35, 50, 85, 90, 96, 99, 153 | `#fff` | Text/card bg | `--inv-bg-elevated` |
| 34, 79, 152 | `#e11d26` | Button bg (redundant fallback) | `--inv-accent` |

**sections/invicta-simple-nav.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 133, 143 | `#ffffff` | Header link text | `--inv-bg-elevated` |
| 142 | `#c9181f` | Accent hover fallback | No token |
| 315, 327, 456, 494 (schema) | `#e11d26` | — | `--inv-accent` |
| 506 (schema) | `#c9181f` | — | No token |

**sections/invicta-hero-split.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 42, 695, 708 | `#2d2d2d` | Section/overlay bg | `--inv-dark` |
| 95, 193, 197+ (many) | `#e11d26` | Accent bg/text | `--inv-accent` |
| Many lines | `#fff` | Text on dark | `--inv-bg-elevated` |
| 635 | `#c81a22` | Hover state | No token |
| 363 | `#f59e0b` | Warning dot | `--inv-warning` |
| 367 | `#16a34a` | Success dot | `--inv-success` |

**sections/invicta-product-wall.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 110, 374 | `#999` | Placeholder/empty text | `--inv-grey-was` |
| 122 | `#ffffff` | Tab wrapper bg | `--inv-bg-elevated` |
| 264 | `#1a1a1a` | Focus ring shadow | `--inv-fg-near-black` |

**sections/invicta-product-grid.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 454, 503, 729 | `#fff` | Text/card bg | `--inv-bg-elevated` |
| 479, 632 | `#666` | Tab/secondary text | `--inv-grey-vat` |
| 515, 625 | `#999` | Indicator/muted text | `--inv-grey-was` |
| 693, 738 | `#f8f8f8` | Section/card bg | No exact token |

**sections/invicta-usp-strip-v2.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 101 | `#f5f5f5` | Mobile fallback bg | `--inv-grey-100` |
| 164 | `#fff` | Icon fallback | `--inv-bg-elevated` |

**sections/invicta-trust-strip.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 98 | `#1a1a1a` | Section bg fallback | `--inv-fg-near-black` |

**sections/invicta-brand-strip.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 116, 285 | `#6b7280` | Placeholder/editor text | `--inv-fg-muted` |
| 206 | `#e5e7eb` | Section border inline | `--inv-border` |

**sections/invicta-category-grid.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 174, 195 | `#666` | Muted text | `--inv-grey-vat` |
| 196, 263 | `#f8f8f8` | Empty card bg | No exact token |
| 198 | `#ddd` | Dashed border | `--inv-border-skeleton-dark` |
| 251 | `#ccc` | Placeholder text | `--inv-grey-placeholder` |

**sections/invicta-recently-viewed.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 174, 187, 266 | `#ccc` | Scrollbar/border | `--inv-grey-placeholder` |
| 214, 228, 639 | `#f0f0f0`, `#e8e8e8` | Skeleton animation | `--inv-bg-skeleton`, `--inv-bg-skeleton-border` |
| 278 | `#f9fafb` | Section bg | `--inv-bg-muted` |
| 319, 386 | `#e11d26` | Accent bg/price | `--inv-accent` |
| 339 | `#f3f4f6` | Filter chip bg | `--inv-bg-soft` |
| 343 | `#374151` | Filter chip text | `--inv-fg-secondary` |
| 392 | `#888` | Muted text | No exact token |

**sections/invicta-collection.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 73 | `#f1f1f1` | Filter chip bg | No exact token |
| 74 | `#ddd` | Filter chip border | `--inv-border-skeleton-dark` |
| 78 | `#333` | Filter chip text | No direct token |
| 83 | `#e4e4e4` | Hover filter bg | No token |
| 84 | `#bbb` | Hover filter border | No token |
| 85 | `#111` | Hover filter text | No token |
| 96 | `#555` | Muted text | No direct token |
| 102 | `#000` | Active filter text | `--inv-black` |

**snippets/invicta-brand-pill.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 131 | `#2d2d2d` | Default brand bg (Liquid) | `--inv-dark` |
| 132 | `#ffffff` | Default brand text (Liquid) | `--inv-bg-elevated` |
| 206, 248 | `#c5c5c5` | Light-bg pill border | No token |

**snippets/invicta-brand-hero.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 30 | `#2d2d2d` | Default hero bg | `--inv-dark` |
| 31 | `#e11d26` | Default accent | `--inv-accent` |

**sections/invicta-product-v2.liquid** (Liquid colour vars for dealer badges)

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 501–502 | `#2d2d2d`, `#ffffff` | Generic dealer | `--inv-dark`, `--inv-bg-elevated` |
| 505 | `#00a0aa` | Dealer teal bg | None |
| 508 | `#febd17` | Dealer gold bg | None |
| 509 | `#111111` | Dealer text | No token |
| 511 | `#006b3f` | Dealer green bg | None |
| 514 | `#db0032` | Dealer red bg | None |

---

### 1C. Hardcoded RGBA Values

**assets/invicta-product-card.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 32, 39 | `rgba(0, 0, 0, 0.04)` | Card shadows | None |
| 151 | `rgba(0, 0, 0, 0.08)` | Compare button shadow | Matches `--inv-shadow-card` value |

**assets/invicta-product-v2.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 184 | `rgba(0, 0, 0, 0.08)` | Swatch hover | Matches `--inv-shadow-card` |
| 287 | `rgba(255, 255, 255, 0.5)` | Swatch focus ring | None |
| 295 | `rgba(0, 0, 0, 0.65)` | Image zoom overlay | None |
| 977 | `rgba(220, 38, 38, 0.4)` | Error focus ring | None |
| 1198 | `rgba(0, 0, 0, 0.9)` | Lightbox backdrop | None |
| 1240 | `rgba(255, 255, 255, 0.1)` | Lightbox nav button | None |

**assets/invicta-brand-pill.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 64, 89 | `rgba(0, 0, 0, 0.06)` | Pill shadow | None |
| 77 | `rgba(0, 0, 0, 0.10)` | Pill hover shadow | Matches `--inv-shadow-color` value |
| 90 | `rgba(0, 0, 0, 0.08)` | Pill focus shadow | Matches `--inv-shadow-card` value |
| 302 | `rgba(0, 0, 0, 0.2)` | Shimmer shadow | None |

**assets/invicta-cart.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 217 | `rgba(0, 0, 0, 0.04)` | Cart item shadow | None |
| 835 | `rgba(0, 0, 0, 0.12)` | Drawer shadow | None |
| 915 | `rgba(0, 0, 0, 0.08)` | Cart footer shadow | Matches `--inv-shadow-card` |

**assets/invicta-search.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 190 | `rgba(0, 0, 0, 0.12)` | Dropdown shadow | None |
| 191 | `rgba(0, 0, 0, 0.04)` | Dropdown shadow | None |

**assets/invicta-cx-improvements.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 192 | `rgba(0, 0, 0, 0.5)` | Modal backdrop | None |
| 477 | `rgba(0, 0, 0, 0.12)` | Dropdown shadow | None |

**assets/invicta-comparison.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 27, 54 | `rgba(0, 0, 0, 0.2)` | Sticky bar / remove button | None |
| 35 | `rgba(0, 0, 0, 0.25)` | Sticky bar hover | None |
| 74 | `rgba(0, 0, 0, 0.5)` | Modal backdrop | None |
| 98 | `rgba(0, 0, 0, 0.15)` | Drawer top shadow | None |

**assets/section-invicta-product-v2.css**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 137 | `rgba(245, 158, 11, 0.2)` | Low stock dot ring | None |
| 147 | `rgba(59, 130, 246, 0.2)` | Supplier stock dot ring | None |

**sections/invicta-hero-v3.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 116 | `rgba(225,29,38,0.06)` | Hero bg gradient | Near `--inv-accent-soft` (0.08) |
| 117 | `rgba(255,255,255,0.03)` | Bg gradient spot 2 | None |
| 187 | `rgba(255, 255, 255, 0.7)` | Subtitle text | None |
| 236 | `rgba(255, 255, 255, 0.3)` | Ghost button border | None |
| 266 | `rgba(0,0,0,0.2)` | CTA shadow | None |

**sections/invicta-hero-split.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 117 | `rgba(255, 255, 255, 0.75)` | Subtitle | None |
| 212 | `rgba(0, 0, 0, 0.4)` | Caption overlay | None |
| 230 | `rgba(0, 0, 0, 0.6)` | Caption hover | None |
| 283 | `rgba(0, 0, 0, 0.15)` | Button shadow | None |
| 406–408 | `rgba(255,255,255,0.1/0.2/0.1)` | Shimmer gradient | None |
| 425–427 | `rgba(0,0,0,0.02/0.04/0.02)` | Dark shimmer | None |
| 494 | `rgba(255, 255, 255, 0.15)` | Dot nav button | None |
| 515 | `rgba(255, 255, 255, 0.25)` | Ghost btn border | None |
| 524 | `rgba(225, 29, 38, 0.25)` | Accent ghost border | Near `--inv-accent-ring` (0.1) |
| 605, 610 | `rgba(0,0,0,0.2/0.35)` | Thumbnail overlays | None |
| 640 | `rgba(0, 0, 0, 0.1)` | Dot shadow | Matches `--inv-shadow-color` |
| 644 | `rgba(0, 0, 0, 0.18)` | Active dot shadow | None |

**sections/invicta-trust-strip.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 101, 186 | `rgba(255, 255, 255, 0.06)` | Mobile border | None |
| 130 | `rgba(255, 255, 255, 0.15)` | Expanded border | None |
| 167 | `rgba(255, 255, 255, 0.8)` | Label text on dark | None |
| 216 | `rgba(255, 255, 255, 0.08)` | Active bg | None |

**sections/invicta-trust-bar.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 210 | `rgba(255, 255, 255, 0.15)` | Tab icon bg | `--inv-header-icon-bg` |
| 224 | `rgba(255, 255, 255, 0.6)` | Tab sub-label | None |
| 560, 565 | `rgba(255, 255, 255, 0.1)` | Mobile divider/border | None |

**sections/invicta-newsletter.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 264 | `rgba(255, 255, 255, 0.7)` | Sub-heading on dark | None |
| 285 | `rgba(255, 255, 255, 0.3)` | Input border on dark | None |
| 286 | `rgba(255, 255, 255, 0.12)` | Input bg on dark | None |
| 297 | `rgba(255, 255, 255, 0.55)` | Placeholder text | None |
| 302 | `rgba(255, 255, 255, 0.18)` | Input focus bg | None |
| 378 | `rgba(255, 255, 255, 0.7)` | Copyright text | None |

**sections/invicta-faq.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 122, 221, 335 | `rgba(225, 29, 38, 0.5)` | Focus ring fallbacks | `--inv-focus-ring-color` |

**sections/invicta-delivery-info.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 79 | `rgba(225, 29, 38, 0.08)` | Callout bg fallback | `--inv-accent-soft` |
| 265 | `rgba(15, 23, 42, 0.25)` | Border fallback | `--inv-border-strong` |
| 374 | `rgba(225, 29, 38, 0.5)` | Focus ring fallback | `--inv-focus-ring-color` |

**sections/invicta-trade-cta.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 102 | `rgba(0, 0, 0, 0.15)` | Card shadow | None |
| 148 | `rgba(220, 38, 38, 0.1)` | Focus ring | Near `--inv-accent-ring` but wrong RGB base |

**sections/invicta-product-grid.liquid**

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 447 | `rgba(45, 45, 45, 0.06)` | Tab hover bg | None |
| 521, 699 | `rgba(26, 26, 46, 0.1)` | Swatch focus/hover ring | None (non-standard base colour) |
| 656 | `rgba(26, 26, 46, 0.2)` | Swatch active ring | None |
| 550 | `rgba(0, 0, 0, 0.1)` | Shadow fallback | Matches `--inv-shadow-color` |
| 582–584 | `rgba(255,255,255,0/0.6/0)` | Shimmer gradient | None |
| 744 | `rgba(26, 26, 26, 0.1)` | Focus ring | None |

**sections/invicta-footer.liquid** (CSS Color Level 4 `rgb()` syntax)

| Line | Value | Context | Token Equivalent? |
|---|---|---|---|
| 216 | `rgb(255 255 255 / 0.9)` | Footer link text | None |
| 236 | `rgb(255 255 255 / 0.06)` | Footer border | None |
| 277 | `rgb(255 255 255 / 0.85)` | Nav link text | None |
| 308, 370 | `rgb(255 255 255 / 0.09)` | Payment/social icon bg | None |
| 383 | `rgb(0 0 0 / 0.3)` | Mobile accordion border | None |
| 420 | `rgb(255 255 255 / 0.1)` | Legal border | None |
| 432 | `rgb(255 255 255 / 0.7)` | Legal text | None |

---

### 1D. Colour Usage by Purpose

**Primary / Accent Backgrounds**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#e11d26` | Buttons, active tabs, badges, CTA blocks | 30+ instances across 15+ files | `--inv-accent` |
| `#c81a22` | Accent hover (hero-split) | `invicta-hero-split.liquid:635` | None |
| `#c9181f` | Accent hover (simple-nav) | `invicta-simple-nav.liquid:142` | None |
| `#c4191f` | Accent hover (faq, returns, delivery-info) | Multiple fallbacks | None |
| `#b91c1c` | Accent hover (canonical) | Token file | `--inv-accent-hover` |
| `#2d2d2d` | Dark section/button bg | hero-split, product-v2, brand-pill | `--inv-dark` |
| `#1a1a1a` | Very dark section bg | trade-cta, spotlight, trust-strip | `--inv-fg-near-black` |
| `#101010` | Footer bg | `invicta-footer.liquid:215` | None |
| `#1f1f1f`, `#121212` | Schema default dark bgs | footer schema | None |
| `#00b67a` | Trustpilot green | footer, trust-reviews | None (brand colour) |
| `#1877f2` | Facebook blue | footer, trust-reviews | None (brand colour) |

**Primary / Accent Text**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#e11d26` | Accent text links, prices | hero-split, recently-viewed, product-wall | `--inv-accent` |
| `#0284c7` | Click & collect links | `section-invicta-product-v2.css:74,92` | None |

**Body Text**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#0f172a` | Primary body text | Token file | `--inv-fg` |
| `#1a1a1a` | Near-black body text | Multiple sections | `--inv-fg-near-black` |
| `#111827` | Strong text | Token file | `--inv-fg-strong` |
| `#2d2d2d` | Dark text | Multiple sections | `--inv-dark` |
| `#374151` | Filter chip text | `invicta-recently-viewed.liquid:343` | `--inv-fg-secondary` |
| `#333` | Dark text | print.css, collection.liquid | No direct token |
| `#000` | Black text | print.css | `--inv-black` |

**Muted Text**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#6b7280` | Muted body text | brand-strip, delivery-info | `--inv-fg-muted` |
| `#4b5563` | Dim text | Token file | `--inv-fg-dim` |
| `#525252` | Medium text | Token file | `--inv-fg-medium` |
| `#555` | Mid-grey | trust-bar, print.css | No direct token |
| `#666` | Grey text | hero-split, product-grid, category-grid | `--inv-grey-vat` |

**Subtle / Disabled Text**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#9ca3af` | Subtle text | Token file | `--inv-fg-subtle` |
| `#999` | Placeholder / empty states | product-wall, product-grid, recently-viewed | `--inv-grey-was` |
| `#888` | Muted price | `invicta-recently-viewed.liquid:392` | No direct token |
| `#ccc` | Placeholder/scrollbar | recently-viewed, brand-pill | `--inv-grey-placeholder` |

**Page Backgrounds**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#f5f5f6` | Site/section bg | Token file | `--inv-bg` |
| `#f3f4f6` | Soft bg | Token file, faq | `--inv-bg-soft` |
| `#f9fafb` | Muted bg | Token file, trust-bar schema | `--inv-bg-muted` |
| `#f5f5f5` | Grey-100 bg | usp-strip, category-grid | `--inv-grey-100` |
| `#f8f8f8` | Off-white bg | product-grid, category-grid | No exact token |
| `#f4f4f4` | Nav placeholder | simple-nav inline style | No token |
| `#f1f1f1` | Collection filter bg | `invicta-collection.liquid:73` | No token |

**Card Backgrounds**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#f7f7f8` | Card body bg | Token file | `--inv-bg-card-body` |
| `#ffffff` | Card/surface bg | Many instances | `--inv-bg-elevated` |
| `#f8f9fa` | Trust-reviews card bg | `invicta-trust-reviews.liquid:269` | No exact token |
| `#f8f8f8` | Product-grid card bg | `invicta-product-grid.liquid:738` | No exact token |

**Borders**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#e5e7eb` | Primary border | Token file, many fallbacks | `--inv-border` |
| `#d1d5db` | Dark border | Token file, trust-bar, trust-reviews | `--inv-border-dark` |
| `#e2e8f0` | Muted border | Token file | `--inv-border-muted` |
| `#ddd` | Light border | brand-pill, category-grid, collection | `--inv-border-skeleton-dark` |
| `#ececec` | Card border | Token file | `--inv-bg-card-border` |
| `#eeeeee` | Nav border | Token file | `--inv-nav-border` |
| `#e4e4e4` | Collection hover border | `invicta-collection.liquid:83` | No token |
| `#bbb` | Collection active border | `invicta-collection.liquid:84` | No token |
| `#c5c5c5` | Light-bg brand pill border | `invicta-brand-pill.liquid:206,248` | No token |

**Success**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#16a34a` | In-stock, success icons | Token file + many hardcoded | `--inv-success` |
| `#22c55e` | Bright success | Token file | `--inv-success-bright` |
| `#f0fdf4` | Success light bg | Token file | `--inv-success-light` |
| `#4ade80` | Newsletter success text | `invicta-newsletter.liquid:357,382` | None (green-400) |

**Warning**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#f59e0b` | Low-stock dot, star fill | Token file + many hardcoded | `--inv-warning` |
| `#fbbf24` | Star colour, hero badge | Token file + hardcoded | `--inv-warning-border` |
| `#92400e` | Warning text | Token file + hardcoded | `--inv-warning-text` |
| `#fde68a` | Low-stock border | `section-invicta-product-v2.css:133` | No exact token |
| `#fffbeb` | Low-stock bg | `section-invicta-product-v2.css:131` | No exact token |

**Error**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#dc2626` | Error state | Token file | `--inv-error` |
| `#ef4444` | Error text | Token file | `--inv-error-text` |
| `#fca5a5` | Newsletter error text | `invicta-newsletter.liquid:353` | None (red-300) |

**Info**

| Colour | Usage | Source | Token |
|---|---|---|---|
| `#3b82f6` | Supplier stock dot | Token file + hardcoded | `--inv-info` |
| `#dbeafe` | Supplier stock bg | Token file + hardcoded | `--inv-info-bg` |
| `#0284c7` | Click & collect | `section-invicta-product-v2.css:74,92` | No token (sky-600) |
| `#1e40af` | Supplier stock text | `section-invicta-product-v2.css:143` | No token (blue-800) |

**Shadows (hardcoded, outside token system)**

| Value | Count | Context |
|---|---|---|
| `rgba(0,0,0,0.04)` | 4 | Card shadows |
| `rgba(0,0,0,0.06)` | 2 | Brand pill |
| `rgba(0,0,0,0.08)` | 5 | Component shadows |
| `rgba(0,0,0,0.12)` | 3 | Dropdown/drawer |
| `rgba(0,0,0,0.15)` | 4 | Card/panel |
| `rgba(0,0,0,0.20)` | 4 | Overlay/comparison |
| `rgba(0,0,0,0.50)` | 2 | Modal backdrops |
| `rgba(0,0,0,0.65)` | 1 | PDP zoom overlay |
| `rgba(0,0,0,0.90)` | 1 | Lightbox backdrop |

---

### 1E. Unused Tokens

| Token | Value | Category |
|---|---|---|
| `--inv-green` | `var(--inv-success)` | Legacy alias |
| `--inv-amber` | `var(--inv-warning)` | Legacy alias |
| `--inv-black` | `#000000` | Background |
| `--inv-text-light` | `var(--inv-fg-subtle)` | Legacy alias |
| `--inv-border-subtle` | `rgba(148, 163, 184, 0.4)` | Border |
| `--inv-border-light` | `#e5e7eb` | Border (duplicate value of `--inv-border`) |
| `--inv-grey-700` | `#404040` | Grey scale |
| `--inv-shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Shadow |
| `--inv-shadow-lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Shadow |
| `--inv-shadow-soft` | `0 18px 40px -28px rgba(15,23,42,0.35)` | Shadow |
| `--inv-shadow-xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Shadow |
| `--inv-header-bg` | `var(--inv-accent, #e11d26)` | Header |
| `--inv-header-fg` | `#ffffff` | Header |
| `--inv-header-border` | `none` | Header |
| `--inv-header-icon-bg` | `rgba(255,255,255,0.15)` | Header |
| `--inv-header-icon-fg` | `#ffffff` | Header |
| `--inv-header-icon-hover-bg` | `rgba(255,255,255,0.25)` | Header |

---

### 1F. Legacy Aliases

| Alias Token | Points To | Alias Usages | Target Usages | Dominant Usage |
|---|---|---|---|---|
| `--inv-primary` | `--inv-accent` | 5 (`brand-page.css`, `trade-cta.liquid`) | 282 | `--inv-accent` |
| `--inv-primary-hover` | `--inv-accent-hover` | 5 (same files) | 40+ | `--inv-accent-hover` |
| `--inv-white` | `--inv-bg-elevated` | Many CSS files | Many section files | Mixed — both active |
| `--inv-text` | `--inv-fg` | 5 (same files as primary) | Widespread | `--inv-fg` |
| `--inv-text-muted` | `--inv-fg-muted` | 3 (same files) | Widespread | `--inv-fg-muted` |
| `--inv-text-light` | `--inv-fg-subtle` | 0 | Used | Alias unused |
| `--inv-green` | `--inv-success` | 0 | Used | Alias unused |
| `--inv-amber` | `--inv-warning` | 0 | Used | Alias unused |

**Accent hover colour inconsistency across files:**

| File | Value Used as Hover | Matches `--inv-accent-hover`? |
|---|---|---|
| `assets/invicta-css-variables.css` | `#b91c1c` (canonical) | — |
| `sections/invicta-faq.liquid:331` | `#c4191f` | No |
| `sections/invicta-returns.liquid:38` | `#c4191f` | No |
| `sections/invicta-delivery-info.liquid:370` | `#c4191f` | No |
| `sections/invicta-simple-nav.liquid:142,506` | `#c9181f` | No |
| `sections/invicta-hero-split.liquid:635` | `#c81a22` | No |
| `sections/invicta-trust-reviews.liquid:264` | `#b91c1c` | Yes |

**Note:** Several sections define scoped `--inv-*` custom properties at `:root` or on the section element from `section.settings` values (e.g. `--inv-nl-*`, `--inv-usp2-*`, `--inv-cat-*`, `--inv-grid-*`, `--inv-recent-*`). These are not in the canonical token file and violate the `--inv-*` namespace convention.
