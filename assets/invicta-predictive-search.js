/**
 * Invicta Predictive Search v7.5
 * Extracted from inline — no Liquid dependencies
 * Security: replaced innerHTML with programmatic DOM construction
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

  /**
   * Remove all child nodes from an element (safe alternative to innerHTML = '')
   */
  function clearElement(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  /* CLEAR BUTTON */
  if (clearBtn && input) {
    clearBtn.addEventListener('click', function() {
      input.value = '';
      input.focus();
      clearElement(results);
      results.style.display = 'none';
    });
  }

  /* LIVE SEARCH */
  if (input && results) {
    input.addEventListener('input', function() {
      const query = this.value.trim();

      clearTimeout(debounceTimer);

      if (query.length < 2) {
        clearElement(results);
        results.style.display = 'none';
        return;
      }

      // Show loading spinner (built with DOM)
      clearElement(results);
      var loadingDiv = document.createElement('div');
      loadingDiv.className = 'inv-search-results__loading';
      var spinner = document.createElement('div');
      spinner.className = 'inv-search-results__spinner';
      loadingDiv.appendChild(spinner);
      results.appendChild(loadingDiv);
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
      if (results.hasChildNodes() && this.value.length >= 2) {
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
        clearElement(results);
        var errorDiv = document.createElement('div');
        errorDiv.className = 'inv-search-results__empty';
        var errorText = document.createElement('p');
        errorText.className = 'inv-search-results__empty-text';
        errorText.textContent = 'Something went wrong. Please try again.';
        errorDiv.appendChild(errorText);
        results.appendChild(errorDiv);
      });
  }

  function renderResults(data, query) {
    var products = data.resources?.results?.products || [];

    clearElement(results);

    if (products.length === 0) {
      var emptyDiv = document.createElement('div');
      emptyDiv.className = 'inv-search-results__empty';

      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('class', 'inv-search-results__empty-icon');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '1.5');
      var circle = document.createElementNS(svgNS, 'circle');
      circle.setAttribute('cx', '11');
      circle.setAttribute('cy', '11');
      circle.setAttribute('r', '8');
      svg.appendChild(circle);
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', 'm21 21-4.35-4.35');
      svg.appendChild(path);
      emptyDiv.appendChild(svg);

      var emptyText = document.createElement('p');
      emptyText.className = 'inv-search-results__empty-text';
      emptyText.textContent = 'No products found for \u201c' + query + '\u201d';
      emptyDiv.appendChild(emptyText);

      results.appendChild(emptyDiv);
      return;
    }

    products.forEach(function(product) {
      var image = product.featured_image?.url || product.image || '';
      var title = product.title || '';
      var price = formatMoney(product.price);
      var url = product.url || '';
      var vendor = product.vendor || '';
      var available = product.available !== false;

      var anchor = document.createElement('a');
      anchor.setAttribute('href', url);
      anchor.className = 'inv-search-results__item';
      anchor.setAttribute('role', 'option');

      if (image) {
        var img = document.createElement('img');
        img.setAttribute('src', image + '&width=144');
        img.setAttribute('alt', title);
        img.className = 'inv-search-results__image';
        img.setAttribute('loading', 'lazy');
        anchor.appendChild(img);
      }

      var infoDiv = document.createElement('div');
      infoDiv.className = 'inv-search-results__info';

      /* CX v1.0: Show vendor/brand above title */
      if (vendor) {
        var vendorP = document.createElement('p');
        vendorP.className = 'inv-search-results__vendor';
        vendorP.textContent = vendor;
        infoDiv.appendChild(vendorP);
      }

      var titleP = document.createElement('p');
      titleP.className = 'inv-search-results__title';
      titleP.textContent = title;
      infoDiv.appendChild(titleP);

      var metaDiv = document.createElement('div');
      metaDiv.style.cssText = 'display:flex;align-items:center;gap:8px;margin-top:2px';

      var priceP = document.createElement('p');
      priceP.className = 'inv-search-results__price';
      priceP.textContent = price;
      metaDiv.appendChild(priceP);

      /* CX v1.0: Stock status badge */
      var stockBadge = document.createElement('span');
      stockBadge.className = 'inv-search-results__stock inv-search-results__stock--' + (available ? 'in-stock' : 'out-of-stock');
      stockBadge.textContent = available ? 'In Stock' : 'Out of Stock';
      metaDiv.appendChild(stockBadge);

      infoDiv.appendChild(metaDiv);

      anchor.appendChild(infoDiv);
      results.appendChild(anchor);
    });

    var viewAllLink = document.createElement('a');
    viewAllLink.setAttribute('href', '/search?q=' + encodeURIComponent(query));
    viewAllLink.className = 'inv-search-results__view-all';
    viewAllLink.textContent = 'View all results \u2192';
    results.appendChild(viewAllLink);

    results.style.display = 'block';
  }

  function formatMoney(price) {
    var amount = (price / 1).toFixed(2);
    return '\u00a3' + amount;
  }
})();
