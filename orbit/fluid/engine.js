/* ORBIT FLUID 1.0 — a single image-locked, velocity-preserving articulated performer.
   Key rule: body images are never blended, faded, or swapped between behaviours.
   All transitions originate from current joint pose + joint velocity. */
(()=>{'use strict';
const $=id=>document.getElementById(id), clamp=(x,a,b)=>Math.min(b,Math.max(a,x)),lerp=(a,b,t)=>a+(b-a)*t;
const modes=[
['idle','Idle','Presence'],['blink','Blink','Presence'],['happy','Happy','Emotion'],['sad','Sad','Emotion'],['curious','Curious','Emotion'],['surprised','Surprised','Emotion'],
['listening','Listening','Work'],['thinking','Thinking','Work'],['speaking','Speaking','Work'],['focused','Focused','Work'],['sleepy','Sleepy','Presence'],['concerned','Concerned','Emotion'],
['scanning','Scanning','System'],['caution','Caution','System'],['complete','Complete','System'],['error','Error','System'],['processing','Processing','System'],
['wave','Wave','Gesture'],['celebrate','Celebrate','Gesture'],['greeting','Greeting','Gesture'],['reviewing','Reviewing','Work'],['hover','Hover','Presence'],
['look_around','Look around','Presence'],['slumped','Slumped','Emotion'],['nod','Nod','Gesture'],['look_up','Look up','Gesture'],['fly_left','Fly left','Gesture'],['fly_right','Fly right','Gesture']];
const defPose={y:0,body:0,head:0,left:0,right:0,gazeX:0,gazeY:0,eyeOpen:1,eyeCurve:1,core:0.72};
function pose(c={}){return {...defPose,...c}}
const presets={
 idle:pose(),blink:pose({eyeOpen:0.15}),happy:pose({y:-2,head:-2,left:7,right:-7,eyeCurve:1.13,core:0.9}),sad:pose({y:5,head:7,left:-6,right:8,eyeCurve:-0.4,core:.43}),
 curious:pose({head:9,right:-15,gazeX:0.65,eyeOpen:1.12,core:.83}),surprised:pose({y:-7,head:-8,left:14,right:-17,eyeOpen:1.4,eyeCurve:0.12,core:1.03}),
 listening:pose({y:-3,head:-5,right:-22,left:7,eyeOpen:1.06,core:.9}),thinking:pose({head:9,right:-59,gazeX:-.55,eyeCurve:.35,core:.77}),
 speaking:pose({y:-1,head:-1,left:17,right:-39,eyeCurve:.75,core:.92}),focused:pose({head:-4,right:-12,eyeCurve:.1,core:.75}),
 sleepy:pose({y:7,head:7,left:-5,right:5,eyeOpen:.18,core:.3}),concerned:pose({y:3,head:5,left:-3,right:-14,eyeCurve:-.25,core:.62}),
 scanning:pose({head:-4,right:-32,eyeOpen:.75,core:1.05}),caution:pose({y:2,head:5,left:7,right:-29,core:.75}),complete:pose({y:-8,head:-4,left:36,right:-43,eyeOpen:1.1,core:1.2}),
 error:pose({y:4,head:8,left:-5,right:-19,core:.45}),processing:pose({head:3,right:-20,eyeCurve:.2,core:.96}),
 wave:pose({y:-5,head:-4,left:7,right:-116,eyeCurve:1.12,core:1.08}),celebrate:pose({y:-11,head:-5,left:102,right:-106,eyeCurve:1.24,core:1.22}),
 greeting:pose({y:-3,head:-4,left:5,right:-82,eyeCurve:1.18,core:1.04}),reviewing:pose({head:-8,left:11,right:-48,eyeCurve:.28,core:.9}),
 hover:pose({y:-5,head:0,left:5,right:-5,core:.85}),look_around:pose({head:6,gazeX:-.65,right:-12,core:.7}),
 slumped:pose({y:11,head:12,left:-7,right:8,eyeOpen:.25,core:.28}),nod:pose({head:10,eyeOpen:.9}),look_up:pose({head:-13,gazeY:-.8,core:.85}),
 fly_left:pose({y:-8,body:-9,head:-6,left:-27,right:-12,gazeX:-.75,core:1.05}),fly_right:pose({y:-8,body:9,head:6,left:12,right:29,gazeX:.75,core:1.05})
};
const profiles={
 conversation:[['idle',.65],['listening',2.3],['thinking',2.4],['speaking',2.9],['idle',1.2]],
 inspection:[['idle',.5],['scanning',3.0],['reviewing',1.1],['complete',2.2],['idle',1.2]],
 recovery:[['idle',.5],['caution',1.7],['error',1.8],['concerned',1.1],['idle',1.4]],
 greeting:[['idle',.35],['greeting',1.8],['wave',2.8],['idle',1.4]],
 interrupt:[['idle',.45],['wave',.6],['listening',1],['thinking',.8],['speaking',1.3],['error',.8],['idle',1.2]]
};
const oneShots=new Set(['blink','surprised','wave','celebrate','greeting','nod','complete','error','fly_left','fly_right']);
const duration={blink:.38,surprised:1.7,wave:2.9,celebrate:2.6,greeting:1.8,nod:.95,complete:2.5,error:2.4,fly_left:2.7,fly_right:2.7};
const channels=Object.keys(defPose);
class Spring {constructor(value,omega=11){this.x=value;this.v=0;this.omega=omega;} update(target,dt){const w=this.omega, d=this.x-target, c=this.v+w*d, e=Math.exp(-w*dt);this.x=target+(d+c*dt)*e;this.v=(this.v-w*c*dt)*e;return this.x;}}
const physics=Object.fromEntries(channels.map(k=>[k,new Spring(defPose[k],['left','right'].includes(k)?12:['head','body'].includes(k)?11.5:13)]));
const data={ready:false,motion:'idle',elapsed:0,clock:0,paused:false,speed:1,energy:.7,hover:.45,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches,details:true,blink:0,nextBlink:3.5,blinkStart:-99,sequence:null,sequenceAt:0,sequenceIndex:0,movePointer:false,mouseX:0,mouseY:0,screenAt:0,pulse:0,readySince:0,prevTimestamp:0,fps:0,frames:0,fpsSince:0,recorder:null,recordSince:0,dprCap:2};
const assets={},parts={};const canvas=$('orbit'),ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});
const faceType=m=>({scanning:'scan',caution:'caution',complete:'complete',error:'error',processing:'processing'}[m]||'eyes');
function select(mode,{fromSequence=false}={}){if(!presets[mode])return;if(!fromSequence){data.sequence=null;$('sequence-status').textContent='STANDALONE'}data.motion=mode;data.elapsed=0;data.screenAt=data.clock;data.previousScreen=data.currentScreen||'eyes';data.currentScreen=faceType(mode);$('active-title').textContent=modes.find(x=>x[0]===mode)[1];$('face-status').textContent=({scan:'SCANNING',caution:'YELLOW CAUTION',complete:'GREEN TICK',error:'RED ERROR',processing:'PROCESSING'}[data.currentScreen]||'CYAN EYES');document.querySelectorAll('[data-mode]').forEach(b=>{const yes=b.dataset.mode===mode;b.classList.toggle('active',yes);b.setAttribute('aria-pressed',String(yes))});}
function sequence(name){const seq=profiles[name];if(!seq)return;data.sequence=seq;data.sequenceIndex=0;data.sequenceAt=0;$('sequence-status').textContent=name.toUpperCase().replace('_',' ');select(seq[0][0],{fromSequence:true})}
function smoothstep(a,b,t){const x=clamp((t-a)/(b-a),0,1);return x*x*(3-2*x)}
function targetFor(mode,t){const p={...presets[mode]};const expr=data.reduced?0:data.energy;
 const swing=Math.sin(t*2.3),pulse=Math.sin(t*4.7);
 if(mode==='wave'){const envelope=smoothstep(0,.37,t)*(1-smoothstep(2.18,2.8,t));p.right+=Math.sin(t*12.8)*14*envelope*expr;p.head+=Math.sin(t*5.6)*2*envelope*expr;}
 if(mode==='greeting')p.right+=Math.sin(t*9)*8*expr;
 if(mode==='celebrate'){p.left+=Math.sin(t*9.0)*12*expr;p.right-=Math.sin(t*9.0+.6)*12*expr;p.y-=Math.abs(Math.sin(t*4.7))*3*expr;}
 if(mode==='speaking'){p.left+=Math.sin(t*7.4)*15*expr;p.right-=Math.sin(t*7.4+1)*12*expr;p.core+=.12*Math.sin(t*7.4);}
 if(mode==='listening'){p.head+=Math.sin(t*1.6)*1.8*expr;p.core+=.1*swing;}
 if(mode==='thinking'){p.head+=Math.sin(t*1.1)*2*expr;p.gazeX+=Math.sin(t*.84)*.32;}
 if(mode==='reviewing'){p.gazeX+=Math.sin(t*1.5)*.4;p.head+=Math.sin(t*1.2)*2*expr;}
 if(mode==='look_around'){p.gazeX=Math.sin(t*.85)*.8;p.head=Math.sin(t*.55)*7*expr;}
 if(mode==='nod')p.head+=Math.sin(t*9)*7*expr;
 if(mode==='fly_left'||mode==='fly_right')p.y-=Math.sin(t*5)*4*expr;
 if(mode==='scanning')p.gazeX=Math.sin(t*2.1)*.8;
 if(mode==='processing')p.core+=Math.sin(t*5)*.18;
 if(mode==='happy')p.y-=Math.sin(t*3.2)*2*expr;
 if(mode==='blink'){p.eyeOpen=.07;}
 if(!data.reduced){p.y+=Math.sin(data.clock*1.47)*2.4*data.hover+Math.sin(data.clock*.63)*1.3*data.hover;p.head+=Math.sin(data.clock*.91+.5)*.6*expr;p.body+=Math.sin(data.clock*.7)*.28*expr;p.core+=Math.sin(data.clock*1.6)*.04;}
 if(data.movePointer && !data.reduced && faceType(mode)==='eyes'){p.gazeX+=data.mouseX*.25;p.gazeY+=data.mouseY*.18;}
 // Scale gestures only, never the approved image or its material colours.
 for(const k of ['head','body','left','right'])p[k]*=data.reduced?.12:data.energy;
 return p;}
