# Performance Snappiness Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate layout-thrashing resize handlers, reduce search interaction overhead, and async-load render-blocking section CSS to make the site feel snappy.

**Architecture:** Four targeted JS patches (rAF debounce on resize handlers, merge redundant MutationObservers, replace createElement skeleton loop with innerHTML) plus one CSS-loading fix in the announcement bar. No new abstractions — each fix is the minimal change to the exact lines causing the problem.

**Tech Stack:** Vanilla JS (customElements), Shopify Liquid sections, no build step (files deployed directly to Shopify CDN).

---

## Audit Summary (what was found)

| Issue | File | Lines | Impact |
|---|---|---|---|
| Unthrottled `resize` → `getBoundingClientRect` + CSS var write | `assets/global.js` | 438, 450–457 | Layout thrash on every resize event |
| Unthrottled `resize` → `offsetHeight` reads | `assets/quick-order-list.js` | 26, 51–54 | Layout thrash on resize |
| Two separate MutationObservers watching same element | `assets/invicta-cx-improvements.js` | 93–143 | Extra callbacks on every search result update |
| 15+ `createElement` calls to build 3 skeleton items | `assets/invicta-search.js` | 333–366 | Slow main-thread DOM creation on each search keystroke |
| `stylesheet_tag` (sync `<link>`) in announcement bar body | `sections/announcement-bar.liquid` | 1–2 | Render-blocking CSS on every page |

---

## File Map

| File | Change |
|---|---|
| `assets/global.js` | Add `_resizeRaf` guard to `HeaderDrawer.onResize` |
| `assets/quick-order-list.js` | Add `_resizeRaf` guard to `handleResize` |
| `assets/invicta-cx-improvements.js` | Merge `searchResultsObserver` + `expandedObserver` into one |
| `assets/invicta-search.js` | Replace createElement loop in `_showLoading` with `innerHTML` |
| `sections/announcement-bar.liquid` | Convert `stylesheet_tag` calls to async `media="print"` pattern |

---

## Task 1: rAF-debounce `HeaderDrawer.onResize` in global.js

**Files:**
- Modify: `assets/global.js:450–457`

**Why it matters:** `onResize` fires dozens of times per second during any window resize (or mobile keyboard open/close). It calls `getBoundingClientRect()` — a forced synchronous layout — and immediately writes a CSS variable, causing a style recalc. This creates a layout-thrash loop.

**Current code (`global.js:450–457`):**
```js
onResize = () => {
  this.header &&
    document.documentElement.style.setProperty(
      '--header-bottom-position',
      `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`
    );
  document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
};
```

- [ ] **Step 1: Apply the fix**

Replace the `onResize` method body (lines 450–457) with:

```js
onResize = () => {
  if (this._resizeRaf) return;
  this._resizeRaf = requestAnimationFrame(() => {
    this.header &&
      document.documentElement.style.setProperty(
        '--header-bottom-position',
        `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`
      );
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    this._resizeRaf = null;
  });
};
```

The `_resizeRaf` flag means only one rAF callback can be queued at a time. Subsequent resize events during the same frame are no-ops.

- [ ] **Step 2: Verify in DevTools**

1. Open Chrome DevTools → Performance tab
2. Open the mobile menu drawer on the site (so the resize listener registers)
3. Record while resizing the browser window rapidly for 2 seconds
4. Stop recording — look at the "Main" thread timeline
5. Expected: Layout (purple) bars are sparse, not a solid block
6. Previous behaviour was: near-solid purple layout recalc bars during resize

- [ ] **Step 3: Commit**

```bash
git add "assets/global.js"
git commit -m "perf(js): rAF-debounce HeaderDrawer.onResize to prevent layout thrash"
```

---

## Task 2: rAF-debounce `QuickOrderList.handleResize` in quick-order-list.js

**Files:**
- Modify: `assets/quick-order-list.js:25–26, 51–54`

**Why it matters:** Same problem as Task 1. `handleResize` reads `offsetHeight` (forced reflow) on every resize event with no throttle. Only fires when the quick-order-list element is present, but users on trade/bulk pages will feel this on every keyboard open or orientation change.

**Current code (`quick-order-list.js:25–26`):**
```js
this.handleResize = this.handleResize.bind(this);
window.addEventListener('resize', this.handleResize);
```

**Current `handleResize` (`quick-order-list.js:51–54`):**
```js
handleResize() {
  if (this.totalBar) this.totalBarPosition = window.innerHeight - this.totalBar.offsetHeight;
  if (this.stickyHeader) this.stickyHeader.height = this.stickyHeaderElement ? this.stickyHeaderElement.offsetHeight : 0;
}
```

- [ ] **Step 1: Apply the fix**

Replace the `handleResize` method (lines 51–54) with:

```js
handleResize() {
  if (this._resizeRaf) return;
  this._resizeRaf = requestAnimationFrame(() => {
    if (this.totalBar) this.totalBarPosition = window.innerHeight - this.totalBar.offsetHeight;
    if (this.stickyHeader) this.stickyHeader.height = this.stickyHeaderElement ? this.stickyHeaderElement.offsetHeight : 0;
    this._resizeRaf = null;
  });
}
```

No changes needed to lines 25–26 (the bind/addListener).

- [ ] **Step 2: Verify**

Visit `/pages/quick-order` or any page with `<quick-order-list>`. Open DevTools → Performance, resize the window rapidly. Confirm layout thrash bars are eliminated or greatly reduced compared to before.

- [ ] **Step 3: Commit**

```bash
git add "assets/quick-order-list.js"
git commit -m "perf(js): rAF-debounce QuickOrderList.handleResize to prevent layout thrash"
```

---

## Task 3: Merge dual MutationObservers in invicta-cx-improvements.js

**Files:**
- Modify: `assets/invicta-cx-improvements.js:93–143`

**Why it matters:** Two separate `MutationObserver` instances watch the same `results` element. When search results update, both callbacks fire. Observer 1 does a `querySelectorAll` + live region announce. Observer 2 does a `childNodes.length` check + `setAttribute`. That's two separate microtask callbacks, two DOM reads, two DOM writes — all triggered by a single mutation. Merging them into one halves the callback overhead and avoids double-work on every result update.

**Current code (`invicta-cx-improvements.js:92–119`):**
```js
// Reset focus index when results change
const searchResultsObserver = new MutationObserver(function() {
  focusIndex = -1;
  const items = results.querySelectorAll('.inv-search-results__item');
  if (items.length > 0) {
    InvictaAnnouncer.announce(items.length + ' search results found. Use arrow keys to navigate.');
  }
});
searchResultsObserver.observe(results, { childList: true });

// ... (lines 103–112 set ARIA attrs) ...

// Update aria-expanded when results show/hide
const expandedObserver = new MutationObserver(function() {
  const isVisible = results.style.display !== 'none' && results.childNodes.length > 0;
  input.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
});
expandedObserver.observe(results, { attributes: true, childList: true, attributeFilter: ['style'] });
```

The `visibilitychange` and `removalObserver` blocks (lines 121–143) reference both observers — they need updating too.

- [ ] **Step 1: Apply the fix**

Replace the two observer declarations and their `observe()` calls (lines 92–119 — the two comment+observer+observe blocks only, NOT the ARIA attribute lines 103–112 in between) with a single merged observer:

```js
// Single observer: handles focus reset, announcement, and aria-expanded
const searchResultsObserver = new MutationObserver(function() {
  focusIndex = -1;
  const items = results.querySelectorAll('.inv-search-results__item');
  const isVisible = results.style.display !== 'none' && results.childNodes.length > 0;
  input.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
  if (items.length > 0) {
    InvictaAnnouncer.announce(items.length + ' search results found. Use arrow keys to navigate.');
  }
});
searchResultsObserver.observe(results, { childList: true, attributes: true, attributeFilter: ['style'] });
```

Then update the `visibilitychange` block (currently references both `searchResultsObserver` and `expandedObserver`) to only reference the merged `searchResultsObserver`:

```js
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    searchResultsObserver.disconnect();
  } else if (document.body.contains(results)) {
    searchResultsObserver.observe(results, { childList: true, attributes: true, attributeFilter: ['style'] });
  }
});
```

And the `removalObserver` cleanup block (only references `searchResultsObserver` and `removalObserver` now — remove `expandedObserver.disconnect()`):

```js
const removalObserver = new MutationObserver(function() {
  if (!document.body.contains(wrapper)) {
    searchResultsObserver.disconnect();
    removalObserver.disconnect();
  }
});
```

- [ ] **Step 2: Verify search still works**

1. Open the site, focus the search input
2. Type 3+ characters
3. Confirm: results appear, focus navigation (arrow keys) works, screen reader live region announces result count
4. Confirm: pressing Escape closes results and `aria-expanded` becomes `false`
5. Confirm: typing again reopens results with `aria-expanded` becoming `true`

- [ ] **Step 3: Commit**

```bash
git add "assets/invicta-cx-improvements.js"
git commit -m "perf(js): merge dual MutationObservers in search into single observer"
```

---

## Task 4: Replace createElement skeleton loop with innerHTML in invicta-search.js

**Files:**
- Modify: `assets/invicta-search.js:333–366`

**Why it matters:** `_showLoading()` is called on every debounced keystroke. It creates 15+ DOM nodes one-by-one using `createElement` + `appendChild`. A single `innerHTML` assignment is parsed by the browser's HTML parser (native C++, far faster than JS DOM API calls) and produces the identical result.

