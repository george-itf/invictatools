/**
 * Invicta Quantity Selector Enhancements
 * =======================================
 * Enhances the standard Shopify quantity selector with:
 * - Quick-select buttons (5, 10, 25, 50)
 * - Dynamic price updates as quantity changes
 * - Smooth animations
 * - Accessibility improvements
 * 
 * @version 1.0.0
 * @author Invicta Tools Theme
 */

(function() {
  'use strict';

  /** @type {boolean} Enable console logging (set false for production) */
  const DEBUG = false;

  /**
   * Quantity Selector Controller
   */
  const QuantityEnhancer = {
    /** @type {number[]} Quick select quantities */
    quickQtys: [5, 10, 25, 50],

    /** @type {AbortController|null} Shared AbortController for global event cleanup */
    abortController: null,

    /** @type {MutationObserver|null} DOM mutation observer reference */
    mutationObserver: null,

    /**
     * Initialise quantity enhancements
     * @returns {void}
     */
    init() {
      this.abortController = new AbortController();
      this.enhanceSelectors();
      this.bindEvents();
      this.observeDynamicContent();

      DEBUG && console.log('[Quantity Enhancer] Initialised');
    },

    /**
     * Cleanup all global listeners and observers
     * @returns {void}
     */
    destroy() {
      clearTimeout(this.enhanceTimeout);
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }
      DEBUG && console.log('[Quantity Enhancer] Destroyed');
    },

    /**
     * Enhance all quantity selectors on page
     * @returns {void}
     */
    enhanceSelectors() {
      // Find product form quantity selectors (not cart ones)
      const productForms = document.querySelectorAll('product-form, .product-form');
      
      productForms.forEach(form => {
        const quantityWrapper = form.querySelector('.quantity, quantity-input');
        if (!quantityWrapper) return;

        // Skip if already enhanced
        if (quantityWrapper.hasAttribute('data-qty-enhanced')) return;
        quantityWrapper.setAttribute('data-qty-enhanced', 'true');

        // Get the input
        const input = quantityWrapper.querySelector('input[type="number"], input[name="quantity"]');
        if (!input) return;

        // Add quick-select buttons
        this.addQuickSelectButtons(quantityWrapper, input);

        // Add dynamic price display
        this.addDynamicPrice(form, input);
      });
    },

    /**
     * Add quick-select quantity buttons
     * @param {Element} wrapper - Quantity wrapper element
     * @param {HTMLInputElement} input - Quantity input
     * @returns {void}
     */
    addQuickSelectButtons(wrapper, input) {
      // Check if buttons already exist
      if (wrapper.parentElement.querySelector('.invicta-quick-qty')) return;

      const quickQtyContainer = document.createElement('div');
      quickQtyContainer.className = 'invicta-quick-qty';

      var qqLabel = document.createElement('span');
      qqLabel.className = 'invicta-quick-qty__label';
      qqLabel.textContent = 'Quick add:';
      quickQtyContainer.appendChild(qqLabel);

      var qqButtons = document.createElement('div');
      qqButtons.className = 'invicta-quick-qty__buttons';
      this.quickQtys.forEach(function(qty) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'invicta-quick-qty__btn';
        btn.setAttribute('data-quick-qty', String(qty));
        btn.setAttribute('aria-label', 'Set quantity to ' + qty);
        btn.textContent = String(qty);
        qqButtons.appendChild(btn);
      });
      quickQtyContainer.appendChild(qqButtons);

      // Insert after quantity wrapper
      wrapper.parentElement.insertBefore(quickQtyContainer, wrapper.nextSibling);
    },

    /**
     * Add dynamic total price display
     * @param {Element} form - Product form
     * @param {HTMLInputElement} input - Quantity input
     * @returns {void}
     */
    addDynamicPrice(form, input) {
      // Find the price element
      const priceBlock = form.closest('.product').querySelector('.price, .invicta-price');
      if (!priceBlock) return;

      // Get the main price
      const mainPrice = priceBlock.querySelector('.price-item--regular, .price-item--sale, .invicta-price-main');
      if (!mainPrice) return;

      // Check if dynamic price already exists
      if (form.querySelector('.invicta-qty-total')) return;

      // Extract base price
      const priceText = mainPrice.textContent.trim();
      const priceMatch = priceText.match(/£([\d,]+\.?\d*)/);
      if (!priceMatch) return;

      const basePrice = parseFloat(priceMatch[1].replace(/,/g, ''));
      if (isNaN(basePrice)) return;

      // Store base price on input
      input.setAttribute('data-base-price', basePrice.toString());

      // Create total display
      const totalDisplay = document.createElement('div');
      totalDisplay.className = 'invicta-qty-total';
      var totalLabel = document.createElement('span');
      totalLabel.className = 'invicta-qty-total__label';
      totalLabel.textContent = 'Total:';
      totalDisplay.appendChild(totalLabel);
      var totalValue = document.createElement('span');
      totalValue.className = 'invicta-qty-total__value';
      totalValue.setAttribute('data-qty-total', '');
      totalValue.textContent = '\u00a3' + basePrice.toFixed(2);
      totalDisplay.appendChild(totalValue);

      // Insert after quantity
      const quantityWrapper = input.closest('.quantity, quantity-input');
      if (quantityWrapper && quantityWrapper.parentElement) {
        const quickQty = quantityWrapper.parentElement.querySelector('.invicta-quick-qty');
        if (quickQty) {
          quickQty.parentElement.insertBefore(totalDisplay, quickQty.nextSibling);
        } else {
          quantityWrapper.parentElement.insertBefore(totalDisplay, quantityWrapper.nextSibling);
        }
      }

      // Update on initial load
      this.updateDynamicPrice(input);
    },

    /**
     * Update dynamic price display
     * @param {HTMLInputElement} input - Quantity input
     * @returns {void}
     */
    updateDynamicPrice(input) {
      const basePrice = parseFloat(input.getAttribute('data-base-price'));
      if (isNaN(basePrice)) return;

      const qty = parseInt(input.value) || 1;
      const total = basePrice * qty;

      // Find total display
      const form = input.closest('product-form, .product-form');
      if (!form) return;

      const totalDisplay = form.querySelector('[data-qty-total]');
      if (totalDisplay) {
        const formatted = '£' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        // Animate the change
        totalDisplay.style.transition = 'transform 0.15s ease, opacity 0.15s ease';
        totalDisplay.style.transform = 'scale(1.05)';
        totalDisplay.style.opacity = '0.7';
        
        setTimeout(() => {
          totalDisplay.textContent = formatted;
          totalDisplay.style.transform = 'scale(1)';
          totalDisplay.style.opacity = '1';
        }, 150);
      }

      // Update quick-qty button states
      const quickBtns = form.querySelectorAll('.invicta-quick-qty__btn');
      quickBtns.forEach(btn => {
        const btnQty = parseInt(btn.getAttribute('data-quick-qty'));
        btn.classList.toggle('invicta-quick-qty__btn--active', btnQty === qty);
      });
    },

    /**
     * Bind event listeners
     * @returns {void}
     */
    bindEvents() {
      const signal = this.abortController.signal;

      // Quick quantity button clicks
      document.addEventListener('click', (e) => {
        const quickBtn = e.target.closest('[data-quick-qty]');
        if (!quickBtn) return;

        e.preventDefault();

        const qty = parseInt(quickBtn.getAttribute('data-quick-qty'));
        const form = quickBtn.closest('product-form, .product-form');
        if (!form) return;

        const input = form.querySelector('input[name="quantity"]');
        if (!input) return;

        // Set the quantity
        input.value = qty;

        // Trigger change event for Shopify's JS
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Update our dynamic price
        this.updateDynamicPrice(input);

        // Visual feedback
        quickBtn.classList.add('invicta-quick-qty__btn--clicked');
        setTimeout(() => {
          quickBtn.classList.remove('invicta-quick-qty__btn--clicked');
        }, 200);
      }, { signal });

      // Quantity input changes
      document.addEventListener('change', (e) => {
        if (e.target.matches('input[name="quantity"]')) {
          this.updateDynamicPrice(e.target);
        }
      }, { signal });

      // Also listen for input event (real-time typing)
      document.addEventListener('input', (e) => {
        if (e.target.matches('input[name="quantity"]')) {
          this.updateDynamicPrice(e.target);
        }
      }, { signal });

      // +/- button clicks (Shopify's quantity buttons)
      document.addEventListener('click', (e) => {
        const qtyBtn = e.target.closest('.quantity__button, [data-qty-minus], [data-qty-plus]');
        if (!qtyBtn) return;

        // Wait for Shopify's JS to update the input
        setTimeout(() => {
          const wrapper = qtyBtn.closest('.quantity, quantity-input');
          if (!wrapper) return;

          const input = wrapper.querySelector('input[name="quantity"]');
          if (input) {
            this.updateDynamicPrice(input);
          }
        }, 50);
      }, { signal });
    },

    /**
     * Observe DOM for dynamic content
     * @returns {void}
     */
    observeDynamicContent() {
      this.mutationObserver = new MutationObserver((mutations) => {
        let shouldEnhance = false;

        mutations.forEach(mutation => {
          if (mutation.addedNodes.length) {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === 1 && (
                node.querySelector?.('product-form') ||
                node.querySelector?.('.quantity') ||
                node.matches?.('product-form')
              )) {
                shouldEnhance = true;
              }
            });
          }
        });

        if (shouldEnhance) {
          clearTimeout(this.enhanceTimeout);
          this.enhanceTimeout = setTimeout(() => this.enhanceSelectors(), 100);
        }
      });

      var observeTarget = document.querySelector('#MainContent') || document.body;
      this.mutationObserver.observe(observeTarget, {
        childList: true,
        subtree: true
      });
    }
  };

  // Expose globally
  window.InvictaQuantity = QuantityEnhancer;

  // Initialise
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => QuantityEnhancer.init());
  } else {
    QuantityEnhancer.init();
  }

  // Re-init on section load
  document.addEventListener('shopify:section:load', () => {
    setTimeout(() => QuantityEnhancer.enhanceSelectors(), 100);
  });

})();
