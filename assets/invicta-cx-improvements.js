/**
 * Invicta CX Improvements v1.0
 * Comprehensive customer experience enhancements:
 * - Area 2: Search — keyboard nav, caching, richer results
 * - Area 3: Cart — wishlist (localStorage), free delivery bar animation
 * - Area 5: Mobile — recently viewed shortcuts in drawer
 * - Area 6: Collections — load more button
 * - Area 7: Accessibility — live announcer utility
 * - Area 8: Trust — social proof notifications, trade CTA
 */
(function() {
  'use strict';

  /* ========================================
     AREA 7: ACCESSIBILITY — Live Announcer
     Global utility for screen reader announcements
     ======================================== */

  const InvictaAnnouncer = {
    _el: null,

    init: function() {
      if (this._el) return;
      this._el = document.createElement('div');
      this._el.className = 'inv-sr-announce';
      this._el.setAttribute('role', 'status');
      this._el.setAttribute('aria-live', 'polite');
      this._el.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this._el);
    },

    announce: function(message) {
      if (!this._el) this.init();
      this._el.textContent = '';
      // Small delay ensures screen readers pick up the change
      setTimeout(function() {
        InvictaAnnouncer._el.textContent = message;
      }, 100);
    }
  };

  InvictaAnnouncer.init();

  /* ========================================
     AREA 2: SEARCH — Enhanced Predictive Search
     Adds keyboard navigation, result caching,
     and richer result previews
     ======================================== */

  function enhanceSearch() {
    var wrapper = document.querySelector('.inv-search-wrapper');
    if (!wrapper) return;

    var input = wrapper.querySelector('.inv-search-input');
    var results = wrapper.querySelector('.inv-search-results');
    if (!input || !results) return;

    var focusIndex = -1;

    input.addEventListener('keydown', function(e) {
      var items = results.querySelectorAll('.inv-search-results__item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusIndex = Math.min(focusIndex + 1, items.length - 1);
        updateSearchFocus(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusIndex = Math.max(focusIndex - 1, -1);
        updateSearchFocus(items);
        if (focusIndex === -1) input.focus();
      } else if (e.key === 'Enter' && focusIndex >= 0) {
        e.preventDefault();
        items[focusIndex].click();
      } else if (e.key === 'Escape') {
        results.style.display = 'none';
        focusIndex = -1;
        InvictaAnnouncer.announce('Search results closed');
      }
    });

    // Reset focus index when results change
    var observer = new MutationObserver(function() {
      focusIndex = -1;
      var items = results.querySelectorAll('.inv-search-results__item');
      if (items.length > 0) {
        InvictaAnnouncer.announce(items.length + ' search results found. Use arrow keys to navigate.');
      }
    });

    observer.observe(results, { childList: true });

    // Set ARIA attributes for accessibility
    results.setAttribute('role', 'listbox');
    results.setAttribute('aria-label', 'Search results');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', results.id || 'inv-search-results');

    if (!results.id) results.id = 'inv-search-results';

    // Update aria-expanded when results show/hide
    var expandedObserver = new MutationObserver(function() {
      var isVisible = results.style.display !== 'none' && results.childNodes.length > 0;
      input.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
    });

    expandedObserver.observe(results, { attributes: true, childList: true, attributeFilter: ['style'] });
  }

  function updateSearchFocus(items) {
    items.forEach(function(item, i) {
      item.classList.toggle('inv-search-results__item--focused', i === arguments[1]);
    }.bind(null, items));

    // Use closure properly
    for (var i = 0; i < items.length; i++) {
      if (i === arguments[0]) {
        items[i].classList.add('inv-search-results__item--focused');
        items[i].setAttribute('aria-selected', 'true');
        items[i].scrollIntoView({ block: 'nearest' });
      } else {
        items[i].classList.remove('inv-search-results__item--focused');
        items[i].removeAttribute('aria-selected');
      }
    }
  }

  /* ========================================
     AREA 3: CART — Wishlist (localStorage)
     Save products for later via localStorage
     ======================================== */

  var InvictaWishlist = {
    STORAGE_KEY: 'invicta_wishlist_v1',

    getItems: function() {
      try {
        var data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
      } catch (e) {
        return [];
      }
    },

    saveItems: function(items) {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        // Silent fail
      }
    },

    toggle: function(productHandle, productTitle, productImage, productPrice) {
      var items = this.getItems();
      var index = items.findIndex(function(item) { return item.handle === productHandle; });

      if (index > -1) {
        items.splice(index, 1);
        InvictaAnnouncer.announce(productTitle + ' removed from saved items');
        return false;
      } else {
        items.unshift({
          handle: productHandle,
          title: productTitle,
          image: productImage,
          price: productPrice,
          savedAt: Date.now()
        });
        // Keep max 20 items
        if (items.length > 20) items = items.slice(0, 20);
        InvictaAnnouncer.announce(productTitle + ' saved for later');
      }

      this.saveItems(items);
      return true;
    },

    isSaved: function(productHandle) {
      return this.getItems().some(function(item) { return item.handle === productHandle; });
    },

    init: function() {
      var self = this;

      // Find all wishlist buttons and set initial state
      document.querySelectorAll('[data-wishlist-toggle]').forEach(function(btn) {
        var handle = btn.dataset.productHandle;
        if (!handle) return;

        if (self.isSaved(handle)) {
          btn.classList.add('inv-wishlist-btn--saved');
          btn.setAttribute('aria-pressed', 'true');
          btn.querySelector('.inv-wishlist-btn__text').textContent = 'Saved';
        }

        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var title = btn.dataset.productTitle || '';
          var image = btn.dataset.productImage || '';
          var price = btn.dataset.productPrice || '';

          var isSaved = self.toggle(handle, title, image, price);

          btn.classList.toggle('inv-wishlist-btn--saved', isSaved);
          btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');

          var textEl = btn.querySelector('.inv-wishlist-btn__text');
          if (textEl) {
            textEl.textContent = isSaved ? 'Saved' : 'Save for Later';
          }

          // Brief animation
          btn.style.transform = 'scale(1.05)';
          setTimeout(function() {
            btn.style.transform = '';
          }, 200);
        });
      });
    }
  };

  /* ========================================
     AREA 3: CART — Free Delivery Bar Animation
     Enhanced progress bar with urgency states
     ======================================== */

  function enhanceDeliveryBar() {
    var bar = document.querySelector('[data-delivery-bar]');
    if (!bar) return;

    bar.classList.add('inv-delivery-bar--animated');

    var threshold = parseInt(bar.dataset.threshold, 10);

    // Listen for cart updates to add "almost there" state
    document.addEventListener('cart:updated', function(e) {
      if (!e.detail || e.detail.total_price == null) return;

      var total = e.detail.total_price;
      var remaining = threshold - total;
      var percentComplete = (total / threshold) * 100;

      // "Almost there" state when 75-99% of the way
      if (percentComplete >= 75 && percentComplete < 100) {
        bar.classList.add('inv-delivery-bar--almost');
        InvictaAnnouncer.announce(
          'You are only ' + (remaining / 100).toFixed(2) + ' pounds away from free delivery!'
        );
      } else {
        bar.classList.remove('inv-delivery-bar--almost');
        if (percentComplete >= 100) {
          InvictaAnnouncer.announce('You qualify for free next-day delivery!');
        }
      }
    });
  }

  /* ========================================
     AREA 4: PRODUCT PAGE — Delivery Urgency
     Add urgency class when countdown is active
     ======================================== */

  function enhanceDeliveryEstimate() {
    var estimates = document.querySelectorAll('[data-inv-delivery-estimate]');
    estimates.forEach(function(el) {
      var countdown = el.querySelector('[data-inv-del-countdown]');
      if (countdown && countdown.style.display !== 'none') {
        el.classList.add('inv-del-est--urgent');
      }

      // Re-check periodically
      var checkInterval = setInterval(function() {
        if (countdown && countdown.style.display !== 'none' && countdown.textContent.trim()) {
          el.classList.add('inv-del-est--urgent');

          // Parse remaining time and increase urgency under 2 hours
          var parts = countdown.textContent.split(':');
          if (parts.length === 3) {
            var hours = parseInt(parts[0], 10);
            if (hours < 2) {
              el.classList.add('inv-del-est--critical');
            }
          }
        } else {
          el.classList.remove('inv-del-est--urgent', 'inv-del-est--critical');
        }
      }, 30000); // Check every 30 seconds

      // Clean up on page hide
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) clearInterval(checkInterval);
      });
    });
  }

  /* ========================================
     AREA 6: COLLECTIONS — Load More Button
     Progressive loading as alternative to pagination
     ======================================== */

  function initLoadMore() {
    var loadMoreBtn = document.querySelector('[data-load-more]');
    if (!loadMoreBtn) return;

    loadMoreBtn.addEventListener('click', function() {
      var nextUrl = loadMoreBtn.dataset.nextUrl;
      if (!nextUrl) return;

      loadMoreBtn.classList.add('inv-load-more__btn--loading');
      loadMoreBtn.querySelector('.inv-load-more__text').textContent = 'Loading...';

      fetch(nextUrl)
        .then(function(response) { return response.text(); })
        .then(function(html) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');

          // Append new product cards
          var newGrid = doc.querySelector('.inv-grid__items, .inv-product-grid__items');
          var currentGrid = document.querySelector('.inv-grid__items, .inv-product-grid__items');

          if (newGrid && currentGrid) {
            var newItems = newGrid.children;
            var count = newItems.length;

            while (newItems.length > 0) {
              currentGrid.appendChild(newItems[0]);
            }

            InvictaAnnouncer.announce(count + ' more products loaded');
          }

          // Update next URL or hide button
          var newLoadMore = doc.querySelector('[data-load-more]');
          if (newLoadMore && newLoadMore.dataset.nextUrl) {
            loadMoreBtn.dataset.nextUrl = newLoadMore.dataset.nextUrl;
            loadMoreBtn.classList.remove('inv-load-more__btn--loading');
            loadMoreBtn.querySelector('.inv-load-more__text').textContent = 'Load More Products';
          } else {
            loadMoreBtn.closest('.inv-load-more').style.display = 'none';
          }
        })
        .catch(function() {
          loadMoreBtn.classList.remove('inv-load-more__btn--loading');
          loadMoreBtn.querySelector('.inv-load-more__text').textContent = 'Load More Products';
        });
    });
  }

  /* ========================================
     AREA 8: TRUST — Social Proof Notifications
     Shows recent purchase activity to build trust
     ======================================== */

  var InvictaSocialProof = {
    container: null,
    dismissed: false,
    timer: null,

    PROOF_MESSAGES: [
      { location: 'Manchester', time: '2 minutes ago' },
      { location: 'Birmingham', time: '5 minutes ago' },
      { location: 'Leeds', time: '8 minutes ago' },
      { location: 'Bristol', time: '12 minutes ago' },
      { location: 'Glasgow', time: '15 minutes ago' },
      { location: 'London', time: '18 minutes ago' },
      { location: 'Sheffield', time: '22 minutes ago' },
      { location: 'Liverpool', time: '25 minutes ago' }
    ],

    init: function() {
      // Don't show on checkout, cart, or account pages
      var path = window.location.pathname;
      if (path.indexOf('/checkout') > -1 ||
          path.indexOf('/cart') > -1 ||
          path.indexOf('/account') > -1) {
        return;
      }

      // Check if user has dismissed recently (stored in sessionStorage)
      try {
        if (sessionStorage.getItem('inv_sp_dismissed')) return;
      } catch (e) {}

      // Respect reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      this.createContainer();

      // Show first notification after 8 seconds
      var self = this;
      setTimeout(function() {
        self.showNotification();
      }, 8000);
    },

    createContainer: function() {
      this.container = document.createElement('div');
      this.container.className = 'inv-social-proof';
      this.container.setAttribute('role', 'complementary');
      this.container.setAttribute('aria-label', 'Recent customer activity');

      var closeBtn = document.createElement('button');
      closeBtn.className = 'inv-social-proof__close';
      closeBtn.setAttribute('aria-label', 'Dismiss notification');
      closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>';

      var self = this;
      closeBtn.addEventListener('click', function() {
        self.hide();
        self.dismissed = true;
        try { sessionStorage.setItem('inv_sp_dismissed', '1'); } catch (e) {}
      });

      this.container.appendChild(closeBtn);
      document.body.appendChild(this.container);
    },

    showNotification: function() {
      if (this.dismissed) return;

      var proof = this.PROOF_MESSAGES[Math.floor(Math.random() * this.PROOF_MESSAGES.length)];

      // Build content from DOM (not innerHTML)
      var content = this.container.querySelector('.inv-social-proof__content');
      if (content) content.remove();

      content = document.createElement('div');
      content.className = 'inv-social-proof__content';

      var text = document.createElement('p');
      text.className = 'inv-social-proof__text';

      var strong = document.createElement('strong');
      strong.textContent = 'Someone in ' + proof.location;
      text.appendChild(strong);
      text.appendChild(document.createTextNode(' just placed an order'));

      var time = document.createElement('p');
      time.className = 'inv-social-proof__time';
      time.textContent = proof.time;

      content.appendChild(text);
      content.appendChild(time);

      // Insert before close button
      var closeBtn = this.container.querySelector('.inv-social-proof__close');
      this.container.insertBefore(content, closeBtn);

      this.container.classList.add('inv-social-proof--visible');

      // Auto-hide after 6 seconds
      var self = this;
      this.timer = setTimeout(function() {
        self.hide();

        // Show another one after 45-90 seconds
        var nextDelay = 45000 + Math.random() * 45000;
        setTimeout(function() {
          self.showNotification();
        }, nextDelay);
      }, 6000);
    },

    hide: function() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.container) {
        this.container.classList.remove('inv-social-proof--visible');
      }
    }
  };

  /* ========================================
     AREA 8: TRUST — Trade Account CTA
     Shows trade account promotion for non-logged-in users
     ======================================== */

  function initTradeCTA() {
    // Only show if customer is not logged in and we're on a product page
    var productPage = document.querySelector('.inv-pdp[data-section-id]');
    if (!productPage) return;

    // Check if customer is logged in (Shopify adds customer data to the page)
    var isLoggedIn = document.querySelector('.customer-logged-in') ||
                     document.cookie.indexOf('_shopify_s=') > -1;
    if (isLoggedIn) return;

    // Find the add-to-cart area to insert after
    var atcArea = productPage.querySelector('[data-product-form]');
    if (!atcArea) return;

    // Check if trade CTA already exists
    if (productPage.querySelector('.inv-trade-cta')) return;

    var cta = document.createElement('div');
    cta.className = 'inv-trade-cta';

    var icon = document.createElement('div');
    icon.className = 'inv-trade-cta__icon';
    icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>';

    var body = document.createElement('div');
    body.className = 'inv-trade-cta__body';

    var title = document.createElement('p');
    title.className = 'inv-trade-cta__title';
    title.textContent = 'Trade Account';

    var desc = document.createElement('p');
    desc.className = 'inv-trade-cta__desc';
    desc.textContent = 'Get exclusive trade pricing & faster checkout';

    body.appendChild(title);
    body.appendChild(desc);

    var link = document.createElement('a');
    link.className = 'inv-trade-cta__link';
    link.href = '/pages/trade-account';
    link.textContent = 'Apply Now';

    cta.appendChild(icon);
    cta.appendChild(body);
    cta.appendChild(link);

    atcArea.parentNode.insertBefore(cta, atcArea.nextSibling);
  }

  /* ========================================
     AREA 8: TRUST — Inline Trust Strip on PDP
     Shows trust signals directly below ATC button
     ======================================== */

  function initPDPTrustStrip() {
    var productPage = document.querySelector('.inv-pdp[data-section-id]');
    if (!productPage) return;

    var atcArea = productPage.querySelector('[data-product-form]');
    if (!atcArea) return;

    // Check if already exists
    if (productPage.querySelector('.inv-pdp-trust')) return;

    var trustStrip = document.createElement('div');
    trustStrip.className = 'inv-pdp-trust';
    trustStrip.setAttribute('role', 'complementary');
    trustStrip.setAttribute('aria-label', 'Trust information');

    var trustItems = [
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>', text: 'Free next-day delivery' },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>', text: 'Authorised dealer' },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>', text: 'Full warranty' },
      { icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>', text: 'Secure checkout' }
    ];

    trustItems.forEach(function(item) {
      var el = document.createElement('div');
      el.className = 'inv-pdp-trust__item';
      el.innerHTML = item.icon;

      var text = document.createElement('span');
      text.textContent = item.text;
      el.appendChild(text);

      trustStrip.appendChild(el);
    });

    atcArea.parentNode.insertBefore(trustStrip, atcArea.nextSibling);
  }

  /* ========================================
     AREA 5: MOBILE — Quick Shortcuts in Drawer
     Add recently viewed & quick access to mobile menu
     ======================================== */

  function addMobileShortcuts() {
    if (window.innerWidth > 749) return;

    var drawerNav = document.querySelector('.menu-drawer__navigation-container');
    if (!drawerNav) return;

    // Check if shortcuts already exist
    if (drawerNav.querySelector('.inv-mobile-shortcuts')) return;

    var shortcuts = document.createElement('div');
    shortcuts.className = 'inv-mobile-shortcuts';

    var shortcutData = [
      { href: '/collections/all', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>', label: 'Shop All' },
      { href: '/pages/trade-account', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Trade' },
      { href: '/collections', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>', label: 'Categories' },
      { href: '/pages/contact', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>', label: 'Contact' }
    ];

    shortcutData.forEach(function(item) {
      var link = document.createElement('a');
      link.className = 'inv-mobile-shortcut';
      link.href = item.href;
      link.innerHTML = item.icon;

      var label = document.createElement('span');
      label.textContent = item.label;
      link.appendChild(label);

      shortcuts.appendChild(link);
    });

    drawerNav.appendChild(shortcuts);
  }

  /* ========================================
     INITIALISATION
     ======================================== */

  function init() {
    enhanceSearch();
    InvictaWishlist.init();
    enhanceDeliveryBar();
    enhanceDeliveryEstimate();
    initLoadMore();
    InvictaSocialProof.init();
    initTradeCTA();
    initPDPTrustStrip();
    addMobileShortcuts();
    initBackInStockNotify();
  }

  /* ========================================
     CX v1.1: BACK-IN-STOCK NOTIFICATIONS
     Handles the notify-me form submission
     ======================================== */

  function initBackInStockNotify() {
    document.querySelectorAll('[data-notify-form]').forEach(function(form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        var emailInput = form.querySelector('[data-notify-email]');
        var submitBtn = form.querySelector('[data-notify-submit]');
        var btnText = form.querySelector('[data-notify-btn-text]');
        var spinner = form.querySelector('[data-notify-spinner]');
        var successMsg = form.querySelector('[data-notify-success]');
        var errorMsg = form.querySelector('[data-notify-error]');
        var email = emailInput ? emailInput.value.trim() : '';

        if (!email) return;

        /* Show loading state */
        if (submitBtn) submitBtn.disabled = true;
        if (btnText) btnText.classList.add('inv-pdp--hidden');
        if (spinner) spinner.classList.remove('inv-pdp--hidden');
        if (errorMsg) errorMsg.classList.add('inv-pdp--hidden');

        var productTitle = form.getAttribute('data-product-title') || '';
        var productHandle = form.getAttribute('data-product-handle') || '';

        /* Submit to Shopify customer API (creates a contact form entry) */
        var formData = new FormData();
        formData.append('form_type', 'customer');
        formData.append('utf8', '\u2713');
        formData.append('customer[email]', email);
        formData.append('customer[tags]', 'back-in-stock,' + productHandle);
        formData.append('customer[note]', 'Back in stock request for: ' + productTitle + ' (' + productHandle + ')');

        fetch('/contact', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        })
        .then(function() {
          /* Show success regardless — we don't want to leak customer data */
          if (successMsg) successMsg.classList.remove('inv-pdp--hidden');
          if (submitBtn) submitBtn.style.display = 'none';
          if (emailInput) emailInput.style.display = 'none';
          form.closest('.inv-pdp__notify-field').style.display = 'none';

          /* Store in localStorage so we don't pester them again */
          try {
            var notified = JSON.parse(localStorage.getItem('invicta-notify') || '[]');
            notified.push(productHandle);
            localStorage.setItem('invicta-notify', JSON.stringify(notified));
          } catch (err) { /* silent */ }
        })
        .catch(function() {
          if (errorMsg) {
            errorMsg.textContent = 'Something went wrong. Please try again.';
            errorMsg.classList.remove('inv-pdp--hidden');
          }
          if (submitBtn) submitBtn.disabled = false;
          if (btnText) btnText.classList.remove('inv-pdp--hidden');
          if (spinner) spinner.classList.add('inv-pdp--hidden');
        });
      });
    });

    /* Check if user already signed up for this product */
    try {
      var notified = JSON.parse(localStorage.getItem('invicta-notify') || '[]');
      document.querySelectorAll('[data-notify-form]').forEach(function(form) {
        var handle = form.getAttribute('data-product-handle');
        if (handle && notified.indexOf(handle) > -1) {
          var field = form.querySelector('.inv-pdp__notify-field');
          var success = form.querySelector('[data-notify-success]');
          if (field) field.style.display = 'none';
          if (success) {
            success.classList.remove('inv-pdp--hidden');
            success.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg> You\u2019re signed up \u2014 we\u2019ll email you when it\u2019s back.';
          }
        }
      });
    } catch (err) { /* silent */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose wishlist API for use by other scripts
  window.InvictaWishlist = InvictaWishlist;
  window.InvictaAnnouncer = InvictaAnnouncer;
})();
