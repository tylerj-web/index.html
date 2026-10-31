/* Orbit — optional private browser-side language model. No cloud AI fallback. */
(function(){
  'use strict';
  const MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';
  const LIBRARY_URL = 'https://esm.run/@mlc-ai/web-llm@0.2.85';
  const MARKER = 'orbit.offline-model.requested.v2';
  let engine = null;
  let pending = null;
  let statusText = 'NOT LOADED';
  const remembered=()=>{try{return localStorage.getItem(MARKER)==='yes';}catch{return false;}};
  function report(text,cb){statusText=text; if(typeof cb==='function') cb(text);}
  async function ensure(cb){
    if(engine) return engine;
    if(pending) return pending;
    if(!navigator.gpu) throw new Error('This Safari/browser does not expose WebGPU. Update iOS and try again.');
    if(!navigator.onLine&&!remembered()) throw new Error('First-time model download requires an internet connection.');
    pending=(async()=>{
      report('Checking local WebGPU capability…',cb);
      const adapter=await navigator.gpu.requestAdapter();
      if(!adapter) throw new Error('WebGPU is present but no supported GPU adapter is available on this device.');
      report('Loading model runtime…',cb);
      const webllm=await import(LIBRARY_URL);
      if(!webllm.prebuiltAppConfig.model_list.some(item=>item.model_id===MODEL_ID)) throw new Error('The selected model is not supported by this runtime version.');
      report('Downloading / loading model…',cb);
      engine=await webllm.CreateMLCEngine(MODEL_ID,{
        initProgressCallback:(p)=>report((p?.text||'Loading model…')+(Number.isFinite(p?.progress)?` ${Math.round(p.progress*100)}%`:''),cb)
      });
      try{localStorage.setItem(MARKER,'yes');}catch{}
      report('READY — ON-DEVICE AI',cb);
      return engine;
    })();
    try{return await pending;}catch(e){engine=null; report('MODEL ERROR: '+(e?.message||String(e)),cb);throw e;}finally{pending=null;}
  }
  async function reply(dialogue,cb){
    const model=await ensure(cb);
    const system=`You are Orbit. Your optional title is The Fixer. You are a small black-and-gold floating robot and an equal-rank senior officer alongside Commander. You help with careful independent review, quality checks, audits, complaints, training-improvement recommendations, explanations and practical support. You do not have a live link to Framework Command, user-approved governing-policy texts, Commander or current documents in this offline session. Do not invent policies, authority, evidence, audit findings, or live status. If asked about them, clearly state that they are unavailable. Distinguish suggestions from verified facts. Be concise, professional and human-readable. You cannot change any protected governing policy. You are an offline assistant running entirely in this device's browser.`;
    const messages=[{role:'system',content:system},...dialogue.slice(-10).map(m=>({role:m.role==='user'?'user':'assistant',content:String(m.text||'').slice(0,1800)}))];
    const result=await model.chat.completions.create({messages,temperature:0.6,max_tokens:250});
    const txt=result?.choices?.[0]?.message?.content;
    if(!txt?.trim()) throw new Error('The local model produced no response. Try a shorter message.');
    return txt.trim();
  }
  window.OrbitOfflineAI={MODEL_ID,ensure,reply,remembered,status:()=>statusText,isReady:()=>!!engine};
})();
