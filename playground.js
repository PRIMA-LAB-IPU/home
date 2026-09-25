'use strict';
function mountPlayground(host,project,language){
 const en=language==='en',idx=en?1:0,T=(a,b)=>en?b:a;
 const captions={ultrasound:['断面再構成を模した概念モデル。実際の超音波データではありません。','A conceptual reconstruction model, not actual ultrasound data.'],wifi:['模擬の信号と骨格による概念体験。実際のWi-Fi計測・DensePose推論ではありません。','Synthetic signals and a skeleton model, not real Wi-Fi measurements or DensePose inference.'],tree:['単純化した枝分かれのモデル。実際の木の成長予測ではありません。','A simplified branching model, not a prediction of real tree growth.'],drawing:['模擬図面を使った処理の概念体験。実際のScanMapのAI処理ではありません。','A synthetic drawing demonstration, not ScanMap AI processing.'],infra:['抽象化した橋と見学ルートの例。実在する施設の再現ではありません。','An abstract bridge and tour route, not a reconstruction of an actual facility.']};
 let value=25,alt=false,yaw=-.45,pitch=.2,drag=null,disposed=false;
 host.innerHTML=`<div class="playground"><div class="playground-top"><span>PLAY / ${project.id.toUpperCase()}</span><span>${T('模擬データ','SYNTHETIC DATA')}</span></div><canvas class="demo-canvas" aria-label="${project.label[idx]} ${T('の3D概念モデル。下の操作部で変更できます。','3D concept model. Use the controls below.')}" role="img"></canvas><div class="demo-hint">${T('ドラッグで回転 · 下のボタンでも視点を変更','Drag to rotate · or use the view buttons below')}</div><div class="view-presets" role="group" aria-label="${T('モデルの視点','Model viewpoint')}"><button data-view="front">${T('正面','Front')}</button><button data-view="side">${T('横','Side')}</button><button data-view="under">${T('下から','Below')}</button><button data-view="reset">${T('リセット','Reset')}</button></div><div class="demo-controls"><label for="demo-value">${project.control[idx]}<output id="demo-readout" for="demo-value"></output></label><input id="demo-value" type="range" min="0" max="100" value="25"><label class="demo-toggle"><input id="demo-toggle" type="checkbox">${project.toggle[idx]}</label></div></div><div class="demo-result" aria-live="polite"><span id="demo-status"></span><p id="demo-insight"></p></div><p class="caption">${captions[project.id][idx]}</p>`;
 const canvas=host.querySelector('canvas'),slider=host.querySelector('#demo-value'),toggle=host.querySelector('#demo-toggle');
 function render(){if(disposed)return;const {ctx,w,h}=Lab3D.surface(canvas);const project3=Lab3D.projector(w,h,yaw,pitch,Math.min(w/3.8,h/3.15));
 const g=Lab3D.model(project.id,value,alt);if(project.id==='ultrasound'&&alt)g.lines.forEach(l=>{if(l.color===Lab3D.C.blue)l.width=2.5});
 const grid=Lab3D.geom();for(let i=-5;i<=5;i++){Lab3D.line(grid,[-1.25,-1.1,i*.25],[1.25,-1.1,i*.25],'#243c4c',.6);Lab3D.line(grid,[i*.25,-1.1,-1.25],[i*.25,-1.1,1.25],'#243c4c',.6)}Lab3D.paint(ctx,grid,project3);Lab3D.paint(ctx,g,project3);
 let label,done;
 if(project.id==='ultrasound'){const n=Math.round(1+value/100*17);label=T(`${n} 枚`,`${n} slices`);done=n>=12&&Math.abs(yaw)>1;}
 if(project.id==='wifi'){label=`${value}%`;done=value>=50&&alt;}
 if(project.id==='tree'){label=T(`段階 ${(1+value/25).toFixed(1)}`,`Stage ${(1+value/25).toFixed(1)}`);done=value>=65&&alt;}
 if(project.id==='drawing'){const kept=Array.from({length:100},(_,i)=>(i*37%101)/100).filter(x=>x>=value/100*.92).length;label=T(`背景点 ${kept} / 100`,`Background ${kept} / 100`);done=value>=70&&alt;}
 if(project.id==='infra'){label=[T('入口','Entrance'),T('構造を観察','Inspect structure'),T('地域を眺める','Look at the landscape')][Math.min(2,Math.floor(value/34))];done=value>=90&&pitch<-.25;}
 host.querySelector('#demo-readout').textContent=label;
 host.querySelector('#demo-status').textContent=done?T('発見！次は条件を変えてみよう。','Discovery! Now try different conditions.'):T('小さな実験を、ここから。','Start a small experiment.');
 host.querySelector('.demo-result').classList.toggle('achieved',done);host.querySelector('#demo-insight').textContent=project.insight[idx];
 }
 slider.addEventListener('input',()=>{value=+slider.value;render()});toggle.addEventListener('change',()=>{alt=toggle.checked;render()});
 host.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{switch(b.dataset.view){case'front':yaw=0;pitch=0;break;case'side':yaw=1.3;pitch=.1;break;case'under':yaw=.55;pitch=-.5;break;default:yaw=-.45;pitch=.2;value=25;alt=false;slider.value=25;toggle.checked=false;}render()});
 canvas.addEventListener('pointerdown',e=>{drag=[e.clientX,e.clientY];canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-drag[0])*.008;pitch=Math.max(-1,Math.min(1,pitch+(e.clientY-drag[1])*.008));drag=[e.clientX,e.clientY];render()});['pointerup','pointercancel','lostpointercapture'].forEach(ev=>canvas.addEventListener(ev,()=>drag=null));
 const observer=new ResizeObserver(render);observer.observe(canvas);render();return()=>{disposed=true;observer.disconnect()};
}
