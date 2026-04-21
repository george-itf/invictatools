/**
 * Invicta Product V2 — Main Controller
 * @version 3.2.0 — Fixed nested form, robust init
 */
(function() {
  'use strict';

  /* ========================================
     FIND SECTION — DOM-driven, no Liquid needed
     Tries immediately (works with defer), falls back
     to DOMContentLoaded if sections aren't found yet.
     ======================================== */

  function boot() {
    const sections = document.querySelectorAll('.inv-pdp[data-section-id]');
    if (!sections.length) return false;
    sections.forEach(function(section) { initSection(section); });
    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

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

      /* Strip CMS meta prefixes that leak into the description field.
         These are SEO metadata entries embedded in the product description
         by the CMS and should never display to customers. */
      var metaPrefixes = ['product title:', 'meta title:', 'meta description:'];
      (function stripMetaLines(parent) {
        var nodes = Array.from(parent.childNodes);
        nodes.forEach(function(node) {
          if (node.nodeType === 1 || node.nodeType === 3) {
            var text = node.textContent.trim().toLowerCase();
            for (var i = 0; i < metaPrefixes.length; i++) {
              if (text.indexOf(metaPrefixes[i]) === 0) {
                parent.removeChild(node);
                return;
              }
            }
          }
        });
      })(temp);

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
            const paras = tempDiv.querySelectorAll('p');
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
            descRow.classList.remove('inv-pdp--hidden');
          }
        }
      }
    }

    parseDescription();

    /* ========================================
       DESCRIPTION "SHOW MORE" TOGGLE
       Description content is collapsed to 210px by CSS. We measure its
       full scrollHeight on the next frame: if it fits, add .is-desc-short
       to undo the cap and skip rendering the button. If it overflows,
       insert a Show more / Show less button that toggles .is-desc-expanded.
       ======================================== */
    (function initDescriptionToggle() {
      var descRow = section.querySelector('[data-row="description"]');
      if (!descRow) return;
      var contentEl = descRow.querySelector('[data-content]');
      if (!contentEl) return;

      var collapsedMax = 210;

      requestAnimationFrame(function() {
        if (contentEl.scrollHeight <= collapsedMax) {
          descRow.classList.add('is-desc-short');
          return;
        }

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'inv-pdp__info-readmore';
        btn.textContent = 'Show more';
        btn.setAttribute('aria-expanded', 'false');
        contentEl.parentNode.insertBefore(btn, contentEl.nextSibling);

        btn.addEventListener('click', function() {
          var expanded = descRow.classList.toggle('is-desc-expanded');
          btn.textContent = expanded ? 'Show less' : 'Show more';
          btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
      });
    })();

    /* ========================================
       AUTO-EXPAND KEY SECTIONS
       Description is already open via Liquid markup.
       Key Features: open on all viewports.
       Specifications: open on desktop (>749px) only.
       ======================================== */
    (function autoExpandSections() {
      var alwaysOpen = ['why-buy'];
      var desktopOnly = ['specifications'];
      var isDesktop = window.matchMedia('(min-width: 750px)').matches;

      var keys = alwaysOpen.concat(isDesktop ? desktopOnly : []);
      keys.forEach(function(key) {
        var row = section.querySelector('[data-row="' + key + '"]');
        if (!row || row.classList.contains('inv-pdp--hidden')) return;
        row.classList.add('inv-pdp__info-section--open');
        var toggle = row.querySelector('[data-accordion-toggle]');
        if (toggle) toggle.setAttribute('aria-expanded', 'true');
      });
    })();

    /* ========================================
       ACCORDION TOGGLES
       ======================================== */
    section.querySelectorAll('[data-accordion-toggle]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const sec = btn.closest('.inv-pdp__info-section');
        if (!sec) return;
        const isOpen = sec.classList.contains('inv-pdp__info-section--open');
        sec.classList.toggle('inv-pdp__info-section--open');
        btn.setAttribute('aria-expanded', !isOpen);
      });
    });

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

    let activeThumbIndex = 0;
    const thumbArray = Array.prototype.slice.call(thumbs);

    function setActiveThumb(thumb) {
      if (!thumb || !mainImage) return;

      const prevActive = thumbsContainer && thumbsContainer.querySelector('.inv-pdp__gallery-thumb--active');
      if (prevActive && prevActive !== thumb) {
        prevActive.classList.remove('inv-pdp__gallery-thumb--active');
        prevActive.setAttribute('aria-selected', 'false');
      }

      thumb.classList.add('inv-pdp__gallery-thumb--active');
      thumb.setAttribute('aria-selected', 'true');
      activeThumbIndex = parseInt(thumb.dataset.index, 10) || 0;

      /* Update image counter */
      const counter = section.querySelector('[data-image-counter]');
      if (counter) {
        counter.textContent = (activeThumbIndex + 1) + ' / ' + thumbArray.length;
      }

      const newSrc = thumb.dataset.imageSrc;
      if (newSrc && mainImage.src !== newSrc) {
        mainImage.style.opacity = '0.3';
        const baseSrc = newSrc.replace(/width=\d+/, '');
        mainImage.srcset = baseSrc + 'width=400 400w, ' + baseSrc + 'width=600 600w, ' + baseSrc + 'width=800 800w, ' + baseSrc + 'width=1200 1200w';
        mainImage.src = newSrc;
        mainImage.addEventListener('load', function onLoad() {
          mainImage.style.opacity = '1';
          mainImage.removeEventListener('load', onLoad);
        });
        setTimeout(function() { mainImage.style.opacity = '1'; }, 400);
      }
    }

    thumbArray.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        setActiveThumb(thumb);
      });
    });

    if (thumbsContainer) {
      thumbsContainer.addEventListener('keydown', function(e) {
        let nextIndex = activeThumbIndex;
        const len = thumbArray.length;

        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          nextIndex = (activeThumbIndex + 1) % len;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          nextIndex = (activeThumbIndex - 1 + len) % len;
        } else if (e.key === 'Home') {
          e.preventDefault();
          nextIndex = 0;
        } else if (e.key === 'End') {
          e.preventDefault();
          nextIndex = len - 1;
        }

        if (nextIndex !== activeThumbIndex && thumbArray[nextIndex]) {
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

      function isRealSku(sku) {
        if (!sku) return false;
        const s = sku.trim();
        if (!s) return false;
        if (/^[a-z0-9]+(-[a-z0-9]+){2,}$/.test(s) && s.length > 15) return false;
        return true;
      }

      section.querySelectorAll('[data-sku]').forEach(function(el) {
        if (isRealSku(matchingVariant.sku)) {
          el.textContent = matchingVariant.sku;
          el.style.display = '';
        } else {
          el.textContent = '';
          el.style.display = 'none';
        }
      });
      section.querySelectorAll('[data-sku-display]').forEach(function(el) {
        if (isRealSku(matchingVariant.sku)) {
          el.textContent = matchingVariant.sku;
          if (el.closest('.inv-pdp__info-row')) el.closest('.inv-pdp__info-row').style.display = '';
        } else {
          el.textContent = '';
          if (el.closest('.inv-pdp__info-row')) el.closest('.inv-pdp__info-row').style.display = 'none';
        }
      });

      if (buyNowBtn) {
        buyNowBtn.disabled = !matchingVariant.available;
      }

      /* Keep sticky ATC button in sync with selected variant */
      const stickyAtcBtn = document.querySelector('[data-sticky-atc-btn]');
      if (stickyAtcBtn) {
        stickyAtcBtn.setAttribute('data-variant-id', matchingVariant.id);
        stickyAtcBtn.disabled = !matchingVariant.available;
        stickyAtcBtn.textContent = matchingVariant.available ? 'Add to Cart' : 'Out of Stock';
      }

      /* Update sticky price display */
      const stickyPrice = document.querySelector('[data-sticky-price]');
      if (stickyPrice) {
        const vat = window.invictaVat || { exFromInc: function(p) { return Math.round(p * 100 / 120); } };
        const stickyExVat = vat.exFromInc(matchingVariant.price);
        stickyPrice.innerHTML = formatMoney(stickyExVat) + ' <span class="inv-pdp__sticky-atc-vat">ex VAT</span>';
      }

      const url = new URL(window.location);
      url.searchParams.set('variant', matchingVariant.id);
      window.history.replaceState({}, '', url);
    }

    function updatePrices(variant) {
      if (!priceWrapper) return;

      const priceIncEl = priceWrapper.querySelector('[data-price-inc-value]');
      const priceExEl = priceWrapper.querySelector('[data-price-ex-value]');
      const compareInc = priceWrapper.querySelector('[data-compare-inc]');
      const compareEx = priceWrapper.querySelector('[data-compare-ex]');
      const savingsWrap = priceWrapper.querySelector('[data-savings-wrap]');
      const savingsEl = priceWrapper.querySelector('[data-savings]');

      const vat = window.invictaVat || { exFromInc: function(p) { return Math.round(p * 100 / 120); } };
      const exVat = vat.exFromInc(variant.price);

      if (priceIncEl) priceIncEl.textContent = formatMoney(variant.price);
      if (priceExEl) priceExEl.textContent = formatMoney(exVat);

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
          const compareExVat = vat.exFromInc(variant.compare_at_price);
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
      const dispatchText = section.querySelector('[data-dispatch-text]');
      const stockSource = stockBanner ? (stockBanner.dataset.stockSource || 'invicta') : 'invicta';
      const supplierBannerText = stockBanner ? (stockBanner.dataset.supplierBannerText || 'In Stock with Supplier \u2014 Usually Dispatched within 2\u20133 Working Days') : '';

      if (stockBanner && stockText) {
        stockBanner.classList.remove(
          'inv-pdp__stock-banner--in-stock',
          'inv-pdp__stock-banner--out-of-stock',
          'inv-pdp__stock-banner--supplier-stock'
        );

        if (available) {
          if (stockSource === 'supplier') {
            stockBanner.classList.add('inv-pdp__stock-banner--supplier-stock');
            stockText.textContent = supplierBannerText;
          } else {
            stockBanner.classList.add('inv-pdp__stock-banner--in-stock');
            stockText.textContent = 'In Stock \u2014 Ready to Ship';
          }
        } else {
          stockBanner.classList.add('inv-pdp__stock-banner--out-of-stock');
          stockText.textContent = 'Out of Stock';
        }
      }

      /* Show/hide dispatch text for supplier items */
      if (dispatchText) {
        if (available && stockSource === 'supplier') {
          dispatchText.classList.remove('inv-pdp--hidden');
        } else {
          dispatchText.classList.add('inv-pdp--hidden');
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
       ADD TO CART — Section Rendering API
       P0-2.1: Request-level dedup (not just CSS class)
       P1-3.2: Uses Section Rendering to refresh drawer
       P1-3.5: Parses Shopify error descriptions
       P2-4.1: No separate /cart.js fetch
       P2-4.2: Uses window.routes
       ======================================== */

    if (productForm && atcBtn) {
      productForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (atcBtn.disabled) return;

        const variantInput = productForm.querySelector('[name="id"]');
        const variantId = variantInput ? variantInput.value : '';
        if (!variantId) return;

        // Dedup via shared API
        if (window.InvictaCartAPI && window.InvictaCartAPI.isInFlight(variantId)) return;

        atcBtn.classList.add('is-loading');

        const formData = new FormData(productForm);

        window.InvictaCartAPI.add(
          { id: variantId, quantity: parseInt(formData.get('quantity') || '1', 10) },
          {
            formData: formData,
            sections: 'cart-drawer,cart-icon-bubble',
            sections_url: window.location.pathname,
            source: 'pdp'
          }
        )
        .then(function(data) {
          atcBtn.classList.remove('is-loading');
          atcBtn.classList.add('is-success');

          refreshCartDrawer(data);
          updateCartBubble(data);

          setTimeout(function() {
            atcBtn.classList.remove('is-success');
          }, 2000);
        })
        .catch(function(error) {
          atcBtn.classList.remove('is-loading');
          atcBtn.classList.add('is-error');

          const message = (error && (error.description || error.message)) || 'Sorry, couldn\'t add to cart. Please try again.';
          const errorEl = section.querySelector('[data-atc-error]');
          if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('inv-pdp--hidden');
            setTimeout(function() { errorEl.classList.add('inv-pdp--hidden'); }, 5000);
          }

          setTimeout(function() {
            atcBtn.classList.remove('is-error');
          }, 2500);
        });
      });
    }

    /**
     * Refresh the cart drawer using Section Rendering API HTML
     * @param {Object} data - Response from /cart/add.js with sections
     */
    function refreshCartDrawer(data) {
      const cartDrawer = document.querySelector('cart-drawer');
      if (!cartDrawer) {
        document.dispatchEvent(new CustomEvent('cart:open'));
        return;
      }

      if (data.sections && data.sections['cart-drawer']) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.sections['cart-drawer'], 'text/html');
        const newDrawer = doc.querySelector('#CartDrawer');
        const existingDrawer = document.getElementById('CartDrawer');
        if (newDrawer && existingDrawer) {
          existingDrawer.innerHTML = newDrawer.innerHTML;
        }
        cartDrawer.classList.remove('is-empty');
        const overlay = cartDrawer.querySelector('#CartDrawer-Overlay');
        if (overlay) {
          overlay.addEventListener('click', function() { cartDrawer.close(); });
        }
      }

      setTimeout(function() { cartDrawer.open(); });
    }

    /**
     * Update the header cart icon bubble using Section Rendering API HTML
     * @param {Object} data - Response from /cart/add.js with sections
     */
    function updateCartBubble(data) {
      if (data.sections && data.sections['cart-icon-bubble']) {
        const bubbleEl = document.getElementById('cart-icon-bubble');
        if (bubbleEl) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(data.sections['cart-icon-bubble'], 'text/html');
          const newBubble = doc.querySelector('.shopify-section');
          if (newBubble) {
            bubbleEl.innerHTML = newBubble.innerHTML;
          }
        }
      }
    }

    /* ========================================
       BUY NOW — ADD & CHECKOUT
       P0-2.2: Null-safety for productForm
       P1-3.5: Parses Shopify error descriptions
       P2-4.2: Uses window.routes
       ======================================== */

    if (buyNowBtn) {
      buyNowBtn.addEventListener('click', function() {
        if (buyNowBtn.disabled || !productForm) return;

        const variantInput = productForm.querySelector('[name="id"]');
        const variantId = variantInput ? variantInput.value : '';
        if (!variantId) return;

        if (window.InvictaCartAPI && window.InvictaCartAPI.isInFlight(variantId)) return;

        buyNowBtn.classList.add('is-loading');
        buyNowBtn.disabled = true;

        window.InvictaCartAPI.add(
          { id: variantId, quantity: parseInt(productForm.querySelector('[name="quantity"]')?.value || '1', 10) },
          { formData: new FormData(productForm), source: 'buy-now' }
        )
        .then(function() {
          window.location.href = '/checkout';
        })
        .catch(function(error) {
          buyNowBtn.classList.remove('is-loading');
          buyNowBtn.disabled = false;

          const message = (error && (error.description || error.message)) || 'Sorry, couldn\'t proceed to checkout.';
          const errorEl = section.querySelector('[data-atc-error]');
          if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('inv-pdp--hidden');
            setTimeout(function() { errorEl.classList.add('inv-pdp--hidden'); }, 5000);
          }
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
      const lightboxWidth = window.innerWidth <= 749 ? 800 : 1200;
      lightboxImg.src = mainImage.src.replace(/width=\d+/, 'width=' + lightboxWidth);
      lightboxImg.alt = mainImage.alt || productHandle;
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

    /* Lightbox keyboard handlers — added on open, removed on close to prevent leaks */
    function onLightboxEscapeKey(e) {
      if (e.key === 'Escape' && lightbox && !lightbox.hidden) {
        closeLightboxAndUnbindKeys();
      }
    }

    function onLightboxTabTrap(e) {
      if (e.key !== 'Tab') return;

      const focusable = lightbox.querySelectorAll('button, [tabindex="0"]');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    function openLightboxAndBindKeys() {
      openLightbox();
      document.addEventListener('keydown', onLightboxEscapeKey);
      if (lightbox) lightbox.addEventListener('keydown', onLightboxTabTrap);
    }

    function closeLightboxAndUnbindKeys() {
      closeLightbox();
      document.removeEventListener('keydown', onLightboxEscapeKey);
      if (lightbox) lightbox.removeEventListener('keydown', onLightboxTabTrap);
    }

    if (zoomBtn) {
      zoomBtn.addEventListener('click', openLightboxAndBindKeys);
    }

    lightboxCloseEls.forEach(function(el) {
      el.addEventListener('click', closeLightboxAndUnbindKeys);
    });

  }
})();
