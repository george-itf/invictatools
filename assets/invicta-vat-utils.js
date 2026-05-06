(function() {
  'use strict';
  const DEFAULT_DIVISOR = 120;
  const config = window.invictaConfig || {};
  const rawRate = config.vatRate;
  const rawDivisor = config.vatDivisor;

  let divisor;
  if (typeof rawRate === 'number' && isFinite(rawRate) && rawRate > 0 && rawRate <= 100) {
    divisor = 100 + rawRate;
  } else if (typeof rawDivisor === 'number' && isFinite(rawDivisor)) {
    divisor = rawDivisor;
  } else {
    divisor = DEFAULT_DIVISOR;
  }

  if (!isFinite(divisor) || divisor < 100 || divisor > 200) {
    if (typeof console !== 'undefined' && console.warn) {
      console.warn('[invicta-vat] Invalid VAT divisor (' + divisor + '); falling back to ' + DEFAULT_DIVISOR + ' (20%).');
    }
    divisor = DEFAULT_DIVISOR;
  }

  const rate = divisor - 100;

  window.invictaVat = {
    rate: rate,
    divisor: divisor,
    exFromInc: function(priceInPence) {
      return Math.round(priceInPence * 100 / divisor);
    },
    formatPounds: function(pence) {
      return (pence / 100).toFixed(2);
    }
  };
})();
