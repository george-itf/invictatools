# INVICTA TOOLS — Checkout & Add to Basket Deep Audit

**Date:** 20 February 2026
**Scope:** All add-to-cart, cart management, cart drawer, checkout button, and Buy Now flows
**Platform:** Shopify Online Store 2.0 (Trade theme v15.4.0)

---

## Executive Summary

The checkout and add-to-basket system spans **6 JavaScript files**, **7 Liquid templates/snippets**, and **1 Web Component hierarchy**. There are **4 distinct add-to-cart code paths** that operate largely independently, creating inconsistency in error handling, event dispatch, cart count updates, and user feedback. Several bugs, race conditions, and architectural issues were found.

**Severity Breakdown:**
- **P0 (Critical):** 2 issues
- **P1 (High):** 5 issues
- **P2 (Medium):** 8 issues
- **P3 (Low):** 6 issues

---

## 1. Architecture Overview — Add-to-Cart Code Paths

There are **4 independent code paths** that add items to the cart. Each was built at a different time and they share no common abstraction.

| # | Code Path | File | Trigger | Target Audience |
|---|-----------|------|---------|-----------------|
| 1 | **PDP Form** | `invicta-product-v2.js:690-737` | Form submit on product page | Product detail page visitors |
| 2 | **Card Handler** | `invicta-cart-handler.js:43-108` | `[data-add-to-cart]` click on product cards | Collection/search pages |
| 3 | **Quick-Add Pill** | `invicta-quick-add.js:48-97` | `.invicta-quick-add-pill` click | Collection quick-add buttons |
| 4 | **Product Form (Dawn)** | `product-form.js:22-111` | `<product-form>` Web Component form submit | Quick-add modals, possibly PDP |

### Observation: Code Path Fragmentation

Each path implements its own:
- Loading state management
- Error handling
- Cart count update mechanism
- Custom event dispatch
- Success feedback UI

This means a bug fix or UX improvement must be replicated across 4 files.

---

## 2. P0 — Critical Issues

### 2.1 Race Condition: No Add-to-Cart Request Deduplication (P0)

**Files:** `invicta-product-v2.js:690-737`, `invicta-quick-add.js:48-97`

**Problem:** The PDP form handler checks `atcBtn.classList.contains('is-loading')` to prevent double-submission, but this is a CSS-class guard, not a request-level lock. On fast networks or with pre-warmed connections, a user can double-click fast enough to fire two `fetch('/cart/add.js')` requests before the `is-loading` class is applied (since `classList.add` happens synchronously but the event loop may batch click events).

The quick-add pill (`invicta-quick-add.js`) has **no deduplication at all** — the `is-loading` class check is never consulted before firing the fetch.

The card handler (`invicta-cart-handler.js:56`) disables the button but the button isn't disabled before `handleAddToCart` starts — if `click` events fire in rapid succession on the delegated listener, multiple calls can be in flight.

**Impact:** Users can accidentally add 2x or 3x of an item to the cart, particularly on mobile where tap events can double-fire.

**Recommendation:**
```javascript
// Add a request-level lock flag, not just a CSS class guard
let isAddingToCart = false;
productForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (isAddingToCart) return;
  isAddingToCart = true;
  // ... fetch logic ...
  .finally(() => { isAddingToCart = false; });
});
```

### 2.2 Buy Now Button Uses Wrong Form Data After Variant Change (P0)

**File:** `invicta-product-v2.js:766-785`

**Problem:** The Buy Now button sends `new FormData(productForm)` to `/cart/add.js` then redirects to `/checkout`. However, `buyNowBtn.dataset.variantId` is updated on variant change (line 523), but the form's hidden `[data-variant-id]` input is what `FormData` reads (line 637 of the Liquid template: `<input type="hidden" name="id" value="{{ current_variant.id }}" data-variant-id>`).

The `updateVariant()` function on line 498 correctly updates `variantInput.value`, so the form hidden input IS updated. However, the `buyNowBtn.dataset.variantId` (line 523) is set but **never actually used** during the fetch — the Buy Now button reads from `FormData(productForm)`, not from `buyNowBtn.dataset.variantId`.

