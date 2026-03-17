/**
 * Invicta Predictive Search — Consolidated v1.0
 *
 * Merges the best of both the Invicta custom search (JSON endpoint, stock
 * badges, ex-VAT pricing, portal positioning) and the Shopify default
 * predictive search (result caching, keyboard navigation, ARIA attributes,
 * AbortController pattern, debounced input).
 *
 * Single entry point — replaces:
 *   - search-form.js
 *   - predictive-search.js
 *   - invicta-predictive-search.js
 */
(function () {
  'use strict';

  /* ================================================================
   * Configuration
   * ================================================================ */
  const DEBOUNCE_MS = 250;
  const MIN_QUERY_LENGTH = 2;
  const RESULTS_LIMIT = 10;
  const CACHE_MAX = 20;
  const FETCH_FIELDS = 'title,product_type,vendor,variants.sku,variants.barcode,tag';

  /* ================================================================
   * InvictaPredictiveSearch
   * ================================================================ */
  class InvictaPredictiveSearch {
    constructor() {
      this.wrapper = document.querySelector('.inv-search-wrapper');
      if (!this.wrapper) return;

      this.input = this.wrapper.querySelector('.inv-search-input');
      this.clearBtn = this.wrapper.querySelector('.inv-search-clear');
      this.resultsContainer = this.wrapper.querySelector('.inv-search-results');
      if (!this.input || !this.resultsContainer) return;

      /* State */
      this.cache = new Map();
      this.abortController = null;
      this.debounceTimer = null;
      this.isOpen = false;
      this.selectedIndex = -1;
      this.resultItems = [];

      /* Portal the dropdown to body-level so it escapes stacking contexts */
      this.portal = document.getElementById('ps-root') || document.body;
      this.portal.appendChild(this.resultsContainer);

      this._bindEvents();
    }

    /* ----------------------------------------------------------------
     * Event binding
     * ---------------------------------------------------------------- */
    _bindEvents() {
      /* Debounced input */
      this.input.addEventListener('input', () => {
        clearTimeout(this.debounceTimer);
        const query = this._getQuery();

        if (query.length < MIN_QUERY_LENGTH) {
          this._close(true);
          return;
        }

        this._showLoading();

        this.debounceTimer = setTimeout(() => {
          this._fetchResults(query);
        }, DEBOUNCE_MS);
      });

      /* Clear button */
      if (this.clearBtn) {
        this.clearBtn.addEventListener('click', () => {
          this.input.value = '';
          this.input.focus();
          this._close(true);
        });
      }

      /* Focus — reopen if results exist */
      this.input.addEventListener('focus', () => {
        const query = this._getQuery();
        if (query.length >= MIN_QUERY_LENGTH && this.resultsContainer.hasChildNodes()) {
          this._open();
        }
      });

      /* Keyboard navigation */
      this.input.addEventListener('keydown', (e) => this._onKeydown(e));

      /* Click outside closes dropdown */
      document.addEventListener('click', (e) => {
        if (!this.wrapper.contains(e.target) && !this.resultsContainer.contains(e.target)) {
          this._close();
        }
      });

      /* Reposition on scroll/resize using rAF */
      let scrollRaf = null;
      let resizeRaf = null;

      window.addEventListener('scroll', () => {
        if (!this.isOpen) return;
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          this._positionDropdown();
          scrollRaf = null;
        });
      }, { passive: true });

      window.addEventListener('resize', () => {
        if (!this.isOpen) return;
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
          this._positionDropdown();
          resizeRaf = null;
        });
      }, { passive: true });
    }

    /* ----------------------------------------------------------------
     * Helpers
     * ---------------------------------------------------------------- */
    _getQuery() {
      return this.input.value.trim();
    }

    _cacheKey(query) {
      return query.toLowerCase().trim();
    }

    _clearElement(el) {
      while (el.firstChild) el.removeChild(el.firstChild);
    }

    /* ----------------------------------------------------------------
     * Dropdown positioning (fixed, viewport-relative)
     * ---------------------------------------------------------------- */
    _positionDropdown() {
      if (!this.isOpen) return;
      const rect = this.wrapper.getBoundingClientRect();
      this.resultsContainer.style.position = 'fixed';
      this.resultsContainer.style.top = (rect.bottom + 8) + 'px';
      this.resultsContainer.style.left = rect.left + 'px';
      this.resultsContainer.style.width = rect.width + 'px';
    }

    /* ----------------------------------------------------------------
     * Open / Close
     * ---------------------------------------------------------------- */
    _open() {
      this.resultsContainer.style.display = 'block';
      this.isOpen = true;
      this.input.setAttribute('aria-expanded', 'true');
      this._positionDropdown();
    }

    _close(clear = false) {
      this.resultsContainer.style.display = 'none';
      this.isOpen = false;
      this.selectedIndex = -1;
      this.input.setAttribute('aria-expanded', 'false');
      this.input.removeAttribute('aria-activedescendant');
      if (clear) {
        this._clearElement(this.resultsContainer);
      }
      /* Deselect any highlighted item */
      this.resultItems.forEach((item) => item.setAttribute('aria-selected', 'false'));
    }

    /* ----------------------------------------------------------------
     * Loading state
     * ---------------------------------------------------------------- */
    _showLoading() {
      this._clearElement(this.resultsContainer);
      const loading = document.createElement('div');
      loading.className = 'inv-search-results__loading';
      const spinner = document.createElement('div');
      spinner.className = 'inv-search-results__spinner';
      loading.appendChild(spinner);
      this.resultsContainer.appendChild(loading);
      this._open();
    }

    /* ----------------------------------------------------------------
     * Fetching
     * ---------------------------------------------------------------- */
    _fetchResults(query) {
      const key = this._cacheKey(query);

      /* Check cache first */
      if (this.cache.has(key)) {
        this._renderResults(this.cache.get(key), query);
        return;
      }

      /* Abort any in-flight request */
      if (this.abortController) this.abortController.abort();
      this.abortController = new AbortController();

      const url =
        '/search/suggest.json?q=' + encodeURIComponent(query) +
        '&resources[type]=product' +
        '&resources[limit]=' + RESULTS_LIMIT +
        '&resources[options][fields]=' + FETCH_FIELDS;

      fetch(url, { signal: this.abortController.signal })
        .then((res) => res.json())
        .then((data) => {
          const products = data.resources?.results?.products || [];

          /* Store in cache, evict oldest if over limit */
          if (this.cache.size >= CACHE_MAX) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
          }
          this.cache.set(key, products);

          this._renderResults(products, query);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          this._clearElement(this.resultsContainer);
          const errorDiv = document.createElement('div');
          errorDiv.className = 'inv-search-results__empty';
          const errorText = document.createElement('p');
          errorText.className = 'inv-search-results__empty-text';
          errorText.textContent = 'Something went wrong. Please try again.';
          errorDiv.appendChild(errorText);
          this.resultsContainer.appendChild(errorDiv);
        });
    }

    /* ----------------------------------------------------------------
     * Rendering
     * ---------------------------------------------------------------- */
    _renderResults(products, query) {
      this._clearElement(this.resultsContainer);
      this.resultItems = [];
      this.selectedIndex = -1;

      if (products.length === 0) {
        this._renderEmpty(query);
        return;
      }

      const showVendor = window.Shopify?.designMode
        ? true
        : (window.__invictaSearchSettings?.showVendor !== false);
      const showPrice = window.Shopify?.designMode
        ? true
        : (window.__invictaSearchSettings?.showPrice !== false);

      products.forEach((product, index) => {
        const anchor = this._buildResultItem(product, index, showVendor, showPrice);
        this.resultsContainer.appendChild(anchor);
        this.resultItems.push(anchor);
      });

      /* "View all results" link */
      const viewAll = document.createElement('a');
      viewAll.href = '/search?type=product&options%5Bprefix%5D=last&q=' + encodeURIComponent(query);
      viewAll.className = 'inv-search-results__view-all';
      viewAll.id = 'inv-search-view-all';
      viewAll.setAttribute('role', 'option');
      viewAll.setAttribute('aria-selected', 'false');
      viewAll.textContent = 'View all results \u2192';
      this.resultsContainer.appendChild(viewAll);
      this.resultItems.push(viewAll);

      this._open();
    }

    _buildResultItem(product, index, showVendor, showPrice) {
      const image = product.featured_image?.url || product.image || '';
      const title = product.title || '';
      const url = product.url || '';
      const vendor = product.vendor || '';
      const available = product.available !== false;

      /* Stock source from tags */
      const rawTags = product.tags || '';
      const tagsArray = Array.isArray(rawTags)
        ? rawTags.map((t) => t.toLowerCase().trim())
        : rawTags.split(',').map((t) => t.toLowerCase().trim());

      let stockSource = 'invicta';
      for (let i = 0; i < tagsArray.length; i++) {
        const tag = tagsArray[i];
        if (tag === 'invicta-stock') { stockSource = 'invicta'; break; }
        if (tag === 'trend-stock' || tag === 'toolbank-stock' || tag === 'timco-stock' || tag === 'pdp-stock') {
          stockSource = 'supplier';
        }
      }

      let stockLabel, stockClass;
      if (!available) {
        stockLabel = 'Out of Stock';
        stockClass = 'out-of-stock';
      } else if (stockSource === 'supplier') {
        stockLabel = 'Available from Supplier';
        stockClass = 'supplier';
      } else {
        stockLabel = 'In Stock';
        stockClass = 'in-stock';
      }

      /* Ex-VAT price */
      const vatRate = (window.invictaConfig && window.invictaConfig.vatRate) || 20;
      const vatDivisor = 100 + vatRate;
      const priceExVatPence = Math.round((product.price * 100) / vatDivisor);
      const priceExVat = (priceExVatPence / 100).toFixed(2);
      const priceInc = (product.price / 100).toFixed(2);

      /* Build DOM */
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.className = 'inv-search-results__item';
      anchor.id = 'inv-search-option-' + index;
      anchor.setAttribute('role', 'option');
      anchor.setAttribute('aria-selected', 'false');

      if (image) {
        const img = document.createElement('img');
        img.src = image + '&width=144';
        img.alt = title;
        img.className = 'inv-search-results__image';
        img.loading = 'lazy';
        anchor.appendChild(img);
      }

      const info = document.createElement('div');
      info.className = 'inv-search-results__info';

      if (showVendor && vendor) {
        const vendorP = document.createElement('p');
        vendorP.className = 'inv-search-results__vendor';
        vendorP.textContent = vendor;
        info.appendChild(vendorP);
      }

      const titleP = document.createElement('p');
      titleP.className = 'inv-search-results__title';
      titleP.textContent = title;
      info.appendChild(titleP);

      if (showPrice) {
        const meta = document.createElement('div');
        meta.className = 'inv-search-results__meta';

        const priceP = document.createElement('p');
        priceP.className = 'inv-search-results__price';
        priceP.textContent = '\u00a3' + priceInc;
        meta.appendChild(priceP);

        const exVat = document.createElement('span');
        exVat.className = 'inv-search-results__price-ex-vat';
        exVat.textContent = '\u00a3' + priceExVat + ' ex. VAT';
        meta.appendChild(exVat);

        const badge = document.createElement('span');
        badge.className = 'inv-search-results__stock inv-search-results__stock--' + stockClass;
        badge.textContent = stockLabel;
        meta.appendChild(badge);

        info.appendChild(meta);
      }

      anchor.appendChild(info);
      return anchor;
    }

    _renderEmpty(query) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'inv-search-results__empty';

      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'inv-search-results__empty-icon');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.5');
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', '11');
      circle.setAttribute('cy', '11');
      circle.setAttribute('r', '8');
      svg.appendChild(circle);
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'm21 21-4.35-4.35');
      svg.appendChild(path);
      emptyDiv.appendChild(svg);

      const text = document.createElement('p');
      text.className = 'inv-search-results__empty-text';
      text.textContent = 'No products found for \u201c' + query + '\u201d';
      emptyDiv.appendChild(text);

      this.resultsContainer.appendChild(emptyDiv);
      this._open();
    }

    /* ----------------------------------------------------------------
     * Keyboard navigation
     * ---------------------------------------------------------------- */
    _onKeydown(e) {
      if (!this.isOpen || this.resultItems.length === 0) {
        /* If Enter is pressed with no dropdown, let the form submit normally */
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          this._moveSelection(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this._moveSelection(-1);
          break;
        case 'Enter':
          if (this.selectedIndex >= 0) {
            e.preventDefault();
            this.resultItems[this.selectedIndex].click();
          }
          break;
        case 'Escape':
          e.preventDefault();
          this._close();
          this.input.focus();
          break;
      }
    }

    _moveSelection(direction) {
      /* Deselect current */
      if (this.selectedIndex >= 0) {
        this.resultItems[this.selectedIndex].setAttribute('aria-selected', 'false');
      }

      /* Calculate new index (wrap around) */
      if (this.selectedIndex === -1 && direction === -1) {
        this.selectedIndex = this.resultItems.length - 1;
      } else {
        this.selectedIndex = (this.selectedIndex + direction + this.resultItems.length) % this.resultItems.length;
      }

      const item = this.resultItems[this.selectedIndex];
      item.setAttribute('aria-selected', 'true');
      this.input.setAttribute('aria-activedescendant', item.id);

      /* Scroll item into view within the dropdown */
      item.scrollIntoView({ block: 'nearest' });
    }
  }

  /* ================================================================
   * Initialise on DOM ready
   * ================================================================ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new InvictaPredictiveSearch());
  } else {
    new InvictaPredictiveSearch();
  }
})();
