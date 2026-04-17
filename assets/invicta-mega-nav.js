/**
 * Invicta Mega Nav v1.0
 * Hover + keyboard interaction for desktop mega-menu.
 */
(function() {
  'use strict';

  var nav = document.querySelector('.inv-mega-nav');
  if (!nav) return;

  var items = nav.querySelectorAll('.inv-mega-nav__item[data-has-children]');
  var closeTimer = null;
  var CLOSE_DELAY = 200;

  function openPanel(item) {
    clearTimeout(closeTimer);
    /* Close other open panels first */
    items.forEach(function(other) {
      if (other !== item) other.removeAttribute('data-open');
    });
    item.setAttribute('data-open', 'true');
    var link = item.querySelector('.inv-mega-nav__link');
    if (link) link.setAttribute('aria-expanded', 'true');
  }

  function closePanel(item) {
    item.removeAttribute('data-open');
    var link = item.querySelector('.inv-mega-nav__link');
    if (link) link.setAttribute('aria-expanded', 'false');
  }

  function closeAllPanels() {
    items.forEach(closePanel);
  }

  items.forEach(function(item) {
    /* Hover open/close with delay */
    item.addEventListener('mouseenter', function() {
      openPanel(item);
    });
    item.addEventListener('mouseleave', function() {
      closeTimer = setTimeout(function() {
        closePanel(item);
      }, CLOSE_DELAY);
    });

    /* Keyboard: Enter/Space toggles, Escape closes */
    var trigger = item.querySelector('.inv-mega-nav__link');
    if (trigger) {
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var isOpen = item.getAttribute('data-open') === 'true';
          if (isOpen) {
            closePanel(item);
          } else {
            openPanel(item);
            /* Focus first sublink */
            var firstSub = item.querySelector('.inv-mega-nav__sublink');
            if (firstSub) firstSub.focus();
          }
        }
        if (e.key === 'Escape') {
          closePanel(item);
          trigger.focus();
        }
      });
    }

    /* Escape from within panel */
    var panel = item.querySelector('.inv-mega-nav__panel');
    if (panel) {
      panel.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
          closePanel(item);
          if (trigger) trigger.focus();
        }
      });
    }
  });

  /* Close all panels when clicking outside */
  document.addEventListener('click', function(e) {
    if (!nav.contains(e.target)) {
      closeAllPanels();
    }
  });
})();
