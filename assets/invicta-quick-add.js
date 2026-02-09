/**
 * Invicta Quick Add to Cart v1.1
 * ==============================
 * @description Handles quick-add pill buttons on product cards (Option 3C)
 * 
 * USAGE: Add this script to theme.liquid before </body>
 * <script src="{{ 'invicta-quick-add.js' | asset_url }}" defer></script>
 */

(function() {
  'use strict';

  /** @type {boolean} Enable console logging (set false for production) */
  var DEBUG = false;

  /**
   * Initialise quick-add buttons
   * @returns {void}
   */
  function initQuickAdd() {
    document.addEventListener('click', function(e) {
      const btn = e.target.closest('.invicta-quick-add-pill');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const variantId = btn.dataset.variantId;
      if (!variantId) {
        // No variant — redirect to product page
        const productUrl = btn.dataset.productUrl;
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
    // Set loading state
    btn.classList.add('is-loading');
    btn.classList.remove('is-added');

    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: 1
      })
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('Add to cart failed');
      }
      return response.json();
    })
    .then(function(data) {
      // Success state
      btn.classList.remove('is-loading');
      btn.classList.add('is-added');
      const span = btn.querySelector('span'); if (span) span.textContent = '✓';

      // Update cart count
      updateCartCount();

      // Trigger theme cart events
      document.dispatchEvent(new CustomEvent('cart:refresh'));
      document.dispatchEvent(new CustomEvent('cart:item-added', { detail: data }));

      // Reset button after delay
      setTimeout(function() {
        btn.classList.remove('is-added');
        const span = btn.querySelector('span'); if (span) span.textContent = 'Add';
      }, 1500);
    })
    .catch(function(error) {
      DEBUG && console.error('Quick add error:', error);
      btn.classList.remove('is-loading');
      const span = btn.querySelector('span'); if (span) span.textContent = '!';

      setTimeout(function() {
        const span = btn.querySelector('span'); if (span) span.textContent = 'Add';
      }, 2000);
    });
  }

  /**
   * Update cart count bubble in header
   * @returns {void}
   */
  function updateCartCount() {
    fetch('/cart.js', {
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(cart) {
      // Update all cart count elements
      var countEls = document.querySelectorAll('.cart-count-bubble span, [data-cart-count]');
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
      DEBUG && console.log('Cart count update failed:', err);
    });
  }

  // Initialise on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickAdd);
  } else {
    initQuickAdd();
  }

})();