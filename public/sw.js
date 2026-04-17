// AHSAS Service Worker — Offline Support
const CACHE_NAME = 'ahsas-v5';
const OFFLINE_URLS = [
    '/',
    '/index.html',
    '/seminar.html',
    '/pieces.html',
    '/cer.html',
    '/cer-builder.html',
    '/source-analyzer.html',
    '/sources.html',
    '/timeline.html',
    '/compare.html',
    '/research.html',
    '/about.html',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
];

// Install: cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(OFFLINE_URLS);
        })
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            );
        })
    );
    self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Skip non-GET and external requests
    if (event.request.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;

    // API calls: network only (don't cache Supabase)
    if (url.pathname.startsWith('/api/') || url.hostname.includes('supabase')) {
        return;
    }

    // Static assets: cache-first with network fallback
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const networkFetch = fetch(event.request).then((response) => {
                // Update cache with fresh version
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => cached);

            return cached || networkFetch;
        })
    );
});
