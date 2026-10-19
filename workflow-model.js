const WorkflowModel={
 nextDay(date){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+1);return d.toISOString().slice(0,10);},
 loop(people,history,group,date){const prior=history.filter(h=>h.group===group&&h.date<date).sort((a,b)=>a.date.localeCompare(b.date));const today=history.find(h=>h.group===group&&h.date===date);return {person:today?people.find(p=>p.id===today.id):people[prior.length%people.length],today,round:Math.floor(prior.length/people.length)+1,position:prior.length%people.length+1};},
 phone(person){const raw=String(person.phone||'');const match=raw.match(/(?:wa\.me\/|phone=|^\s*\+?)([\d\s()-]{7,})/i);return match?match[1].replace(/\D/g,''):'';},
 language(person){const phone=this.phone(person);if(person.language)return person.language;if(/^86\d{11}$/.test(phone))return 'zh-Hans';if(/^852\d{8}$/.test(phone))return 'zh-Hant';return /[\u3400-\u9fff]/.test(person.name)?'zh-Hans':'zh-Hant';},
 birthdayVisible(c,state,date,startDate,catchup,cutoff){const original=date.slice(0,4)+'-'+String(c.month).padStart(2,'0')+'-'+String(c.day).padStart(2,'0');if(catchup)return c.month===10&&c.day<=cutoff;return original===date||!!(state.defer&&state.defer<=date)||(original>=startDate&&original<=date);}
};
if(typeof module!=='undefined')module.exports=WorkflowModel;
