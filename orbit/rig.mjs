/** Orbit rig v1.0 — four rigid moving parts, deterministic poses + damped transitions. */
export const BEHAVIORS = Object.freeze({
  idle:      {name:'Idle',         duration:8,    loop:true,  face:'eyes',   note:'Quiet hovering with autonomous micro-movement'},
  greet:     {name:'Greeting',     duration:2.6,  loop:false, face:'happy',  note:'Recognises presence and acknowledges naturally'},
  wave:      {name:'Real wave',    duration:3.2,  loop:false, face:'happy',  note:'Shoulder lift, repeated wave, follow-through'},
  listen:    {name:'Listening',    duration:5,    loop:true,  face:'listen', note:'Attentive gaze and subtle listening gestures'},
  think:     {name:'Thinking',     duration:5,    loop:true,  face:'think',  note:'Considered eye movement and tilted head'},
  speak:     {name:'Speaking',     duration:4,    loop:true,  face:'speak',  note:'Rhythmic natural communication gestures'},
  curious:   {name:'Curiosity',    duration:3.5,  loop:false, face:'curious',note:'Questioning head tilt and asymmetrical arms'},
  scan:      {name:'Scanning',     duration:5,    loop:true,  face:'scan',   note:'Live screen sweep with deliberate head movement'},
  review:    {name:'Reviewing',    duration:5,    loop:true,  face:'review', note:'Careful reading and inspection pose'},
  focus:     {name:'Focused',      duration:5,    loop:true,  face:'focus',  note:'Concentrated attention, subdued body motion'},
  celebrate: {name:'Celebration',  duration:3.3,  loop:false, face:'success',note:'Two-arm rise and buoyant settling'},
  success:   {name:'Task complete',duration:2.8,  loop:false, face:'success',note:'Green check displayed on facial screen'},
  caution:   {name:'Caution',      duration:3.6,  loop:false, face:'caution',note:'Yellow triangle and guarded posture'},
  error:     {name:'Error',        duration:3.5,  loop:false, face:'error',  note:'Red exclamation and recovery gesture'},
  sleep:     {name:'Resting',      duration:7,    loop:true,  face:'sleep',  note:'Dimmed eyes and near-still hover'},
  wake:      {name:'Wake',         duration:2.8,  loop:false, face:'eyes',   note:'Gradual wake-up and attentive greeting'}
});
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=t=>{t=clamp(t);return t*t*(3-2*t)};
export const mix=(a,b,t)=>a+(b-a)*t;
export const easeBetween=(t,a,b)=>smooth((t-a)/(b-a));
const base=()=>({headYaw:0,headRoll:0,headPitch:0,torsoRoll:0,leftArm:0.08,rightArm:-0.08,leftPitch:0,rightPitch:0,hover:0,lean:0,core:0.6,gazeX:0,gazeY:0});
export function poseAt(state, elapsed, intensity=1){
  const s=BEHAVIORS[state]||BEHAVIORS.idle;
  const p=base();const t=Math.max(0,elapsed);const u=clamp(t/s.duration);
  const q=Math.sin(t*2*Math.PI), breathing=Math.sin(t*1.45);
  p.hover=0.03*breathing;
  p.headYaw=0.038*Math.sin(t*.55);
  p.headRoll=0.022*Math.sin(t*.85);
  p.core=.60+.06*Math.sin(t*1.5);
  p.leftArm=-.05+.04*Math.sin(t*.7+1.6);
  p.rightArm=.05+.04*Math.sin(t*.7+.2);
  const enter=easeBetween(u,.02,.25),leave=1-easeBetween(u,.77,.99),hold=enter*leave;
  switch(state){
  case 'greet':
  case 'wave': {
    const strength=easeBetween(u,.04,.29)*(1-easeBetween(u,.76,.98));
    const pulses=Math.sin((u-.28)*Math.PI*7.5);
    p.rightArm=mix(p.rightArm,2.40+.13*pulses,strength);
    p.leftArm=mix(p.leftArm,-.16,strength*.8);
    p.headRoll=mix(p.headRoll,-.1,strength);
    p.headYaw=mix(p.headYaw,-.16,strength);
    p.torsoRoll=.07*strength;
    p.hover+=.08*strength;
    p.core+=.2*strength;
    break;
  }
  case 'listen':
    p.headPitch=-.12*enter;p.headYaw=.15*Math.sin(t*.65)*enter;
    p.leftArm=-.30*enter;p.rightArm=.3*enter;p.lean=.03*enter;
    p.gazeX=.12*Math.sin(t*.9);p.core=.66+.07*Math.sin(t*2.2);break;
  case 'think':
    p.headRoll=.18*enter;p.headYaw=-.23*enter;
    p.leftArm=-.68*enter;p.rightArm=.13*enter;p.headPitch=.1*enter;
    p.gazeX=-.20+0.06*Math.sin(t*.7);p.gazeY=-.08;p.core=.47+.08*Math.sin(t*1.5);break;
  case 'speak':
    p.headYaw=.08*Math.sin(t*2.1)*enter;p.headRoll=.065*Math.sin(t*3.5)*enter;
    p.rightArm=(.34+.22*Math.sin(t*3.1))*enter;p.leftArm=(-.2-.09*Math.sin(t*2.2))*enter;
    p.core=.66+.15*(.5+.5*Math.sin(t*5.4));break;
  case 'curious':
    p.headRoll=.28*hold;p.headYaw=-.24*hold;p.rightArm=.26*hold;
    p.leftArm=-.42*hold;p.gazeX=.20*hold;p.hover+=.06*hold;break;
  case 'scan':
    p.headYaw=.40*Math.sin(t*1.04)*enter;p.headRoll=.065*Math.sin(t*1.5)*enter;
    p.rightArm=.50*enter;p.leftArm=-.3*enter;p.core=.7+.2*Math.sin(t*3.8)**2;break;
  case 'review':
    p.headPitch=.13*enter;p.headYaw=-.12*Math.sin(t*.7)*enter;
    p.leftArm=-.43*enter;p.rightArm=.23*enter;p.core=.56;break;
  case 'focus':
    p.headPitch=.11*enter;p.leftArm=-.22*enter;p.rightArm=.22*enter;
    p.hover*=.3;p.core=.62;break;
  case 'celebrate': {
    const up=easeBetween(u,.08,.32)*(1-easeBetween(u,.7,.97));
    p.leftArm=(-2.48+.09*Math.sin(t*8))*up;p.rightArm=(2.48+.09*Math.sin(t*8.2))*up;
    p.hover+=.18*up+.09*Math.sin(t*8)*up;p.headRoll=.12*Math.sin(t*6)*up;
    p.core=.68+.34*up;break;
  }
  case 'success': {
    const up=easeBetween(u,.05,.32)*(1-easeBetween(u,.73,.99));
    p.rightArm=1.5*up;p.leftArm=-.42*up;p.headRoll=-.12*up;
    p.hover+=.1*up;p.core=.7+.25*up;break;
  }
  case 'caution':
    p.leftArm=-.53*hold;p.rightArm=.53*hold;p.headPitch=-.1*hold;
    p.headRoll=.04*Math.sin(t*3)*hold;p.core=.45;break;
  case 'error':
    p.leftArm=-.68*hold;p.rightArm=.63*hold;p.headRoll=-.12*hold;
    p.headPitch=-.16*hold;p.core=.38;break;
  case 'sleep':
    p.hover=.005*Math.sin(t*.6);p.headPitch=.19*enter;
    p.headRoll=.05*enter;p.core=.12;p.leftArm=-.03;p.rightArm=.03;break;
  case 'wake':
    p.headPitch=.18*(1-easeBetween(u,.12,.65));
    p.rightArm=1.05*hold;p.hover+=.09*hold;p.core=.3+.45*easeBetween(u,.15,.75);break;
  }
  // Slow idle remains even at low intensity; responsive gestures scale from rest.
  const neutral=base();
  for(const key of Object.keys(p))if(key!=='core')p[key]=mix(neutral[key],p[key],clamp(intensity,0,1.4));
  p.core=clamp(p.core);
  return p;
}
export class OrbitRig {
  constructor(){this.behavior='idle';this.elapsed=0;this.time=0;this.intensity=.86;this.speed=1;this.paused=false;this.pose=base();this.previous='idle';this.transition=1;this.transitionFrom=base();this.motion=true;this.autoIdle=true;}
  select(name){if(!BEHAVIORS[name])throw new Error('Unknown animation: '+name);this.transitionFrom={...this.pose};this.transition=0;this.previous=this.behavior;this.behavior=name;this.elapsed=0;return this;}
  scrub(u){this.elapsed=clamp(u)*(BEHAVIORS[this.behavior]?.duration||5);return this;}
  tick(dt){dt=clamp(dt,0,.07);if(!this.paused){this.elapsed+=dt*this.speed;this.time+=dt;this.transition=clamp(this.transition+dt*3.6);}
    const d=BEHAVIORS[this.behavior];if(d&&!d.loop&&this.elapsed>d.duration){if(this.autoIdle)this.select('idle');else this.elapsed=d.duration;}
    if(d?.loop&&this.elapsed>d.duration*10)this.elapsed%=d.duration;
    const raw=poseAt(this.behavior,this.elapsed,this.motion?this.intensity:0);
    const blend=smooth(this.transition);
    for(const k of Object.keys(this.pose))this.pose[k]=mix(this.transitionFrom[k]??raw[k],raw[k],blend);
    return this.pose;
  }
  progress(){const d=BEHAVIORS[this.behavior];return d.loop?(this.elapsed%d.duration)/d.duration:clamp(this.elapsed/d.duration);}
}
