/**
 * Invicta Cart Handler
 * Manages add-to-cart actions from product cards
 * Extracted from inline script in snippets/invicta-cart-handler.liquid
 *
 * Fixes applied:
 * - P0-2.1: Request-level dedup via in-flight tracking
 * - P1-3.1: Unified event dispatch (invicta:cart:updated + cart:item-added)
 * - P2-4.2: Uses window.routes for cart URLs
 * - P3-5.5: Standardised cart count selectors
 * - P3-5.6: DEBUG flag for production-safe logging
 */
(function() {
  'use strict';

  /** @type {boolean} Enable console logging (set false for production) */
  var DEBUG = false;

  /** @type {string[]} Canonical cart count selectors, shared across handlers */
  var CART_COUNT_SELECTORS = [
    '.cart-count-bubble span[aria-hidden="true"]',
    '.header__cart-count',
    '[data-cart-count]',
    '.cart-count'
  ];

  /**
   * Invicta Cart Handler
   * Manages add-to-cart actions from product cards
   * @class
   */
  class InvictaCartHandler {
    constructor() {
      /** @type {Set<string>} Variant IDs currently being added (dedup guard) */
      this._inFlight = new Set();

      this.init();
    }

    /**
     * Initialise event listeners
     */
    init() {
      document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (addBtn) {
          e.preventDefault();
          this.handleAddToCart(addBtn);
        }
      });
    }

    /**
     * Handle add to cart button click
     * @param {HTMLElement} button - The clicked button
     */
    async handleAddToCart(button) {
      const variantId = button.dataset.variantId;
      const quantity = parseInt(button.dataset.quantity || '1', 10);

      if (!variantId) {
        DEBUG && console.error('No variant ID found');
        return;
      }

      // P0-2.1: Request-level dedup — prevent double-add for same variant
      if (this._inFlight.has(variantId)) return;
      this._inFlight.add(variantId);

      // Set loading state
      button.classList.add('inv-card__btn--loading');
      const originalHtml = button.innerHTML;
      button.innerHTML = '<span>Adding...</span>';
      button.disabled = true;

      var cartAddUrl = ((window.routes && window.routes.cart_add_url) || '/cart/add') + '.js';

      try {
        const response = await fetch(cartAddUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: parseInt(variantId, 10),
            quantity: quantity
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.description || 'Failed to add to cart');
        }

        const item = await response.json();

        // Success state
        button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg><span>Added!</span>';
        button.classList.remove('inv-card__btn--loading');

        // Update cart count
        this.updateCartCount();

        // P1-3.1: Dispatch unified events for all listeners
        document.dispatchEvent(new CustomEvent('cart:item-added', {
          detail: { item, button }
        }));
        document.dispatchEvent(new CustomEvent('invicta:cart:updated', {
          detail: { source: 'card-handler', item, button }
        }));
        document.dispatchEvent(new CustomEvent('cart:refresh'));

        // Reset button after delay
        setTimeout(() => {
          button.innerHTML = originalHtml;
          button.disabled = false;
        }, 1500);

      } catch (error) {
        DEBUG && console.error('Add to cart error:', error);

        // Error state — show Shopify's specific error message when available
        var message = (error && error.message) || 'Error';
        button.innerHTML = '<span>' + message + '</span>';
        button.classList.remove('inv-card__btn--loading');

        // Reset button after delay
        setTimeout(() => {
          button.innerHTML = originalHtml;
          button.disabled = false;
        }, 2000);
      } finally {
        this._inFlight.delete(variantId);
      }
    }

    /**
     * Update cart count in header
     */
    async updateCartCount() {
      try {
        var cartUrl = (window.routes && window.routes.cart_url) || '/cart';
        const response = await fetch(cartUrl + '.js', {
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) return;

        const cart = await response.json();
        const count = cart.item_count;

        // P3-5.5: Standardised selectors
        for (const selector of CART_COUNT_SELECTORS) {
          const elements = document.querySelectorAll(selector);
          elements.forEach(el => {
            el.textContent = count;

            // Show/hide based on count
            const bubble = el.closest('.cart-count-bubble, [data-cart-bubble]');
            if (bubble) {
              bubble.style.display = count > 0 ? '' : 'none';
            }
          });
        }

        // Dispatch event for custom cart count handlers
        document.dispatchEvent(new CustomEvent('invicta:cart:count-updated', {
          detail: { cart }
        }));

      } catch (error) {
        DEBUG && console.error('Failed to update cart count:', error);
      }
    }
  }

  // Initialise
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new InvictaCartHandler());
  } else {
    new InvictaCartHandler();
  }
})();
