(function() {
  'use strict';

  document.querySelectorAll('[data-inv-delivery-estimate]').forEach(function(el) {
    const stockSource = el.dataset.stockSource || 'invicta';

    // Supplier-sourced items show a static estimate — no countdown needed
    if (stockSource === 'supplier') return;

    const dayEl = el.querySelector('[data-inv-del-day]');
    const countdownEls = el.querySelectorAll('[data-inv-del-countdown]');
    const orderTextEl = el.querySelector('[data-inv-del-order-text]');
    const forTextEl = el.querySelector('[data-inv-del-for-text]');
    if (!dayEl) return;

    const cutoffHour = window.invictaConfig ? window.invictaConfig.deliveryCutoffHour : 14;
    let timerId = null;

    function getDeliveryDay() {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      const pastCutoff = hour >= cutoffHour;
      const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

      if (day >= 1 && day <= 4 && !pastCutoff) {
        return days[day + 1];
      } else if (day >= 1 && day <= 3 && pastCutoff) {
        return days[day + 2];
      } else if (day === 4 && pastCutoff) {
        return 'Monday';
      } else if (day === 5 && !pastCutoff) {
        return 'Monday';
      } else if (day === 5 && pastCutoff) {
        return 'Tuesday';
      } else {
        return 'Tuesday';
      }
    }

    function update() {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay();
      const isWeekday = day >= 1 && day <= 5;
      const beforeCutoff = hour < cutoffHour;

      dayEl.textContent = getDeliveryDay();

      if (isWeekday && beforeCutoff && countdownEls.length) {
        const cutoff = new Date();
        cutoff.setHours(cutoffHour, 0, 0, 0);
        const diff = cutoff - now;
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        const formatted = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
        countdownEls.forEach(function(c) {
          c.textContent = formatted;
          c.style.display = '';
        });
        if (orderTextEl) orderTextEl.textContent = 'Order within ';

        /* CX v1.0: Add urgency classes when time is running low */
        if (h < 2) {
          el.classList.add('inv-del-est--urgent');
        } else {
          el.classList.remove('inv-del-est--urgent');
        }
        if (h === 0 && m < 30) {
          el.classList.add('inv-del-est--critical');
        } else {
          el.classList.remove('inv-del-est--critical');
        }
      } else {
        countdownEls.forEach(function(c) { c.style.display = 'none'; });
        if (orderTextEl) orderTextEl.textContent = 'Order now';
        el.classList.remove('inv-del-est--urgent', 'inv-del-est--critical');

        // No countdown needed outside business hours — stop the timer
        if (timerId) {
          clearInterval(timerId);
          timerId = null;
        }
      }
    }

    update();
    // Only run the timer during business hours when countdown is visible
    const now = new Date();
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    if (isWeekday && now.getHours() < cutoffHour) {
      timerId = setInterval(update, 1000);
    }
  });
})();