This means `buyNowBtn.dataset.variantId` is dead code on the JS side (though it's set, it's never read). **The actual risk is**: if `productForm` is null or detached (possible on dynamic section re-render), `new FormData(productForm)` would throw, silently failing the Buy Now flow with no user feedback other than the button staying in loading state indefinitely.

**Impact:** Buy Now button can appear to hang if sections are re-rendered by another script. The data-attribute is unused dead code that suggests intended logic was never completed.

**Recommendation:** Add null checks and ensure the Buy Now button reads directly from the form input or its own dataset as a fallback.

---

## 3. P1 — High Issues

### 3.1 Inconsistent Cart Events Across Code Paths (P1)

**Problem:** Each add-to-cart path dispatches different custom events:

| Code Path | Events Dispatched |
|-----------|-------------------|
| PDP Form (`invicta-product-v2.js`) | `cart:item-added`, `cart:refresh` |
| Card Handler (`invicta-cart-handler.js`) | `invicta:cart:added`, `invicta:cart:updated` |
| Quick-Add Pill (`invicta-quick-add.js`) | `cart:refresh`, `cart:item-added` |
| Product Form (`product-form.js`) | `PUB_SUB_EVENTS.cartUpdate`, `PUB_SUB_EVENTS.cartError` |

**Impact:** Any script listening for cart changes must subscribe to multiple event systems. The free delivery bar, cart drawer, and cart count bubble each respond to different events, meaning some add-to-cart paths **don't trigger all UI updates**.

Specifically:
- The `invicta-cart-handler.js` dispatches `invicta:cart:added` and `invicta:cart:updated` which the **cart drawer does not listen for** — so adding via product cards does NOT open the cart drawer.
- The `product-form.js` uses the Dawn pub/sub system (`PUB_SUB_EVENTS.cartUpdate`) which `invicta-product-v2.js` does **not** publish to.

**Recommendation:** Establish a single event bus. All add-to-cart paths should dispatch the same canonical event, e.g. `invicta:cart:updated` with a payload of `{ source, item, cart }`.

### 3.2 Cart Drawer Not Refreshed Before Opening (P1)

**File:** `invicta-product-v2.js:740-760`

**Problem:** The `openCartDrawer()` function fetches `/cart.js` to get updated cart data, then dispatches `cart:refresh` and calls `cartDrawer.open()`. However, this only updates the **cart count** — it does NOT re-render the cart drawer's HTML contents. The cart drawer's `renderContents()` method expects Section Rendering API HTML (parsedState with `sections` keys), not raw cart JSON.

This means when a user adds to cart from the PDP, the cart drawer opens showing **stale contents** (the last-rendered HTML) until the next full page load.

**Impact:** User sees old cart items, wrong totals, or empty drawer after adding to cart from the PDP.

**Recommendation:** Either:
1. Use Section Rendering API (pass `sections` to `/cart/add.js` like `product-form.js` does), or
2. After add, re-fetch the cart-drawer section HTML and replace it.

### 3.3 Product Card Form Submits via Full Page POST (P1)

**File:** `snippets/invicta-product-card.liquid:207-218`

**Problem:** The product card uses a standard `{% form 'product', product %}` with a `<button type="submit">`. This creates a form that POSTs to Shopify's `/cart/add` endpoint. If JavaScript fails to load (or is delayed), this form will do a **full-page redirect** to the cart page.

However, there is **no JavaScript intercepting this form submission** via the Invicta cart handler. The `invicta-cart-handler.js` listens for clicks on `[data-add-to-cart]` buttons, but the product card button does NOT have a `data-add-to-cart` attribute — it's a `type="submit"` button inside a form.

The `invicta-quick-add.js` listens for `.invicta-quick-add-pill` clicks, which is a different element entirely.

**So the product card ATC form falls through to**: the native HTML form POST, causing a full page navigation to the cart page. This is not AJAX add-to-cart.

**Impact:** Adding to cart from product cards causes a jarring full-page redirect instead of an AJAX update. This is inconsistent with the PDP and quick-add experiences.

