/* Orbit Fluid 3D Lab 1.0 — own scope, no storage/database clearing. */
const PREFIX='orbit-fluid3d-',CACHE=PREFIX+'v1.0.0';
const ASSETS=['./','./index.html','./style.css','./app.mjs','./motion.mjs','./renderer.mjs','./manifest.webmanifest',
 './assets/Orbit_WebMeshes.json','./assets/Orbit_WebMeshes.bin','./assets/Head_front.png','./assets/Torso_front.png','./assets/LeftArm_front.png','./assets/RightArm_front.png','./assets/approved_master_1254.png','./assets/Orbit_FourPart_Reference3D.glb'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith(PREFIX)&&k!==CACHE)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==self.location.origin||!u.pathname.includes('/orbit/fluid3d/'))return;
 e.respondWith((async()=>{const cache=await caches.open(CACHE);const hit=await cache.match(r);if(r.mode==='navigate'){try{const fresh=await fetch(r);if(fresh.ok)cache.put(r,fresh.clone()).catch(()=>{});return fresh;}catch{return hit||cache.match('./index.html')}}if(hit)return hit;const response=await fetch(r);if(response.ok)cache.put(r,response.clone()).catch(()=>{});return response})());});
