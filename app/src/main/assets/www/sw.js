/* ===== KAYAN STORE SERVICE WORKER ===== */
const CACHE_NAME = 'kayan-store-v1.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/main.css',
  './css/layout.css',
  './css/pages.css',
  './js/store.js',
  './js/renderers.js',
  './js/ui.js',
  './data/products.json',
  './manifest.json'
];

// Install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - Cache first for assets, network first for data
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (images from Unsplash)
  if (!url.origin.includes(self.location.origin) && !url.hostname.includes('fonts.googleapis') && !url.hostname.includes('fonts.gstatic')) {
    event.respondWith(
      fetch(request).catch(() => new Response('', { status: 503 }))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          if (response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          }
          return response;
        });
      })
      .catch(() => {
        // Offline fallback
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html');
        }
      })
  );
});

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'كيان ستور', {
      body: data.body || 'لديك إشعار جديد',
      icon: './manifest.json',
      badge: './manifest.json',
      dir: 'rtl',
      lang: 'ar',
      tag: 'kayan-store',
      data: { url: data.url || '/' }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