**Recommendation:** Either:
1. Add `data-add-to-cart` and `data-variant-id` attributes to intercept via `invicta-cart-handler.js`, or
2. Wrap the card in a `<product-form>` web component, or
3. Add `e.preventDefault()` handling for the form submission.

### 3.4 No Quantity Validation on Quick-Add Paths (P1)

**Files:** `invicta-quick-add.js`, `invicta-cart-handler.js`

**Problem:** Both quick-add paths hardcode quantity as `1` without checking:
- The variant's `quantity_rule.min` (which could be > 1 for B2B products)
- The variant's `quantity_rule.increment` (e.g., must be multiples of 6)
- The variant's `quantity_rule.max`
- Current cart quantity for that variant

If a variant requires a minimum of 5 units or increments of 10, adding 1 via quick-add will silently succeed server-side (Shopify accepts any quantity) but the cart page will show validation errors when the user tries to update.

**Impact:** B2B customers with quantity-rule products will encounter confusing behaviour — items added in wrong quantities that can't be checked out.

**Recommendation:** Before adding, check `variant.quantity_rule` via the product JSON, or at minimum handle the error response from Shopify that indicates quantity rule violations.

### 3.5 Error Handling Discrepancy in PDP Add-to-Cart (P1)

**File:** `invicta-product-v2.js:704-705, 722-736`

**Problem:** The error handler catches ALL errors with a generic message:
```javascript
.catch(function() {
  atcBtn.classList.remove('is-loading');
  atcBtn.classList.add('is-error');
  // Shows generic "Sorry, couldn't add to cart. Please try again."
});
```

But Shopify returns specific error descriptions in the JSON response (e.g., "You can't add more of this item to your cart", "This product is not available"). The fetch only throws on network errors — a 422 response with an error body is caught by `if (!response.ok) throw new Error('Cart error')` which loses the response body.

**Impact:** Users see unhelpful generic error messages instead of actionable ones (e.g., "You can't add more — only 3 left").

**Recommendation:**
```javascript
.then(function(response) {
  if (!response.ok) return response.json().then(function(err) { throw err; });
  return response.json();
})
.catch(function(error) {
  const message = error.description || error.message || 'Sorry, couldn\'t add to cart.';
  // Show `message` to user
});
```

---

## 4. P2 — Medium Issues

### 4.1 Cart Count Update Makes Separate `/cart.js` Request (P2)

**Files:** `invicta-product-v2.js:743`, `invicta-cart-handler.js:116`, `invicta-quick-add.js:105`

**Problem:** After a successful `/cart/add.js`, three of four code paths make an additional `fetch('/cart.js')` just to get the updated `item_count`. The response from `/cart/add.js` already contains all the info needed to increment the count (or the count itself can be derived). This is a wasted network request on every add-to-cart.

**Impact:** Unnecessary extra HTTP request on every ATC action, adding latency to cart count updates.

**Recommendation:** Use the response from `/cart/add.js` (which returns the added item) and either:
1. Increment the existing displayed count by the added quantity, or
2. Use Section Rendering API (like `product-form.js` does) to get the updated cart-icon-bubble HTML in the same request.

### 4.2 Hardcoded `/cart/add.js` URLs (P2)

**Files:** `invicta-product-v2.js:700`, `invicta-cart-handler.js:59`, `invicta-quick-add.js:53`

**Problem:** Three custom scripts hardcode `/cart/add.js` instead of using `window.routes.cart_add_url` (defined in `theme.liquid:468`). If the store uses a non-root subpath or the route configuration changes, these would break.

Meanwhile, `product-form.js:47` correctly uses `${routes.cart_add_url}`.

**Impact:** Low risk in practice since Shopify stores don't typically use subpaths, but inconsistent with the established pattern.

**Recommendation:** Replace all hardcoded URLs with the route variables.

### 4.3 PDP Form Has No CSRF Token in Action Attribute (P2)

**File:** `sections/invicta-product-v2.liquid:630-633`

**Problem:** The PDP form uses `action="/cart/add"` instead of the Liquid `{% form %}` tag:
```html
<form class="inv-pdp__form" action="/cart/add" method="post" data-product-form>
```

