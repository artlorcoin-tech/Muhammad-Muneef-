const CACHE_NAME = 'muneef-portfolio-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/kashmir.jpg',
  '/images/architecture.jpg',
  '/images/noise.jpg',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/og-card.png'
];

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache and return requests with Network-First for HTML/configs and Cache-First for assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isHtml = event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html');
  const isConfig = url.pathname.includes('manifest.json') || url.pathname.includes('sw.js');

  if (isHtml || isConfig) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        })
    );
  }
});

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
