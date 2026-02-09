(function() {
  document.querySelectorAll('[data-inv-delivery-estimate]').forEach(function(el) {
    var dayEl = el.querySelector('[data-inv-del-day]');
    var countdownEl = el.querySelector('[data-inv-del-countdown]');
    var orderTextEl = el.querySelector('[data-inv-del-order-text]');
    var forTextEl = el.querySelector('[data-inv-del-for-text]');
    if (!dayEl) return;

    var cutoffHour = window.invictaConfig ? window.invictaConfig.deliveryCutoffHour : 14;

    function getDeliveryDay() {
      var now = new Date();
      var day = now.getDay();
      var hour = now.getHours();
      var pastCutoff = hour >= cutoffHour;

      // Map: current day -> delivery day name
      // If before cutoff on weekday: next working day
      // If after cutoff: day after next working day
      var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

      if (day >= 1 && day <= 4 && !pastCutoff) {
        // Mon-Thu before 2pm -> tomorrow
        return days[day + 1];
      } else if (day >= 1 && day <= 3 && pastCutoff) {
        // Mon-Wed after 2pm -> day after tomorrow
        return days[day + 2];
      } else if (day === 4 && pastCutoff) {
        // Thu after 2pm -> Monday
        return 'Monday';
      } else if (day === 5 && !pastCutoff) {
        // Fri before 2pm -> Monday
        return 'Monday';
      } else if (day === 5 && pastCutoff) {
        // Fri after 2pm -> Tuesday
        return 'Tuesday';
      } else if (day === 6) {
        // Saturday -> Tuesday
        return 'Tuesday';
      } else {
        // Sunday -> Tuesday
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
        // Show countdown
        var cutoff = new Date();
        cutoff.setHours(cutoffHour, 0, 0, 0);
        var diff = cutoff - now;
        var h = Math.floor(diff / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);
        countdownEl.textContent = String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
        countdownEl.style.display = 'inline';
        forTextEl.style.display = 'inline';
        orderTextEl.textContent = 'Order within ';
      } else {
        if (countdownEl) countdownEl.style.display = 'none';
        if (forTextEl) forTextEl.style.display = 'none';
        orderTextEl.textContent = 'Order now for delivery ';
      }
    }

    update();
    setInterval(update, 1000);
  });
})();
