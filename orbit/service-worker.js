/* Orbit 3D Studio v1.0 — cache app assets only. NEVER touch browser databases. */
const CACHE='orbit-3d-studio-v1.0.0';const PREFIX='orbit-3d-studio-';
const FILES=['./','./index.html','./styles.css','./app.mjs','./renderer.mjs','./rig.mjs','./manifest.webmanifest','./assets/orbit-icon.svg','./assets/Orbit_4Piece_Rig.glb','./PRODUCTION_SPEC.md'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const u=new URL(event.request.url);if(event.request.method!=='GET'||u.origin!==self.location.origin||!u.pathname.includes('/orbit/'))return;event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(event.request);const fresh=fetch(event.request).then(r=>{if(r.ok)c.put(event.request,r.clone()).catch(()=>{});return r;});if(hit){fresh.catch(()=>{});return hit;}return fresh.catch(()=>c.match('./index.html'));})());});
