/* Dedicated, non-destructive Orbit Fluid Studio cache. Scoped to /orbit/fluid/. */
const CACHE='orbit-fluid-studio-v1.0.0', PREFIX='orbit-fluid-studio-';
const FILES=['./','./index.html','./style.css','./engine.js','./assets/parts.json','./assets/head.png','./assets/torso.png','./assets/left-arm.png','./assets/right-arm.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys()){if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key)}await self.clients.claim()})()));
self.addEventListener('fetch',event=>{const req=event.request;if(req.method!=='GET')return;const url=new URL(req.url);if(url.origin!==location.origin||!url.pathname.includes('/orbit/fluid/'))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);const stored=await cache.match(req);if(stored)return stored;
 try{const fresh=await fetch(req);if(fresh.ok)cache.put(req,fresh.clone()).catch(()=>{});return fresh}catch(e){if(req.mode==='navigate')return cache.match('./index.html');throw e}
 })());});
