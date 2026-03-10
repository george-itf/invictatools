/**
 * Invicta Quick Add to Cart v2.0
 * ==============================
 * Handles quick-add pill buttons on product cards.
 * Now delegates to shared InvictaCartAPI for the fetch call.
 */
(function() {
  'use strict';

  function initQuickAdd() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.invicta-quick-add-pill');
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      var variantId = btn.dataset.variantId;
      if (!variantId) {
        var productUrl = btn.dataset.productUrl;
        if (productUrl) window.location.href = productUrl;
        return;
      }

      addToCart(btn, variantId);
    });
  }

  function addToCart(btn, variantId) {
    // Dedup via shared API
    if (window.InvictaCartAPI && window.InvictaCartAPI.isInFlight(variantId)) return;

    btn.classList.add('is-loading');
    btn.classList.remove('is-added');

    window.InvictaCartAPI.add(
      { id: variantId, quantity: 1 },
      { source: 'quick-add' }
    )
    .then(function() {
      btn.classList.remove('is-loading');
      btn.classList.add('is-added');
      var span = btn.querySelector('span');
      if (span) span.textContent = '\u2713';

      setTimeout(function() {
        btn.classList.remove('is-added');
        var span = btn.querySelector('span');
        if (span) span.textContent = 'Add';
      }, 1500);
    })
    .catch(function(error) {
      btn.classList.remove('is-loading');
      var message = (error && (error.description || error.message)) || '!';
      var span = btn.querySelector('span');
      if (span) {
        span.textContent = message.length > 20 ? '!' : message;
      }

      setTimeout(function() {
        var span = btn.querySelector('span');
        if (span) span.textContent = 'Add';
      }, 2000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickAdd);
  } else {
    initQuickAdd();
  }
})();
