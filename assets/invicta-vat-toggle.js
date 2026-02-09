/**
 * ============================================
 * Invicta VAT Toggle v4.1 (UNIFIED)
 * ============================================
 *
 * Handles VAT toggle functionality site-wide.
 * - Persists preference in localStorage
 * - Dispatches custom events for other components
 * - Updates all price displays across the page
 *
 * USAGE:
 * Add to theme.liquid before </body> or as an asset
 *
 * EVENTS DISPATCHED:
 * - invicta:vat-toggle { detail: { mode: 'inc' | 'ex' } }
 *
 * LISTENS FOR:
 * - Clicks on [data-vat-btn] elements
 *
 * SELECTOR CONTRACT (unified):
 * - Price wrapper: [data-vat-price-wrapper] OR [data-price-wrapper]
 * - Views: [data-vat-view="inc"], [data-vat-view="ex"]
 * - Hidden class: .inv-pdp__price-row--hidden OR .is-hidden
 *
 * ============================================
 */
(function() {
  'use strict';
  
  const STORAGE_KEY = 'invicta-vat-mode';
  const DEFAULT_MODE = 'inc';
  
  /**
   * Get current VAT mode from localStorage
   * @returns {string} 'inc' or 'ex'
   */
  function getVatMode() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'ex' ? 'ex' : 'inc';
    } catch (e) {
      return DEFAULT_MODE;
    }
  }
  
  /**
   * Save VAT mode to localStorage
   * @param {string} mode - 'inc' or 'ex'
   */
  function setVatMode(mode) {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      // Silent fail for storage errors
    }
  }
  
  /**
   * Dispatch custom event for VAT toggle
   * @param {string} mode - 'inc' or 'ex'
   */
  function dispatchVatEvent(mode) {
    document.dispatchEvent(new CustomEvent('invicta:vat-toggle', {
      detail: { mode },
      bubbles: true
    }));
  }
  
  /**
   * Update all VAT toggle buttons to reflect current state
   * @param {string} mode - 'inc' or 'ex'
   */
  function updateToggleButtons(mode) {
    document.querySelectorAll('[data-vat-btn]').forEach(btn => {
      const btnMode = btn.dataset.vatBtn;
      const isActive = btnMode === mode;
      
      btn.classList.toggle('invicta-header__vat-btn--active', isActive);
      btn.classList.toggle('invicta-nav__vat-btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }
  
  /**
   * Update all price displays on the page
   * Unified to support both PDP and PLP selectors
   * @param {string} mode - 'inc' or 'ex'
   */
  function updatePriceDisplays(mode) {
    // Unified selector: supports both data-vat-price-wrapper AND data-price-wrapper
    const priceWrappers = document.querySelectorAll('[data-vat-price-wrapper], [data-price-wrapper]');

    priceWrappers.forEach(wrapper => {
      const incView = wrapper.querySelector('[data-vat-view="inc"]');
      const exView = wrapper.querySelector('[data-vat-view="ex"]');

      if (incView && exView) {
        // Support both class naming conventions
        const hiddenClasses = ['inv-pdp__price-row--hidden', 'inv-pdp__price-view--hidden', 'is-hidden'];

        if (mode === 'ex') {
          hiddenClasses.forEach(cls => {
            incView.classList.add(cls);
            exView.classList.remove(cls);
          });
        } else {
          hiddenClasses.forEach(cls => {
            incView.classList.remove(cls);
            exView.classList.add(cls);
          });
        }
      }

      // Toggle alt price text
      const incAlt = wrapper.querySelector('[data-vat-alt="inc"]');
      const exAlt = wrapper.querySelector('[data-vat-alt="ex"]');

      if (incAlt && exAlt) {
        const altHiddenClasses = ['inv-pdp__price-alt--hidden', 'is-hidden'];
        if (mode === 'ex') {
          altHiddenClasses.forEach(cls => {
            incAlt.classList.add(cls);
            exAlt.classList.remove(cls);
          });
        } else {
          altHiddenClasses.forEach(cls => {
            incAlt.classList.remove(cls);
            exAlt.classList.add(cls);
          });
        }
      }
    });

    // Update collection/card price displays (if they exist)
    document.querySelectorAll('[data-price-inc-container]').forEach(el => {
      el.style.display = mode === 'inc' ? '' : 'none';
    });
    document.querySelectorAll('[data-price-ex-container]').forEach(el => {
      el.style.display = mode === 'ex' ? '' : 'none';
    });

    // Update any generic VAT-aware elements
    document.querySelectorAll('[data-vat-display]').forEach(el => {
      const showMode = el.dataset.vatDisplay;
      el.style.display = showMode === mode ? '' : 'none';
    });

    // Push to dataLayer for analytics (P1.5)
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'vat_toggle',
        vat_mode: mode
      });
    }
  }
  
  /**
   * Handle VAT toggle button click
   * @param {Event} e - Click event
   */
  function handleToggleClick(e) {
    const btn = e.target.closest('[data-vat-btn]');
    if (!btn) return;
    
    const mode = btn.dataset.vatBtn;
    if (!mode || (mode !== 'inc' && mode !== 'ex')) return;
    
    // Prevent double-toggle if already active
    if (btn.classList.contains('invicta-header__vat-btn--active') || 
        btn.classList.contains('invicta-nav__vat-btn--active')) {
      return;
    }
    
    // Update state
    setVatMode(mode);
    updateToggleButtons(mode);
    updatePriceDisplays(mode);
    dispatchVatEvent(mode);
  }
  
  /**
   * Initialise VAT toggle on page load
   */
  function init() {
    const mode = getVatMode();
    
    // Set initial state
    updateToggleButtons(mode);
    updatePriceDisplays(mode);
    
    // Attach click listener (delegated)
    document.addEventListener('click', handleToggleClick);
    
    // Dispatch initial event for any listeners
    dispatchVatEvent(mode);
  }
  
  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Expose API for external use
  window.InvictaVAT = {
    getMode: getVatMode,
    setMode: function(mode) {
      if (mode !== 'inc' && mode !== 'ex') return;
      setVatMode(mode);
      updateToggleButtons(mode);
      updatePriceDisplays(mode);
      dispatchVatEvent(mode);
    }
  };
  
})();