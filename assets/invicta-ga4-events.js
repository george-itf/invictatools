/**
 * Invicta GA4 Events v1.2
 * Tracks: page_view, view_item, view_item_list, add_to_cart, begin_checkout,
 *         search, view_search_results, search_no_results, select_item,
 *         search_filter, search_sort
 * Hooks into existing cart events from invicta-cart-api.js and custom
 * invicta:search:* events from invicta-search-page.js.
 * Gated behind analytics consent (cookie banner + Shopify Customer Privacy API).
 */
(function() {
  'use strict';

  if (typeof gtag !== 'function') return;

  function hasAnalyticsConsent() {
    if (window.Shopify && window.Shopify.customerPrivacy) {
      var c = window.Shopify.customerPrivacy.currentVisitorConsent();
      return c && c.analytics === 'yes';
    }
    return localStorage.getItem('invicta-consent-analytics') === '1';
  }

  var pending = [];

  function send(name, params) {
    if (hasAnalyticsConsent()) {
      gtag('event', name, params);
    } else {
      pending.push({ name: name, params: params });
    }
  }

  document.addEventListener('invicta:consent:updated', function(e) {
    if (!(e && e.detail && e.detail.analytics)) return;
    while (pending.length) {
      var ev = pending.shift();
      gtag('event', ev.name, ev.params);
    }
  });

  /* -------------------------------------------------------
     PAGE VIEW — fires on every page
  ------------------------------------------------------- */
  /* gtag config already sends page_view; this handles SPA-style navigation */
  window.addEventListener('popstate', function() {
    send('page_view', {
      page_location: window.location.href,
      page_title: document.title
    });
  });

  /* -------------------------------------------------------
     VIEW ITEM — fires on PDP
  ------------------------------------------------------- */
  var productData = document.querySelector('[data-inv-ga4-product]');
  if (productData) {
    try {
      var p = JSON.parse(productData.textContent);
      send('view_item', {
        currency: 'GBP',
        value: p.price,
        items: [{
          item_id: p.id,
          item_name: p.title,
          item_brand: p.vendor,
          item_category: p.type,
          price: p.price,
          quantity: 1
        }]
      });
    } catch(e) { /* silent */ }
  }

  /* -------------------------------------------------------
     VIEW ITEM LIST — fires on collection pages
  ------------------------------------------------------- */
  var listData = document.querySelector('[data-inv-ga4-list]');
  if (listData) {
    try {
      var list = JSON.parse(listData.textContent);
      send('view_item_list', {
        item_list_id: list.id,
        item_list_name: list.name,
        items: list.items
      });
    } catch(e) { /* silent */ }
  }

  /* -------------------------------------------------------
     SEARCH — initial fire + AJAX updates
  ------------------------------------------------------- */
  function readSearchBlob() {
    var el = document.querySelector('[data-inv-ga4-search]');
    if (!el) return null;
    try { return JSON.parse(el.textContent); } catch (e) { return null; }
  }

  function emitSearchResultEvents(ctx) {
    if (!ctx || !ctx.performed) return;
    var term = ctx.term || '';
    var count = ctx.results_count || 0;
    if (count > 0) {
      send('view_search_results', { search_term: term, results_count: count });
    } else {
      send('search_no_results', { search_term: term });
    }
  }

  /* Initial load */
  var searchCtx = readSearchBlob();
  if (searchCtx && searchCtx.performed) {
    send('search', { search_term: searchCtx.term || '' });
    emitSearchResultEvents(searchCtx);
  }

  /* After any AJAX filter/sort/pagination update */
  document.addEventListener('invicta:search:updated', function(e) {
    var detail = (e && e.detail) || {};
    emitSearchResultEvents({
      performed: true,
      term: detail.term || '',
      results_count: detail.results_count || 0
    });
  });

  /* Filter interactions (checkbox + chip) */
  document.addEventListener('invicta:search:filter', function(e) {
    var d = (e && e.detail) || {};
    send('search_filter', {
      search_term: d.term || '',
      filter_type: d.filter_type || '',
      filter_value: d.filter_value || '',
      filter_source: d.source || '',
      active_filters_count: d.active_filters_count || 0
    });
  });

  /* Sort change */
  document.addEventListener('invicta:search:sort', function(e) {
    var d = (e && e.detail) || {};
    send('search_sort', {
      search_term: d.term || '',
      sort_value: d.sort_value || ''
    });
  });

  /* select_item — delegated click on PDP-bound anchors inside a search result.
     Intentionally ignores <button> clicks (ATC / quick-add) since those are
     covered by cart:item-added → add_to_cart. */
  document.addEventListener('click', function(e) {
    var li = e.target.closest('[data-ga4-item-id]');
    if (!li) return;
    var link = e.target.closest('a');
    if (!link) return;
    /* Scope to search SERP — avoid double-firing if collection ever reuses the attrs */
    if (!li.closest('#invicta-search')) return;

    var ctx = readSearchBlob() || {};
    var term = ctx.term || '';
    var price = parseFloat(li.dataset.ga4ItemPrice);
    send('select_item', {
      item_list_id: 'search_results',
      item_list_name: term ? ('Search: ' + term) : 'Search results',
      items: [{
        item_id: li.dataset.ga4ItemId,
        item_name: li.dataset.ga4ItemName,
        item_brand: li.dataset.ga4ItemBrand || '',
        item_category: li.dataset.ga4ItemCategory || '',
        price: isNaN(price) ? 0 : price,
        index: parseInt(li.dataset.ga4ItemIndex, 10) || 0
      }]
    });
  });

  /* -------------------------------------------------------
     ADD TO CART — hooks into invicta-cart-api.js events
  ------------------------------------------------------- */
  document.addEventListener('cart:item-added', function(e) {
    var item = e.detail && e.detail.item;
    if (!item) return;
    send('add_to_cart', {
      currency: 'GBP',
      value: (item.final_line_price || item.price) / 100,
      items: [{
        item_id: String(item.product_id),
        item_name: item.product_title,
        item_brand: item.vendor,
        item_variant: item.variant_title,
        price: item.price / 100,
        quantity: item.quantity
      }]
    });
  });

  /* -------------------------------------------------------
     BEGIN CHECKOUT — fires when checkout button is clicked
  ------------------------------------------------------- */
  document.addEventListener('click', function(e) {
    var btn = e.target.closest('[name="checkout"], #CartDrawer-Checkout, #checkout');
    if (!btn) return;

    /* Skip the fetch entirely if no analytics consent */
    if (!hasAnalyticsConsent()) return;

    /* Fetch current cart for checkout event data */
    var cartUrl = INVICTA_ROUTES.cart;
    fetch(cartUrl, { headers: { 'Accept': 'application/json' } })
      .then(function(r) { return r.json(); })
      .then(function(cart) {
        send('begin_checkout', {
          currency: 'GBP',
          value: cart.total_price / 100,
          items: cart.items.map(function(item, i) {
            return {
              item_id: String(item.product_id),
              item_name: item.product_title,
              item_brand: item.vendor,
              price: item.price / 100,
              quantity: item.quantity,
              index: i
            };
          })
        });
      })
      .catch(function() { /* silent — don't block checkout */ });
  });
})();
