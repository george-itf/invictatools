/**
 * ============================================
 * Invicta Tools PWA Service Worker v1.1 (P0.5 FIX)
 * ============================================
 * Handles caching, offline support, and performance.
 *
 * P0.5 FIX: No longer caches HTML pages to avoid stale
 * pricing/availability on Shopify dynamic storefronts.
 * Only caches static assets (CSS, JS, images, fonts).
 *
 * @version 1.1.0
 * @author Invicta Tools
 * ============================================
 */

const CACHE_VERSION = 'v1-20260219';
const CACHE_NAME = `invicta-tools-${CACHE_VERSION}`;
const MAX_CACHE_SIZE = 200;

/**
 * Core assets to cache on install
 * P0.5 FIX: Only cache static assets, not HTML pages
 * HTML pages can have dynamic pricing/availability
 * @type {string[]}
 */
const PRECACHE_ASSETS = [
  // Removed HTML pages - they change too often for Shopify stores
];

/**
 * Static assets - use cache-first strategy
 * @type {RegExp[]}
 */
const STATIC_ASSETS = [
  /\.(?:css|js)(\?.*)?$/,
  /\.(?:png|jpg|jpeg|gif|webp|svg|ico)(\?.*)?$/,
  /\.(?:woff|woff2|ttf|eot)(\?.*)?$/,
  /\/cdn\//
];

/**
 * Never cache these URLs
 * @type {RegExp[]}
 */
const NEVER_CACHE = [
  /\/cart/,
  /\/checkout/,
  /\/account/,
  /\/admin/,
  /\.json$/,
  /\/search/,
  /analytics/,
  /google/,
  /facebook/,
  /klaviyo/,
  /cdn\.shopify\.com\/s\/javascripts\/.*\/checkout/
];


/* ========================================
   INSTALL EVENT
   ======================================== */

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});


/* ========================================
   ACTIVATE EVENT
   ======================================== */

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('invicta-tools-') && name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});


/* ========================================
   FETCH EVENT
   ======================================== */

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  /* Skip non-GET requests */
  if (request.method !== 'GET') {
    return;
  }
  
  /* Skip cross-origin requests (except Shopify CDN) */
  if (url.origin !== location.origin && !url.hostname.includes('shopify.com')) {
    return;
  }
  
  /* Never cache certain URLs */
  if (NEVER_CACHE.some((pattern) => pattern.test(url.href))) {
    return;
  }
  
  /* Determine caching strategy */
  const isStaticAsset = STATIC_ASSETS.some((pattern) => pattern.test(url.pathname));

  if (isStaticAsset) {
    /* Cache-first for static assets */
    event.respondWith(cacheFirst(request));
  } else if (request.mode === 'navigate') {
    /**
     * P0.5 FIX: Network-only for HTML pages
     * Shopify storefronts have dynamic content (prices, stock)
     * that should not be served stale from cache.
     * Only provide offline fallback if network fails completely.
     */
    event.respondWith(networkOnlyWithOfflineFallback(request));
  }
});


/* ========================================
   CACHING STRATEGIES
   ======================================== */

/**
 * Cache-first strategy
 * Returns cached response, falls back to network
 * Updates cache in background
 * 
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    /* Update cache in background (stale-while-revalidate) */
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  /* Not cached - fetch and cache */
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
      trimCache();
    }

    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503 });
  }
}


/**
 * Network-only strategy with offline fallback (P0.5 FIX)
 * Always fetches fresh HTML from network
 * Only shows offline page if network completely fails
 * Does NOT cache HTML to avoid stale pricing/availability
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function networkOnlyWithOfflineFallback(request) {
  try {
    // Always fetch fresh from network - never cache HTML
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    /* Network failed - return offline page */
    if (request.mode === 'navigate') {
      /* Fallback offline response */
      return new Response(getOfflineHTML(), {
        status: 503,
        headers: { 'Content-Type': 'text/html' }
      });
    }

    return new Response('Offline', { status: 503 });
  }
}


/**
 * Update cache in background
 * @param {Request} request
 */
async function updateCacheInBackground(request) {
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
      await trimCache();
    }
  } catch (error) {
    /* Silent fail - cached version exists */
  }
}


/**
 * Trim cache to MAX_CACHE_SIZE entries
 * Deletes the oldest entries (first in the keys list) when over the limit.
 */
async function trimCache() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();

  if (keys.length <= MAX_CACHE_SIZE) {
    return;
  }

  const overage = keys.length - MAX_CACHE_SIZE;
  const toDelete = keys.slice(0, overage);

  await Promise.all(toDelete.map((key) => cache.delete(key)));
}


/**
 * Generate basic offline HTML
 * @returns {string}
 */
function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en-GB">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Invicta Tools</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          background: #f5f5f5;
          color: #1a1a1a;
        }
        .offline-container {
          text-align: center;
          max-width: 400px;
        }
        .offline-icon {
          width: 80px;
          height: 80px;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }
        h1 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        p {
          color: #666;
          margin-bottom: 2rem;
          line-height: 1.5;
        }
        button {
          background: #e11d26;
          color: white;
          border: none;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          min-width: 200px;
        }
        button:hover {
          background: #c41920;
        }
        .home-link {
          display: block;
          margin-top: 1.5rem;
          color: #e11d26;
          text-decoration: none;
          font-size: 0.875rem;
        }
      </style>
    </head>
    <body>
      <div class="offline-container">
        <svg class="offline-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
        <h1>You're Offline</h1>
        <p>It looks like you've lost your internet connection. Check your connection and try again.</p>
        <button onclick="window.location.reload()">Try Again</button>
        <a href="/" class="home-link">Go to Homepage</a>
      </div>
    </body>
    </html>
  `;
}


/* ========================================
   MESSAGE HANDLER
   ======================================== */

self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data === 'clearCache') {
    caches.delete(CACHE_NAME);
  }
});
