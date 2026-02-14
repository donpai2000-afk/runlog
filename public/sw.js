/* eslint-disable no-restricted-globals */
const CACHE_NAME = "runlog-static-v5";
const APP_SHELL = [
  "/",
  "/manifest.webmanifest",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        for (const url of APP_SHELL) {
          try {
            await cache.add(new Request(url, { cache: "reload" }));
          } catch (_) {
            // 1件失敗しても install 全体は失敗させない
          }
        }
      } catch (_) {
        // ここで落ちても install を失敗扱いにしない
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match("/")));
    return;
  }

  event.respondWith(caches.match(req).then((c) => c || fetch(req)));
});