The `{% form 'product', product %}` tag automatically includes Shopify's CSRF token. The raw `<form action="/cart/add">` does not. Since the form is submitted via JavaScript (`e.preventDefault()` + `fetch`), the missing CSRF token doesn't affect the AJAX path. However, if JavaScript fails, the form falls back to a native POST **without a CSRF token**, which Shopify will likely reject.

**Impact:** No-JS fallback for add-to-cart is broken on PDP.

**Recommendation:** Use `{% form 'product', product %}` instead of raw `<form>` tag, or accept that JS is required.

### 4.4 Buy Now Doesn't Clear Previous Cart (P2)

**File:** `invicta-product-v2.js:773-779`

**Problem:** The "Buy Now — Skip the Cart" button adds the item to the existing cart and then redirects to checkout. It does NOT clear the cart first. If the user already has 5 items in their cart and clicks "Buy Now" on a 6th item, they'll go to checkout with **all 6 items**, not just the one they clicked "Buy Now" on.

This contradicts the user's mental model of "Buy Now" which implies purchasing just this item.

**Impact:** Potential for unintended purchases. Users may not notice extra items at checkout.

**Recommendation:** Either:
1. Clear the cart before adding the "Buy Now" item (risky — loses existing cart), or
2. Rename the button to something like "Add & Checkout" to set correct expectations, or
3. Keep the current behaviour but add a confirmation if there are existing cart items.

### 4.5 Cart Drawer: Double Class Attribute on Remove Button (P2)

**File:** `snippets/cart-drawer.liquid:354-358`

**Problem:**
```html
<button type="button" class="button button--tertiary cart-remove-button"
  {% if item.instructions and item.instructions.can_remove == false %}
    class="hidden"
  {% endif %}
>
```

The `class` attribute appears twice when `can_remove == false`. HTML parsers will use the **first** `class` attribute and ignore the second. So the `hidden` class is never applied.

**Impact:** Items that should not be removable (e.g., bundled items) still show the remove button in the cart drawer.

**Recommendation:** Use a single class attribute with conditional classes:
```html
<button type="button" class="button button--tertiary cart-remove-button{% if item.instructions and item.instructions.can_remove == false %} hidden{% endif %}">
```

### 4.6 Cart Breakdown Snippet: Shipping Progress Bar Uses Unescaped Translation (P2)

**File:** `snippets/cart-breakdown.liquid:90`

**Problem:**
```liquid
{{ 'invicta.cart.shipping_progress_html' | t: amount: shipping_remaining | money }}
```

The Liquid filter chain here is ambiguous: `shipping_remaining | money` is applied as the `amount` parameter, but `| money` may be interpreted as part of the `| t` filter chain, not the parameter. This depends on Liquid parser behaviour. It should be explicitly assigned to a variable first.

**Impact:** The shipping progress text may display raw pence values instead of formatted money.

**Recommendation:**
```liquid
{%- assign shipping_remaining_formatted = shipping_remaining | money -%}
{{ 'invicta.cart.shipping_progress_html' | t: amount: shipping_remaining_formatted }}
```

### 4.7 Quick-Add Pill Passes Variant ID as String (P2)

**File:** `invicta-quick-add.js:59-62`

**Problem:**
```javascript
body: JSON.stringify({
  id: variantId,  // string from dataset
  quantity: 1
})
```

Meanwhile `invicta-cart-handler.js:66` correctly parses:
```javascript
id: parseInt(variantId, 10),
```

Shopify's `/cart/add.js` accepts both strings and integers, so this works in practice, but it's inconsistent. More critically, if a variant ID contains any non-numeric characters (e.g., from a corrupt data-attribute), the string would silently produce a 422 error.

**Impact:** Low — works currently but inconsistent.

### 4.8 Cart Items: Empty Catch Blocks Swallow Errors (P2)

**Files:** `invicta-product-v2.js:749`, `invicta-quick-add.js:124`

**Problem:** Multiple `.catch(function() {})` blocks silently swallow errors, making debugging production issues difficult.

