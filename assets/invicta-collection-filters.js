/**
 * Invicta Collection Filters v4.2
 * Extracted from inline — no Liquid dependencies
 *
 * AJAX-powered multi-select filters with:
 * - Section Rendering API for partial updates
 * - pushState for clean URL updates
 * - Debounced requests with AbortController
 * - Skeleton loading on product grid
 * - Full accessibility support
 * - Proper event listener cleanup via AbortController signal (H7 fix)
 */
(function() {
  'use strict';

  class InvictaFilters {
    /**
     * @param {HTMLElement} container - The filter container
     */
    constructor(container) {
      this.container = container;
      this.collectionUrl = container.dataset.collectionUrl || window.location.pathname;
      this.sectionId = container.dataset.sectionId;
      this.productGridId = container.dataset.productGridId || 'inv-product-grid';
      this.abortController = null;
      this.debounceTimer = null;
      this.debounceDelay = 150;

      /** @type {AbortController} Controls all event listener lifecycles for cleanup */
      this._listenerController = new AbortController();

      this.activeBrands = new Set(
        (container.dataset.activeBrands || '').split('|||').filter(Boolean)
      );
      this.activeRanges = new Set(
        (container.dataset.activeRanges || '').split('|||').filter(Boolean)
      );
      this.activeStocked = container.dataset.activeStocked || '';

      this.init();
    }

    init() {
      // Abort any previous listeners before re-adding (prevents duplicates on re-init)
      this.destroy();
      this._listenerController = new AbortController();
      const signal = this._listenerController.signal;

      this.container.addEventListener('click', this.handleClick.bind(this), { signal });
      this._boundPopState = this.handlePopState.bind(this);
      window.addEventListener('popstate', this._boundPopState, { signal });
      this.initScrollArrows(signal);
    }

    /**
     * Clean up all event listeners. Called before re-initialization
     * and can be called externally to fully tear down the instance.
     */
    destroy() {
      if (this._listenerController) {
        this._listenerController.abort();
      }
      clearTimeout(this.debounceTimer);
      if (this.abortController) {
        this.abortController.abort();
        this.abortController = null;
      }
    }

    initScrollArrows(signal) {
      const scrollContainers = this.container.querySelectorAll('.inv-filters__scroll-container');

      scrollContainers.forEach(container => {
        const wrapper = container.querySelector('.inv-filters__scroll-wrapper');
        const leftBtn = container.querySelector('.inv-filters__scroll-btn--left');
        const rightBtn = container.querySelector('.inv-filters__scroll-btn--right');

        if (!wrapper || !leftBtn || !rightBtn) return;

        const scrollAmount = 200;

        const updateArrows = () => {
          const { scrollLeft, scrollWidth, clientWidth } = wrapper;
          const maxScroll = scrollWidth - clientWidth;
          leftBtn.hidden = scrollLeft <= 0;
          rightBtn.hidden = scrollLeft >= maxScroll - 1;
        };

        leftBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }, { signal });

        rightBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }, { signal });

        wrapper.addEventListener('scroll', updateArrows, { passive: true, signal });
        window.addEventListener('resize', updateArrows, { passive: true, signal });
        updateArrows();
      });
    }

    handleClick(e) {
      const btn = e.target.closest('.inv-filters__btn');
      if (btn) {
        e.preventDefault();
        this.handleFilterClick(btn);
        return;
      }

      const tagRemove = e.target.closest('.inv-filters__tag-remove');
      if (tagRemove) {
        e.preventDefault();
        const tag = tagRemove.closest('.inv-filters__tag');
        this.handleTagRemove(tag);
        return;
      }

      const clearAll = e.target.closest('.inv-filters__clear-all');
      if (clearAll) {
        e.preventDefault();
        this.clearAllFilters();
        return;
      }
    }

    handleFilterClick(btn) {
      const filterType = btn.dataset.filterType;
      const filterValue = btn.dataset.filterValue;
      const isActive = btn.classList.contains('inv-filters__btn--active');

      if (filterType === 'brand') {
        if (isActive) {
          this.activeBrands.delete(filterValue);
        } else {
          this.activeBrands.add(filterValue);
        }
        btn.classList.toggle('inv-filters__btn--active');
        btn.setAttribute('aria-pressed', (!isActive).toString());

      } else if (filterType === 'range') {
        if (isActive) {
          this.activeRanges.delete(filterValue);
        } else {
          this.activeRanges.add(filterValue);
        }
        btn.classList.toggle('inv-filters__btn--active');
        btn.setAttribute('aria-pressed', (!isActive).toString());

      } else if (filterType === 'stocked') {
        if (filterValue === '') {
          this.activeStocked = '';
        } else if (isActive) {
          this.activeStocked = '';
        } else {
          this.activeStocked = filterValue;
        }

        this.container.querySelectorAll('[data-filter-type="stocked"]').forEach(b => {
          const btnValue = b.dataset.filterValue;
          if (this.activeStocked === '' && btnValue === '') {
            b.classList.add('inv-filters__btn--active');
            b.setAttribute('aria-pressed', 'true');
          } else if (this.activeStocked === btnValue && btnValue !== '') {
            b.classList.add('inv-filters__btn--active');
            b.setAttribute('aria-pressed', 'true');
          } else {
            b.classList.remove('inv-filters__btn--active');
            b.setAttribute('aria-pressed', 'false');
          }
        });
      }

      this.debouncedFetch();
    }

    handleTagRemove(tag) {
      const filterType = tag.dataset.filterType;
      const filterValue = tag.dataset.filterValue;

      if (filterType === 'brand') {
        this.activeBrands.delete(filterValue);
      } else if (filterType === 'range') {
        this.activeRanges.delete(filterValue);
      }

      tag.style.opacity = '0';
      tag.style.transform = 'scale(0.8)';

      const btn = this.container.querySelector(
        `.inv-filters__btn[data-filter-value="${CSS.escape(filterValue)}"][data-filter-type="${filterType}"]`
      );
      if (btn) {
        btn.classList.remove('inv-filters__btn--active');
        btn.setAttribute('aria-pressed', 'false');
      }

      this.debouncedFetch();
    }

    clearAllFilters() {
      this.activeBrands.clear();
      this.activeRanges.clear();
      this.activeStocked = '';

      this.container.querySelectorAll('.inv-filters__btn--active').forEach(btn => {
        btn.classList.remove('inv-filters__btn--active');
        btn.setAttribute('aria-pressed', 'false');
      });

      this.debouncedFetch();
    }

    debouncedFetch() {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.fetchFiltered();
      }, this.debounceDelay);
    }

    buildUrl() {
      const url = new URL(window.location.origin + this.collectionUrl);

      this.activeBrands.forEach(brand => {
        url.searchParams.append('filter.p.vendor', brand);
      });

      this.activeRanges.forEach(range => {
        url.searchParams.append('filter.p.m.custom.range', range);
      });

      if (this.activeStocked) {
        url.searchParams.append('filter.p.m.custom.stocked', this.activeStocked);
      }

      return url;
    }

    async fetchFiltered() {
      if (this.abortController) {
        this.abortController.abort();
      }

      this.abortController = new AbortController();
      const url = this.buildUrl();
      this.setLoadingState(true);

      try {
        const sectionsParam = `${this.sectionId},invicta-product-grid`;
        const fetchUrl = `${url.toString()}${url.search ? '&' : '?'}sections=${sectionsParam}`;

        const response = await fetch(fetchUrl, {
          signal: this.abortController.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        history.pushState({}, '', url.toString());

        if (data[this.sectionId]) {
          this.updateSection(this.container, data[this.sectionId]);
        }

        if (data['invicta-product-grid']) {
          const gridContainer = document.getElementById(this.productGridId);
          if (gridContainer) {
            const gridSection = gridContainer.closest('.inv-product-grid-section') || gridContainer.closest('[data-section-type="invicta-product-grid"]');
            if (gridSection) {
              this.updateSection(gridSection, data['invicta-product-grid']);
            }
          }
        }

        this.announceResults();
        this.syncStockedButtons();

      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('[Invicta Filters] Fetch error:', err);
        window.location.href = url.toString();

      } finally {
        this.setLoadingState(false);
        this.abortController = null;
      }
    }

    updateSection(container, html) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const newContent = doc.body.firstElementChild;

      if (newContent) {
        // Destroy current listeners before replacing the DOM node
        if (container === this.container) {
          this.destroy();
        }

        container.replaceWith(newContent);

        if (container === this.container) {
          const newContainer = document.getElementById('invicta-collection-filters');
          if (newContainer) {
            this.container = newContainer;
            this.init();
          }
        }
      }
    }

    setLoadingState(loading) {
      this.container.classList.toggle('inv-filters--loading', loading);

      const grid = document.querySelector('.inv-grid');
      if (grid) {
        grid.classList.toggle('inv-grid--loading', loading);
      }
    }

    announceResults() {
      const announce = document.getElementById('inv-filters-announce');
      if (!announce) return;

      const countEl = document.querySelector('.inv-grid__count strong');
      const count = countEl ? countEl.textContent : '0';
      const totalFilters = this.activeBrands.size + this.activeRanges.size;

      if (totalFilters === 0) {
        announce.textContent = `Showing all products. ${count} products found.`;
      } else {
        announce.textContent = `Filters applied. ${count} products found.`;
      }

      setTimeout(() => {
        announce.textContent = '';
      }, 1000);
    }

    syncStockedButtons() {
      const urlHasStocked = window.location.href.includes('stocked=true');
      const stockedBtns = this.container.querySelectorAll('[data-filter-type="stocked"]');

      stockedBtns.forEach(btn => {
        const isStockedBtn = btn.dataset.filterValue === 'true';
        const shouldBeActive = urlHasStocked ? isStockedBtn : !isStockedBtn;
        btn.classList.toggle('inv-filters__btn--active', shouldBeActive);
        btn.setAttribute('aria-pressed', shouldBeActive.toString());
      });

      this.activeStocked = urlHasStocked ? 'true' : '';
    }

    handlePopState() {
      const url = new URL(window.location.href);
      this.activeBrands = new Set(url.searchParams.getAll('filter.p.vendor'));
      this.activeRanges = new Set(url.searchParams.getAll('filter.p.m.custom.range'));
      this.activeStocked = url.searchParams.get('filter.p.m.custom.stocked') || '';
      this.fetchFiltered();
    }
  }

  function init() {
    const container = document.getElementById('invicta-collection-filters');
    if (container) {
      const filters = new InvictaFilters(container);
      filters.syncStockedButtons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
