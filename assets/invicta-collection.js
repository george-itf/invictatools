/**
 * Invicta Collection v9.x — drawer, scroll FX, drag-to-dismiss.
 * Filtering / sorting / pagination AJAX is handled by invicta-collection-ajax.js.
 *
 * init() is idempotent and re-called by the AJAX layer after each section
 * swap so drawer handlers survive innerHTML replacement.
 */
(function () {
  'use strict';

  var state = {
    lastFocused: null,
    scrollY: 0
  };

  function openDrawer() {
    var drawer = document.getElementById('InvDrawer');
    var overlay = document.getElementById('InvDrawerOverlay');
    var filterToggle = document.getElementById('InvFilterToggle');
    var drawerClose = document.getElementById('InvDrawerClose');
    if (!drawer || !overlay) return;
    state.lastFocused = document.activeElement;
    state.scrollY = window.scrollY;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.classList.add('inv-drawer-open');
    document.body.style.top = '-' + state.scrollY + 'px';
    if (filterToggle) filterToggle.setAttribute('aria-expanded', 'true');
    if (drawerClose) drawerClose.focus();
  }

  function closeDrawer() {
    var drawer = document.getElementById('InvDrawer');
    var overlay = document.getElementById('InvDrawerOverlay');
    var filterToggle = document.getElementById('InvFilterToggle');
    if (!drawer || !overlay) return;
    drawer.classList.remove('is-open');
    drawer.style.transform = '';
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-visible');
    document.body.classList.remove('inv-drawer-open');
    document.body.style.top = '';
    window.scrollTo(0, state.scrollY);
    if (filterToggle) filterToggle.setAttribute('aria-expanded', 'false');
    if (state.lastFocused && document.body.contains(state.lastFocused)) {
      state.lastFocused.focus();
    }
    state.lastFocused = null;
  }

  function initDragDismiss() {
    var drawer = document.getElementById('InvDrawer');
    var overlay = document.getElementById('InvDrawerOverlay');
    var handle = document.getElementById('InvDrawerHandle');
    if (!drawer || !handle) return;
    var startY = 0;
    var currentY = 0;
    var isDragging = false;
    var DISMISS_THRESHOLD = 120;

    handle.addEventListener('touchstart', function (e) {
      if (!drawer.classList.contains('is-open')) return;
      isDragging = true;
      startY = e.touches[0].clientY;
      currentY = startY;
      drawer.style.transition = 'none';
    }, { passive: true });

    handle.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      currentY = e.touches[0].clientY;
      var deltaY = Math.max(0, currentY - startY);
      drawer.style.transform = 'translateY(' + deltaY + 'px)';
      if (overlay) overlay.style.opacity = Math.max(0, 1 - deltaY / 300);
    }, { passive: false });

    handle.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      var deltaY = currentY - startY;
      drawer.style.transition = '';
      if (overlay) {
        overlay.style.opacity = '';
        overlay.style.transition = '';
      }
      if (deltaY > DISMISS_THRESHOLD) {
        closeDrawer();
      } else {
        drawer.style.transform = 'translateY(0)';
      }
    }, { passive: true });
  }

  function init() {
    var drawer = document.getElementById('InvDrawer');
    var overlay = document.getElementById('InvDrawerOverlay');
    var drawerClose = document.getElementById('InvDrawerClose');
    var filterToggle = document.getElementById('InvFilterToggle');
    var floatingFilter = document.getElementById('InvFloatingFilter');
    var scrollTopBtn = document.getElementById('InvScrollTop');

    if (filterToggle) {
      filterToggle.addEventListener('click', function (e) {
        e.preventDefault();
        openDrawer();
      });
    }
    if (floatingFilter) {
      floatingFilter.addEventListener('click', function (e) {
        e.preventDefault();
        openDrawer();
      });
    }
    if (drawerClose) {
      drawerClose.addEventListener('click', function (e) {
        e.preventDefault();
        closeDrawer();
      });
    }
    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    initDragDismiss();

    /* Restore drawer open state if body flag survived a section swap. */
    if (drawer && document.body.classList.contains('inv-drawer-open')) {
      drawer.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      if (overlay) overlay.classList.add('is-visible');
      if (filterToggle) filterToggle.setAttribute('aria-expanded', 'true');
    }
  }

  /* Document-level listeners — bound ONCE, survive every section swap. */

  document.addEventListener('keydown', function (e) {
    var drawer = document.getElementById('InvDrawer');
    if (!drawer || !drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (e.key === 'Tab') {
      var focusable = drawer.querySelectorAll(
        'button, [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  var ticking = false;
  var heroBottom = 300;
  function refreshHeroBottom() {
    var hero = document.querySelector('.inv-hero, .inv-brand-hero');
    heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 300;
  }
  function handleScroll() {
    var floatingFilter = document.getElementById('InvFloatingFilter');
    var scrollTopBtn = document.getElementById('InvScrollTop');
    var scrollY = window.scrollY;
    if (floatingFilter) floatingFilter.classList.toggle('is-visible', scrollY > heroBottom);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('is-visible', scrollY > 400);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', refreshHeroBottom, { passive: true });

  /* Initial setup on page load: ensure closed drawer + run init. */
  (function () {
    var drawer = document.getElementById('InvDrawer');
    var overlay = document.getElementById('InvDrawerOverlay');
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.classList.remove('inv-drawer-open');
    document.body.style.top = '';
  })();

  refreshHeroBottom();
  handleScroll();
  init();

  window.InvCollection = {
    init: init,
    closeDrawer: closeDrawer,
    openDrawer: openDrawer,
    refreshHeroBottom: refreshHeroBottom
  };
})();
