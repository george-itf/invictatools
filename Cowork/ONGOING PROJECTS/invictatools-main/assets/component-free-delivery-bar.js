  /* Auto-update delivery bar when cart changes (for AJAX carts) */
  /* CX v1.0: Enhanced with animation classes and urgency states */
  (function() {
    var bar = document.querySelector('[data-delivery-bar]');
    if (!bar) return;
    var threshold = parseInt(bar.dataset.threshold, 10);

    /* CX v1.0: Enable smooth fill animation */
    bar.classList.add('inv-delivery-bar--animated');

    function updateBar(totalPence) {
      var fill = bar.querySelector('[data-delivery-fill]');
      var msgContainer = bar.querySelector('.inv-delivery-bar__message');
      if (!fill || !msgContainer) return;

      var qualified = totalPence >= threshold;
      var progress = qualified ? 100 : Math.min(Math.round((totalPence / threshold) * 100), 100);
      fill.style.width = progress + '%';

      /* CX v1.0: "Almost there" urgency pulse when 75-99% complete */
      if (progress >= 75 && progress < 100) {
        bar.classList.add('inv-delivery-bar--almost');
      } else {
        bar.classList.remove('inv-delivery-bar--almost');
      }

      var svgNS = 'http://www.w3.org/2000/svg';
      while (msgContainer.firstChild) msgContainer.removeChild(msgContainer.firstChild);

      if (qualified) {
        msgContainer.className = 'inv-delivery-bar__message inv-delivery-bar__message--qualified';
        var checkSvg = document.createElementNS(svgNS, 'svg');
        checkSvg.setAttribute('width', '18');
        checkSvg.setAttribute('height', '18');
        checkSvg.setAttribute('viewBox', '0 0 24 24');
        checkSvg.setAttribute('fill', 'none');
        checkSvg.setAttribute('stroke', 'currentColor');
        checkSvg.setAttribute('stroke-width', '2.5');
        checkSvg.setAttribute('stroke-linecap', 'round');
        checkSvg.setAttribute('stroke-linejoin', 'round');
        var cPath = document.createElementNS(svgNS, 'path');
        cPath.setAttribute('d', 'M22 11.08V12a10 10 0 1 1-5.93-9.14');
        checkSvg.appendChild(cPath);
        var cPoly = document.createElementNS(svgNS, 'polyline');
        cPoly.setAttribute('points', '22 4 12 14.01 9 11.01');
        checkSvg.appendChild(cPoly);
        msgContainer.appendChild(checkSvg);
        var qualSpan = document.createElement('span');
        qualSpan.textContent = 'You qualify for ';
        var qualStrong = document.createElement('strong');
        qualStrong.textContent = 'FREE next-day delivery!';
        qualSpan.appendChild(qualStrong);
        msgContainer.appendChild(qualSpan);
      } else {
        var remaining = ((threshold - totalPence) / 100).toFixed(2);
        msgContainer.className = 'inv-delivery-bar__message';
        var truckSvg = document.createElementNS(svgNS, 'svg');
        truckSvg.setAttribute('width', '16');
        truckSvg.setAttribute('height', '16');
        truckSvg.setAttribute('viewBox', '0 0 24 24');
        truckSvg.setAttribute('fill', 'none');
        truckSvg.setAttribute('stroke', 'currentColor');
        truckSvg.setAttribute('stroke-width', '2');
        truckSvg.setAttribute('stroke-linecap', 'round');
        truckSvg.setAttribute('stroke-linejoin', 'round');
        var tRect = document.createElementNS(svgNS, 'rect');
        tRect.setAttribute('x', '1'); tRect.setAttribute('y', '3');
        tRect.setAttribute('width', '15'); tRect.setAttribute('height', '13');
        truckSvg.appendChild(tRect);
        var tPoly = document.createElementNS(svgNS, 'polygon');
        tPoly.setAttribute('points', '16 8 20 8 23 11 23 16 16 16 16 8');
        truckSvg.appendChild(tPoly);
        var tC1 = document.createElementNS(svgNS, 'circle');
        tC1.setAttribute('cx', '5.5'); tC1.setAttribute('cy', '18.5'); tC1.setAttribute('r', '2.5');
        truckSvg.appendChild(tC1);
        var tC2 = document.createElementNS(svgNS, 'circle');
        tC2.setAttribute('cx', '18.5'); tC2.setAttribute('cy', '18.5'); tC2.setAttribute('r', '2.5');
        truckSvg.appendChild(tC2);
        msgContainer.appendChild(truckSvg);
        var awaySpan = document.createElement('span');
        awaySpan.appendChild(document.createTextNode('You\u2019re '));
        var amountStrong = document.createElement('strong');
        amountStrong.textContent = '\u00a3' + remaining;
        awaySpan.appendChild(amountStrong);
        awaySpan.appendChild(document.createTextNode(' away from '));
        var freeStrong = document.createElement('strong');
        freeStrong.textContent = 'FREE delivery!';
        awaySpan.appendChild(freeStrong);
        msgContainer.appendChild(awaySpan);
      }
    }

    /* Listen for Shopify cart update events —
       Intentionally persistent: the delivery bar is a page-level singleton
       that must stay responsive to cart changes for the entire session.
       The IIFE early-returns if [data-delivery-bar] is absent, so these
       listeners are only registered when the bar is actually in the DOM. */
    document.addEventListener('cart:updated', function(e) {
      if (e.detail && e.detail.total_price != null) {
        updateBar(e.detail.total_price);
      }
    });

    /* CX v1.0: Also listen for invicta cart events —
       Intentionally persistent: same rationale as above. */
    document.addEventListener('invicta:cart:updated', function(e) {
      if (e.detail && e.detail.cart && e.detail.cart.total_price != null) {
        updateBar(e.detail.cart.total_price);
      }
    });
  })();
