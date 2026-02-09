(function() {
  'use strict';

  var quoteModal = document.querySelector('[data-quote-modal]');
  if (!quoteModal) return;

  function closeModal() {
    quoteModal.hidden = true;
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-quote-close]').forEach(function(el) {
    el.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !quoteModal.hidden) {
      closeModal();
    }
  });

  // Close when clicking backdrop
  quoteModal.addEventListener('click', function(e) {
    if (e.target === quoteModal) {
      closeModal();
    }
  });

  // Pre-fill quantity when modal opens — use a simple attribute watch
  var lastHidden = quoteModal.hidden;
  var observer = new MutationObserver(function(mutations) {
    for (var i = 0; i < mutations.length; i++) {
      if (mutations[i].attributeName === 'hidden' && !quoteModal.hidden) {
        var productQty = document.querySelector('#InvQty, input[name="quantity"]');
        var quoteQty = quoteModal.querySelector('[data-quote-qty]');
        if (productQty && quoteQty) {
          quoteQty.value = productQty.value;
        }

        var nameInput = quoteModal.querySelector('input[name="contact[name]"]');
        if (nameInput) {
          setTimeout(function() { nameInput.focus(); }, 100);
        }
        break;
      }
    }
  });

  observer.observe(quoteModal, { attributes: true, attributeFilter: ['hidden'] });
})();
