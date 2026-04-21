/**
 * Invicta Collection AJAX Filtering v1.0
 * Replaces full-page-reload filtering with fetch + DOM swap.
 * Pattern ported from invicta-search-page.js.
 */
(function() {
  'use strict';

  var sectionEl = document.querySelector('[data-inv-collection-section]');
  if (!sectionEl) return;

  var sectionId = sectionEl.dataset.invCollectionSection;
  var abortController = null;
  var DEBOUNCE_MS = 200;

  /**
   * Build filter URL from form inputs.
   * Mirrors the existing buildFilterUrl() logic.
   */
  function buildFilterUrl(form) {
    var params = new URLSearchParams();
    form.querySelectorAll('input:checked, input[type="number"]').forEach(function(input) {
      if (input.type === 'checkbox' && input.checked) {
        params.append(input.name, input.value);
      } else if (input.type === 'number' && input.value) {
        params.append(input.name, input.value);
      }
    });
    var sortSelect = document.querySelector('[data-inv-sort-select]');
    if (sortSelect && sortSelect.value) params.set('sort_by', sortSelect.value);
    var base = window.location.pathname;
    var qs = params.toString();
    return qs ? base + '?' + qs : base;
  }

  /**
   * Stable screen-reader live region. Lives outside the section so it
   * survives AJAX swaps and reliably announces on text change.
   */
  function ensureLiveRegion() {
    var lr = document.getElementById('InvCollectionLiveRegion');
    if (!lr) {
      lr = document.createElement('div');
      lr.id = 'InvCollectionLiveRegion';
      lr.className = 'visually-hidden';
      lr.setAttribute('aria-live', 'polite');
      lr.setAttribute('role', 'status');
      lr.setAttribute('aria-atomic', 'true');
      document.body.appendChild(lr);
    }
    return lr;
  }

  /**
   * Read the newly-rendered count and announce it to screen readers.
   */
  function announceResults() {
    var lr = ensureLiveRegion();
    var countEl = document.querySelector('[data-inv-result-count]');
    var empty = document.querySelector('.inv-empty');
    var message;
    if (countEl) {
      var n = countEl.textContent.trim().replace(/\s+/g, ' ');
      message = n + ' found.';
    } else if (empty) {
      message = 'No products match your filters.';
    } else {
      return;
    }
    /* Force a change so repeated identical announcements still fire. */
    lr.textContent = '';
    setTimeout(function() { lr.textContent = message; }, 50);
  }

  /**
   * Show/hide loading overlay on the grid.
   */
  function setLoading(isLoading) {
    var main = document.querySelector('.inv-main');
    var grid = document.querySelector('.inv-product-grid, #InvProductGrid');
    if (grid) {
      if (isLoading) {
        grid.setAttribute('aria-busy', 'true');
      } else {
        grid.removeAttribute('aria-busy');
      }
    }
    if (!main) return;
    var overlay = main.querySelector('.inv-grid-loading');
    if (isLoading) {
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'inv-grid-loading';
        overlay.innerHTML = '<div class="inv-grid-loading__spinner" role="status" aria-label="Loading results"></div>';
        main.appendChild(overlay);
      }
    } else if (overlay) {
      overlay.remove();
    }
  }

  /**
   * Fetch new section HTML, swap DOM, update URL.
   */
  function fetchAndUpdate(url) {
    if (abortController) abortController.abort();
    var controller = new AbortController();
    abortController = controller;

    setLoading(true);

    var fetchUrl = url + (url.includes('?') ? '&' : '?') + 'sections=' + sectionId;

    fetch(fetchUrl, { signal: controller.signal })
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function(data) {
        history.pushState({}, '', url);

        if (data[sectionId]) {
          var parser = new DOMParser();
          var doc = parser.parseFromString(data[sectionId], 'text/html');
          var newSection = doc.querySelector('.shopify-section');
          var currentSection = sectionEl.closest('.shopify-section');

          if (newSection && currentSection) {
            currentSection.innerHTML = newSection.innerHTML;
            reinit();
            announceResults();
          }
        }
      })
      .catch(function(err) {
        if (err.name === 'AbortError') return;
        /* On error, fall back to full page load */
        window.location.href = url;
      })
      .finally(function() {
        /* Only clear loading state if this fetch is still the active one.
           A superseding fetch will have replaced abortController. */
        if (abortController === controller) {
          setLoading(false);
          abortController = null;
        }
      });
  }

  /**
   * Attach event listeners to filter forms and sort.
   * Called on init and after every DOM swap.
   */
  function attachListeners() {
    /* Desktop sidebar form */
    var sidebarForm = document.querySelector('[data-inv-filter-sidebar]');
    if (sidebarForm) {
      var debounceTimer;
      sidebarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        fetchAndUpdate(buildFilterUrl(sidebarForm));
      });
      sidebarForm.addEventListener('change', function(e) {
        if (e.target.matches('input[type="checkbox"]')) {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(function() {
            fetchAndUpdate(buildFilterUrl(sidebarForm));
          }, DEBOUNCE_MS);
        }
      });
    }

    /* Mobile drawer apply button */
    var drawerApply = document.querySelector('[data-inv-filter-drawer-apply]');
    var drawerForm = document.querySelector('[data-inv-filter-drawer-form]');
    if (drawerApply && drawerForm) {
      drawerApply.addEventListener('click', function() {
        var closeBtn = document.querySelector('[data-inv-filter-drawer-close]');
        if (closeBtn) closeBtn.click();
        fetchAndUpdate(buildFilterUrl(drawerForm));
      });
    }

    /* Sort select */
    var sortSelect = document.querySelector('[data-inv-sort-select]');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        var params = new URLSearchParams(window.location.search);
        params.set('sort_by', this.value);
        params.delete('page');
        fetchAndUpdate(window.location.pathname + '?' + params.toString());
      });
    }

    /* Pagination links */
    document.querySelectorAll('[data-inv-page-link]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        fetchAndUpdate(link.href);
        var grid = document.querySelector('.inv-product-grid, #InvProductGrid');
        if (grid) {
          var top = grid.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });

    /* Active filter tag removal + type chip filter application */
    document.querySelectorAll('[data-inv-filter-remove], [data-inv-filter-apply]').forEach(function(tag) {
      tag.addEventListener('click', function(e) {
        e.preventDefault();
        fetchAndUpdate(tag.href);
      });
    });
  }

  function reinit() {
    sectionEl = document.querySelector('[data-inv-collection-section]');
    if (sectionEl) {
      sectionId = sectionEl.dataset.invCollectionSection;
      attachListeners();
    }
  }

  /* Back/forward button support */
  window.addEventListener('popstate', function() {
    fetchAndUpdate(window.location.href);
  });

  /* Initial attach */
  attachListeners();
})();
