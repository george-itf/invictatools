/**
 * Invicta Cross-Brand Comparison v1.0
 * ====================================
 * Modal with side-by-side spec comparison table.
 * Reads comparison_products metafield (JSON array of handles).
 * Fetches each product via /products/handle.js and renders a table.
 *
 * Metafield: custom.comparison_products
 */
(function() {
  'use strict';

  var modal = document.querySelector('[data-compare-modal]');
  var openBtns = document.querySelectorAll('[data-compare-open]');
  var closeBtns = modal ? modal.querySelectorAll('[data-compare-close]') : [];
  var body = modal ? modal.querySelector('[data-compare-body]') : null;
  var handlesJson = document.querySelector('[data-compare-handles-json]');

  if (!modal || !body || !handlesJson) return;

  var handles = [];
  try {
    var raw = JSON.parse(handlesJson.textContent);
    if (typeof raw === 'string') {
      handles = raw.replace(/[\[\]"]/g, '').split(',').map(function(s) { return s.trim(); }).filter(Boolean);
    } else if (Array.isArray(raw)) {
      handles = raw.map(function(s) { return String(s).trim(); }).filter(Boolean);
    }
  } catch (e) {
    return;
  }

  if (!handles.length) return;

  var pdpEl = document.querySelector(INVICTA_SELECTORS.vatRateHost);
  var vatDivisor = pdpEl ? 100 + (parseInt(pdpEl.dataset.vatRate, 10) || 20) : 120;
  var loaded = false;

  var formatMoney = window.invictaUtils.formatMoney;

  function exFromInc(pence) {
    return Math.round(pence * 100 / vatDivisor);
  }

  function fetchProduct(handle) {
    return fetch('/products/' + handle + '.js', { headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.ok ? r.json() : null; })
      .catch(function() { return null; });
  }

  var specRows = [
    { key: 'price', label: 'Price' },
    { key: 'voltage', label: 'Voltage', mf: 'voltage' },
    { key: 'no_load_speed', label: 'No-Load Speed', mf: 'no_load_speed' },
    { key: 'disc_diameter', label: 'Disc Diameter', mf: 'disc_diameter' },
    { key: 'weight_body_only', label: 'Weight (Body)', mf: 'weight_body_only' },
    { key: 'max_torque', label: 'Max Torque', mf: 'max_torque' },
    { key: 'motor_type', label: 'Motor Type', mf: 'motor_type' }
  ];

  function getMetafield(product, key) {
    if (!product.metafields) return '';
    var custom = product.metafields.custom;
    if (!custom) return '';
    var val = custom[key];
    return val || '';
  }

  function renderTable(currentProduct, compProducts) {
    var allProducts = [currentProduct].concat(compProducts);

    var html = '<div class="inv-pdp__compare-table-wrap"><table class="inv-pdp__compare-table">';

    // Header row with product images + titles
    html += '<thead><tr><th class="inv-pdp__compare-label-col"></th>';
    allProducts.forEach(function(p, i) {
      var isCurrent = i === 0;
      var img = p.featured_image || '';
      var imgTag = img ? '<img src="' + img.replace(/\.([a-z]+)\?/, '_160x160.$1?') + '" alt="" width="80" height="80" loading="lazy">' : '';
      html += '<th class="inv-pdp__compare-product-col' + (isCurrent ? ' inv-pdp__compare-product-col--current' : '') + '">';
      html += imgTag;
      html += '<span class="inv-pdp__compare-product-title">' + (p.title || '') + '</span>';
      if (!isCurrent) {
        html += '<a href="' + p.url + '" class="inv-pdp__compare-view-link">View product</a>';
      } else {
        html += '<span class="inv-pdp__compare-current-badge">This product</span>';
      }
      html += '</th>';
    });
    html += '</tr></thead>';

    // Spec rows
    html += '<tbody>';
    specRows.forEach(function(spec) {
      html += '<tr>';
      html += '<td class="inv-pdp__compare-label">' + spec.label + '</td>';
      allProducts.forEach(function(p, i) {
        var isCurrent = i === 0;
        var val = '';
        if (spec.key === 'price') {
          var variant = p.variants ? p.variants[0] : null;
          if (variant) {
            val = '<span data-price-inc>' + formatMoney(variant.price) + '</span>';
            val += '<span class="inv-vat--hidden" data-price-ex>' + formatMoney(exFromInc(variant.price)) + '</span>';
          }
        } else if (spec.mf) {
          val = getMetafield(p, spec.mf) || '\u2014';
        }
        html += '<td class="inv-pdp__compare-value' + (isCurrent ? ' inv-pdp__compare-value--current' : '') + '">' + val + '</td>';
      });
      html += '</tr>';
    });

    // Add to cart row for compared products
    html += '<tr><td class="inv-pdp__compare-label"></td>';
    allProducts.forEach(function(p, i) {
      if (i === 0) {
        html += '<td class="inv-pdp__compare-value inv-pdp__compare-value--current"></td>';
      } else {
        var variant = p.variants ? p.variants[0] : null;
        if (variant && variant.available) {
          html += '<td class="inv-pdp__compare-value"><button type="button" class="inv-pdp__compare-add" data-add-to-cart data-variant-id="' + variant.id + '" data-quantity="1">Add to Cart</button></td>';
        } else {
          html += '<td class="inv-pdp__compare-value"><span class="inv-pdp__compare-oos">Out of Stock</span></td>';
        }
      }
    });
    html += '</tr>';

    html += '</tbody></table></div>';
    return html;
  }

  function loadComparison() {
    if (loaded) return;
    loaded = true;

    // Fetch current product too (for consistent metafield access)
    var currentHandle = document.querySelector('.inv-pdp[data-product-handle]');
    var mainHandle = currentHandle ? currentHandle.dataset.productHandle : '';

    var allHandles = mainHandle ? [mainHandle].concat(handles) : handles;

    Promise.all(allHandles.map(fetchProduct)).then(function(products) {
      var validProducts = products.filter(Boolean);
      if (validProducts.length < 2) {
        body.innerHTML = '<p>Unable to load comparison data.</p>';
        return;
      }

      var currentProduct = validProducts[0];
      var compProducts = validProducts.slice(1);

      body.innerHTML = renderTable(currentProduct, compProducts);

      if (window.InvictaVAT && window.InvictaVAT.reapply) {
        window.InvictaVAT.reapply();
      }
    });
  }

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    loadComparison();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  openBtns.forEach(function(btn) {
    btn.addEventListener('click', openModal);
  });

  closeBtns.forEach(function(btn) {
    btn.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
})();
