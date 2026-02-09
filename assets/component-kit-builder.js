(function() {
  'use strict';

  const kit = document.querySelector('[data-kit-builder]');
  if (!kit) return;

  /* ================================================================
     ELEMENTS
     ================================================================ */
  const toggle = kit.querySelector('[data-kit-toggle]');
  const batterySelect = kit.querySelector('[data-select="battery"]');
  const batteryQtyWrap = kit.querySelector('[data-qty-wrap="battery"]');
  const batteryQtyInput = kit.querySelector('[data-qty-input="battery"]');
  const batteryQtyHint = kit.querySelector('[data-qty-hint]');
  const chargerSelect = kit.querySelector('[data-select="charger"]');
  const caseSelect = kit.querySelector('[data-select="case"]');

  const totalEl = kit.querySelector('[data-kit-total]');
  const savingsEl = kit.querySelector('[data-kit-savings]');
  const savingsRow = kit.querySelector('[data-savings-row]');
  const addBtn = kit.querySelector('[data-add-kit-btn]');
  const btnText = kit.querySelector('[data-btn-text]');
  const btnLoading = kit.querySelector('[data-btn-loading]');

  // Price elements
  const batteryPriceWrap = kit.querySelector('[data-price="battery"]');
  const batteryPriceWas = kit.querySelector('[data-price-was="battery"]');
  const batteryPriceNow = kit.querySelector('[data-price-now="battery"]');
  const chargerPriceWrap = kit.querySelector('[data-price="charger"]');
  const chargerPriceWas = kit.querySelector('[data-price-was="charger"]');
  const chargerPriceNow = kit.querySelector('[data-price-now="charger"]');
  const casePriceWrap = kit.querySelector('[data-price="case"]');
  const casePriceWas = kit.querySelector('[data-price-was="case"]');
  const casePriceNow = kit.querySelector('[data-price-now="case"]');

  // Badges
  const batteryBadge = kit.querySelector('[data-badge="battery"]');
  const chargerBadge = kit.querySelector('[data-badge="charger"]');
  const caseBadge = kit.querySelector('[data-badge="case"]');

  // Tool data
  const toolPrice = parseInt(kit.dataset.toolPrice || '0', 10);
  const toolId = kit.dataset.toolId;
  const discountCode = kit.dataset.discountCode || '';

  /* ================================================================
     HELPERS
     ================================================================ */
  const fmt = (p) => p > 0 ? '\u00A3' + (p / 100).toFixed(2) : '\u00A3' + '0.00';

  const getData = (sel) => {
    if (!sel || !sel.value) return { id: null, price: 0, kitPrice: 0 };
    const o = sel.options[sel.selectedIndex];
    return {
      id: o.value,
      price: parseInt(o.dataset.price || '0', 10),
      kitPrice: parseInt(o.dataset.kitPrice || o.dataset.price || '0', 10)
    };
  };

  /* ================================================================
     TOGGLE EXPAND/COLLAPSE
     ================================================================ */
  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = kit.dataset.expanded === 'true';
      kit.dataset.expanded = expanded ? 'false' : 'true';
    });
  }

  /* ================================================================
     CALCULATIONS
     ================================================================ */
  const calc = () => {
    const bQty = batteryQtyInput ? parseInt(batteryQtyInput.value, 10) || 0 : 0;
    const b = getData(batterySelect);
    const c = getData(chargerSelect);
    const k = getData(caseSelect);

    // Battery discount: 2+ batteries
    const bDisc = b.id && bQty >= 2;

    // Full kit = battery + charger + case (all three selected)
    const hasFullKit = (b.id && bQty > 0) && c.id && k.id;

    // Charger/Case ONLY get kit price when full kit is built
    const cDisc = hasFullKit;
    const kDisc = hasFullKit;

    // Battery pricing
    let bFull = 0, bKit = 0;
    if (b.id && bQty > 0) {
      bFull = b.price * bQty;
      bKit = bDisc ? b.kitPrice * bQty : bFull;
    }

    // Charger pricing
    let cFull = 0, cKit = 0;
    if (c.id) {
      cFull = c.price;
      cKit = cDisc ? c.kitPrice : cFull;
    }

    // Case pricing
    let kFull = 0, kKit = 0;
    if (k.id) {
      kFull = k.price;
      kKit = kDisc ? k.kitPrice : kFull;
    }

    const accessoriesTotal = bKit + cKit + kKit;
    const hasItems = (b.id && bQty > 0) || c.id || k.id;

    return {
      bQty, b, c, k,
      bFull, bKit, cFull, cKit, kFull, kKit,
      bDisc, cDisc, kDisc, hasFullKit,
      accessoriesTotal,
      total: toolPrice + accessoriesTotal,
      savings: (bFull + cFull + kFull) - accessoriesTotal,
      hasItems
    };
  };

  /* ================================================================
     UPDATE UI
     ================================================================ */
  const update = () => {
    const d = calc();

    // ----- Battery row -----
    if (batteryQtyWrap) {
      batteryQtyWrap.classList.toggle('inv-kit__qty-wrap--visible', !!d.b.id);
    }

    if (batteryQtyHint) {
      if (d.b.id && d.bQty < 2) {
        batteryQtyHint.textContent = 'Buy 2 for 15% off!';
        batteryQtyHint.style.display = '';
      } else if (d.bDisc) {
        batteryQtyHint.textContent = '15% off applied!';
        batteryQtyHint.style.display = '';
      } else {
        batteryQtyHint.style.display = 'none';
      }
    }

    if (batteryPriceNow) {
      if (d.b.id && d.bQty > 0) {
        batteryPriceNow.textContent = fmt(d.bKit);
        batteryPriceWrap.classList.remove('inv-kit__row-price--empty');
        batteryPriceWrap.classList.toggle('inv-kit__row-price--discount', d.bDisc);
      } else {
        batteryPriceNow.textContent = '\u2014';
        batteryPriceWrap.classList.add('inv-kit__row-price--empty');
        batteryPriceWrap.classList.remove('inv-kit__row-price--discount');
      }
    }

    if (batteryPriceWas) {
      if (d.bDisc && d.bFull > d.bKit) {
        batteryPriceWas.textContent = fmt(d.bFull);
        batteryPriceWas.style.display = '';
      } else {
        batteryPriceWas.style.display = 'none';
      }
    }

    if (batteryBadge) {
      batteryBadge.classList.toggle('inv-kit__badge--active', d.bDisc);
      batteryBadge.textContent = d.bDisc ? '15% off!' : 'Buy 2 = 15% off';
    }

    // ----- Charger row -----
    if (chargerPriceNow) {
      if (d.c.id) {
        chargerPriceNow.textContent = fmt(d.cKit);
        chargerPriceWrap.classList.remove('inv-kit__row-price--empty');
        chargerPriceWrap.classList.toggle('inv-kit__row-price--discount', d.cDisc);
      } else {
        chargerPriceNow.textContent = '\u2014';
        chargerPriceWrap.classList.add('inv-kit__row-price--empty');
        chargerPriceWrap.classList.remove('inv-kit__row-price--discount');
      }
    }

    if (chargerPriceWas) {
      if (d.cDisc && d.cFull > d.cKit) {
        chargerPriceWas.textContent = fmt(d.cFull);
        chargerPriceWas.style.display = '';
      } else {
        chargerPriceWas.style.display = 'none';
      }
    }

    if (chargerBadge) {
      if (d.hasFullKit) {
        chargerBadge.textContent = 'Kit price!';
        chargerBadge.classList.add('inv-kit__badge--active');
        chargerBadge.style.display = '';
      } else if (d.c.id && d.b.id && d.bQty > 0 && !d.k.id) {
        // Has battery + charger, missing case
        chargerBadge.textContent = '+ case for kit price';
        chargerBadge.classList.remove('inv-kit__badge--active');
        chargerBadge.style.display = '';
      } else if (d.c.id && (!d.b.id || d.bQty === 0)) {
        // Has charger, missing battery
        chargerBadge.textContent = '+ battery & case for kit price';
        chargerBadge.classList.remove('inv-kit__badge--active');
        chargerBadge.style.display = '';
      } else {
        chargerBadge.style.display = 'none';
      }
    }

    // ----- Case row -----
    if (casePriceNow) {
      if (d.k.id) {
        casePriceNow.textContent = fmt(d.kKit);
        casePriceWrap.classList.remove('inv-kit__row-price--empty');
        casePriceWrap.classList.toggle('inv-kit__row-price--discount', d.kDisc);
      } else {
        casePriceNow.textContent = '\u2014';
        casePriceWrap.classList.add('inv-kit__row-price--empty');
        casePriceWrap.classList.remove('inv-kit__row-price--discount');
      }
    }

    if (casePriceWas) {
      if (d.kDisc && d.kFull > d.kKit) {
        casePriceWas.textContent = fmt(d.kFull);
        casePriceWas.style.display = '';
      } else {
        casePriceWas.style.display = 'none';
      }
    }

    if (caseBadge) {
      if (d.hasFullKit) {
        caseBadge.textContent = 'Kit price!';
        caseBadge.classList.add('inv-kit__badge--active');
        caseBadge.style.display = '';
      } else if (d.k.id && d.b.id && d.bQty > 0 && !d.c.id) {
        // Has battery + case, missing charger
        caseBadge.textContent = '+ charger for kit price';
        caseBadge.classList.remove('inv-kit__badge--active');
        caseBadge.style.display = '';
      } else if (d.k.id && (!d.b.id || d.bQty === 0)) {
        // Has case, missing battery
        caseBadge.textContent = '+ battery & charger for kit price';
        caseBadge.classList.remove('inv-kit__badge--active');
        caseBadge.style.display = '';
      } else {
        caseBadge.style.display = 'none';
      }
    }

    // ----- Summary -----
    if (totalEl) {
      if (d.hasItems) {
        totalEl.textContent = fmt(d.total);
        totalEl.classList.remove('inv-kit__summary-total--empty');
      } else {
        totalEl.textContent = 'Select items above';
        totalEl.classList.add('inv-kit__summary-total--empty');
      }
    }

    if (savingsRow) {
      if (d.savings > 0) {
        savingsEl.textContent = 'You save ' + fmt(d.savings);
        savingsRow.hidden = false;
      } else {
        savingsRow.hidden = true;
      }
    }

    // ----- Add Kit Button -----
    if (addBtn) {
      addBtn.disabled = !d.hasItems;
    }
  };

  /* ================================================================
     EVENT LISTENERS
     ================================================================ */
  // Battery select
  if (batterySelect) {
    batterySelect.addEventListener('change', () => {
      // Reset qty to 1 when battery selected, 0 when cleared
      if (batteryQtyInput) {
        batteryQtyInput.value = batterySelect.value ? '1' : '0';
      }
      update();
    });
  }

  // Charger select
  if (chargerSelect) {
    chargerSelect.addEventListener('change', update);
  }

  // Case select
  if (caseSelect) {
    caseSelect.addEventListener('change', update);
  }

  // Qty buttons
  kit.querySelectorAll('[data-qty-btn]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!batteryQtyInput) return;

      let val = parseInt(batteryQtyInput.value, 10) || 1;
      const action = btn.dataset.qtyBtn;

      if (action === 'increase' && val < 4) {
        val++;
      } else if (action === 'decrease' && val > 1) {
        val--;
      }

      batteryQtyInput.value = val;
      update();
    });
  });

  /* ================================================================
     ADD KIT TO CART
     ================================================================ */
  if (addBtn) {
    addBtn.addEventListener('click', async () => {
      const d = calc();
      if (!d.hasItems) return;

      // Build items array
      const items = [];

      // Always add tool
      items.push({ id: parseInt(toolId, 10), quantity: 1 });

      // Add battery
      if (d.b.id && d.bQty > 0) {
        items.push({ id: parseInt(d.b.id, 10), quantity: d.bQty });
      }

      // Add charger
      if (d.c.id) {
        items.push({ id: parseInt(d.c.id, 10), quantity: 1 });
      }

      // Add case
      if (d.k.id) {
        items.push({ id: parseInt(d.k.id, 10), quantity: 1 });
      }

      // Show loading
      addBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = '';

      try {
        const res = await fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });

        if (!res.ok) throw new Error('Failed to add');
        await res.json();

        // Success — apply discount code and go to cart
        if (btnText) btnText.textContent = 'Added!';
        if (btnText) btnText.style.display = '';
        if (btnLoading) btnLoading.style.display = 'none';

        // Apply discount code via redirect
        if (discountCode) {
          // Redirect to apply discount, then to cart
          window.location.href = '/discount/' + discountCode + '?redirect=/cart';
        } else {
          // No discount code, just go to cart
          window.location.href = '/cart';
        }

      } catch (err) {
        console.error('[Kit Builder]', err);
        if (btnText) btnText.textContent = 'Error \u2014 Try Again';
        if (btnText) btnText.style.display = '';
        if (btnLoading) btnLoading.style.display = 'none';
        addBtn.disabled = false;

        setTimeout(() => {
          if (btnText) btnText.textContent = 'Add Kit to Cart';
        }, 2000);
      }
    });
  }

  // Initial update
  update();

})();
