/* eslint-disable no-restricted-globals */

// ⚙️ Version des caches (à incrémenter quand tu changes la stratégie)
const CACHE_NAME = 'kd-portfolio-v1.0.2';
const RUNTIME_CACHE = 'kd-runtime-v1.0.2';

// 🔒 Assets précachés (critique pour le shell de l'app + PWA)
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
];

// Installation : précache des assets critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching assets');
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter(
            (name) =>
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE
          )
          .map((name) => {
            console.log('[SW] Suppression ancien cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

// Fetch : stratégies adaptées + éviter de cacher les réponses partielles (206)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore les requêtes non-GET ou cross-origin
  if (
    request.method !== 'GET' ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Cache First pour assets statiques (images, fonts, styles)
  if (
    request.destination === 'image' ||
    request.destination === 'font' ||
    request.destination === 'style'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request)
          .then((response) => {
            // On ne met en cache que les réponses complètes et basiques
            if (
              response &&
              response.ok &&
              response.status === 200 &&
              response.type === 'basic'
            ) {
              const clone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, clone);
              });
            }
            return response;
          })
          .catch(() => cached || null);
      })
    );
    return;
  }

  // Network First pour HTML/JS/SPA
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Ne pas mettre en cache les 206 / opaques
        if (
          response &&
          response.ok &&
          response.status === 200 &&
          (response.type === 'basic' || response.type === 'default')
        ) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => {
          // Fallback SPA
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return null;
        })
      )
  );
});

// Message handler pour skipWaiting manuel
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});