**Current code (`invicta-search.js:333–366`):**
```js
_showLoading() {
  this._clearElement(this.resultsContainer);
  for (let i = 0; i < 3; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'inv-search-skeleton';
    // ... 6 more createElement + appendChild calls per iteration
    this.resultsContainer.appendChild(skeleton);
  }
  this._open();
}
```

- [ ] **Step 1: Apply the fix**

Replace `_showLoading()` (lines 333–367) with:

```js
_showLoading() {
  const item = `<div class="inv-search-skeleton">
    <div class="inv-search-skeleton__image inv-search-skeleton__pulse"></div>
    <div class="inv-search-skeleton__text">
      <div class="inv-search-skeleton__bar inv-search-skeleton__pulse" style="width:35%"></div>
      <div class="inv-search-skeleton__bar inv-search-skeleton__bar--wide inv-search-skeleton__pulse" style="width:80%"></div>
      <div class="inv-search-skeleton__bar inv-search-skeleton__pulse" style="width:50%"></div>
    </div>
  </div>`;
  this.resultsContainer.innerHTML = item.repeat(3);
  this._open();
}
```

This produces identical DOM output. No CSS changes needed.

- [ ] **Step 2: Verify skeleton still renders**

1. Open the site, focus the search input
2. Type a character — the skeleton loading state should appear immediately (3 animated placeholders)
3. After ~250ms the real results should replace them
4. Confirm visual appearance is identical to before

- [ ] **Step 3: Commit**

```bash
git add "assets/invicta-search.js"
git commit -m "perf(js): replace createElement skeleton loop with innerHTML in invicta-search"
```

---

## Task 5: Async-load announcement bar CSS

**Files:**
- Modify: `sections/announcement-bar.liquid:1–2`

**Why it matters:** `stylesheet_tag` in a Liquid section renders as a synchronous `<link rel="stylesheet">`. The browser encounters this early in the page (announcement bar is in the header group) and must download + parse both CSS files before continuing to render the page. Converting to the `media="print" onload` async pattern eliminates this render-block. The announcement bar already has `min-height: 30px` (added as a CLS fix) so there's no layout shift during async load.

**Current code (`announcement-bar.liquid:1–2`):**
```liquid
{{ 'component-slideshow.css' | asset_url | stylesheet_tag }}
{{ 'component-slider.css' | asset_url | stylesheet_tag }}
```

> **Note:** Line 53 also has `{{ 'component-list-social.css' | asset_url | stylesheet_tag }}` inside `{% if social_icons %}`. Social icons are disabled in this store's settings so that branch never executes — leave it as-is. If social icons are ever enabled, apply the same async pattern to that line.

- [ ] **Step 1: Apply the fix**

Replace lines 1–2 with:

```liquid
<link rel="preload" href="{{ 'component-slideshow.css' | asset_url }}" as="style">
<link rel="preload" href="{{ 'component-slider.css' | asset_url }}" as="style">
<link rel="stylesheet" href="{{ 'component-slideshow.css' | asset_url }}" media="print" onload="this.media='all'">
<link rel="stylesheet" href="{{ 'component-slider.css' | asset_url }}" media="print" onload="this.media='all'">
<noscript>
  <link rel="stylesheet" href="{{ 'component-slideshow.css' | asset_url }}">
  <link rel="stylesheet" href="{{ 'component-slider.css' | asset_url }}">
</noscript>
```

The `rel="preload"` hints tell the browser to fetch both files at high priority during the preload scan — same fetch timing as a synchronous `<link>` — so there's no FOUC window. The `media="print" onload` links then apply the CSS non-blocking. The `<noscript>` fallback handles no-JS environments.

- [ ] **Step 2: Verify announcement bar still renders**

1. Open the homepage in an incognito window (cold cache)
2. Confirm the announcement bar (USP messages + slider arrows) renders and works correctly
3. Open DevTools → Network tab, filter by CSS
4. Confirm `component-slideshow.css` and `component-slider.css` show as non-render-blocking (they should appear after initial paint, not before it)
5. In DevTools → Performance → record a page load. Confirm these CSS files no longer appear in the critical render path (before First Contentful Paint)

- [ ] **Step 3: Commit**

```bash
git add "sections/announcement-bar.liquid"
git commit -m "perf(css): async-load announcement bar component CSS to unblock render"
```

---

## Final Verification

After all tasks are committed, run a Lighthouse performance audit:

1. Open Chrome DevTools → Lighthouse tab
2. Mobile preset, simulated throttling
3. Run audit on the homepage
4. Expected improvements vs baseline:
   - **FCP** should drop (announcement bar CSS no longer blocks)
   - **TBT (Total Blocking Time)** should drop (less main-thread work from skeleton DOM + observers)
   - **Layout shifts during interaction** reduced (resize handlers no longer thrash)
5. Check the "Avoid chaining critical requests" and "Eliminate render-blocking resources" sections — `component-slideshow.css` should no longer appear

```bash
git push origin fix/i18n-brand-schema-group-a
```
