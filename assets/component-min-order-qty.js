    (function() {
      'use strict';

      const MIN_QTY = parseInt(document.querySelector('[data-min-qty]').dataset.minQty, 10);
      const minQtyEl = document.querySelector('[data-min-qty]');
      const qtyInput = document.querySelector('#InvQty, input[name="quantity"]');

      if (!qtyInput || !minQtyEl) return;

      // Set minimum on input
      qtyInput.min = MIN_QTY;

      // Validate and auto-correct on blur
      qtyInput.addEventListener('blur', function() {
        const val = parseInt(this.value) || 0;
        if (val < MIN_QTY) {
          this.value = MIN_QTY;

          // Show feedback
          minQtyEl.classList.add('invicta-min-qty--warning');
          setTimeout(() => {
            minQtyEl.classList.remove('invicta-min-qty--warning');
          }, 2000);

          // Trigger change event
          this.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Also check on form submit
      document.addEventListener('submit', function(e) {
        if (e.target.closest('product-form, .product-form')) {
          const val = parseInt(qtyInput.value) || 0;
          if (val < MIN_QTY) {
            e.preventDefault();
            qtyInput.value = MIN_QTY;
            minQtyEl.classList.add('invicta-min-qty--warning');
            setTimeout(() => {
              minQtyEl.classList.remove('invicta-min-qty--warning');
            }, 2000);
          }
        }
      });

      // Check on +/- button clicks
      document.addEventListener('click', function(e) {
        if (e.target.closest('.inv-qty__btn--minus, [data-qty-minus]')) {
          setTimeout(() => {
            const val = parseInt(qtyInput.value) || 0;
            if (val < MIN_QTY) {
              qtyInput.value = MIN_QTY;
            }
          }, 50);
        }
      });

      // Set initial value if below minimum
      if (parseInt(qtyInput.value) < MIN_QTY) {
        qtyInput.value = MIN_QTY;
      }
    })();
