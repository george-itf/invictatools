/**
 * Invicta Shared Utilities
 *
 * Single source of truth for utility functions previously duplicated
 * across multiple files (debounce, formatMoney, escapeHtml).
 *
 * Exposed on window.invictaUtils to follow the same global namespace
 * pattern used by the rest of the theme. Loaded after constants.js and
 * before any consumers in layout/theme.liquid.
 */
(function () {
  'use strict';

  var DEFAULT_MONEY_FORMAT = '£{{amount}}';

  /**
   * Returns a debounced version of fn that delays invocation until `wait`
   * milliseconds have elapsed since the last call.
   * Preserves `this` and arguments. Trailing-edge only.
   *
   * @param {Function} fn
   * @param {number} wait
   * @returns {Function}
   */
  function debounce(fn, wait) {
    var t;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  /**
   * Format a price in pence/cents into a localised money string.
   * Prefers Shopify.formatMoney when available so the merchant's configured
   * format is applied. Falls back to a manual replacement that handles the
   * three common Liquid placeholders.
   *
   * Negative values are formatted with a leading minus on the amount.
   * Non-finite values (NaN, Infinity) fall back to a £0.00-equivalent string.
   *
   * @param {number} cents - Price in pence/cents
   * @param {string} [format] - Optional money format template
   * @returns {string}
   */
  function formatMoney(cents, format) {
    var fmt = format || DEFAULT_MONEY_FORMAT;
    var amountNumber = Number(cents);
    if (!isFinite(amountNumber)) amountNumber = 0;

    if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
      return Shopify.formatMoney(amountNumber, fmt);
    }

    var negative = amountNumber < 0;
    var abs = Math.abs(amountNumber);
    var amount = (abs / 100).toFixed(2);
    var amountNoDecimals = String(Math.round(abs / 100));
    var amountComma = amount.replace('.', ',');

    var formatted = fmt
      .replace('{{amount}}', amount)
      .replace('{{amount_no_decimals}}', amountNoDecimals)
      .replace('{{amount_with_comma_separator}}', amountComma)
      .replace('{{amount_no_decimals_with_comma_separator}}', amountNoDecimals);

    return negative ? '-' + formatted : formatted;
  }

  /**
   * Escape arbitrary text for safe insertion into innerHTML.
   * Uses a detached text node so the browser handles all relevant entities.
   * Returns an empty string for null/undefined.
   *
   * @param {*} str
   * @returns {string}
   */
  function escapeHtml(str) {
    if (str == null) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
  }

  window.invictaUtils = {
    debounce: debounce,
    formatMoney: formatMoney,
    escapeHtml: escapeHtml,
    DEFAULT_MONEY_FORMAT: DEFAULT_MONEY_FORMAT,
  };
})();
