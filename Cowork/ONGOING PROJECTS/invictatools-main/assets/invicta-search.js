/**
 * Invicta Predictive Search — Consolidated v2.0
 *
 * Merges the best of both the Invicta custom search (JSON endpoint, stock
 * badges, ex-VAT pricing, portal positioning) and the Shopify default
 * predictive search (result caching, keyboard navigation, ARIA attributes,
 * AbortController pattern, debounced input).
 *
 * v2.0 adds: search-term highlighting, recent searches, skeleton loading,
 *            no-results state, enhanced "view all" with count.
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
  const RESULTS_LIMIT = 12;
  const CACHE_MAX = 20;
  const FETCH_FIELDS = 'title,body,product_type,vendor,variants.sku,variants.barcode,tag';
  const RECENT_SEARCHES_KEY = 'invicta-recent-searches';
  const RECENT_SEARCHES_MAX = 8;

  /* Strings — hardcoded English, grouped for easy future i18n */
  const STRINGS = {
    recent_searches: 'Recent searches',
    clear_recent: 'Clear recent searches',
    no_results: 'No products found for "\u0071\u0075\u0065\u0072\u0079"',
    no_results_hint: 'Try checking your spelling or using more general terms',
    browse_all: 'Browse all products',
    view_all_results: 'View all \u0063\u006f\u0075\u006e\u0074 results for "\u0071\u0075\u0065\u0072\u0079"',
  };

  /** Replace {{ query }} and {{ count }} placeholders in a template string */
  function tpl(str, vars) {
    let out = str;
    if (vars.query !== undefined) out = out.replace(/query/g, vars.query);
    if (vars.count !== undefined) out = out.replace(/count/g, String(vars.count));
    return out;
  }

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
      this.eventAbortController = new AbortController();
      this.debounceTimer = null;
      this.isOpen = false;
      this.selectedIndex = -1;
      this.resultItems = [];
      this.lastTotalCount = 0;

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
          /* Show recent searches when input is cleared back below threshold */
          if (query.length === 0) {
            this._showRecentSearches();
          }
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
          this._showRecentSearches();
        });
      }

      /* Focus — reopen if results exist, or show recent searches */
      this.input.addEventListener('focus', () => {
        const query = this._getQuery();
        if (query.length >= MIN_QUERY_LENGTH && this.resultsContainer.hasChildNodes()) {
          this._open();
        } else if (query.length === 0) {
          this._showRecentSearches();
        }
      });

      /* Keyboard navigation */
      this.input.addEventListener('keydown', (e) => this._onKeydown(e));

      /* Click outside closes dropdown — uses AbortController for cleanup */
      const signal = this.eventAbortController.signal;

      document.addEventListener('click', (e) => {
        if (!this.wrapper.contains(e.target) && !this.resultsContainer.contains(e.target)) {
          this._close();
        }
      }, { signal });

      /* Reposition on scroll/resize using rAF — uses AbortController for cleanup */
      let scrollRaf = null;
      let resizeRaf = null;

      window.addEventListener('scroll', () => {
        if (!this.isOpen) return;
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          this._positionDropdown();
          scrollRaf = null;
        });
      }, { passive: true, signal });

      window.addEventListener('resize', () => {
        if (!this.isOpen) return;
        if (resizeRaf) return;
        resizeRaf = requestAnimationFrame(() => {
          this._positionDropdown();
          resizeRaf = null;
        });
      }, { passive: true, signal });

      /* Mobile: back button / popstate closes dropdown */
      window.addEventListener('popstate', () => {
        if (this.isOpen && this._isMobile()) {
          this._close();
        }
      }, { signal });
    }

    /* ----------------------------------------------------------------
     * Cleanup — abort all global listeners
     * ---------------------------------------------------------------- */
    destroy() {
      if (this.eventAbortController) {
        this.eventAbortController.abort();
        this.eventAbortController = null;
      }
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
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

    _isMobile() {
      return window.innerWidth < 750;
    }

    /* ----------------------------------------------------------------
     * Dropdown positioning (fixed, viewport-relative)
     * ---------------------------------------------------------------- */
    _positionDropdown() {
      if (!this.isOpen) return;
      const rect = this.wrapper.getBoundingClientRect();
      this.resultsContainer.style.position = 'fixed';
      this.resultsContainer.style.top = (rect.bottom + 8) + 'px';

      if (this._isMobile()) {
        /* Full viewport width on mobile — CSS handles left/right/width */
        this.resultsContainer.style.left = '0';
        this.resultsContainer.style.width = '100vw';
      } else {
        this.resultsContainer.style.left = rect.left + 'px';
        this.resultsContainer.style.width = rect.width + 'px';
      }
    }

    /* ----------------------------------------------------------------
     * Mobile close button (injected into dropdown)
     * ---------------------------------------------------------------- */
    _ensureMobileCloseButton() {
      if (!this._isMobile()) return;

      /* Only add once */
      if (this.resultsContainer.querySelector('.inv-search-results__close')) return;

      const closeBar = document.createElement('div');
      closeBar.className = 'inv-search-results__close';

      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'inv-search-results__close-btn';
      closeBtn.setAttribute('aria-label', 'Close search results');

      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('aria-hidden', 'true');
      const line1 = document.createElementNS(svgNS, 'line');
      line1.setAttribute('x1', '18'); line1.setAttribute('y1', '6');
      line1.setAttribute('x2', '6'); line1.setAttribute('y2', '18');
      svg.appendChild(line1);
      const line2 = document.createElementNS(svgNS, 'line');
      line2.setAttribute('x1', '6'); line2.setAttribute('y1', '6');
      line2.setAttribute('x2', '18'); line2.setAttribute('y2', '18');
      svg.appendChild(line2);
      closeBtn.appendChild(svg);

      const label = document.createElement('span');
      label.textContent = 'Close';
      closeBtn.appendChild(label);

      closeBtn.addEventListener('click', () => this._close());

      closeBar.appendChild(closeBtn);
      this.resultsContainer.insertBefore(closeBar, this.resultsContainer.firstChild);
    }

    /* ----------------------------------------------------------------
     * Open / Close (with CSS animation classes)
     * ---------------------------------------------------------------- */
    _open() {
      this.resultsContainer.style.display = 'block';
      this.resultsContainer.classList.remove('inv-search-results--closing');
      /* will-change hint during animation */
      this.resultsContainer.style.willChange = 'transform, opacity';

      /* Force reflow to ensure the initial state is applied */
      void this.resultsContainer.offsetHeight;

      this.resultsContainer.classList.add('inv-search-results--open');
      this.isOpen = true;
      this.input.setAttribute('aria-expanded', 'true');
      this._positionDropdown();

      /* Add wrapper class for sticky input shadow on mobile */
      this.wrapper.classList.add('inv-search--dropdown-open');

      /* Inject mobile close button */
      this._ensureMobileCloseButton();

      /* Mobile: push history state so back button can close */
      if (this._isMobile() && !this._historyPushed) {
        history.pushState({ invSearchOpen: true }, '');
        this._historyPushed = true;
      }

      /* Remove will-change after animation completes */
      setTimeout(() => {
        this.resultsContainer.style.willChange = '';
      }, 160);
    }

    _close(clear = false) {
      if (this.isOpen) {
        this.resultsContainer.classList.remove('inv-search-results--open');
        this.resultsContainer.classList.add('inv-search-results--closing');

        /* After close animation, hide element */
        setTimeout(() => {
          this.resultsContainer.style.display = 'none';
          this.resultsContainer.classList.remove('inv-search-results--closing');
          if (clear) {
            this._clearElement(this.resultsContainer);
          }
        }, 110);
      } else {
        this.resultsContainer.style.display = 'none';
        if (clear) {
          this._clearElement(this.resultsContainer);
        }
      }

      this.isOpen = false;
      this.selectedIndex = -1;
      this.input.setAttribute('aria-expanded', 'false');
      this.input.removeAttribute('aria-activedescendant');
      this.wrapper.classList.remove('inv-search--dropdown-open');
      this._historyPushed = false;

      /* Deselect any highlighted item */
      this.resultItems.forEach((item) => item.setAttribute('aria-selected', 'false'));
    }

    /* ----------------------------------------------------------------
     * Loading state — skeleton placeholders
     * ---------------------------------------------------------------- */
    _showLoading() {
      this._clearElement(this.resultsContainer);

      for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'inv-search-skeleton';

        const imgPlaceholder = document.createElement('div');
        imgPlaceholder.className = 'inv-search-skeleton__image inv-search-skeleton__pulse';
        skeleton.appendChild(imgPlaceholder);

        const textWrap = document.createElement('div');
        textWrap.className = 'inv-search-skeleton__text';

        const bar1 = document.createElement('div');
        bar1.className = 'inv-search-skeleton__bar inv-search-skeleton__pulse';
        bar1.style.width = '35%';
        textWrap.appendChild(bar1);

        const bar2 = document.createElement('div');
        bar2.className = 'inv-search-skeleton__bar inv-search-skeleton__bar--wide inv-search-skeleton__pulse';
        bar2.style.width = '80%';
        textWrap.appendChild(bar2);

        const bar3 = document.createElement('div');
        bar3.className = 'inv-search-skeleton__bar inv-search-skeleton__pulse';
        bar3.style.width = '50%';
        textWrap.appendChild(bar3);

        skeleton.appendChild(textWrap);
        this.resultsContainer.appendChild(skeleton);
      }

      this._open();
    }

    /* ----------------------------------------------------------------
     * Recent searches
     * ---------------------------------------------------------------- */
    _getRecentSearches() {
      try {
        const raw = sessionStorage.getItem(RECENT_SEARCHES_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (_) {
        return [];
      }
    }

    _saveRecentSearch(term) {
      const trimmed = term.trim();
      if (!trimmed) return;
      let searches = this._getRecentSearches();
      /* Remove duplicate (case-insensitive) */
      searches = searches.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      searches.unshift(trimmed);
      if (searches.length > RECENT_SEARCHES_MAX) searches = searches.slice(0, RECENT_SEARCHES_MAX);
      try {
        sessionStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
      } catch (_) { /* storage full — ignore */ }
    }

    _clearRecentSearches() {
      try { sessionStorage.removeItem(RECENT_SEARCHES_KEY); } catch (_) {}
    }

    _showRecentSearches() {
      const searches = this._getRecentSearches();
      if (searches.length === 0) return;

      this._clearElement(this.resultsContainer);
      this.resultItems = [];
      this.selectedIndex = -1;

      /* Header */
      const header = document.createElement('div');
      header.className = 'inv-search-recent__header';
      header.textContent = STRINGS.recent_searches;
      this.resultsContainer.appendChild(header);

      /* Items */
      searches.forEach((term, idx) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'inv-search-recent__item';
        item.id = 'inv-search-recent-' + idx;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', 'false');

        /* Clock icon */
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'inv-search-recent__icon');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', '12');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '10');
        svg.appendChild(circle);
        const polyline = document.createElementNS(svgNS, 'polyline');
        polyline.setAttribute('points', '12 6 12 12 16 14');
        svg.appendChild(polyline);
        item.appendChild(svg);

        const label = document.createElement('span');
        label.textContent = term;
        item.appendChild(label);

        item.addEventListener('click', () => {
          this.input.value = term;
          this.input.dispatchEvent(new Event('input', { bubbles: true }));
        });

        this.resultsContainer.appendChild(item);
        this.resultItems.push(item);
      });

      /* Clear link */
      const clearLink = document.createElement('button');
      clearLink.type = 'button';
      clearLink.className = 'inv-search-recent__clear';
      clearLink.textContent = STRINGS.clear_recent;
      clearLink.addEventListener('click', () => {
        this._clearRecentSearches();
        this._close(true);
      });
      this.resultsContainer.appendChild(clearLink);

      this._open();
    }

    /* ----------------------------------------------------------------
     * Fetching
     * ---------------------------------------------------------------- */
    _fetchResults(query) {
      const key = this._cacheKey(query);

      /* Check cache first */
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        this._renderResults(cached.products, query, cached.totalCount);
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
          const totalCount = products.length;

          /* Store in cache, evict oldest if over limit */
          if (this.cache.size >= CACHE_MAX) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
          }
          this.cache.set(key, { products: products, totalCount: totalCount });

          this._renderResults(products, query, totalCount);
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
          const retryBtn = document.createElement('button');
          retryBtn.type = 'button';
          retryBtn.className = 'inv-search-empty__browse';
          retryBtn.textContent = 'Try again';
          retryBtn.addEventListener('click', () => this._fetchResults(query));
          errorDiv.appendChild(retryBtn);
          this.resultsContainer.appendChild(errorDiv);
        });
    }

    /* ----------------------------------------------------------------
     * Highlighting helper
     * ---------------------------------------------------------------- */
    _highlightText(text, query) {
      if (!query) return document.createTextNode(text);

      const fragment = document.createDocumentFragment();
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      let lastIndex = 0;
      let idx = lowerText.indexOf(lowerQuery);

      while (idx !== -1) {
        /* Text before match */
        if (idx > lastIndex) {
          fragment.appendChild(document.createTextNode(text.slice(lastIndex, idx)));
        }
        /* The match itself */
        const mark = document.createElement('mark');
        mark.className = 'inv-search-highlight';
        mark.textContent = text.slice(idx, idx + query.length);
        fragment.appendChild(mark);

        lastIndex = idx + query.length;
        idx = lowerText.indexOf(lowerQuery, lastIndex);
      }

      /* Remaining text after last match */
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
      }

      return fragment;
    }

    /* ----------------------------------------------------------------
     * Rendering
     * ---------------------------------------------------------------- */
    _renderResults(products, query, totalCount) {
      this._clearElement(this.resultsContainer);
      this.resultItems = [];
      this.selectedIndex = -1;
      this.lastTotalCount = totalCount || 0;

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
        const anchor = this._buildResultItem(product, index, showVendor, showPrice, query);
        this.resultsContainer.appendChild(anchor);
        this.resultItems.push(anchor);
      });

      /* "View all results" link — enhanced with count */
      const viewAll = document.createElement('a');
      viewAll.href = '/search?type=product&options%5Bprefix%5D=last&q=' + encodeURIComponent(query);
      viewAll.className = 'inv-search-view-all';
      viewAll.id = 'inv-search-view-all';
      viewAll.setAttribute('role', 'option');
      viewAll.setAttribute('aria-selected', 'false');
      viewAll.textContent = 'View all ' + totalCount + ' results for \u201c' + query + '\u201d';

      /* Save recent search when user clicks through to results */
      viewAll.addEventListener('click', () => {
        this._saveRecentSearch(query);
      });

      this.resultsContainer.appendChild(viewAll);
      this.resultItems.push(viewAll);

      this._open();
    }

    _buildResultItem(product, index, showVendor, showPrice, query) {
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
      const vat = window.invictaVat || { exFromInc: function(p) { return Math.round(p * 100 / 120); }, formatPounds: function(p) { return (p / 100).toFixed(2); } };
      const priceExVatPence = vat.exFromInc(product.price);
      const priceExVat = vat.formatPounds(priceExVatPence);
      const priceInc = (product.price / 100).toFixed(2);

      /* Build DOM */
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.className = 'inv-search-results__item';
      anchor.id = 'inv-search-option-' + index;
      anchor.setAttribute('role', 'option');
      anchor.setAttribute('aria-selected', 'false');

      /* Save recent search when user clicks a product */
      anchor.addEventListener('click', () => {
        this._saveRecentSearch(query);
      });

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
      titleP.appendChild(this._highlightText(title, query));
      info.appendChild(titleP);

      /* SKU line — helps tradespeople verify the right product */
      const variants = product.variants || [];
      const sku = variants.length > 0 ? (variants[0].sku || '') : '';
      if (sku) {
        const skuP = document.createElement('p');
        skuP.className = 'inv-search-results__sku';
        skuP.textContent = 'SKU: ' + sku;
        info.appendChild(skuP);
      }

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
      emptyDiv.className = 'inv-search-empty';

      /* Search icon with strikethrough line */
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'inv-search-empty__icon');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.5');
      const circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', '11');
      circle.setAttribute('cy', '11');
      circle.setAttribute('r', '8');
      svg.appendChild(circle);
      const searchLine = document.createElementNS(svgNS, 'path');
      searchLine.setAttribute('d', 'm21 21-4.35-4.35');
      svg.appendChild(searchLine);
      /* Strikethrough line across the icon */
      const strike = document.createElementNS(svgNS, 'line');
      strike.setAttribute('x1', '4');
      strike.setAttribute('y1', '4');
      strike.setAttribute('x2', '20');
      strike.setAttribute('y2', '20');
      strike.setAttribute('stroke', 'currentColor');
      strike.setAttribute('stroke-width', '1.5');
      svg.appendChild(strike);
      emptyDiv.appendChild(svg);

      const heading = document.createElement('p');
      heading.className = 'inv-search-empty__text';
      heading.textContent = 'No results for \u201c' + query + '\u201d';
      emptyDiv.appendChild(heading);

      const hint = document.createElement('p');
      hint.className = 'inv-search-empty__hint';
      hint.textContent = 'Try checking the spelling or searching by brand, category, or part number';
      emptyDiv.appendChild(hint);

      /* Quick links to popular categories */
      const quickLinks = document.createElement('div');
      quickLinks.className = 'inv-search-empty__categories';

      const categories = [
        { label: 'Power Tools', url: '/collections/power-tools' },
        { label: 'Hand Tools', url: '/collections/hand-tools' },
        { label: 'Fixings & Fasteners', url: '/collections/fixings-fasteners' },
        { label: 'Abrasives', url: '/collections/abrasives' },
      ];

      categories.forEach(function (cat) {
        const link = document.createElement('a');
        link.href = cat.url;
        link.className = 'inv-search-empty__cat-link';
        link.textContent = cat.label;
        quickLinks.appendChild(link);
      });

      emptyDiv.appendChild(quickLinks);

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
