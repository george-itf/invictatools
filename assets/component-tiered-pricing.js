  (function() {
    'use strict';

    const tieredPricing = document.querySelector('[data-tiered-pricing]');
    if (!tieredPricing) return;

    const rows = tieredPricing.querySelectorAll('[data-tier-qty]');
    const qtyInput = document.querySelector('input[name="quantity"]');

    if (!qtyInput || rows.length === 0) return;

    /**
     * Update active tier based on quantity
     */
    function updateActiveTier() {
      const qty = parseInt(qtyInput.value) || 1;
      let activeTier = null;

      // Find the highest tier that applies
      rows.forEach(row => {
        const tierQty = parseInt(row.getAttribute('data-tier-qty'));
        row.classList.remove('invicta-tier--active');

        if (qty >= tierQty) {
          activeTier = row;
        }
      });

      if (activeTier) {
        activeTier.classList.add('invicta-tier--active');
      }
    }

    // Listen for quantity changes
    qtyInput.addEventListener('change', updateActiveTier);
    qtyInput.addEventListener('input', updateActiveTier);

    // Also listen for +/- button clicks
    document.addEventListener('click', (e) => {
      if (e.target.closest('.quantity__button')) {
        setTimeout(updateActiveTier, 50);
      }
    });

    // Initial check
    updateActiveTier();
  })();
