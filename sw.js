const CACHE_NAME = 'upload-pwa-cache-v1';
const ASSETS_TO_CACHE = [
  'upload.html',
  'upload-contractor.html',
  'manifest.json',
  'logo-transparent.png',
  'assets/css/style.css',
  'assets/js/app.js'
];

// Install Event - Caching the shell files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Service Worker: Caching files');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Cleaning old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network first, fallback to Cache
self.addEventListener('fetch', event => {
  // If it's the Apps Script endpoint, don't use cache
  if (event.request.url.includes('script.google.com') || event.request.url.includes('action=')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clone the response and save it to cache if valid static asset
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, read from Cache
        return caches.match(event.request);
      })
  );
});
