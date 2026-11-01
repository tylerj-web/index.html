/* Framework Command prototype shell & interactions — no external AI services or Windows native APIs */
(function(){
'use strict';
const D=window.FC_DATA;
const el=document.getElementById('app');
const ORBIT_ROOT=(document.body.getAttribute('data-site-root')||'.').replace(/\/$/,'');
const orbitSrc=ORBIT_ROOT+'/orbit/assets/approved-orbit-reference.png';
const defaults={notes:{},extraProjects:{},extraApps:{},appUrls:{},favourites:['reliable','html','severance','music'],orbitHistory:[],appearance:'blue',dockSize:'normal',dockPosition:'center',orbitVisible:true,orbitSize:'small',motion:true,ambient:true};
let state;
try{state=Object.assign({},defaults,JSON.parse(localStorage.getItem('framework-command-prototype-v1')||'{}'))}catch(e){state=structuredClone(defaults)}
let modal='',orbitOpen=false,appearanceOpen=false,toastTimer=null,mediaUrl=null;
const esc=s=>String(s===undefined||s===null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={
home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
briefcase:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18"/>',
palette:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4 2 2 0 0 1 0-4h3a4 4 0 0 0 4-4 9 9 0 0 0-9-6Z"/><path d="M8 10h.01M12 7h.01M16 10h.01M7 15h.01"/>',
play:'<polygon points="7 4 21 12 7 20 7 4"/>',
users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6M21 20v-2a5 5 0 0 0-4-4.9"/>',
archive:'<rect x="3" y="3" width="18" height="5" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
code:'<path d="m8 8-4 4 4 4m8-8 4 4-4 4m-3-11-3 18"/>',
megaphone:'<path d="m3 11 14-6v14L3 13zm14-2 3-2v10l-3-2M6 14l2 6h4l-3-6"/>',
film:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4m-4 6h4m10-6h4m-4 6h4"/>',
spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z"/>',
music:'<path d="M9 18V5l12-2v13M9 7l12-2"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a16 16 0 0 1 0 18M12 3a16 16 0 0 0 0 18"/>',
command:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v5m0 8v5M3 12h5m8 0h5"/>',
shield:'<path d="M12 2 20 5v7c0 5-3.3 8-8 10-4.7-2-8-5-8-10V5z"/><path d="m8 12 3 3 5-6"/>',
grid:'<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/>',
file:'<path d="M5 2h9l5 5v15H5zM14 2v5h5M8 12h8M8 16h8"/>',
search:'<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
settings:'<circle cx="12" cy="12" r="3"/><path d="m12 2 2 2 3-1 2 3-1 3 3 2v3l-3 1 1 3-2 3-3-1-2 2-3-2-3 1-2-3 1-3-3-1v-3l3-2-1-3 2-3 3 1z"/>',
arrow:'<path d="M4 12h16m-7-7 7 7-7 7"/>',arrowleft:'<path d="M20 12H4m7-7-7 7 7 7"/>',
plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M4 4 20 20M20 4 4 20"/>',
bell:'<path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5zM10 21h4"/>',
lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
layers:'<path d="m12 2 9 6-9 6-9-6zm-9 10 9 6 9-6m-18 5 9 5 9-5"/>',
git:'<circle cx="6" cy="3" r="2"/><circle cx="18" cy="6" r="2"/><circle cx="6" cy="21" r="2"/><path d="M6 5v14M6 11h7a5 5 0 0 0 5-5"/>'
};
const icon=(name)=>'<span class="icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+(paths[name]||paths.grid)+'</svg></span>';
const save=()=>{try{localStorage.setItem('framework-command-prototype-v1',JSON.stringify(state));return true}catch(e){toast('Browser storage is unavailable');return false}};
const note=(key,def='')=>state.notes[key]??def;
const allProjects=(ws)=>(D.projects[ws]||[]).concat(state.extraProjects[ws]||[]);
const allApps=(ws)=>(D.apps[ws]||[]).concat(state.extraApps[ws]||[]);
const studio=(id,tab)=>{let w=D.workspaces.find(x=>x.id===id);return '#/studio/'+id+'/'+encodeURIComponent(tab||(w&&w.tabs[0])||'Overview')};
const go=(target)=>{
if(target==='home'){window.location.assign('../index.html');return}
let url='#/';
if(target==='home')url='#/';
else if(target.startsWith('division:'))url='#/division/'+target.split(':')[1];
else if(target.startsWith('studio:'))url=studio(target.split(':')[1]);
else if(target.startsWith('project:')){let p=target.split(':');url='#/project/'+p[1]+'/'+p[2]}
else if(target.startsWith('tab:')){let t=target.slice(4).split(':');url=studio(t[0],t.slice(1).join(':'))}
if(location.hash===url){render();return}
location.hash=url;
};
function route(){
let p=decodeURIComponent((location.hash||'#/').replace(/^#\/?/,'')).split('/');
if(p[0]==='division')return {type:'division',id:p[1]};
if(p[0]==='studio')return {type:'studio',id:p[1],tab:p[2]};
if(p[0]==='project')return {type:'project',id:p[1],project:p[2]};
return {type:'home'}
}
const divs=[
{id:'work',name:'Work',sub:'Reliable Friends, archives and the tools that keep everything running.',icon:'briefcase',desc:'2 working environments'},
{id:'create',name:'Create',sub:'A different creative universe for every discipline and project.',icon:'palette',desc:'6 creative studios'},
{id:'entertain',name:'Entertain',sub:'Games, films, music and everything you enjoy.',icon:'play',desc:'1 entertainment centre'}];
const side=(r)=>'<aside class="side"><div class="brand" data-go="home"><div class="brand-mark">F</div><div><div class="brand-name">FRAMEWORK<br>COMMAND</div><div class="brand-sub">DESKTOP CONCEPT</div></div></div><div class="sidebar-cap">Navigation</div>'+
'<button class="side-link '+(r.type==='home'?'active':'')+'" data-go="home">'+icon('home')+'<span class="side-text">Headquarters</span></button>'+
divs.map(d=>'<button class="side-link '+((r.type==='division'&&r.id===d.id)||(r.id&&D.workspaces.find(w=>w.id===r.id)?.division===d.id)?'active':'')+'" data-go="division:'+d.id+'">'+icon(d.icon)+'<span class="side-text">'+d.name+'</span><span class="count">'+D.workspaces.filter(w=>w.division===d.id).length+'</span></button>').join('')+
'<div class="side-rule"></div><div class="sidebar-cap">Explore studios</div>'+
D.workspaces.map(w=>'<div class="side-project '+(r.id===w.id?'active':'')+'" data-go="studio:'+w.id+'"><i class="side-dot" style="--dot:'+w.accent+'"></i><span>'+String(w.n).padStart(2,'0')+' · '+esc(w.name)+'</span></div>').join('')+
'<div class="side-bottom"><div class="orbit-side" data-action="orbit-toggle"><img src="'+orbitSrc+'" alt="Orbit"><div><strong>Orbit is around</strong><span>Open companion panel</span></div></div><div style="padding:15px 11px 0;color:#62768f;font-size:10px">VISUAL PROTOTYPE · NOV 2026</div></div></aside>';
const top=(r)=>{
let name=r.type==='home'?'Headquarters':r.type==='division'?r.id.charAt(0).toUpperCase()+r.id.slice(1):(D.workspaces.find(w=>w.id===r.id)||{}).name||'Framework';
return '<header class="topbar"><div class="crumb"><button data-go="home">Framework Command</button>'+ (r.type!=='home'?icon('arrow')+'<b>'+esc(name)+'</b>':'<b>/ Home</b>') +'</div><span class="top-spacer"></span><div class="search-box">'+icon('search')+'<input id="global-search" placeholder="Search projects..." aria-label="Search projects" data-search-input><kbd>⌘ K</kbd></div><span id="clock" class="top-time"></span><button class="top-icon" data-action="settings" title="Prototype settings">'+icon('settings')+'</button><button class="top-icon" data-action="orbit-toggle" title="Open Orbit">'+icon('spark')+'</button></header>';
};
function workspaceTile(w){
return '<article class="project-card" data-go="studio:'+w.id+'" tabindex="0" role="button" style="padding:20px;min-height:155px;border-color:'+w.accent+'40;background:linear-gradient(145deg,'+w.accent+'18,#121b2a)"><div class="between"><span class="project-mark" style="color:'+w.accent+'">'+icon(w.icon)+'</span><span class="tag">0'+w.n+'</span></div><h3>'+esc(w.name)+'</h3><p>'+esc(w.short)+'</p></article>'
}

/* GLOBAL CHROME — Home stays minimal, project applications keep their independent designs. */
const themeOptions=[['blue','#93bdff','Midnight'],['silver','#b9c9dd','Silver'],['ocean','#60d5ea','Ocean'],['evergreen','#83d8ae','Evergreen'],['amber','#eac392','Amber']];
const pref=(key,defaultValue)=>state[key]===undefined?defaultValue:state[key];
const orbitMarkup=(kind='normal')=>'<canvas class="orbit-cutout orbit-'+kind+'" width="589" height="760" role="img" aria-label="Orbit, the approved four-part robot character"></canvas>';
function dockHTML(r){
 const fav=(state.favourites||[]).filter(id=>D.workspaces.some(w=>w.id===id));
 const btn=(id,title,ico,selected)=>'<button class="min-dock-btn '+(selected?'home-active':'')+'" title="'+esc(title)+'" aria-label="'+esc(title)+'" data-go="'+id+'">'+icon(ico)+'</button>';
 return '<nav class="min-dock fc-global-dock" aria-label="Framework Command navigation dock">'+
 btn('home','Framework Home','home',r.type==='home')+
 '<div class="min-dock-divider"></div>'+
 divs.map(d=>btn('division:'+d.id,d.name,d.icon,r.type==='division'&&r.id===d.id)).join('')+
 (fav.length?'<div class="min-dock-divider"></div>':'')+
 fav.map(id=>{const w=D.workspaces.find(x=>x.id===id);return btn('studio:'+id,w.name,w.icon,r.id===id)}).join('')+
 '<div class="min-dock-divider"></div><button class="min-dock-btn" data-action="home-appearance" title="Personalise Framework Command" aria-label="Personalise Framework Command">'+icon('settings')+'</button></nav>';
}
function appearanceUI(){
 if(!appearanceOpen)return '';
 const theme=themeOptions.some(t=>t[0]===state.appearance)?state.appearance:'blue';
 const fav=state.favourites||[];
 return '<aside class="min-settings fc-customisation" role="dialog" aria-label="Framework Command customisation">'+
 '<div class="between"><h3 class="mb0">Personalise</h3><button class="min-header-btn" data-action="home-appearance" aria-label="Close personalisation">'+icon('close')+'</button></div>'+
 '<p class="mt10">Your layout, your preferences. Changes apply across the site and are saved in this browser.</p>'+
 '<div class="label">COLOUR THEME</div>'+
 '<div class="min-swatch-row">'+themeOptions.map(t=>'<button class="min-swatch '+(theme===t[0]?'chosen':'')+'" style="--swatch:'+t[1]+'" title="'+t[2]+'" aria-label="'+t[2]+' colour theme" data-action="home-theme:'+t[0]+'"></button>').join('')+'</div>'+
 '<div class="fc-preference"><label for="fc-dock-size">Dock size</label><select id="fc-dock-size" class="fc-choice-field" data-setting="dockSize"><option value="compact" '+(pref('dockSize','normal')==='compact'?'selected':'')+'>Compact</option><option value="normal" '+(pref('dockSize','normal')==='normal'?'selected':'')+'>Standard</option><option value="large" '+(pref('dockSize','normal')==='large'?'selected':'')+'>Large</option></select></div>'+
 '<div class="fc-preference"><label for="fc-dock-position">Dock placement</label><select id="fc-dock-position" class="fc-choice-field" data-setting="dockPosition"><option value="center" '+(pref('dockPosition','center')==='center'?'selected':'')+'>Centre</option><option value="left" '+(pref('dockPosition','center')==='left'?'selected':'')+'>Left</option></select></div>'+
 '<div class="fc-preference"><label for="fc-orbit-size">Orbit size</label><select id="fc-orbit-size" class="fc-choice-field" data-setting="orbitSize"><option value="small" '+(pref('orbitSize','small')==='small'?'selected':'')+'>Small</option><option value="medium" '+(pref('orbitSize','small')==='medium'?'selected':'')+'>Medium</option></select></div>'+
 '<div class="fc-pref-toggle"><label><input type="checkbox" data-setting="orbitVisible" '+(pref('orbitVisible',true)?'checked':'')+'> Show Orbit</label></div>'+
 '<div class="fc-pref-toggle"><label><input type="checkbox" data-setting="motion" '+(pref('motion',true)?'checked':'')+'> Gentle animations</label></div>'+
 '<div class="fc-pref-toggle"><label><input type="checkbox" data-setting="ambient" '+(pref('ambient',true)?'checked':'')+'> Ambient background light</label></div>'+
 '<div class="label mt20 mb8">FAVOURITES DOCK</div><div class="min-favs">'+D.workspaces.map(w=>'<label><input type="checkbox" '+(fav.includes(w.id)?'checked':'')+' data-action="home-fav:'+w.id+'">'+esc(w.name)+'</label>').join('')+'</div>'+
 '<div class="mt20"><button class="btn btn-sm btn-ghost full" data-action="settings">Advanced prototype settings</button></div>'+
 '</aside>';
}
function home(){
 return '<div class="min-home" data-min-theme="'+esc(state.appearance||'blue')+'">'+
 '<header class="min-header"><div class="min-brand" data-go="home"><div class="min-symbol">F</div><div class="min-wordmark">FRAMEWORK COMMAND<small>YOUR DIGITAL ENVIRONMENT</small></div></div><div class="min-status"><span class="min-online">Interactive design preview</span><span id="clock"></span><button class="min-header-btn" data-action="home-appearance" title="Personalise Framework Command" aria-label="Personalise Framework Command">'+icon('settings')+'</button></div></header>'+
 '<main class="min-main"><div class="min-main-copy"><div class="min-kicker">YOUR SPACE · YOUR PROJECTS</div><h1 class="min-title">What would<br>you like to <span>do?</span></h1><p class="min-intro">Everything in its place. Choose where you want to go, and the environment adapts to what you are doing.</p><div class="min-choices">'+divs.map((d,i)=>'<button class="min-choice" data-go="division:'+d.id+'"><span class="min-choice-top">'+icon(d.icon)+'<span class="min-choice-num">0'+(i+1)+'</span></span><span class="min-choice-bottom"><span><span class="min-choice-name">'+d.name+'</span><span class="min-choice-sub">'+(d.id==='work'?'Your team, your knowledge.':d.id==='create'?'Make the next thing.':'Games, music and media.')+'</span></span>'+icon('arrow')+'</span></button>').join('')+'</div></div>'+
 (pref('orbitVisible',true)?'<div class="min-orbit-stage"><div class="min-orbit-halo"></div>'+orbitMarkup('home')+'<button class="min-orbit-tag" data-action="orbit-toggle">Orbit '+icon('arrow')+'</button></div>':'')+
 '</main><footer class="min-footer"><div class="min-footer-status"><span>FRAMEWORK COMMAND</span><i></i><span>LOCAL-FIRST DESKTOP VISION</span></div><span>INTERACTIVE CONCEPT · AI NOT CONNECTED</span></footer></div>';
}
function studioChrome(r){
 const w=D.workspaces.find(x=>x.id===r.id);
 const division=w?w.division:r.id;
 const divisionName=division.charAt(0).toUpperCase()+division.slice(1);
 const current=r.type==='division'?divisionName:r.type==='project'?(allProjects(r.id).find(p=>p.id===r.project)?.name||'Project'):(w?.name||'Studio');
 return '<header class="fc-studio-header">'+
 '<button class="fc-back" data-action="go-back" title="Back to '+(r.type==='project'?'studio':r.type==='studio'?'division':'home')+'" aria-label="Go back">'+icon('arrowleft')+'</button>'+
 '<div class="fc-location"><button data-go="home" class="fc-location-root">FRAMEWORK COMMAND</button><span class="fc-location-chevron">/</span><button data-go="division:'+division+'" class="fc-location-division">'+divisionName+'</button>'+
 (r.type==='division'?'':'<span class="fc-location-chevron">/</span><span class="fc-location-current">'+esc(current)+'</span>')+
 '</div><div class="fc-header-spacer"></div>'+
 '<button class="fc-header-tool" data-action="open-search" aria-label="Search all projects" title="Search (Ctrl/⌘ K)">'+icon('search')+'</button>'+
 '<button class="fc-header-tool" data-action="home-appearance" aria-label="Personalise Framework Command" title="Personalise">'+icon('settings')+'</button>'+
 '<button class="fc-header-tool fc-orbit-shortcut" data-action="orbit-toggle" aria-label="Open Orbit" title="Orbit">'+icon('spark')+'</button>'+
 '</header>';
}
function division(id){
const d=divs.find(x=>x.id===id)||divs[0],w=D.workspaces.filter(x=>x.division===d.id);
return '<div class="workspace ws-'+(id==='create'?'html':id==='entertain'?'entertain':'reliable')+'"><div class="view"><div class="eyebrow">FRAMEWORK COMMAND / DIVISION</div><div class="ws-header"><div><h1>'+d.name+'</h1><p>'+d.sub+'</p></div><span class="pill">'+w.length+' SPECIALISED WORKSPACES</span></div><div class="grid grid2">'+w.map(x=>'<article class="project-card" data-go="studio:'+x.id+'" style="padding:28px;min-height:230px;background:linear-gradient(125deg,'+x.accent+'1e,#101724);border-color:'+x.accent+'55"><div class="between"><span class="project-mark" style="width:55px;height:55px;color:'+x.accent+'">'+icon(x.icon)+'</span><span class="label" style="color:'+x.accent+'">SECTION '+String(x.n).padStart(2,'0')+'</span></div><h2 class="mt20 mb8">'+esc(x.name)+'</h2><p>'+esc(x.subtitle)+'</p><div class="row" style="color:'+x.accent+'">OPEN STUDIO '+icon('arrow')+'</div></article>').join('')+'</div></div></div>';
}
function orbDrawer(){
 const history=(state.orbitHistory||[]).slice(-12),isHome=route().type==='home';
 return (orbitOpen?'<div class="orbit-drawer" role="dialog" aria-label="Orbit preview panel"><div class="drawer-head">'+orbitMarkup('drawer')+'<div class="grow"><b>Orbit · The Fixer</b><div class="tiny muted">Visual assistant · AI not connected</div></div><button class="btn btn-ghost btn-sm btn-square" data-action="orbit-toggle" aria-label="Close Orbit">'+icon('close')+'</button></div><div class="drawer-history" id="orbit-history"><div class="chat-bubble">I am available throughout Framework Command. This is my preview interface; no AI model is connected yet. You can record a note here.</div>'+history.map(x=>'<div class="chat-bubble '+(x.mine?'mine':'')+'">'+esc(x.text)+'</div>').join('')+'</div><div class="drawer-foot"><form data-form="orbit"><input class="field" name="message" placeholder="Leave a note for future Orbit..." required><button type="submit" class="btn btn-primary btn-square" aria-label="Send note">'+icon('arrow')+'</button></form></div></div>':'')+
 (pref('orbitVisible',true)&&!orbitOpen&&!isHome?'<button class="float-orbit" aria-label="Open Orbit" title="Orbit · available everywhere" data-action="orbit-toggle">'+orbitMarkup('bubble')+'</button>':'');
}
function modalUI(){
if(!modal)return '';
let html='',title='Framework Command';
if(modal==='search'){title='Search Framework Command';html='<input class="field" id="modal-search" autofocus placeholder="Find studios and projects..."><div id="modal-search-results" class="mt20">'+searchResults('')+'</div>'}
else if(modal==='settings'){title='Prototype settings';html='<p>This website is an interactive design model. Your locally entered notes and project registrations are stored only in this browser.</p><div class="stack">'+
'<div class="small-note">Desktop app launches, private files, local AI inference and external API integrations require the future Windows implementation.</div><button class="btn btn-ghost" data-action="export-data">Export prototype data (.json)</button><label class="btn btn-ghost">Import prototype data<input hidden type="file" accept="application/json" data-file="import-data"></label><button class="btn btn-danger" data-action="clear-data">Reset local preview data</button></div>'}
else if(modal.startsWith('new-project:')){const ws=modal.split(':')[1];title='New project · '+(D.workspaces.find(x=>x.id===ws)||{}).name;html='<form data-form="new-project" data-ws="'+ws+'" class="stack"><label>Project name<input name="name" class="field" placeholder="Name your project" required maxlength="80"></label><label>Project type<input name="kind" class="field" placeholder="e.g. Campaign, App, Song"></label><label>Description<textarea name="note" class="field fieldarea" style="min-height:80px" placeholder="What is it about?"></textarea></label><button type="submit" class="btn btn-primary">Create project record</button></form><p class="tiny mt20">This creates a working local demo record, not files on your Windows laptop.</p>'}
else if(modal.startsWith('new-app:')){const ws=modal.split(':')[1];title='Add application launcher';html='<form data-form="new-app" data-ws="'+ws+'" class="stack"><label>Application name<input class="field" name="name" required maxlength="75" placeholder="e.g. My HTML Workshop"></label><label>Web URL (optional)<input class="field" name="url" placeholder="https://..."></label><label>What does it do?<input class="field" name="short" placeholder="Application description"></label><button type="submit" class="btn btn-primary">Register launcher</button></form><p class="tiny">Local executable paths cannot run from a public website.</p>'}
else if(modal.startsWith('configure-app:')){let x=modal.split(':'),ws=x[1],i=Number(x[2]),a=allApps(ws)[i];title='Configure · '+esc(a?.name||'Application');let key=ws+':'+i;html='<form data-form="configure-app" data-ws="'+ws+'" data-idx="'+i+'" class="stack"><label>Web link for this launcher<input class="field" name="url" placeholder="https://..." value="'+esc(state.appUrls[key]??a?.url??'')+'"></label><button class="btn btn-primary" type="submit">Save launcher URL</button></form><p class="tiny mt20">You can use a web link in this demo. Register a Windows application path later in the desktop version.</p>'}
return '<div class="modal-backdrop" data-action="dismiss-modal"><div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(title)+'" data-modal-inner><div class="between"><h2 class="mb0">'+title+'</h2><button class="btn btn-ghost btn-sm btn-square" data-action="close-modal">'+icon('close')+'</button></div><hr class="line">'+html+'</div></div>';
}
function searchResults(q){
const term=q.toLowerCase().trim(),entries=D.workspaces.map(w=>({name:w.name,type:'Studio',url:'studio:'+w.id,detail:w.subtitle})).concat(D.workspaces.flatMap(w=>allProjects(w.id).map(p=>({name:p.name,type:w.name,url:'project:'+w.id+':'+p.id,detail:p.note||''}))));
const matches=entries.filter(x=>!term||[x.name,x.type,x.detail].join(' ').toLowerCase().includes(term)).slice(0,15);
return matches.length?matches.map(x=>'<div class="list-row" data-go="'+esc(x.url)+'" style="cursor:pointer"><span class="project-mark">'+icon(x.type==='Studio'?'grid':'file')+'</span><span class="grow"><strong>'+esc(x.name)+'</strong><div class="tiny muted">'+esc(x.type)+' · '+esc(x.detail)+'</div></span>'+icon('arrow')+'</div>').join(''):'<div class="empty">No matching studios or projects</div>'
}
function render(){
 window.FC_ORG?.unmount?.();
 const r=route(),theme=themeOptions.some(t=>t[0]===state.appearance)?state.appearance:'blue';
 const body=r.type==='home'?home():r.type==='division'?division(r.id):r.type==='studio'?window.FC_SCREENS.renderStudio(r.id,r.tab||D.workspaces.find(w=>w.id===r.id)?.tabs[0]):window.FC_SCREENS.renderProject(r.id,r.project);
 const main=r.type==='home'?body:'<div class="fc-studio-shell">'+studioChrome(r)+'<main class="fc-content">'+body+'</main></div>';
 el.innerHTML='<div class="fc-root fc-theme-'+theme+' '+(pref('motion',true)?'':'fc-no-motion')+' '+(pref('ambient',true)?'':'fc-no-ambient')+' fc-dock-'+pref('dockSize','normal')+' fc-dock-pos-'+pref('dockPosition','center')+' fc-orbit-'+pref('orbitSize','small')+'">'+
 main+dockHTML(r)+appearanceUI()+orbDrawer()+modalUI()+'</div>';
 document.title=(r.type==='home'?'Framework Command':(D.workspaces.find(w=>w.id===r.id)?.name||'Framework Command'))+' — Framework Command';
 if(r.type==='studio'&&r.id==='html'&&r.tab==='Workshop')refreshPreview();
 if(r.type==='studio'&&r.id==='reliable'&&(r.tab||'Overview')==='Organisation')window.FC_ORG?.mount?.(document.getElementById('fc-org-slot'));
 setClock();drawOrbitSprites();
 if(orbitOpen){const h=document.getElementById('orbit-history');if(h)h.scrollTop=h.scrollHeight}
}
let orbitAssetsPromise=null;
function loadOrbitAssets(){
 if(orbitAssetsPromise)return orbitAssetsPromise;
 const folder=ORBIT_ROOT+'/orbit/fluid/assets/';
 orbitAssetsPromise=fetch(folder+'parts.json').then(r=>{if(!r.ok)throw Error('Orbit geometry not available');return r.json()}).then(async parts=>{
   const images={};
   await Promise.all(['head','torso','left-arm','right-arm'].map(key=>new Promise((resolve,reject)=>{
     const i=new Image();i.onload=()=>{images[key]=i;resolve()};i.onerror=()=>reject(Error('Orbit '+key+' unavailable'));i.src=folder+key+'.png';
   })));
   return {parts,images};
 }).catch(err=>{orbitAssetsPromise=null;throw err});
 return orbitAssetsPromise;
}
async function drawOrbitSprites(){
 const pending=document.querySelectorAll('canvas.orbit-cutout');
 if(!pending.length)return;
 try{
   const {parts,images}=await loadOrbitAssets();
   document.querySelectorAll('canvas.orbit-cutout').forEach(canvas=>{
     if(canvas.dataset.rendered==='yes')return;
     canvas.width=589;canvas.height=760;
     const ctx=canvas.getContext('2d');if(!ctx)return;
     ctx.clearRect(0,0,589,760);
     for(const key of ['torso','head','left-arm','right-arm']){
       const b=parts[key];if(b&&images[key])ctx.drawImage(images[key],b.left,b.top,b.width,b.height);
     }
     canvas.dataset.rendered='yes';
   });
 }catch(err){
   document.querySelectorAll('canvas.orbit-cutout').forEach(canvas=>{canvas.setAttribute('aria-label','Orbit artwork unavailable — visit Orbit Studio');canvas.style.opacity='.2'});
 }
}
const refreshPreview=()=>{const f=document.getElementById('html-preview'),code=document.getElementById('code-editor');if(f&&code)f.srcdoc=code.value};
function toast(text){document.querySelector('.toast')?.remove();let n=document.createElement('div');n.className='toast';n.textContent=text;document.body.appendChild(n);clearTimeout(toastTimer);toastTimer=setTimeout(()=>n.remove(),3600)}
function setClock(){let c=document.getElementById('clock');if(c)c.textContent=new Intl.DateTimeFormat('en-AU',{hour:'2-digit',minute:'2-digit'}).format(new Date())}
function download(content,name,mime='text/plain'){const b=new Blob([content],{type:mime}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1200)}
function launchApp(ws,i){
let a=allApps(ws)[i];if(!a)return;
const key=ws+':'+i,url=(state.appUrls[key]??a.url??'').trim();
if(!url){modal='configure-app:'+ws+':'+i;render();return}
if(!/^https?:\/\//i.test(url)&&!url.startsWith('./')&&!url.startsWith('../')){toast('Only web links are supported in this preview.');return}
window.open(url.startsWith('./')?ORBIT_ROOT+'/'+url.replace(/^\.\//,''):url,'_blank','noopener,noreferrer');
}
function handleAction(s,from){
if(s==='go-back'){
 const r=route();
 if(r.type==='project')go('studio:'+r.id);
 else if(r.type==='studio')go('division:'+D.workspaces.find(w=>w.id===r.id)?.division);
 else go('home');
 return;
}
if(s.startsWith('setting:'))return;
if(s==='orbit-toggle'){orbitOpen=!orbitOpen;render();return}
if(s==='close-modal'||s==='dismiss-modal'){modal='';render();return}
if(s==='home-appearance'){appearanceOpen=!appearanceOpen;render();return}
if(s.startsWith('home-theme:')){const candidate=s.split(':')[1];if(themeOptions.some(t=>t[0]===candidate)){state.appearance=candidate;save();render()}return}
if(s.startsWith('home-fav:')){const id=s.split(':')[1];const favs=new Set(state.favourites||[]);if(favs.has(id))favs.delete(id);else favs.add(id);state.favourites=[...favs];save();render();return}
if(s==='settings'){modal='settings';render();return}
if(s==='open-search'){modal='search';render();document.getElementById('modal-search')?.focus();return}
if(s.startsWith('new-project:')||s.startsWith('new-app:')||s.startsWith('configure-app:')){modal=s;render();return}
if(s.startsWith('go-studio:')){go('studio:'+s.split(':')[1]);return}
if(s==='save-notes'){save();toast('Saved in this browser');return}
if(s==='preview-code'){refreshPreview();toast('Preview updated');return}
if(s==='export-code'){download(note('html-code','<!DOCTYPE html>\n<html>\n<head><title>My creation</title></head>\n<body style="font-family:system-ui;padding:24px">\n  <h1>My next project</h1>\n  <p>Made in Framework Command.</p>\n</body>\n</html>'),'framework-studio-project.html','text/html');return}
if(s==='export-lyrics'){download(note('music-lyrics'),'music-studio-lyrics.txt');return}
if(s==='export-writing'){download(note('severance-writing'),'severance-working-draft.txt');return}
if(s==='export-data'){download(JSON.stringify(state,null,2),'framework-command-preview-data.json','application/json');return}
if(s==='clear-data'){if(confirm('Reset all locally saved prototype notes and registered demo projects?')){state=structuredClone(defaults);save();modal='';render();toast('Prototype data reset')}return}
}
document.addEventListener('click',e=>{
const t=e.target.closest('[data-go],[data-action],[data-project],[data-tab],[data-app]');
if(!t)return;
if(t.hasAttribute('data-action')&&t.getAttribute('data-action')==='dismiss-modal'&&e.target.closest('[data-modal-inner]'))return;
if(t.dataset.go){modal='';go(t.dataset.go);return}
if(t.dataset.project){modal='';go('project:'+t.dataset.project);return}
if(t.dataset.tab){go('tab:'+t.dataset.tab);return}
if(t.dataset.app){let p=t.dataset.app.split(':');launchApp(p[0],Number(p[1]));return}
if(t.dataset.action){handleAction(t.dataset.action,t);return}
});
document.addEventListener('input',e=>{
const t=e.target;
if(t.matches('[data-note]')){state.notes[t.dataset.note]=t.value;save();return}
if(t.matches('#modal-search')){let o=document.getElementById('modal-search-results');if(o)o.innerHTML=searchResults(t.value);return}
if(t.matches('[data-search-input]')){if(!modal){modal='search';render();let x=document.getElementById('modal-search');if(x){x.value=t.value;x.focus();document.getElementById('modal-search-results').innerHTML=searchResults(t.value)}}return}
if(t.matches('[data-local-search]')){let out=document.getElementById('archive-results');if(out){let ps=allProjects('archives').filter(p=>(p.name+' '+p.note).toLowerCase().includes(t.value.toLowerCase()));out.innerHTML='<div class="grid grid3">'+ps.map(p=>'<div class="project-card" data-project="archives:'+p.id+'"><h3>'+esc(p.name)+'</h3><p>'+esc(p.note)+'</p></div>').join('')+'</div>'}return}
});
document.addEventListener('submit',e=>{
const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();
let type=f.dataset.form,fd=new FormData(f);
if(type==='orbit'){let msg=String(fd.get('message')||'').trim();if(!msg)return;state.orbitHistory.push({mine:true,text:msg});state.orbitHistory.push({mine:false,text:'Note recorded in this browser preview. I am not connected to an AI model or your Framework Command system yet.'});save();render();return}
if(type==='new-project'){let ws=f.dataset.ws,name=String(fd.get('name')||'').trim();if(!name)return;let id='custom-'+Date.now();(state.extraProjects[ws]??=[]).push({id,name,kind:String(fd.get('kind')||'Project').trim(),note:String(fd.get('note')||'').trim(),icon:'grid'});save();modal='';go('project:'+ws+':'+id);toast('Local project record created');return}
if(type==='new-app'){let ws=f.dataset.ws,name=String(fd.get('name')||'').trim(),url=String(fd.get('url')||'').trim();if(!name)return;if(url&&!/^https?:\/\//i.test(url)){toast('Enter a complete https:// or http:// web URL');return}(state.extraApps[ws]??=[]).push({name,short:String(fd.get('short')||'').trim(),url,icon:'grid'});save();modal='';render();toast('Launcher registered');return}
if(type==='configure-app'){let ws=f.dataset.ws,i=f.dataset.idx,url=String(fd.get('url')||'').trim();if(url&&!/^https?:\/\//i.test(url)&&!url.startsWith('./')){toast('Enter a valid web URL');return}state.appUrls[ws+':'+i]=url;save();modal='';render();toast('Launcher updated');return}
});
document.addEventListener('change',async e=>{
 const t=e.target;
 if(t.matches('[data-setting]')){
   const k=t.dataset.setting;
   if(['dockSize','dockPosition','orbitSize'].includes(k))state[k]=t.value;
   if(['orbitVisible','motion','ambient'].includes(k))state[k]=!!t.checked;
   save();render();return;
 }
 if(!t.matches('[data-file]'))return;
 const file=t.files?.[0];if(!file)return;
if(t.dataset.file==='import-data'){try{let obj=JSON.parse(await file.text());if(!obj||typeof obj!=='object'||Array.isArray(obj))throw Error('Invalid state');state={...structuredClone(defaults),...obj};save();modal='';render();toast('Prototype state imported')}catch(e){toast('Could not import that JSON file')}return}
if(mediaUrl)URL.revokeObjectURL(mediaUrl);
mediaUrl=URL.createObjectURL(file);
let dest=document.getElementById('video-monitor');
if(dest){let tag=file.type.startsWith('audio/')?'audio':'video';dest.innerHTML='<div style="position:relative;z-index:2;width:100%;padding:16px;text-align:center"><'+tag+' src="'+mediaUrl+'" controls style="width:100%;max-height:390px"></'+tag+'><p class="tiny">'+esc(file.name)+' · plays locally, not uploaded</p></div>';toast('Local media ready')}
});
document.addEventListener('keydown',e=>{
if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();handleAction('open-search');return}
if(e.key==='Escape'&&modal){modal='';render();return}
if(e.key==='Enter'&&e.target.matches('[data-project],[data-go]'))e.target.click()
});
window.addEventListener('hashchange',()=>{modal='';render();window.scrollTo(0,0)});
window.FC={icon,esc,orbitSrc,orbitMarkup,getNote:note,allProjects,allApps,go,save,toast};
render();setInterval(setClock,60000);
})();