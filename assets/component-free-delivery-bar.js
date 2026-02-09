  /* Auto-update delivery bar when cart changes (for AJAX carts) */
  (function() {
    var bar = document.querySelector('[data-delivery-bar]');
    if (!bar) return;
    var threshold = parseInt(bar.dataset.threshold, 10);

    function updateBar(totalPence) {
      var fill = bar.querySelector('[data-delivery-fill]');
      var msgContainer = bar.querySelector('.inv-delivery-bar__message');
      if (!fill || !msgContainer) return;

      var qualified = totalPence >= threshold;
      var progress = qualified ? 100 : Math.min(Math.round((totalPence / threshold) * 100), 100);
      fill.style.width = progress + '%';

      if (qualified) {
        msgContainer.className = 'inv-delivery-bar__message inv-delivery-bar__message--qualified';
        msgContainer.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>You qualify for <strong>FREE next-day delivery!</strong></span>';
      } else {
        var remaining = ((threshold - totalPence) / 100).toFixed(2);
        msgContainer.className = 'inv-delivery-bar__message';
        msgContainer.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg><span>You\u2019re <strong>\u00a3' + remaining + '</strong> away from <strong>FREE delivery!</strong></span>';
      }
    }

    /* Listen for Shopify cart update events */
    document.addEventListener('cart:updated', function(e) {
      if (e.detail && e.detail.total_price != null) {
        updateBar(e.detail.total_price);
      }
    });
  })();
