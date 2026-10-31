/* Orbit four-part, image-projected 3D renderer. No CDN dependency.
   Its reference texture is the original artwork, never a recreated face/paint texture. */
const TAU=Math.PI*2;
const ID=()=>new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);
function mul(a,b){const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let v=0;for(let k=0;k<4;k++)v+=a[k*4+r]*b[c*4+k];o[c*4+r]=v;}return o;}
function tr(x=0,y=0,z=0){let m=ID();m[12]=x;m[13]=y;m[14]=z;return m;}
function rx(t){const c=Math.cos(t),s=Math.sin(t);return new Float32Array([1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]);}
function ry(t){const c=Math.cos(t),s=Math.sin(t);return new Float32Array([c,0,-s,0,0,1,0,0,s,0,c,0,0,0,0,1]);}
function rz(t){const c=Math.cos(t),s=Math.sin(t);return new Float32Array([c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]);}
function scale(x=1,y=1,z=1){const m=ID();m[0]=x;m[5]=y;m[10]=z;return m;}
function ortho(l,r,b,t,n,f){const o=ID();o[0]=2/(r-l);o[5]=2/(t-b);o[10]=-2/(f-n);o[12]=-(r+l)/(r-l);o[13]=-(t+b)/(t-b);o[14]=-(f+n)/(f-n);return o;}
function compile(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;}
const VS=`#version 300 es
precision highp float;
layout(location=0) in vec3 aPosition;layout(location=1) in vec3 aNormal;layout(location=2) in vec2 aUv;
uniform mat4 uWorld;uniform mat4 uViewProjection;out vec3 vNorm;out vec3 vWorld;out vec2 vUv;
void main(){vec4 p=uWorld*vec4(aPosition,1.);gl_Position=uViewProjection*p;vWorld=p.xyz;vNorm=mat3(uWorld)*aNormal;vUv=aUv;}`;
const FS=`#version 300 es
precision highp float;
in vec3 vNorm;in vec3 vWorld;in vec2 vUv;out vec4 outColor;
uniform sampler2D uTex;uniform int uType;uniform vec3 uCamera;
void main(){
 if(uType!=0){vec4 src=texture(uTex,vUv);if(src.a<.07)discard;outColor=src;return;}
 vec3 n=normalize(vNorm);vec3 v=normalize(uCamera-vWorld);float light=.27+.52*max(0.,dot(n,normalize(vec3(-.45,.8,1.15))))+.18*max(0.,dot(n,normalize(vec3(.9,-.1,.5))));
 float glint=pow(max(0.,dot(n,normalize(v+normalize(vec3(-.6,.9,1.3))))),72.);
 float edge=pow(1.-max(0.,dot(n,v)),3.2);
 vec3 navy=vec3(.070,.125,.220)*light;vec3 warm=vec3(.92,.54,.19)*(glint*.42+edge*.18);
 vec3 cool=vec3(.22,.52,.78)*pow(max(0.,dot(n,normalize(v+normalize(vec3(.7,.1,.85))))),95.)*.28;
 outColor=vec4(navy+warm+cool,1.);
}`;
function createProgram(gl){const p=gl.createProgram();gl.attachShader(p,compile(gl,gl.VERTEX_SHADER,VS));gl.attachShader(p,compile(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(p));return p;}
function createMesh(gl,vertices,indices){const vao=gl.createVertexArray();gl.bindVertexArray(vao);const vb=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vb);gl.bufferData(gl.ARRAY_BUFFER,vertices,gl.STATIC_DRAW);for(const [index,size,off] of [[0,3,0],[1,3,12],[2,2,24]]){gl.enableVertexAttribArray(index);gl.vertexAttribPointer(index,size,gl.FLOAT,false,32,off);}const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,indices,gl.STATIC_DRAW);gl.bindVertexArray(null);return {vao,count:indices.length};}
function image(url){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('Texture failed: '+url));im.src=url;});}
function uploadTexture(gl,source,filter){const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,filter?gl.LINEAR:gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,filter?gl.LINEAR:gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);return tex;}
function faceCanvas(){const canvas=document.createElement('canvas');canvas.width=700;canvas.height=560;return canvas;}
function faceTexture(ctx,state,t){const c=ctx.canvas,w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.save();ctx.beginPath();ctx.ellipse(w/2,h/2,w*.49,h*.48,0,0,TAU);ctx.clip();const bg=ctx.createRadialGradient(w/2,h/3,2,w/2,h/2,w*.57);bg.addColorStop(0,'#10253f');bg.addColorStop(.55,'#020b19');bg.addColorStop(1,'#01040d');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);const col=state==='caution'?'#ffd35f':state==='success'?'#67f2aa':state==='error'?'#ff677a':'#a0f8ff';ctx.strokeStyle=col;ctx.fillStyle=col;ctx.shadowColor=col;ctx.shadowBlur=28;ctx.lineWidth=24;ctx.lineCap='round';ctx.lineJoin='round';
 if(state==='caution'){ctx.beginPath();ctx.moveTo(350,92);ctx.lineTo(565,460);ctx.lineTo(135,460);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.moveTo(350,205);ctx.lineTo(350,355);ctx.stroke();ctx.beginPath();ctx.arc(350,410,13,0,TAU);ctx.fill();}
 else if(state==='success'){ctx.beginPath();ctx.arc(350,280,165,0,TAU);ctx.stroke();ctx.lineWidth=38;ctx.beginPath();ctx.moveTo(255,290);ctx.lineTo(330,365);ctx.lineTo(463,220);ctx.stroke();}
 else if(state==='error'){ctx.beginPath();ctx.arc(350,280,165,0,TAU);ctx.stroke();ctx.lineWidth=34;ctx.beginPath();ctx.moveTo(350,185);ctx.lineTo(350,335);ctx.stroke();ctx.beginPath();ctx.arc(350,400,16,0,TAU);ctx.fill();}
 else if(state==='scan'){const x=(t*145)%700;ctx.strokeStyle='#66f0ff';ctx.strokeRect(90,130,520,300);ctx.fillStyle='#5bf4ff';ctx.globalAlpha=.25;ctx.fillRect(x,130,14,300);ctx.globalAlpha=1;ctx.font='500 22px monospace';ctx.textAlign='center';ctx.fillText('SCANNING',350,474);}
 else {for(const cx of [225,475]){ctx.beginPath();ctx.moveTo(cx-65,337);ctx.bezierCurveTo(cx-55,220,cx+60,220,cx+67,336);ctx.stroke();}}
 ctx.restore();return c;}