**Impact:** Developers cannot diagnose cart issues from browser console output.

**Recommendation:** At minimum log errors in development mode, or use a consistent error reporting pattern.

---

## 5. P3 — Low Issues

### 5.1 Dead Code: `buyNowBtn.dataset.variantId` (P3)

**File:** `invicta-product-v2.js:523`

The `buyNowBtn.dataset.variantId = matchingVariant.id` assignment is dead code — the Buy Now handler reads from `FormData(productForm)`, never from the dataset.

### 5.2 PDP Quantity Hardcoded Max of 99 (P3)

**File:** `sections/invicta-product-v2.liquid:657`

The quantity input has `max="99"` hardcoded. If a B2B variant allows more than 99 (common for fixings/fasteners), users cannot enter the correct quantity.

### 5.3 Cart Drawer `block.shopify_attributes` Used Outside Block Loop (P3)

**File:** `snippets/cart-drawer.liquid:549, 617`

`{{ block.shopify_attributes }}` is used in the sticky footer, but there's no `{% for block in section.blocks %}` loop in the cart-drawer snippet. The `block` variable is undefined here, so this outputs nothing. It's harmless but suggests copy-paste from the cart page without adaptation.

### 5.4 MutationObserver in Cart Drawer is Redundant (P3)

**File:** `snippets/cart-drawer.liquid:660-682`

The inline script sets up a `MutationObserver` to watch for `.active` class changes on the cart-drawer element, but the `CartDrawer` web component already handles Escape key and focus management. This is a defensive duplication that adds minor overhead.

### 5.5 Cart Count Selectors Inconsistency (P3)

**Files:**
- `invicta-cart-handler.js:16-21`: Uses 4 selectors including `[data-cart-count]`
- `invicta-quick-add.js:113`: Uses `.cart-count-bubble span, [data-cart-count]`
- Cart icon bubble section: Uses Shopify's built-in `cart-count-bubble` class

Different scripts target different selectors. If the header markup changes, not all scripts would update correctly.

### 5.6 Console Error Logging in Production (P3)

**Files:** `invicta-cart-handler.js:48,97,145`

The card handler logs errors via `console.error()` even in production (unlike `invicta-quick-add.js` which uses a `DEBUG` flag). This clutters the console for end users.

---

## 6. Checkout Button Audit

### 6.1 Cart Page Checkout Button

**File:** `sections/main-cart-footer.liquid:81-90`

```html
<button type="submit" id="checkout" class="cart__checkout-button button"
  name="checkout" form="cart"
  {% if cart == empty %}disabled{% endif %}
>
```

**Assessment:**
- Correctly uses `form="cart"` to associate with the cart form (defined in `main-cart-items.liquid:60`)
- Correctly disabled when cart is empty
- The `name="checkout"` attribute triggers Shopify's native checkout redirect on form POST
- Additional checkout buttons (Apple Pay, Google Pay, Shop Pay) correctly rendered via `{{ content_for_additional_checkout_buttons }}`
- **No issues found** with the cart page checkout button

### 6.2 Cart Drawer Checkout Button

**File:** `snippets/cart-drawer.liquid:618-630`

```html
<button type="submit" id="CartDrawer-Checkout" class="cart__checkout-button button"
  name="checkout" form="CartDrawer-Form"
  {% if cart == empty %}disabled{% endif %}
>
```

**Assessment:**
- Correctly uses `form="CartDrawer-Form"` attribute
- Correctly disabled when cart is empty
- **Issue:** After AJAX cart updates, the drawer HTML is re-rendered, but the `disabled` state is only set server-side on initial render. If a user empties their cart via the drawer (setting all quantities to 0), the checkout button **may remain enabled** until the full HTML replacement catches up. The `CartItems.updateQuantity()` does toggle `is-empty` class on the cart drawer, but doesn't explicitly disable the checkout button.
- **Missing:** No dynamic checkout buttons (Apple Pay, etc.) in the drawer — only available on the cart page.

---

## 7. Cart State Management Audit

### 7.1 Section Rendering API Usage

