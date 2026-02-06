// Snapapoulous Prime Service Worker
const CACHE_NAME = 'snapapoulous-cosmic-v1';
const FONT_CACHE = 'snap-fonts-v1';
// Dynamically build asset URLs based on service worker location
const SW_SCOPE = self.registration ? self.registration.scope : self.location.href.replace(/sw\.js$/, '');
const OFFLINE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './persona.json',
  './card-data.json',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// Install event - cache offline assets with error handling
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching offline assets');
        return cache.addAll(OFFLINE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Install complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Cache install failed:', error);
        // Still skip waiting so new SW activates even if some assets fail to cache
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Check if we're updating from an old cache
        const hadOldCache = cacheNames.some(name => name !== CACHE_NAME && name.startsWith('snapapoulous-'));

        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        ).then(() => hadOldCache);
      })
      .then((hadOldCache) => {
        console.log('[SW] Claiming clients');
        return self.clients.claim().then(() => hadOldCache);
      })
      .then((hadOldCache) => {
        // If we upgraded from an old version, notify all clients to reload
        if (hadOldCache) {
          console.log('[SW] Upgrade detected, notifying clients to reload...');
          return self.clients.matchAll({ type: 'window' }).then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: 'SW_UPDATED', version: CACHE_NAME });
            });
          });
        }
      })
  );
});

// Helper function for stale-while-revalidate strategy
const staleWhileRevalidate = (event, cache, cachedResponse) => {
  const networkFetch = fetch(event.request)
    .then((networkResponse) => {
      if (networkResponse.ok) {
        // Update cache with fresh response
        cache.put(event.request, networkResponse.clone());
        console.log('[SW] Updated cache for:', event.request.url);
      }
      return networkResponse;
    })
    .catch((error) => {
      console.log('[SW] Network fetch failed:', error);
      // Return cached response on network failure (if available)
      if (cachedResponse) {
        return cachedResponse.clone();
      }
      // No cached version available
      throw error;
    });

  // Return cached response immediately if available, otherwise wait for network
  return cachedResponse ? cachedResponse.clone() : networkFetch;
};

// Fetch event - different strategies for different content types
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests EXCEPT Google Fonts (which we cache)
  const url = new URL(event.request.url);

  // Cache Google Fonts for offline support
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached font, but also fetch fresh in background
            fetch(event.request).then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(event.request, networkResponse);
              }
            }).catch(() => {});
            return cachedResponse;
          }
          // Not cached, fetch and cache
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  if (url.origin !== location.origin) {
    return;
  }

  // NETWORK-FIRST for HTML files - always get fresh content when online
  // This ensures users get updates immediately
  const isHTMLRequest = event.request.mode === 'navigate' ||
                        (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) ||
                        url.pathname.endsWith('.html') ||
                        url.pathname === '/' ||
                        url.pathname.endsWith('/');

  if (isHTMLRequest) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Got fresh response, cache it
          if (networkResponse.ok) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Network failed, fall back to cache
          console.log('[SW] Network failed for HTML, serving from cache');
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
    return;
  }

  // Stale-while-revalidate for card data and persona (ensures fresh data while serving cached)
  if (event.request.url.includes('card-data.json') || event.request.url.includes('persona.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          return staleWhileRevalidate(event, cache, cachedResponse);
        });
      })
    );
    return;
  }

  // CACHE-FIRST for other assets (images, manifest, etc.)
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached version
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // Clone the response for caching
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(() => {
            // Network failed for non-HTML asset
            console.log('[SW] Network failed for asset:', event.request.url);
            return null;
          });
      })
  );
});

// Handle messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
