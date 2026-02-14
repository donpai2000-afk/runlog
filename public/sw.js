/* eslint-disable no-restricted-globals */
const CACHE_NAME = "runlog-static-v7";

// オフライン不要なら、プリキャッシュは最小
const APP_SHELL = [
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
  event.waitUntil(
    (async () => {
      // 古いキャッシュを削除
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

// fetch ハンドラは置かない（ネット挙動を変えない）