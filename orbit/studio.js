/* Orbit Motion Studio 1.0 — original Orbit artwork, independent joint rig, true RAF animation. */
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
const rad=d=>d*Math.PI/180;
const DEFAULTS=Object.freeze({speed:1,expressiveness:80,float:65,gaze:75,glow:85,theme:'nebula',interactiveGaze:true,particles:true,reduceMotion:false,quality:'auto'});
const SETTING_KEY='orbit.motion.studio.settings.v1';
const profiles={
  idle:{group:'PRESENCE',name:'Idle breathing',short:'Unhurried, natural hover',icon:'◌',kind:'CONTINUOUS',duration:6,continuous:true,description:'Subtle buoyancy, faint eyelid activity and slow arm settling keep Orbit present without distracting from work.',features:['Secondary motion','Natural blinks','Core breathing','Cursor awareness'],frames:[
    [0,{dy:0,body:0,head:0,la:0,ra:0,lw:0,rw:0,core:.58,energy:.48}], [.25,{dy:-6,body:1.0,head:-1.3,la:1.5,ra:-1.5,core:.68,energy:.58}], [.5,{dy:-1,body:-.5,head:.7,la:-1,ra:1.2,core:.52,energy:.42}], [.78,{dy:-6,body:.5,head:-.3,la:1,ra:-.5,core:.65,energy:.56}],[1,{dy:0,body:0,head:0,la:0,ra:0,core:.58,energy:.48}]]},
  greet:{group:'PRESENCE',name:'Greeting',short:'Warm acknowledgement',icon:'✧',kind:'ONE-SHOT',duration:2.45,description:'An attentive glance, a small anticipatory nod and a restrained, personable arm lift.',features:['Anticipation','Head follow-through','Genuine arm lift','Soft settle'],frames:[[0,{}],[.16,{dy:4,head:3,body:1,ra:8,core:.72}],[.39,{dy:-11,head:-4,body:-2,ra:-75,rw:-9,la:7,core:1.06,energy:1.1}],[.53,{dy:-8,head:-2,ra:-66,rw:5,core:.94}],[.68,{dy:-7,ra:-77,rw:-9,core:.94}],[.84,{dy:-3,ra:-28,rw:0,head:-1}],[1,{}]]},
  wave:{group:'PRESENCE',name:'Articulated wave',short:'Full shoulder + elbow gesture',icon:'↗',kind:'ONE-SHOT',duration:2.9,description:'A real shoulder lift with a secondary elbow movement, three distinct hand-wave beats and a gentle body response.',features:['Independent shoulder','Elbow articulation','Three wave beats','Inertial settle'],frames:[[0,{}],[.10,{dy:3,ra:9,head:3,core:.7}],[.25,{dy:-7,ra:-108,rw:-5,la:6,head:-4,body:-2,core:.95}],[.36,{dy:-9,ra:-101,rw:12,head:-3,core:1.03}],[.46,{dy:-10,ra:-109,rw:-16,core:1.07}],[.57,{dy:-8,ra:-99,rw:13,core:1.06}],[.67,{dy:-7,ra:-112,rw:-14,core:1.06}],[.78,{dy:-5,ra:-85,rw:3,head:-1}],[.9,{ra:-22,rw:0,dy:0}],[1,{}]]},
  wake:{group:'PRESENCE',name:'Waking up',short:'From rest to attentive',icon:'☀',kind:'ONE-SHOT',duration:2.65,description:'A gradual power-up: eyes open, the chest core brightens and the limbs settle into a ready stance.',features:['Gradual awakening','Energy ramp','Soft lift','Eye opening'],frames:[[0,{dy:12,head:6,la:6,ra:-6,eyeClose:1,core:.12,energy:.1}],[.22,{dy:10,head:5,eyeClose:.96,core:.2}],[.47,{dy:4,head:0,eyeClose:.25,core:.72,energy:.6}],[.68,{dy:-10,head:-3,ra:-13,la:12,eyeClose:0,core:1.12,energy:1.12}],[.84,{dy:-3,head:1,core:.88}],[1,{}]]},
  listening:{group:'INTERACTION',name:'Listening',short:'Focused and receptive',icon:'◎',kind:'CONTINUOUS',duration:3.6,continuous:true,description:'Orbit leans in a little, adopts open eyes, raises one arm attentively and responds with a slow core pulse.',features:['Attentive posture','Responsive eyes','Soft core rhythm','Low distraction'],frames:[[0,{ra:-25,la:4,head:-1,core:.85}],[.3,{ra:-46,rw:-7,head:-5,dy:-3,core:1.06,eyeOpen:1.08}],[.65,{ra:-40,rw:4,head:-2,dy:-2,core:.82,eyeOpen:1.02}],[1,{ra:-25,la:4,head:-1,core:.85}]]},
  thinking:{group:'INTERACTION',name:'Thinking',short:'Curious, careful attention',icon:'◇',kind:'CONTINUOUS',duration:4.1,continuous:true,description:'A small head tilt and lifted arm suggest contemplation; the eyes periodically look aside instead of repeating a generic wave.',features:['Thoughtful tilt','Arm to chin','Curious eye pose','Low-energy thinking'],frames:[[0,{ra:-32,head:-4,look:-.15,core:.65}],[.25,{ra:-79,rw:-6,head:-9,look:-.7,dy:1,core:.72}],[.51,{ra:-76,rw:3,head:-6,look:.4,core:.92}],[.75,{ra:-82,rw:-6,head:-9,look:-.7,core:.72}],[1,{ra:-32,head:-4,look:-.15,core:.65}]]},
  speaking:{group:'INTERACTION',name:'Speaking',short:'Expressive, rhythmic explanation',icon:'≋',kind:'CONTINUOUS',duration:2.6,continuous:true,description:'Speech-like gesture cadence, eye liveliness and a chest-core rhythm. No audio playback or false claim of lip-sync.',features:['Speech cadence','Alternating hands','Eye expression','Core synchrony'],frames:[[0,{ra:-18,la:12,core:.67}],[.18,{ra:-55,la:30,head:1,core:1.14,energy:1.1}],[.39,{ra:-33,la:7,head:-2,core:.68}],[.61,{ra:-62,la:34,head:2,core:1.12,energy:1.1}],[.82,{ra:-29,la:19,head:-1,core:.8}],[1,{ra:-18,la:12,core:.67}]]},
  curious:{group:'INTERACTION',name:'Curiosity',short:'Playful head and eye movement',icon:'?',kind:'ONE-SHOT',duration:2.8,description:'Orbit investigates a detail with a distinct head lean, off-axis gaze and a tiny inquisitive shoulder response.',features:['Asymmetric tilt','Directed gaze','Head anticipation','Deliberate settle'],frames:[[0,{}],[.24,{head:8,body:-1,ra:-14,look:1,core:.82}],[.52,{head:11,ra:-21,la:10,look:1,dy:-2,core:1}],[.7,{head:-3,ra:-9,look:-.6,core:.92}],[.85,{head:4,look:.3}],[1,{}]]},
  review:{group:'WORK & FOCUS',name:'Reviewing',short:'Detailed inspection',icon:'▣',kind:'CONTINUOUS',duration:4.2,continuous:true,description:'Measured scanning, a braced arm and careful eye motion signal evidence review rather than a fabricated completed audit.',features:['Controlled scanning','Reading posture','Measured timing','Observational'],frames:[[0,{ra:-30,la:18,head:-3,core:.65,look:-.8}],[.25,{ra:-67,la:32,head:-2,look:.6,core:.78}],[.5,{ra:-62,la:28,head:4,look:-.5,core:.65}],[.75,{ra:-68,la:20,head:-2,look:.75,core:.82}],[1,{ra:-30,la:18,head:-3,core:.65,look:-.8}]]},
  scan:{group:'WORK & FOCUS',name:'Scanning',short:'Systematic visual pass',icon:'⌁',kind:'ONE-SHOT',duration:3.4,description:'A choreographed left-to-right search with a brief pause at each edge and a decisive return to neutral.',features:['Eye tracking','Three-point scan','Paced pauses','Review response'],frames:[[0,{ra:-19,head:0,look:-.2,core:.6}],[.2,{ra:-42,head:-6,look:-1,core:.82}],[.45,{ra:-48,head:0,look:0,core:1.1}],[.7,{ra:-51,head:6,look:1,core:.89}],[.84,{ra:-36,head:0,look:0,core:.72}],[1,{}]]},
  focus:{group:'WORK & FOCUS',name:'Deep focus',short:'Unobtrusive working posture',icon:'◈',kind:'CONTINUOUS',duration:5,continuous:true,description:'A quiet, low-distraction operating state designed to remain suitable during long desktop tasks.',features:['Minimal movement','Slow eye shifts','Power-conscious','Continuous'],frames:[[0,{dy:0,head:0,ra:-8,la:8,core:.52,energy:.36}],[.5,{dy:-3,head:1,ra:-10,la:9,core:.63,energy:.44}],[1,{dy:0,head:0,ra:-8,la:8,core:.52,energy:.36}]]},
  celebrate:{group:'REACTIONS',name:'Celebrate',short:'Happy double-arm response',icon:'✦',kind:'ONE-SHOT',duration:2.45,description:'A decisive, genuinely two-armed celebration with a lift, bounce, bright eyes and soft follow-through.',features:['Both arms articulate','Anticipation','Airborne bounce','Core bloom'],frames:[[0,{dy:0,core:.7}],[.15,{dy:6,head:3,la:-8,ra:8}],[.33,{dy:-21,head:-3,la:108,ra:-108,lw:8,rw:-10,body:-3,core:1.35,energy:1.4}],[.53,{dy:-27,la:96,ra:-100,core:1.5,energy:1.6}],[.68,{dy:-14,la:110,ra:-111,lw:-10,rw:12,core:1.27}],[.84,{dy:-5,la:48,ra:-47,core:.95}],[1,{}]]},
  concern:{group:'REACTIONS',name:'Concern',short:'Subtle uncertainty',icon:'!',kind:'ONE-SHOT',duration:2.3,description:'Orbit becomes alert without exaggerated distress. The response communicates uncertainty, not a verified problem.',features:['Concerned eyes','Small recoil','Asymmetrical gesture','Measured recovery'],frames:[[0,{}],[.18,{dy:6,head:6,la:-13,ra:13,core:.54}],[.42,{dy:8,head:4,la:-7,ra:27,core:.48,look:-.3}],[.68,{dy:4,head:6,ra:14,core:.6}],[.87,{dy:1,head:1,core:.64}],[1,{}]]},
  error:{group:'REACTIONS',name:'Error recovery',short:'A gentle corrective reaction',icon:'×',kind:'ONE-SHOT',duration:2.25,description:'One short recoil, a dimmed core and a calm return to neutral—no endless flashing or alarm behaviour.',features:['Recoil','Soft light dip','Limited emphasis','Recovery'],frames:[[0,{}],[.17,{body:-4,head:5,dy:8,ra:20,la:-20,core:.3,energy:.3}],[.38,{body:3,head:-4,dy:3,ra:-12,la:12,core:.42}],[.64,{body:-1,head:1,dy:2,core:.5}],[1,{}]]},
  sleep:{group:'REACTIONS',name:'Resting',short:'Low-motion rest',icon:'☾',kind:'CONTINUOUS',duration:5.5,continuous:true,description:'Orbit rests with eyes softly closed, minimal float and a quieter chest core; designed to reduce distraction and power consumption.',features:['Closed eyes','Slow buoyancy','Quiet core','Battery-conscious'],frames:[[0,{head:3,dy:8,la:5,ra:-5,eyeClose:1,core:.21,energy:.18}],[.5,{head:3.8,dy:11,la:5,ra:-5,eyeClose:1,core:.27,energy:.23}],[1,{head:3,dy:8,la:5,ra:-5,eyeClose:1,core:.21,energy:.18}]]}
};
const ORDER=Object.keys(profiles);
const GROUPS=['PRESENCE','INTERACTION','WORK & FOCUS','REACTIONS'];
const FIELDS=['dy','dx','body','head','la','ra','lw','rw','core','energy','eyeClose','eyeOpen','look'];
const zeroPose=()=>({dy:0,dx:0,body:0,head:0,la:0,ra:0,lw:0,rw:0,core:.65,energy:.55,eyeClose:0,eyeOpen:1,look:0});
function poseAt(profile,fraction){const keys=profile.frames;const f=clamp(fraction,0,1);let a=keys[0],b=keys[keys.length-1];for(let i=1;i<keys.length;i++){if(f<=keys[i][0]){a=keys[i-1];b=keys[i];break}}const ratio=smooth((f-a[0])/Math.max(.00001,b[0]-a[0]));const base=zeroPose(),out={};for(const field of FIELDS){out[field]=mix(a[1][field]??base[field],b[1][field]??base[field],ratio)}return out}
let settings={...DEFAULTS};
try{const s=JSON.parse(localStorage.getItem(SETTING_KEY));if(s&&typeof s==='object')settings={...DEFAULTS,...validateSettings(s)}}catch{}
function validateSettings(x){const out={};for(const [key,v] of Object.entries(x||{})){
 if(['speed','expressiveness','float','gaze','glow'].includes(key)&&Number.isFinite(v))out[key]=clamp(v,key==='speed'?.4:0,key==='speed'?1.8:150);
 else if(['interactiveGaze','particles','reduceMotion'].includes(key)&&typeof v==='boolean')out[key]=v;
 else if(key==='theme'&&['nebula','studio','transparent'].includes(v))out[key]=v;
 else if(key==='quality'&&['auto','high','balanced','eco'].includes(v))out[key]=v;
}return out}
function saveSettings(){try{localStorage.setItem(SETTING_KEY,JSON.stringify(settings))}catch{showToast('Browser storage unavailable: settings stay in this session.')}}
const state={behavior:'idle',phase:0,paused:false,loop:true,sequence:false,sequenceIndex:0,transition:0,prevPose:zeroPose(),pose:zeroPose(),totalTime:0,blinkAt:3.5,blinkStart:-100,blink:0,gazeX:0,gazeY:0,targetX:0,targetY:0,inside:false,loaded:false,recording:false,recorder:null,recordStart:0,dimensions:{w:0,h:0,dpr:1},fps:0,frames:0,fpsMark:0,lastFrame:0,autoDprCap:2,lowFpsSamples:0,qualityChanges:0,lastPaintAt:0};
const canvas=$('#orbit-canvas'),ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});
const assetNames=['head','torso','left-arm-upper','left-arm-lower','right-arm-upper','right-arm-lower'];
const images={};
let toastTimer=0;
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2600)}
function renderLibrary(){const container=$('#behavior-list');container.innerHTML=GROUPS.map(group=>`<div class="category"><div class="category-title">${group}</div>${ORDER.filter(id=>profiles[id].group===group).map(id=>{const p=profiles[id];return `<button type="button" class="behavior-item${id===state.behavior?' active':''}" data-behavior="${id}" aria-pressed="${id===state.behavior}"><span class="behavior-icon" aria-hidden="true">${p.icon}</span><span class="behavior-info"><strong>${p.name}</strong><small>${p.short}</small></span><span class="behavior-index">${String(ORDER.indexOf(id)+1).padStart(2,'0')}</span></button>`}).join('')}</div>`).join('');$('#behavior-count').textContent=`${ORDER.length} STATES`;container.querySelectorAll('[data-behavior]').forEach(b=>b.addEventListener('click',()=>setBehavior(b.dataset.behavior)))}
const SHOWREEL=['wake','greet','wave','listening','thinking','speaking','curious','review','scan','focus','celebrate','concern','sleep','idle'];
function setBehavior(id,fromSequence=false){if(!profiles[id])return;state.prevPose={...state.pose};state.behavior=id;state.transition=0;state.phase=0;state.paused=false;state.loop=!!profiles[id].continuous;state.sequence=!!fromSequence;
 updateBehaviorUI();if(!fromSequence)state.sequenceIndex=0;
}
function updateBehaviorUI(){const p=profiles[state.behavior],index=ORDER.indexOf(state.behavior);$('#stage-behavior').textContent=p.name.toUpperCase();$('#stage-index').textContent=`${String(index+1).padStart(2,'0')} / ${ORDER.length}`;$('#timeline-action').textContent=p.name;$('#detail-title').textContent=p.name;$('#detail-text').textContent=p.description;$('#detail-kind').textContent=p.kind;$('#detail-features').innerHTML=p.features.map(x=>`<span>${x}</span>`).join('');$('#loop-button').classList.toggle('active',state.loop);$('#loop-button').setAttribute('aria-pressed',String(state.loop));$('#loop-status').textContent=state.sequence?'SHOWREEL':state.loop?'LOOP ACTIVE':'PLAYS ONCE';$('#timeline-description').textContent=p.short;$('#run-sequence').classList.toggle('playing',state.sequence);$('#run-sequence span').textContent=state.sequence?'Stop showreel':'Play showreel';document.querySelectorAll('[data-behavior]').forEach(b=>{const active=b.dataset.behavior===state.behavior;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});updatePlaybackUI()}
function updatePlaybackUI(){$('#play-pause').setAttribute('aria-label',state.paused?'Resume playback':'Pause playback');$('#pause-icon').innerHTML=state.paused?'<path d="M7 4l12 8-12 8V4z"/>':'<path d="M8 5v14M16 5v14"/>'}
function nextBehavior(direction){state.sequence=false;const i=ORDER.indexOf(state.behavior);setBehavior(ORDER[(i+direction+ORDER.length)%ORDER.length])}
function startSequence(){if(state.sequence){state.sequence=false;setBehavior('idle');showToast('Showreel stopped');return}state.sequenceIndex=0;setBehavior(SHOWREEL[0],true);state.loop=false;showToast('Orbit showreel started')}
function resize(){const rect=canvas.getBoundingClientRect();if(rect.width<1||rect.height<1)return;let dpr=window.devicePixelRatio||1;const caps={auto:state.autoDprCap,high:2.5,balanced:1.45,eco:1};dpr=Math.min(dpr,caps[settings.quality]);dpr=Math.min(dpr,Math.sqrt(4_900_000/(rect.width*rect.height)));dpr=Math.max(1,Math.round(dpr*100)/100);
 const w=Math.round(rect.width*dpr),h=Math.round(rect.height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}state.dimensions={w:rect.width,h:rect.height,dpr};$('#pixel-metric').innerHTML=`${dpr.toFixed(2)} <small>×</small>`}
