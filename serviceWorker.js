const staticAssets = [
    './',
    './js/serviceLoader.js',
    './serviceWorker.js',
    './style/main.css',
    './js/animframe_polyfill.js',
    './js/keyboard_input_manager.js',
    './js/html_actuator.js',
    './js/grid.js',
    './js/tile.js',
    './js/local_score_manager.js',
    './js/game_manager.js',
    './js/application.js',
    './favicon.ico'
];

self.addEventListener('install', async event => {
    const cache = await caches.open('static-cache');
    cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if (url.origin === location.url) {
        event.respondWith(cacheFirst(req));
    } else {
        event.respondWith(networkFirst(req));
    }
});

async function cacheFirst(req) {
    const cachedResponse = caches.match(req);
    return cachedResponse || fetch(req);
}

async function networkFirst(req) {
    const cache = await caches.open('dynamic-cache');

    try {
        const res = await fetch(req);
        cache.put(req, res.clone());
        return res;
    } catch (error) {
        return await cache.match(req);
    }
}
