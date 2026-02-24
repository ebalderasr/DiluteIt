/* ==========================================
   DiluteIt Service Worker (PWA)
   ------------------------------------------
   - Precache core app shell
   - Cache versioning
   - Offline fallback for navigation
   - Same-origin static assets: stale-while-revalidate
   ========================================== */

const CACHE_NAME = "diluteit-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-192.png",
  "./icon-maskable-512.png"
];

/**
 * Install:
 * - Precache core files
 * - Activate new SW immediately
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
 * Activate:
 * - Remove old caches
 * - Take control of open pages
 */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
          return Promise.resolve();
        })
      );
      await self.clients.claim();
    })()
  );
});

/**
 * Fetch strategy
 *
 * 1) Navigations (HTML pages): network-first, fallback to cached app shell
 * 2) Same-origin GET assets: stale-while-revalidate
 * 3) Cross-origin: let browser handle
 */
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // 1) Navigation requests (user opens/reloads app)
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Try fresh network first
          const networkResponse = await fetch(request);
          // Optionally cache the latest navigation response
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

          // Last resort: generic response
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

  // 2) Same-origin static assets (icons, manifest, css/js embedded HTML dependencies)
  if (isSameOrigin) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);

        const networkFetch = fetch(request)
          .then((response) => {
            // Cache successful basic responses
            if (response && response.ok && response.type === "basic") {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => null);

        // Stale-while-revalidate:
        // return cache immediately if present, else wait for network
        if (cached) {
          // update in background
          event.waitUntil(networkFetch);
          return cached;
        }

        const networkResponse = await networkFetch;
        if (networkResponse) return networkResponse;

        // Fallback (nothing cached + no network)
        return new Response("", { status: 404, statusText: "Not Found" });
      })()
    );
  }
});