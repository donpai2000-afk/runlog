/* eslint-disable no-restricted-globals */
const CACHE_NAME = "runlog-static-v3";
const APP_SHELL = [
  "/",
  "/login",
  "/manifest.webmanifest",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // 1件ずつ入れて、失敗してもSWが死なない
      for (const url of APP_SHELL) {
        try {
          await cache.add(new Request(url, { cache: "reload" }));
        } catch (e) {
          console.warn("[SW] cache add failed:", url, e);
        }
      }
    })()
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then((r) => r || caches.match("/")))
    );
    return;
  }

  event.respondWith(caches.match(req).then((cached) => cached || fetch(req)));
});