/**
 * Invicta Product Comparison v1.0
 *
 * Lightweight comparison feature for tradespeople.
 * - localStorage-backed state (up to 4 products)
 * - Floating "Compare (X)" badge
 * - Drawer/modal with side-by-side product data
 * - Fetches product data via /products/{handle}.json with sessionStorage cache
 * - Dispatches CustomEvent 'invicta:compare:updated' on state changes
 *
 * Vanilla JS — no frameworks.
 */
(function () {
  'use strict';

  /* ================================================================
   * Configuration
   * ================================================================ */
  var STORAGE_KEY = 'invicta-compare';
  var CACHE_PREFIX = 'invicta-compare-cache:';
  var MAX_PRODUCTS = 4;
  var EVENT_NAME = 'invicta:compare:updated';

  /* ================================================================
   * State helpers
   * ================================================================ */
  function getCompareList() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveCompareList(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (_) { /* storage full */ }
    document.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { handles: list } }));
  }

  function addToCompare(handle) {
    var list = getCompareList();
    if (list.indexOf(handle) !== -1) return true;
    if (list.length >= MAX_PRODUCTS) return false;
    list.push(handle);
    saveCompareList(list);
    return true;
  }

  function removeFromCompare(handle) {
    var list = getCompareList();
    var idx = list.indexOf(handle);
    if (idx === -1) return;
    list.splice(idx, 1);
    saveCompareList(list);
  }

  function clearCompare() {
    saveCompareList([]);
  }

  function isInCompare(handle) {
    return getCompareList().indexOf(handle) !== -1;
  }

  /* ================================================================
   * Floating badge
   * ================================================================ */
  var badge = null;
  var maxMessage = null;

  function createBadge() {
    badge = document.createElement('button');
    badge.type = 'button';
    badge.className = 'inv-compare__badge';
    badge.setAttribute('aria-label', 'Open product comparison');
    badge.addEventListener('click', openDrawer);

    /* Max-products warning */
    maxMessage = document.createElement('div');
    maxMessage.className = 'inv-compare__max-msg';
    maxMessage.textContent = 'Remove a product to add another';
    maxMessage.setAttribute('role', 'alert');
    document.body.appendChild(maxMessage);

    document.body.appendChild(badge);
    updateBadge();
  }

  function updateBadge() {
    if (!badge) return;
    var count = getCompareList().length;
    if (count === 0) {
      badge.style.display = 'none';
    } else {
      badge.style.display = '';
      badge.textContent = 'Compare (' + count + ')';
    }
  }

  function showMaxMessage() {
    if (!maxMessage) return;
    maxMessage.classList.add('inv-compare__max-msg--visible');
    clearTimeout(maxMessage._hideTimer);
    maxMessage._hideTimer = setTimeout(function () {
      maxMessage.classList.remove('inv-compare__max-msg--visible');
    }, 2500);
  }

  /* ================================================================
   * Toggle buttons on product cards
   * ================================================================ */
  function syncAllToggles() {
    var toggles = document.querySelectorAll('[data-compare-toggle]');
    for (var i = 0; i < toggles.length; i++) {
      var handle = toggles[i].getAttribute('data-product-handle');
      var pressed = isInCompare(handle);
      toggles[i].setAttribute('aria-pressed', String(pressed));
      toggles[i].setAttribute('aria-label',
        pressed
          ? 'Remove from comparison'
          : 'Add to comparison'
      );
    }
  }

  function onToggleClick(e) {
    var btn = e.currentTarget;
    var handle = btn.getAttribute('data-product-handle');
    if (!handle) return;

    if (isInCompare(handle)) {
      removeFromCompare(handle);
    } else {
      var added = addToCompare(handle);
      if (!added) {
        showMaxMessage();
        return;
      }
    }
    syncAllToggles();
    updateBadge();
  }

  function bindToggles() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-compare-toggle]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      onToggleClick({ currentTarget: btn });
    });
  }

  /* ================================================================
   * Data fetching (with sessionStorage cache)
   * ================================================================ */
  function fetchProduct(handle) {
    var cacheKey = CACHE_PREFIX + handle;
    try {
      var cached = sessionStorage.getItem(cacheKey);
      if (cached) return Promise.resolve(JSON.parse(cached));
    } catch (_) {}

    return fetch('/products/' + handle + '.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var product = data.product;
        try {
          sessionStorage.setItem(cacheKey, JSON.stringify(product));
        } catch (_) {}
        return product;
      });
  }

  function fetchAllProducts(handles) {
    return Promise.all(handles.map(fetchProduct));
  }

  /* ================================================================
   * Drawer / Modal
   * ================================================================ */
  var overlay = null;
  var drawer = null;

  function createDrawer() {
    overlay = document.createElement('div');
    overlay.className = 'inv-compare__overlay';
    overlay.addEventListener('click', closeDrawer);

    drawer = document.createElement('div');
    drawer.className = 'inv-compare__drawer';
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-label', 'Product comparison');
    drawer.setAttribute('aria-modal', 'true');

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }

  function openDrawer() {
    var handles = getCompareList();
    if (handles.length === 0) return;

    if (!drawer) createDrawer();

    /* Show loading */
    drawer.innerHTML = '<div class="inv-compare__loading">Loading comparison\u2026</div>';
    overlay.classList.add('inv-compare__overlay--open');
    drawer.classList.add('inv-compare__drawer--open');
    document.body.style.overflow = 'hidden';

    fetchAllProducts(handles).then(function (products) {
      renderDrawerContent(products);
    }).catch(function () {
      drawer.innerHTML = '<div class="inv-compare__loading">Failed to load products. Please try again.</div>';
    });
  }

  function closeDrawer() {
    if (!drawer) return;
    overlay.classList.remove('inv-compare__overlay--open');
    drawer.classList.remove('inv-compare__drawer--open');
    document.body.style.overflow = '';
  }

  /* ================================================================
   * Render comparison content
   * ================================================================ */
  function renderDrawerContent(products) {
    var vatRate = (window.invictaConfig && window.invictaConfig.vatRate) || 20;
    var vatDivisor = 100 + vatRate;

    var html = '';

    /* Header */
    html += '<div class="inv-compare__header">';
    html += '<h2 class="inv-compare__title">Compare Products</h2>';
    html += '<div class="inv-compare__header-actions">';
    html += '<button type="button" class="inv-compare__clear" data-compare-clear>Clear All</button>';
    html += '<button type="button" class="inv-compare__close-btn" data-compare-close aria-label="Close comparison">';
    html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    html += '</button>';
    html += '</div>';
    html += '</div>';

    /* Grid */
    html += '<div class="inv-compare__grid inv-compare__grid--cols-' + products.length + '">';

    for (var i = 0; i < products.length; i++) {
      var p = products[i];
      var variant = p.variants && p.variants[0] ? p.variants[0] : {};
      var priceInc = variant.price ? (parseFloat(variant.price)).toFixed(2) : '0.00';
      var priceExPence = Math.round((parseFloat(variant.price || 0) * 100 * 100) / vatDivisor);
      var priceEx = (priceExPence / 100).toFixed(2);
      var available = variant.available !== false;
      var imgSrc = p.image ? p.image.src : '';

      /* Stock from tags */
      var tags = p.tags || [];
      var stockSource = 'invicta';
      for (var t = 0; t < tags.length; t++) {
        var tag = tags[t].toLowerCase().trim();
        if (tag === 'invicta-stock') { stockSource = 'invicta'; break; }
        if (tag === 'trend-stock' || tag === 'toolbank-stock' || tag === 'timco-stock' || tag === 'pdp-stock') {
          stockSource = 'supplier';
        }
      }

      var stockLabel, stockClass;
      if (!available) {
        stockLabel = 'Out of Stock'; stockClass = 'out';
      } else if (stockSource === 'supplier') {
        stockLabel = 'Available from Supplier'; stockClass = 'supplier';
      } else {
        stockLabel = 'In Stock'; stockClass = 'in-stock';
      }

      /* Metafields (custom namespace) */
      var meta = p.metafields || {};
      var custom = {};
      if (Array.isArray(meta)) {
        for (var m = 0; m < meta.length; m++) {
          if (meta[m].namespace === 'custom') {
            custom[meta[m].key] = meta[m].value;
          }
        }
      }

      html += '<div class="inv-compare__product" data-compare-handle="' + escapeAttr(p.handle) + '">';

      /* Remove button */
      html += '<button type="button" class="inv-compare__remove" data-compare-remove="' + escapeAttr(p.handle) + '" aria-label="Remove ' + escapeAttr(p.title) + '">';
      html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      html += '</button>';

      /* Image */
      if (imgSrc) {
        var imgSmall = imgSrc.replace(/\.([a-z]+)\?/, '_400x.$1?');
        html += '<a href="/products/' + escapeAttr(p.handle) + '" class="inv-compare__img-link">';
        html += '<img src="' + escapeAttr(imgSmall) + '" alt="' + escapeAttr(p.title) + '" class="inv-compare__img" loading="lazy">';
        html += '</a>';
      }

      /* Title */
      html += '<h3 class="inv-compare__product-title"><a href="/products/' + escapeAttr(p.handle) + '">' + escapeHtml(p.title) + '</a></h3>';

      /* Brand pill placeholder — rendered with vendor name */
      html += '<div class="inv-compare__brand" data-compare-vendor="' + escapeAttr(p.vendor || '') + '">';
      html += '<span class="inv-compare__vendor-text">' + escapeHtml(p.vendor || '') + '</span>';
      html += '</div>';

      /* Price */
      html += '<div class="inv-compare__price-block">';
      html += '<div data-price-inc>';
      html += '<span class="inv-compare__price">\u00a3' + priceInc + ' <small>inc VAT</small></span>';
      html += '<span class="inv-compare__price-alt">(\u00a3' + priceEx + ' ex)</span>';
      html += '</div>';
      html += '<div data-price-ex class="inv-vat--hidden">';
      html += '<span class="inv-compare__price">\u00a3' + priceEx + ' <small>ex VAT</small></span>';
      html += '<span class="inv-compare__price-alt">(\u00a3' + priceInc + ' inc)</span>';
      html += '</div>';
      html += '</div>';

      /* Stock */
      html += '<span class="inv-compare__stock inv-compare__stock--' + stockClass + '">' + stockLabel + '</span>';

      /* Specs table (from metafields if available) */
      var specs = [];
      if (custom.voltage) specs.push(['Voltage', custom.voltage]);
      if (custom.max_torque) specs.push(['Max Torque', custom.max_torque]);
      if (custom.motor_type) specs.push(['Motor Type', custom.motor_type]);
      if (custom.weight) specs.push(['Weight', custom.weight]);
      if (custom.warranty) specs.push(['Warranty', custom.warranty]);

      if (specs.length > 0) {
        html += '<table class="inv-compare__specs">';
        for (var s = 0; s < specs.length; s++) {
          html += '<tr><td class="inv-compare__spec-label">' + escapeHtml(specs[s][0]) + '</td>';
          html += '<td class="inv-compare__spec-value">' + escapeHtml(specs[s][1]) + '</td></tr>';
        }
        html += '</table>';
      }

      /* Add to cart */
      if (available && variant.id) {
        html += '<button type="button" class="inv-compare__atc" data-add-to-cart data-variant-id="' + variant.id + '" data-quantity="1">';
        html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>';
        html += ' Add to Cart</button>';
      } else {
        html += '<button type="button" class="inv-compare__atc inv-compare__atc--disabled" disabled>Out of Stock</button>';
      }

      html += '</div>';
    }

    html += '</div>';

    drawer.innerHTML = html;

    /* Bind drawer buttons */
    drawer.querySelectorAll('[data-compare-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var handle = btn.getAttribute('data-compare-remove');
        removeFromCompare(handle);
        syncAllToggles();
        updateBadge();
        var remaining = getCompareList();
        if (remaining.length === 0) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
    });

    var closeBtn = drawer.querySelector('[data-compare-close]');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    var clearBtn = drawer.querySelector('[data-compare-clear]');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        clearCompare();
        syncAllToggles();
        updateBadge();
        closeDrawer();
      });
    }

    /* Re-apply VAT mode */
    if (window.InvictaVAT && window.InvictaVAT.reapply) {
      window.InvictaVAT.reapply();
    }
  }

  /* ================================================================
   * Escape helpers
   * ================================================================ */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ================================================================
   * Keyboard: Escape closes drawer
   * ================================================================ */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('inv-compare__drawer--open')) {
      closeDrawer();
    }
  });

  /* ================================================================
   * Initialise
   * ================================================================ */
  function init() {
    bindToggles();
    createBadge();
    syncAllToggles();

    /* Re-sync when comparison updates (e.g. from another tab) */
    document.addEventListener(EVENT_NAME, function () {
      syncAllToggles();
      updateBadge();
    });

    /* Re-sync after collection page AJAX updates */
    document.addEventListener('invicta:collection:updated', function () {
      syncAllToggles();
    });

    /* Re-sync after Shopify section load (theme editor) */
    document.addEventListener('shopify:section:load', function () {
      syncAllToggles();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
