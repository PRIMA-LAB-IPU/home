'use strict';
// Small deterministic 3D geometry engine. All demos use synthetic concept data.
window.Lab3D=(()=>{
 const C={blue:'#55bdea',lime:'#d6ff68',white:'#dcecf4',dim:'#436271',pink:'#fd9ca9'};
 const mix=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
 const geom=()=>({lines:[],dots:[],faces:[]});
 function line(g,a,b,color=C.blue,width=1.5){g.lines.push({a,b,color,width});}
 function dot(g,p,color=C.lime,r=3){g.dots.push({p,color,r});}
 function box(g,x,y,z,w,h,d,color=C.blue){const p=[[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]].map(a=>[x+a[0]*w/2,y+a[1]*h/2,z+a[2]*d/2]);[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]].forEach(([a,b])=>line(g,p[a],p[b],color));}
 function ring(g,center,r,plane='xy',color=C.blue){for(let i=0;i<48;i++){const p=t=>plane==='xy'?[center[0]+r*Math.cos(t),center[1]+r*Math.sin(t),center[2]]:[center[0]+r*Math.cos(t),center[1],center[2]+r*Math.sin(t)];line(g,p(i/48*Math.PI*2),p((i+1)/48*Math.PI*2),color,1)}}
 function model(kind,value=50,alt=false){const g=geom(),q=value/100;
  if(kind==='ultrasound'){
   box(g,0,0,0,1.3,1.55,1.4,C.dim);
   const n=Math.max(1,Math.round(1+q*17));
   for(let j=0;j<n;j++){const z=-.68+j/17*1.36,s=Math.sqrt(Math.max(.04,1-(z/.8)**2));
    const p=[[-.65,-.77,z],[.65,-.77,z],[.65,.77,z],[-.65,.77,z]];
    g.faces.push({p,color:j===n-1?'#67d7ff20':'#65c9ea08'});
    for(let i=0;i<32;i++){const a=i/32*2*Math.PI,b=(i+1)/32*2*Math.PI;line(g,[.43*s*Math.cos(a),.6*s*Math.sin(a),z],[.43*s*Math.cos(b),.6*s*Math.sin(b),z],j===n-1?C.lime:C.blue,j===n-1?2:1)}
   }box(g,0,.94,-.68+(n-1)/17*1.36,.5,.22,.16,C.lime);
  }else if(kind==='wifi'){
   const a=q*Math.PI*2,elbow=[-.5,.22+Math.sin(a)*.3,.2*Math.cos(a)],hand=[-.75,.1+Math.sin(a)*.6,.3*Math.cos(a)];
   const p=[[0,.85,0],[0,.58,0],[0,.05,0],[-.3,.5,0],elbow,hand,[.3,.5,0],[.48,.15,0],[.5,-.08,.1],[-.2,-.25,0],[-.27,-.62,.14],[ -.34,-.95,0],[.2,-.25,0],[.25,-.6,-.1],[.38,-.95,0]];
   [[0,1],[1,2],[1,3],[3,4],[4,5],[1,6],[6,7],[7,8],[2,9],[9,10],[10,11],[2,12],[12,13],[13,14]].forEach(([a,b])=>line(g,p[a],p[b],C.lime,3));p.forEach(v=>dot(g,v,C.white,3));ring(g,[0,.89,0],.14,'xy',C.lime);
   box(g,-1,-.6,0,.2,.3,.25);box(g,1,-.6,0,.2,.3,.25);
   for(let j=0;j<3;j++)for(let i=0;i<30;i++){const f=k=>[-.9+k/30*1.8,-.4+j*.32+Math.sin(k*.55+a+j)*.09,.35];line(g,f(i),f(i+1),C.blue,1)}
   if(alt)g.faces.push({p:[[-.65,-1,.45],[.65,-1,.45],[.65,1.1,.45],[-.65,1.1,.45]],color:'#b3c0ce33'});
  }else if(kind==='tree'){
   const depth=1+q*4;
   function branch(p,dir,len,level,seed){const fraction=Math.min(1,depth-level);if(fraction<=0)return;const end=p.map((x,i)=>x+dir[i]*len*fraction);line(g,p,end,level<2?'#b8d5ce':C.lime,Math.max(1,4-level));dot(g,end,C.lime,level>2?2:3);if(fraction<1||level>=4)return;for(let k=0;k<3;k++){const az=seed*2.4+k*2.094,lean=alt?.18:.55;const d=[dir[0]*.4+Math.cos(az)*lean,.6,dir[2]*.4+Math.sin(az)*lean];const norm=Math.hypot(...d);branch(end,d.map(x=>x/norm),len*.65,level+1,seed*3+k+1)}}branch([0,-1,0],[0,1,0],.85,0,1);ring(g,[0,-1,0],.75,'xz',C.dim);
  }else if(kind==='drawing'){
   const z=0;box(g,0,0,z,1.65,1.3,.035,C.white);[[-.65,-.5,.65,-.5],[.65,-.5,.65,.5],[.65,.5,-.65,.5],[-.65,.5,-.65,-.5],[-.2,-.5,-.2,.5],[-.2,0,.65,0],[.22,0,.22,.5]].forEach(([x,y,a,b])=>line(g,[x,y,z],[a,b,z],C.blue,2));
   for(let i=0;i<100;i++){const strength=(i*37%101)/100;if(strength>=q*.92){const x=((i*41%103)/103-.5)*1.55,y=((i*67%107)/107-.5)*1.2;dot(g,[x,y,.025],'#b6a884',1.5)}}
   if(alt){box(g,-.42,0,-.18,.5,1,.4,C.lime);box(g,.22,-.25,-.18,.85,.5,.4,C.lime)}
  }else if(kind==='infra'){
   box(g,0,0,0,2.2,.15,.65,C.blue);[-.7,.7].forEach(x=>{box(g,x,-.47,0,.16,.85,.45,C.dim);for(const z of [-.3,.3]){line(g,[x,0,z],[x,.8,z],C.white,2);line(g,[-1.1,0,z],[x,.8,z],C.lime);line(g,[x,.8,z],[1.1,0,z],C.lime)}});
   for(let i=0;i<9;i++)line(g,[-1.2,-.92,-.7+i*.18],[1.2,-.92,-.7+i*.18],C.dim,1);
   const x=-1+q*2;dot(g,[x,.14,.1],C.pink,7);line(g,[-1,.14,.1],[x,.14,.1],C.pink,2);
   if(alt)g.faces.push({p:[[-1.2,-.55,-.75],[1.2,-.55,-.75],[1.2,-.55,.75],[-1.2,-.55,.75]],color:'#55bdea28'});
  }return g;
 }
 function projector(w,h,yaw=0,pitch=.2,scale=1){return p=>{const x=p[0]*Math.cos(yaw)+p[2]*Math.sin(yaw),z=-p[0]*Math.sin(yaw)+p[2]*Math.cos(yaw),y=p[1]*Math.cos(pitch)-z*Math.sin(pitch),zz=p[1]*Math.sin(pitch)+z*Math.cos(pitch),pers=4.6/(4.6-zz);return{x:w/2+x*scale*pers,y:h/2-y*scale*pers,z:zz,s:pers}}}
 function paint(ctx,g,project,transform=p=>p,opacity=1){ctx.save();ctx.globalAlpha=opacity;const commands=[];g.faces.forEach(f=>{const pts=f.p.map(p=>project(transform(p)));commands.push({z:pts.reduce((s,p)=>s+p.z,0)/pts.length,draw:()=>{ctx.fillStyle=f.color;ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill()}})});g.lines.forEach(l=>{const a=project(transform(l.a)),b=project(transform(l.b));commands.push({z:(a.z+b.z)/2,draw:()=>{ctx.strokeStyle=l.color;ctx.lineWidth=l.width;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}})});g.dots.forEach(d=>{const p=project(transform(d.p));commands.push({z:p.z,draw:()=>{ctx.fillStyle=d.color;ctx.beginPath();ctx.arc(p.x,p.y,d.r*Math.max(.6,p.s),0,Math.PI*2);ctx.fill()}})});commands.sort((a,b)=>a.z-b.z).forEach(x=>x.draw());ctx.restore()}
 function surface(canvas){const rect=canvas.getBoundingClientRect(),d=Math.min(window.devicePixelRatio||1,2),w=rect.width,h=rect.height;if(canvas.width!==Math.round(w*d)||canvas.height!==Math.round(h*d)){canvas.width=Math.round(w*d);canvas.height=Math.round(h*d)}const ctx=canvas.getContext('2d');ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,w,h);return{ctx,w,h}}
 return{C,geom,line,dot,box,model,paint,projector,surface,mix};
})();
