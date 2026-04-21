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
   * Strip the `page` query param from an absolute or relative URL.
   * Filter-remove / type-chip hrefs come from Shopify's url_to_remove /
   * url_to_add, which preserve all current params including page — so a
   * user on page 3 who removes a filter would otherwise land on a
   * possibly-empty page 3 of the new result set.
   */
  function stripPageParam(url) {
    try {
      var u = new URL(url, window.location.origin);
      u.searchParams.delete('page');
      return u.pathname + (u.search ? u.search : '') + u.hash;
    } catch (e) {
      return url;
    }
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
   * Capture a serialisable "who's focused" snapshot for a filter form, so
   * we can restore focus to the equivalent post-swap element.
   */
  function captureFocusSnapshot() {
    var el = document.activeElement;
    if (!el || el === document.body) return null;
    var formEl = el.closest('[data-inv-filter-sidebar], [data-inv-filter-drawer-form]');
    var formSelector = null;
    if (formEl && formEl.matches('[data-inv-filter-sidebar]')) formSelector = '[data-inv-filter-sidebar]';
    else if (formEl && formEl.matches('[data-inv-filter-drawer-form]')) formSelector = '[data-inv-filter-drawer-form]';
    if (el.matches('input[type="checkbox"][name]')) {
      return {
        formSelector: formSelector,
        selector: 'input[type="checkbox"][name="' + cssEscape(el.name) + '"][value="' + cssEscape(el.value) + '"]'
      };
    }
    if (el.matches('input[type="number"][name]')) {
      return {
        formSelector: formSelector,
        selector: 'input[type="number"][name="' + cssEscape(el.name) + '"]'
      };
    }
    if (el.matches('[data-inv-sort-select]')) {
      return { formSelector: null, selector: '[data-inv-sort-select]' };
    }
    return null;
  }

  function restoreFocusSnapshot(snapshot) {
    if (!snapshot) return false;
    var scope = snapshot.formSelector ? document.querySelector(snapshot.formSelector) : document;
    if (!scope) return false;
    var el = scope.querySelector(snapshot.selector);
    if (!el) return false;
    el.focus({ preventScroll: true });
    return true;
  }

  function cssEscape(s) {
    return String(s).replace(/(["\\])/g, '\\$1');
  }

  /**
   * Move focus to the result count (or the main content) so screen readers
   * and keyboard users land on the new results instead of body.
   */
  function focusResults() {
    var target = document.querySelector('[data-inv-result-count]')
      || document.querySelector('.inv-empty')
      || document.querySelector('.inv-main');
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  /**
   * Fetch new section HTML, swap DOM, update URL.
   * @param {string} url
   * @param {{ focus?: 'preserve'|'results' }} [options]
   */
  function fetchAndUpdate(url, options) {
    options = options || {};
    if (abortController) abortController.abort();
    var controller = new AbortController();
    abortController = controller;

    var focusSnapshot = options.focus === 'preserve' ? captureFocusSnapshot() : null;

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

            if (options.focus === 'preserve' && focusSnapshot) {
              if (!restoreFocusSnapshot(focusSnapshot)) focusResults();
            } else if (options.focus === 'results') {
              focusResults();
            }
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
   * Validate a price range row. Shows/hides the inline error and toggles
   * an invalid state on the inputs. Returns true if the range is valid.
   */
  function validatePriceRange(row) {
    if (!row) return true;
    var inputs = row.querySelectorAll('input[type="number"]');
    if (inputs.length < 2) return true;
    var minEl = inputs[0];
    var maxEl = inputs[1];
    var errEl = row.querySelector('[data-inv-price-error]');
    var minVal = minEl.value === '' ? null : parseFloat(minEl.value);
    var maxVal = maxEl.value === '' ? null : parseFloat(maxEl.value);
    var invalid = minVal !== null && maxVal !== null && minVal > maxVal;
    if (invalid) {
      row.setAttribute('data-invalid', 'true');
      minEl.setAttribute('aria-invalid', 'true');
      maxEl.setAttribute('aria-invalid', 'true');
      if (errEl) {
        errEl.textContent = 'Min price can’t be greater than max.';
        errEl.hidden = false;
      }
      return false;
    }
    row.removeAttribute('data-invalid');
    minEl.removeAttribute('aria-invalid');
    maxEl.removeAttribute('aria-invalid');
    if (errEl) {
      errEl.textContent = '';
      errEl.hidden = true;
    }
    return true;
  }

  function allPriceRangesValid(form) {
    var rows = form.querySelectorAll('[data-inv-price-range]');
    var ok = true;
    rows.forEach(function(r) { if (!validatePriceRange(r)) ok = false; });
    return ok;
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
      var submitSidebar = function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(function() {
          if (!allPriceRangesValid(sidebarForm)) return;
          fetchAndUpdate(buildFilterUrl(sidebarForm), { focus: 'preserve' });
        }, DEBOUNCE_MS);
      };
      sidebarForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (!allPriceRangesValid(sidebarForm)) return;
        clearTimeout(debounceTimer);
        fetchAndUpdate(buildFilterUrl(sidebarForm), { focus: 'results' });
      });
      sidebarForm.addEventListener('change', function(e) {
        if (e.target.matches('input[type="checkbox"]')) {
          submitSidebar();
        }
      });
      /* Price inputs: live validation on input, apply on blur/Enter. */
      sidebarForm.addEventListener('input', function(e) {
        if (e.target.matches('input[type="number"]')) {
          validatePriceRange(e.target.closest('[data-inv-price-range]'));
        }
      });
      sidebarForm.addEventListener('blur', function(e) {
        if (e.target.matches('input[type="number"]')) {
          var row = e.target.closest('[data-inv-price-range]');
          if (row && validatePriceRange(row)) submitSidebar();
        }
      }, true);
      sidebarForm.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.matches('input[type="number"]')) {
          e.preventDefault();
          var row = e.target.closest('[data-inv-price-range]');
          if (row && validatePriceRange(row)) {
            e.target.blur();
            submitSidebar();
          }
        }
      });
    }

    /* Mobile drawer — instant apply, same model as desktop. */
    var drawerApply = document.querySelector('[data-inv-filter-drawer-apply]');
    var drawerForm = document.querySelector('[data-inv-filter-drawer-form]');
    if (drawerForm) {
      var drawerTimer;
      var submitDrawer = function() {
        clearTimeout(drawerTimer);
        drawerTimer = setTimeout(function() {
          if (!allPriceRangesValid(drawerForm)) return;
          fetchAndUpdate(buildFilterUrl(drawerForm), { focus: 'preserve' });
        }, DEBOUNCE_MS);
      };
      drawerForm.addEventListener('change', function(e) {
        if (e.target.matches('input[type="checkbox"]')) submitDrawer();
      });
      drawerForm.addEventListener('input', function(e) {
        if (e.target.matches('input[type="number"]')) {
          validatePriceRange(e.target.closest('[data-inv-price-range]'));
        }
      });
      drawerForm.addEventListener('blur', function(e) {
        if (e.target.matches('input[type="number"]')) {
          var row = e.target.closest('[data-inv-price-range]');
          if (row && validatePriceRange(row)) submitDrawer();
        }
      }, true);
    }
    /* Apply button no longer submits — it just closes the drawer to
       reveal the (already-updated) grid. Label updates server-side. */
    if (drawerApply) {
      drawerApply.addEventListener('click', function() {
        if (window.InvCollection && typeof window.InvCollection.closeDrawer === 'function') {
          window.InvCollection.closeDrawer();
        } else {
          var closeBtn = document.querySelector('[data-inv-filter-drawer-close]');
          if (closeBtn) closeBtn.click();
        }
      });
    }

    /* Sort select */
    var sortSelect = document.querySelector('[data-inv-sort-select]');
    if (sortSelect) {
      sortSelect.addEventListener('change', function() {
        var params = new URLSearchParams(window.location.search);
        params.set('sort_by', this.value);
        params.delete('page');
        fetchAndUpdate(window.location.pathname + '?' + params.toString(), { focus: 'preserve' });
      });
    }

    /* Pagination links */
    document.querySelectorAll('[data-inv-page-link]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        fetchAndUpdate(link.href, { focus: 'results' });
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
        fetchAndUpdate(stripPageParam(tag.href), { focus: 'results' });
      });
    });
  }

  function reinit() {
    sectionEl = document.querySelector('[data-inv-collection-section]');
    if (sectionEl) {
      sectionId = sectionEl.dataset.invCollectionSection;
      attachListeners();
    }
    /* Re-bind drawer / scroll / drag handlers — their elements were
       replaced by the section innerHTML swap. */
    if (window.InvCollection && typeof window.InvCollection.init === 'function') {
      window.InvCollection.init();
      window.InvCollection.refreshHeroBottom();
    }
  }

  /* Back/forward button support */
  window.addEventListener('popstate', function() {
    fetchAndUpdate(window.location.href);
  });

  /* Initial attach */
  attachListeners();
})();
