const CACHE_NAME = 'orbit-prototype-v2.4.0-robot-personality';
const ASSETS = ["./", "./index.html", "./styles.css", "./rework.css", "./app.js", "./orbit-behavior.js", "./offline-brain.js", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/maskable-512.png", "./assets/apple-touch-icon.png", "./assets/orbit-blocked-0.png", "./assets/orbit-blocked-1.png", "./assets/orbit-blocked-2.png", "./assets/orbit-blocked-3.png", "./assets/orbit-blocked-4.png", "./assets/orbit-blocked-5.png", "./assets/orbit-blocked-6.png", "./assets/orbit-blocked-7.png", "./assets/orbit-idle-0.png", "./assets/orbit-idle-1.png", "./assets/orbit-idle-2.png", "./assets/orbit-idle-3.png", "./assets/orbit-idle-4.png", "./assets/orbit-idle-5.png", "./assets/orbit-jump-0.png", "./assets/orbit-jump-1.png", "./assets/orbit-jump-2.png", "./assets/orbit-jump-3.png", "./assets/orbit-jump-4.png", "./assets/orbit-review-0.png", "./assets/orbit-review-1.png", "./assets/orbit-review-2.png", "./assets/orbit-review-3.png", "./assets/orbit-review-4.png", "./assets/orbit-review-5.png", "./assets/orbit-robot.png", "./assets/orbit-waiting-0.png", "./assets/orbit-waiting-1.png", "./assets/orbit-waiting-2.png", "./assets/orbit-waiting-3.png", "./assets/orbit-waiting-4.png", "./assets/orbit-waiting-5.png", "./assets/orbit-wave-0.png", "./assets/orbit-wave-1.png", "./assets/orbit-wave-2.png", "./assets/orbit-wave-3.png", "./assets/orbit-working-0.png", "./assets/orbit-working-1.png", "./assets/orbit-working-2.png", "./assets/orbit-working-3.png", "./assets/orbit-working-4.png", "./assets/orbit-working-5.png"];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('orbit-prototype-') && key !== CACHE_NAME).map(key => caches.delete(key)))),self.clients.claim()]));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const u=new URL(req.url);
  if (u.origin !== self.location.origin) {
    if ((u.hostname==='esm.run'||u.hostname==='cdn.jsdelivr.net') && req.destination==='script') {
      event.respondWith(caches.open(CACHE_NAME).then(async c => {
        const old=await c.match(req);if(old)return old;
        const fresh=await fetch(req);if(fresh.ok) c.put(req,fresh.clone()).catch(()=>{});
        return fresh;
      }));
    }
    return;
  }
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(response => { const copy = response.clone(); caches.open(CACHE_NAME).then(cache => cache.put('./index.html',copy)).catch(()=>{}); return response; }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req).then(cached => cached || fetch(req)));
});
