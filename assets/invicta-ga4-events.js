/**
 * Invicta GA4 Events v1.1
 * Tracks: page_view, view_item, view_item_list, add_to_cart, begin_checkout
 * Hooks into existing cart events from invicta-cart-api.js
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
    var cartUrl = ((window.routes && window.routes.cart_url) || '/cart') + '.js';
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
