/**
 * Invicta Kit Builder v1.0
 * ========================
 * Drawer-based kit configurator for product pages.
 * Reads kit_options metafield JSON and renders selectable tier cards.
 * Adds all products in the selected tier to cart via InvictaCartAPI.
 *
 * Metafield: custom.kit_options (JSON)
 * Format:
 *   { "starter": { "label": "Starter Kit", "description": "...",
 *     "products": ["handle-1"], "save_text": "Save X" },
 *     "pro": { ... } }
 */
(function() {
  'use strict';

  var drawer = document.querySelector('[data-kit-drawer]');
  var openBtns = document.querySelectorAll('[data-kit-builder-open]');
  var closeBtns = drawer ? drawer.querySelectorAll('[data-kit-drawer-close]') : [];
  var tiersContainer = drawer ? drawer.querySelector('[data-kit-tiers]') : null;
  var addAllBtn = drawer ? drawer.querySelector('[data-kit-add-all]') : null;
  var optionsJson = document.querySelector('[data-kit-options-json]');

  if (!drawer || !tiersContainer || !optionsJson) return;

  var kitData = null;
  var selectedTierKey = null;
  var productCache = {};
  var tiersLoaded = false;

  try {
    kitData = JSON.parse(optionsJson.textContent);
  } catch (e) {
    return;
  }

  if (!kitData || typeof kitData !== 'object') return;

  var vatDivisor = 120;
  var pdpEl = document.querySelector('.inv-pdp[data-vat-rate]');
  if (pdpEl) {
    vatDivisor = 100 + (parseInt(pdpEl.dataset.vatRate, 10) || 20);
  }

  function formatMoney(cents) {
    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(cents);
    }
    return '\u00a3' + (cents / 100).toFixed(2);
  }

  function exFromInc(pence) {
    return Math.round(pence * 100 / vatDivisor);
  }

  /**
   * Fetch product data by handle via /products/handle.js
   */
  function fetchProduct(handle) {
    if (productCache[handle]) return Promise.resolve(productCache[handle]);
    return fetch('/products/' + handle + '.js', { headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        if (data) productCache[handle] = data;
        return data;
      })
      .catch(function() { return null; });
  }

  /**
   * Render a single tier card
   */
  function renderTier(key, tier, products) {
    var card = document.createElement('div');
    card.className = 'inv-pdp__kit-tier';
    card.dataset.tierKey = key;

    var totalPrice = 0;
    var thumbsHtml = '';

    products.forEach(function(p) {
      if (!p) return;
      var variant = p.variants[0];
      totalPrice += variant.price;
      var imgSrc = p.featured_image ? p.featured_image.replace(/\.([a-z]+)\?/, '_120x120.$1?') : '';
      if (imgSrc) {
        thumbsHtml += '<div class="inv-pdp__kit-tier-thumb"><img src="' + imgSrc + '" alt="' + (p.title || '').replace(/"/g, '&quot;') + '" width="48" height="48" loading="lazy"></div>';
      }
    });

    var totalEx = exFromInc(totalPrice);

    card.innerHTML =
      '<div class="inv-pdp__kit-tier-header">' +
        '<span class="inv-pdp__kit-tier-name">' + (tier.label || key) + '</span>' +
        (tier.save_text ? '<span class="inv-pdp__kit-tier-save">' + tier.save_text + '</span>' : '') +
      '</div>' +
      (tier.description ? '<p class="inv-pdp__kit-tier-desc">' + tier.description + '</p>' : '') +
      '<div class="inv-pdp__kit-tier-thumbs">' + thumbsHtml + '</div>' +
      '<div class="inv-pdp__kit-tier-price">' +
        '<span data-price-inc>Total: ' + formatMoney(totalPrice) + ' inc VAT</span>' +
        '<span class="inv-vat--hidden" data-price-ex>Total: ' + formatMoney(totalEx) + ' ex VAT</span>' +
      '</div>';

    card.addEventListener('click', function() {
      selectTier(key);
    });

    return card;
  }

  function selectTier(key) {
    selectedTierKey = key;
    var tiers = tiersContainer.querySelectorAll('.inv-pdp__kit-tier');
    tiers.forEach(function(t) {
      t.classList.toggle('inv-pdp__kit-tier--selected', t.dataset.tierKey === key);
    });
    if (addAllBtn) addAllBtn.disabled = false;
  }

  /**
   * Load all tier products and render cards
   */
  function loadTiers() {
    tiersLoaded = true;
    var tierKeys = Object.keys(kitData);
    var allHandles = [];

    tierKeys.forEach(function(key) {
      var tier = kitData[key];
      if (tier.products && Array.isArray(tier.products)) {
        tier.products.forEach(function(h) {
          if (allHandles.indexOf(h) === -1) allHandles.push(h);
        });
      }
    });

    Promise.all(allHandles.map(fetchProduct)).then(function() {
      tiersContainer.innerHTML = '';

      tierKeys.forEach(function(key) {
        var tier = kitData[key];
        if (!tier.products || !tier.products.length) return;

        var products = tier.products.map(function(h) {
          return productCache[h] || null;
        }).filter(Boolean);

        if (products.length === 0) return;

        tiersContainer.appendChild(renderTier(key, tier, products));
      });

      // Re-apply VAT mode on new elements
      if (window.InvictaVAT && window.InvictaVAT.reapply) {
        window.InvictaVAT.reapply();
      }
    });
  }

  /**
   * Add all products in selected tier to cart
   */
  function addKitToCart() {
    if (!selectedTierKey || !kitData[selectedTierKey]) return;
    var tier = kitData[selectedTierKey];
    var handles = tier.products || [];

    if (addAllBtn) {
      addAllBtn.disabled = true;
      addAllBtn.textContent = 'Adding...';
    }

    // Also add the main product
    var mainVariantInput = document.querySelector('.inv-pdp [data-variant-id]');
    var mainVariantId = mainVariantInput ? mainVariantInput.value : null;

    var addSequence = [];

    if (mainVariantId) {
      addSequence.push({ id: mainVariantId, quantity: 1 });
    }

    handles.forEach(function(handle) {
      var p = productCache[handle];
      if (p && p.variants && p.variants[0]) {
        addSequence.push({ id: p.variants[0].id, quantity: 1 });
      }
    });

    if (!window.InvictaCartAPI) {
      if (addAllBtn) {
        addAllBtn.textContent = 'Add Kit to Cart';
        addAllBtn.disabled = false;
      }
      return;
    }

    // Sequential adds to avoid race conditions
    var chain = Promise.resolve();
    addSequence.forEach(function(item) {
      chain = chain.then(function() {
        return window.InvictaCartAPI.add(item).catch(function() {
          // Continue even if one fails
        });
      });
    });

    chain.then(function() {
      if (addAllBtn) {
        addAllBtn.textContent = 'Added!';
        setTimeout(function() {
          addAllBtn.textContent = 'Add Kit to Cart';
          addAllBtn.disabled = false;
          closeDrawer();
        }, 1200);
      }
    });
  }

  function openDrawer() {
    drawer.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!tiersLoaded) loadTiers();
  }

  function closeDrawer() {
    drawer.hidden = true;
    document.body.style.overflow = '';
  }

  // Event bindings
  openBtns.forEach(function(btn) {
    btn.addEventListener('click', openDrawer);
  });

  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', closeDrawer);
  });

  if (addAllBtn) {
    addAllBtn.addEventListener('click', addKitToCart);
  }

  // Close on Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !drawer.hidden) {
      closeDrawer();
    }
  });

})();
