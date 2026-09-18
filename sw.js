const CACHE_NAME = "orienta-te-comunidade-v3";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/pioneer-compass.png",
  "./assets/pioneer-fish.png",
  "./assets/pioneer-axe.png",
  "./assets/pioneer-drop.png",
  "./assets/header.webp",
  "./assets/footer.webp",
  "./assets/pdf-header.png",
  "./assets/pdf-footer.png",
  "./assets/pdf-compass.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if(cached) return cached;
      return fetch(event.request).then(response => {
        if(response.ok && new URL(event.request.url).origin === location.origin){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(c=>c.put(event.request,copy));
        }
        return response;
      }).catch(()=>caches.match("./index.html"));
    })
  );
});
