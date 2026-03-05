/**
 * sw.js — Service Worker for offline caching
 */

const CACHE_NAME = 'playbook-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './config.js',
  './css/app.css',
  './js/app.js',
  './js/api.js',
  './js/store.js',
  './js/engine.js',
  './js/tabs/dashboard.js',
  './js/tabs/checkin.js',
  './js/tabs/nutrition.js',
  './js/tabs/lifts.js',
  './js/tabs/prayers.js',
  './js/components/progress-ring.js',
  './js/components/radar-chart.js',
  './js/components/toast.js',
  './manifest.json'
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — cache-first for static, network-first for API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for Sheets API calls
  if (url.hostname === 'sheets.googleapis.com') {
    event.respondWith(
      fetch(event.request)
        .then(response => response)
        .catch(() => {
          // Offline — IndexedDB handles cached data in the app layer
          return new Response(JSON.stringify({ values: [] }), {
            headers: { 'Content-Type': 'application/json' }
          });
        })
    );
    return;
  }

  // Skip Google Identity Services
  if (url.hostname === 'accounts.google.com') {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Cache successful responses for same-origin requests
        if (response.ok && url.origin === self.location.origin) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
