/* Orbit 3.2 — device-only appearance preferences. Never touches operational records. */
(()=>{'use strict';
const KEY='orbit.appearance.v3.2';
const PRESETS=['minimal','balanced','workspace','character'];
const ACCENTS=['cyan','blue','green','gold','custom'];
const THEMES=['dark','light','auto'];
const BACKGROUNDS=['quiet','glow','grid'];
const DENSITIES=['comfortable','compact'];
const ROUNDED=['soft','square','round'];
const MOTIONS=['off','subtle','expressive'];
const NAV=['audits','knowledge','reports'];
const SHORTCUTS=['audits','knowledge','reports','command'];
const DEFAULT={preset:'minimal',accent:'cyan',customColor:'#6ee3e8',theme:'dark',background:'quiet',density:'comfortable',fontScale:100,rounding:'soft',navFirst:'audits',navSecond:'knowledge',homeShortcuts:['audits','knowledge','reports'],robotSize:65,robotPosition:'center',motion:'expressive',sounds:false,labels:false};
let value={...DEFAULT},hasStorage=true,initialized=false,settingsInput=null,liveTimer=0,changed=false;
const byId=id=>document.getElementById(id);
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function validHex(s){return typeof s==='string'&&/^#[0-9a-fA-F]{6}$/.test(s)}
function clean(input){const d={...DEFAULT};if(!input||typeof input!=='object'||Array.isArray(input))return d;
 for(const [k,list] of [['preset',PRESETS],['accent',ACCENTS],['theme',THEMES],['background',BACKGROUNDS],['density',DENSITIES],['rounding',ROUNDED],['motion',MOTIONS]])if(list.includes(input[k]))d[k]=input[k];
 if(validHex(input.customColor))d.customColor=input.customColor.toLowerCase();
 for(const [k,min,max] of [['fontScale',90,125],['robotSize',35,100]])if(Number.isFinite(input[k]))d[k]=Math.max(min,Math.min(max,Math.round(input[k])));
 if(NAV.includes(input.navFirst))d.navFirst=input.navFirst;
 if(NAV.includes(input.navSecond)&&input.navSecond!==d.navFirst)d.navSecond=input.navSecond;
 else d.navSecond=NAV.find(x=>x!==d.navFirst);
 if(Array.isArray(input.homeShortcuts))d.homeShortcuts=[...new Set(input.homeShortcuts.filter(x=>SHORTCUTS.includes(x)))].slice(0,4);
 if(['left','center','right'].includes(input.robotPosition))d.robotPosition=input.robotPosition;
 for(const k of ['sounds','labels'])if(typeof input[k]==='boolean')d[k]=input[k];
 return d;}
function load(){try{const raw=localStorage.getItem(KEY);if(raw){value=clean(JSON.parse(raw));initialized=true;} }catch(e){hasStorage=false;console.warn('Appearance storage unavailable',e.message);}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(value));hasStorage=true;}catch(e){hasStorage=false;}changed=true;}
function isReduced(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
function apply(){const app=byId('app');if(!app)return;
 const v=value;for(const [k,p] of Object.entries({uiPreset:v.preset,uiTheme:v.theme,uiBackground:v.background,uiDensity:v.density,uiCorners:v.rounding,uiMotion:v.motion,uiRobotPosition:v.robotPosition}))app.dataset[k]=p;
 app.classList.toggle('fluid-motion-off',v.motion==='off'||isReduced());
 app.style.setProperty('--fluid-font-scale',String(v.fontScale/100));
 app.style.setProperty('--fluid-robot-scale',String(v.robotSize/65));
 const named={cyan:'#6ee3e8',blue:'#87bafa',green:'#76d5a7',gold:'#efc47d'};
 const source=v.accent==='custom'?v.customColor:named[v.accent];
 const dark=v.theme==='auto'?matchMedia('(prefers-color-scheme: dark)').matches:v.theme!=='light';
 const bg=dark?'#09121d':'#f3f6fa';
 const luminance=(hex)=>{const c=hex.match(/[a-f\d]{2}/ig).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
 let accent=source;let num=0;
 while(num++<12){const a=luminance(accent),b=luminance(bg),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(ratio>=4.5)break;
 const c=accent.match(/[a-f\d]{2}/ig).map(x=>parseInt(x,16));const target=dark?255:0;
 accent='#'+c.map(x=>Math.round(x*.82+target*.18).toString(16).padStart(2,'0')).join('');
 }
 app.style.setProperty('--fluid-accent',accent);
 const rgb=accent.match(/[a-f\d]{2}/ig).map(x=>parseInt(x,16));app.style.setProperty('--fluid-accent-rgb',rgb.join(','));
 app.dataset.resolvedTheme=dark?'dark':'light';
 document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#09111c':'#f4f7fa');
 const name=byId('appearance-current');if(name)name.textContent=v.preset.charAt(0).toUpperCase()+v.preset.slice(1);
 applyNav();updateShortcuts();
}
function updateShortcuts(){document.querySelectorAll('.prompt-chip').forEach(el=>{const id=el.dataset.page||({"Give me an Orbit briefing":'command'})[el.dataset.prompt];if(id)el.hidden=!value.homeShortcuts.includes(id);});}
function applyNav(){const nav=byId('mobile-nav');if(!nav)return;const items=[...nav.querySelectorAll('button')];const map=new Map(items.filter(el=>el.dataset.page).map(el=>[el.dataset.page,el]));const more=items.find(x=>x.dataset.action==='open-more');
 const order=['home',value.navFirst,value.navSecond];for(const id of order){const el=map.get(id);if(el){el.hidden=false;nav.appendChild(el);}}
 for(const [id,el] of map)if(!order.includes(id)){el.hidden=true;nav.appendChild(el);}if(more)nav.appendChild(more);
}
function migrate(legacy){if(initialized)return;const d={...value};if(legacy){if(legacy.accent==='blue')d.accent='blue';if(legacy.accent==='silver')d.accent='cyan';if(legacy.motion===false)d.motion='off';}value=clean(d);initialized=true;save();apply();}
function choose(field,next){const candidate={...value,[field]:next};value=clean(candidate);save();apply();draw(false);}
function download(name,text,type){const blob=new Blob([text],{type});const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function select(k,items){return `<select id="appearance-${k}" data-appearance-field="${k}" aria-label="${k}">${items.map(([val,label])=>`<option value="${val}" ${value[k]===val?'selected':''}>${escapeHTML(label)}</option>`).join('')}</select>`;}
function control(label,desc,body){return `<div class="appearance-row"><div class="appearance-copy"><label>${label}</label><small>${desc}</small></div><div class="appearance-control">${body}</div></div>`;}
const opt=(vals)=>vals.map(x=>Array.isArray(x)?x:[x,x]);
function draw(focusKeep=false){const root=byId('appearance-studio');if(!root)return;
 const active=focusKeep?document.activeElement?.id:null;const v=value;
 root.innerHTML=`<div class="appearance-head"><div><div class="appearance-kicker">PERSONALISE ORBIT</div><h2>Appearance Studio</h2><p>Make Orbit your own. Changes apply instantly and stay on this device.</p></div><span class="appearance-version">FLUID UI · 3.2</span></div>
 <div class="appearance-presets" role="group" aria-label="Interface preset">${PRESETS.map(p=>`<button type="button" class="preset-button ${v.preset===p?'selected':''}" data-appearance-preset="${p}" aria-pressed="${v.preset===p}"><span class="preset-mini ${p}"><i></i><i></i><i></i></span><strong>${p[0].toUpperCase()+p.slice(1)}</strong><small>${{minimal:'Only essentials',balanced:'Quick access',workspace:'Focused work',character:'More Orbit'}[p]}</small></button>`).join('')}</div>
 <div class="appearance-preview" aria-label="Appearance preview"><div class="preview-top"><strong>ORBIT<span> · THE FIXER</span></strong><span class="preview-status">LOCAL</span></div><img src="./assets/orbit-robot.png" alt="Orbit interface preview"/><div class="preview-greeting">Ready when you are.</div><div class="preview-composer">Message Orbit… <span>↗</span></div><small>Live preview — your real interface changes with these controls</small></div>
 <div class="appearance-fields">
 ${control('Accent','Cyan, blue, green, gold or custom.',select('accent',opt([['cyan','Cyan'],['blue','Blue'],['green','Green'],['gold','Gold'],['custom','Custom']]))+`<input aria-label="Custom accent colour" data-appearance-field="customColor" type="color" value="${v.customColor}" />`)}
 ${control('Theme','Dark, light, or follow your device.',select('theme',opt([['dark','Dark'],['light','Light'],['auto','System']])))}
 ${control('Background','Control decorative visual effects.',select('background',opt([['quiet','Quiet'],['glow','Soft glow'],['grid','Subtle grid']])))}
 ${control('Density','Comfortable or compact workspace.',select('density',opt([['comfortable','Comfortable'],['compact','Compact']])))}
 ${control('Text scale','Relative interface scale; editable fields stay at least 16px.',`<input type="range" aria-label="Text scale" data-appearance-field="fontScale" min="90" max="125" step="5" value="${v.fontScale}"/><output>${v.fontScale}%</output>`)}
 ${control('Corners','Edge shape of panels and buttons.',select('rounding',opt([['soft','Soft'],['round','Round'],['square','Square']])))}
 ${control('Navigation slots','Two main destinations; everything else under More.',select('navFirst',opt([['audits','Audits'],['knowledge','Knowledge'],['reports','Reports']]))+select('navSecond',opt([['knowledge','Knowledge'],['reports','Reports'],['audits','Audits']])))}
 ${control('Orbit size','Adjust character size.',`<input type="range" aria-label="Robot size" data-appearance-field="robotSize" min="35" max="100" step="5" value="${v.robotSize}"/><output>${v.robotSize}%</output>`)}
 ${control('Orbit position','Companion position while working.',select('robotPosition',opt([['left','Left'],['center','Center'],['right','Right']])))}
 ${control('Behaviour','Select animation intensity.',select('motion',opt([['expressive','Expressive'],['subtle','Subtle'],['off','Off']])))}
 ${control('Interface sounds','Quiet, optional audio cues.',`<label class="appearance-check"><input type="checkbox" data-appearance-field="sounds" ${v.sounds?'checked':''}/> Enable sounds</label>`)}
 ${control('Extra labels','Show supporting Home details.',`<label class="appearance-check"><input type="checkbox" data-appearance-field="labels" ${v.labels?'checked':''}/> More labels</label>`)}
 </div>
 <fieldset class="appearance-shortcuts"><legend>Home shortcuts</legend><div>${SHORTCUTS.map(x=>`<label class="appearance-check"><input type="checkbox" data-appearance-shortcut="${x}" ${v.homeShortcuts.includes(x)?'checked':''}/>${x[0].toUpperCase()+x.slice(1)}</label>`).join('')}</div></fieldset>
 <div class="appearance-actions"><button type="button" data-appearance-action="export">Export preset</button><button type="button" data-appearance-action="import">Import preset</button><button type="button" data-appearance-action="reset">Restore defaults</button></div>
 <p class="appearance-footnote" role="status">${hasStorage?'Appearance preferences are stored on this device only.':'Appearance storage is unavailable. Changes may not survive a restart.'} No reports, conversations, policy or knowledge records are modified.</p>`;
 if(active)byId(active)?.focus({preventScroll:true});
}
function mount(){const settings=byId('settings-content');if(!settings)return;
 let root=byId('appearance-studio');if(!root){root=document.createElement('section');root.id='appearance-studio';root.className='appearance-studio';const intro=settings.querySelector('.page-intro');if(intro)intro.after(root);else settings.prepend(root);}draw();}
function onField(e){const el=e.target,field=el.dataset.appearanceField;if(field){let next=el.type==='checkbox'?el.checked:el.type==='range'?Number(el.value):el.value;
 if(field==='navSecond'&&next===value.navFirst){next=NAV.find(x=>x!==value.navFirst);}
 if(field==='navFirst'&&next===value.navSecond)value.navSecond=NAV.find(x=>x!==next);
 value=clean({...value,[field]:next});save();apply();
 if(el.type==='range'){const out=el.nextElementSibling;if(out?.tagName==='OUTPUT')out.textContent=el.value+(field==='fontScale'?'%':'%');}
 else if(e.type==='change')draw(true);
 return true;}
 if(el.dataset.appearanceShortcut){const s=el.dataset.appearanceShortcut;value.homeShortcuts=el.checked?[...new Set([...value.homeShortcuts,s])]:value.homeShortcuts.filter(x=>x!==s);save();apply();return true;}
 return false;}
function onClick(e){const b=e.target.closest('button');if(!b)return;const preset=b.dataset.appearancePreset;
 if(preset){choose('preset',preset);return;}
 switch(b.dataset.appearanceAction){case 'reset':if(confirm('Restore Orbit appearance defaults? Your data and reports will not change.')){value={...DEFAULT};save();apply();draw();}break;
 case 'export':download('Orbit_Appearance_3.2.json',JSON.stringify({format:'ORBIT_APPEARANCE_V1',version:'3.2',preferences:value},null,2),'application/json');break;
 case 'import':byId('appearance-import')?.click();break;default:return;}
}
async function importFile(file){try{if(!file||file.size>20000)throw Error('Appearance file must be smaller than 20 KB.');const data=JSON.parse(await file.text());if(data?.format!=='ORBIT_APPEARANCE_V1'||!data.preferences||typeof data.preferences!=='object')throw Error('Invalid appearance preset file.');value=clean(data.preferences);save();apply();draw();window.OrbitUI?.notify?.('Appearance preset imported.');}catch(e){window.OrbitUI?.notify?.('Appearance import failed: '+(e.message||e));}}
function start(){load();apply();document.addEventListener('click',e=>{if(e.target.closest('#appearance-studio'))onClick(e);},true);
 document.addEventListener('input',e=>{if(e.target.closest('#appearance-studio'))onField(e);},true);
 document.addEventListener('change',e=>{if(e.target.closest('#appearance-studio'))onField(e);},true);
 settingsInput=document.createElement('input');settingsInput.id='appearance-import';settingsInput.type='file';settingsInput.accept='.json,application/json';settingsInput.hidden=true;document.body.append(settingsInput);
 settingsInput.addEventListener('change',async()=>{if(settingsInput.files?.[0])await importFile(settingsInput.files[0]);settingsInput.value='';});
 matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',apply);matchMedia('(prefers-reduced-motion: reduce)').addEventListener?.('change',apply);
}
function sound(){if(!value.sounds)return;try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)return;const ctx=new Context();const o=ctx.createOscillator(),gain=ctx.createGain();o.type='sine';o.frequency.value=660;gain.gain.setValueAtTime(.02,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.07);o.connect(gain).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.07);o.onended=()=>ctx.close();}catch{}}
window.OrbitAppearance={get:()=>({...value,homeShortcuts:[...value.homeShortcuts]}),clean,migrate,apply,applyNav,mount,render:draw,importFile,sound,version:'3.2'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
