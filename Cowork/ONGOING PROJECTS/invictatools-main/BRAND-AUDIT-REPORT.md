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

---

## 2. Typography

### 2A. Font Families

Every unique font-family declaration found across all scanned files.

| Font Stack | File | Line | FLAGGED? |
|---|---|---|---|
| `var(--font-body-family)` | `layout/theme.liquid` | 326 | No — Shopify theme var |
| `var(--font-body-family)` | `assets/base.css` | 265 | No |
| `var(--font-heading-family)` | `assets/base.css` | 272, 337 | No |
| `var(--font-body-family)` | `assets/invicta-ux-improvements.css` | 117, 143, 173 | No |
| `inherit` | `assets/invicta-product-v2.css` | 24, 416, 789, 930, 960, 1043, 1094 | No — inheriting correct family |
| `inherit` | `assets/invicta-comparison.css` | 29, 148, 415 | No |
| `inherit` | `assets/invicta-cx-improvements.css` | 669 | No |
| `inherit` | `assets/invicta-product-card.css` | 346 | No |
| `'Barlow Condensed', Impact, 'Arial Narrow', sans-serif` | `sections/invicta-spotlight.liquid` | 132 | **FLAG: hardcoded — not a token** |
| `'Barlow Condensed', Impact, 'Arial Narrow', sans-serif` | `sections/invicta-hero-v3.liquid` | 174 | **FLAG: hardcoded — not a token** |
| `'Barlow Condensed', Impact, 'Arial Narrow', sans-serif` | `sections/invicta-promo-banners.liquid` | 229 | **FLAG: hardcoded — not a token** |
| `'DM Sans', sans-serif` | `sections/invicta-trust-reviews.liquid` | 313, 380, 458 | **FLAG: hardcoded — not a token** |
| `'DM Sans', sans-serif` | `sections/invicta-product-wall.liquid` | 150 | **FLAG: hardcoded — not a token** |
| `Georgia, "Times New Roman", Times, serif` | `assets/invicta-print.css` | 83 | **FLAG: serif — print context only, but non-brand** |
| `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` | `assets/invicta-print.css` | 99, 169 | **FLAG: system stack — print context** |
| `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif` | `assets/section-trade-landing.css` | 19 | **FLAG: system stack — not brand font** |

**Summary:** The codebase uses `var(--font-body-family)` and `inherit` in most CSS files. Barlow Condensed and DM Sans appear only as hardcoded strings in 4 section files. There are no `--inv-font-*` tokens in the CSS variables file — font family is delegated entirely to the Shopify base `--font-*` system. `invicta-print.css` uses Georgia serif and system UI stacks (acceptable for print but should be noted).

---

### 2B. Font Loading

| Type | URL / Value | File | Line | Notes |
|---|---|---|---|---|
| `<link rel="preconnect">` | `https://fonts.googleapis.com` | `sections/invicta-hero-v3.liquid` | 22 | Loads Barlow Condensed |
| `<link href="...">` | `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap` | `sections/invicta-hero-v3.liquid` | 24 | Weights 700 + 800 |
| `<link rel="preconnect">` | `https://fonts.googleapis.com` | `sections/invicta-promo-banners.liquid` | 23 | **DUPLICATE preconnect** |
| `<link href="...">` | `https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap` | `sections/invicta-promo-banners.liquid` | 25 | **DUPLICATE font load** |

**Flags:**
- The same Google Fonts stylesheet is loaded twice — once in `invicta-hero-v3.liquid` and once in `invicta-promo-banners.liquid`. If both sections appear on the same page, browsers will de-duplicate the request, but this represents sloppy dependency management.
- DM Sans is referenced in `invicta-trust-reviews.liquid` and `invicta-product-wall.liquid` with no corresponding `<link>` tag in those files — it will only render correctly if DM Sans happens to be the Shopify theme's `--font-body-family`. There is no explicit load guarantee for DM Sans in the Invicta layer.
- No `@font-face` declarations exist anywhere in the codebase — all font loading is via Google Fonts or the Shopify font system.

---

### 2C. Font Sizes

#### Headings (h1–h6 and heading-equivalent elements)

| Value | Element / Class | File | Line |
|---|---|---|---|
| `clamp(18px, 3.5vw, 24px)` | `.inv-pdp__title` (product page title) | `assets/invicta-product-v2.css` | 127 |
| `clamp(26px, 3.5vw, 36px)` | Trust reviews heading | `sections/invicta-trust-reviews.liquid` | 314 |
| `clamp(28px, 3vw, 36px)` | Trust reviews alt heading | `sections/invicta-trust-reviews.liquid` | 381 |
| `clamp(24px, 3vw, 32px)` | Product wall heading | `sections/invicta-product-wall.liquid` | 151 |
| `clamp(28px, 4vw, 36px)` | Trust bar heading | `sections/invicta-trust-bar.liquid` | 214 |
| `clamp(28px, 4vw, 40px)` | Trust bar alt heading | `sections/invicta-trust-bar.liquid` | 315 |
| `clamp(28px, 4vw, 42px)` | Trade CTA heading | `sections/invicta-trade-cta.liquid` | 46 |
| `clamp(1.75rem, 3vw, 2.5rem)` | FAQ heading | `sections/invicta-faq.liquid` | 62 |
| `clamp(1.75rem, 4vw, 2.5rem)` | Delivery info heading | `sections/invicta-delivery-info.liquid` | 59 |
| `clamp(20px, 2.5vw, {schema}px)` | Brand strip heading | `sections/invicta-brand-strip.liquid` | 72 |
| `clamp(26px, 5vw, 32px)` | PDP price (current) | `assets/invicta-product-v2.css` | 705 |
| `clamp(18px, 2vw, 22px)` | Hero split sub-heading | `sections/invicta-hero-split.liquid` | 539 |
| `clamp(18px, 5vw, 24px)` | Product wall mobile heading | `sections/invicta-product-wall.liquid` | 468 |
| `54px` | Hero v3 desktop headline | `sections/invicta-hero-v3.liquid` | 326 |
| `40px` | Hero v3 mobile headline | `sections/invicta-hero-v3.liquid` | 304 |
| `28px` | Hero v3 / spotlight heading | `sections/invicta-hero-v3.liquid:175`; `sections/invicta-spotlight.liquid:140` | — |
| `26px` | Hero v3 mobile sub-heading | `sections/invicta-hero-v3.liquid` | 279 |
| `24px` | Newsletter heading | `sections/invicta-newsletter.liquid` | 216 |
| `22px` | Trust reviews card title; spotlight alt; hero-split mobile | Multiple | — |
| `2rem` | Returns page section title | `sections/invicta-returns.liquid` | 72 |
| `2.5rem` | Returns desktop section title | `sections/invicta-returns.liquid` | 81 |
| `2.8rem` | Cart section title | `assets/invicta-cart.css` | 52 |
| `3.2rem` | Cart large total | `assets/invicta-cart.css` | 120 |
| `72px` | Newsletter decorative letter | `sections/invicta-newsletter.liquid` | 179 |
| `48px` | Trust bar stat number; newsletter mobile deco | Multiple | — |
| `1.9rem` | Search results header | `assets/invicta-search.css` | 64 |
| `24px` | Related products heading | `assets/invicta-related-products.css` | 35 |

