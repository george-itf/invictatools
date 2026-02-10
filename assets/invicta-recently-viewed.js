/**
 * Invicta Recently Viewed Products v3.1
 * Extracted from inline — reads config from data attributes
 */
(function() {
  'use strict';

  class InvictaRecentlyViewed {
    constructor(config) {
      this.storageKey = 'invicta_recently_viewed_v3';
      this.maxProducts = config.maxProducts || 8;
      this.container = document.getElementById('inv-recent-products');
      this.loadingEl = document.getElementById('inv-recent-loading');
      this.emptyEl = document.getElementById('inv-recent-empty');
      this.moneyFormat = config.moneyFormat || '\u00a3{{amount}}';

      if (this.container) {
        this.init();
      }
    }

    async init() {
      this.trackCurrentProduct();

      const handles = this.getStoredHandles();
      if (handles.length === 0) {
        this.showEmpty();
        return;
      }

      const currentHandle = this.getCurrentProductHandle();
      const filteredHandles = handles.filter(h => h !== currentHandle);

      if (filteredHandles.length === 0) {
        this.showEmpty();
        return;
      }

      try {
        const products = await this.fetchProducts(filteredHandles);
        if (products.length > 0) {
          this.renderProducts(products);
        } else {
          this.showEmpty();
        }
      } catch (err) {
        console.error('[Invicta RV] Error loading products:', err);
        this.showEmpty();
      }
    }

    getStoredHandles() {
      try {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    }

    saveHandles(handles) {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(handles));
      } catch (e) {
        // Silent fail
      }
    }

    trackCurrentProduct() {
      const productMeta = document.querySelector('meta[property="og:type"][content="og:product"], meta[property="product:price:amount"]');
      if (!productMeta) return;

      const handle = this.getCurrentProductHandle();
      if (!handle) return;

      const handles = this.getStoredHandles();
      const filtered = handles.filter(h => h !== handle);
      filtered.unshift(handle);
      const limited = filtered.slice(0, this.maxProducts + 5);
      this.saveHandles(limited);
    }

    getCurrentProductHandle() {
      const path = window.location.pathname;
      const match = path.match(/\/products\/([^/?#]+)/);
      return match ? match[1] : null;
    }

    async fetchProducts(handles) {
      const products = [];

      const fetchPromises = handles.slice(0, this.maxProducts).map(async (handle) => {
        try {
          const response = await fetch(`/products/${handle}.json`);
          if (!response.ok) return null;
          const data = await response.json();
          return data.product;
        } catch (e) {
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);

      results.forEach((product) => {
        if (product) {
          products.push({
            id: product.id,
            handle: product.handle,
            title: product.title,
            vendor: product.vendor,
            url: `/products/${product.handle}`,
            price: product.variants[0]?.price,
            comparePrice: product.variants[0]?.compare_at_price,
            image: product.images[0]?.src || null,
            available: product.variants.some(v => v.available)
          });
        }
      });

      return products;
    }

    renderProducts(products) {
      if (this.loadingEl) {
        this.loadingEl.classList.add('hidden');
      }

      const html = products.map(product => this.createCard(product)).join('');
      this.container.insertAdjacentHTML('afterbegin', html);
    }

    showEmpty() {
      if (this.loadingEl) {
        this.loadingEl.classList.add('hidden');
      }
      if (this.emptyEl) {
        this.emptyEl.classList.remove('hidden');
      }
    }

    createCard(product) {
      const price = parseFloat(product.price) || 0;
      const comparePrice = parseFloat(product.comparePrice) || 0;
      const onSale = comparePrice > price;

      const priceFormatted = this.formatMoney(price * 100);
      const comparePriceFormatted = onSale ? this.formatMoney(comparePrice * 100) : '';

      let imageHtml = '';
      if (product.image) {
        const imageUrl = this.getOptimizedImageUrl(product.image, 400);
        imageHtml = '<img src="' + imageUrl + '" alt="' + this.escapeHtml(product.title) + '" loading="lazy" width="400" height="400">';
      } else {
        imageHtml =
          '<div class="inv-recent__card-placeholder">' +
            '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">' +
              '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>' +
              '<circle cx="8.5" cy="8.5" r="1.5"/>' +
              '<polyline points="21 15 16 10 5 21"/>' +
            '</svg>' +
          '</div>';
      }

      const badgeHtml = onSale ? '<span class="inv-recent__card-badge">Sale</span>' : '';

      const vendorHtml = product.vendor ?
        '<span class="inv-recent__card-vendor">' + this.escapeHtml(product.vendor) + '</span>' : '';

      const priceClass = onSale ? 'inv-recent__card-price-current inv-recent__card-price-current--sale' : 'inv-recent__card-price-current';

      return '<a href="' + product.url + '" class="inv-recent__card" aria-label="' + this.escapeHtml(product.title) + '">' +
          '<div class="inv-recent__card-image">' +
            badgeHtml +
            imageHtml +
          '</div>' +
          '<div class="inv-recent__card-body">' +
            vendorHtml +
            '<h3 class="inv-recent__card-title">' + this.escapeHtml(product.title) + '</h3>' +
            '<div class="inv-recent__card-price">' +
              '<span class="' + priceClass + '">' + priceFormatted + '</span>' +
              (onSale ? '<span class="inv-recent__card-price-compare">' + comparePriceFormatted + '</span>' : '') +
            '</div>' +
          '</div>' +
        '</a>';
    }

    getOptimizedImageUrl(src, width) {
      if (!src) return '';
      if (src.includes('cdn.shopify.com')) {
        return src.replace(/(_\d+x\d*)?(\.[a-z]+)(\?.*)?$/i, '_' + width + 'x$2');
      }
      return src;
    }

    formatMoney(cents) {
      if (typeof Shopify !== 'undefined' && Shopify.formatMoney) {
        return Shopify.formatMoney(cents, this.moneyFormat);
      }

      const amount = (cents / 100).toFixed(2);
      return this.moneyFormat
        .replace('{{amount}}', amount)
        .replace('{{amount_no_decimals}}', Math.round(cents / 100))
        .replace('{{amount_with_comma_separator}}', amount.replace('.', ','));
    }

    escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  function init() {
    const container = document.querySelector('.inv-recent[data-section-id]');
    if (!container) return;

    const config = {
      maxProducts: parseInt(container.dataset.maxProducts, 10) || 8,
      moneyFormat: container.dataset.moneyFormat || '\u00a3{{amount}}'
    };

    new InvictaRecentlyViewed(config);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
