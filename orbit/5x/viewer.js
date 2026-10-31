(()=>{'use strict';
const M=window.ORBIT_MANIFEST;
if(!M){document.body.innerHTML='<h1>Missing manifest.js</h1>';return}
const $=id=>document.getElementById(id),names=Object.keys(M.emotes),trans=Object.keys(M.transitions);
const cvs=$('canvas'),ctx=cvs.getContext('2d',{alpha:true});ctx.imageSmoothingEnabled=true;
let clip={kind:'emote',name:'idle'},frame=0,playing=true,last=0,elapsed=0,speed=1,chain=[],currentEmote='idle',image=null,sequenceMode=false;
const cache=new Map(),MAXCACHE=(window.innerWidth < 720?2:4);
const metaFor=(obj)=>obj.kind==='emote'?M.emotes[obj.name]:M.transitions[obj.name];
function load(name,kind){const id=kind+':'+name;if(cache.has(id)){const item=cache.get(id);cache.delete(id);cache.set(id,item);return item}
 const m=kind==='emote'?M.emotes[name]:M.transitions[name];if(!m)return null;
 const img=new Image();img.decoding='async';img.src=m.atlas;
 img.onload=()=>{if(clip.name===name && clip.kind===kind)draw()};img.onerror=()=>setStatus('Cannot load '+m.atlas);
 cache.set(id,img);while(cache.size>MAXCACHE){const oldest=cache.keys().next().value;cache.delete(oldest)}return img}
function setStatus(t){$('status').textContent=t}
function draw(){const m=metaFor(clip);if(!m)return;
 ctx.clearRect(0,0,M.frame_width,M.frame_height);if(image?.complete&&image.naturalWidth){
 const col=frame%m.atlas_columns,row=Math.floor(frame/m.atlas_columns);
 ctx.drawImage(image,col*M.frame_width,row*M.frame_height,M.frame_width,M.frame_height,0,0,M.frame_width,M.frame_height)
 }
 $('hud').textContent=`Frame ${String(frame+1).padStart(2,'0')} / ${m.frames} · ${m.fps} fps`;
 $('scrub').max=String(m.frames-1);$('scrub').value=String(frame);$('position').textContent=Math.round(frame/(m.frames-1)*100)+'%';$('progress-bar').style.width=((frame+1)/m.frames*100).toFixed(1)+'%';
 $('download-frame').href=`${m.frame_directory}${clip.name}_${String(frame+1).padStart(4,'0')}.png`;
 $('download-frame').download=`${clip.name}_${String(frame+1).padStart(4,'0')}.png`;
}
function choose(kind,name,opts={}){const m=(kind==='emote'?M.emotes:M.transitions)[name];if(!m){setStatus('Unknown clip '+name);return}
 clip={kind,name};frame=0;elapsed=0;last=0;image=load(name,kind);
 if(kind==='emote')currentEmote=name;
 $('kind').textContent=kind.toUpperCase()+' · '+(kind==='emote'?`${names.indexOf(name)+1} / ${names.length}`:`${trans.indexOf(name)+1} / ${trans.length}`);
 $('clip-label').textContent=kind==='emote'?m.label:`${m.from} → ${m.to}`;
 $('meta').innerHTML=`<strong>${name}</strong><div>${m.frames} frames · ${m.fps} fps · ${m.loop?'Loop':'One shot'}</div><div>${m.interpolation||'Warped in-betweens'}</div><div>Source: ${m.source_art?.join(', ')||'From neighbouring states'}</div><div>Largest measured frame delta: ${m.quality?.max_frame_delta ?? '—'}</div>`;
 $('atlas').src=m.atlas;$('download').href=m.atlas;$('download').download=m.atlas.split('/').at(-1);
 document.querySelectorAll('[data-state]').forEach(b=>b.classList.toggle('active',kind==='emote'&&b.dataset.state===name));
 if(!opts.quiet)setStatus('Playing '+(kind==='emote'?'emote':'transition')+' · '+name);
 draw()
}
function gotoNext(){if(chain.length){const nx=chain.shift();choose(nx.kind,nx.name,{quiet:true});if(!chain.length)sequenceMode=false;return}
 if(clip.kind==='transition'){const to=M.transitions[clip.name].to;choose('emote',to==='wake'?'idle':to);return}
 if($('loop').checked){frame=0;elapsed=0;draw()} else{playing=false;frame=metaFor(clip).frames-1;draw();syncPlay()}}
function syncPlay(){$('play').textContent=playing?'Pause':'Play'}
function tick(now){if(!last)last=now;const dt=Math.min(150,now-last);last=now;
 if(playing){elapsed+=dt*speed;let lim=metaFor(clip)?.frames||1;const dur=1000/(metaFor(clip)?.fps||24);
 let n=0;while(elapsed>=dur && n++<8){elapsed-=dur;frame++;if(frame>=lim){gotoNext();lim=metaFor(clip)?.frames||1}}draw()}
 requestAnimationFrame(tick)}
const edges=new Map();for(const [name,data] of Object.entries(M.transitions)){if(!edges.has(data.from))edges.set(data.from,[]);edges.get(data.from).push({to:data.to,name})}
function route(from,to){if(from===to)return[];let frontier=[[from,[]]],seen=new Set([from]);while(frontier.length){const [at,path]=frontier.shift();for(const e of edges.get(at)||[]){if(seen.has(e.to))continue;const next=[...path,e.name];if(e.to===to)return next;seen.add(e.to);frontier.push([e.to,next]);}}return null}
function playSequence(states){const missing=states.filter(s=>!M.emotes[s]&&s!=='wake');if(missing.length){setStatus('Unknown state: '+missing.join(', '));return}
 const list=[];let cur=null;for(const state of states){if(cur){const transPath=route(cur,state);if(transPath===null){setStatus(`No prepared transition path: ${cur} → ${state}. Use available named pairs.`);return}
 for(const t of transPath){const td=M.transitions[t];list.push({kind:'transition',name:t});if(td.to!==state&&M.emotes[td.to])list.push({kind:'emote',name:td.to})}}
 if(M.emotes[state])list.push({kind:'emote',name:state});cur=state}
 if(!list.length)return;
 const first=list.shift();chain=list;sequenceMode=true;playing=true;syncPlay();choose(first.kind,first.name);setStatus('Chain: '+states.join(' → '));}
function selectEmote(name){if($('smooth').checked && playing && M.emotes[currentEmote] && currentEmote!==name){const path=route(currentEmote,name);if(path){const queue=[];for(const p of path){queue.push({kind:'transition',name:p});const step=M.transitions[p];if(step.to!==name&&M.emotes[step.to])queue.push({kind:'emote',name:step.to})}queue.push({kind:'emote',name});chain=queue;sequenceMode=true;setStatus('Transition queued: '+currentEmote+' → '+name);return}}
 chain=[];sequenceMode=false;choose('emote',name)}
function init(){const list=$('emote-list');for(const state of names){const b=document.createElement('button');b.textContent=state.replaceAll('_',' ');b.dataset.state=state;b.className='emote-btn';b.onclick=()=>selectEmote(state);list.appendChild(b)}
 $('count').textContent=names.length+' states';$('filter').oninput=e=>{const v=e.target.value.toLowerCase();list.querySelectorAll('button').forEach(b=>b.hidden=!b.dataset.state.includes(v))};
 for(const name of trans){const op=document.createElement('option');op.value=name;op.textContent=name.replace('_to_',' → ').replaceAll('_',' ');$('transition-menu').append(op)}
 $('play-transition').onclick=()=>{const name=$('transition-menu').value;chain=[];sequenceMode=false;playing=true;syncPlay();choose('transition',name)};
 $('play').onclick=()=>{playing=!playing;syncPlay();last=0};
 $('prev').onclick=()=>{playing=false;syncPlay();frame=(frame-1+metaFor(clip).frames)%metaFor(clip).frames;draw()};
 $('next').onclick=()=>{playing=false;syncPlay();frame=(frame+1)%metaFor(clip).frames;draw()};
 $('download-frame').addEventListener('click',e=>{e.preventDefault();cvs.toBlob(blob=>{if(!blob){setStatus('Unable to export frame.');return}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`orbit_${clip.name}_${String(frame+1).padStart(4,'0')}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')});
 $('restart').onclick=()=>{frame=0;elapsed=0;draw()};
 $('scrub').oninput=e=>{playing=false;syncPlay();frame=Number(e.target.value);draw()};
 $('speed').oninput=e=>{speed=Number(e.target.value)/100;$('speed-label').textContent=Math.round(speed*100)+'%'};
 $('bg').onclick=()=>{const names=['dark','magenta','checker'],cur=names.findIndex(n=>$('stage').classList.contains(n)),next=names[(cur+1)%names.length];$('stage').className='stage '+next;$('bg').textContent=next[0].toUpperCase()+next.slice(1)};
 document.querySelectorAll('[data-chain]').forEach(b=>b.onclick=()=>playSequence(b.dataset.chain.split(',')));
 $('run-custom').onclick=()=>playSequence($('custom').value.toLowerCase().split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean));
 document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();$('play').click()}else if(e.key==='ArrowRight'){$('next').click()}else if(e.key==='ArrowLeft'){$('prev').click()}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){playing=false;syncPlay()}});
 choose('emote','idle');requestAnimationFrame(tick)}
init();
})();