let resizeObs=new ResizeObserver(resize);resizeObs.observe(canvas);
function drawBackground(w,h,time){const mode=settings.theme;
 const bg=ctx.createRadialGradient(w*.5,h*.5,4,w*.5,h*.55,Math.max(w,h)*.72);
 if(mode==='transparent'){bg.addColorStop(0,'#17212d');bg.addColorStop(1,'#10161e')}
 else if(mode==='studio'){bg.addColorStop(0,'#283542');bg.addColorStop(.53,'#121c29');bg.addColorStop(1,'#080e16')}
 else{bg.addColorStop(0,'#1a3647');bg.addColorStop(.46,'#0c1c2c');bg.addColorStop(1,'#060d17')}
 ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 if(mode==='transparent')return;
 const r=Math.min(w*.38,h*.7);ctx.save();ctx.lineWidth=1;
 for(let i=0;i<3;i++){ctx.strokeStyle=i===1?'rgba(112,181,197,.075)':'rgba(112,181,197,.038)';ctx.beginPath();ctx.arc(w/2,h*.46,r*(.70+i*.30),0,Math.PI*2);ctx.stroke()}
 if(settings.particles&&!settings.reduceMotion){for(let i=0;i<34;i++){const x=((Math.sin(i*10.431+2.4)*16384)%1+1)%1;const y=((Math.sin(i*7.319+8.1)*12482)%1+1)%1;const twinkle=.35+.45*Math.pow(Math.sin(time*.43+i*3.7),2);ctx.fillStyle=`rgba(129,216,242,${(.1+i%4*.042)*twinkle})`;ctx.fillRect(x*w,y*h, i%7===0?2:1,i%7===0?2:1)}}
 ctx.globalAlpha=.28;ctx.strokeStyle='#335369';for(let x=0;x<w;x+=60){ctx.beginPath();ctx.moveTo(x,h*.76);ctx.lineTo(x,h);ctx.stroke()}for(let y=h*.76;y<h;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}ctx.globalAlpha=1;ctx.restore()}
