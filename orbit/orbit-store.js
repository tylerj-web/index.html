/* Orbit 3.0 local persistence. IndexedDB is primary; old prototype data are migrated without deletion. */
(()=>{'use strict';
const DB='orbit.mobile.v3',VERSION=1,LEGACY='orbit.mobile.prototype.v1';
const GROUPS=['conversations','reports','notes','audits','outbox','revisions'];
let db=null,last={},queued=null,timer=null,chain=Promise.resolve(),fault=null;
const request=r=>new Promise((resolve,reject)=>{r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('IndexedDB failed'));});
const done=t=>new Promise((resolve,reject)=>{t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error||Error('Database transaction failed'));t.onabort=()=>reject(t.error||Error('Database transaction aborted'));});
async function open(){if(db)return db;if(!('indexedDB' in window))throw Error('IndexedDB unavailable');
 db=await new Promise((resolve,reject)=>{const r=indexedDB.open(DB,VERSION);r.onupgradeneeded=()=>{const d=r.result;for(const n of ['meta',...GROUPS])if(!d.objectStoreNames.contains(n))d.createObjectStore(n,{keyPath:'id'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error||Error('Cannot open IndexedDB'));});return db;
}
function simplify(state){const o={...state};for(const g of GROUPS)delete o[g];delete o.messages;return o;}
async function read(){const d=await open();const tx=d.transaction(['meta',...GROUPS],'readonly');const reads=Promise.all([request(tx.objectStore('meta').get('state')),...GROUPS.map(g=>request(tx.objectStore(g).getAll()))]);const values=await reads;await done(tx);return {meta:values[0],groups:Object.fromEntries(GROUPS.map((g,i)=>[g,values[i+1]]))};}
async function bootstrap(fallback){try{const data=await read();if(data.meta){const state={...fallback,...data.meta.value};for(const g of GROUPS)state[g]=data.groups[g];state.conversations=state.conversations||[];return state;}await flushNow(fallback);return fallback;}catch(e){fault=e.message;return fallback;}}
function queue(state){queued=JSON.parse(JSON.stringify(state));clearTimeout(timer);timer=setTimeout(()=>{flush().catch(()=>{});},120);}
async function flushNow(state){queued=JSON.parse(JSON.stringify(state));return flush();}
async function flush(){clearTimeout(timer);if(!queued)return chain;const snapshot=queued;queued=null;
 chain=chain.catch(()=>{}).then(async()=>{try{const d=await open();const tx=d.transaction(['meta',...GROUPS],'readwrite');const meta={id:'state',value:simplify(snapshot)};const store=tx.objectStore('meta');const m=JSON.stringify(meta);if(last.meta!==m){store.put(meta);last.meta=m;}
 for(const g of GROUPS){const current=new Map((snapshot[g]||[]).filter(x=>x&&x.id).map(x=>[String(x.id),x]));const os=tx.objectStore(g);const before=last[g]||new Map();for(const [id,doc] of current){const serialized=JSON.stringify(doc);if(before.get(id)!==serialized)os.put(doc);}for(const id of before.keys())if(!current.has(id))os.delete(id);last[g]=new Map([...current].map(([id,doc])=>[id,JSON.stringify(doc)]));}
 await done(tx);fault=null;}catch(e){fault=e?.message||String(e);throw e;}});
 return chain;
}
async function clear(){const d=await open();const tx=d.transaction(['meta',...GROUPS],'readwrite');for(const g of ['meta',...GROUPS])tx.objectStore(g).clear();await done(tx);last={};try{localStorage.removeItem(LEGACY);}catch{}}
async function stats(){if(!navigator.storage?.estimate)return null;const e=await navigator.storage.estimate();return {used:e.usage||0,quota:e.quota||0,persisted:await navigator.storage.persisted?.()||false};}
function state(){return {available:!!db,error:fault};}
window.OrbitStore={bootstrap,queue,flush,flushNow,clear,stats,state};
})();
