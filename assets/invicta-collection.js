/**
 * Invicta Collection v9.x — drawer, scroll FX, drag-to-dismiss.
 * Filtering / sorting / pagination AJAX is handled by invicta-collection-ajax.js.
 */
(function () {
  'use strict';

  var drawer = document.getElementById('InvDrawer');
  var overlay = document.getElementById('InvDrawerOverlay');
  var drawerClose = document.getElementById('InvDrawerClose');
  var filterToggle = document.getElementById('InvFilterToggle');
  var floatingFilter = document.getElementById('InvFloatingFilter');
  var scrollTopBtn = document.getElementById('InvScrollTop');
  var hero = document.querySelector('.inv-hero, .inv-brand-hero');
  var lastFocusedEl = null;
  var scrollPosition = 0;

  function openDrawer() {
    if (!drawer || !overlay) return;
    lastFocusedEl = document.activeElement;
    scrollPosition = window.scrollY;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-visible');
    document.body.classList.add('inv-drawer-open');
    document.body.style.top = '-' + scrollPosition + 'px';
    if (filterToggle) filterToggle.setAttribute('aria-expanded', 'true');
    if (drawerClose) drawerClose.focus();
  }

  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('is-open');
    drawer.style.transform = '';
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('is-visible');
    document.body.classList.remove('inv-drawer-open');
    document.body.style.top = '';
    window.scrollTo(0, scrollPosition);
    if (filterToggle) filterToggle.setAttribute('aria-expanded', 'false');
    if (lastFocusedEl) lastFocusedEl.focus();
    lastFocusedEl = null;
  }

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

  document.addEventListener('keydown', function (e) {
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

  // Drag-to-dismiss on the bottom-sheet handle.
  (function () {
    if (!drawer) return;
    var handle = document.getElementById('InvDrawerHandle');
    if (!handle) return;
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
  })();

  // Scroll effects — floating filter + back-to-top visibility.
  var ticking = false;
  var heroBottom = hero ? hero.offsetTop + hero.offsetHeight : 300;

  function handleScroll() {
    var scrollY = window.scrollY;
    if (floatingFilter) {
      floatingFilter.classList.toggle('is-visible', scrollY > heroBottom);
    }
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('is-visible', scrollY > 400);
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    if (hero) heroBottom = hero.offsetTop + hero.offsetHeight;
  }, { passive: true });

  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Ensure drawer is closed on page load (guards against hot-reload state).
  if (drawer) drawer.classList.remove('is-open');
  if (overlay) overlay.classList.remove('is-visible');
  document.body.classList.remove('inv-drawer-open');
  document.body.style.top = '';
})();
