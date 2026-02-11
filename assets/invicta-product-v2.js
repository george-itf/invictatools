/**
 * Invicta Product V2 — Main Controller
 * @version 3.1.0 — Extracted from inline, DOM-driven (no Liquid dependencies)
 */
(function() {
  'use strict';

  /* ========================================
     FIND SECTION — DOM-driven, no Liquid needed
     ======================================== */

  const sections = document.querySelectorAll('.inv-pdp[data-section-id]');
  if (!sections.length) return;

  sections.forEach(function(section) {
    initSection(section);
  });

  function initSection(section) {
    const sectionId = section.dataset.sectionId;
    const productHandle = section.dataset.productHandle || '';

    /* ========================================
       UTILITIES
       ======================================== */

    /**
     * Format money in GBP
     * @param {number} cents - Price in pence
     * @returns {string} Formatted price
     */
    function formatMoney(cents) {
      if (typeof Shopify !== 'undefined' && typeof Shopify.formatMoney === 'function') {
        return Shopify.formatMoney(cents);
      }
      return '\u00a3' + (cents / 100).toFixed(2);
    }

    /**
     * Get current VAT mode from localStorage
     * @returns {string} 'inc' or 'ex'
     */
    function getVatMode() {
      try {
        return localStorage.getItem('invicta-vat-mode') || 'inc';
      } catch (e) {
        return 'inc';
      }
    }

    /* ========================================
       ELEMENTS
       ======================================== */

    const mainImage = section.querySelector('[data-main-image]');
    const thumbs = section.querySelectorAll('.inv-pdp__gallery-thumb');
    const thumbsContainer = section.querySelector('[data-gallery-thumbs]');
    const variantSelects = section.querySelectorAll('.inv-pdp__variant-select');
    const productForm = section.querySelector('[data-product-form]');
    const atcBtn = section.querySelector('[data-atc-btn]');
    const atcText = section.querySelector('[data-atc-text]');
    const buyNowBtn = section.querySelector('[data-buy-now]');
    const variantInput = section.querySelector('[data-variant-id]');
    const qtyInput = section.querySelector('[data-qty-input]');
    const priceWrapper = section.querySelector('[data-price-wrapper]');
    const lightbox = document.getElementById('inv-pdp-lightbox-' + sectionId);
    const lightboxImg = lightbox ? lightbox.querySelector('[data-lightbox-img]') : null;
    const chatBtn = section.querySelector('[data-open-chat]');

    /** @type {Array<Object>} */
    let variants = [];

    /** @type {Object<string, string>} */
    let imageMap = {};

    /* ========================================
       DESCRIPTION PARSER
       ======================================== */

    function parseDescription() {
      const source = section.querySelector('[data-description-source]');
      if (!source) return;

      const html = source.innerHTML.trim();
      if (!html) return;

      function matchSection(text) {
        const t = text.toLowerCase().trim();

        if (t.indexOf('what') === 0 && (t.indexOf('included') > -1 || t.indexOf('in the box') > -1)) return 'whats-included';
        if (t.indexOf('in the box') > -1) return 'whats-included';
        if (t === 'includes' || t === 'included') return 'whats-included';

        if (t === 'specifications' || t === 'specification' || t === 'specs' || t === 'technical data' || t === 'technical specifications') return 'specifications';

        if (t.indexOf('ideal for') > -1 || t.indexOf('used for') > -1 || t.indexOf('perfect for') > -1 || t.indexOf('great for') > -1 || t.indexOf('suitable for') > -1) return 'used-for';

        if (t.indexOf('why ') === 0) return 'why-buy';
        if (t === 'key features' || t === 'features') return 'why-buy';

        return null;
      }

      const temp = document.createElement('div');
      temp.innerHTML = html;

      const foundSections = {};
      let currentSection = 'description';
      let currentContent = [];

      function saveSection() {
        if (currentContent.length > 0) {
          const content = currentContent.join('');
          if (content.trim()) {
            if (!foundSections[currentSection]) {
              foundSections[currentSection] = '';
            }
            foundSections[currentSection] += content;
          }
          currentContent = [];
        }
      }

      const children = Array.from(temp.childNodes);

      children.forEach(function(node) {
        if (node.nodeType !== 1 && node.nodeType !== 3) return;

        let isHeader = false;
        let headerText = '';

        if (node.nodeType === 1) {
          const tagName = node.tagName.toLowerCase();

          if (['h1','h2','h3','h4','h5','h6'].indexOf(tagName) > -1) {
            isHeader = true;
            headerText = node.textContent.trim();
          } else if (tagName === 'p' || tagName === 'div') {
            const firstChild = node.firstElementChild;
            if (firstChild && (firstChild.tagName === 'STRONG' || firstChild.tagName === 'B')) {
              if (node.textContent.trim() === firstChild.textContent.trim()) {
                isHeader = true;
                headerText = firstChild.textContent.trim();
              }
            }
          }
        }

        if (isHeader && headerText) {
          saveSection();
          const sectionKey = matchSection(headerText);
          if (sectionKey) {
            currentSection = sectionKey;
          } else {
            currentSection = 'description';
            currentContent.push(node.outerHTML || node.textContent);
          }
        } else {
          if (node.nodeType === 1) {
            if (node.tagName.toLowerCase() !== 'table') {
              currentContent.push(node.outerHTML);
            } else {
              if (currentSection === 'specifications') {
                const rows = node.querySelectorAll('tr');
                const specTexts = [];
                rows.forEach(function(row) {
                  const cells = row.querySelectorAll('td, th');
                  if (cells.length >= 2) {
                    specTexts.push(cells[0].textContent.trim() + ': ' + cells[1].textContent.trim());
                  }
                });
                if (specTexts.length > 0) {
                  currentContent.push('<p>' + specTexts.join(' \u2022 ') + '</p>');
                }
              }
            }
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            currentContent.push('<p>' + node.textContent.trim() + '</p>');
          }
        }
      });

      saveSection();

      const rowOrder = ['description', 'why-buy', 'used-for', 'specifications', 'whats-included'];
      let anyRowShown = false;

      rowOrder.forEach(function(key) {
        const row = section.querySelector('[data-row="' + key + '"]');
        if (!row) return;

        const content = foundSections[key];
        if (!content || !content.trim()) return;

        const contentEl = row.querySelector('[data-content]');
        if (!contentEl) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;

        const items = tempDiv.querySelectorAll('li');
        const paras = tempDiv.querySelectorAll('p');
        const tables = tempDiv.querySelectorAll('table');

        if (key === 'description') {
          if (paras.length > 0) {
            paras.forEach(function(p) {
              const text = p.textContent.trim();
              if (text) {
                const newP = document.createElement('p');
                newP.textContent = text;
                contentEl.appendChild(newP);
              }
            });
          } else {
            const text = tempDiv.textContent.trim();
            if (text) {
              const newP = document.createElement('p');
              newP.textContent = text;
              contentEl.appendChild(newP);
            }
          }
        } else if (key === 'why-buy' || key === 'used-for') {
          if (items.length > 0) {
            items.forEach(function(li) {
              const text = li.textContent.trim();
              if (text) {
                const newLi = document.createElement('li');
                newLi.textContent = text;
                contentEl.appendChild(newLi);
              }
            });
          } else if (paras.length > 0) {
            paras.forEach(function(p) {
              const text = p.textContent.trim();
              if (text) {
                const newLi = document.createElement('li');
                newLi.textContent = text;
                contentEl.appendChild(newLi);
              }
            });
          } else {
            const text = tempDiv.textContent.trim();
            const parts = text.split(/[\u2022\u2023\u25E6\u2043\u2219]|\n/).filter(function(s) { return s.trim(); });
            parts.forEach(function(part) {
              const newLi = document.createElement('li');
              newLi.textContent = part.trim();
              contentEl.appendChild(newLi);
            });
          }
        } else if (key === 'specifications') {
          const specs = [];

          if (tables.length > 0) {
            tables.forEach(function(table) {
              const rows = table.querySelectorAll('tr');
              rows.forEach(function(tr) {
                const cells = tr.querySelectorAll('td, th');
                if (cells.length >= 2) {
                  const label = cells[0].textContent.trim();
                  const value = cells[1].textContent.trim();
                  if (label && value) {
                    specs.push({ label: label, value: value });
                  }
                }
              });
            });
          }

          if (items.length > 0 && specs.length === 0) {
            items.forEach(function(li) {
              const text = li.textContent.trim();
              const colonPos = text.indexOf(':');
              if (colonPos > 0) {
                specs.push({
                  label: text.substring(0, colonPos).trim(),
                  value: text.substring(colonPos + 1).trim()
                });
              }
            });
          }

          if (specs.length === 0) {
            const text = tempDiv.textContent.trim();
            const parts = text.split(/[\u2022\u2023\n]/).filter(function(s) { return s.trim(); });
            parts.forEach(function(part) {
              const colonPos = part.indexOf(':');
              if (colonPos > 0) {
                specs.push({
                  label: part.substring(0, colonPos).trim(),
                  value: part.substring(colonPos + 1).trim()
                });
              }
            });
          }

          specs.forEach(function(spec) {
            const item = document.createElement('div');
            item.className = 'inv-pdp__info-specs-item';

            const label = document.createElement('span');
            label.className = 'inv-pdp__info-specs-label';
            label.textContent = spec.label;

            const value = document.createElement('span');
            value.className = 'inv-pdp__info-specs-value';
            value.textContent = spec.value;

            item.appendChild(label);
            item.appendChild(value);
            contentEl.appendChild(item);
          });
        } else if (key === 'whats-included') {
          const listItems = [];

          if (items.length > 0) {
            items.forEach(function(li) {
              listItems.push(li.textContent.trim());
            });
          } else {
            const text = tempDiv.textContent.trim();
            const parts = text.split(/[\u2022\u2023\n,\u00d7\xd7]/).filter(function(s) { return s.trim(); });
            parts.forEach(function(p) { listItems.push(p.trim()); });
          }

          listItems.forEach(function(text) {
            if (!text) return;
            const newLi = document.createElement('li');
            newLi.textContent = text;

            const lowerText = text.toLowerCase();
            if (lowerText.indexOf('not included') > -1 ||
                lowerText.indexOf('not supplied') > -1 ||
                lowerText.indexOf('sold separately') > -1 ||
                lowerText.indexOf('excludes') > -1) {
              newLi.className = 'not-included';
            }

            contentEl.appendChild(newLi);
          });
        }

        if (contentEl.children.length > 0 || contentEl.textContent.trim()) {
          row.classList.remove('inv-pdp--hidden');
          anyRowShown = true;
        }
      });

      if (!anyRowShown) {
        const descRow = section.querySelector('[data-row="description"]');
        if (descRow) {
          const contentEl = descRow.querySelector('[data-content]');
          if (contentEl) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const plainText = tempDiv.textContent.trim();
            const newP = document.createElement('p');
            newP.textContent = plainText.length > 500 ? plainText.substring(0, 500) + '...' : plainText;
            contentEl.appendChild(newP);
            descRow.classList.remove('inv-pdp--hidden');
          }
        }
      }
    }

    parseDescription();

    /* ========================================
       PARSE JSON DATA
       ======================================== */

    const variantsJson = section.querySelector('[data-variants-json]');
    const imagesJson = section.querySelector('[data-images-json]');

    if (variantsJson) {
      try {
        variants = JSON.parse(variantsJson.textContent);
      } catch (e) {
        // Failed to parse variants
      }
    }

    if (imagesJson) {
      try {
        imageMap = JSON.parse(imagesJson.textContent);
      } catch (e) {
        // Failed to parse images
      }
    }

    /* ========================================
       THUMBNAIL GALLERY
       ======================================== */

    function setActiveThumb(thumb) {
      if (!thumb || !mainImage) return;

      thumbs.forEach(function(t) {
        t.classList.remove('inv-pdp__gallery-thumb--active');
        t.setAttribute('aria-selected', 'false');
      });

      thumb.classList.add('inv-pdp__gallery-thumb--active');
      thumb.setAttribute('aria-selected', 'true');

      if (thumb.dataset.imageSrc) {
        mainImage.removeAttribute('srcset');
        mainImage.src = thumb.dataset.imageSrc;
      }
    }

    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        setActiveThumb(thumb);
      });
    });

    if (thumbsContainer) {
      thumbsContainer.addEventListener('keydown', function(e) {
        let currentIndex = -1;
        const thumbArray = Array.prototype.slice.call(thumbs);

        thumbArray.forEach(function(t, i) {
          if (t.classList.contains('inv-pdp__gallery-thumb--active')) {
            currentIndex = i;
          }
        });

        let nextIndex = currentIndex;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (currentIndex + 1) % thumbArray.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (currentIndex - 1 + thumbArray.length) % thumbArray.length;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = thumbArray.length - 1;
        }

        if (nextIndex !== currentIndex && thumbArray[nextIndex]) {
          setActiveThumb(thumbArray[nextIndex]);
          thumbArray[nextIndex].focus();
        }
      });
    }

    /* ========================================
       QUANTITY SELECTOR
       ======================================== */

    const qtyDecrease = section.querySelector('[data-qty-decrease]');
    const qtyIncrease = section.querySelector('[data-qty-increase]');

    if (qtyDecrease && qtyInput) {
      qtyDecrease.addEventListener('click', function() {
        const val = parseInt(qtyInput.value, 10) || 1;
        const min = parseInt(qtyInput.min, 10) || 1;
        if (val > min) {
          qtyInput.value = val - 1;
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    if (qtyIncrease && qtyInput) {
      qtyIncrease.addEventListener('click', function() {
        const val = parseInt(qtyInput.value, 10) || 1;
        const max = parseInt(qtyInput.max, 10) || 99;
        if (val < max) {
          qtyInput.value = val + 1;
          qtyInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });
    }

    /* ========================================
       VARIANT SELECTOR
       ======================================== */

    function updateVariant() {
      const selectedOptions = [];
      variantSelects.forEach(function(select) {
        selectedOptions.push(select.value);
      });

      const matchingVariant = variants.find(function(v) {
        return v.options.every(function(opt, idx) {
          return opt === selectedOptions[idx];
        });
      });

      if (!matchingVariant) return;

      if (variantInput) {
        variantInput.value = matchingVariant.id;
      }

      updatePrices(matchingVariant);
      updateStockStatus(matchingVariant.available, matchingVariant);

      if (matchingVariant.featured_image && mainImage) {
        const imgId = matchingVariant.featured_image.id;
        if (imageMap[imgId]) {
          mainImage.src = imageMap[imgId];
          thumbs.forEach(function(t) {
            if (t.dataset.imageId == imgId) {
              setActiveThumb(t);
            }
          });
        }
      }

      const skuFallback = productHandle.toUpperCase();
      section.querySelectorAll('[data-sku], [data-sku-display]').forEach(function(el) {
        el.textContent = matchingVariant.sku || skuFallback;
      });

      if (buyNowBtn) {
        buyNowBtn.dataset.variantId = matchingVariant.id;
        buyNowBtn.disabled = !matchingVariant.available;
      }

      const url = new URL(window.location);
      url.searchParams.set('variant', matchingVariant.id);
      window.history.replaceState({}, '', url);
    }

    function updatePrices(variant) {
      if (!priceWrapper) return;

      const priceInc = priceWrapper.querySelector('[data-price-inc]');
      const priceEx = priceWrapper.querySelector('[data-price-ex]');
      const priceExAlt = priceWrapper.querySelector('[data-price-ex-alt]');
      const priceIncAlt = priceWrapper.querySelector('[data-price-inc-alt]');
      const compareInc = priceWrapper.querySelector('[data-compare-inc]');
      const compareEx = priceWrapper.querySelector('[data-compare-ex]');
      const savingsWrap = priceWrapper.querySelector('[data-savings-wrap]');
      const savingsEl = priceWrapper.querySelector('[data-savings]');

      const vatRate = parseInt(section.dataset.vatRate, 10) || 20;
      const vatDivisor = 100 + vatRate;
      const exVat = Math.round(variant.price * 100 / vatDivisor);

      if (priceInc) priceInc.textContent = formatMoney(variant.price);
      if (priceEx) priceEx.textContent = formatMoney(exVat);
      if (priceExAlt) priceExAlt.textContent = formatMoney(exVat);
      if (priceIncAlt) priceIncAlt.textContent = formatMoney(variant.price);

      const hasCompare = variant.compare_at_price && variant.compare_at_price > variant.price;

      if (compareInc) {
        if (hasCompare) {
          compareInc.textContent = formatMoney(variant.compare_at_price);
          compareInc.style.display = '';
        } else {
          compareInc.style.display = 'none';
        }
      }

      if (compareEx) {
        if (hasCompare) {
          const compareExVat = Math.round(variant.compare_at_price * 100 / vatDivisor);
          compareEx.textContent = formatMoney(compareExVat);
          compareEx.style.display = '';
        } else {
          compareEx.style.display = 'none';
        }
      }

      if (savingsWrap && savingsEl) {
        if (hasCompare) {
          const saving = variant.compare_at_price - variant.price;
          const percent = Math.round((saving / variant.compare_at_price) * 100);
          savingsEl.textContent = 'You save ' + formatMoney(saving) + ' (' + percent + '% off)';
          savingsWrap.style.display = '';
        } else {
          savingsWrap.style.display = 'none';
        }
      }
    }

    function updateStockStatus(available, variant) {
      const stockBanner = section.querySelector('[data-stock-banner]');
      const stockText = section.querySelector('[data-stock-text]');
      const lowStockThreshold = parseInt(section.dataset.lowStockThreshold, 10) || 5;

      if (stockBanner && stockText) {
        stockBanner.classList.remove('inv-pdp__stock-banner--in-stock', 'inv-pdp__stock-banner--out-of-stock', 'inv-pdp__stock-banner--low-stock');

        if (available) {
          var qty = variant && variant.inventory_quantity;
          var tracked = variant && variant.inventory_management === 'shopify';

          if (tracked && qty > 0 && qty <= lowStockThreshold) {
            stockBanner.classList.add('inv-pdp__stock-banner--low-stock');
            stockText.textContent = 'Only ' + qty + ' left in stock \u2014 order soon';
          } else {
            stockBanner.classList.add('inv-pdp__stock-banner--in-stock');
            stockText.textContent = 'In Stock \u2014 Ready to Ship';
          }
        } else {
          stockBanner.classList.add('inv-pdp__stock-banner--out-of-stock');
          stockText.textContent = 'Out of Stock';
        }
      }

      if (atcBtn && atcText) {
        atcBtn.disabled = !available;
        atcText.textContent = available ? 'Add to Cart' : 'Out of Stock';
      }

      if (buyNowBtn) {
        buyNowBtn.disabled = !available;
      }
    }

    variantSelects.forEach(function(select) {
      select.addEventListener('change', updateVariant);
    });

    /* ========================================
       VAT TOGGLE INTEGRATION
       ======================================== */

    function updateVatDisplay(mode) {
      if (!priceWrapper) return;

      const incViews = priceWrapper.querySelectorAll('[data-vat-view="inc"]');
      const exViews = priceWrapper.querySelectorAll('[data-vat-view="ex"]');

      incViews.forEach(function(el) {
        if (mode === 'ex') {
          el.classList.add('inv-pdp__price-view--hidden');
        } else {
          el.classList.remove('inv-pdp__price-view--hidden');
        }
      });
      exViews.forEach(function(el) {
        if (mode === 'ex') {
          el.classList.remove('inv-pdp__price-view--hidden');
        } else {
          el.classList.add('inv-pdp__price-view--hidden');
        }
      });
    }

    document.addEventListener('invicta:vat-toggle', function(e) {
      const mode = e.detail && e.detail.mode ? e.detail.mode : 'inc';
      updateVatDisplay(mode);
    });

    updateVatDisplay(getVatMode());

    /* ========================================
       ADD TO CART — AJAX WITH CART DRAWER
       ======================================== */

    if (productForm && atcBtn) {
      productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (atcBtn.disabled || atcBtn.classList.contains('is-loading')) {
          return;
        }

        const formData = new FormData(productForm);
        const variantId = formData.get('id');
        const quantity = parseInt(formData.get('quantity'), 10) || 1;

        atcBtn.classList.add('is-loading');

        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: variantId,
            quantity: quantity
          })
        })
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Failed to add to cart');
          }
          return response.json();
        })
        .then(function(item) {
          atcBtn.classList.remove('is-loading');
          atcBtn.classList.add('is-success');

          openCartDrawer();

          document.dispatchEvent(new CustomEvent('cart:item-added', {
            detail: { item: item, variantId: variantId, quantity: quantity }
          }));

          setTimeout(function() {
            atcBtn.classList.remove('is-success');
          }, 2000);
        })
        .catch(function(error) {
          atcBtn.classList.remove('is-loading');
          atcBtn.classList.add('is-error');

          // Show error message to user
          var errorEl = section.querySelector('[data-atc-error]');
          if (errorEl) {
            errorEl.textContent = errorEl.dataset.errorText || 'Sorry, couldn\'t add to cart. Please try again.';
            errorEl.classList.remove('inv-pdp--hidden');
            setTimeout(function() { errorEl.classList.add('inv-pdp--hidden'); }, 5000);
          }

          setTimeout(function() {
            atcBtn.classList.remove('is-error');
          }, 2500);
        });
      });
    }

    function openCartDrawer() {
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer && typeof cartDrawer.open === 'function') {
        fetch('/cart.js')
          .then(function(r) { return r.json(); })
          .then(function(cart) {
            document.dispatchEvent(new CustomEvent('cart:refresh', { detail: { cart: cart } }));
            cartDrawer.open();
          })
          .catch(function() {});
        return;
      }

      const cartIcon = document.querySelector('[data-cart-toggle], .header__icon--cart button, #cart-icon-bubble');
      if (cartIcon) {
        cartIcon.click();
        return;
      }

      document.dispatchEvent(new CustomEvent('cart:open'));
    }

    /* ========================================
       BUY NOW — DIRECT TO CHECKOUT
       ======================================== */

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', function() {
        if (buyNowBtn.disabled) return;

        const variantId = buyNowBtn.dataset.variantId;
        const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

        buyNowBtn.classList.add('is-loading');
        buyNowBtn.disabled = true;

        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: variantId,
            quantity: quantity
          })
        })
        .then(function(response) {
          if (!response.ok) {
            throw new Error('Failed to add to cart');
          }
          window.location.href = '/checkout';
        })
        .catch(function(error) {
          console.error('[Invicta PDP] Buy now error:', error);
          buyNowBtn.classList.remove('is-loading');
          buyNowBtn.disabled = false;
        });
      });
    }

    /* ========================================
       KIT BUILDER TOGGLE
       ======================================== */

    const kitToggle = section.querySelector('[data-kit-toggle]');
    const kitContent = section.querySelector('[data-kit-content]');

    if (kitToggle && kitContent) {
      kitToggle.addEventListener('click', function() {
        const isExpanded = kitToggle.getAttribute('aria-expanded') === 'true';
        kitToggle.setAttribute('aria-expanded', String(!isExpanded));
        kitContent.hidden = isExpanded;
      });
    }

    /* ========================================
       CHAT BUTTON
       ======================================== */

    if (chatBtn) {
      chatBtn.addEventListener('click', function() {
        if (typeof window.ShopifyChat !== 'undefined' && window.ShopifyChat.open) {
          window.ShopifyChat.open();
        } else if (typeof window.Gorgias !== 'undefined' && window.Gorgias.open) {
          window.Gorgias.open();
        } else if (typeof window.$crisp !== 'undefined') {
          window.$crisp.push(['do', 'chat:open']);
        } else if (typeof window.Intercom !== 'undefined') {
          window.Intercom('show');
        } else {
          const inboxBtn = document.querySelector('#shopify-chat button, .shopify-chat-button');
          if (inboxBtn) inboxBtn.click();
        }
      });
    }

    /* ========================================
       LIGHTBOX
       ======================================== */

    const zoomBtn = section.querySelector('[data-zoom-trigger]');
    const lightboxCloseEls = lightbox ? lightbox.querySelectorAll('[data-lightbox-close]') : [];
    let previouslyFocused = null;

    function openLightbox() {
      if (!lightbox || !lightboxImg || !mainImage) return;

      previouslyFocused = document.activeElement;
      var lightboxWidth = window.innerWidth <= 749 ? 800 : 1200;
      lightboxImg.src = mainImage.src.replace(/width=\d+/, 'width=' + lightboxWidth);
      lightboxImg.alt = mainImage.alt;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';

      const closeBtn = lightbox.querySelector('.inv-pdp__lightbox-close');
      if (closeBtn) closeBtn.focus();
    }

    function closeLightbox() {
      if (!lightbox) return;

      lightbox.hidden = true;
      document.body.style.overflow = '';

      if (previouslyFocused) {
        previouslyFocused.focus();
        previouslyFocused = null;
      }
    }

    if (zoomBtn) {
      zoomBtn.addEventListener('click', openLightbox);
    }

    lightboxCloseEls.forEach(function(el) {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
        closeLightbox();
      }
    });

    if (lightbox) {
      lightbox.addEventListener('keydown', function(e) {
        if (e.key !== 'Tab') return;

        const focusable = lightbox.querySelectorAll('button, [tabindex="0"]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });
    }
  }
})();
