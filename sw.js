/* ==========================================
   DiluteIt Service Worker (PWA)
   ------------------------------------------
   - Precache core app shell
   - Cache versioning
   - Offline fallback for navigation
   - Same-origin assets: stale-while-revalidate
   ========================================== */

const CACHE_NAME = "diluteit-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon-180.png"
];

/**
 * INSTALL
 * - Cache app shell
 * - Activate immediately
 */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(APP_SHELL);
      await self.skipWaiting();
    })()
  );
});

/**
 * ACTIVATE
 * - Remove old cache versions
 * - Take control of open pages
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );

      await self.clients.claim();
    })()
  );
});

/**
 * FETCH STRATEGY
 *
 * 1) HTML navigation requests: network-first
 *    Fallback to cached index when offline.
 *
 * 2) Same-origin static files: stale-while-revalidate
 *    Return cached version immediately (if present),
 *    then refresh cache in background.
 *
 * 3) Other requests: browser default behavior.
 */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // 1) Navigation (page loads / reloads)
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);

          // Update cached shell page
          const cache = await caches.open(CACHE_NAME);
          cache.put("./index.html", networkResponse.clone());

          return networkResponse;
        } catch (error) {
          // Offline fallback
          const cachedIndex =
            (await caches.match("./index.html")) ||
            (await caches.match("./")) ||
            (await caches.match("/index.html"));

          if (cachedIndex) return cachedIndex;

          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
            headers: { "Content-Type": "text/plain; charset=utf-8" }
          });
        }
      })()
    );
    return;
  }

  // 2) Same-origin assets (icons, manifest, etc.)
  if (isSameOrigin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);

        const networkPromise = fetch(request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.ok &&
              (networkResponse.type === "basic" || networkResponse.type === "default")
            ) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => null);

        // Stale-while-revalidate
        if (cachedResponse) {
          event.waitUntil(networkPromise);
          return cachedResponse;
        }

        const networkResponse = await networkPromise;
        if (networkResponse) return networkResponse;

        return new Response("", { status: 404, statusText: "Not Found" });
      })()
    );
  }
});