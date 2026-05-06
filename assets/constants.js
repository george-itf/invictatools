const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update',
  optionValueSelectionChange: 'option-value-selection-change',
  variantChange: 'variant-change',
  cartError: 'cart-error',
};

/**
 * Shopify cart routes.
 * Prefer window.routes (Shopify injects these in theme.liquid) and fall back
 * to the standard paths if it isn't present yet.
 *
 * The .js-suffixed variants return JSON; some Shopify code paths use the
 * non-suffixed form (e.g. cart_change_url) and the AJAX endpoint negotiates
 * via Accept headers. We expose both shapes so callers preserve their
 * existing behaviour.
 */
const INVICTA_ROUTES = {
  get cartAdd() {
    return ((window.routes && window.routes.cart_add_url) || '/cart/add') + '.js';
  },
  get cart() {
    return ((window.routes && window.routes.cart_url) || '/cart') + '.js';
  },
  // Non-suffixed cart URL for section_id queries (?section_id=cart-drawer)
  get cartBase() {
    return (window.routes && window.routes.cart_url) || '/cart';
  },
  get cartChange() {
    return (window.routes && window.routes.cart_change_url) || '/cart/change';
  },
  get cartUpdate() {
    return (window.routes && window.routes.cart_update_url) || '/cart/update';
  },
  get cartClear() {
    return (window.routes && window.routes.cart_clear_url) || '/cart/clear';
  },
  get predictiveSearch() {
    return (window.routes && window.routes.predictive_search_url) || '/search/suggest.json';
  },
};

/**
 * Canonical DOM selectors and data-attributes shared across cart, VAT,
 * and price scripts. Keep this list in sync with markup so that renaming
 * an attribute or class only requires editing one place.
 */
const INVICTA_SELECTORS = {
  // Cart count badges (header bubble + accessible label variants)
  cartCount: [
    '.cart-count-bubble span[aria-hidden="true"]',
    '.header__cart-count',
    '[data-cart-count]',
    '.cart-count',
  ],
  cartCountBubble: '.cart-count-bubble, [data-cart-bubble]',

  // Price elements (inc/ex VAT pair lives inside [data-price-wrapper])
  priceWrapper: '[data-price-wrapper]',
  priceInc: '[data-price-inc]',
  priceEx: '[data-price-ex]',
  priceIncValue: '[data-price-inc-value]',
  priceExValue: '[data-price-ex-value]',

  // VAT toggle controls
  vatToggle: '[data-vat-toggle]',
  vatButton: '[data-vat-btn]',
  vatRateHost: '.inv-pdp[data-vat-rate]',

  // VAT visibility helpers
  vatHidden: '.inv-vat--hidden',
};

/**
 * Data-attribute names used to write fresh markup. Keep in sync with the
 * matching selector entries above.
 */
const INVICTA_DATA_ATTRS = {
  priceInc: 'data-price-inc',
  priceEx: 'data-price-ex',
  vatRate: 'data-vat-rate',
  cartCount: 'data-cart-count',
  cartBubble: 'data-cart-bubble',
};
