/**
 * Service Worker for GitHub Pages Portfolio
 * Implements Network-First (API) and Cache-First (assets) strategies
 * Optimizes for offline capability and instant loading on repeat visits
 */

const CACHE_VERSION = 'portfolio-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/data/blog.json',
  '/assets/data/news.json',
  '/assets/data/projects.json',
  '/assets/data/publications.json',
  '/assets/data/skills.json',
  '/assets/data/upcoming.json'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Silently fail if some assets aren't available yet
        return cache.addAll(STATIC_ASSETS.filter(asset => asset.endsWith('.html') || asset === '/'));
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_VERSION)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-first for API calls, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API calls: Network-first with cache fallback
  if (url.pathname.includes('/assets/data/') || url.pathname.includes('api')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return caches.match(request);
          }
          const responseClone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Static assets: Cache-first with network fallback
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/i)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseClone = response.clone();
          caches.open(CACHE_VERSION).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      }).catch(() => {
        // Return offline page or error asset
        return new Response('Offline - Asset not available', { status: 503 });
      })
    );
    return;
  }

  // HTML pages: Network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return caches.match(request);
        }
        const responseClone = response.clone();
        caches.open(CACHE_VERSION).then((cache) => {
          cache.put(request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(request) || 
               caches.match('/') ||
               new Response('Offline - Page not available', { status: 503 });
      })
  );
});
