/**
 * ============================================
 * Invicta VAT Toggle v5.0 (STANDARDISED)
 * ============================================
 *
 * Single canonical VAT toggle controller for the entire site.
 *
 * MARKUP CONTRACT:
 *
 *   <!-- Price wrapper -->
 *   <div data-price-wrapper>
 *     <span data-price-inc class="inv-vat inv-vat--inc">£35.99 inc VAT</span>
 *     <span data-price-ex  class="inv-vat inv-vat--ex">£29.99 ex VAT</span>
 *   </div>
 *
 *   <!-- Toggle button -->
 *   <button data-vat-toggle aria-pressed="true|false">Inc VAT / Ex VAT</button>
 *
 * HIDDEN STATE:
 *   .inv-vat--hidden { display: none; }
 *
 * STORAGE:
 *   localStorage key: 'invicta-vat-mode'
 *   Values: 'inc' | 'ex'
 *
 * EVENTS DISPATCHED:
 *   'invicta:vat-toggle' with detail: { mode: 'inc' | 'ex' }
 *
 * ============================================
 */
(function() {
  'use strict';

  var STORAGE_KEY = 'invicta-vat-mode';
  var DEFAULT_MODE = 'inc';
  var HIDDEN_CLASS = 'inv-vat--hidden';

  /**
   * Get current VAT mode from localStorage
   * @returns {string} 'inc' or 'ex'
   */
  function getVatMode() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      return stored === 'ex' ? 'ex' : DEFAULT_MODE;
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
      detail: { mode: mode },
      bubbles: true
    }));
  }

  /**
   * Update all VAT toggle buttons to reflect current state
   * @param {string} mode - 'inc' or 'ex'
   */
  function updateToggleButtons(mode) {
    document.querySelectorAll('[data-vat-toggle]').forEach(function(btn) {
      var btnMode = btn.getAttribute('data-vat-toggle');

      // If the button has a mode value (e.g. data-vat-toggle="inc"),
      // update aria-pressed and active class accordingly
      if (btnMode === 'inc' || btnMode === 'ex') {
        var isActive = btnMode === mode;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        btn.classList.toggle('inv-vat-toggle--active', isActive);
      }
    });
  }

  /**
   * Update all price displays on the page
   * Uses ONLY [data-price-inc] and [data-price-ex] with .inv-vat--hidden
   * @param {string} mode - 'inc' or 'ex'
   */
  function updatePriceDisplays(mode) {
    // Show/hide inc-VAT price elements
    document.querySelectorAll('[data-price-inc]').forEach(function(el) {
      if (mode === 'inc') {
        el.classList.remove(HIDDEN_CLASS);
      } else {
        el.classList.add(HIDDEN_CLASS);
      }
    });

    // Show/hide ex-VAT price elements
    document.querySelectorAll('[data-price-ex]').forEach(function(el) {
      if (mode === 'ex') {
        el.classList.remove(HIDDEN_CLASS);
      } else {
        el.classList.add(HIDDEN_CLASS);
      }
    });

    // Push to dataLayer for analytics
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'vat_toggle',
        vat_mode: mode
      });
    }
  }

  /**
   * Apply VAT mode: update buttons, prices, and persist
   * @param {string} mode - 'inc' or 'ex'
   */
  function applyVatMode(mode) {
    setVatMode(mode);
    updateToggleButtons(mode);
    updatePriceDisplays(mode);
    dispatchVatEvent(mode);
  }

  /**
   * Handle VAT toggle button click (delegated)
   * @param {Event} e - Click event
   */
  function handleToggleClick(e) {
    var btn = e.target.closest('[data-vat-toggle]');
    if (!btn) return;

    var btnMode = btn.getAttribute('data-vat-toggle');

    if (btnMode === 'inc' || btnMode === 'ex') {
      // Button with explicit mode (e.g. header "Inc" / "Ex" buttons)
      if (btnMode === getVatMode()) return; // already active
      applyVatMode(btnMode);
    } else {
      // Generic toggle (e.g. PDP switch) — flip current mode
      var current = getVatMode();
      applyVatMode(current === 'inc' ? 'ex' : 'inc');
    }
  }

  /**
   * Initialise VAT toggle on page load
   */
  function init() {
    var mode = getVatMode();

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
      applyVatMode(mode);
    }
  };

})();
