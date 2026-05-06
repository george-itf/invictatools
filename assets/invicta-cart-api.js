/**
 * Invicta Cart API — Shared add-to-cart utility
 * ==============================================
 * Centralises all /cart/add.js calls to prevent duplicate code paths.
 *
 * Features:
 * - Request deduplication (prevents double-click race conditions)
 * - Consistent error handling and event dispatch
 * - Cart count + cart drawer update after add
 * - Loading state management
 *
 * Usage:
 *   window.InvictaCartAPI.add({ id: variantId, quantity: 1 })
 *   window.InvictaCartAPI.add({ id: variantId, quantity: 1 }, { sections: 'cart-drawer,cart-icon-bubble' })
 *
 * @version 1.0.0
 */
(function() {
  'use strict';

  function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const id = setTimeout(function() { controller.abort(); }, timeoutMs || 10000);
    const opts = Object.assign({}, options, { signal: controller.signal });
    return fetch(url, opts).finally(function() { clearTimeout(id); });
  }

  /** @type {Set<string>} Variant IDs currently in-flight */
  const _inFlight = new Set();

  /** Canonical cart count selectors — defined in constants.js */
  const CART_COUNT_SELECTORS = INVICTA_SELECTORS.cartCount;

  /**
   * Add item(s) to cart.
   * @param {Object} item - { id: number|string, quantity: number, properties?: Object }
   * @param {Object} [options] - { sections?: string, sections_url?: string, formData?: FormData }
   * @returns {Promise<Object>} Resolved with the cart response, rejected with error
   */
  function add(item, options) {
    options = options || {};
    const dedupKey = String(item.id);

    if (_inFlight.has(dedupKey)) {
      return Promise.reject(new Error('Request already in flight for variant ' + dedupKey));
    }
    _inFlight.add(dedupKey);

    const cartAddUrl = INVICTA_ROUTES.cartAdd;
    let fetchOptions;

    if (options.formData) {
      // FormData mode (used by PDP form with sections)
      const fd = options.formData;
      if (options.sections) {
        fd.append('sections', options.sections);
      }
      if (options.sections_url) {
        fd.append('sections_url', options.sections_url);
      }
      fetchOptions = {
        method: 'POST',
        body: fd
      };
    } else {
      // JSON mode (used by product cards, quick-add)
      const body = {
        id: parseInt(String(item.id), 10),
        quantity: item.quantity || 1
      };
      if (item.properties) body.properties = item.properties;
      if (options.sections) body.sections = options.sections;
      if (options.sections_url) body.sections_url = options.sections_url;

      fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(body)
      };
    }

    return fetchWithTimeout(cartAddUrl, fetchOptions, 10000)
      .then(function(response) {
        if (!response.ok) {
          return response.json().then(function(err) { throw err; });
        }
        return response.json();
      })
      .then(function(data) {
        // Dispatch unified events
        document.dispatchEvent(new CustomEvent('cart:item-added', {
          detail: { item: data }
        }));
        document.dispatchEvent(new CustomEvent('invicta:cart:updated', {
          detail: { source: options.source || 'cart-api', item: data }
        }));
        document.dispatchEvent(new CustomEvent('cart:refresh'));

        // Update cart count
        updateCartCount();

        return data;
      })
      .catch(function(err) {
        if (err && err.name === 'AbortError') {
          document.dispatchEvent(new CustomEvent('invicta:cart:error', {
            detail: { message: 'Request timed out. Please try again.' }
          }));
        }
        throw err;
      })
      .finally(function() {
        _inFlight.delete(dedupKey);
      });
  }

  /** @type {AbortController|null} In-flight cart count fetch — newer call aborts older */
  let _cartCountController = null;

  /**
   * Update cart count in header from /cart.js
   * Deduplicated: a newer call aborts any in-flight request so the latest
   * response wins and parallel updates don't race.
   * @returns {Promise<void>}
   */
  function updateCartCount() {
    const cartUrl = INVICTA_ROUTES.cart;

    if (_cartCountController) {
      _cartCountController.abort();
    }
    const controller = new AbortController();
    _cartCountController = controller;
    const timeoutId = setTimeout(function() { controller.abort(); }, 10000);

    return fetch(cartUrl, {
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    })
    .then(function(response) {
      if (!response.ok) return;
      return response.json();
    })
    .then(function(cart) {
      if (!cart) return;
      const count = cart.item_count;

      CART_COUNT_SELECTORS.forEach(function(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(function(el) {
          el.textContent = count;
          const bubble = el.closest(INVICTA_SELECTORS.cartCountBubble);
          if (bubble) {
            bubble.style.display = count > 0 ? '' : 'none';
          }
        });
      });

      document.dispatchEvent(new CustomEvent('invicta:cart:count-updated', {
        detail: { cart: cart }
      }));
    })
    .catch(function() {
      // Silent — cart count is non-critical, and AbortError is expected on supersession
    })
    .finally(function() {
      clearTimeout(timeoutId);
      if (_cartCountController === controller) {
        _cartCountController = null;
      }
    });
  }

  /**
   * Check if a variant is currently being added.
   * @param {string|number} variantId
   * @returns {boolean}
   */
  function isInFlight(variantId) {
    return _inFlight.has(String(variantId));
  }

  // Expose API
  window.InvictaCartAPI = {
    add: add,
    updateCartCount: updateCartCount,
    isInFlight: isInFlight
  };
})();
