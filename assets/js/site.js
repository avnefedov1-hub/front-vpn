(()=>{
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
// toast — one surface at a time
let tt;window.toast=m=>{let t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2200)};
addEventListener('error',e=>{if(e.target===window)toast('Что-то пошло не так — обновите страницу')});
addEventListener('unhandledrejection',()=>toast('Что-то пошло не так — обновите страницу'));

// header scroll-draw line
const hdr=$('.hdr');if(hdr){let q=0;const f=()=>{q=0;const m=document.documentElement.scrollHeight-innerHeight;hdr.style.setProperty('--sp',m>0?(scrollY/m).toFixed(4):0)};addEventListener('scroll',()=>{if(!q)q=requestAnimationFrame(f)},{passive:true});f()}

// index overlay (Sheet): Esc, focus trap, focus return
const sh=$('#sheet'),ob=$('#menu-open'),cb=$('#menu-close');
if(sh&&ob){const open=v=>{sh.classList.toggle('open',v);sh.setAttribute('aria-hidden',!v);ob.setAttribute('aria-expanded',v);document.body.style.overflow=v?'hidden':'';sh.inert=!v;
 if(v)setTimeout(()=>sh.querySelector('nav a').focus({preventScroll:true}),RM?0:250);else ob.focus({preventScroll:true})};
 sh.inert=true;ob.onclick=()=>open(true);cb.onclick=()=>open(false);
 sh.addEventListener('keydown',e=>{if(e.key==='Escape')open(false);if(e.key==='Tab'){const f=[...sh.querySelectorAll('a,button')],a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
 sh.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>open(false)))}

// reveals
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
const startReveals=()=>$$('.rv,.lines,.num,.bm,.lostw').forEach(el=>RM?el.classList.add('in'):io.observe(el));

// preloader micro-story: ring draws → keyhole fills → key turns → wipe into hero
const pl=$('#pl');
if(pl&&!RM){const quick=sessionStorage.getItem('vpn_pl');if(quick)pl.classList.add('quick');const t0=performance.now(),min=quick?350:1650;let done=false;
 const fin=()=>{if(done)return;done=true;sessionStorage.setItem('vpn_pl',1);setTimeout(()=>{pl.classList.add('out');startReveals();setTimeout(()=>pl.remove(),750);dispatchEvent(new Event('preloader:done'))},Math.max(0,min-(performance.now()-t0)))};
 if(document.readyState==='complete')fin();else addEventListener('load',fin);
 setTimeout(()=>{if(!done){fin();toast('Медленная сеть — показываем как есть')}},4000)}
else{pl&&pl.remove();startReveals()}

// scroll-draw: [data-draw] gets --d 0→1 while crossing the viewport; milestone numbers drift (parallax ≤12%)
const dr=$$('[data-draw]'),ms=$$('.ms-n');
if(dr.length||ms.length){let q=0;const f=()=>{q=0;const h=innerHeight;dr.forEach(el=>{const r=el.getBoundingClientRect();const v=RM?1:Math.min(1,Math.max(0,(h*.85-r.top)/(h*.35)));el.style.setProperty('--d',v.toFixed(3))});
 if(!RM)ms.forEach(n=>{const r=n.parentElement.getBoundingClientRect();n.style.setProperty('--py',((r.top+r.height/2-h/2)*-.1).toFixed(1)+'px')})};addEventListener('scroll',()=>{if(!q)q=requestAnimationFrame(f)},{passive:true});addEventListener('resize',f);f()}
// 404 word: random scatter, settles; click to scatter again
const lw=$('.lostw');if(lw){const sc=()=>lw.querySelectorAll('span').forEach(s=>{s.style.setProperty('--x',(Math.random()*80-40).toFixed(0)+'px');s.style.setProperty('--y',(Math.random()*90-45).toFixed(0)+'px');s.style.setProperty('--r',(Math.random()*40-20).toFixed(0)+'deg')});sc();
 lw.addEventListener('click',()=>{if(RM)return;sc();lw.classList.remove('in');setTimeout(()=>lw.classList.add('in'),650)})}
// process: sticky indicator follows the step in view; press emits an ink ring
const steps=$$('.step'),ind=$$('.proc-ind li');
if(steps.length){const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=steps.indexOf(e.target);ind.forEach((l,j)=>l.classList.toggle('on',j===i))}}),{rootMargin:'-45% 0px -45% 0px'});steps.forEach(s=>so.observe(s))}
$$('.ripple').forEach(el=>el.addEventListener('pointerdown',e=>{if(RM)return;const r=el.getBoundingClientRect(),d=document.createElement('span');d.className='ink';d.style.left=(e.clientX-r.left)+'px';d.style.top=(e.clientY-r.top)+'px';el.append(d);setTimeout(()=>d.remove(),720)}));

// clients row arrows
const row=$('.cl-row');$$('[data-row]').forEach(b=>b.onclick=()=>row.scrollBy({left:(+b.dataset.row)*row.clientWidth*.8,behavior:RM?'auto':'smooth'}));

// FAQ / 404 filter-in-place
const filt=(inp,items,empty)=>{const q=inp.value.trim().toLowerCase();let n=0;items.forEach(it=>{const ok=!q||it.textContent.toLowerCase().includes(q);it.hidden=!ok;n+=ok});if(empty)empty.hidden=n>0};
const fq=$('#faq-q');if(fq){const it=$$('.qa details'),em=$('.qa-empty');fq.addEventListener('input',()=>filt(fq,it,em))}
const nq=$('#near-q');if(nq){const it=$$('.near li'),em=$('.near .qa-empty');nq.addEventListener('input',()=>filt(nq,it,em));
 nq.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=it.find(i=>!i.hidden);if(f)location.href=f.querySelector('a').href}})}
$$('.near li a').forEach(a=>a.addEventListener('pointermove',e=>{const r=a.getBoundingClientRect();a.style.setProperty('--hx',(e.clientX-r.left)+'px')}));
})();
