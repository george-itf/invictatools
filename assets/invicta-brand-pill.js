/* ============================================================
   INVICTA BRAND PILL JS — v1.8 PRO (Tooltip Engine)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const pills = document.querySelectorAll("[data-tooltip]");

  pills.forEach((pill) => {
    let tooltipTimer;

    /* Hover start */
    pill.addEventListener("mouseenter", () => {
      const txt = pill.getAttribute("data-tooltip");
      if (!txt) return;

      tooltipTimer = setTimeout(() => {
        pill.classList.add("invicta-tooltip-active");
      }, 550); // Elegant delay
    });

    /* Hover end */
    pill.addEventListener("mouseleave", () => {
      clearTimeout(tooltipTimer);
      pill.classList.remove("invicta-tooltip-active");
    });

    /* Mobile tap */
    pill.addEventListener("click", (e) => {
      const txt = pill.getAttribute("data-tooltip");
      if (!txt) return;

      e.preventDefault();
      pill.classList.toggle("invicta-tooltip-active");

      /* Auto-hide after 3 sec */
      setTimeout(() => {
        pill.classList.remove("invicta-tooltip-active");
      }, 3000);
    });
  });
});

