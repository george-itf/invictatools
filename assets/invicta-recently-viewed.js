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

      products.forEach(product => {
        this.container.appendChild(this.createCardNode(product));
      });
    }

    showEmpty() {
      if (this.loadingEl) {
        this.loadingEl.classList.add('hidden');
      }
      // Hide the entire section when empty to avoid wasting vertical space
      var section = document.querySelector('.inv-recent[data-section-id]');
      if (section) {
        section.style.display = 'none';
      }
    }

    createCardNode(product) {
      const price = parseFloat(product.price) || 0;
      const comparePrice = parseFloat(product.comparePrice) || 0;
      const onSale = comparePrice > price;
      const priceFormatted = this.formatMoney(price * 100);
      const svgNS = 'http://www.w3.org/2000/svg';

      var anchor = document.createElement('a');
      anchor.href = product.url || '';
      anchor.className = 'inv-recent__card';
      anchor.setAttribute('aria-label', product.title || '');

      var imageDiv = document.createElement('div');
      imageDiv.className = 'inv-recent__card-image';

      if (onSale) {
        var badge = document.createElement('span');
        badge.className = 'inv-recent__card-badge';
        badge.textContent = 'Sale';
        imageDiv.appendChild(badge);
      }

      if (product.image) {
        var img = document.createElement('img');
        img.src = this.getOptimizedImageUrl(product.image, 400);
        img.alt = product.title || '';
        img.loading = 'lazy';
        img.width = 400;
        img.height = 400;
        imageDiv.appendChild(img);
      } else {
        var placeholder = document.createElement('div');
        placeholder.className = 'inv-recent__card-placeholder';
        var svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width', '48');
        svg.setAttribute('height', '48');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '1');
        var rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', '3'); rect.setAttribute('y', '3');
        rect.setAttribute('width', '18'); rect.setAttribute('height', '18');
        rect.setAttribute('rx', '2'); rect.setAttribute('ry', '2');
        svg.appendChild(rect);
        var circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', '8.5'); circle.setAttribute('cy', '8.5'); circle.setAttribute('r', '1.5');
        svg.appendChild(circle);
        var polyline = document.createElementNS(svgNS, 'polyline');
        polyline.setAttribute('points', '21 15 16 10 5 21');
        svg.appendChild(polyline);
        placeholder.appendChild(svg);
        imageDiv.appendChild(placeholder);
      }

      anchor.appendChild(imageDiv);

      var bodyDiv = document.createElement('div');
      bodyDiv.className = 'inv-recent__card-body';

      if (product.vendor) {
        var vendorSpan = document.createElement('span');
        vendorSpan.className = 'inv-recent__card-vendor';
        vendorSpan.textContent = product.vendor;
        bodyDiv.appendChild(vendorSpan);
      }

      var titleH3 = document.createElement('h3');
      titleH3.className = 'inv-recent__card-title';
      titleH3.textContent = product.title || '';
      bodyDiv.appendChild(titleH3);

      var priceDiv = document.createElement('div');
      priceDiv.className = 'inv-recent__card-price';
      var priceSpan = document.createElement('span');
      priceSpan.className = onSale
        ? 'inv-recent__card-price-current inv-recent__card-price-current--sale'
        : 'inv-recent__card-price-current';
      priceSpan.textContent = priceFormatted;
      priceDiv.appendChild(priceSpan);

      if (onSale) {
        var compareSpan = document.createElement('span');
        compareSpan.className = 'inv-recent__card-price-compare';
        compareSpan.textContent = this.formatMoney(comparePrice * 100);
        priceDiv.appendChild(compareSpan);
      }

      bodyDiv.appendChild(priceDiv);
      anchor.appendChild(bodyDiv);

      return anchor;
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

    /* escapeHtml removed — no longer needed after DOM-construction refactor */
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