function glowCircle(x,y,r,strength){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(127,246,255,${Math.min(.6,.27*strength)})`);g.addColorStop(.28,`rgba(35,182,227,${Math.min(.48,.19*strength)})`);g.addColorStop(1,'rgba(35,182,227,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function drawArm(which,shoulder,wrist){const left=which==='left';const P=left?[174,475]:[415,475];const E=left?[102,585]:[487,585];const u=images[`${which}-arm-upper`],l=images[`${which}-arm-lower`];
 ctx.save();ctx.translate(P[0],P[1]);ctx.rotate(rad(shoulder));ctx.translate(-P[0],-P[1]);ctx.drawImage(u,0,0,589,760);ctx.save();ctx.translate(E[0],E[1]);ctx.rotate(rad(wrist));ctx.translate(-E[0],-E[1]);ctx.drawImage(l,0,0,589,760);ctx.restore();ctx.restore()}
function drawEyes(p,time){const id=state.behavior;const blink=state.blink;const baseY=311;let open=clamp(p.eyeOpen*(1-blink*.9)*(1-p.eyeClose*.92),.04,1.25);
 let gazeX=(settings.interactiveGaze?state.gazeX*4*settings.gaze/100:0)+p.look*5;
 let gazeY=(settings.interactiveGaze?state.gazeY*2.5*settings.gaze/100:0);
 const worried=id==='concern'||id==='error';const asleep=id==='sleep';const focused=id==='review'||id==='scan'||id==='thinking'||id==='focus';
 if(asleep)open=.05;
 ctx.save();ctx.translate(gazeX,gazeY);ctx.lineCap='round';ctx.lineJoin='round';
 function eye(c,flip){ctx.save();ctx.translate(c,baseY);ctx.scale(1,open);ctx.translate(-c,-baseY);ctx.beginPath();
 if(worried){const offset=flip?-2:2;ctx.moveTo(c-45,baseY+5+offset);ctx.bezierCurveTo(c-21,baseY-30,c+7,baseY-15,c+46,baseY+6-offset)}
 else if(focused){ctx.moveTo(c-45,baseY-1);ctx.bezierCurveTo(c-20,baseY-24,c+18,baseY-24,c+44,baseY-1)}
 else{ctx.moveTo(c-46,baseY+2);ctx.bezierCurveTo(c-35,baseY-64,c+33,baseY-64,c+46,baseY+2)}
 ctx.shadowColor=worried?'#51baff':'#2dbdff';ctx.shadowBlur=20+12*p.energy;ctx.strokeStyle=worried?'#7fc9ff':'#3dd4ff';ctx.lineWidth=25;ctx.stroke();ctx.shadowBlur=9;ctx.strokeStyle='#d4ffff';ctx.lineWidth=16;ctx.stroke();ctx.restore()}
 eye(183,false);eye(409,true);ctx.restore();
}
function drawCharacter(p,t,w,h){const s=Math.min(w*.74/589,h*.72/760,1.3);const cx=w*.5,cy=h*.493;
 const floatStrength=settings.float/100;
 const dynamicHover=settings.reduceMotion?0:(Math.sin(t*1.55)*3.5+Math.sin(t*.59)*2.3)*floatStrength;
 const express=settings.expressiveness/100;
 const body=(p.body*express)+(settings.reduceMotion?0:Math.sin(t*.73)*.43*floatStrength);
 const head=p.head*express+(settings.reduceMotion?0:Math.sin(t*1.21+.7)*.52*floatStrength);
 const extraY=dynamicHover+p.dy*express;
 ctx.save();ctx.translate(cx,cy);ctx.scale(s,s);ctx.translate(-294.5,-380+extraY);
 // Quiet, grounded hovering shadow, also visible in recorded output.
 ctx.save();ctx.globalAlpha=.28;ctx.scale(1/s,1/s);ctx.translate(294.5*s,(760/2+245)*s);ctx.scale(1,.33);glowCircle(0,0,170*s,.45);ctx.restore();
 ctx.translate(294,515);ctx.rotate(rad(body));ctx.translate(-294,-515);
 ctx.drawImage(images.torso,0,0,589,760);
 ctx.save();ctx.translate(294,445);ctx.rotate(rad(head));ctx.translate(-294,-445);
 ctx.drawImage(images.head,0,0,589,760);
 drawEyes(p,t);
 ctx.restore();
 // Arms render above the faceplate, allowing an actual visible wave and cheer.
 // This avoids the earlier regression where lifted arms vanished behind his oversized head.
 drawArm('left',p.la*express,p.lw*express);
 drawArm('right',p.ra*express,p.rw*express);
 // Original blue core remains; this glow is additional and is driven by behaviour.
 ctx.save();ctx.globalCompositeOperation='screen';ctx.globalAlpha=clamp((.38+p.core*.45)*settings.glow/100,0,1);glowCircle(294,580,107,p.core*1.25);ctx.restore();
 ctx.restore()}
function paint(t){const {w,h,dpr}=state.dimensions;if(!w||!h)return;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);drawBackground(w,h,t);
 if(!state.loaded){ctx.fillStyle='#9ab1c1';ctx.textAlign='center';ctx.font='600 13px system-ui';ctx.fillText('PREPARING HIGH-RESOLUTION RIG…',w/2,h/2);return}
 drawCharacter(state.pose,t,w,h)
}
function updateBlink(t){if(settings.reduceMotion){state.blink=0;return}if(t>=state.blinkAt){state.blinkStart=t;state.blinkAt=t+3.1+Math.random()*3.2}const z=t-state.blinkStart;state.blink=z>=0&&z<.19?Math.sin(Math.PI*z/.19):0}
function tick(now){if(document.hidden){state.lastFrame=now;state.fpsMark=now;state.frames=0;requestAnimationFrame(tick);return}
 if(!state.lastFrame){state.lastFrame=now;state.fpsMark=now}const dt=Math.min(.05,Math.max(0,(now-state.lastFrame)/1000));state.lastFrame=now;
 if(!state.paused&&!settings.reduceMotion){state.phase+=dt*settings.speed;state.totalTime+=dt;state.transition+=dt;}
 else if(!state.paused){state.transition+=dt;}
 const prof=profiles[state.behavior];let frac=state.phase/prof.duration;
 if(!state.paused&&!settings.reduceMotion&&frac>=1){if(state.sequence){state.sequenceIndex++;if(state.sequenceIndex>=SHOWREEL.length){state.sequence=false;setBehavior('idle')}else{setBehavior(SHOWREEL[state.sequenceIndex],true)}frac=0}
 else if(state.loop){state.phase%=prof.duration;frac=state.phase/prof.duration}
 else{setBehavior('idle');frac=0}}
 if(settings.reduceMotion)frac=state.behavior==='idle'?0:.5;
 const desired=poseAt(profiles[state.behavior],frac);const a=smooth(state.transition/.44);let pose={};for(const k of FIELDS)pose[k]=mix(state.prevPose[k]??zeroPose()[k],desired[k],a);state.pose=pose;
 const decay=clamp(dt*5,0,1);const xx=state.inside?state.targetX:0,yy=state.inside?state.targetY:0;state.gazeX=mix(state.gazeX,xx,decay);state.gazeY=mix(state.gazeY,yy,decay);updateBlink(state.totalTime);
 const shouldPaint=!state.paused&&!settings.reduceMotion||now-state.lastPaintAt>=100;
 if(shouldPaint){paint(state.totalTime);state.lastPaintAt=now;state.frames++}
 if(now-state.fpsMark>=1000){state.fps=Math.round(state.frames*1000/(now-state.fpsMark));state.fpsMark=now;state.frames=0;if(settings.quality==='auto'&&state.totalTime>3){state.lowFpsSamples=state.fps<37?state.lowFpsSamples+1:0;if(state.lowFpsSamples>=3&&state.autoDprCap>1.05){state.autoDprCap=Math.max(1,Math.round((state.autoDprCap-.25)*100)/100);state.lowFpsSamples=0;state.qualityChanges++;resize()}}$('#fps-metric').innerHTML=`${state.fps} <small>FPS</small>`;$('#fps-stage').textContent=`RENDERING · ${state.fps} FPS`}
 const pct=clamp(frac*100,0,100);const seek=$('#seek');if(document.activeElement!==seek){seek.value=Math.round(frac*1000);seek.style.setProperty('--progress',`${pct}%`)}$('#timeline-clock').textContent=`${clock(state.phase)} / ${prof.continuous||state.loop?'LOOP':clock(prof.duration)}`;
 if(state.recording&&state.recordStart&&now-state.recordStart>8000)finishRecording();
 requestAnimationFrame(tick)
}
function clock(x){x=Math.floor(Math.max(0,x));return `${String(Math.floor(x/60)).padStart(2,'0')}:${String(x%60).padStart(2,'0')}`}
function setupCanvasEvents(){canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();state.inside=true;state.targetX=clamp((e.clientX-r.left-r.width/2)/(r.width*.35),-1,1);state.targetY=clamp((e.clientY-r.top-r.height*.4)/(r.height*.34),-1,1)});canvas.addEventListener('pointerleave',()=>state.inside=false);canvas.addEventListener('click',()=>setBehavior('wave'));canvas.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();setBehavior('wave')}})}
function connectControl(id,key,suffix){const input=$('#'+id),label=$('#'+id+'-value');input.value=settings[key];label.textContent=`${key==='speed'?Number(settings[key]).toFixed(2):settings[key]}${suffix}`;input.addEventListener('input',()=>{const v=Number(input.value);settings[key]=v;label.textContent=`${key==='speed'?v.toFixed(2):v}${suffix}`;saveSettings()})}
function connectToggle(id,key){const input=$('#'+id);input.checked=settings[key];input.addEventListener('change',()=>{settings[key]=input.checked;saveSettings()})}
function setupControls(){connectControl('speed','speed','×');connectControl('expressiveness','expressiveness','%');connectControl('float','float','%');connectControl('gaze','gaze','%');connectControl('glow','glow','%');connectToggle('interactive-gaze','interactiveGaze');connectToggle('particles','particles');connectToggle('reduce-motion','reduceMotion');
 document.querySelectorAll('[data-theme]').forEach(b=>{b.classList.toggle('selected',b.dataset.theme===settings.theme);b.addEventListener('click',()=>{settings.theme=b.dataset.theme;document.querySelectorAll('[data-theme]').forEach(q=>q.classList.toggle('selected',q===b));$('#stage-frame').dataset.theme=settings.theme;saveSettings()})});$('#stage-frame').dataset.theme=settings.theme;
 $('#quality').value=settings.quality;$('#quality').addEventListener('change',e=>{settings.quality=e.target.value;resize();saveSettings()});
 $('#prev').addEventListener('click',()=>nextBehavior(-1));$('#next').addEventListener('click',()=>nextBehavior(1));$('#play-pause').addEventListener('click',()=>{state.paused=!state.paused;updatePlaybackUI()});$('#run-sequence').addEventListener('click',startSequence);
 $('#loop-button').addEventListener('click',()=>{state.loop=!state.loop;state.sequence=false;updateBehaviorUI()});$('#seek').addEventListener('input',e=>{state.phase=Number(e.target.value)/1000*profiles[state.behavior].duration;state.transition=10;e.target.style.setProperty('--progress',`${Number(e.target.value)/10}%`)});
 $('#theater-toggle').addEventListener('click',()=>{const active=$('#app').classList.toggle('showcase');$('#theater-toggle').title=active?'Exit showcase mode':'Enter showcase mode';$('#theater-toggle').setAttribute('aria-label',active?'Exit showcase mode':'Enter showcase mode');resize()});
 $('#capture').addEventListener('click',()=>{if(!state.loaded){showToast('HD assets are still loading');return}canvas.toBlob(b=>{if(!b){showToast('PNG export unavailable');return}download(b,`Orbit_${state.behavior}_${new Date().toISOString().slice(0,10)}.png`);showToast('Frame saved as PNG')},'image/png')});
 $('#record').addEventListener('click',toggleRecording);
 $('#export-settings').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({kind:'orbit-motion-profile',version:1,settings},null,2)],{type:'application/json'});download(blob,'Orbit_Animation_Profile.json');showToast('Animation profile exported')});
 $('#import-settings').addEventListener('click',()=>$('#profile-file').click());$('#profile-file').addEventListener('change',async e=>{const f=e.target.files?.[0];e.target.value='';if(!f)return;if(f.size>100_000){showToast('Profile is too large');return}try{const raw=JSON.parse(await f.text());if(raw?.kind!=='orbit-motion-profile'||raw.version!==1||!raw.settings||typeof raw.settings!=='object')throw Error();settings={...DEFAULTS,...validateSettings(raw.settings)};saveSettings();applySettingsUI();showToast('Animation profile imported')}catch{showToast('Invalid Orbit animation profile')}});
 $('#reset').addEventListener('click',()=>{settings={...DEFAULTS};saveSettings();applySettingsUI();setBehavior('idle');showToast('Studio preferences reset')});
 document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;if(e.code==='Space'){e.preventDefault();state.paused=!state.paused;updatePlaybackUI()}else if(e.key==='ArrowRight'){e.preventDefault();nextBehavior(1)}else if(e.key==='ArrowLeft'){e.preventDefault();nextBehavior(-1)}else if(e.key.toLowerCase()==='w'){setBehavior('wave')}else if(e.key.toLowerCase()==='r'){startSequence()}})
}
function applySettingsUI(){for(const [id,k,suffix] of [['speed','speed','×'],['expressiveness','expressiveness','%'],['float','float','%'],['gaze','gaze','%'],['glow','glow','%']]){$('#'+id).value=settings[k];$('#'+id+'-value').textContent=`${k==='speed'?settings[k].toFixed(2):settings[k]}${suffix}`}for(const [id,k] of [['interactive-gaze','interactiveGaze'],['particles','particles'],['reduce-motion','reduceMotion']])$('#'+id).checked=settings[k];$('#quality').value=settings.quality;$('#stage-frame').dataset.theme=settings.theme;document.querySelectorAll('[data-theme]').forEach(b=>b.classList.toggle('selected',b.dataset.theme===settings.theme));resize()}
function download(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10_000)}
let recordParts=[];
function finishRecording(){if(!state.recorder)return;try{if(state.recorder.state==='recording')state.recorder.stop()}catch{}state.recording=false;state.recordStart=0;$('#record').textContent='Record clip'}
function toggleRecording(){if(state.recording){finishRecording();return}if(!canvas.captureStream||typeof MediaRecorder==='undefined'){showToast('Clip recording is unavailable in this browser');return}const type=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(t=>{try{return MediaRecorder.isTypeSupported(t)}catch{return false}});if(!type){showToast('No supported video recording codec');return}try{recordParts=[];const stream=canvas.captureStream(30);const rec=new MediaRecorder(stream,{mimeType:type,videoBitsPerSecond:3_500_000});state.recorder=rec;rec.ondataavailable=e=>{if(e.data.size)recordParts.push(e.data)};rec.onstop=()=>{stream.getTracks().forEach(track=>track.stop());if(recordParts.length){download(new Blob(recordParts,{type}),`Orbit_${state.behavior}_motion.${type.includes('mp4')?'mp4':'webm'}`);showToast('Recorded clip saved')}else showToast('No video data captured');state.recorder=null;state.recording=false;state.recordStart=0;$('#record').textContent='Record clip'};rec.onerror=()=>{finishRecording();showToast('Recording failed')};rec.start();state.recording=true;state.recordStart=performance.now();$('#record').textContent='Stop recording';showToast('Recording up to 8 seconds')}catch(e){showToast('Recording unavailable: '+String(e.message||e).slice(0,60))}}
function loadImages(){return Promise.all(assetNames.map(name=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>{images[name]=image;resolve()};image.onerror=()=>reject(new Error(`Asset not found: ${name}`));image.src=`./assets/${name}.png`})))}
function registerSW(){if('serviceWorker' in navigator&&location.protocol.startsWith('http'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}),{once:true})}
async function init(){renderLibrary();setupControls();setupCanvasEvents();updateBehaviorUI();resize();state.transition=10;requestAnimationFrame(tick);try{await loadImages();state.loaded=true;$('#settings-status').textContent='READY';showToast('Orbit HD rig ready. Tap him to wave.')}catch(e){$('#settings-status').textContent='ASSET ERROR';showToast('Failed to load approved Orbit artwork');console.error(e)}registerSW()}
init();
window.OrbitStudioTest={profiles,poseAt,validateSettings,select:setBehavior,settings:()=>({...settings}),state:()=>({...state,pose:{...state.pose}})};
})();