#### Body Text

| Value | Element / Class | File | Line |
|---|---|---|---|
| `1.5rem` | `body` base (mobile) | `layout/theme.liquid` | 323 |
| `1.6rem` | `body` base (desktop ≥750px) | `layout/theme.liquid` | 333 |
| `14px` | Generic body / description text | Many files | — |
| `15px` | Body copy in several sections | Several | — |
| `1.0625rem` (17px) | FAQ section subtitle | `sections/invicta-faq.liquid` | 72 |
| `1.05rem` | Delivery info body | `sections/invicta-delivery-info.liquid` | 68, 98 |
| `1rem` | FAQ answer, delivery info text | Multiple | — |
| `0.9375rem` (15px) | Product grid body, FAQ, returns | Multiple | — |
| `0.95rem` | Cart sub-text | `assets/invicta-cx-improvements.css` | 648 |
| `0.9rem` | Cart/CX text | `assets/invicta-cx-improvements.css` | 668, 686 |
| `0.875rem` (14px) | Product grid body text | Several | — |

#### Small / Caption Text

| Value | Element / Class | File | Line |
|---|---|---|---|
| `11px` | Labels, small badges, sub-labels | Many files | — |
| `10px` | Very small labels | Many files | — |
| `9px` | Tiny badge text (search, product wall) | Multiple | — |
| `8px` | Micro text (product wall, search) | Multiple | — |
| `0.75rem` | Small text (delivery info, returns) | Several | — |
| `0.8125rem` (13px) | Small labels (product grid) | Several | — |
| `0.85rem` | CX improvement small text | `assets/invicta-cx-improvements.css` | 718, 733 |
| `0.75rem` | CX small text | `assets/invicta-cx-improvements.css` | 738, 751 |

#### Badges / Labels

| Value | Element / Class | File | Line |
|---|---|---|---|
| `9px` | Product card badge | `assets/invicta-product-card.css` | 123 |
| `11px` | Product card secondary badge | `assets/invicta-product-card.css` | 208 |
| `10px` | Search badge | `assets/invicta-search.css` | 259 |
| `9px` | Search tiny label | `assets/invicta-search.css` | 320 |
| `11px` | PDP status badge | `assets/invicta-product-v2.css` | 90, 256, 299 |
| `12px` | PDP variant label | `assets/invicta-product-v2.css` | 271, 606 |
| `10px` | Hero v3 badge label | `sections/invicta-hero-v3.liquid` | 163, 271 |
| `11px` | Product wall badge | `sections/invicta-product-wall.liquid` | 191 |
| `0.72rem` | Brand pill text (small) | `assets/invicta-brand-pill.css` | 138, 152 |
| `0.68rem` | Brand pill text (tiny) | `assets/invicta-brand-pill.css` | 172, 177 |
| `0.65rem` | Brand pill text (x-small) | `assets/invicta-brand-pill.css` | 209, 214 |

#### Prices

| Value | Element / Class | File | Line |
|---|---|---|---|
| `clamp(26px, 5vw, 32px)` | `.inv-pdp__price-current` | `assets/invicta-product-v2.css` | 705 |
| `20px` | `.inv-pdp-product-card__price` | `assets/invicta-product-card.css` | 291 |
| `18px` | PDP was-price | `assets/invicta-product-v2.css` | 734 |
| `16px` | PDP secondary price | `assets/invicta-product-v2.css` | 720 |
| `14px` | PDP price label | `assets/invicta-product-v2.css` | 713 |
| `13px` | PDP secondary label | `assets/invicta-product-v2.css` | 727 |
| `12px` | PDP price save badge | `assets/invicta-product-v2.css` | 757 |
| `2.4rem` | Cart total price | `assets/invicta-cart.css` | 534 |
| `1.7rem` | Cart item price | `assets/invicta-cart.css` | 285 |
| `17px` | Search result price | `assets/invicta-product-card.css` | 498 |

#### Navigation

| Value | Element / Class | File | Line |
|---|---|---|---|
| `{{ ss.font_size }}px` | `.inv-simple-nav__link` | `sections/invicta-simple-nav.liquid` | 92 |
| `{{ ss.font_size | times: 0.9 | round }}px` | Mobile nav link | `sections/invicta-simple-nav.liquid` | 172 |
| `13px` | Collection filter chip text | `sections/invicta-collection.liquid` | 76 |
| `15px` | Collection result count text | `sections/invicta-collection.liquid` | 88 |

#### Buttons

| Value | Element / Class | File | Line |
|---|---|---|---|
| `16px` | `.inv-pdp__atc-btn` (PDP Add to Cart) | `assets/invicta-product-v2.css` | 958 |
| `14px` | Various CTA buttons | Multiple | — |
| `15px` | Various secondary buttons | Multiple | — |
| `{{ section.settings.button_font_size }}px` | Hero split CTA button | `sections/invicta-hero-split.liquid` | 913 |
| `13px` | Small/link buttons | Multiple | — |

#### Form Inputs

| Value | Element / Class | File | Line |
|---|---|---|---|
| `16px` | Newsletter email input (iOS anti-zoom) | `sections/invicta-newsletter.liquid` | 288 |
| `16px` | PDP variant select (iOS anti-zoom) | `assets/invicta-ux-improvements.css` | 395 |
| `14px` | `.inv-pdp__variant-select` | `assets/invicta-product-v2.css` | 787 |
| `15px` | Quantity input | `assets/invicta-product-v2.css` | 928 |
| `0.9375rem` | Search input | `assets/invicta-search.css` | 433, 567 |

---

### 2D. Font Weights

All unique values found:

| Weight | Context | Key Files |
|---|---|---|
| `400` | Body text, was-price, search header | `invicta-product-v2.css:468`, `invicta-search.css:81`, `invicta-product-grid.liquid:480` |
| `500` | Muted labels, secondary body, sub-labels | Many files across assets and sections |
| `600` | Semi-bold labels, section subtitles, secondary CTA | Many files — common weight across components |
| `700` | Primary headings, buttons, card titles, active states | Most dominant weight across all files |
| `800` | Strong section headings, stat numbers, cart totals | Many sections: newsletter, trust-reviews, cart |
| `900` | Hero headlines, trust bar stat numbers, trust reviews main headings | `invicta-hero-v3.liquid:176`, `invicta-trust-bar.liquid:215`, `invicta-trust-reviews.liquid:315` |

**Flag:** Weight 900 is used for key marketing headline elements but Barlow Condensed only loads weights 700 and 800 via Google Fonts. If the Shopify `--font-heading-family` is not a 900-weight font, `font-weight: 900` will silently fall back to the nearest available weight, causing rendering inconsistency.

---

### 2E. Line Heights

All unique values found:

