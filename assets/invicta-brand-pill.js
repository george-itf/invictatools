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
  /* Scoped to pill container elements instead of the entire document
     to avoid capturing unrelated image errors globally. */
  function handleBrandPillError(e) {
    const img = e.target;
    if (!img || img.tagName !== 'IMG' || !img.hasAttribute('data-brand-pill-detector')) return;

    const wrap = img.closest('.invicta-brand-pill__inner');
    if (!wrap) return;

    const bg = wrap.querySelector('.invicta-brand-pill__logo-bg');
    const label = wrap.querySelector('.invicta-brand-pill__label');

    /* CLS fix: Use class toggle instead of display swaps to avoid reflow.
       The pill has a fixed --pill-height so dimensions stay stable. */
    const pill = img.closest('.invicta-brand-pill');
    if (pill) pill.classList.add('invicta-brand-pill--text');
    if (bg) { bg.style.visibility = 'hidden'; bg.style.position = 'absolute'; }
    if (label) label.style.display = 'inline-block';
  }

  function bindPillErrorListeners() {
    const pillContainers = document.querySelectorAll('.invicta-brand-pill');
    pillContainers.forEach(function(pill) {
      if (pill.hasAttribute('data-pill-error-bound')) return;
      pill.setAttribute('data-pill-error-bound', 'true');
      pill.addEventListener('error', handleBrandPillError, true);
    });
  }

  bindPillErrorListeners();

  /* ── Tooltip engine ── */
  function initTooltips() {
    const pills = document.querySelectorAll('[data-tooltip]');

    pills.forEach(function(pill) {
      let tooltipTimer;

      pill.addEventListener('mouseenter', function() {
        const txt = pill.getAttribute('data-tooltip');
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
        const txt = pill.getAttribute('data-tooltip');
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
