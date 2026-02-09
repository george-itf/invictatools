  (function() {
    'use strict';

    const quoteModal = document.querySelector('[data-quote-modal]');
    if (!quoteModal) return;

    // Close modal handlers
    document.querySelectorAll('[data-quote-close]').forEach(el => {
      el.addEventListener('click', () => {
        quoteModal.hidden = true;
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !quoteModal.hidden) {
        quoteModal.hidden = true;
        document.body.style.overflow = '';
      }
    });

    // Pre-fill quantity from product page when modal opens
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'hidden' && !quoteModal.hidden) {
          const productQty = document.querySelector('#InvQty, input[name="quantity"]');
          const quoteQty = quoteModal.querySelector('[data-quote-qty]');
          if (productQty && quoteQty) {
            quoteQty.value = productQty.value;
          }

          // Focus first input
          setTimeout(() => {
            quoteModal.querySelector('input[name="contact[name]"]')?.focus();
          }, 100);
        }
      });
    });

    observer.observe(quoteModal, { attributes: true });
  })();
