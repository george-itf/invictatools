/* ============================================================
   INVICTA BRAND PILL JS — v2.0 (Tooltip + Logo Fallback)
   ============================================================
   - Tooltip engine for [data-tooltip] elements
   - Logo fallback: delegated error handler for brand pill detector imgs
   - Extracted from inline scripts for CSP compliance
   ============================================================ */

(function() {
  'use strict';

  /* ── Logo fallback (error delegation) ── */
  if (!window.__invictaBrandPillErrorBound) {
    window.__invictaBrandPillErrorBound = true;

    document.addEventListener('error', function(e) {
      var img = e.target;
      if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-brand-pill-detector')) return;

      var wrap = img.closest('.invicta-brand-pill__inner');
      if (!wrap) return;

      var bg = wrap.querySelector('.invicta-brand-pill__logo-bg');
      var label = wrap.querySelector('.invicta-brand-pill__label');

      if (bg) bg.style.display = 'none';
      if (label) label.style.display = 'inline-block';

      var pill = img.closest('.invicta-brand-pill');
      if (pill) pill.classList.add('invicta-brand-pill--text');
    }, true);
  }

  /* ── Tooltip engine ── */
  function initTooltips() {
    var pills = document.querySelectorAll('[data-tooltip]');

    pills.forEach(function(pill) {
      var tooltipTimer;

      pill.addEventListener('mouseenter', function() {
        var txt = pill.getAttribute('data-tooltip');
        if (!txt) return;

        tooltipTimer = setTimeout(function() {
          pill.classList.add('invicta-tooltip-active');
        }, 550);
      });

      pill.addEventListener('mouseleave', function() {
        clearTimeout(tooltipTimer);
        pill.classList.remove('invicta-tooltip-active');
      });

      pill.addEventListener('click', function(e) {
        var txt = pill.getAttribute('data-tooltip');
        if (!txt) return;

        e.preventDefault();
        pill.classList.toggle('invicta-tooltip-active');

        setTimeout(function() {
          pill.classList.remove('invicta-tooltip-active');
        }, 3000);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
  } else {
    initTooltips();
  }
})();
