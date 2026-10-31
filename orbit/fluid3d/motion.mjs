/* ORBIT FLUID 3D 1.0 — four permanent 3D pieces, target-driven critically damped motion.
 * All requests begin at current joint position AND joint velocity. No sprite swapping,
 * opacity crossfades, pose resetting, arm scaling, or jump cuts.
 */
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rad=n=>n*Math.PI/180;
export const MODES=[
 ['idle','Idle','Presence'],['blink','Blink','Presence'],['happy','Happy','Emotion'],['sad','Sad','Emotion'],['curious','Curious','Emotion'],['surprised','Surprised','Emotion'],
 ['listening','Listening','Work'],['thinking','Thinking','Work'],['speaking','Speaking','Work'],['focused','Focused','Work'],['sleepy','Sleepy','Presence'],['concerned','Concerned','Emotion'],
 ['scanning','Scanning','System'],['caution','Caution','System'],['complete','Task complete','System'],['error','Error','System'],['processing','Processing','System'],
 ['wave','Articulated wave','Gesture'],['celebrate','Celebrate','Gesture'],['greeting','Greeting','Gesture'],['reviewing','Reviewing','Work'],['hover','Hover','Presence'],
 ['look_around','Look around','Presence'],['slumped','Slumped','Emotion'],['nod','Nod','Gesture'],['look_up','Look up','Gesture'],['fly_left','Fly left','Travel'],['fly_right','Fly right','Travel']
];
export const DEF={headYaw:0,headRoll:0,headPitch:0,torsoRoll:0,leftArm:-.04,rightArm:.04,leftPitch:0,rightPitch:0,hover:0,lean:0,core:.67,gazeX:0,gazeY:0};
const P=(o={})=>({...DEF,...o});
export const TARGETS={
 idle:P(),blink:P({headPitch:rad(3)}),happy:P({hover:.06,leftArm:rad(-22),rightArm:rad(22),headRoll:rad(-4),core:.9}),
 sad:P({hover:-.07,headPitch:rad(14),headRoll:rad(7),leftArm:rad(8),rightArm:rad(-8),core:.37}),
 curious:P({headRoll:rad(13),headYaw:rad(17),rightArm:rad(19),rightPitch:rad(-6),core:.78}),
 surprised:P({hover:.10,headPitch:rad(-9),leftArm:rad(-29),rightArm:rad(29),core:1}),
 listening:P({headPitch:rad(-8),headYaw:rad(8),leftArm:rad(-10),rightArm:rad(17),core:.77}),
 thinking:P({headRoll:rad(9),headYaw:rad(-19),rightArm:rad(67),rightPitch:rad(-9),core:.58}),
 speaking:P({rightArm:rad(32),leftArm:rad(-18),headYaw:rad(4),core:.78}),
 focused:P({headPitch:rad(7),leftArm:rad(-14),rightArm:rad(14),core:.65}),
 sleepy:P({headPitch:rad(15),headRoll:rad(4),core:.20}),
 concerned:P({headPitch:rad(9),headRoll:rad(6),leftArm:rad(-10),rightArm:rad(20),core:.52}),
 scanning:P({headPitch:rad(-4),headYaw:rad(-9),rightArm:rad(41),rightPitch:rad(-11),core:.92}),
 caution:P({headPitch:rad(-5),leftArm:rad(-32),rightArm:rad(32),core:.58}),
 complete:P({hover:.12,headRoll:rad(-8),leftArm:rad(-36),rightArm:rad(92),core:1}),
 error:P({hover:-.07,headPitch:rad(15),leftArm:rad(-22),rightArm:rad(27),core:.40}),
 processing:P({headPitch:rad(5),leftArm:rad(-12),rightArm:rad(22),core:.78}),
 wave:P({hover:.08,headRoll:rad(-6),headYaw:rad(-8),rightArm:rad(116),rightPitch:rad(-7),leftArm:rad(-8),core:.94}),
 celebrate:P({hover:.21,headPitch:rad(-5),leftArm:rad(-132),rightArm:rad(132),core:1}),
 greeting:P({hover:.05,headRoll:rad(-3),rightArm:rad(81),core:.85}),
 reviewing:P({headPitch:rad(12),headYaw:rad(-6),leftArm:rad(-12),rightArm:rad(46),core:.70}),
 hover:P({hover:.15,headRoll:rad(3),core:.83}),
 look_around:P({headYaw:rad(22),headRoll:rad(-5),core:.7}),
 slumped:P({hover:-.12,headPitch:rad(19),leftArm:rad(5),rightArm:rad(-5),core:.23}),
 nod:P({headPitch:rad(15)}),look_up:P({headPitch:rad(-18),core:.8}),
 fly_left:P({hover:.16,headYaw:rad(-25),torsoRoll:rad(-8),leftArm:rad(19),rightArm:rad(6),core:.95}),
 fly_right:P({hover:.16,headYaw:rad(25),torsoRoll:rad(8),leftArm:rad(-6),rightArm:rad(-19),core:.95})
};
export const CHAIN={
 conversation:[['idle',.6],['listening',2.0],['thinking',2.0],['speaking',2.6],['idle',1.0]],
 scan_result:[['idle',.6],['scanning',2.8],['reviewing',1.1],['complete',2.1],['idle',1.1]],
 warning:[['idle',.6],['caution',1.7],['error',1.7],['concerned',1.0],['idle',1.1]],
 greeting:[['idle',.4],['greeting',1.2],['wave',2.7],['idle',1.1]],
 interrupt:[['idle',.5],['wave',.55],['listening',1.1],['thinking',.7],['speaking',1.2],['error',.8],['idle',1.2]]
};
const ONESHOTS={blink:.35,surprised:1.5,wave:2.8,celebrate:3,greeting:1.7,nod:.95,complete:2.7,error:2.7,fly_left:2.7,fly_right:2.7};
class Spring{
 constructor(x,w){this.x=x;this.v=0;this.w=w;}
 step(target,dt){const w=this.w, delta=this.x-target, c=this.v+w*delta, e=Math.exp(-w*dt);this.x=target+(delta+c*dt)*e;this.v=(this.v-w*c*dt)*e;return this.x;}
}
export class Orbit3DMotion{
 constructor(){
  this.mode='idle';this.clock=0;this.elapsed=0;this.playing=true;this.speed=1;this.energy=.85;this.hoverAmount=.65;this.reduced=false;this.autoIdle=true;
  this.springs=Object.fromEntries(Object.entries(DEF).map(([k,v])=>[k,new Spring(v,k==='headYaw'?9:k==='core'?13:k==='hover'?5.7:k.endsWith('Arm')?8.4:10.2)]));
  this.pose={...DEF};this.sequence=null;this.seqIndex=0;this.seqTime=0;this.faceOverride='auto';this.transitionCount=0;
 }
 select(mode,{sequence=false}={}){if(!TARGETS[mode])throw Error('Unknown behaviour '+mode);if(!sequence)this.sequence=null;this.mode=mode;this.elapsed=0;this.transitionCount++;return this;}
 run(name){if(!CHAIN[name])throw Error('Unknown sequence '+name);this.sequence=CHAIN[name];this.seqIndex=0;this.seqTime=0;this.select(CHAIN[name][0][0],{sequence:true});}
 snapshot(){return {mode:this.mode,pose:{...this.pose},velocity:Object.fromEntries(Object.entries(this.springs).map(([k,v])=>[k,v.v])),time:this.elapsed};}
 get target(){const t=this.elapsed,m=this.mode,o={...TARGETS[m]},e=this.reduced?0:this.energy;
   if(m==='wave'){const gate=Math.min(1,t*2)*(1-Math.min(1,Math.max(0,(t-2.25)*2)));o.rightArm+=Math.sin(t*12.8)*rad(11)*e*gate;o.rightPitch+=Math.sin(t*8)*rad(5)*gate;}
   if(m==='celebrate'){o.leftArm+=Math.sin(t*9)*rad(8)*e;o.rightArm-=Math.sin(t*9.1+.6)*rad(8)*e;o.hover+=Math.abs(Math.sin(t*5))*.04*e;}
   if(m==='speaking'){o.rightArm+=Math.sin(t*5.6)*rad(12)*e;o.leftArm+=Math.sin(t*6.3+.4)*rad(8)*e;o.headRoll+=Math.sin(t*3.6)*rad(2)*e;}
   if(m==='listening'){o.headYaw+=Math.sin(t*1.4)*rad(2.5)*e;}
   if(m==='thinking'){o.headRoll+=Math.sin(t*1.2)*rad(2)*e;}
   if(m==='scanning'){o.headYaw+=Math.sin(t*1.4)*rad(13)*e;}
   if(m==='look_around'){o.headYaw=Math.sin(t*.87)*rad(24)*e;}
   if(m==='nod'){o.headPitch+=Math.sin(t*8)*rad(8)*e;}
   if(m==='processing'){o.core+=Math.sin(t*5.3)*.13*e;}
   if(m==='happy'){o.hover+=Math.sin(t*3.1)*.03*e;}
   if(!this.reduced){o.hover+=Math.sin(this.clock*1.42)*.034*this.hoverAmount+Math.sin(this.clock*.71)*.014*this.hoverAmount;
    o.headRoll+=Math.sin(this.clock*.79)*rad(1)*e;o.headPitch+=Math.sin(this.clock*.61+.8)*rad(.7)*e;o.core+=Math.sin(this.clock*1.6)*.035;}
   for(const key of ['headYaw','headRoll','headPitch','torsoRoll','leftArm','rightArm','leftPitch','rightPitch'])o[key]=DEF[key]+(o[key]-DEF[key])*e;
   return o;
 }
 step(dt){if(!this.playing)return this.pose;let remaining=Math.max(0,Math.min(dt,.10))*this.speed;
   while(remaining>1e-7){const s=Math.min(remaining,1/120);this.clock+=s;this.elapsed+=s;const target=this.target;for(const k in this.springs)this.pose[k]=this.springs[k].step(target[k],s);remaining-=s;}
   if(this.sequence){this.seqTime+=Math.max(0,dt)*this.speed;let hops=0;while(this.sequence&&this.seqTime>=this.sequence[this.seqIndex][1]&&hops++<this.sequence.length){this.seqTime-=this.sequence[this.seqIndex][1];this.seqIndex++;if(this.seqIndex>=this.sequence.length){this.sequence=null;this.select('idle',{sequence:true});break;}this.select(this.sequence[this.seqIndex][0],{sequence:true});}}
   else if(this.autoIdle&&ONESHOTS[this.mode]&&this.elapsed>ONESHOTS[this.mode])this.select('idle',{sequence:true});
   return this.pose;
 }
 face(){if(this.faceOverride!=='auto')return this.faceOverride;return ({scanning:'scan',caution:'caution',complete:'success',error:'error',celebrate:'success',processing:'scan'}[this.mode]||'eyes');}
 velocities(){return Object.fromEntries(Object.entries(this.springs).map(([k,v])=>[k,v.v]));}
}
