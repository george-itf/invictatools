(function() {
  'use strict';
  var config = window.invictaConfig || {};
  var rate = config.vatRate || (config.vatDivisor ? (config.vatDivisor - 100) : 20);
  var divisor = 100 + rate;

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
