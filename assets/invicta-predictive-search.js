/**
 * Invicta Predictive Search v7.4
 * Extracted from inline — no Liquid dependencies
 */
(function() {
  'use strict';

  const wrapper = document.querySelector('.inv-search-wrapper');
  if (!wrapper) return;

  const input = wrapper.querySelector('.inv-search-input');
  const clearBtn = wrapper.querySelector('.inv-search-clear');
  const results = wrapper.querySelector('.inv-search-results');

  let debounceTimer = null;
  let currentQuery = '';
  let abortController = null;

  /* CLEAR BUTTON */
  if (clearBtn && input) {
    clearBtn.addEventListener('click', function() {
      input.value = '';
      input.focus();
      results.innerHTML = '';
      results.style.display = 'none';
    });
  }

  /* LIVE SEARCH */
  if (input && results) {
    input.addEventListener('input', function() {
      const query = this.value.trim();

      clearTimeout(debounceTimer);

      if (query.length < 2) {
        results.innerHTML = '';
        results.style.display = 'none';
        return;
      }

      results.innerHTML = '<div class="inv-search-results__loading"><div class="inv-search-results__spinner"></div></div>';
      results.style.display = 'block';

      debounceTimer = setTimeout(function() {
        if (query !== currentQuery) {
          currentQuery = query;
          fetchResults(query);
        }
      }, 300);
    });

    input.addEventListener('blur', function() {
      setTimeout(function() {
        if (!wrapper.contains(document.activeElement)) {
          results.style.display = 'none';
        }
      }, 200);
    });

    input.addEventListener('focus', function() {
      if (results.innerHTML && this.value.length >= 2) {
        results.style.display = 'block';
      }
    });
  }

  function fetchResults(query) {
    if (abortController) {
      abortController.abort();
    }
    abortController = new AbortController();

    fetch(
      '/search/suggest.json?q=' + encodeURIComponent(query) +
      '&resources[type]=product&resources[limit]=8&resources[options][fields]=title,product_type,vendor,variants.sku,variants.barcode,tag',
      { signal: abortController.signal }
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        renderResults(data, query);
      })
      .catch(function(error) {
        if (error.name === 'AbortError') return;
        results.innerHTML = '<div class="inv-search-results__empty"><p class="inv-search-results__empty-text">Something went wrong. Please try again.</p></div>';
      });
  }

  function renderResults(data, query) {
    const products = data.resources?.results?.products || [];

    if (products.length === 0) {
      results.innerHTML =
        '<div class="inv-search-results__empty">' +
          '<svg class="inv-search-results__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">' +
            '<circle cx="11" cy="11" r="8"/>' +
            '<path d="m21 21-4.35-4.35"/>' +
          '</svg>' +
          '<p class="inv-search-results__empty-text">No products found for "' + escapeHtml(query) + '"</p>' +
        '</div>';
      return;
    }

    let html = '';

    products.forEach(function(product) {
      const image = product.featured_image?.url || product.image || '';
      const title = escapeHtml(product.title);
      const price = formatMoney(product.price);
      const url = product.url;

      html +=
        '<a href="' + url + '" class="inv-search-results__item">' +
          (image ? '<img src="' + image + '&width=144" alt="' + title + '" class="inv-search-results__image" loading="lazy">' : '') +
          '<div class="inv-search-results__info">' +
            '<p class="inv-search-results__title">' + title + '</p>' +
            '<p class="inv-search-results__price">' + price + '</p>' +
          '</div>' +
        '</a>';
    });

    html += '<a href="/search?q=' + encodeURIComponent(query) + '" class="inv-search-results__view-all">View all results \u2192</a>';

    results.innerHTML = html;
    results.style.display = 'block';
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatMoney(price) {
    const amount = (price / 1).toFixed(2);
    return '\u00a3' + amount;
  }
})();
