/**
 * Invicta Search Page v2.0
 * AJAX filtering, sorting, pagination for search results
 * Supports: Brand, Product Type, Price Range, Availability filters
 */
(function () {
  'use strict';

  class InvictaSearch {
    /**
     * @param {HTMLElement} container - The #invicta-search element
     */
    constructor(container) {
      this.container = container;
      this.sectionId = container.dataset.sectionId;
      this.searchTerms = container.dataset.searchTerms || '';
      this.sortBy = container.dataset.sortBy || '';
      this.currentPage = parseInt(container.dataset.page, 10) || 1;

      this.abortController = null;
      this.debounceTimer = null;
      this.debounceDelay = 200;

      this.init();
    }

    init() {
      this.container.addEventListener('click', this.handleClick.bind(this));
      this.container.addEventListener('change', this.handleChange.bind(this));
      this.container.addEventListener('input', this.handleInput.bind(this));
      window.addEventListener('popstate', this.handlePopState.bind(this));
      this._initMobileFilterSheet();
      this._updateMobileFilterCount();
    }

    /* -------------------------------------------------------
       EVENT HANDLERS
    ------------------------------------------------------- */

    handleClick(e) {
      // Filter panel toggle (desktop)
      const toggleBtn = e.target.closest('[data-filter-toggle]');
      if (toggleBtn) {
        e.preventDefault();
        this.toggleFilterPanel();
        return;
      }

      // Mobile filter trigger
      const mobileTrigger = e.target.closest('[data-filter-mobile-trigger]');
      if (mobileTrigger) {
        e.preventDefault();
        this.openMobileFilterSheet();
        return;
      }

      // Mobile filter sheet close
      const sheetClose = e.target.closest('[data-filter-sheet-close]');
      if (sheetClose) {
        e.preventDefault();
        this.closeMobileFilterSheet();
        return;
      }

      // Mobile filter sheet overlay click
      const sheetOverlay = e.target.closest('[data-filter-sheet-overlay]');
      if (sheetOverlay && e.target === sheetOverlay) {
        e.preventDefault();
        this.closeMobileFilterSheet();
        return;
      }

      // Mobile filter sheet apply
      const sheetApply = e.target.closest('[data-filter-sheet-apply]');
      if (sheetApply) {
        e.preventDefault();
        this._syncMobileToDesktop();
        this.closeMobileFilterSheet();
        this.fetchFromFilters();
        return;
      }

      // Accordion toggle
      const accordionBtn = e.target.closest('[data-accordion-toggle]');
      if (accordionBtn) {
        e.preventDefault();
        this.toggleAccordion(accordionBtn);
        return;
      }

      // Price apply button
      const priceApply = e.target.closest('[data-price-apply]');
      if (priceApply) {
        e.preventDefault();
        this.fetchFromFilters();
        return;
      }

      // Active filter tag remove
      const tagRemove = e.target.closest('.inv-filters__tag-remove');
      if (tagRemove) {
        e.preventDefault();
        this.removeFilterTag(tagRemove.closest('.inv-filters__tag'));
        return;
      }

      // Clear all filters
      const clearAll = e.target.closest('[data-clear-all-filters]');
      if (clearAll) {
        e.preventDefault();
        this.clearAllFilters();
        return;
      }

      // Pagination link
      const pageLink = e.target.closest('[data-inv-page-link]');
      if (pageLink) {
        e.preventDefault();
        this.navigateToPage(pageLink.href);
        return;
      }

      // Product-type chip
      const typeChip = e.target.closest('[data-type-chip]');
      if (typeChip) {
        e.preventDefault();
        this.selectTypeChip(typeChip);
        return;
      }
    }

    handleChange(e) {
      // Sort dropdown
      const sortSelect = e.target.closest('[data-inv-sort-select]');
      if (sortSelect) {
        this.changeSort(sortSelect.value);
        return;
      }

      // Filter checkboxes (brand, type, availability)
      if (e.target.type === 'checkbox' && e.target.closest('.inv-filter-checkbox')) {
        this._dispatchFilterEvent(e.target);
        this.debouncedFetch();
        return;
      }
    }

    handleInput(e) {
      // Filter search inputs (brand/type local filtering)
      const filterInput = e.target.closest('[data-filter-search]');
      if (filterInput) {
        this.filterListLocally(filterInput);
        return;
      }
    }

    /* -------------------------------------------------------
       FILTER PANEL
    ------------------------------------------------------- */

    toggleFilterPanel() {
      const panel = this.container.querySelector('[data-filter-panel]');
      const btn = this.container.querySelector('[data-filter-toggle]');
      if (!panel || !btn) return;

      const isOpen = panel.getAttribute('aria-hidden') === 'false';
      panel.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    }

    toggleAccordion(btn) {
      const group = btn.closest('.inv-filter-group');
      if (!group) return;

      const content = group.querySelector('.inv-filter-group__body');
      if (!content) return;

      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      content.setAttribute('aria-hidden', isOpen ? 'true' : 'false');
    }

    /* -------------------------------------------------------
       LOCAL FILTER SEARCH (brands/types list narrowing)
    ------------------------------------------------------- */

    filterListLocally(input) {
      const query = input.value.toLowerCase().trim();
      const group = input.closest('.inv-filter-group');
      if (!group) return;

      const items = group.querySelectorAll('.inv-filter-checkbox');
      items.forEach(item => {
        const label = item.querySelector('.inv-filter-checkbox__label');
        if (!label) return;
        const text = label.textContent.toLowerCase();
        item.style.display = text.includes(query) ? '' : 'none';
      });
    }

    /* -------------------------------------------------------
       MOBILE FILTER BOTTOM SHEET
    ------------------------------------------------------- */

    _initMobileFilterSheet() {
      if (this._escapeHandler) {
        document.removeEventListener('keydown', this._escapeHandler);
      }
      this._escapeHandler = (e) => {
        if (e.key === 'Escape') {
          const sheet = document.querySelector('.inv-filter-sheet');
          if (sheet && sheet.classList.contains('inv-filter-sheet--open')) {
            e.preventDefault();
            this.closeMobileFilterSheet();
          }
        }
      };
      document.addEventListener('keydown', this._escapeHandler);
    }

    openMobileFilterSheet() {
      const overlay = document.querySelector('[data-filter-sheet-overlay]');
      const sheet = document.querySelector('.inv-filter-sheet');
      if (!overlay || !sheet) return;

      this._previousFocus = document.activeElement;

      this._syncDesktopToMobile();

      overlay.classList.add('inv-filter-sheet--open');
      sheet.classList.add('inv-filter-sheet--open');
      document.body.style.overflow = 'hidden';

      this._focusTrapHandler = (e) => {
        if (e.key !== 'Tab') return;
        const focusable = sheet.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      sheet.addEventListener('keydown', this._focusTrapHandler);

      /* Focus the close button for accessibility */
      const closeBtn = sheet.querySelector('[data-filter-sheet-close]');
      if (closeBtn) setTimeout(() => closeBtn.focus(), 100);
    }

    closeMobileFilterSheet() {
      const overlay = document.querySelector('[data-filter-sheet-overlay]');
      const sheet = document.querySelector('.inv-filter-sheet');
      if (!overlay || !sheet) return;

      sheet.classList.remove('inv-filter-sheet--open');
      setTimeout(() => {
        overlay.classList.remove('inv-filter-sheet--open');
        document.body.style.overflow = '';
      }, 300);

      if (this._focusTrapHandler) { sheet.removeEventListener('keydown', this._focusTrapHandler); }
      if (this._previousFocus) { this._previousFocus.focus(); this._previousFocus = null; }
    }

    _syncMobileToDesktop() {
      const panel = this.container.querySelector('#inv-filter-panel');
      const sheet = this.container.querySelector('.inv-filter-sheet__body');
      if (!panel || !sheet) return;

      sheet.querySelectorAll('input[type="checkbox"]').forEach(mobileCb => {
        const desktopCb = panel.querySelector(
          'input[name="' + CSS.escape(mobileCb.name) + '"][value="' + CSS.escape(mobileCb.value) + '"]'
        );
        if (desktopCb) desktopCb.checked = mobileCb.checked;
      });

      const mobileMin = sheet.querySelector('[data-price-min]');
      const mobileMax = sheet.querySelector('[data-price-max]');
      const desktopMin = panel.querySelector('[data-price-min]');
      const desktopMax = panel.querySelector('[data-price-max]');
      if (mobileMin && desktopMin) desktopMin.value = mobileMin.value;
      if (mobileMax && desktopMax) desktopMax.value = mobileMax.value;
    }

    _syncDesktopToMobile() {
      const panel = this.container.querySelector('#inv-filter-panel');
      const sheet = this.container.querySelector('.inv-filter-sheet__body');
      if (!panel || !sheet) return;

      panel.querySelectorAll('input[type="checkbox"]').forEach(desktopCb => {
        const mobileCb = sheet.querySelector(
          'input[name="' + CSS.escape(desktopCb.name) + '"][value="' + CSS.escape(desktopCb.value) + '"]'
        );
        if (mobileCb) mobileCb.checked = desktopCb.checked;
      });

      const desktopMin = panel.querySelector('[data-price-min]');
      const desktopMax = panel.querySelector('[data-price-max]');
      const mobileMin = sheet.querySelector('[data-price-min]');
      const mobileMax = sheet.querySelector('[data-price-max]');
      if (desktopMin && mobileMin) mobileMin.value = desktopMin.value;
      if (desktopMax && mobileMax) mobileMax.value = desktopMax.value;
    }

    _updateMobileFilterCount() {
      const trigger = document.querySelector('[data-filter-mobile-trigger]');
      if (!trigger) return;

      const checkedCount = this.container.querySelectorAll(
        '.inv-filter-panel input[type="checkbox"]:checked'
      ).length;
      const priceMin = this.container.querySelector('[data-price-min]');
      const priceMax = this.container.querySelector('[data-price-max]');
      let count = checkedCount;
      if (priceMin && priceMin.value) count++;
      if (priceMax && priceMax.value) count++;

      const countEl = trigger.querySelector('.inv-filter-mobile-trigger__count');
      if (countEl) {
        countEl.textContent = count;
        countEl.style.display = count > 0 ? '' : 'none';
      }

      /* Update trigger text */
      const textEl = trigger.querySelector('.inv-filter-mobile-trigger__text');
      if (textEl) {
        textEl.textContent = count > 0 ? 'Filters (' + count + ')' : 'Filters';
      }
    }

    /* -------------------------------------------------------
       URL BUILDING
    ------------------------------------------------------- */

    buildUrl() {
      const panel = this.container.querySelector('#inv-filter-panel') || this.container;
      const url = new URL(window.location.origin + '/search');

      if (this.searchTerms) {
        url.searchParams.set('q', this.searchTerms);
      }
      url.searchParams.set('type', 'product');
      url.searchParams.set('options[prefix]', 'last');

      // Sort
      const sortSelect = this.container.querySelector('[data-inv-sort-select]');
      if (sortSelect && sortSelect.value) {
        url.searchParams.set('sort_by', sortSelect.value);
      }

      // Brand checkboxes
      panel.querySelectorAll('input[name="filter.p.vendor"]:checked').forEach(cb => {
        url.searchParams.append('filter.p.vendor', cb.value);
      });

      // Product type checkboxes
      panel.querySelectorAll('input[name="filter.p.product_type"]:checked').forEach(cb => {
        url.searchParams.append('filter.p.product_type', cb.value);
      });

      // Price range — Shopify expects values in subunits (pence)
      const priceMin = panel.querySelector('[data-price-min]');
      const priceMax = panel.querySelector('[data-price-max]');
      let minVal = priceMin && priceMin.value !== '' ? parseFloat(priceMin.value) : NaN;
      let maxVal = priceMax && priceMax.value !== '' ? parseFloat(priceMax.value) : NaN;
      if (!isNaN(minVal) && !isNaN(maxVal) && minVal > maxVal) {
        const temp = minVal;
        minVal = maxVal;
        maxVal = temp;
        if (priceMin) priceMin.value = minVal;
        if (priceMax) priceMax.value = maxVal;
      }
      if (!isNaN(minVal) && minVal > 0) {
        url.searchParams.set('filter.v.price.gte', (minVal * 100).toString());
      }
      if (!isNaN(maxVal) && maxVal > 0) {
        url.searchParams.set('filter.v.price.lte', (maxVal * 100).toString());
      }

      // Availability
      const availCb = panel.querySelector('input[name="filter.v.availability"]');
      if (availCb && availCb.checked) {
        url.searchParams.set('filter.v.availability', '1');
      }

      return url;
    }

    /* -------------------------------------------------------
       FILTER ACTIONS
    ------------------------------------------------------- */

    removeFilterTag(tag) {
      if (!tag) return;
      const param = tag.dataset.filterParam;
      const value = tag.dataset.filterValue;

      if (param === 'filter.v.price.gte' || param === 'filter.v.price.lte') {
        // Clear price inputs
        const minInput = this.container.querySelector('[data-price-min]');
        const maxInput = this.container.querySelector('[data-price-max]');
        if (minInput) minInput.value = '';
        if (maxInput) maxInput.value = '';
      } else if (param === 'filter.v.availability') {
        const cb = this.container.querySelector('input[name="filter.v.availability"]');
        if (cb) cb.checked = false;
      } else {
        // Uncheck the corresponding checkbox
        const cb = this.container.querySelector(
          `input[name="${CSS.escape(param)}"][value="${CSS.escape(value)}"]`
        );
        if (cb) cb.checked = false;
      }

      this.fetchFromFilters();
    }

    clearAllFilters() {
      // Uncheck all filter checkboxes
      this.container.querySelectorAll('.inv-filter-panel input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
      // Clear price inputs
      const minInput = this.container.querySelector('[data-price-min]');
      const maxInput = this.container.querySelector('[data-price-max]');
      if (minInput) minInput.value = '';
      if (maxInput) maxInput.value = '';

      this.fetchFromFilters();
    }

    changeSort(sortValue) {
      this._dispatchSearchEvent('invicta:search:sort', { sort_value: sortValue });
      const url = this.buildUrl();
      url.searchParams.set('sort_by', sortValue);
      url.searchParams.delete('page');
      this.fetchAndUpdate(url.toString());
    }

    selectTypeChip(chip) {
      const value = chip.dataset.typeValue || '';
      // Wipe any existing product_type selections (both desktop and mobile instances)
      this.container.querySelectorAll('input[name="filter.p.product_type"]').forEach(cb => {
        cb.checked = false;
      });
      // Check the matching boxes when a specific type is chosen
      if (value) {
        this.container.querySelectorAll(
          `input[name="filter.p.product_type"][value="${CSS.escape(value)}"]`
        ).forEach(cb => { cb.checked = true; });
        this._dispatchSearchEvent('invicta:search:filter', {
          filter_type: 'product_type',
          filter_value: value,
          source: 'chip'
        });
      } else {
        this._dispatchSearchEvent('invicta:search:filter', {
          filter_type: 'product_type',
          filter_value: '',
          source: 'chip_clear'
        });
      }
      this.fetchFromFilters();
    }

    /* -------------------------------------------------------
       CUSTOM EVENTS — for GA4 + VAT re-apply hooks
    ------------------------------------------------------- */

    _dispatchSearchEvent(name, detail) {
      const base = {
        term: this.searchTerms,
        results_count: this._readResultsCount(),
        active_filters_count: this._readActiveFiltersCount()
      };
      document.dispatchEvent(new CustomEvent(name, {
        detail: Object.assign(base, detail || {})
      }));
    }

    _dispatchFilterEvent(checkbox) {
      let filterType = 'other';
      switch (checkbox.name) {
        case 'filter.p.vendor': filterType = 'vendor'; break;
        case 'filter.p.product_type': filterType = 'product_type'; break;
        case 'filter.v.availability': filterType = 'availability'; break;
      }
      this._dispatchSearchEvent('invicta:search:filter', {
        filter_type: filterType,
        filter_value: checkbox.value,
        source: checkbox.checked ? 'checkbox_add' : 'checkbox_remove'
      });
    }

    _readResultsCount() {
      const blob = document.querySelector('[data-inv-ga4-search]');
      if (!blob) return 0;
      try { return JSON.parse(blob.textContent).results_count || 0; }
      catch (_) { return 0; }
    }

    _readActiveFiltersCount() {
      const boxes = this.container.querySelectorAll(
        '.inv-filter-panel input[type="checkbox"]:checked'
      ).length;
      const priceMin = this.container.querySelector('[data-price-min]');
      const priceMax = this.container.querySelector('[data-price-max]');
      let count = boxes;
      if (priceMin && priceMin.value) count++;
      if (priceMax && priceMax.value) count++;
      return count;
    }

    navigateToPage(href) {
      this.fetchAndUpdate(href);
      // Scroll to top of results grid
      const grid = this.container.querySelector('.inv-search__grid');
      if (grid) {
        const offset = 80;
        const top = grid.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }

    /* -------------------------------------------------------
       FETCH
    ------------------------------------------------------- */

    debouncedFetch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.fetchFromFilters();
      }, this.debounceDelay);
    }

    fetchFromFilters() {
      const url = this.buildUrl();
      url.searchParams.delete('page'); // Reset to page 1
      this.fetchAndUpdate(url.toString());
    }

    async fetchAndUpdate(url) {
      if (this.abortController) {
        this.abortController.abort();
      }
      this.abortController = new AbortController();

      this.setLoading(true);

      // Save UI state for restoration after DOM swap
      const openAccordions = this.getAccordionStates();
      const scrollPositions = this.getFilterScrollPositions();
      const panel = this.container.querySelector('[data-filter-panel]');
      const panelOpen = panel ? panel.getAttribute('aria-hidden') === 'false' : true;

      try {
        const fetchUrl = url + (url.includes('?') ? '&' : '?') + 'sections=' + this.sectionId;
        const response = await fetch(fetchUrl, { signal: this.abortController.signal });

        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();

        history.pushState({}, '', url);

        if (data[this.sectionId]) {
          this.updateSection(data[this.sectionId], openAccordions, scrollPositions, panelOpen);
        }

        this.announceUpdate();
      } catch (err) {
        if (err.name === 'AbortError') return;
        this.setLoading(false);
        const grid = this.container.querySelector('.inv-grid__products');
        if (grid) {
          grid.innerHTML = '<li style="grid-column:1/-1;text-align:center;padding:40px 20px;">' +
            '<p style="color:#6b7280;margin:0 0 12px;">Something went wrong loading results.</p>' +
            '<button type="button" onclick="window.location.reload()" ' +
            'style="padding:8px 20px;background:#e11d26;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:14px;">' +
            'Try again</button></li>';
        }
      } finally {
        this.setLoading(false);
        this.abortController = null;
      }
    }

    /* -------------------------------------------------------
       DOM UPDATE
    ------------------------------------------------------- */

    updateSection(html, openAccordions, scrollPositions, panelOpen) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.body.firstElementChild;

      if (newContent) {
        this.container.replaceWith(newContent);

        const newContainer = document.getElementById('invicta-search');
        if (newContainer) {
          const instance = new InvictaSearch(newContainer);

          // Restore filter panel open/close state
          const newPanel = newContainer.querySelector('[data-filter-panel]');
          const newToggle = newContainer.querySelector('[data-filter-toggle]');
          if (newPanel && newToggle) {
            newPanel.setAttribute('aria-hidden', panelOpen ? 'false' : 'true');
            newToggle.setAttribute('aria-expanded', panelOpen ? 'true' : 'false');
          }

          // Restore accordion states
          instance.restoreAccordions(openAccordions);
          // Restore scroll positions
          instance.restoreFilterScrollPositions(scrollPositions);

          // Notify the rest of the app (GA4 listener re-emits view_search_results).
          instance._dispatchSearchEvent('invicta:search:updated', {});

          // Re-sync VAT ex/inc class on the freshly-rendered cards.
          if (window.InvictaVAT && typeof window.InvictaVAT.reapply === 'function') {
            window.InvictaVAT.reapply();
          }
        }
      }
    }

    getAccordionStates() {
      const states = {};
      this.container.querySelectorAll('.inv-filter-group').forEach(group => {
        const id = group.dataset.filterGroupId;
        const btn = group.querySelector('[data-accordion-toggle]');
        if (id && btn) {
          states[id] = btn.getAttribute('aria-expanded') === 'true';
        }
      });
      return states;
    }

    restoreAccordions(states) {
      if (!states || !Object.keys(states).length) return;
      this.container.querySelectorAll('.inv-filter-group').forEach(group => {
        const id = group.dataset.filterGroupId;
        const btn = group.querySelector('[data-accordion-toggle]');
        const body = group.querySelector('.inv-filter-group__body');
        if (!btn || !body || !id || !(id in states)) return;

        const isOpen = states[id];
        btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        body.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      });
    }

    getFilterScrollPositions() {
      const positions = {};
      this.container.querySelectorAll('.inv-filter-group__list').forEach(list => {
        const group = list.closest('.inv-filter-group');
        if (group && group.dataset.filterGroupId) {
          positions[group.dataset.filterGroupId] = list.scrollTop;
        }
      });
      return positions;
    }

    restoreFilterScrollPositions(positions) {
      if (!positions) return;
      this.container.querySelectorAll('.inv-filter-group__list').forEach(list => {
        const group = list.closest('.inv-filter-group');
        if (group && group.dataset.filterGroupId && positions[group.dataset.filterGroupId]) {
          list.scrollTop = positions[group.dataset.filterGroupId];
        }
      });
    }

    /* -------------------------------------------------------
       UI HELPERS
    ------------------------------------------------------- */

    setLoading(loading) {
      this.container.classList.toggle('inv-search--loading', loading);
    }

    announceUpdate() {
      const announce = document.getElementById('inv-search-announce');
      if (!announce) return;

      const countEl = this.container.querySelector('.inv-grid__count strong');
      const count = countEl ? countEl.textContent : '0';

      announce.textContent = 'Search results updated. ' + count + ' products found.';
      setTimeout(() => { announce.textContent = ''; }, 1000);

      /* Update mobile filter count after DOM swap */
      this._updateMobileFilterCount();
    }

    handlePopState() {
      window.location.reload();
    }
  }

  /* -------------------------------------------------------
     INIT
  ------------------------------------------------------- */

  function init() {
    const container = document.getElementById('invicta-search');
    if (container) {
      new InvictaSearch(container);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
