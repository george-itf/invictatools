/**
 * Invicta Cart Handler v2.0
 * Manages add-to-cart actions from product cards.
 * Now delegates to shared InvictaCartAPI for the fetch call.
 */
(function() {
  'use strict';

  function init() {
    document.addEventListener('click', function(e) {
      const addBtn = e.target.closest('[data-add-to-cart]');
      if (!addBtn) return;

      e.preventDefault();
      handleAddToCart(addBtn);
    });
  }

  function handleAddToCart(button) {
    const variantId = button.dataset.variantId;
    const quantity = parseInt(button.dataset.quantity || '1', 10);

    if (!variantId) return;

    // Dedup check via shared API
    if (window.InvictaCartAPI && window.InvictaCartAPI.isInFlight(variantId)) return;

    // Set loading state — store original children for restoration
    button.classList.add('inv-card__btn--loading');
    const originalChildren = Array.from(button.childNodes).map(function(n) { return n.cloneNode(true); });
    while (button.firstChild) button.removeChild(button.firstChild);
    const loadingSpan = document.createElement('span');
    loadingSpan.textContent = 'Adding\u2026';
    button.appendChild(loadingSpan);
    button.disabled = true;

    function restoreButton() {
      while (button.firstChild) button.removeChild(button.firstChild);
      originalChildren.forEach(function(n) { button.appendChild(n.cloneNode(true)); });
      button.disabled = false;
    }

    window.InvictaCartAPI.add(
      { id: variantId, quantity: quantity },
      { source: 'card-handler' }
    )
    .then(function() {
      // Success state
      while (button.firstChild) button.removeChild(button.firstChild);
      const svgNS = 'http://www.w3.org/2000/svg';
      const tick = document.createElementNS(svgNS, 'svg');
      tick.setAttribute('width', '16');
      tick.setAttribute('height', '16');
      tick.setAttribute('viewBox', '0 0 24 24');
      tick.setAttribute('fill', 'none');
      tick.setAttribute('stroke', 'currentColor');
      tick.setAttribute('stroke-width', '2.5');
      tick.setAttribute('stroke-linecap', 'round');
      tick.setAttribute('stroke-linejoin', 'round');
      const polyline = document.createElementNS(svgNS, 'polyline');
      polyline.setAttribute('points', '20 6 9 17 4 12');
      tick.appendChild(polyline);
      button.appendChild(tick);
      const addedSpan = document.createElement('span');
      addedSpan.textContent = 'Added!';
      button.appendChild(addedSpan);
      button.classList.remove('inv-card__btn--loading');

      setTimeout(restoreButton, 1500);
    })
    .catch(function(error) {
      const message = (error && (error.description || error.message)) || 'Error';
      while (button.firstChild) button.removeChild(button.firstChild);
      const errorSpan = document.createElement('span');
      errorSpan.textContent = message;
      button.appendChild(errorSpan);
      button.classList.remove('inv-card__btn--loading');

      setTimeout(restoreButton, 2000);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
