(()=>{
const {dec,hashKey,LS}=window.Vault,$=id=>document.getElementById(id);
if(!window.VPN_BLOB){location.replace('error.html');return}
const I={copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg>',
 dl:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m-5-5 5 5 5-5M4 21h16"/></svg>',
 bolt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>'};
const cp=t=>{const ok=()=>toast('Скопировано');if(navigator.clipboard&&isSecureContext)return navigator.clipboard.writeText(t).then(ok,()=>fb(t,ok));fb(t,ok)};
const fb=(t,ok)=>{const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;opacity:0';document.body.append(a);a.select();try{document.execCommand('copy');ok()}catch(e){toast('Не удалось скопировать')}a.remove()};
function dl(n,t){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/plain'}));a.download=n+'.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1e3);toast('Файл '+n+'.txt сохранён')}
const deep=x=>({'v2RayTun':'v2raytun://import/'+encodeURIComponent(x.link),'Hiddify':'hiddify://import/'+encodeURIComponent(x.link),'v2rayNG':'v2rayng://install-config?url='+encodeURIComponent(x.link)});
const qd=$('qd');
function render(s){const g=$('grid');g.innerHTML='';
 s.forEach((x,i)=>{const d=document.createElement('article');d.className='slot tac';d.setAttribute('aria-labelledby','sn'+i);
  d.innerHTML=`<div class="slot-h"><h2 id="sn${i}"></h2><span class="n" aria-hidden="true">${i+1}</span></div>
<button class="qr" type="button" data-a="q"><img alt="" width="240" height="240" loading="lazy"></button>
<div class="acts"><button class="btn btn-acc wide" type="button" data-a="l">${I.copy}Скопировать ссылку</button><button class="btn" type="button" data-a="s">${I.copy}Подписка</button><button class="btn" type="button" data-a="d">${I.dl}.txt</button></div>
<div class="deep"></div>`;
  d.querySelector('h2').textContent=x.name;const q=d.querySelector('.qr');q.setAttribute('aria-label','QR-код '+x.name+' — увеличить');q.querySelector('img').src=x.qr;
  const dp=d.querySelector('.deep');Object.entries(deep(x)).forEach(([n,u],j)=>{const a=document.createElement('a');a.className='btn'+(j===0?' btn-pri':'');a.href=u;a.textContent=n;a.setAttribute('aria-label','Открыть '+x.name+' в '+n);a.addEventListener('click',()=>toast('Открываем '+n+'…'));dp.append(a)});
  d.querySelector('[data-a=l]').onclick=()=>cp(x.link);d.querySelector('[data-a=s]').onclick=()=>cp(x.sub);d.querySelector('[data-a=d]').onclick=()=>dl(x.name,x.sub);
  q.onclick=()=>{qd.querySelector('h3').textContent=x.name;qd.querySelector('img').src=x.qr;qd.querySelector('img').alt='QR-код '+x.name;qd._t=x;qd.showModal()};
  g.append(d)});
 Tac.bind(g);document.body.classList.add('ready')}
qd.querySelector('[data-a=x]').onclick=()=>qd.close();qd.addEventListener('click',e=>{if(e.target===qd)qd.close()});
qd.querySelector('[data-a=l]').onclick=()=>cp(qd._t.link);
$('out').onclick=()=>{localStorage.removeItem(LS);location.replace('access.html')};
addEventListener('hashchange',()=>{if(/key=/.test(location.hash))location.reload()});
async function tryKey(k){try{render(await dec(k));return true}catch(e){return false}}
(async()=>{const h=hashKey();if(h&&await tryKey(h))return;
 const s=localStorage.getItem(LS);if(s){if(await tryKey(s))return;localStorage.removeItem(LS)}
 location.replace('access.html'+(h?'#bad':''))})();
})();
