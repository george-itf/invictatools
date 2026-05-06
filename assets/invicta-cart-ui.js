/**
 * Invicta Cart UI v1.0
 * Consolidated cart handler, crosssell, and recommendations IIFEs.
 * Each section is self-contained and depends on window.InvictaCartAPI
 * (loaded separately from invicta-cart-api.js).
 */

// =============================================================================
// SECTION 1: Cart Handler
// =============================================================================

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

// =============================================================================
// SECTION 2: Cart Drawer Cross-Sell
// =============================================================================

/**
 * Cart Drawer Cross-Sell — Complementary Recommendations
 * Fetches product recommendations based on first cart item.
 * Falls back to a configured collection if API returns nothing.
 */
(function() {
  'use strict';

  var container = document.querySelector('[data-crosssell]');
  if (!container) return;

  var grid = container.querySelector('.inv-cart-crosssell__grid');
  var productId = container.dataset.firstProductId;
  var fallbackCollection = container.dataset.fallbackCollection || '';
  var moneyFormat = container.dataset.moneyFormat || '\u00a3{{amount}}';
  var vatRate = parseInt(container.dataset.vatRate || '20', 10);

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  function formatMoney(pence) {
    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(pence, moneyFormat);
    }
    return moneyFormat.replace('{{amount}}', (pence / 100).toFixed(2))
                       .replace('{{amount_no_decimals}}', Math.round(pence / 100))
                       .replace('{{amount_with_comma_separator}}', (pence / 100).toFixed(2).replace('.', ','));
  }

  function calcExVat(pence) {
    if (window.invictaVat && typeof window.invictaVat.exFromInc === 'function') {
      return window.invictaVat.exFromInc(pence);
    }
    var divisor = 100 + vatRate;
    return Math.round(pence * 100 / divisor);
  }

  function getCartProductIds() {
    var ids = [];
    document.querySelectorAll('[data-quantity-variant-id]').forEach(function(el) {
      var id = el.dataset.quantityVariantId;
      if (id) ids.push(id);
    });
    return ids;
  }

  function renderCards(products) {
    var cartVariantIds = getCartProductIds();
    var filtered = products.filter(function(p) {
      return !cartVariantIds.includes(String(p.variants[0].id));
    }).slice(0, 4);

    if (filtered.length === 0) {
      container.style.display = 'none';
      return;
    }

    grid.innerHTML = '';
    filtered.forEach(function(product) {
      var variant = product.variants[0];
      var price = variant.price;
      var exVat = calcExVat(price);
      var img = product.featured_image || product.images[0];
      var imgUrl = img ? (typeof img === 'string' ? img : img.src || img) : '';
      // Shopify CDN URLs need size suffix before the extension to get resized images
      if (imgUrl && imgUrl.indexOf('cdn.shopify.com') > -1) {
        imgUrl = imgUrl.replace(/(\.[a-z]+)\?/, '_240x240$1?');
        if (imgUrl.indexOf('_240x240') === -1) {
          imgUrl = imgUrl.replace(/\.([a-z]+)$/, '_240x240.$1');
        }
      }

      var safeTitle = escapeHtml(product.title);
      var card = document.createElement('a');
      card.href = product.url || '/products/' + product.handle;
      card.className = 'inv-cart-crosssell__item';
      card.setAttribute('role', 'listitem');
      card.innerHTML =
        '<div class="inv-cart-crosssell__item-img">' +
          '<img src="' + imgUrl + '" alt="' + safeTitle + '" loading="lazy" width="120" height="120">' +
        '</div>' +
        '<div class="inv-cart-crosssell__item-info">' +
          '<span class="inv-cart-crosssell__item-title">' + safeTitle + '</span>' +
          '<span class="inv-cart-crosssell__item-price" data-price-inc>' + formatMoney(price) + '</span>' +
          '<span class="inv-cart-crosssell__item-price inv-vat--hidden" data-price-ex>' + formatMoney(exVat) + ' ex VAT</span>' +
        '</div>' +
        '<button type="button" class="inv-cart-crosssell__add-btn" data-add-to-cart data-variant-id="' + variant.id + '" data-quantity="1" aria-label="Add ' + safeTitle + ' to cart">' +
          '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>' +
        '</button>';

      card.querySelector('.inv-cart-crosssell__add-btn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
      });

      grid.appendChild(card);
    });
  }

  function fetchWithTimeout(url, timeoutMs) {
    var controller = new AbortController();
    var id = setTimeout(function() { controller.abort(); }, timeoutMs);
    return fetch(url, { signal: controller.signal })
      .finally(function() { clearTimeout(id); });
  }

  function fetchRecommendations() {
    if (!productId) {
      container.style.display = 'none';
      return;
    }

    fetchWithTimeout('/recommendations/products.json?product_id=' + productId + '&intent=complementary&limit=8', 5000)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var products = data.products || [];
        if (products.length > 0) {
          renderCards(products);
        } else if (fallbackCollection) {
          return fetchFallback();
        } else {
          container.style.display = 'none';
        }
      })
      .catch(function() {
        if (fallbackCollection) {
          fetchFallback();
        } else {
          container.style.display = 'none';
        }
      });
  }

  function fetchFallback() {
    var url = fallbackCollection;
    if (url.indexOf('/collections/') === -1) {
      url = '/collections/' + url;
    }
    url += '/products.json?limit=8';

    return fetchWithTimeout(url, 5000)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var products = data.products || [];
        if (products.length > 0) {
          renderCards(products);
        } else {
          container.style.display = 'none';
        }
      })
      .catch(function() {
        container.style.display = 'none';
      });
  }

  fetchRecommendations();

  // invicta-cart-api.js fires both cart:item-added and invicta:cart:updated;
  // listening only to the latter avoids a redundant double-fetch.
  document.addEventListener('invicta:cart:updated', function() {
    var updatedContainer = document.querySelector('[data-crosssell]');
    if (updatedContainer && updatedContainer.dataset.firstProductId) {
      productId = updatedContainer.dataset.firstProductId;
    }
    fetchRecommendations();
  });
})();

// =============================================================================
// SECTION 3: Cart Recommendations
// =============================================================================

(function() {
  'use strict';

  var container = document.querySelector('[data-cart-recs]');
  if (!container) return;

  var productId = container.dataset.productId;
  var limit = container.dataset.limit || 6;
  var sectionId = container.closest('.shopify-section').id.replace('shopify-section-', '');

  if (!productId) {
    container.remove();
    return;
  }

  var url = '/recommendations/products?section_id=' + sectionId +
            '&product_id=' + productId +
            '&limit=' + limit +
            '&intent=complementary';

  fetch(url)
    .then(function(response) { return response.text(); })
    .then(function(html) {
      var temp = document.createElement('div');
      temp.innerHTML = html;
      var freshSection = temp.querySelector('[data-cart-recs]');

      if (freshSection && freshSection.querySelector('.inv-cart-recs__item')) {
        container.innerHTML = freshSection.innerHTML;
        container.classList.remove('inv-cart-recs--loading');
      } else {
        container.remove();
      }
    })
    .catch(function() {
      container.remove();
    });
})();
