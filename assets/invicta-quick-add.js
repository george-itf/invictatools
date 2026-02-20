/**
 * Invicta Quick Add to Cart v1.2
 * ==============================
 * @description Handles quick-add pill buttons on product cards (Option 3C)
 *
 * Fixes applied:
 * - P0-2.1: Request-level dedup via WeakSet per button
 * - P1-3.1: Unified event dispatch (invicta:cart:updated + cart:item-added)
 * - P1-3.4: Graceful error handling for quantity rule violations
 * - P2-4.2: Uses window.routes for cart URLs
 * - P2-4.7: Parses variant ID as integer
 * - P2-4.8: Proper error handling (no empty catch blocks)
 *
 * USAGE: Add this script to theme.liquid before </body>
 * <script src="{{ 'invicta-quick-add.js' | asset_url }}" defer></script>
 */

(function() {
  'use strict';

  /** @type {boolean} Enable console logging (set false for production) */
  var DEBUG = false;

  /** @type {WeakSet<HTMLElement>} Tracks buttons with in-flight requests */
  var inFlightButtons = new WeakSet();

  /**
   * Initialise quick-add buttons
   * @returns {void}
   */
  function initQuickAdd() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.invicta-quick-add-pill');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      var variantId = btn.dataset.variantId;
      if (!variantId) {
        // No variant — redirect to product page
        var productUrl = btn.dataset.productUrl;
        if (productUrl) {
          window.location.href = productUrl;
        }
        return;
      }

      addToCart(btn, variantId);
    });
  }

  /**
   * Add item to cart via AJAX
   * @param {HTMLElement} btn - The quick-add button
   * @param {string} variantId - Shopify variant ID
   * @returns {void}
   */
  function addToCart(btn, variantId) {
    // P0-2.1: Request-level dedup — prevent double-add per button
    if (inFlightButtons.has(btn)) return;
    inFlightButtons.add(btn);

    // Set loading state
    btn.classList.add('is-loading');
    btn.classList.remove('is-added');

    var cartAddUrl = ((window.routes && window.routes.cart_add_url) || '/cart/add') + '.js';

    fetch(cartAddUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: parseInt(variantId, 10),
        quantity: 1
      })
    })
    .then(function(response) {
      if (!response.ok) {
        return response.json().then(function(err) { throw err; });
      }
      return response.json();
    })
    .then(function(data) {
      // Success state
      btn.classList.remove('is-loading');
      btn.classList.add('is-added');
      var span = btn.querySelector('span'); if (span) span.textContent = '\u2713';

      // Update cart count
      updateCartCount();

      // P1-3.1: Unified event dispatch for all listeners
      document.dispatchEvent(new CustomEvent('cart:refresh'));
      document.dispatchEvent(new CustomEvent('cart:item-added', { detail: data }));
      document.dispatchEvent(new CustomEvent('invicta:cart:updated', {
        detail: { source: 'quick-add', item: data }
      }));

      // Reset button after delay
      setTimeout(function() {
        btn.classList.remove('is-added');
        var span = btn.querySelector('span'); if (span) span.textContent = 'Add';
      }, 1500);
    })
    .catch(function(error) {
      DEBUG && console.error('Quick add error:', error);
      btn.classList.remove('is-loading');

      // P1-3.4 / P1-3.5: Show Shopify's specific error (e.g. quantity rules)
      var message = (error && (error.description || error.message)) || '!';
      var span = btn.querySelector('span');
      if (span) {
        // Truncate long messages for the small pill button
        span.textContent = message.length > 20 ? '!' : message;
      }

      setTimeout(function() {
        var span = btn.querySelector('span'); if (span) span.textContent = 'Add';
      }, 2000);
    })
    .finally(function() {
      inFlightButtons.delete(btn);
    });
  }

  /**
   * Update cart count bubble in header
   * P3-5.5: Standardised selectors matching invicta-cart-handler.js
   * @returns {void}
   */
  function updateCartCount() {
    var cartUrl = (window.routes && window.routes.cart_url) || '/cart';

    fetch(cartUrl + '.js', {
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(cart) {
      // P3-5.5: Standardised selectors
      var countEls = document.querySelectorAll(
        '.cart-count-bubble span[aria-hidden="true"], .header__cart-count, [data-cart-count], .cart-count'
      );
      countEls.forEach(function(el) {
        el.textContent = cart.item_count;
      });

      // Show/hide bubble
      var bubbles = document.querySelectorAll('.cart-count-bubble');
      bubbles.forEach(function(bubble) {
        bubble.style.display = cart.item_count > 0 ? '' : 'none';
      });
    })
    .catch(function(err) {
      DEBUG && console.error('Cart count update failed:', err);
    });
  }

  // Initialise on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickAdd);
  } else {
    initQuickAdd();
  }

})();
