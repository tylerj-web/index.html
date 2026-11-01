/* Framework Command | nine purpose-designed, lightweight studio entry screens.
 * UI-only: HTML/CSS, no 3D engine. Existing deeper studio pages and draft tools are preserved.
 * Sample records do not claim a live AI model, filesystem, DAW or video export connection. */
(function(){
'use strict';
const F=window.FC_DATA, base=window.FC_SCREENS.renderStudio;
const esc=s=>window.FC.esc(s), icon=s=>window.FC.icon(s), orbit=()=>window.FC.orbitMarkup('portrait');
const tabs=(ws,t,title,iconName='arrow',style='')=>'<button class="fd-launch '+style+'" data-tab="'+ws+':'+t+'"><span class="fd-launch-icon">'+icon(iconName)+'</span><span>'+esc(title)+'</span><span class="fd-arrow">'+icon('arrow')+'</span></button>';
const project=(ws,id,label,desc,iconName='file')=>'<button class="fd-project" data-project="'+ws+':'+id+'"><span class="fd-project-icon">'+icon(iconName)+'</span><span class="fd-project-copy"><strong>'+esc(label)+'</strong><small>'+esc(desc)+'</small></span>'+icon('arrow')+'</button>';
const section=(title,sub='')=>'<div class="fd-section-title"><h2>'+title+'</h2>'+(sub?'<p>'+sub+'</p>':'')+'</div>';
const head=(ws,kicker,title,subtitle,extra='')=>'<header class="fd-hero fd-hero-'+ws+'"><div class="fd-hero-content"><div class="fd-kicker">'+esc(kicker)+'</div><h1>'+title+'</h1><p>'+esc(subtitle)+'</p></div>'+extra+'</header>';
const note=s=>'<p class="fd-note">'+s+'</p>';
const badge=s=>'<span class="fd-badge">'+esc(s)+'</span>';
const menu=(ws,entries)=>'<div class="fd-action-grid">'+entries.map(x=>'<button class="fd-action" data-tab="'+ws+':'+x[0]+'"><span class="fd-action-icon">'+icon(x[2])+'</span><strong>'+esc(x[1])+'</strong><small>'+esc(x[3]||'Open workspace')+'</small></button>').join('')+'</div>';
const card=(body,cls='')=>'<section class="fd-card '+cls+'">'+body+'</section>';
const smallHeading=(t)=>'<h3 class="fd-card-heading">'+t+'</h3>';
const assets=(ws)=>'<div class="fd-files">'+window.FC.allProjects(ws).slice(0,7).map(p=>project(ws,p.id,p.name,p.note||'Project',p.icon||'file')).join('')+'</div>';
const appLauncher=(ws)=>'<div class="fd-app-grid">'+(F.apps[ws]||[]).map((a,i)=>'<button class="fd-app" data-app="'+ws+':'+i+'"><span>'+icon(a.icon||'grid')+'</span><strong>'+esc(a.name)+'</strong><small>'+esc(a.short||'External program')+'</small></button>').join('')+'</div>';
function reliable(){
return head('reliable','WORK / 01','Reliable <em>Friends</em>','Commander and Orbit. Two equal-rank officers, each with a distinct responsibility.')+
'<div class="fd-officer-grid">'+
'<button class="fd-officer fd-officer-commander" data-tab="reliable:Commander"><span class="fd-officer-icon">'+icon('command')+'</span><span class="fd-officer-copy"><span class="fd-caption">SENIOR OFFICER · OPERATIONS</span><strong>COMMANDER</strong><small>Plan · Delegate · Execute</small></span><span class="fd-arrow">'+icon('arrow')+'</span></button>'+
'<button class="fd-officer fd-officer-orbit" data-tab="reliable:Orbit"><span class="fd-officer-icon">'+icon('spark')+'</span><span class="fd-officer-copy"><span class="fd-caption">SENIOR OFFICER · ESTABLISHMENT</span><strong>ORBIT</strong><small>Audit · Review · Improve</small></span><span class="fd-arrow">'+icon('arrow')+'</span></button></div>'+
'<div class="fd-layout fd-2">'+card(smallHeading('Organisation')+'<p class="fd-muted">Inspect the complete hierarchy and reporting lines: 3 Directors, 9 Leads, 18 Specialists.</p>'+tabs('reliable','Organisation','Open command hierarchy','users','fd-accent'))+
card(smallHeading('Governance & training')+'<p class="fd-muted">Protected policy, knowledge references and training workflows.</p><div class="fd-inline-actions">'+tabs('reliable','Knowledge & Training','Knowledge','file')+tabs('reliable','Policy & Audits','Audits','shield')+'</div>')+'</div>'+note('Concept interface only. Commander and Orbit are not connected to a functioning AI model in this website.');
}
function archives(){
const ps=F.projects.archives||[];
return head('archives','WORK / 02','Archives <em>& Administration</em>','Search, organise and open your information without unnecessary screens.')+
card('<label class="fd-search-line">'+icon('search')+'<input class="field" data-local-search="archives" placeholder="Search registered example records..." aria-label="Search sample archive projects">'+badge('LOCAL SAMPLE INDEX')+'</label><div class="fd-archive-actions">'+tabs('archives','ATLAS','ATLAS Desktop','archive','fd-accent')+tabs('archives','Collections','Collections','layers')+tabs('archives','Search','Advanced search','search')+'</div>','fd-archive-search')+
'<div class="fd-layout fd-archive-layout">'+card(smallHeading('Library')+'<div class="fd-folder-grid">'+['Documents','Reference','Collections','Administrative'].map((name,i)=>'<button class="fd-folder" data-tab="archives:'+(['Collections','Collections','Collections','Utilities'][i])+'">'+icon(i===3?'settings':'archive')+'<strong>'+name+'</strong></button>').join('')+'</div>')+
card(smallHeading('Registered items')+'<div id="archive-results">'+assets('archives')+'</div>')+'</div>'+note('ATLAS remains a separate application. The public website cannot search your private disk or open Windows programs.');
}
function html(){
const src='&lt;!doctype html&gt;<br>&lt;html lang="en"&gt;<br>&nbsp;&nbsp;&lt;head&gt;&lt;title&gt;My App&lt;/title&gt;&lt;/head&gt;<br>&nbsp;&nbsp;&lt;body&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;Build something.&lt;/h1&gt;<br>&nbsp;&nbsp;&lt;/body&gt;<br>&lt;/html&gt;';
return head('html','CREATE / 03','HTML <em>Studio</em>','A focused development workspace for your websites and HTML applications.')+
'<div class="fd-layout fd-html-main">'+card('<div class="fd-window-bar">'+icon('code')+' <strong>Source editor</strong>'+badge('WORKSHOP PREVIEW')+'</div><div class="fd-code"><span>1</span><code>'+src+'</code></div><div class="fd-card-footer">'+tabs('html','Workshop','Open functional HTML Workshop','code','fd-accent')+'</div>','fd-code-card')+
card('<div class="fd-window-bar">'+icon('play')+' <strong>App preview</strong></div><div class="fd-mini-web"><div class="fd-mini-browser"><i></i><i></i><i></i></div><div class="fd-mini-web-body"><span>MY APPLICATION</span><strong>Build something.</strong><p>Design · Code · Test</p><span class="fd-mini-button">Get Started</span></div></div><div class="fd-card-footer">'+tabs('html','My Projects','Open project library','file')+'</div>','fd-preview-card')+'</div>'+
'<div class="fd-layout fd-2">'+card(smallHeading('Existing development projects')+assets('html'))+
card(smallHeading('Connected development tools')+appLauncher('html')+note('Local HTML Workshop connection must be configured in the Windows app. The built-in demo editor is under Workshop.'))+'</div>';
}
function marketing(){
return head('marketing','CREATE / 04','Promotion <em>& Marketing</em>','Keep campaigns, artwork, newsletters and publishing tasks in one clean view.')+
'<div class="fd-layout fd-marketing-main">'+card('<div class="fd-campaign-art"><div class="fd-campaign-eyebrow">CANBERRA CAMPAIGN</div><strong>GOING IDEAL</strong><span>AUSTRALIAN CAPITAL TERRITORY</span><div class="fd-campaign-orbit"></div></div><div class="fd-card-footer">'+project('marketing','canberra','Canberra Campaign','Promotional production and branding','megaphone')+'</div>','fd-campaign-card')+
card(smallHeading('Campaign actions')+menu('marketing',[['Campaigns','Campaigns','megaphone','Manage projects'],['Design Board','Design board','palette','Artwork and briefs'],['Brand Library','Brand assets','layers','Templates and style']])+'</div>')+'</div>'+
'<div class="fd-layout fd-2">'+card(smallHeading('Your campaigns')+assets('marketing'))+card(smallHeading('Creative applications')+appLauncher('marketing'))+'</div>';
}
function video(){
return head('video','CREATE / 05','Video Editing <em>Studio</em>','Footage, media organisation and post-production without a 3D environment.')+
'<div class="fd-layout fd-video-main">'+card('<div class="fd-window-bar">'+icon('film')+' <strong>Program monitor</strong>'+badge('PREVIEW')+'</div><div class="fd-video-screen"><div class="fd-video-sun"></div><div class="fd-video-ground"></div><span>VIDEO WORKSPACE</span><button data-tab="video:Editing Suite" class="fd-video-play" aria-label="Open editing suite">'+icon('play')+'</button></div><div class="fd-video-foot">'+tabs('video','Editing Suite','Open editing suite','film','fd-accent')+'</div>')+
card(smallHeading('Media and production')+menu('video',[['Media Library','Media library','archive','Import and preview'],['AI Video','AI generators','spark','Prompts and links'],['Connections','Editors','git','Configure tools']])+note('The timeline shown here is a layout example. Editing and rendering engines are not connected.'))+'</div>'+
card('<div class="fd-window-bar">'+icon('film')+' <strong>Timeline concept</strong><span class="fd-panel-hint">SCENE / AUDIO / TITLES</span></div><div class="fd-timeline"><div class="fd-timeline-ruler">00:00 <span>00:15</span><span>00:30</span><span>00:45</span></div><div class="fd-track fd-track-cyan"><label>VIDEO</label><span></span><span></span><span></span></div><div class="fd-track fd-track-rose"><label>AUDIO</label><span></span><span></span></div></div>','fd-timeline-card');
}
function severance(){
return head('severance','CREATE / 06','S E V E R A N C E <em> / Studio</em>','One production home for the manuscript, episodes, scenes, reference frames and animation.')+
'<div class="fd-layout fd-severance-main">'+card('<div class="fd-between-heading">'+smallHeading('Episodes')+'<button class="fd-small-action" data-tab="severance:Episodes & Shots">VIEW ALL '+icon('arrow')+'</button></div><div class="fd-files">'+project('severance','episode-1','Episode 01','Episode production workspace','film')+project('severance','episode-9','Episode 09','References and continuity','film')+project('severance','episode-10','Episode 10','Production planning','film')+'</div><div class="fd-card-footer">'+tabs('severance','Episodes & Shots','Episode planner','film','fd-accent')+'</div>')+
card('<div class="fd-window-bar">'+icon('film')+' <strong>Storyboard workspace</strong>'+badge('SCENE VIEW')+'</div><div class="fd-storyboard"><div class="fd-frame fd-frame-a"><span>MASTER FRAME</span></div><div class="fd-frame fd-frame-b"><span>SHOT REFERENCE</span></div><div class="fd-frame fd-frame-c"><span>ANIMATION PLAN</span></div></div><div class="fd-card-footer">'+tabs('severance','Image & Animation','Image & animation tools','spark')+'</div>')+'</div>'+
'<div class="fd-layout fd-2">'+card(smallHeading('Writing & continuity')+tabs('severance','Writing Room','Writing Room','file','fd-accent')+tabs('severance','Canon & Characters','Canon & characters','shield'))+
card(smallHeading('Production pipeline')+'<div class="fd-pipeline">'+['Script','Reference','Storyboard','Animation','Edit'].map((a,i)=>'<span>'+a+(i<4?' →':'')+'</span>').join('')+'</div>'+tabs('severance','Post-Production','Post-production','film'))+'</div>'+note('These are reference placeholders. No unpublished manuscript text or generated shot assets have been imported into the public demo.');
}
function music(){
const tracks=[['VOICE','#f27cba'],['INSTRUMENT','#89b8ee'],['RHYTHM','#79cfac'],['MIX','#f6d08c']];
return head('music','CREATE / 07','Music <em>Studio</em>','Write a song, organise sessions and launch your production applications.')+
'<div class="fd-layout fd-music-main">'+card('<div class="fd-window-bar">'+icon('music')+' <strong>Session workspace</strong>'+badge('TRACK LAYOUT · SAMPLE')+'</div><div class="fd-daw"><div class="fd-daw-ruler"><span>1</span><span>5</span><span>9</span><span>13</span><span>17</span><span>21</span></div>'+tracks.map((t,i)=>'<div class="fd-audio-row"><strong>'+t[0]+'</strong><div class="fd-audio-lane"><div class="fd-audio-clip" style="--track:'+t[1]+';--clip-size:'+(75-i*8)+'%"></div></div></div>').join('')+'</div><div class="fd-card-footer">'+tabs('music','Songwriter','Open songwriter','file','fd-accent')+'</div>')+
card(smallHeading('Music apps')+appLauncher('music')+'<div class="fd-card-footer">'+tabs('music','Studio Apps','Configure launchers','settings')+'</div>')+'</div>'+
'<div class="fd-layout fd-2">'+card(smallHeading('My compositions')+assets('music'))+
card(smallHeading('Production')+menu('music',[['Song Library','Song library','music','Tracks and projects'],['Songwriter','Lyrics','file','Edit text'],['Soundtracks','Soundtracks','film','Production connections']]))+'</div>';
}
function reallife(){
return head('reallife','CREATE / 08','Real <em>Life</em>','Two independent creative laboratories: Living World simulation and Orbit character production.')+
'<div class="fd-layout fd-2">'+
card('<div class="fd-real-art"><div class="fd-planet"></div><span>LIVING WORLD</span></div><div class="fd-card-footer">'+project('reallife','living-world','Living World','Game, ecosystems, simulation and characters','globe')+'</div><div class="fd-inline-actions">'+tabs('reallife','Living World','World development','globe','fd-accent')+'</div>')+
card('<div class="fd-real-art fd-orbit-art">'+orbit()+'</div><div class="fd-card-footer">'+project('reallife','orbit-character','Orbit Character','3D model, rigging, expressions and animation','spark')+'</div><div class="fd-inline-actions">'+tabs('reallife','Orbit Character','Character development','spark','fd-accent')+'</div>')+'</div>'+
'<div class="fd-layout fd-2">'+card(smallHeading('3D workflow')+'<div class="fd-pipeline"><span>Model →</span><span>Rig →</span><span>Animate →</span><span>Export</span></div>'+tabs('reallife','3D Assets','Asset library','layers'))+
card(smallHeading('External programs')+appLauncher('reallife'))+'</div>';
}
function entertain(){
return head('entertain','ENTERTAIN / 09','Entertainment <em>Hub</em>','Your local media, installed games and favourite services. Nothing more complicated.')+
'<div class="fd-layout fd-entertain-main">'+card('<div class="fd-media-art"><div class="fd-media-ring"></div><strong>YOUR<br>MEDIA SPACE</strong><p>Browse · Play · Enjoy</p></div><div class="fd-card-footer">'+tabs('entertain','Movies & Shows','Open local media player','play','fd-accent')+'</div>')+
card(smallHeading('Choose an activity')+menu('entertain',[['Movies & Shows','Watch','film','Local video'],['Music','Listen','music','Local audio'],['Games','Play','play','Game library']])+note('Choose your own media file for playback; nothing is uploaded to the site.'))+'</div>'+
card(smallHeading('Launchers')+appLauncher('entertain')+'<div class="fd-card-footer">'+tabs('entertain','Launchers','Manage service links','grid')+'</div>');
}
const all={reliable,archives,html,marketing,video,severance,music,reallife,entertain};
window.FC_SCREENS.renderStudio=function(ws,tab){
 const entry=F.workspaces.find(w=>w.id===ws);if(!entry)return base(ws,tab);
 if(tab===entry.tabs[0]&&all[ws]){
  return '<div class="workspace ws-'+ws+' fd-studio fd-studio-'+ws+'"><div class="view fd-design-view">'+all[ws]()+'</div></div>';
 }
 return base(ws,tab);
};
window.FC_DESIGN={version:'2.0',studios:Object.keys(all)};
})();
