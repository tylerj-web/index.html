/* Orbit 3.1 HD articulated personality. Gesture states animate independent limbs in the SVG rig. */
(()=>{'use strict';
const STATES={
 idle:['Here with you','Ready when you are'],wave:['Hello!','A little wave for you'],thinking:['Thinking','Working locally on your request'],listening:['Listening','Microphone active'],speaking:['Speaking','Playing the response aloud'],reviewing:['Reviewing','Examining your local workspace'],happy:['All sorted','Your local action completed'],error:['Needs attention','Check the message on screen'],waiting:['Standing by','Awaiting the next step'],sleeping:['Resting','Conserving battery']};
let mood='idle',idleTimer=null,activity=Date.now(),lastVisible=document.visibilityState;
const app=()=>document.getElementById('app');
function reduced(){return app()?.classList.contains('motion-off')||matchMedia('(prefers-reduced-motion: reduce)').matches;}
function play(name='idle'){
 if(!(name in STATES))name='idle';mood=name;activity=Date.now();clearTimeout(idleTimer);
 const a=app();if(a){a.dataset.orbitMood=name;a.classList.toggle('orbit-motion-disabled',reduced()||document.hidden);}
 const pair=STATES[name];for(const [id,t] of [['orbit-mood-label',pair[0]],['orbit-presence-title',name==='idle'?'Orbit is here':pair[0]],['orbit-presence-detail',pair[1]]]){const el=document.getElementById(id);if(el)el.textContent=t;}
 const hero=document.getElementById('orbit-robot-image');if(hero){hero.src='./assets/orbit-robot.png';hero.setAttribute('aria-label','Orbit — '+pair[0]);}
 if(!['thinking','listening','speaking'].includes(name)){idleTimer=setTimeout(()=>{if(mood===name)play('idle');},name==='idle'?150000:name==='sleeping'?240000:1900);}
 return name;
}
function settle(){if(!['thinking','listening','speaking'].includes(mood))play('idle');}
function updateMotion(){app()?.classList.toggle('orbit-motion-disabled',reduced()||document.hidden);}
function init(){play('idle');
 document.addEventListener('visibilitychange',()=>{if(document.hidden){lastVisible='hidden';updateMotion();}else{updateMotion();play('idle');}});
 window.addEventListener('focus',updateMotion);
 document.addEventListener('pointerdown',()=>{activity=Date.now();if(mood==='sleeping')play('wave');},{passive:true});
 setInterval(()=>{if(document.hidden||reduced())return;if(mood==='idle'&&Date.now()-activity>150000)play('sleeping');},20000);
 const stage=document.getElementById('orbit-art');
 stage?.addEventListener('pointermove',e=>{if(reduced()||!matchMedia('(pointer:fine)').matches)return;const r=stage.getBoundingClientRect();stage.style.setProperty('--look-x',((e.clientX-r.left)/r.width-.5)*6+'px');stage.style.setProperty('--look-y',((e.clientY-r.top)/r.height-.5)*5+'px');},{passive:true});
 stage?.addEventListener('pointerleave',()=>{stage.style.setProperty('--look-x','0px');stage.style.setProperty('--look-y','0px');});
}
window.OrbitMotion={play,settle,state:()=>mood,states:Object.keys(STATES),refresh:()=>{updateMotion();play(mood)}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