| Value | Context | Key Files |
|---|---|---|
| `0.9` | Newsletter decorative letter | `sections/invicta-newsletter.liquid:181` |
| `1` | Price displays, trust bar numbers, brand pill text | Many files |
| `1.1` | Hero headlines, trust reviews heading | Multiple |
| `1.15` | h1 global; hero v3; delivery info heading | `invicta-ux-improvements.css:321`, `invicta-hero-v3.liquid:169` |
| `1.2` | h2 global; headings, FAQ, returns, brand pill | `invicta-ux-improvements.css:322`, many files |
| `1.25` | h3 global | `invicta-ux-improvements.css:323` |
| `1.3` | Subheadings, quick cats, promo banners | Multiple |
| `1.35` | Cart product title | `assets/invicta-cart.css:288` |
| `1.4` | Body copy context, FAQ answers | Multiple |
| `1.45` | Product card title | `assets/invicta-product-card.css:249` |
| `1.5` | Body text, delivery info, FAQ | Most common for body text |
| `1.55` | Hero v3 subtitle; delivery info text | `invicta-hero-v3.liquid:188`, `invicta-delivery-info.liquid:325` |
| `1.6` | Base body (`invicta-product-v2.css`); footer nav; trust reviews body | Multiple |
| `1.7` | FAQ answer content; returns body text; PDP description | Multiple |
| `calc(1 + 0.8 / var(--font-body-scale))` | `body` base | `layout/theme.liquid:325` |

---

### 2F. Letter Spacing

All unique values found:

| Value | Context | Key Files |
|---|---|---|
| `-4px` | Newsletter decorative large letter | `sections/invicta-newsletter.liquid:182` |
| `-0.5px` | Hero v3 headline | `sections/invicta-hero-v3.liquid:180` |
| `-0.025em` | PDP product title | `assets/invicta-product-v2.css:132` |
| `-0.02em` | PDP price, FAQ heading, delivery info heading, trust bar | Multiple |
| `-0.01em` | FAQ subheading, USP strip, hero-split | Multiple |
| `0` | Cart subtitle | `assets/invicta-cart.css:67` |
| `0.02em` | PDP SKU text, comparison, brand strip | Multiple |
| `0.03em` | Brand pill, recently-viewed badge | Multiple |
| `0.04em` | Buttons (uppercase labels), cart, comparison, CX improvements | Most common for uppercase text |
| `0.05em` | Footer nav, cart free shipping, search headers, delivery info | Multiple |
| `0.06em` | Cart tabs, brand pill, trust reviews | Multiple |
| `0.08em` | Hero-split eyebrow, hero-split CTA | `sections/invicta-hero-split.liquid:101,448` |
| `0.1em` | Cart free shipping badge, trust bar, trust reviews | Multiple |
| `0.15em` | Trust reviews / trust bar eyebrow label | Multiple |
| `0.3em` | Trust bar accent number label | `sections/invicta-trust-bar.liquid:282` |
| `0.3px` | Quick cats nav text | `sections/invicta-quick-cats.liquid:152` |
| `0.5px` | Spotlight badge, hero-v3 badge, promo banner, product wall | Multiple |
| `1px` | Hero v3 eyebrow; trust reviews badge | Multiple |
| `2px` | Trust reviews stat label, newsletter uppercase | Multiple |
| `0.06rem` | Base body letter-spacing | `layout/theme.liquid:324` |
| `{{ ss.letter_spacing }}em` | Simple nav (schema-controlled) | `sections/invicta-simple-nav.liquid:95` |

**Flag:** The range spans from `-4px` to `0.3em` — a total of 20+ distinct values with no token structure for letter-spacing. The base body letter-spacing (`0.06rem`) conflicts with many component overrides that reset it to `0` or a different em value.

---

### 2G. Text Transform

All instances found:

| Value | Context | Key Files |
|---|---|---|
| `uppercase` | Buttons (ATC, CTA, nav), badge labels, eyebrow text, cart tabs, section section headers | **Dominant** — used in 50+ declarations across every major file |
| `none` | Cart heading reset (overrides inherited uppercase) | `assets/invicta-cart.css:59` |
| `{{ section.settings.heading_transform }}` | Category grid heading (schema-controlled) | `sections/invicta-category-grid.liquid:166` |
| `{{ section.settings.card_title_transform }}` | Category grid card title (schema-controlled) | `sections/invicta-category-grid.liquid:268` |
| `{{ ss.text_transform }}` | Simple nav text (schema-controlled) | `sections/invicta-simple-nav.liquid:94` |

**Note:** `capitalize` and `lowercase` are never used. `uppercase` is the exclusive applied transform. Two sections (category-grid) and one snippet (simple-nav) expose text-transform as a merchant-configurable schema setting, while all other components hardcode it.


---

## 3. Buttons

### 3A. Button Inventory

#### `.inv-pdp__atc-btn` — PDP Add to Cart (primary)

| Property | Value |
|---|---|
| Class | `.inv-pdp__atc-btn` |
| File | `assets/invicta-product-v2.css:951` |
| Height | `52px` (desktop), `50px` mobile (line 1399), `56px` small mobile (line 1503) |
| Padding | `0 20px` |
| Font size | `16px` |
| Font weight | `700` |
| Font family | `inherit` (overridden to `var(--font-body-family)` by `invicta-ux-improvements.css:117`) |
| Text transform | `uppercase` (`invicta-ux-improvements.css:119`) |
| Letter spacing | `0.04em` (`invicta-ux-improvements.css:120`) |
| Background | `var(--inv-accent)` |
| Color | `var(--inv-white)` |
| Border | `none` |
| Border radius | `0` |
| :hover | `background: var(--inv-accent-hover)` |
| :focus-visible | `outline: none; box-shadow: 0 0 0 3px rgba(220,38,38,0.4)` |
| :active | `transform: scale(0.98)` (`invicta-ux-improvements.css:125`) |
| :disabled | `background: var(--inv-fg-subtle); opacity: 0.5; cursor: not-allowed` |
| Transition | `background-color 0.15s ease` |
| Used for | PDP Add to Cart |

---

#### `.inv-pdp__buy-now-btn` — PDP Buy Now (secondary ghost)

| Property | Value |
|---|---|
| File | `assets/invicta-product-v2.css:1030` |
| Height | `48px` (desktop), `46px` mobile (line 1405), `44px` small mobile (line 1544) |
| Padding | `0 20px` (from wrapper context) |
| Font size | `14px` |
| Font weight | `600` |
| Font family | `inherit` |
| Text transform | Not set (not uppercase) |
| Background | `transparent` |
| Color | `var(--inv-fg-near-black)` |
| Border | `2px solid var(--inv-grey-200)` |
| Border radius | `0` |
| :hover | `border-color: var(--inv-dark); background: var(--inv-grey-50)` |
| :focus-visible | `outline: none; border-color: var(--inv-dark); box-shadow: var(--inv-focus-shadow)` |
| Transition | `border-color 0.15s ease, background-color 0.15s ease, color 0.15s ease` |
| Used for | PDP secondary buy now / checkout shortcut |

---

#### `.inv-btn-primary` — Global Primary CTA utility

| Property | Value |
|---|---|
| File | `assets/invicta-ux-improvements.css:134` |
| Height | Not set (implicit via padding) |
| Padding | `14px 28px` |
| Font size | `14px` |
| Font weight | `700` |
| Font family | `var(--font-body-family)` |
| Text transform | `uppercase` |
| Letter spacing | `0.04em` |
| Background | `var(--inv-accent)` |
| Color | `var(--inv-white)` |
| Border | `none` |
| Border radius | `var(--buttons-radius, 4px)` |
| :hover | `background: var(--inv-accent-hover); gap: 12px` |
| :focus-visible | `outline: 2px solid var(--inv-white); outline-offset: 2px` |
| Transition | `background 0.2s ease, gap 0.2s ease` |
| Used for | Generic section CTA links (hero, trade, spotlight) |