function update(dt){if(data.paused)return;let remain=dt*data.speed;const stepCap=1/60;
 // Fixed-size simulation steps prevent spring explosions after background resumes.
 while(remain>1e-6){const step=Math.min(remain,stepCap);data.clock+=step;data.elapsed+=step;const dest=targetFor(data.motion,data.elapsed);for(const k of channels)physics[k].update(dest[k],step);remain-=step;}
 const seq=data.sequence;
 if(seq){data.sequenceAt+=dt*data.speed;let crossed=0;while(data.sequence&&data.sequenceAt>=seq[data.sequenceIndex][1]&&crossed<seq.length){data.sequenceAt-=seq[data.sequenceIndex][1];data.sequenceIndex++;crossed++;if(data.sequenceIndex>=seq.length){data.sequence=null;$('sequence-status').textContent='COMPLETED';select('idle',{fromSequence:true});break;}select(seq[data.sequenceIndex][0],{fromSequence:true})}}
 else if(oneShots.has(data.motion)&&data.elapsed>=duration[data.motion])select('idle',{fromSequence:true});
 if(!data.reduced&&data.clock>=data.nextBlink){data.blinkStart=data.clock;data.nextBlink=data.clock+2.7+((data.clock*2.718)%2.5)}
 const v=data.clock-data.blinkStart;data.blink=!data.reduced&&v>=0&&v<.19?Math.sin(Math.PI*v/.19):0;
}
function drawImage(name){const b=parts[name];ctx.drawImage(assets[name],b.left,b.top,b.width,b.height)}
function drawArm(name,angle){const isLeft=name==='left-arm',x=isLeft?174:415,y=475;ctx.save();ctx.translate(x,y);ctx.rotate(angle*Math.PI/180);ctx.translate(-x,-y);drawImage(name);ctx.restore()}
function glow(x,y,r,power,color=[22,182,246]){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${color.join(',')},${clamp(power*.3,0,.52)})`);g.addColorStop(.22,`rgba(${color.join(',')},${clamp(power*.16,0,.25)})`);g.addColorStop(1,`rgba(${color.join(',')},0)`);ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
function stroke(points,color,width,glowBlur=11){ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=color;ctx.lineWidth=width;ctx.shadowColor=color;ctx.shadowBlur=glowBlur;ctx.beginPath();points(ctx);ctx.stroke();ctx.restore()}
function eye(cx,cy,curve,open,gazeX,gazeY){ctx.save();ctx.translate(cx+gazeX,cy+gazeY);const height=42*clamp(open,.04,1.35);const bend=curve;
 // Uniform curve-based pupil-free eye, no sprite swapping or shape dissolves.
 stroke(c=>{c.moveTo(-37,0);c.bezierCurveTo(-27,-height*bend,23,-height*bend,37,0)},'#55ccff',23,17);
 stroke(c=>{c.moveTo(-37,0);c.bezierCurveTo(-27,-height*bend,23,-height*bend,37,0)},'#ddffff',13,6);ctx.restore()}
function drawNormalFace(p){let open=p.eyeOpen*(1-data.blink*.94),curve=p.eyeCurve;
 if(data.motion==='sleepy'||data.motion==='slumped')open=Math.min(open,.23);
 eye(182,308,curve,open,p.gazeX*9,p.gazeY*8);
 eye(408,308,curve,open,p.gazeX*9,p.gazeY*8);
}
function drawScreen(t,p){const typ=data.currentScreen||'eyes';const transition=t-data.screenAt;
 // A scan-like electronic screen wipe is intentional; never cross-fade entire artwork.
 if(typ==='eyes'){drawNormalFace(p);return;}
 // Eyes stay present only for success to preserve warmth; other signals occupy the screen.
 if(typ==='complete'){const x=294,y=303;let f=smoothstep(.06,.38,transition);stroke(c=>{c.moveTo(x-56,y+5);c.lineTo(x-8,y+45*f);c.lineTo(x+70*f,y-55*f)},'#66f5ac',21,19);return}
 if(typ==='caution'){
  const f=smoothstep(0,.28,transition);ctx.save();ctx.translate(294,300);ctx.scale(f,f);
  stroke(c=>{c.moveTo(0,-68);c.lineTo(75,57);c.lineTo(-75,57);c.closePath()},'#ffd16a',16,17);
  stroke(c=>{c.moveTo(0,-25);c.lineTo(0,16)},'#ffd16a',16,15);ctx.fillStyle='#ffe4a1';ctx.beginPath();ctx.arc(0,39,9,0,Math.PI*2);ctx.fill();ctx.restore();return}
 if(typ==='error'){
  const f=smoothstep(0,.3,transition);ctx.save();ctx.translate(294,308);ctx.scale(f,f);stroke(c=>{c.moveTo(0,-62);c.lineTo(0,16)},'#ff6d7b',23,20);ctx.fillStyle='#ff9aa6';ctx.shadowColor='#ff4152';ctx.shadowBlur=17;ctx.beginPath();ctx.arc(0,54,12,0,Math.PI*2);ctx.fill();ctx.restore();return}
 if(typ==='scan'){
  const sweep=(Math.sin(t*3)+1)*.5;ctx.save();ctx.beginPath();ctx.ellipse(294,300,200,135,0,0,Math.PI*2);ctx.clip();const x=150+sweep*284;glow(x,300,85,1.05,[43,220,255]);ctx.strokeStyle='#5ee7fa';ctx.lineWidth=3;ctx.shadowColor='#58dfff';ctx.shadowBlur=16;ctx.beginPath();ctx.moveTo(x,190);ctx.lineTo(x,413);ctx.stroke();ctx.restore();eye(205,302,.2,.8,0,0);eye(383,302,.2,.8,0,0);return}
 if(typ==='processing'){
  const n=12;ctx.save();ctx.translate(294,305);for(let i=0;i<n;i++){let angle=i/n*Math.PI*2+t*2.7;let x=Math.cos(angle)*59,y=Math.sin(angle)*59;let a=.25+.65*(i+1)/n;ctx.fillStyle=`rgba(87,218,255,${a})`;ctx.shadowColor='#45c9ff';ctx.shadowBlur=10;ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fill()}ctx.restore();return}
}
function drawCharacter(w,h){const s=Math.min(w*.74/589,h*.73/760,1.25);const p=Object.fromEntries(channels.map(k=>[k,physics[k].x]));ctx.save();ctx.translate(w*.5,h*.52);ctx.scale(s,s);ctx.translate(-294.5,-380+p.y);
 ctx.save();ctx.translate(294,515);ctx.rotate(p.body*Math.PI/180);ctx.translate(-294,-515);
 drawImage('torso');ctx.save();ctx.translate(294,445);ctx.rotate(p.head*Math.PI/180);ctx.translate(-294,-445);drawImage('head');drawScreen(data.clock,p);ctx.restore();
 drawArm('left-arm',p.left);drawArm('right-arm',p.right);
 ctx.save();ctx.globalCompositeOperation='screen';glow(294,577,89,clamp(.22+p.core*.28,.08,.5));ctx.restore();ctx.restore();ctx.restore()}
function draw(){const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;const dpr=clamp(devicePixelRatio||1,1,data.dprCap);const W=Math.floor(w*dpr),H=Math.floor(h*dpr);if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H}ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const bg=ctx.createRadialGradient(w*.5,h*.49,5,w*.5,h*.51,Math.max(w,h)*.6);bg.addColorStop(0,'#1a3b50');bg.addColorStop(.55,'#0c2131');bg.addColorStop(1,'#091321');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 if(!data.ready){ctx.fillStyle='#93bbca';ctx.font='13px system-ui';ctx.textAlign='center';ctx.fillText('LOADING ORBIT ARTWORK…',w/2,h/2);return}
 drawCharacter(w,h)}
function frame(time){if(!data.prevTimestamp)data.prevTimestamp=time;const dt=clamp((time-data.prevTimestamp)/1000,0,.05);data.prevTimestamp=time;if(!document.hidden){if(!data.manual)update(dt);draw();data.frames++;if(!data.fpsSince)data.fpsSince=time;if(time-data.fpsSince>=1100){data.fps=Math.round(data.frames*1000/(time-data.fpsSince));data.frames=0;data.fpsSince=time;const mx=Math.max(...['body','head','left','right'].map(k=>Math.abs(physics[k].v)));if(data.details)$('performance').textContent=`${data.fps} FPS · PEAK ANGULAR SPEED ${Math.round(mx)}°/S`;else $('performance').textContent=`${data.fps} FPS`;}}
 else {data.prevTimestamp=time;data.fpsSince=time;data.frames=0;}
 requestAnimationFrame(frame)}
function renderBehaviors(){const target=$('behaviors');target.textContent='';for(const [id,label] of modes){const b=document.createElement('button');b.type='button';b.dataset.mode=id;b.textContent=label;b.title=label+' animation';b.addEventListener('click',()=>select(id));target.append(b)};filterBehaviors()}
function filterBehaviors(){const q=$('filter').value.toLowerCase().trim();document.querySelectorAll('[data-mode]').forEach(b=>b.hidden=!!q&&!b.textContent.toLowerCase().includes(q))}
function download(blob,name){if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
function setup(){renderBehaviors();$('filter').addEventListener('input',filterBehaviors);document.querySelectorAll('[data-seq]').forEach(b=>b.addEventListener('click',()=>sequence(b.dataset.seq)));
 const inputs=[['energy',v=>data.energy=v/100,v=>`${v}%`],['speed',v=>data.speed=v/100,v=>`${(v/100).toFixed(2)}×`],['float',v=>data.hover=v/100,v=>`${v}%`]];
 for(const [id,assign,fmt] of inputs){$(id).addEventListener('input',()=>{const n=Number($(id).value);assign(n);$(id+'-out').value=fmt(n)})}
 $('reduced').checked=data.reduced;$('reduced').addEventListener('change',()=>data.reduced=$('reduced').checked);
 $('details').addEventListener('change',()=>data.details=$('details').checked);
 $('reset').addEventListener('click',()=>select('idle'));
 $('capture').addEventListener('click',()=>canvas.toBlob(b=>download(b,`Orbit_Fluid_${data.motion}.png`),'image/png'));
 $('record').addEventListener('click',()=>{if(data.recorder){if(data.recorder.state==='recording')data.recorder.stop();return}
  if(!canvas.captureStream||!window.MediaRecorder){$('feedback').textContent='Video recording is unavailable in this browser';return}
  let mime=['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'].find(s=>MediaRecorder.isTypeSupported(s));if(!mime){$('feedback').textContent='No supported video recording format';return}
  const trackStream=canvas.captureStream(30),rec=new MediaRecorder(trackStream,{mimeType:mime,videoBitsPerSecond:4000000}),chunks=[];
  rec.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};rec.onstop=()=>{trackStream.getTracks().forEach(t=>t.stop());download(new Blob(chunks,{type:mime}),`Orbit_Fluid_${data.motion}.${mime.includes('mp4')?'mp4':'webm'}`);data.recorder=null;$('record').textContent='Record 8-second video'};data.recorder=rec;$('record').textContent='Stop recording';rec.start();setTimeout(()=>{if(rec.state==='recording')rec.stop()},8000)
 });
 canvas.addEventListener('click',()=>select('wave'));canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select('wave')}});
 canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();data.movePointer=true;data.mouseX=clamp((e.clientX-r.left-r.width/2)/(r.width*.4),-1,1);data.mouseY=clamp((e.clientY-r.top-r.height/2)/(r.height*.4),-1,1)});canvas.addEventListener('pointerleave',()=>data.movePointer=false);
 document.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName))return;if(e.key==='Escape')select('idle');if(e.key.toLowerCase()==='w')select('wave')});
 select('idle');requestAnimationFrame(frame);
}
async function loadAssets(){let geometry=window.__ORBIT_TEST_PARTS__;
 if(!geometry){const res=await fetch('assets/parts.json');if(!res.ok)throw Error('Part metadata unavailable');geometry=await res.json()}Object.assign(parts,geometry);
 await Promise.all(['head','torso','left-arm','right-arm'].map(id=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{assets[id]=im;resolve()};im.onerror=()=>reject(Error('Cannot load '+id));im.src=window.__ORBIT_TEST_ASSETS__?.[id]||`assets/${id}.png`})));
 data.ready=true;data.readySince=performance.now();$('ready').textContent='HD RIG READY';$('footer-status').textContent='Four painted body layers · velocity-safe motion';$('feedback').textContent='Click Orbit to wave · select any state to interrupt';draw();}
if('serviceWorker' in navigator && location.protocol==='https:')window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js',{scope:'./'}).catch(()=>{}),{once:true});
setup();loadAssets().catch(e=>{$('ready').textContent='ASSET ERROR';$('feedback').textContent=String(e.message||e);console.error(e)});
window.OrbitFluidTest={getModes:()=>modes.map(x=>x[0]),getState:()=>({mode:data.motion,pose:Object.fromEntries(channels.map(k=>[k,physics[k].x])),velocity:Object.fromEntries(channels.map(k=>[k,physics[k].v])),ready:data.ready,sequence:data.sequence!==null,seconds:data.clock}),select,sequence,freeze:()=>{data.manual=true},unfreeze:()=>{data.manual=false},step:dt=>{const old=data.paused;data.paused=false;update(dt);draw();data.paused=old},pause:()=>{data.paused=true},resume:()=>{data.paused=false},version:'1.0.0'};
})();
