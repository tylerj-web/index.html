import {Orbit3DMotion,MODES,CHAIN,clamp} from './motion.mjs';
import {OrbitProjectedRenderer} from './renderer.mjs';
const $=id=>document.getElementById(id);
const motion=new Orbit3DMotion();let renderer=null,lastTime=0,fpsStart=0,frames=0,drag=null,turning=false,frameRequest=null;
const stats={fps:0,ready:false,webgl:false,errors:[]};
const FACE_NAMES={eyes:'CYAN EYES',scan:'SCANNING',caution:'YELLOW CAUTION',success:'GREEN CHECK',error:'RED ERROR'};
function groups(){const holder=$('behaviors');const labels=[...new Set(MODES.map(m=>m[2]))];for(const group of labels){const box=document.createElement('div');const label=document.createElement('div');label.className='group-label';label.textContent=group.toUpperCase();const grid=document.createElement('div');grid.className='mode-grid';for(const [mode,title,cat] of MODES.filter(m=>m[2]===group)){const b=document.createElement('button');b.type='button';b.textContent=title;b.dataset.mode=mode;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>select(mode));grid.append(b)}box.append(label,grid);holder.append(box)}}
function select(mode){motion.select(mode);$('sequence-status').textContent='STANDALONE';refresh()}
function refresh(){const m=MODES.find(x=>x[0]===motion.mode);$('active').textContent=m?.[1]||motion.mode;$('face-state').textContent=FACE_NAMES[motion.face()]||motion.face().toUpperCase();for(const b of document.querySelectorAll('[data-mode]')){const act=b.dataset.mode===motion.mode;b.classList.toggle('active',act);b.setAttribute('aria-pressed',String(act))}}
function initUI(){groups();refresh();$('filter').addEventListener('input',e=>{const q=e.target.value.toLowerCase();for(const box of $('behaviors').children){let n=0;for(const b of box.querySelectorAll('button')){const hit=b.textContent.toLowerCase().includes(q);b.hidden=!hit;if(hit)n++}box.hidden=n===0}});
 for(const b of document.querySelectorAll('[data-chain]'))b.addEventListener('click',()=>{motion.run(b.dataset.chain);$('sequence-status').textContent=b.textContent.toUpperCase();refresh()});
 for(const [id,field,suffix,adjust] of [['energy','energy','%',v=>v/100],['speed','speed','×',v=>v/100],['hover','hoverAmount','%',v=>v/100],['zoom','zoom','%',v=>v/100]])$(id).addEventListener('input',e=>{const v=Number(e.target.value);if(id==='zoom')renderer.zoom=v/100;else motion[field]=adjust(v);$(id+'-out').textContent=id==='speed'?(v/100).toFixed(2)+'×':v+'%';});
 $('screen').addEventListener('change',e=>{motion.faceOverride=e.target.value;refresh()});$('reduced').checked=window.matchMedia('(prefers-reduced-motion: reduce)').matches;motion.reduced=$('reduced').checked;$('reduced').addEventListener('change',e=>motion.reduced=e.target.checked);
 $('front').addEventListener('click',()=>{renderer.yaw=0;renderer.pitch=0;renderer.zoom=1;$('zoom').value=100;$('zoom-out').textContent='100%'});
 $('threequarter').addEventListener('click',()=>{renderer.yaw=-.58;renderer.pitch=-.07});
 $('turntable').addEventListener('change',e=>turning=e.target.checked);
 $('play').addEventListener('click',()=>{motion.playing=!motion.playing;$('play').textContent=motion.playing?'Pause':'Play'});
 $('reset').addEventListener('click',()=>{motion.select('idle');motion.faceOverride='auto';$('screen').value='auto';refresh()});
 $('capture').addEventListener('click',()=>{const a=document.createElement('a');a.download='Orbit_Fluid_3D_'+motion.mode+'.png';a.href=renderer.snapshot();a.click()});
 const canvas=$('orbit');canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,yaw:renderer.yaw,pitch:renderer.pitch,moved:false};canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener('pointermove',e=>{if(!drag)return;let dx=e.clientX-drag.x,dy=e.clientY-drag.y;drag.moved=drag.moved||Math.abs(dx)>5||Math.abs(dy)>5;renderer.yaw=clamp(drag.yaw+dx*.005,-Math.PI,Math.PI);renderer.pitch=clamp(drag.pitch+dy*.004,-.8,.8)});
 canvas.addEventListener('pointerup',()=>{if(drag&&!drag.moved)select('wave');drag=null});canvas.addEventListener('pointercancel',()=>drag=null);
 canvas.addEventListener('wheel',e=>{e.preventDefault();renderer.zoom=clamp(renderer.zoom-Math.sign(e.deltaY)*.06,.65,1.7);$('zoom').value=Math.round(renderer.zoom*100);$('zoom-out').textContent=$('zoom').value+'%'},{passive:false});
 canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select('wave')}});
 document.addEventListener('visibilitychange',()=>lastTime=0);
}
function render(ts){frameRequest=requestAnimationFrame(render);if(document.hidden)return;const dt=lastTime?clamp((ts-lastTime)/1000,0,.08):1/60;lastTime=ts;
 try{motion.step(dt);if(turning&&!motion.reduced&&!drag)renderer.yaw=(renderer.yaw+dt*.12)%(Math.PI*2);renderer.draw(motion.pose,motion.face(),motion.clock);}catch(e){stats.errors.push(String(e));$('ready').textContent='RENDER ERROR';$('webgl-error').hidden=false;$('webgl-error').textContent='3D rendering error: '+e.message;cancelAnimationFrame(frameRequest);console.error(e);return}
 frames++;if(ts-fpsStart>900){stats.fps=Math.round(frames*1000/(ts-fpsStart));$('fps').textContent=stats.fps+' FPS · WEBGL2';frames=0;fpsStart=ts}
 if($('active').dataset.mode!==motion.mode){$('active').dataset.mode=motion.mode;refresh()}if(motion.sequence)$('sequence-status').textContent='CHAIN PLAYING';
}
async function main(){try{renderer=new OrbitProjectedRenderer($('orbit'));await renderer.init();stats.webgl=!!renderer.gl;stats.ready=true;renderer.quality=2;initUI();$('ready').textContent='3D MODEL READY';$('footer').textContent='TRUE 3D · CONTINUOUS JOINT PHYSICS';requestAnimationFrame(render);
 window.orbit3dTest={motion,renderer,stats,select,chain:name=>{motion.run(name);refresh()},snapshot:()=>motion.snapshot(),rootNames:()=>Object.keys(renderer.parts),getMode:()=>motion.mode,getFace:()=>motion.face()};
 if (location.protocol==='https:' && 'serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(console.warn);
 }catch(e){stats.errors.push(String(e));console.error(e);$('ready').textContent='WEBGL2 UNAVAILABLE';$('webgl-error').hidden=false;$('webgl-error').textContent='Unable to initialise this real-3D animation studio: '+e.message;const c=$('orbit');c.style.display='none';const img=new Image();img.src='./assets/approved_master_1254.png';img.alt='Approved Orbit reference';img.style.cssText='max-height:85%;max-width:80%;position:absolute;left:10%;top:12%';$('stage').append(img)} }
main();
