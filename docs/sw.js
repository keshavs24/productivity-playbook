/**
 * sw.js — Service Worker for offline caching
 * v4: Updated for Firebase backend + new tab structure
 */

const CACHE_NAME = 'playbook-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './config.js',
  './css/app.css',
  './js/app.js',
  './js/firebase.js',
  './js/engine.js',
  './js/wisdom.js',
  './js/spaced-repetition.js',
  './js/tabs/today.js',
  './js/tabs/track.js',
  './js/tabs/track/nutrition.js',
  './js/tabs/track/lifts.js',
  './js/tabs/track/prayers.js',
  './js/tabs/track/body.js',
  './js/tabs/learn.js',
  './js/tabs/profile.js',
  './js/components/progress-bar.js',
  './js/components/segment-bar.js',
  './js/components/pill-tabs.js',
  './js/components/heatmap.js',
  './js/components/flashcard-review.js',
  './js/components/radar-chart.js',
  './js/components/toast.js',
  './data/skills.json',
  './data/flashcards.json',
  './data/challenges.json',
  './data/synthesis-prompts.json',
  './data/cases.json',
  './data/mastery-questions.json',
  './manifest.json'
];

// Install — cache static assets, force activate
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — delete ALL old caches
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

// Fetch — network-first for Firebase/API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Network-first for Firebase API calls
  if (url.hostname.includes('firebaseio.com') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('firestore.googleapis.com')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }

  // Skip Firebase Auth and CDN scripts
  if (url.hostname === 'accounts.google.com' ||
      url.hostname.includes('gstatic.com') ||
      url.hostname.includes('jsdelivr.net')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first for same-origin (ensures fresh deploys take effect)
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Default: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
