/* ORBIT PERSONALITY ENGINE 2.4 — original character assets, explicit accessible states. */
(()=>{
'use strict';
const STATES={
 idle:{sprite:'idle',frames:6,delay:250,label:'Here with you',detail:'Independent mode · local preview',loops:1,settle:true},
 wave:{sprite:'wave',frames:4,delay:170,label:'Hey there!',detail:'Orbit is waving hello',loops:2},
 thinking:{sprite:'working',frames:6,delay:155,label:'Thinking it through…',detail:'Processing a request on this device',loops:Infinity},
 listening:{sprite:'waiting',frames:6,delay:160,label:'Listening…',detail:'Microphone is active',loops:Infinity},
 speaking:{sprite:'wave',frames:4,delay:255,label:'Talking with you',detail:'Speech playback is active',loops:Infinity},
 reviewing:{sprite:'review',frames:6,delay:155,label:'Taking a closer look',detail:'Reviewing your workspace',loops:2},
 happy:{sprite:'jump',frames:5,delay:140,label:'All sorted!',detail:'Your local action is complete',loops:2},
 error:{sprite:'blocked',frames:8,delay:190,label:'Something needs attention',detail:'Please check the message on screen',loops:1},
 waiting:{sprite:'waiting',frames:6,delay:210,label:'Just a moment…',detail:'Standing by',loops:2},
 sleeping:{sprite:'idle',frames:6,delay:420,label:'Resting',detail:'Orbit will wake when you return',loops:0},
};
const PREF='orbit.mobile.motion';
let state='idle',timer=null,rest=null,cycle=0,frame=0,lastActivity=Date.now();
const robot=()=>document.getElementById('orbit-robot-image');
const companion=()=>document.querySelector('#robot-buddy img');
const app=()=>document.getElementById('app');
function enabled(){return !app()?.classList.contains('motion-off')&&!matchMedia('(prefers-reduced-motion: reduce)').matches && !document.hidden;}
function clear(){clearTimeout(timer);clearTimeout(rest);timer=null;rest=null;}
function renderState(kind){
 const s=STATES[kind]||STATES.idle;
 app()?.setAttribute('data-orbit-mood',kind);
 for(const [id,text] of [['orbit-mood-label',s.label],['orbit-presence-title',kind==='idle'?'Orbit is here':s.label],['orbit-presence-detail',s.detail]]){
  const el=document.getElementById(id);if(el)el.textContent=text;
 }
 const hero=robot();if(hero){hero.dataset.mood=kind;hero.setAttribute('aria-label','Orbit: '+s.label);}
 const buddy=companion();if(buddy)buddy.dataset.mood=kind;
}
function setSprite(src){const h=robot();if(h&&h.getAttribute('src')!==src)h.src=src;const b=companion();if(b&&b.getAttribute('src')!==src)b.src=src;}
function showBase(){setSprite('./assets/orbit-robot.png');robot()?.classList.remove('sprite-active');}
function play(kind='idle',opts={}){
 if(!(kind in STATES))kind='idle';
 const same=state===kind;state=kind;clear();frame=0;cycle=0;if(kind!=='idle'&&kind!=='sleeping')lastActivity=Date.now();
 renderState(kind);
 if(!enabled()){showBase();return;}
 const cfg=STATES[kind];
 if(cfg.loops===0){showBase();return;}
 const tick=()=>{
  if(!enabled()){showBase();return;}
  setSprite(`./assets/orbit-${cfg.sprite}-${frame}.png`);
  robot()?.classList.add('sprite-active');
  frame++;
  if(frame>=cfg.frames){frame=0;cycle++;
   if(cycle>=cfg.loops){showBase();
     if(kind!=='idle')rest=setTimeout(()=>{if(state===kind)play('idle');},opts.hold??620);
     else scheduleIdle();
     return;
   }
  }
  timer=setTimeout(tick,cfg.delay);
 };
 tick();
}
function scheduleIdle(){
 clearTimeout(rest);
 rest=setTimeout(()=>{if(state==='idle'&&enabled())play('idle');},8000+Math.floor(Math.random()*5000));
}
function settle(){if(!['thinking','listening','speaking'].includes(state))play('idle');}
function initial(){
 renderState('idle');showBase();scheduleIdle();
 document.addEventListener('visibilitychange',()=>{
   if(document.hidden){clear();showBase();}
   else if(state==='idle'||state==='sleeping')play('idle');
   else if(state==='listening')play('idle');
   else play(state);
 });
 document.addEventListener('pointerdown',e=>{
   if(e.target.closest('#orbit-art'))return;
   lastActivity=Date.now();
   if(state==='sleeping')play('wave');
 },{passive:true});
 setInterval(()=>{if(document.hidden||state!=='idle')return;if(Date.now()-lastActivity>120000)play('sleeping');},15000);
 const stage=document.getElementById('orbit-art');
 stage?.addEventListener('pointermove',e=>{
   if(!enabled()||!matchMedia('(pointer:fine)').matches)return;
   const r=stage.getBoundingClientRect();const x=Math.max(-1,Math.min(1,((e.clientX-r.left)/r.width-.5)*2));
   const y=Math.max(-1,Math.min(1,((e.clientY-r.top)/r.height-.5)*2));
   stage.style.setProperty('--look-x',(x*4).toFixed(1)+'px');
   stage.style.setProperty('--look-y',(y*3).toFixed(1)+'px');
 },{passive:true});
 stage?.addEventListener('pointerleave',()=>{stage.style.setProperty('--look-x','0px');stage.style.setProperty('--look-y','0px');});
 for(const k of Object.values(STATES)){
   if(!enabled())break;
   // Only the first frame is loaded eagerly; subsequent frames load when needed.
   const img=new Image();img.src=`./assets/orbit-${k.sprite}-0.png`;
 }
}
window.OrbitMotion={play,settle,state:()=>state,states:Object.keys(STATES),refresh:()=>play(state)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initial,{once:true});else initial();
})();
