/**
 * Cart Notification Custom Element
 * Dawn-aligned implementation for cart_type == 'notification'
 * Handles add-to-cart notification UI with Section Rendering API
 */
if (!customElements.get('cart-notification')) {
  customElements.define(
    'cart-notification',
    class CartNotification extends HTMLElement {
      constructor() {
        super();

        this.notification = this.querySelector('#cart-notification');
        this.onBodyClick = this.handleBodyClick.bind(this);
        this.activeElement = null;

        // Close button
        const closeBtn = this.querySelector('.cart-notification__close');
        if (closeBtn) {
          closeBtn.addEventListener('click', this.close.bind(this));
        }

        // Continue shopping button
        const continueBtn = this.querySelector('button.link');
        if (continueBtn) {
          continueBtn.addEventListener('click', this.close.bind(this));
        }
      }

      getSectionsToRender() {
        return [
          {
            id: 'cart-notification-product',
            section: 'cart-notification-product',
            selector: '#cart-notification-product',
          },
          {
            id: 'cart-notification-button',
            section: 'cart-notification-button',
            selector: '#cart-notification-button',
          },
          {
            id: 'cart-icon-bubble',
            section: 'cart-icon-bubble',
            selector: '.shopify-section',
          },
        ];
      }

      setActiveElement(element) {
        this.activeElement = element;
      }

      open() {
        if (!this.notification) return;
        this.notification.style.display = '';
        this.notification.classList.add('animate', 'active');

        this.notification.addEventListener(
          'transitionend',
          () => {
            this.notification.focus();
          },
          { once: true }
        );

        document.body.addEventListener('click', this.onBodyClick);

        // Auto-close after 6 seconds
        if (this._autoCloseTimer) clearTimeout(this._autoCloseTimer);
        this._autoCloseTimer = setTimeout(() => this.close(), 6000);
      }

      close() {
        if (!this.notification) return;
        this.notification.classList.remove('active');

        // Wait for animation, then hide
        setTimeout(() => {
          this.notification.style.display = 'none';
        }, 200);

        document.body.removeEventListener('click', this.onBodyClick);

        if (this._autoCloseTimer) {
          clearTimeout(this._autoCloseTimer);
          this._autoCloseTimer = null;
        }

        if (this.activeElement) {
          this.activeElement.focus();
          this.activeElement = null;
        }
      }

      renderContents(parsedState) {
        this.getSectionsToRender().forEach((section) => {
          const targetEl = document.getElementById(section.id)
            || document.querySelector(section.selector);
          if (!targetEl || !parsedState.sections[section.section]) return;

          if (section.id === 'cart-icon-bubble') {
            targetEl.innerHTML = this.getSectionInnerHTML(
              parsedState.sections[section.section],
              '.shopify-section'
            );
          } else {
            targetEl.innerHTML = this.getSectionInnerHTML(
              parsedState.sections[section.section],
              section.selector
            );
          }
        });

        this.open();
      }

      getSectionInnerHTML(html, selector = '.shopify-section') {
        return new DOMParser()
          .parseFromString(html, 'text/html')
          .querySelector(selector).innerHTML;
      }

      handleBodyClick(event) {
        if (!this.notification) return;
        // Close if clicking outside the notification
        if (!this.notification.contains(event.target)) {
          this.close();
        }
      }
    }
  );
}
