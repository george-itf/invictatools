(function() {
  'use strict';

  document.querySelectorAll('[data-inv-delivery-estimate]').forEach(function(el) {
    var dayEl = el.querySelector('[data-inv-del-day]');
    var countdownEl = el.querySelector('[data-inv-del-countdown]');
    var orderTextEl = el.querySelector('[data-inv-del-order-text]');
    var forTextEl = el.querySelector('[data-inv-del-for-text]');
    if (!dayEl) return;

    var cutoffHour = window.invictaConfig ? window.invictaConfig.deliveryCutoffHour : 14;
    var timerId = null;

    function getDeliveryDay() {
      var now = new Date();
      var day = now.getDay();
      var hour = now.getHours();
      var pastCutoff = hour >= cutoffHour;
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

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
      var now = new Date();
      var hour = now.getHours();
      var day = now.getDay();
      var isWeekday = day >= 1 && day <= 5;
      var beforeCutoff = hour < cutoffHour;

      dayEl.textContent = getDeliveryDay();

      if (isWeekday && beforeCutoff && countdownEl) {
        var cutoff = new Date();
        cutoff.setHours(cutoffHour, 0, 0, 0);
        var diff = cutoff - now;
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        countdownEl.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
        countdownEl.style.display = 'inline';
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
        if (countdownEl) countdownEl.style.display = 'none';
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
    var now = new Date();
    var isWeekday = now.getDay() >= 1 && now.getDay() <= 5;
    if (isWeekday && now.getHours() < cutoffHour) {
      timerId = setInterval(update, 1000);
    }
  });
})();