function makeFaceMesh(gl){const P=[],N=[],UV=[],inds=[];const nx=36,ny=26;
 for(let iy=0;iy<=ny;iy++)for(let ix=0;ix<=nx;ix++){
  const u=ix/nx,v=iy/ny;const px=342+u*570,py=230+v*425;const x=(px-627)/335,y=(690-py)/335;
  const z=.88-.08*((u-.5)**2+(v-.5)**2);P.push(x,y,z);N.push(0,0,1);UV.push(u,1-v);
 }
 for(let iy=0;iy<ny;iy++)for(let ix=0;ix<nx;ix++){let a=iy*(nx+1)+ix,b=a+nx+1;inds.push(a,b,a+1,a+1,b,b+1);}
 const vertices=new Float32Array(P.length/3*8);for(let i=0;i<P.length/3;i++){vertices.set(P.slice(i*3,i*3+3),i*8);vertices.set(N.slice(i*3,i*3+3),i*8+3);vertices.set(UV.slice(i*2,i*2+2),i*8+6);}return createMesh(gl,vertices,new Uint32Array(inds));}
export class OrbitProjectedRenderer{
 constructor(canvas){this.canvas=canvas;this.gl=canvas.getContext('webgl2',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});if(!this.gl)throw Error('WebGL2 not available on this device');const gl=this.gl;this.program=createProgram(gl);gl.useProgram(this.program);this.uni={world:gl.getUniformLocation(this.program,'uWorld'),vp:gl.getUniformLocation(this.program,'uViewProjection'),type:gl.getUniformLocation(this.program,'uType'),eye:gl.getUniformLocation(this.program,'uCamera'),tex:gl.getUniformLocation(this.program,'uTex')};gl.uniform1i(this.uni.tex,0);gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.disable(gl.CULL_FACE);this.yaw=0;this.pitch=0;this.zoom=1;this.quality=2;this.ready=false;this.objects=[];this.face=faceCanvas();this.faceCtx=this.face.getContext('2d');this.faceGeometry=makeFaceMesh(gl);this.faceGPU=uploadTexture(gl,this.face,true);this.lastFace=-1;this.fps=0;}
 async init(){const [res,buffer,images]=await Promise.all([fetch('./assets/Orbit_WebMeshes.json').then(r=>{if(!r.ok)throw Error('Mesh manifest missing');return r.json()}),fetch('./assets/Orbit_WebMeshes.bin').then(r=>{if(!r.ok)throw Error('Mesh buffer missing');return r.arrayBuffer()}),Promise.all(['Head','Torso','LeftArm','RightArm'].map(async name=>[name,await image('./assets/'+name+'_front.png')]))]);this.parts=res.roots;const gl=this.gl;this.textures={};for(const [name,img] of images)this.textures[name]=uploadTexture(gl,img,true);for(const m of res.meshEntries){const f32=new Float32Array(buffer.slice(m.vertOffset,m.vertOffset+m.vertCount*32)),u32=new Uint32Array(buffer.slice(m.indexOffset,m.indexOffset+m.indexCount*4));const g=createMesh(gl,f32,u32);this.objects.push({...m,...g});}this.ready=true;this.resize();}
 resize(){const rc=this.canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,this.quality);const w=Math.max(1,Math.round(rc.width*d)),h=Math.max(1,Math.round(rc.height*d));if(this.canvas.width!==w||this.canvas.height!==h){this.canvas.width=w;this.canvas.height=h;this.gl.viewport(0,0,w,h);}}
 draw(pose,mode,time){if(!this.ready)return;const gl=this.gl;this.resize();gl.viewport(0,0,this.canvas.width,this.canvas.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);const asp=this.canvas.width/this.canvas.height;const span=4.10/this.zoom;const projection=ortho(-span*asp/2,span*asp/2,-span/2,span/2,.1,100);const pv=mul(projection,tr(0,0,-8));gl.uniformMatrix4fv(this.uni.vp,false,pv);gl.uniform3f(this.uni.eye,0,0,8);const stage=mul(ry(this.yaw),rx(this.pitch));const torso=mul(stage,mul(tr(0,pose.hover+pose.lean,0),rz(pose.torsoRoll)));const transforms={};const root=p=>this.parts[p].origin;
 const torsoRoot=root('Torso');
 transforms.Torso=mul(torso,tr(...torsoRoot));
 const hr=root('Head');transforms.Head=mul(torso,mul(tr(...hr),mul(ry(pose.headYaw),mul(rx(pose.headPitch),rz(pose.headRoll)))));
 const ll=root('LeftArm');transforms.LeftArm=mul(torso,mul(tr(...ll),mul(rz(pose.leftArm),rx(pose.leftPitch))));
 const rr=root('RightArm');transforms.RightArm=mul(torso,mul(tr(...rr),mul(rz(pose.rightArm),rx(pose.rightPitch))));
 gl.activeTexture(gl.TEXTURE0);for(const o of this.objects){gl.uniformMatrix4fv(this.uni.world,false,transforms[o.part]);gl.uniform1i(this.uni.type,o.kind==='reference'?1:0);gl.bindTexture(gl.TEXTURE_2D,this.textures[o.part]);gl.bindVertexArray(o.vao);gl.drawElements(gl.TRIANGLES,o.count,gl.UNSIGNED_INT,0);}
 if(['caution','success','error','scan'].includes(mode)){
  if(time-this.lastFace>.03||this.lastFace<0){faceTexture(this.faceCtx,mode,time);gl.bindTexture(gl.TEXTURE_2D,this.faceGPU);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,gl.RGBA,gl.UNSIGNED_BYTE,this.face);this.lastFace=time;}
  gl.uniform1i(this.uni.type,2);gl.uniformMatrix4fv(this.uni.world,false,transforms.Head);gl.bindTexture(gl.TEXTURE_2D,this.faceGPU);gl.bindVertexArray(this.faceGeometry.vao);gl.drawElements(gl.TRIANGLES,this.faceGeometry.count,gl.UNSIGNED_INT,0);
 }
 gl.bindVertexArray(null);
 }
 snapshot(){return this.canvas.toDataURL('image/png');}
}
