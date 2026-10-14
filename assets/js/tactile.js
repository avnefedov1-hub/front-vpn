// Tactile: spring (k 300, c 22) tilt + spotlight on surfaces, .97 press on buttons, magnetic CTA. No-op under reduced motion.
(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,K=300,C=22;
const live=new Set();let raf=0;const sp=(x=0)=>({x,v:0,t:x});
const tick=()=>{raf=0;const dt=1/120;
 for(const o of live){let still=true;for(let n=0;n<2;n++)for(const k in o.s){const s=o.s[k];s.v+=(K*(s.t-s.x)-C*s.v)*dt;s.x+=s.v*dt}
  for(const k in o.s){const s=o.s[k];if(Math.abs(s.t-s.x)>1e-3||Math.abs(s.v)>1e-3)still=false}o.apply();if(still)live.delete(o)}
 if(live.size)raf=requestAnimationFrame(tick)};
const wake=o=>{live.add(o);if(!raf)raf=requestAnimationFrame(tick)};
const buzz=()=>{try{navigator.vibrate&&navigator.vibrate(8)}catch(e){}};
const rel=(el,e)=>{const r=el.getBoundingClientRect();return [(e.clientX-r.left)/r.width,(e.clientY-r.top)/r.height]};
function tilt(el,max=4,target=el){if(el._tac)return;el._tac=1;const o={s:{rx:sp(),ry:sp(),s:sp(1),sp:sp()}};let down=false;
 o.apply=()=>{const s=o.s;target.style.setProperty('--rx',s.rx.x.toFixed(3)+'deg');target.style.setProperty('--ry',s.ry.x.toFixed(3)+'deg');el.style.setProperty('--s',s.s.x.toFixed(4));el.style.setProperty('--sp',Math.max(0,s.sp.x).toFixed(3))};
 const move=e=>{if(e.pointerType!=='mouse'&&!down)return;const [x,y]=rel(el,e),s=o.s;el.style.setProperty('--mx',(x*100).toFixed(1)+'%');el.style.setProperty('--my',(y*100).toFixed(1)+'%');s.rx.t=-(y-.5)*2*max;s.ry.t=(x-.5)*2*max;s.sp.t=1;wake(o)};
 const leave=()=>{const s=o.s;down=false;s.rx.t=s.ry.t=s.sp.t=0;s.s.t=1;wake(o)};
 el.addEventListener('pointermove',move,{passive:true});
 el.addEventListener('pointerdown',e=>{if(e.target.closest('.btn,a,button,input'))return;down=true;o.s.s.t=.985;move(e);wake(o)},{passive:true});
 el.addEventListener('pointerup',e=>{o.s.s.t=1;o.s.s.v+=1;wake(o);if(e.pointerType!=='mouse')setTimeout(leave,350)},{passive:true});
 el.addEventListener('pointercancel',leave,{passive:true});el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')leave()},{passive:true})}
function press(el){if(el._pr)return;el._pr=1;const o={s:{s:sp(1)}};o.apply=()=>el.style.setProperty('--s',o.s.s.x.toFixed(4));
 el.addEventListener('pointerdown',()=>{o.s.s.t=.97;buzz();wake(o)},{passive:true});const up=()=>{o.s.s.t=1;o.s.s.v+=1;wake(o)};['pointerup','pointercancel','pointerleave'].forEach(n=>el.addEventListener(n,up,{passive:true}))}
function mag(el){if(el._mg)return;el._mg=1;const o={s:{tx:sp(),ty:sp()}};o.apply=()=>{el.style.setProperty('--tx',o.s.tx.x.toFixed(2)+'px');el.style.setProperty('--ty',o.s.ty.x.toFixed(2)+'px')};
 el.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const [x,y]=rel(el,e);o.s.tx.t=(x-.5)*16;o.s.ty.t=(y-.5)*10;wake(o)},{passive:true});
 el.addEventListener('pointerleave',()=>{o.s.tx.t=o.s.ty.t=0;wake(o)},{passive:true})}
const bind=(root=document)=>{if(RM)return;root.querySelectorAll('.tac').forEach(t=>tilt(t,0));root.querySelectorAll('.btn').forEach(press);root.querySelectorAll('.mag').forEach(mag)};
window.Tac={bind};bind();
// hero live moment: the headline surface leans toward the pointer with a sheen (poster = static headline)
const h=document.querySelector('.surf');if(h&&!RM)tilt(h,3,h.querySelector('.surf-in'));
})();
