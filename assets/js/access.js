(()=>{
const {dec,hashKey,LS}=window.Vault,$=id=>document.getElementById(id),card=document.querySelector('.gate-card');
const go=k=>location.replace('slots.html#key='+encodeURIComponent(k));
if(!window.VPN_BLOB){location.replace('error.html');return}
// a shared #key= link or a remembered key goes straight to the slots
const h=hashKey();if(h){go(h);return}
if(localStorage.getItem(LS)){location.replace('slots.html');return}
if(location.hash==='#bad'){history.replaceState(null,'',location.pathname);$('err').textContent='Ключ из ссылки не подошёл'}
$('eye').onclick=()=>{const k=$('k'),v=k.type==='password';k.type=v?'text':'password';$('eye').setAttribute('aria-pressed',v);$('eye').setAttribute('aria-label',v?'Скрыть ключ':'Показать ключ')};
$('f').onsubmit=async e=>{e.preventDefault();const k=$('k').value.trim(),btn=$('go');
 if(!k){$('err').textContent='Введите ключ';$('k').focus();return}
 btn.disabled=true;btn.textContent='Проверяем…';$('err').textContent='';
 try{await dec(k);if($('rem').checked)localStorage.setItem(LS,k);card.classList.add('ok');setTimeout(()=>go(k),matchMedia('(prefers-reduced-motion: reduce)').matches?0:550)}
 catch(_){btn.disabled=false;btn.textContent='Открыть';$('err').textContent='Ключ не подошёл';card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');$('k').select()}};
})();
