/* Orbit 3.2 — persistent articulated character and lightweight navigation + keyboard management. */
(()=>{'use strict';
const $=x=>document.querySelector(x);
const app=()=>$('#app');
const main=()=>$('#main-content');
let current='home',previousPage='home',pageAnimation=null,keyboardFrame=0,resizeFrame=0,lastHeight=0;
const scroll=new Map();let toastTimeout=0;
const mobile=()=>matchMedia('(max-width:820px)').matches;
const lowMotion=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||app()?.classList.contains('fluid-motion-off');
function updateLocation(page,hasMessages){const stage=$('#orbit-art'),dock=$('#orbit-companion-dock'),zone=$('.orbit-zone');if(!stage||!dock||!zone)return;
 const inHome=page==='home'&&!hasMessages;
 if(inHome){if(stage.parentElement!==zone)zone.insertBefore(stage,zone.firstChild);dock.classList.remove('is-active','is-compact');stage.setAttribute('aria-label','Tap Orbit to make him wave');}
 else{if(stage.parentElement!==dock)dock.appendChild(stage);dock.classList.add('is-active');dock.classList.toggle('is-compact',app()?.classList.contains('keyboard-open'));stage.setAttribute('aria-label','Tap Orbit to make him wave');}
}
function onPage(page){current=page;updateLocation(page,!$('#chat-view')?.hidden&&page==='home');}
function onChat(hasMessages){updateLocation(current,!!hasMessages);}
function startNavigation(oldPage){previousPage=oldPage;const container=main();if(container&&oldPage)scroll.set(oldPage,container.scrollTop);if(pageAnimation){pageAnimation.cancel();pageAnimation=null;}}
function afterNavigation(page){const container=main();if(container)container.scrollTop=scroll.get(page)||0;onPage(page);
 const target=$('#page-'+page);if(!target||lowMotion())return;
 try{pageAnimation=target.animate([{opacity:.01,transform:'translate3d(0,8px,0)'},{opacity:1,transform:'translate3d(0,0,0)'}],{duration:175,easing:'cubic-bezier(.19,.8,.24,1)',fill:'none'});pageAnimation.onfinish=()=>{pageAnimation=null;};}catch{}
}
function editing(el){return el?.matches?.('input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]):not([type="file"]), textarea, select, [contenteditable="true"]')||false;}
function syncViewport(){const vv=window.visualViewport;if(!vv)return;const height=Math.round(vv.height);if(height>0){lastHeight=height;if(mobile())app()?.style.setProperty('--fluid-vh',height+'px');else app()?.style.removeProperty('--fluid-vh');}
 const focused=editing(document.activeElement);const showing=mobile()&&focused;
 app()?.classList.toggle('keyboard-open',showing);
 $('#orbit-companion-dock')?.classList.toggle('is-compact',showing);
 if(showing){const field=document.activeElement;const rect=field.getBoundingClientRect();if(rect.bottom>height-12||rect.top<0)field.scrollIntoView({block:'nearest',behavior:'instant'});}
}
function queueViewport(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(syncViewport);}
function notify(t){const node=$('#toast');if(!node)return;node.textContent=t;node.classList.add('show');clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>node.classList.remove('show'),3300);}
function captureFocus(e){if(!mobile())return;requestAnimationFrame(syncViewport);}
function sound(e){const target=e.target.closest('button');if(target&&!target.disabled&&!target.closest('#appearance-studio'))window.OrbitAppearance?.sound();}
function init(){
 const dock=$('#orbit-companion-dock');if(!dock)return;
 document.addEventListener('focusin',captureFocus);document.addEventListener('focusout',()=>setTimeout(queueViewport,60));
 window.visualViewport?.addEventListener('resize',queueViewport,{passive:true});window.visualViewport?.addEventListener('scroll',queueViewport,{passive:true});window.addEventListener('resize',queueViewport,{passive:true});
 document.addEventListener('click',sound,{passive:true});
 queueViewport();
}
window.OrbitUI={init,onPage,onChat,startNavigation,afterNavigation,notify,updateViewport:queueViewport};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
