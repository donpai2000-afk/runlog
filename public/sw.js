/* eslint-disable no-restricted-globals */
const CACHE_NAME = "runlog-static-v6";
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
      const cache = await caches.open(CACHE_NAME);
      for (const url of APP_SHELL) {
        try {
          await cache.add(new Request(url, { cache: "reload" }));
        } catch (_) {}
      }
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});