(function() {
  'use strict';

  var container = document.querySelector('[data-cart-recs]');
  if (!container) return;

  var productId = container.dataset.productId;
  var limit = container.dataset.limit || 6;
  var sectionId = container.closest('.shopify-section').id.replace('shopify-section-', '');

  if (!productId) {
    container.remove();
    return;
  }

  var url = '/recommendations/products?section_id=' + sectionId +
            '&product_id=' + productId +
            '&limit=' + limit +
            '&intent=complementary';

  fetch(url)
    .then(function(response) { return response.text(); })
    .then(function(html) {
      var temp = document.createElement('div');
      temp.innerHTML = html;
      var freshSection = temp.querySelector('[data-cart-recs]');

      if (freshSection && freshSection.querySelector('.inv-cart-recs__item')) {
        container.innerHTML = freshSection.innerHTML;
        container.classList.remove('inv-cart-recs--loading');
      } else {
        container.remove();
      }
    })
    .catch(function() {
      container.remove();
    });
})();
