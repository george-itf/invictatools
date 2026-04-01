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

  function fetchRecommendations() {
    if (!productId) {
      container.style.display = 'none';
      return;
    }

    fetch('/recommendations/products.json?product_id=' + productId + '&intent=complementary&limit=8')
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

    return fetch(url)
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