---

#### `.inv-btn-secondary` — Global Secondary CTA utility

| Property | Value |
|---|---|
| File | `assets/invicta-ux-improvements.css:164` |
| Height | Not set |
| Padding | `14px 28px` |
| Font size | `14px` |
| Font weight | `700` |
| Font family | `var(--font-body-family)` |
| Text transform | `uppercase` |
| Letter spacing | `0.04em` |
| Background | `var(--inv-dark)` |
| Color | `var(--inv-white)` |
| Border | `none` |
| Border radius | `var(--buttons-radius, 4px)` |
| :hover | `background: var(--inv-dark-hover); gap: 12px` |
| :focus-visible | `outline: 2px solid var(--inv-accent); outline-offset: 2px` |
| Transition | `background 0.2s ease, gap 0.2s ease` |
| Used for | Generic section secondary CTAs |

---

#### `.inv-card__btn` / `.inv-card__btn--add` — Product Card ATC

| Property | Value |
|---|---|
| File | `assets/invicta-product-card.css:338` |
| Min-height | `44px` |
| Padding | `10px 14px` |
| Font size | `13px` |
| Font weight | `700` |
| Font family | `inherit` |
| Text transform | `uppercase` |
| Letter spacing | `0.04em` |
| Background | `var(--inv-accent)` (add variant) |
| Color | `var(--inv-white)` |
| Border | `none` |
| Border radius | `8px` |
| :hover | `background: var(--inv-accent-hover); box-shadow: 0 4px 12px var(--inv-accent-glow)` |
| Transition | `background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease` |
| Used for | Product card Add to Cart |

**Note:** Border radius is `8px` on product card buttons but `0` on PDP ATC button — inconsistency.

---

#### `.inv-card__btn--options` — Product Card View Options

| Property | Value |
|---|---|
| File | `assets/invicta-product-card.css:373` |
| Background | `var(--inv-white)` |
| Color | `var(--inv-accent)` |
| Border | `1.5px solid var(--inv-accent)` |
| Border radius | `8px` |
| Used for | Product card "View Options" CTA |

---

#### `.cart__checkout-button` (cart page) — Checkout CTA

| Property | Value |
|---|---|
| File | `assets/invicta-cart.css:551` |
| Min-height | `5.4rem` (~54px) |
| Padding | `1.6rem 2.4rem` |
| Font size | `1.6rem` |
| Font weight | `700` |
| Text transform | `uppercase` |
| Letter spacing | `0.04em` |
| Background | `var(--inv-accent)` |
| Color | `var(--inv-white)` |
| Border | `none` |
| Border radius | `8px` |
| :hover | `background: var(--inv-accent-hover)` |
| :active | `transform: scale(0.98)` |
| Transition | `background 0.15s ease, transform 0.1s ease` |
| Used for | Cart page checkout |

---

#### `.cart__checkout-button` (drawer) — Drawer Checkout CTA

| Property | Value |
|---|---|
| File | `assets/invicta-cart.css:919` |
| Min-height | `5rem` (~50px) |
| Padding | `1.4rem 2rem` |
| Font size | `1.5rem` |
| Font weight | `700` |
| Text transform | `uppercase` |
| Letter spacing | `0.04em` |
| Background | `var(--inv-accent)` |
| Border radius | `8px` |
| :hover | `background: var(--inv-accent-hover)` |
| Used for | Slide-in cart drawer checkout |

---

#### `.inv-pdp__sticky-atc-btn` — Mobile Sticky ATC

| Property | Value |
|---|---|
| File | `assets/invicta-ux-improvements.css:270` |
| Height | Not explicit |
| Padding | `12px 24px` |
| Font size | `14px` |
| Font weight | `700` |
| Text transform | `uppercase` |
| Letter spacing | `0.04em` |
| Background | `var(--inv-accent)` |
| Border radius | `var(--buttons-radius, 4px)` |
| :hover | `background: var(--inv-accent-hover)` |
| :disabled | `background: var(--inv-fg-subtle)` |
| Transition | `background 0.2s` |
| Used for | Mobile sticky bar ATC |

---

#### `.inv-hero-v3__btn--primary` — Hero V3 Primary CTA

| Property | Value |
|---|---|
| File | `sections/invicta-hero-v3.liquid:222` |
| Min-height | `var(--inv-touch-target-min)` |
| Padding | `13px 28px` |
| Font size | `13px` |
| Font weight | `700` |
| Text transform | `uppercase` |
| Background | `var(--inv-accent)` |
| Color | `var(--inv-bg-elevated)` |
| Border | `none` |
| :hover | `background: var(--inv-accent-hover)` |
| :focus-visible | `outline: 2px solid var(--inv-accent); outline-offset: 2px` |
| Transition | `background var(--inv-duration-normal) ease` |
| Used for | Hero section primary CTA |

---

#### `.inv-hero-v3__btn--secondary` — Hero V3 Ghost CTA

| Property | Value |
|---|---|
| File | `sections/invicta-hero-v3.liquid:233` |
| Background | `transparent` |
| Color | `var(--inv-bg-elevated)` |
| Border | `1.5px solid rgba(255,255,255,0.3)` |
| :hover | `border-color: var(--inv-bg-elevated)` |
| Used for | Hero section secondary ghost CTA |

---

#### `.inv-newsletter-v2__btn` — Newsletter Subscribe

| Property | Value |
|---|---|
| File | `sections/invicta-newsletter.liquid:305` |
| Min-height | `44px` |
| Padding | `14px 28px` |
| Font size | `14px` |
| Font weight | `700` |
| Text transform | `uppercase` |
| Letter spacing | `0.5px` |
| Background | `var(--inv-nl-accent)` |
| Color | `#fff` (hardcoded) |
| Border | `none` |
| Border radius | `0` |
| :hover | `background: var(--inv-nl-accent-hover)` |
| :focus-visible | `outline: 2px solid #fff; outline-offset: 2px` |
| Transition | `background 0.2s` |
| Used for | Newsletter form subscribe CTA |

---

#### `.inv-pdp__notify-btn` — Out of Stock Notify Button

| Property | Value |
|---|---|
| File | `assets/invicta-cx-improvements.css:680` |
| Padding | `10px 20px` |
| Font size | `0.9rem` |
| Font weight | `600` |
| Background | `var(--inv-warning-dark)` |
| Color | `var(--inv-white)` |
| Border radius | `0` |
| :hover | `background: var(--inv-warning-darker)` |
| Used for | OOS notify me button on PDP |

---

### 3B. Button Dimensions Table