| Component | Uses Section Rendering | Notes |
|-----------|----------------------|-------|
| `product-form.js` | Yes | Requests sections in `/cart/add.js` call |
| `cart.js` (CartItems) | Yes | Requests sections in `/cart/change.js` call |
| `cart-drawer.js` | Yes (on renderContents) | Receives sections from product-form.js |
| `invicta-product-v2.js` | **No** | Makes separate `/cart.js` request |
| `invicta-cart-handler.js` | **No** | Makes separate `/cart.js` request |
| `invicta-quick-add.js` | **No** | Makes separate `/cart.js` request |

The three Invicta-custom scripts do NOT use the Section Rendering API, meaning they make 2 HTTP requests per add-to-cart (one to add, one to get updated data) vs. the Dawn scripts which do it in 1 request.

### 7.2 State Consistency

There is no single source of truth for cart state on the client side. Cart data is:
1. Rendered server-side in Liquid HTML
2. Fetched via `/cart.js` JSON
3. Received via Section Rendering API HTML fragments
4. Tracked in element counts (`.cart-count-bubble span`)

If two scripts modify the cart simultaneously (e.g., PDP add-to-cart while quick-order-list is batch updating), the last-write-wins on HTML replacement, potentially showing stale data.

---

## 8. Accessibility Audit (Cart/Checkout)

| Area | Status | Notes |
|------|--------|-------|
| Cart drawer focus trap | Pass | Implemented in `cart-drawer.js` and inline script |
| Escape to close drawer | Pass | Both web component and inline backup handle this |
| aria-live for cart count | Pass | `cart-live-region-text` has `aria-live="polite"` |
| ATC button loading state | Partial | PDP uses visual-only classes; no `aria-busy` or `aria-live` announcement |
| Error announcements | Partial | PDP error div has `role="alert"` and `aria-live="assertive"` — good. Quick-add has no screen reader announcement on error |
| Quantity input labels | Pass | All quantity inputs have `aria-label` |
| Cart item remove buttons | Pass | Have descriptive `aria-label` with product title |
| Checkout button | Pass | Native button with clear label |

---

## 9. Performance Observations

1. **3 redundant `/cart.js` fetches per add-to-cart** from custom scripts — should use Section Rendering API
2. **Cart drawer JS loads even when cart_type is not 'drawer'** (`snippets/cart-drawer.liquid:11` loads `cart.js`). `main-cart-items.liquid:22` conditionally loads it: `{%- unless settings.cart_type == 'drawer' -%}`, but if both the drawer and cart page are present, `cart.js` loads twice
3. **No request debouncing on cart drawer open** — rapidly clicking the cart icon can trigger multiple section fetches
4. **Cart breakdown CSS loaded inline in snippet** (`cart-breakdown.liquid:109`) instead of in head — causes a layout shift on first paint

---

## 10. Recommendations Summary (Prioritised)

### Immediate (P0)

1. **Add request-level deduplication** to all 4 ATC code paths using a boolean flag, not just CSS classes
2. **Add null-safety to Buy Now** for `productForm` reference and remove dead `dataset.variantId` code

### Short-term (P1)

3. **Unify cart events** — create a single `invicta:cart:updated` event that all code paths dispatch
4. **Fix cart drawer refresh** — use Section Rendering API in `invicta-product-v2.js` so the drawer shows correct contents
5. **Intercept product card form submission** with JavaScript to enable AJAX add-to-cart
6. **Respect quantity rules** in quick-add paths or gracefully handle the resulting error
7. **Parse Shopify error responses** and show specific error messages to users

### Medium-term (P2)

8. **Consolidate ATC logic** into a single shared utility/service, e.g., `InvictaCartService.add(variantId, quantity)` that all UI code calls
9. **Fix double class attribute** on cart-drawer remove button
10. **Use route variables** (`window.routes.cart_add_url`) consistently
11. **Fix shipping progress bar** Liquid filter chain ambiguity
12. **Use `{% form %}` tag** on PDP to ensure no-JS fallback works

### Long-term (P3)

