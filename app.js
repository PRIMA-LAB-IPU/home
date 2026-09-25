'use strict';
const canvas=document.querySelector('#cloud'),rotation=document.querySelector('#rotation');
let angle=25,spinning=false;
window.heroLab=(()=>{
 let selected=0,pitch=.18,drag=null,frameId=0,lastTime=0;
 const lang=()=>document.documentElement.lang==='en'?1:0,txt=(a,b)=>lang()?b:a;
 const positions=PRIMA_PROJECTS.map((_,i)=>{const a=i/5*Math.PI*2;return[Math.cos(a)*1.28,Math.sin(a)*.78,i%2===0?.45:-.45]});
 const models=PRIMA_PROJECTS.map(p=>Lab3D.model(p.id,65));
 const globe=Lab3D.geom();for(let j=1;j<19;j++)for(let i=0;i<38;i++){const p=j/19*Math.PI,a=i/38*Math.PI*2;Lab3D.dot(globe,[Math.sin(p)*Math.cos(a)*1.12,Math.cos(p)*1.12,Math.sin(p)*Math.sin(a)*1.12],'#426571',.9)}
 function draw(){const {ctx,w,h}=Lab3D.surface(canvas),project=Lab3D.projector(w,h,angle*Math.PI/180,pitch,Math.min(w/4.8,h/3.5));Lab3D.paint(ctx,globe,project);
  const order=positions.map((p,i)=>({p,i,z:project(p).z})).sort((a,b)=>a.z-b.z);
  for(const {p,i} of order){Lab3D.paint(ctx,models[i],project,v=>v.map((x,k)=>x*.4+p[k]),i===selected?1:.55);const s=project(p);const b=document.querySelector(`[data-orbit="${i}"]`);if(b){const anchors=[[.81,.42],[.5,.07],[.19,.36],[.2,.87],[.78,.86]],bw=b.offsetWidth||90,bh=b.offsetHeight||30,x=Math.max(bw/2+6,Math.min(w-bw/2-6,w*anchors[i][0])),y=h*anchors[i][1];b.style.left=`${x}px`;b.style.top=`${y}px`;b.style.zIndex=String(i===selected?20:10);b.classList.toggle('selected',i===selected);ctx.strokeStyle=i===selected?'#d6ff6880':'#74a6bc40';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(x,y+(s.y>y?bh/2:-bh/2));ctx.stroke();}}
  const view=Math.floor(((angle%360)+360)%360/120),p=PRIMA_PROJECTS[selected];document.querySelector('#view-label').textContent=[txt('技術の視点','TECHNOLOGY'),txt('社会の視点','SOCIETY'),txt('つくる視点','MAKING')][view];document.querySelector('#view-meaning').textContent=p.views[view][lang()];document.querySelector('#view-project').textContent=p.label[lang()];
 }
 function controls(){document.querySelector('#orbit-labels').innerHTML=PRIMA_PROJECTS.map((p,i)=>`<button data-orbit="${i}" aria-label="${p.label[lang()]}" aria-pressed="${i===selected}">${String(i+1).padStart(2,'0')} ${p.label[lang()]}</button>`).join('');document.querySelectorAll('[data-orbit]').forEach(b=>b.onclick=()=>{selected=+b.dataset.orbit;document.querySelectorAll('[data-orbit]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw()});document.querySelector('#explore-current').onclick=()=>{window.selectResearch?.(selected);document.querySelector('#research').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})};draw();}
 function sync(){document.querySelector('#motion').setAttribute('aria-pressed',String(spinning));document.querySelector('#motion').textContent=spinning?txt('回転を停止','Pause'):txt('自動回転','Auto rotate')}
 function stop(){spinning=false;cancelAnimationFrame(frameId);sync()}
 function frame(time){if(!spinning)return;angle=(angle+Math.min(40,time-lastTime)*.008)%360;lastTime=time;rotation.value=Math.round(angle);draw();frameId=requestAnimationFrame(frame)}
 document.querySelectorAll('[data-perspective]').forEach(b=>b.onclick=()=>{stop();angle=+b.dataset.perspective;rotation.value=angle;draw()});
 rotation.addEventListener('input',()=>{stop();angle=+rotation.value;draw()});document.querySelector('#motion').onclick=()=>{if(spinning)stop();else{spinning=true;sync();lastTime=performance.now();frameId=requestAnimationFrame(frame)}};
 canvas.addEventListener('pointerdown',e=>{stop();drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;angle=(angle+(e.clientX-drag[0])*.6+360)%360;pitch=Math.max(-.75,Math.min(.75,pitch+(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY];rotation.value=Math.round(angle);draw()});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>canvas.addEventListener(ev,()=>drag=null));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});new ResizeObserver(draw).observe(canvas);
 document.addEventListener('prima-language',()=>{controls();sync()});controls();return{draw,stop};
})();