| Button | Height | Padding | Context |
|---|---|---|---|
| `.inv-pdp__atc-btn` (desktop) | `52px` | `0 20px` | PDP Add to Cart |
| `.inv-pdp__atc-btn` (mobile) | `50px` → `56px` | token-derived | PDP ATC mobile |
| `.inv-pdp__buy-now-btn` (desktop) | `48px` | `0 20px` | PDP Buy Now |
| `.inv-pdp__buy-now-btn` (mobile) | `46px` → `44px` | — | PDP Buy Now mobile |
| `.inv-btn-primary` | implicit (~45px) | `14px 28px` | Global primary CTA |
| `.inv-btn-secondary` | implicit | `14px 28px` | Global secondary CTA |
| `.inv-card__btn` | min `44px` | `10px 14px` | Product card ATC |
| `.cart__checkout-button` (page) | min `54px` | `1.6rem 2.4rem` | Cart checkout |
| `.cart__checkout-button` (drawer) | min `50px` | `1.4rem 2rem` | Drawer checkout |
| `.inv-pdp__sticky-atc-btn` | no explicit height | `12px 24px` | Mobile sticky ATC |
| `.inv-hero-v3__btn` | min `var(--inv-touch-target-min)` | `13px 28px` | Hero CTA |
| `.inv-newsletter-v2__btn` | min `44px` | `14px 28px` | Newsletter CTA |
| `.inv-pdp__notify-btn` | no explicit height | `10px 20px` | OOS notify |

**Flag:** PDP ATC (`52px`) vs product card button (`min-height: 44px`) vs hero CTA (`var(--inv-touch-target-min)`) — three different height patterns. Checkout button in cart page (`54px`) and drawer (`50px`) also differ. No single canonical button height is used consistently.

**Flag:** Border radius is inconsistent — `0` on PDP ATC and buy-now, `4px` (via `--buttons-radius`) on hero/utility, `8px` on product card and checkout buttons. The `invicta-radius-reset.css` enforces `border-radius: 0` globally on `.button.button` to counter Dawn theme's rounded buttons, but the Invicta-namespaced buttons override this back to `8px`.

---

## 4. Icons

### 4A. Inline SVG Inventory

All icons use `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"` unless noted. All have `aria-hidden="true"`.

| Icon | Depicts | File | Line | W×H | stroke-width | Colour Method |
|---|---|---|---|---|---|---|
| Arrow right | `→` line + arrowhead | `sections/invicta-spotlight.liquid` | 305,356,407 | no attr (CSS sized) | 2.5 | `currentColor` |
| Arrow right chevron | `>` right chevron | `snippets/invicta-section-header.liquid` | 45 | 10×10 | 3 | `currentColor` |
| Arrow right (14px) | `→` | `sections/invicta-trust-reviews.liquid` | 119 | 14×14 | 2.5 | `currentColor` |
| Checkmark (on filled circle) | USP verified checkmark | `sections/invicta-trust-reviews.liquid` | 49 | 20×20 | 2.5 | Hardcoded `#fff` stroke on filled background |
| Facebook logo | Social platform icon | `sections/invicta-trust-reviews.liquid` | 83 | 22×22 | — | Hardcoded `fill="#1877F2"` |
| Trustpilot star | Rating star | `sections/invicta-trust-reviews.liquid` | 87 | 22×22 | — | Hardcoded `fill="#00b67a"` |
| Shield + checkmark | Trust / secure | `snippets/invicta-trust-bar.liquid` | 30 | 18×18 | 2 | `currentColor` |
| Delivery truck | Delivery | `snippets/invicta-trust-bar.liquid` | 37 | 18×18 | 2 | `currentColor` |
| Shield outline | Warranty | `snippets/invicta-trust-bar.liquid` | 44 | 18×18 | 2 | `currentColor` |
| Map pin | Location | `snippets/invicta-trust-bar.liquid` | 51 | 18×18 | 2 | `currentColor` |
| Clock | Dispatch time | `snippets/invicta-trust-bar.liquid` | 58 | 18×18 | 2 | `currentColor` |
| Checkmark circle | Success / delivery done | `snippets/invicta-free-delivery-bar.liquid` | 35 | 18×18 | 2.5 | `currentColor` |
| Delivery truck (small) | Delivery progress | `snippets/invicta-free-delivery-bar.liquid` | 40 | 16×16 | 2 | `currentColor` |
| Delivery truck (USP strip) | USP: Free delivery | `sections/invicta-usp-strip-v2.liquid` | 22 | no attr | 2.5 | `currentColor` |
| Shield / padlock variants | USP: Security, warranty etc | `sections/invicta-usp-strip-v2.liquid` | 29–63 | no attr | 2.5 | `currentColor` |
| Chevron right (nav arrow) | Link indicator | `snippets/invicta-brand-hero.liquid` | 97 | 14×14 | 2 | `currentColor` |
| Shield | Brand hero trust icon | `snippets/invicta-brand-hero.liquid` | 82 | no attr | 2 | `currentColor` |
| Delivery truck | Brand hero trust icon | `snippets/invicta-brand-hero.liquid` | 86 | no attr | 2 | `currentColor` |
| Map pin | Brand hero trust icon | `snippets/invicta-brand-hero.liquid` | 90 | no attr | 2 | `currentColor` |
| Truck (delivery estimate) | Delivery status | `snippets/invicta-delivery-estimate.liquid` | 22 | no attr | 2 | `currentColor` |
| Magnifier (search) | FAQ search | `sections/invicta-faq.liquid` | 387 | no attr | 2 | `currentColor` |
| X / close | FAQ clear search | `sections/invicta-faq.liquid` | 405 | 16×16 | 2 | `currentColor` |
| Plus (+) expand | FAQ accordion toggle | `sections/invicta-faq.liquid` | 459 | no attr | 2.5 | `currentColor` |
| Arrow up | FAQ scroll top | `sections/invicta-faq.liquid` | 488 | 16×16 | 2.5 | `currentColor` |
| Tag / label | Product badge on PDP | `sections/invicta-product-v2.liquid` | 601 | 18×18 | 2 | `currentColor` |
| Grid (4 squares) | Collection grid toggle | `sections/invicta-collection.liquid` | 149 | 14×14 | 2 | `currentColor` |
| Tag | Collection badge filter | `sections/invicta-collection.liquid` | 172 | 14×14 | 2 | `currentColor` |
| Checkmark (ring) | Spinner / loading | `sections/invicta-product-v2.liquid` | 737 | 16×16 | 2 | `currentColor` |
| Checkmark (solid) | ATC success | `sections/invicta-product-v2.liquid` | 742 | 16×16 | 2.5 | `currentColor` |
| Checkmark (in-stock, green) | In stock indicator | `sections/invicta-product-v2.liquid` | 770 | 16×16 | 2 | Hardcoded `stroke="#16a34a"` |
| Shield (in-stock) | Secure / in stock | `sections/invicta-product-v2.liquid` | 774,778 | 16×16 | 2 | Hardcoded `stroke="#16a34a"` |
| Padlock | Security / in-stock | `sections/invicta-product-v2.liquid` | 782 | 16×16 | 2 | Hardcoded `stroke="#16a34a"` |
| Bell | Notify me OOS | `sections/invicta-product-v2.liquid` | 720 | 18×18 | 2 | `currentColor` |
| Chevron (accordion) | Info tab toggle | `sections/invicta-product-v2.liquid` | 399–437 | no attr | 2 | `currentColor` |
| Compare (scale/image) | Comparison toggle on card | `snippets/invicta-product-card.liquid` | 132 | no attr | 2 | `currentColor` |
| Empty / placeholder product | No-image placeholder | `snippets/invicta-product-card.liquid` | 165 | 40×40 | 1 (thin) | `currentColor` |
| Cart add | Card add icon | `snippets/invicta-product-card.liquid` | 253,269 | no attr | 2 | `currentColor` |
| Facebook logo (footer) | Social footer link | `sections/invicta-footer.liquid` | 93,106,148 | 14×14 / 20×20 | — | `fill="currentColor"` |
| LinkedIn logo | Social footer link | `sections/invicta-footer.liquid` | 154 | 20×20 | — | `fill="currentColor"` |
| Instagram logo | Social footer link | `sections/invicta-footer.liquid` | 160 | 20×20 | — | `fill="currentColor"` |
| Trustpilot star (small) | Review platform inline | JS-generated (`invicta-trust-reviews.liquid`) | 858,861 | 14×14 | — | Hardcoded `fill="#00b67a"`, `fill="#1877F2"` |
| Nav indicator chevron | Simple nav item link | `sections/invicta-simple-nav.liquid` | 205 | no attr | 2 | `currentColor` |

