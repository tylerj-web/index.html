/* Orbit 3.0 versioned, resilient offline app-shell cache. Model weights use WebLLM's separate storage. */
const CACHE_NAME='orbit-shell-v3.0.0', PREFIX='orbit-shell-';
const ASSETS=['./','./index.html','./styles.css','./rework.css','./hd-motion.css','./v3.css','./app.js','./orbit-store.js','./orbit-behavior.js','./offline-brain.js','./manifest.webmanifest','./assets/orbit-robot.png','./assets/icon-192.png','./assets/icon-512.png','./assets/maskable-512.png','./assets/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>(k.startsWith(PREFIX)||k.startsWith('orbit-prototype-'))&&k!==CACHE_NAME).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',e=>{
 const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
 if(url.origin!==self.location.origin){
   if((url.hostname==='esm.run'||url.hostname==='cdn.jsdelivr.net')&&req.destination==='script'){
     e.respondWith(caches.open(CACHE_NAME).then(async c=>{const old=await c.match(req);if(old)return old;const r=await fetch(req);if(r.ok||r.type==='opaque')c.put(req,r.clone()).catch(()=>{});return r;}));
   }
   return;
 }
 if(!url.pathname.startsWith(new URL(self.registration.scope).pathname))return;
 if(req.mode==='navigate'){
   e.respondWith(fetch(req).then(r=>{if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.put('./index.html',copy)));}return r;}).catch(async()=>await caches.match('./index.html')||Response.error()));return;
 }
 e.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(r=>{if(r.ok&&ASSETS.some(path=>new URL(path,self.registration.scope).href===req.url)){const clone=r.clone();e.waitUntil(caches.open(CACHE_NAME).then(c=>c.put(req,clone)));}return r;})));
});
