/* AES-GCM encrypted directory. Only a successful unlock reveals customer data. */
document.addEventListener('DOMContentLoaded',async()=>{
 const STORAGE='dennis-directory-device-key-v1';
 const from64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
 const to64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
 const gate=document.createElement('section');gate.className='directory-gate';
 const heading=document.createElement('h1');heading.textContent='Dennis So 每日工作';
 const intro=document.createElement('p');intro.textContent='輸入密碼解鎖客戶名單。此瀏覽器成功解鎖一次後會記住。';
 const form=document.createElement('form');const label=document.createElement('label');label.textContent='密碼';
 const input=document.createElement('input');input.type='password';input.inputMode='numeric';input.autocomplete='current-password';input.required=true;input.setAttribute('aria-label','密碼');label.append(input);
 const button=document.createElement('button');button.type='submit';button.textContent='解鎖並記住此裝置';button.className='primary';
 const status=document.createElement('p');status.setAttribute('role','status');
 form.append(label,button);gate.append(heading,intro,form,status);document.body.prepend(gate);
 let payload;
 function finish(data){window.PRIVATE_BIRTHDAYS=data.birthdays;window.PRIVATE_CONTACTS=data.contacts;try{localStorage.removeItem('dennis-private-directory-v1');}catch{}window.dispatchEvent(new Event('directory-ready'));document.documentElement.removeAttribute('data-directory-locked');gate.remove();const tools=document.createElement('div');tools.className='directory-device';const note=document.createElement('small');note.textContent='客戶名單已解鎖 · 此瀏覽器已記住';const lock=document.createElement('button');lock.type='button';lock.textContent='鎖定並忘記此裝置';lock.onclick=()=>{try{localStorage.removeItem(STORAGE);}catch{}location.reload();};tools.append(note,lock);document.querySelector('header').after(tools);}
 async function decrypt(raw){const key=await crypto.subtle.importKey('raw',raw,{name:'AES-GCM'},false,['decrypt']);const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv:from64(payload.iv)},key,from64(payload.ciphertext));const d=JSON.parse(new TextDecoder().decode(plain));if(d.version!==1||!Array.isArray(d.birthdays)||!Array.isArray(d.contacts))throw Error('Invalid directory');return d;}
 try{const response=await fetch('./directory.enc.json',{cache:'no-store'});if(!response.ok)throw Error();payload=await response.json();if(payload.version!==1||payload.iterations!==600000)throw Error();let saved;try{saved=JSON.parse(localStorage.getItem(STORAGE)||'null');}catch{}if(saved?.salt===payload.salt){try{finish(await decrypt(from64(saved.key)));return;}catch{localStorage.removeItem(STORAGE);}}status.textContent='';input.focus();}catch{status.textContent='名單載入失敗，請檢查網絡後重新整理。';button.disabled=true;return;}
 form.onsubmit=async e=>{e.preventDefault();button.disabled=true;status.textContent='正在解鎖…';try{const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(input.value),'PBKDF2',false,['deriveBits']);const raw=await crypto.subtle.deriveBits({name:'PBKDF2',salt:from64(payload.salt),iterations:payload.iterations,hash:'SHA-256'},base,256);const data=await decrypt(raw);let remembered=true;try{localStorage.setItem(STORAGE,JSON.stringify({salt:payload.salt,key:to64(raw)}));}catch{remembered=false;}input.value='';finish(data);if(!remembered)document.querySelector('.directory-device small').textContent='已解鎖；瀏覽器未允許記住裝置，下次需再登入。';}catch{status.textContent='密碼不正確，請再試。';input.select();}finally{button.disabled=false;}};
});