---

### 4B. Icon Sizing Table

| Size | Context | Files |
|---|---|---|
| No explicit `width`/`height` attrs (CSS sized) | USP strip icons, spotlight arrows, FAQ search, collection chevrons, product card compare | `invicta-usp-strip-v2.liquid`, `invicta-spotlight.liquid`, `invicta-collection.liquid`, `snippets/` |
| 10×10 | Section header breadcrumb chevron | `snippets/invicta-section-header.liquid:45` |
| 14×14 | Collection badges, social icons (footer small), review platform markers | Multiple sections |
| 15×15 | Product card button icon | `assets/invicta-product-card.css:358` |
| 16×16 | Inline icons (ATC state, close, FAQ, PDP in-stock), utility nav | Many files |
| 18×18 | Trust bar icons, free delivery bar, PDP bell/tag, delivery estimate | Multiple |
| 20×20 | Trust reviews point icon, social footer icons (medium) | Multiple |
| 22×22 | Trust reviews platform logos | `sections/invicta-trust-reviews.liquid:76,83,87` |
| 24×24 | PDP expand/lightbox close | `sections/invicta-product-v2.liquid:857` |
| 26×26 | Footer large social icon | `sections/invicta-footer.liquid:137` |
| 40×40 | Product card no-image placeholder | `snippets/invicta-product-card.liquid:165` |
| 48×48 | Recently viewed empty state placeholder | `sections/invicta-recently-viewed.liquid:77` |

**Flag:** Icons without explicit `width`/`height` attributes rely on CSS sizing — if CSS fails to load or is overridden, icons will collapse to zero size. Hardcoded `stroke="#16a34a"` and `fill="#1877F2"` / `fill="#00b67a"` appear in multiple places and bypass the colour token system. Two distinct `stroke-width` values (`2` and `2.5`) are used across the system with no consistent rule — heavier icons appear in USP strips and FAQ, lighter in navigation and social.


---

## 5. Spacing

### 5A. Section Padding

Sections without schema padding controls use hardcoded values. Default values are from the `"default"` key in schema range controls.

| Section File | Desktop PT | Desktop PB | Mobile PT | Mobile PB | Token Used? | Schema Range? |
|---|---|---|---|---|---|---|
| `invicta-hero-v3.liquid` | Schema (default: `0`) | Schema (default: `0`) | Schema value | Schema value | No | Yes |
| `invicta-hero-split.liquid` | Schema (default: `20`) | Schema (default: `20`) | 75% of schema (×0.7 approx) | 75% | No | Yes |
| `invicta-trust-strip.liquid` | Schema (default: `0`) | Schema (default: `0`) | Schema value | Schema value | No | Yes |
| `invicta-trust-bar.liquid` | Schema | Schema | Schema | Schema | No | Yes |
| `invicta-usp-strip-v2.liquid` | `max(schema, 10px)` | `max(schema, 10px)` | Schema | Schema | No | Yes |
| `invicta-spotlight.liquid` | Schema (default: `40`) | Schema (default: `40`) | Schema | Schema | No | Yes |
| `invicta-quick-cats.liquid` | Schema (default: `0`) | `20px` hardcoded | Schema | `20px` | Partial | Yes |
| `invicta-product-wall.liquid` | Schema (default: `40`) | Schema (default: `40`) | Schema | Schema | No | Yes (inline style) |
| `invicta-product-grid.liquid` | Schema | Schema | Schema × 0.6 | Schema × 0.6 | No | Yes |
| `invicta-collection.liquid` | Not controlled by padding schema | No schema padding | — | — | — | No |
| `invicta-trust-reviews.liquid` | Schema (default: `48`) | Schema (default: `48`) | `32px` hardcoded | Schema | Partial | Yes |
| `invicta-recently-viewed.liquid` | Schema | Schema | Schema × 0.7 | Schema × 0.7 | No | Yes |
| `invicta-newsletter.liquid` | Not in section wrapper | Not in section wrapper | — | — | — | No |
| `invicta-footer.liquid` | Schema | Schema | Schema | Schema | No | Yes |
| `invicta-simple-nav.liquid` | Not a section | — | — | — | — | — |
| `invicta-promo-banners.liquid` | Schema | Schema | Schema | Schema | No | Yes |
| `invicta-faq.liquid` | Not direct section | — | — | — | — | No |
| `invicta-delivery-info.liquid` | Not controlled by section padding | — | — | — | — | No |
| `invicta-returns.liquid` | `48px 0 64px` hardcoded | — | — | — | No | No |
| `invicta-comparison.liquid` | No section padding | — | — | — | — | No |
| `invicta-brand-collection.liquid` | No section padding | — | — | — | — | No |
| `invicta-brand-strip.liquid` | Schema (clamp if > 20px, default: `48`) | Schema (clamp if > 16px, default: `48`) | Clamp via schema | Clamp via schema | No | Yes |
| `invicta-category-grid.liquid` | Schema | Schema | Schema × 0.6 | Schema × 0.6 | No | Yes |
| `invicta-trade-cta.liquid` | `0 20px` hardcoded (only horizontal) | — | — | — | No | No |
| `invicta-related-products.liquid` | Schema × 0.75 (mobile) / Schema (desktop) | Schema | Schema × 0.75 | Schema | No | Yes |

**Key observations:**
- No section uses `--inv-space-*` tokens for its outer section padding — all use raw pixel values from schema or hardcoded.
- Mobile padding reductions are computed inconsistently: some use ×0.6, some ×0.7, some ×0.75, some `max()` clamping.
- `invicta-quick-cats.liquid` hardcodes bottom padding to `20px` regardless of schema.

---

### 5B. Container Widths

