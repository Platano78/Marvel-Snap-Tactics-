// Snapapoulous Prime Service Worker
const CACHE_NAME = 'snapapoulous-v6';
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

// Install event - cache offline assets
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
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests (API calls, CDN resources)
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) {
    return;
  }

  // Stale-while-revalidate for card data (ensures fresh data while serving cached)
  if (event.request.url.includes('card-data.json')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cachedResponse => {
          // Start network fetch in background
          const networkFetch = fetch(event.request).then(networkResponse => {
            if (networkResponse.ok) {
              // Update cache with fresh response
              cache.put(event.request, networkResponse.clone());
              console.log('[SW] Updated card-data.json cache');
            }
            return networkResponse;
          }).catch(error => {
            console.log('[SW] Network fetch failed for card-data.json:', error);
            return cachedResponse;
          });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || networkFetch;
        });
      })
    );
    return;
  }

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
            // Network failed, try to return offline page for HTML requests
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
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
