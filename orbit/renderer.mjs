/* ORBIT Four-piece 3D renderer. Pure WebGL2, no CDN, locally cacheable. */
const TAU=Math.PI*2;
function identity(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let n=0;for(let k=0;k<4;k++)n+=a[k*4+r]*b[c*4+k];o[c*4+r]=n;}return o;}
function tr(x=0,y=0,z=0){const m=identity();m[12]=x;m[13]=y;m[14]=z;return m;}
function rx(t){let c=Math.cos(t),s=Math.sin(t);return new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]);}
function ry(t){let c=Math.cos(t),s=Math.sin(t);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]);}
function rz(t){let c=Math.cos(t),s=Math.sin(t);return new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]);}
function perspective(fovy,aspect,near,far){const f=1/Math.tan(fovy/2),o=new Float32Array(16);o[0]=f/aspect;o[5]=f;o[10]=(far+near)/(near-far);o[11]=-1;o[14]=2*far*near/(near-far);return o;}
function compile(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
function program(gl,vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;
layout(location=2) in vec2 aUv;
uniform mat4 uWorld;uniform mat4 uVP;
out vec3 vNormal;out vec3 vWorld;out vec2 vUv;
void main(){vec4 world=uWorld*vec4(aPosition,1.);vWorld=world.xyz;vNormal=normalize(mat3(uWorld)*aNormal);vUv=aUv;gl_Position=uVP*world;}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNormal;in vec3 vWorld;in vec2 vUv;
uniform vec4 uColor;uniform vec3 uEye;uniform float uGloss;uniform float uGlow;uniform bool uScreen;uniform sampler2D uTexture;
out vec4 outputColor;
void main(){
 if(uScreen){vec4 t=texture(uTexture,vUv);if(t.a<.025)discard;outputColor=t;return;}
 vec3 n=normalize(vNormal);vec3 view=normalize(uEye-vWorld);
 vec3 key=normalize(vec3(-.55,.72,1.15));vec3 fill=normalize(vec3(.92,-.18,.67));
 float diff=max(0.,dot(n,key));float bounce=max(0.,dot(n,fill));
 vec3 halfV=normalize(view+key);vec3 halfB=normalize(view+fill);
 float spec=pow(max(0.,dot(n,halfV)),mix(20.,135.,uGloss));
 float specB=pow(max(0.,dot(n,halfB)),mix(12.,80.,uGloss));
 float fresnel=pow(1.-max(dot(n,view),0.),2.3);
 vec3 base=uColor.rgb*(.28+.64*diff+.13*bounce);
 vec3 lit=base+spec*mix(vec3(.37,.65,.9),vec3(1.,.86,.59),uGloss)*(.42+.6*uGloss)+specB*vec3(.14,.54,.8)*.17;
 lit+=uColor.rgb*fresnel*.17+uColor.rgb*uGlow*1.35;
 outputColor=vec4(lit,uColor.a);
}`;
function uvEllipsoid(sx,sy,sz,lat=36,lon=64){const v=[],n=[],uv=[],idx=[];for(let iy=0;iy<=lat;iy++){const theta=Math.PI*iy/lat;for(let ix=0;ix<=lon;ix++){const phi=TAU*ix/lon;const qx=Math.sin(theta)*Math.cos(phi),qy=Math.cos(theta),qz=Math.sin(theta)*Math.sin(phi);v.push(qx*sx,qy*sy,qz*sz);const d=Math.hypot(qx/sx,qy/sy,qz/sz);n.push(qx/sx/d,qy/sy/d,qz/sz/d);uv.push(ix/lon,1-iy/lat);}}for(let iy=0;iy<lat;iy++)for(let ix=0;ix<lon;ix++){const a=iy*(lon+1)+ix,b=a+lon+1;idx.push(a,a+1,b,b,a+1,b+1);}return {v,n,uv,idx};}
function torus(R,r,segs=68,sides=12){const v=[],n=[],uv=[],idx=[];for(let i=0;i<=segs;i++){const a=i/segs*TAU,c=Math.cos(a),s=Math.sin(a);for(let j=0;j<=sides;j++){const b=j/sides*TAU,cb=Math.cos(b),sb=Math.sin(b);v.push((R+r*cb)*c,(R+r*cb)*s,r*sb);n.push(cb*c,cb*s,sb);uv.push(i/segs,j/sides);}}for(let i=0;i<segs;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;idx.push(a,b,a+1,a+1,b,b+1);}return {v,n,uv,idx};}
function screenSurface(w=1.82,h=1.20){const v=[],n=[],uv=[],idx=[];const nx=32,ny=18;for(let iy=0;iy<=ny;iy++)for(let ix=0;ix<=nx;ix++){const x=(ix/nx-.5)*w,y=(iy/ny-.5)*h;const z=.740-.25*x*x-.06*y*y;v.push(x,y,z);const nxp=.60*x,nyp=.16*y;const d=Math.hypot(nxp,nyp,1);n.push(nxp/d,nyp/d,1/d);uv.push(ix/nx,iy/ny);}for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++){const a=iy*(nx+1)+ix,b=a+nx+1;idx.push(a,a+1,b,a+1,b+1,b);}return {v,n,uv,idx};}
function mesh(gl,raw){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const count=raw.v.length/3;const data=new Float32Array(count*8);for(let i=0;i<count;i++){data.set(raw.v.slice(i*3,i*3+3),i*8);data.set(raw.n.slice(i*3,i*3+3),i*8+3);data.set(raw.uv.slice(i*2,i*2+2),i*8+6);}const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);const stride=32;gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,3,gl.FLOAT,false,stride,0);gl.enableVertexAttribArray(1);gl.vertexAttribPointer(1,3,gl.FLOAT,false,stride,12);gl.enableVertexAttribArray(2);gl.vertexAttribPointer(2,2,gl.FLOAT,false,stride,24);const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(raw.idx),gl.STATIC_DRAW);gl.bindVertexArray(null);return {vao,count:raw.idx.length};}
function rgba(hex,alpha=1){const m=hex.replace('#','');return [parseInt(m.slice(0,2),16)/255,parseInt(m.slice(2,4),16)/255,parseInt(m.slice(4,6),16)/255,alpha];}
const COL={black:'#0b1421',armor:'#111c2b',gold:'#e5aa53',trim:'#e8bf74',edge:'#533c2b',silver:'#5d7e98',panel:'#010915',blue:'#24d9f7',inner:'#0c6384'};
function capRound(ctx,x,y,w,h,r){const p=Math.min(r,h/2,w/2);ctx.beginPath();ctx.moveTo(x+p,y);ctx.arcTo(x+w,y,x+w,y+h,p);ctx.arcTo(x+w,y+h,x,y+h,p);ctx.arcTo(x,y+h,x,y,p);ctx.arcTo(x,y,x+w,y,p);ctx.closePath();}
export class Orbit3DRenderer {
 constructor(canvas,faceCanvas){this.canvas=canvas;this.gl=canvas.getContext('webgl2',{antialias:true,alpha:true,premultipliedAlpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});if(!this.gl)throw new Error('WebGL2 unavailable — use a modern desktop browser with GPU support.');this.ctx=(faceCanvas||document.createElement('canvas')).getContext('2d');this.face=this.ctx.canvas;this.face.width=1024;this.face.height=640;this.lastFace=0;this.lastFrame=0;this.yaw=-.18;this.pitch=-.05;this.zoom=1;this.quality=1.6;this.drawCalls=0;this.eyeColor='#82efff';
 const gl=this.gl;this.prog=program(gl,VS,FS);gl.useProgram(this.prog);
 this.unis={world:gl.getUniformLocation(this.prog,'uWorld'),vp:gl.getUniformLocation(this.prog,'uVP'),color:gl.getUniformLocation(this.prog,'uColor'),gloss:gl.getUniformLocation(this.prog,'uGloss'),glow:gl.getUniformLocation(this.prog,'uGlow'),screen:gl.getUniformLocation(this.prog,'uScreen'),eye:gl.getUniformLocation(this.prog,'uEye')};
 this.shape={head:mesh(gl,uvEllipsoid(1.12,.91,.67)),headGold:mesh(gl,uvEllipsoid(1.185,.958,.688)),faceBacking:mesh(gl,uvEllipsoid(.91,.61,.15,24,48)),torso:mesh(gl,uvEllipsoid(.695,.79,.53,36,60)),torsoGold:mesh(gl,uvEllipsoid(.742,.81,.548,36,60)),neck:mesh(gl,uvEllipsoid(.43,.20,.39,20,48)),armGold:mesh(gl,uvEllipsoid(.295,.56,.30,32,48)),arm:mesh(gl,uvEllipsoid(.26,.52,.295,32,48)),armInset:mesh(gl,uvEllipsoid(.22,.455,.306,24,44)),screen:mesh(gl,screenSurface()),ringOuter:mesh(gl,torus(.245,.032)),ringInner:mesh(gl,torus(.182,.031)),core:mesh(gl,uvEllipsoid(.17,.17,.055,26,46)),coreCenter:mesh(gl,uvEllipsoid(.105,.105,.07,26,46))};
 this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1024,640,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
 gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);this.resize();
 }
 resize(){const b=this.canvas.getBoundingClientRect();if(b.width<1||b.height<1)return;const d=Math.min(this.quality,window.devicePixelRatio||1.6);const w=Math.max(1,Math.round(b.width*d)),h=Math.max(1,Math.round(b.height*d));if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}}
 draw(pose,behavior,time,options={}){const gl=this.gl;this.resize();this.drawCalls=0;const w=this.canvas.width,h=this.canvas.height;gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.prog);
  const angle=this.yaw,tilt=this.pitch,scale=1/this.zoom;
  const camera=mul(perspective(Math.PI/4.5,w/h,.1,100),tr(0,-.05,-6.7*scale*(w/h<.75?1.13:1)));
  gl.uniformMatrix4fv(this.unis.vp,false,camera);gl.uniform3f(this.unis.eye,0,0,6.7);
  const stage=mul(ry(angle),rx(tilt));const body=mul(stage,mul(tr(0,pose.hover+pose.lean,0),rz(pose.torsoRoll)));
  const torso=mul(body,tr(0,-.71,0));const head=mul(body,mul(tr(0,.77,0),mul(ry(pose.headYaw),mul(rx(pose.headPitch),rz(pose.headRoll)))));
  const left=mul(body,mul(tr(-.73,-.37,.06),mul(rz(pose.leftArm),rx(pose.leftPitch))));const right=mul(body,mul(tr(.73,-.37,.06),mul(rz(pose.rightArm),rx(pose.rightPitch))));
  const draw=(id,model,color,gloss=.7,glow=0,screen=false)=>{const sh=this.shape[id];gl.bindVertexArray(sh.vao);gl.uniformMatrix4fv(this.unis.world,false,model);gl.uniform4fv(this.unis.color,rgba(color));gl.uniform1f(this.unis.gloss,gloss);gl.uniform1f(this.unis.glow,glow);gl.uniform1i(this.unis.screen,screen?1:0);if(screen){gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);}gl.drawElements(gl.TRIANGLES,sh.count,gl.UNSIGNED_SHORT,0);this.drawCalls++;};
  // Exactly four articulated root pieces: torso, head, left arm, right arm. Details are attached surfaces.
  draw('torsoGold',mul(torso,tr(0,0,-.14)),COL.gold,.92);draw('torso',mul(torso,tr(0,0,.04)),COL.armor,.87);
  draw('neck',mul(body,tr(0,-.025,0)),COL.gold,.91);
  draw('armGold',mul(left,tr(0,-.26,-.09)),COL.gold,.91);
  draw('arm',mul(left,tr(0,-.255,.03)),COL.armor,.89);
  draw('armInset',mul(left,tr(0,-.25,.045)),COL.black,.87);
  draw('armGold',mul(right,tr(0,-.26,-.09)),COL.gold,.91);
  draw('arm',mul(right,tr(0,-.255,.03)),COL.armor,.89);
  draw('armInset',mul(right,tr(0,-.25,.045)),COL.black,.87);
  draw('headGold',mul(head,tr(0,0,-.17)),COL.gold,.93);draw('head',mul(head,tr(0,-.018,.035)),COL.black,.95);
  // Dynamic screen follows the curved head surface; no detached front plate.
  if(time-this.lastFace>=1/30||this.lastFace===0){this.renderFace(behavior,pose,time,options);this.lastFace=time;}
  draw('screen',head,COL.panel,.2,0,true);
  draw('ringOuter',mul(torso,tr(0,.15,.640)),COL.gold,.92);
  draw('ringInner',mul(torso,tr(0,.15,.670)),COL.blue,.42,.65);
  draw('core',mul(torso,tr(0,.15,.680)),COL.inner,.5,.42+pose.core*.23);
  draw('coreCenter',mul(torso,tr(0,.15,.710)),COL.blue,.4,.4+pose.core*.65);
  gl.bindVertexArray(null);
 }
 renderFace(behavior,pose,time,options){const ctx=this.ctx,W=1024,H=640;ctx.clearRect(0,0,W,H);const mode=options.faceOverride||({scan:'scan',success:'success',celebrate:'success',caution:'caution',error:'error',sleep:'sleep'}[behavior]||'eyes');
  const ink=mode==='caution'?'#ffd36b':mode==='error'?'#ff6373':mode==='success'?'#67f0a4':'#8defff';
  const panel=ctx.createRadialGradient(500,210,50,500,360,540);panel.addColorStop(0,'#0a1a30');panel.addColorStop(.65,'#020916');panel.addColorStop(1,'#000307');ctx.save();capRound(ctx,10,10,W-20,H-20,260);ctx.clip();ctx.fillStyle=panel;ctx.fillRect(0,0,W,H);
  // Ultra-subtle screen reflection, deliberately no distracting simulated UI chrome.
  const sh=ctx.createLinearGradient(0,20,W,H);sh.addColorStop(0,'rgba(130,200,255,.045)');sh.addColorStop(.45,'rgba(130,200,255,0)');sh.addColorStop(1,'rgba(110,150,255,.018)');ctx.fillStyle=sh;ctx.fillRect(0,0,W,H);
  const stroke=(f,width=28,glow=26)=>{ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=ink;ctx.lineWidth=width;ctx.shadowBlur=glow;ctx.shadowColor=ink;f();ctx.stroke();ctx.restore();};
  const gaze=(pose.gazeX||0)*100,bob=(pose.gazeY||0)*70;
  const drawEye=(x,eyeMood='smile')=>{
    const xx=x+gaze,yy=319+bob;
    if(eyeMood==='sleep'){stroke(()=>{ctx.beginPath();ctx.moveTo(xx-85,yy+12);ctx.quadraticCurveTo(xx,yy+45,xx+82,yy+12);},21,9);return;}
    if(eyeMood==='focus'){stroke(()=>{ctx.beginPath();ctx.moveTo(xx-73,yy+4);ctx.quadraticCurveTo(xx,yy-25,xx+72,yy+3);},23,14);return;}
    if(eyeMood==='curious'){stroke(()=>{ctx.beginPath();ctx.arc(xx,yy,54,Math.PI*.12,Math.PI*.88,true);},25,24);return;}
    const amp=(behavior==='listen'?11:behavior==='speak'?10*Math.sin(time*8):0);
    stroke(()=>{ctx.beginPath();ctx.moveTo(xx-83,yy+33);ctx.bezierCurveTo(xx-76,yy-100-amp,xx+68,yy-98-amp,xx+82,yy+34);},28,27);
  };
  if(mode==='eyes'||mode==='sleep'||mode==='focus'||mode==='curious'){
   let mood=mode==='sleep'?'sleep':(mode==='focus'||behavior==='think'||behavior==='review'?'focus':(behavior==='curious'?'curious':'smile'));
   const blink=mode!=='sleep'&&Math.pow(Math.max(0,Math.sin(time*1.17+.3)),42)>.80;
   if(blink)mood='sleep';
   drawEye(304,mood);drawEye(717,mood);
   if(behavior==='think'){ctx.save();ctx.fillStyle='#39caf1';for(let i=0;i<3;i++){ctx.globalAlpha=.35+.4*(.5+.5*Math.sin(time*2+i));ctx.beginPath();ctx.arc(485+i*24,508,4+i*1.5,0,TAU);ctx.fill();}ctx.restore();}
   if(behavior==='speak'){stroke(()=>{ctx.beginPath();ctx.moveTo(465,514);ctx.quadraticCurveTo(512,526+14*Math.sin(time*9),563,512);},8,13);}
  }else if(mode==='scan'){
    drawEye(304,'focus');drawEye(717,'focus');const xpos=110+((time*165)%800);const g=ctx.createLinearGradient(xpos-80,0,xpos+36,0);g.addColorStop(0,'rgba(30,230,255,0)');g.addColorStop(.6,'rgba(30,230,255,.13)');g.addColorStop(1,'rgba(100,240,255,.8)');ctx.fillStyle=g;ctx.fillRect(xpos-80,130,120,365);ctx.strokeStyle='rgba(83,234,255,.5)';ctx.lineWidth=5;ctx.strokeRect(133,115,756,418);ctx.font='600 23px ui-monospace,monospace';ctx.textAlign='center';ctx.fillStyle='rgba(100,240,255,.75)';ctx.fillText('SCANNING',512,560);
  }else if(mode==='caution'){
    ctx.save();ctx.lineJoin='round';ctx.lineWidth=29;ctx.strokeStyle=ink;ctx.fillStyle='rgba(255,197,80,.08)';ctx.shadowColor=ink;ctx.shadowBlur=28;ctx.beginPath();ctx.moveTo(512,153);ctx.lineTo(770,506);ctx.lineTo(254,506);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();ctx.lineCap='round';stroke(()=>{ctx.beginPath();ctx.moveTo(512,282);ctx.lineTo(512,391);},26,15);ctx.fillStyle=ink;ctx.beginPath();ctx.arc(512,447,15,0,TAU);ctx.fill();
  }else if(mode==='success'){
    ctx.save();ctx.strokeStyle=ink;ctx.lineWidth=35;ctx.shadowColor=ink;ctx.shadowBlur=28;ctx.beginPath();ctx.arc(512,326,194,0,TAU);ctx.stroke();ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=44;ctx.beginPath();ctx.moveTo(398,326);ctx.lineTo(482,406);ctx.lineTo(634,242);ctx.stroke();ctx.restore();
  }else if(mode==='error'){
    ctx.save();ctx.lineWidth=33;ctx.strokeStyle=ink;ctx.shadowColor=ink;ctx.shadowBlur=24;ctx.beginPath();ctx.arc(512,326,184,0,TAU);ctx.stroke();ctx.lineWidth=42;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(512,220);ctx.lineTo(512,374);ctx.stroke();ctx.fillStyle=ink;ctx.beginPath();ctx.arc(512,430,23,0,TAU);ctx.fill();ctx.restore();
  }
  ctx.restore();const gl=this.gl;gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,this.texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gl.RGBA,gl.UNSIGNED_BYTE,this.face);
 }
 capture(){return this.canvas.toDataURL('image/png');}
 dispose(){ /* Renderer remains alive for the studio session; browser context disposal handles GPU cleanup. */ }
}
