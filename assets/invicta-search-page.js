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
    }

    /* -------------------------------------------------------
       EVENT HANDLERS
    ------------------------------------------------------- */

    handleClick(e) {
      // Filter panel toggle
      const toggleBtn = e.target.closest('[data-filter-toggle]');
      if (toggleBtn) {
        e.preventDefault();
        this.toggleFilterPanel();
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
       URL BUILDING
    ------------------------------------------------------- */

    buildUrl() {
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
      this.container.querySelectorAll('input[name="filter.p.vendor"]:checked').forEach(cb => {
        url.searchParams.append('filter.p.vendor', cb.value);
      });

      // Product type checkboxes
      this.container.querySelectorAll('input[name="filter.p.product_type"]:checked').forEach(cb => {
        url.searchParams.append('filter.p.product_type', cb.value);
      });

      // Price range — Shopify expects values in subunits (pence)
      const priceMin = this.container.querySelector('[data-price-min]');
      const priceMax = this.container.querySelector('[data-price-max]');
      if (priceMin && priceMin.value !== '') {
        const val = parseFloat(priceMin.value);
        if (!isNaN(val) && val > 0) {
          url.searchParams.set('filter.v.price.gte', (val * 100).toString());
        }
      }
      if (priceMax && priceMax.value !== '') {
        const val = parseFloat(priceMax.value);
        if (!isNaN(val) && val > 0) {
          url.searchParams.set('filter.v.price.lte', (val * 100).toString());
        }
      }

      // Availability
      const availCb = this.container.querySelector('input[name="filter.v.availability"]');
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
      const url = this.buildUrl();
      url.searchParams.set('sort_by', sortValue);
      url.searchParams.delete('page');
      this.fetchAndUpdate(url.toString());
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
        console.error('[Invicta Search] Fetch error:', err);
        window.location.href = url;
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
