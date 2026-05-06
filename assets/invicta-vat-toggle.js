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
 *   <!-- Toggle buttons (inside a data-vat-toggle container) -->
 *   <div data-vat-toggle>
 *     <button data-vat-btn="ex" aria-pressed="false">Ex VAT</button>
 *     <button data-vat-btn="inc" aria-pressed="true">Inc VAT</button>
 *   </div>
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

  // Guard against double-init when the script is re-evaluated (e.g. Shopify
  // theme editor re-renders the containing section, or HMR/preview reloads).
  if (window.__invictaVatToggleInitialised) return;
  window.__invictaVatToggleInitialised = true;

  const STORAGE_KEY = 'invicta-vat-mode';
  const DEFAULT_MODE = 'inc';
  const HIDDEN_CLASS = 'inv-vat--hidden';

  /**
   * Get current VAT mode from localStorage
   * @returns {string} 'inc' or 'ex'
   */
  function getVatMode() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'inc' || stored === 'ex') return stored;
      return DEFAULT_MODE;
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
    document.querySelectorAll('[data-vat-btn]').forEach(function(btn) {
      const btnMode = btn.getAttribute('data-vat-btn');

      if (btnMode === 'inc' || btnMode === 'ex') {
        const isActive = btnMode === mode;
        btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');

        // Toggle the correct BEM active class for each button type
        if (btn.classList.contains('invicta-header__vat-btn')) {
          btn.classList.toggle('invicta-header__vat-btn--active', isActive);
        } else if (btn.classList.contains('invicta-drawer__vat-pill')) {
          btn.classList.toggle('invicta-drawer__vat-pill--active', isActive);
        }
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
   * Update the <html> element class for CSS-only early paint
   * @param {string} mode - 'inc' or 'ex'
   */
  function updateHtmlClass(mode) {
    if (mode === 'ex') {
      document.documentElement.classList.add('inv-vat-ex');
    } else {
      document.documentElement.classList.remove('inv-vat-ex');
    }
  }

  /**
   * Apply VAT mode: update buttons, prices, html class, and persist
   * @param {string} mode - 'inc' or 'ex'
   */
  function applyVatMode(mode) {
    setVatMode(mode);
    updateHtmlClass(mode);
    updateToggleButtons(mode);
    updatePriceDisplays(mode);
    dispatchVatEvent(mode);
  }

  /**
   * Handle VAT toggle button click (delegated)
   * @param {Event} e - Click event
   */
  function handleToggleClick(e) {
    const btn = e.target.closest('[data-vat-btn]');
    if (!btn) return;

    const btnMode = btn.getAttribute('data-vat-btn');

    if (btnMode === 'inc' || btnMode === 'ex') {
      // Button with explicit mode (e.g. header "Inc" / "Ex" buttons)
      if (btnMode === getVatMode()) return; // already active
      applyVatMode(btnMode);
    } else {
      // Generic toggle (e.g. PDP switch) — flip current mode
      const current = getVatMode();
      applyVatMode(current === 'inc' ? 'ex' : 'inc');
    }
  }

  // Stored handler refs so we can remove before re-attaching.
  let _onCollectionUpdated = null;
  let _onSectionLoad = null;

  function reapplyCurrentMode() {
    const currentMode = getVatMode();
    updatePriceDisplays(currentMode);
    updateToggleButtons(currentMode);
  }

  /**
   * Initialise VAT toggle on page load
   */
  function init() {
    const mode = getVatMode();

    // Set initial state (html class, buttons, prices)
    updateHtmlClass(mode);
    updateToggleButtons(mode);
    updatePriceDisplays(mode);

    // Remove any previously attached listeners before re-attaching, so calls to
    // init() don't stack up duplicate handlers on re-render.
    document.removeEventListener('click', handleToggleClick);
    if (_onCollectionUpdated) document.removeEventListener('invicta:collection:updated', _onCollectionUpdated);
    if (_onSectionLoad) document.removeEventListener('shopify:section:load', _onSectionLoad);

    _onCollectionUpdated = reapplyCurrentMode;
    _onSectionLoad = reapplyCurrentMode;

    // Attach click listener (delegated). VAT toggle is a global site-wide
    // feature that must remain active regardless of DOM changes.
    document.addEventListener('click', handleToggleClick);

    // Re-apply VAT mode when collection filters update the DOM via AJAX.
    document.addEventListener('invicta:collection:updated', _onCollectionUpdated);

    // Also re-apply on generic cart refresh / section render.
    document.addEventListener('shopify:section:load', _onSectionLoad);

    // Dispatch initial event for any listeners
    dispatchVatEvent(mode);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for external use (including reapply for AJAX contexts)
  window.InvictaVAT = {
    getMode: getVatMode,
    setMode: function(mode) {
      if (mode !== 'inc' && mode !== 'ex') return;
      applyVatMode(mode);
    },
    reapply: function() {
      const mode = getVatMode();
      updatePriceDisplays(mode);
      updateToggleButtons(mode);
    }
  };

})();
