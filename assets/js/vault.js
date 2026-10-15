// Decryption: SHA-256 id selects one block, then PBKDF2-SHA256 → AES-GCM-256. Blob array lives in data.js.
const ub=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0)),LS='vpnnyc_key';
async function dec(key){
 const blocks=window.VPN_BLOB;
 if(!Array.isArray(blocks))throw new Error('blob');
 const dig=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(key));
 const id=[...new Uint8Array(dig)].map(b=>b.toString(16).padStart(2,'0')).join('').slice(0,16);
 const B=blocks.find(b=>b&&b.id===id);
 if(!B)throw new Error('nomatch');
 const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(key),'PBKDF2',false,['deriveKey']);
 const k=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt:ub(B.salt),iterations:B.iter},km,{name:'AES-GCM',length:256},false,['decrypt']);
 return JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({name:'AES-GCM',iv:ub(B.iv)},k,ub(B.ct))));
}
// #key= from the URL (stripped from the address bar right away), as before.
function hashKey(){const h=new URLSearchParams(location.hash.slice(1)).get('key');if(h)history.replaceState(null,'',location.pathname);return h}
window.Vault={dec,hashKey,LS};