13. **Evaluate whether "Buy Now" should clear cart** or be renamed to "Add & Checkout"
14. **Remove redundant MutationObserver** from cart-drawer snippet
15. **Standardise cart count selectors** across all scripts
16. **Add `DEBUG` flags** to all Invicta scripts and suppress console output in production

---

## Appendix A: File Reference

| File | Purpose | Lines | Issues Found |
|------|---------|-------|-------------|
| `assets/invicta-product-v2.js` | PDP controller incl. ATC and Buy Now | 891 | P0-2.1, P0-2.2, P1-3.2, P1-3.5, P2-4.1, P2-4.2, P2-4.8 |
| `assets/invicta-cart-handler.js` | Card-level ATC handler | 157 | P0-2.1, P2-4.1, P2-4.2, P3-5.5, P3-5.6 |
| `assets/invicta-quick-add.js` | Quick-add pill ATC | 136 | P0-2.1, P1-3.4, P2-4.2, P2-4.7, P2-4.8 |
| `assets/product-form.js` | Dawn product form web component | 144 | P1-3.1 (event system difference) |
| `assets/cart.js` | Cart items management (quantity, remove) | 297 | Clean |
| `assets/cart-drawer.js` | Cart drawer web component | 137 | Clean |
| `assets/cart-notification.js` | Cart notification popup | 134 | Clean |
| `assets/quick-add.js` | Quick-add modal | 122 | Clean |
| `assets/quick-add-bulk.js` | Bulk quick-add | 199 | P2-4.5 (empty catch) |
| `sections/main-cart-footer.liquid` | Cart page footer/checkout | 177 | Clean |
| `sections/main-cart-items.liquid` | Cart page items table | 435 | Clean |
| `sections/invicta-product-v2.liquid` | PDP section (ATC form at line 630) | 800+ | P2-4.3, P3-5.2 |
| `snippets/cart-drawer.liquid` | Cart drawer template | 698 | P2-4.5, P3-5.3, P3-5.4 |
| `snippets/invicta-product-card.liquid` | Product card with ATC form | 231 | P1-3.3 |
| `snippets/cart-breakdown.liquid` | Cart subtotal/VAT breakdown | 109 | P2-4.6 |
| `snippets/invicta-cart-handler.liquid` | Script include | 15 | Clean |

---

## Appendix B: Event Flow Diagrams

### PDP Add to Cart Flow
```
User clicks "Add to Cart"
  → form submit event captured (invicta-product-v2.js:691)
  → e.preventDefault()
  → Check: disabled? is-loading? → bail if true
  → Add .is-loading class
  → fetch POST /cart/add.js (FormData)
  → On success:
      → Remove .is-loading, add .is-success
      → openCartDrawer()
        → fetch GET /cart.js (2nd request!)
        → Dispatch 'cart:refresh' event
        → Call cartDrawer.open()
      → Dispatch 'cart:item-added' event
      → After 2s: remove .is-success
  → On error:
      → Remove .is-loading, add .is-error
      → Show generic error
      → After 2.5s: remove .is-error
```

### Card Handler Add to Cart Flow
```
User clicks [data-add-to-cart] button
  → Delegated click handler (invicta-cart-handler.js:30)
  → handleAddToCart(button)
  → Add .inv-card__btn--loading, disable button
  → fetch POST /cart/add.js (JSON body)
  → On success:
      → Show checkmark SVG + "Added!"
      → updateCartCount()
        → fetch GET /cart.js (2nd request!)
        → Update all cart count selectors
        → Dispatch 'invicta:cart:updated'
      → Dispatch 'invicta:cart:added'
      → After 1.5s: reset button
  → On error:
      → Show "Error" text
      → After 2s: reset button
```

### Buy Now Flow
```
User clicks "Buy Now — Skip the Cart"
  → click handler (invicta-product-v2.js:767)
  → Check: disabled? → bail
  → Add .is-loading, disable button
  → fetch POST /cart/add.js (FormData)
  → On success:
      → window.location.href = '/checkout'
      → (No cart count update, no events dispatched)
  → On error:
      → Remove .is-loading, re-enable button
      → (No error message shown to user!)
```
