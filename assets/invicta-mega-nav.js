/**
 * Invicta Mega Nav v1.1
 * Hover + keyboard interaction for desktop mega-menu.
 * Keyboard: Enter/Space opens, Arrow keys navigate menuitems,
 * Escape closes and returns focus to trigger, Tab closes and exits.
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
    items.forEach(function(other) {
      if (other !== item) closePanel(other);
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
    clearTimeout(closeTimer);
    items.forEach(closePanel);
  }

  function getMenuItems(item) {
    return Array.prototype.slice.call(
      item.querySelectorAll('.inv-mega-nav__sublink, .inv-mega-nav__view-all')
    );
  }

  function focusMenuItem(item, index) {
    var menuItems = getMenuItems(item);
    if (!menuItems.length) return;
    var wrapped = (index + menuItems.length) % menuItems.length;
    menuItems[wrapped].focus();
  }

  items.forEach(function(item) {
    /* Hover open/close with delay */
    item.addEventListener('mouseenter', function() {
      openPanel(item);
    });
    item.addEventListener('mouseleave', function() {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function() {
        closePanel(item);
      }, CLOSE_DELAY);
    });

    var trigger = item.querySelector('.inv-mega-nav__link');
    var panel = item.querySelector('.inv-mega-nav__panel');

    if (trigger) {
      trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var isOpen = item.getAttribute('data-open') === 'true';
          if (isOpen) {
            closePanel(item);
          } else {
            openPanel(item);
            focusMenuItem(item, 0);
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          openPanel(item);
          focusMenuItem(item, 0);
        } else if (e.key === 'Escape') {
          closePanel(item);
          trigger.focus();
        }
      });
    }

    if (panel) {
      panel.addEventListener('keydown', function(e) {
        var menuItems = getMenuItems(item);
        var currentIndex = menuItems.indexOf(document.activeElement);

        if (e.key === 'Escape') {
          e.preventDefault();
          closePanel(item);
          if (trigger) trigger.focus();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          focusMenuItem(item, currentIndex + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          focusMenuItem(item, currentIndex - 1);
        } else if (e.key === 'Home') {
          e.preventDefault();
          focusMenuItem(item, 0);
        } else if (e.key === 'End') {
          e.preventDefault();
          focusMenuItem(item, menuItems.length - 1);
        } else if (e.key === 'Tab') {
          /* Close the panel and let Tab proceed naturally to the next
             element on the page, matching WAI-ARIA menu pattern. */
          closePanel(item);
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