| Value | Context | File |
|---|---|---|
| `var(--inv-container, 1400px)` | Primary layout container — hero, trust strip, spotlight, product wall, newsletter, brand strip, simple nav, quick cats | Multiple sections |
| `var(--inv-page-width, 1320px)` | Narrower content container — FAQ, delivery info, returns | Multiple sections |
| `1400px` | Trade CTA wrapper (hardcoded, not using token) | `sections/invicta-trade-cta.liquid:15` |
| `var(--page-width, 1200px)` | Category grid (Shopify base token, not Invicta) | `sections/invicta-category-grid.liquid:147` |
| `1400px` | PDP layout container | `assets/invicta-product-v2.css:21` |
| `1400px` | Sticky ATC bar | `assets/invicta-ux-improvements.css:244` |
| `var(--inv-page-width, 1320px)` | Related products | `assets/invicta-related-products.css:20` |
| `700px` | Search dropdown | `assets/invicta-search.css:19` |

**Flag:** Three different container width systems are in use: `--inv-container` (1400px), `--inv-page-width` (1320px), and `--page-width` (Shopify base, 1200px). `invicta-trade-cta.liquid` hardcodes `1400px` instead of using the token, and `invicta-category-grid.liquid` uses `--page-width` from the base theme, not the Invicta system.

---

### 5C. Container Gutters

| Value | Context | File |
|---|---|---|
| `var(--inv-page-gutter, 1.5rem)` | Token default — page horizontal padding | `assets/invicta-css-variables.css:195` |
| `var(--inv-page-gutter-desktop, 3rem)` | Desktop gutter token | `assets/invicta-css-variables.css:196` |
| `var(--inv-mobile-gutter, 12px)` | Mobile gutter token | `assets/invicta-css-variables.css:211` |
| `0 1.5rem` | Category grid container | `sections/invicta-category-grid.liquid:149` |
| `0 1rem` | Recently-viewed mobile, product-grid mobile | Multiple |
| `0 20px` | Trade CTA | `sections/invicta-trade-cta.liquid:17` |
| `0 var(--inv-space-lg)` | PDP layout | `assets/invicta-product-v2.css:23` |
| `0 var(--inv-space-md)` | PDP mobile | `assets/invicta-product-v2.css:1304` |

**Flag:** Container gutters are inconsistently applied. Several sections set horizontal padding in inline `padding` shorthand rather than using gutter tokens. The `--inv-page-gutter` token exists but is not consistently applied to section containers.

---

### 5D. Grid Gaps

| Value | Context | File |
|---|---|---|
| `var(--inv-space-xs)` = 4px | PDP internal small gaps | `assets/invicta-product-v2.css` |
| `var(--inv-space-sm)` = 8px | PDP gallery thumbs, feature groups | `assets/invicta-product-v2.css` |
| `var(--inv-space-sm-plus)` = 12px | PDP sections default, buybox | `assets/invicta-product-v2.css` |
| `var(--inv-space-md)` = 16px | PDP info groups | `assets/invicta-product-v2.css` |
| `var(--inv-space-lg)` = 24px | PDP main columns, price block | `assets/invicta-product-v2.css` |
| `var(--inv-space-xl)` = 32px | PDP full layout | `assets/invicta-product-v2.css` |
| `var(--inv-space-2xl)` = 48px | PDP top-level columns | `assets/invicta-product-v2.css` |
| `3px` | CX badge icon gap | `assets/invicta-cx-improvements.css:75` |
| `4px` | CX small gaps, product card price row | Multiple |
| `6px` | Comparison, CX, cart | Multiple |
| `8px` | Most common non-token gap: buttons, product card, cart | Many files |
| `10px` | Related products, cart, utility buttons | Multiple |
| `12px` | Comparison, search, cart, newsletter | Multiple |
| `14px` | Search results layout | `assets/invicta-search.css:210,495` |
| `16px` | Related products card grid | `assets/invicta-related-products.css:59,76` |
| `--inv-mobile-card-gap` (10px) | Defined but usage not confirmed in scanned files | Token only |

**Note:** PDP uses tokens almost exclusively for gaps. All other components use raw pixel values. This creates two tiers of gap management with no consistent bridge.

---

### 5E. Component Internal Spacing

| Component | Internal Padding | File |
|---|---|---|
| Product card (`.inv-card`) | `12px` (body — not shown directly, inferred from card layout) | `assets/invicta-product-card.css` |
| Product card badge | `6px 12px` | `assets/invicta-product-v2.css:254` |
| PDP option group | `8px 14px` | `assets/invicta-product-v2.css:269,325,354` |
| PDP info tab item | `14px 20px` and `16px 20px` | `assets/invicta-product-v2.css:379,410` |
| PDP description panel | `0 20px 20px` | `assets/invicta-product-v2.css:442` |
| PDP trust strip item | `var(--inv-space-sm-plus) 0` | `assets/invicta-product-v2.css:1076` |
| Trust strip item (USP) | `14px 20px` | `sections/invicta-trust-strip.liquid:124` |
| USP strip item | `20px 16px` (desktop), `16px 20px` and `14px 12px` (mobile) | `sections/invicta-usp-strip-v2.liquid:125,198,217` |
| Trust bar tab item | `24px 16px` (desktop), `10px 16px` (mobile) | `sections/invicta-trust-bar.liquid:197,523` |
| Cart item | `1.2rem` gap | `assets/invicta-cart.css:218` |
| Newsletter form | `28px 48px` (desktop), `16px 28px` (mobile) | `sections/invicta-newsletter.liquid:168,410` |
| Category grid card | `60px 20px` (empty), schema-controlled title | `sections/invicta-category-grid.liquid:194` |

---

## 6. Borders & Radius

### 6A. Border Radius

All non-zero values found:

| Value | Element/Context | File | Line |
|---|---|---|---|
| `2px` | PDP bundle label; related product save badge; trade-cta eyebrow | Multiple | Various |
| `3px` | CX improvement badge; cart discount chip; recently-viewed chip | Multiple | Various |
| `4px` | Badge; comparison badge; cart discount chip; input (via `--inv-radius-sm`) | Multiple | Various |
| `6px` | Cart quantity btn; cart remove btn; CX components; search items; product card secondary badge; footer social links; product grid chips | Many files | Various |
| `8px` | Cart items wrapper; checkout button (cart + drawer); comparison drawer; CX; search items; hero-split badge; footer newsletter input | Many files | Various |
| `10px` | Cart item card (mobile); CX dropdown; search items | `invicta-cart.css:214`, `invicta-cx-improvements.css:282` | Various |
| `11px` | Hero-split accent badge | `sections/invicta-hero-split.liquid:514` | — |
| `12px` | Product card outer card; lightbox container; search dropdown container; category grid card; product-wall tab active | Multiple | Various |
| `16px` | Comparison modal top; `--inv-radius-xl` token | Multiple | Various |
| `20px` | CX pill badge | `assets/invicta-cx-improvements.css:351` | — |
| `24px` | Product wall brand pill active | `sections/invicta-product-wall.liquid:234` | — |
| `50%` | Circular icons (brand pill avatar, cart shipping icon, USP strip icon bg, footer social, trust-bar circle, newsletter icon) | Many files | Various |
| `50px` | Recently-viewed filter chip | `sections/invicta-recently-viewed.liquid:340` | — |
| `100px` | Pill-shaped swatch/colour chip in PDP | `assets/invicta-product-v2.css:298,326,355` | — |
| `999px` | Brand pill; comparison sticky bar; collection filter chip; footer chip | Multiple | Various |
| `0` | PDP ATC, buy-now, variant select, all form inputs (via `invicta-radius-reset.css`), info tabs, trust-reviews cards | Many files | Various |
| `var(--inv-radius-sm)` = 4px | Token-driven: sticky ATC thumb, PDP gallery thumb, spec card | Multiple | Various |
| `var(--inv-radius-md)` = 8px | Token-driven: PDP image, swatch group, lightbox, modal, radius-reset cards, quick cats card | Multiple | Various |
| `var(--inv-radius-lg)` = 12px | Token-driven: PDP mobile main, radius-reset media | Multiple | Various |
| `var(--inv-radius-button)` = 0 | Button base reset | `assets/invicta-radius-reset.css:30` | — |
| `var(--inv-radius-card)` = 0 | Card base reset | `assets/invicta-radius-reset.css:42,55` | — |
| `var(--inv-radius-input)` = 0 | Input base reset | `assets/invicta-radius-reset.css:75,85` | — |
| `var(--buttons-radius, 4px)` | Dawn theme fallback for buttons | Multiple via ux-improvements | Various |

