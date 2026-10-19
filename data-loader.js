/* Customer data stays on this device; this script never uploads it. */
try{const d=JSON.parse(localStorage.getItem('dennis-private-directory-v1')||'null');if(d&&Array.isArray(d.birthdays)&&Array.isArray(d.contacts)){window.PRIVATE_BIRTHDAYS=d.birthdays;window.PRIVATE_CONTACTS=d.contacts;}}catch{}
document.addEventListener('DOMContentLoaded',()=>{
 const box=document.createElement('section');box.className='notice';
 const info=document.createElement('p');info.textContent=(window.PRIVATE_BIRTHDAYS?.length||window.PRIVATE_CONTACTS?.length)?'私人客戶名單已載入此瀏覽器。':'首次使用：匯入私人客戶名單。檔案只在此瀏覽器讀取及儲存，不會傳到 GitHub。';
 const button=document.createElement('button');button.type='button';button.textContent='匯入私人客戶名單';
 const input=document.createElement('input');input.type='file';input.accept='application/json';input.hidden=true;
 button.onclick=()=>input.click();input.onchange=async()=>{const f=input.files[0];if(!f)return;try{if(f.size>5000000)throw Error();const d=JSON.parse(await f.text());const validPerson=p=>p&&typeof p.name==='string'&&typeof p.nickname==='string'&&typeof p.sender==='string';if(d.version!==1||!Array.isArray(d.birthdays)||!Array.isArray(d.contacts)||!d.birthdays.every(p=>validPerson(p)&&Number.isInteger(p.month)&&p.month>=1&&p.month<=12&&Number.isInteger(p.day)&&p.day>=1&&p.day<=31)||!d.contacts.every(p=>validPerson(p)&&typeof p.id==='string'&&['Plus A','A'].includes(p.group)))throw Error();localStorage.setItem('dennis-private-directory-v1',JSON.stringify(d));location.reload();}catch{info.textContent='未能匯入：請選擇正確的私人客戶名單 JSON，並確認瀏覽器可儲存資料。';}input.value='';};
 box.append(info,button,input);document.querySelector('.intro').after(box);
});
