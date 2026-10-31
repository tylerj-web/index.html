/* Animation Studio shell is independent of Orbit's prior user databases. */
const CACHE='orbit-animation-studio-v1.0.0';
const PREFIX='orbit-animation-studio-';
const ASSETS=['./','./index.html','./studio.css?v=1.0.0','./studio.js?v=1.0.0','./manifest.webmanifest','./assets/head.png','./assets/torso.png','./assets/left-arm-upper.png','./assets/left-arm-lower.png','./assets/right-arm-upper.png','./assets/right-arm-lower.png','./assets/icon-192.png','./assets/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key)}await self.clients.claim()})())});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url);if(url.origin!==self.location.origin)return;
 e.respondWith((async()=>{const local=await caches.open(CACHE);const cached=await local.match(e.request);if(cached)return cached;try{const net=await fetch(e.request);return net}catch{return new Response('Orbit Motion Studio is offline and this resource is not cached.',{status:503,headers:{'Content-Type':'text/plain'}})}})())});