**Summary:** There are 20+ distinct radius values in use across the codebase. The design intent (via `invicta-radius-reset.css`) is to set `--inv-radius-button`, `--inv-radius-card`, and `--inv-radius-input` all to `0`, but numerous components override with raw `8px`, `12px`, `6px`, `4px` values. The product card itself has `border-radius: 12px` while `--inv-radius-card` = 0. This is a significant inconsistency.

---

### 6B. Border Styles

| Pattern | Context | Files |
|---|---|---|
| `1px solid var(--inv-border)` (#e5e7eb) | Default dividers, product card separators | Many |
| `1px solid var(--inv-border-dark)` (#d1d5db) | Stronger dividers, cart item borders | Multiple |
| `1px solid var(--inv-grey-200)` | PDP form inputs, qty stepper | `invicta-product-v2.css` |
| `1px solid var(--inv-grey-100)` | PDP section dividers | `invicta-product-v2.css` |
| `2px solid var(--inv-grey-200)` | PDP variant select | `invicta-product-v2.css:785` |
| `2px solid var(--inv-dark)` | Focus/active border override | `invicta-product-v2.css:803` |
| `1.5px solid var(--inv-accent)` | Product card options button outline | `invicta-product-card.css:376` |
| `1.5px solid rgba(255,255,255,0.3)` | Hero v3 ghost button | `invicta-hero-v3.liquid:236` |
| `3px solid var(--inv-accent)` | PDP price savings callout | `invicta-product-v2.css:755` |
| `2px solid var(--inv-accent)` | Focus rings on inputs, trust link | Multiple |
| `1px solid var(--inv-bg-card-border)` (#ececec) | Product card border | `invicta-product-card.css:34` |
| `1px solid var(--inv-nav-border)` (#eeeeee) | Navigation section border | Token |
| `border-bottom: 2px solid var(--inv-accent)` | Active tabs, nav active items | Multiple |
| `border-left: 3px solid var(--inv-accent)` | Alert/callout left accent | `invicta-product-v2.css:755` |

---

## 7. Shadows

| Value | Token Used? | Context | File |
|---|---|---|---|
| `var(--inv-shadow-color)` = `rgba(0,0,0,0.1)` | Yes | Sticky ATC bottom shadow, product card hover, search | Multiple |
| `var(--inv-shadow-card)` = `0 1px 3px rgba(0,0,0,0.08)` | Yes | Referenced but rarely used directly |  |
| `var(--inv-shadow-elevated)` = `0 4px 12px rgba(0,0,0,0.1)` | Yes | Referenced as token | Token definition |
| `var(--inv-focus-shadow)` | Yes | PDP swatch focus, buy-now focus, variant focus | Multiple via `invicta-product-v2.css` |
| `var(--inv-accent-glow)` = `rgba(225,29,38,0.25)` | Yes | Product card ATC hover, card btn hover | `invicta-product-card.css:370,384` |
| `var(--inv-accent-ring)` = `rgba(225,29,38,0.1)` | Yes | Search input focus ring | `invicta-search.css:52` |
| `0 1px 3px rgba(0,0,0,0.04)` | No | Product card base shadow; cart item shadow | `invicta-product-card.css:32`, `invicta-cart.css:217` |
| `0 12px 28px var(--inv-shadow-color), 0 4px 10px rgba(0,0,0,0.04)` | Partial | Product card hover (compound) | `invicta-product-card.css:39` |
| `0 1px 3px rgba(0,0,0,0.08)` | No (matches `--inv-shadow-card`) | Compare button | `invicta-product-card.css:151` |
| `0 2px 8px rgba(0,0,0,0.08)` | No | PDP swatch hover; UX improvements search bar | `invicta-product-v2.css:184`, `invicta-ux-improvements.css:360` |
| `0 4px 16px rgba(0,0,0,0.08)` | No | UX improvements toaster/sticky bar | `invicta-ux-improvements.css:360` |
| `0 4px 16px rgba(0,0,0,0.2)` | No | Comparison sticky bar | `invicta-comparison.css:27` |
| `0 6px 20px rgba(0,0,0,0.25)` | No | Comparison sticky bar hover | `invicta-comparison.css:35` |
| `0 4px 12px rgba(0,0,0,0.2)` | No | Comparison remove btn | `invicta-comparison.css:54` |
| `0 -4px 30px rgba(0,0,0,0.15)` | No | Comparison modal top edge | `invicta-comparison.css:98` |
| `0 2px 8px rgba(0,0,0,0.06)` | No | Brand pill base | `invicta-brand-pill.css:64` |
| `0 4px 12px rgba(0,0,0,0.10)` | No | Brand pill hover | `invicta-brand-pill.css:77` |
| `0 4px 12px rgba(0,0,0,0.2)` | No | Brand pill shimmer | `invicta-brand-pill.css:302` |
| `0 0 0 3px rgba(220,38,38,0.4)` | No | PDP ATC focus ring | `invicta-product-v2.css:977` |
| `0 0 0 3px rgba(255,255,255,0.5)` | No | PDP swatch focus ring (on dark bg) | `invicta-product-v2.css:287` |
| `inset 0 0 0 2px var(--inv-dark)` | Yes (token) | PDP qty btn active | `invicta-product-v2.css:906` |
| `-8px 0 30px rgba(0,0,0,0.12)` | No | Cart drawer left edge shadow | `invicta-cart.css:835` |
| `0 -6px 20px rgba(0,0,0,0.08)` | No | Cart drawer footer top shadow | `invicta-cart.css:915` |
| `0 8px 30px rgba(0,0,0,0.12)` | No | CX dropdown | `invicta-cx-improvements.css:477` |
| `0 0 0 2px var(--inv-accent)` | Yes | CX swatch active border ring | `invicta-cx-improvements.css:444` |

**Summary:** The shadow token system (`--inv-shadow-*`) is defined but underused. The majority of shadows are hardcoded `rgba(0,0,0,X)` values at 7+ different opacity levels and spread values. `--inv-shadow-sm`, `--inv-shadow-lg`, `--inv-shadow-soft`, `--inv-shadow-xl` are all defined but verified unused (listed in the Pass 1 unused tokens). `--inv-focus-shadow` and `--inv-shadow-color` are the only shadow tokens seeing active use.

