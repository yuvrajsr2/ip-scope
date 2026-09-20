const q=s=>document.querySelector(s), input=q('#ip'), form=q('#search-form'), error=q('#error'), trace=q('#trace');
const set=(id,value)=>{q(id).textContent=value||'Unknown'};
async function lookup(value){
  const target=(value??input.value).trim();
  if(target&&!/^[0-9a-fA-F:.]+$/.test(target)){showError('Enter a valid IPv4 or IPv6 address.');return}
  showError(''); trace.disabled=true; trace.textContent='Scanning…';
  try{
    const response=await fetch('https://ipwho.is/'+encodeURIComponent(target));
    const d=await response.json(); if(!response.ok||d.success===false)throw new Error(d.message||'Lookup failed');
    input.value=d.ip; set('#resolved-ip',d.ip); set('#flag',d.flag?.emoji||'🌐'); set('#place',(d.city||'Unknown city')+', '+(d.region||'Unknown region')); set('#country',(d.country||'Unknown country')+' · '+(d.continent||'Unknown continent')); set('#type',d.type||'IP'); set('#protocol',d.type||'Unknown'); set('#isp',d.connection?.isp||'Unknown'); set('#org',d.connection?.org||'Unknown'); set('#domain',d.connection?.domain||'Not published'); set('#asn',d.connection?.asn?'AS'+d.connection.asn:'Unknown'); set('#postal',d.postal||'Not available'); set('#timezone',d.timezone?.id||'Unknown'); set('#utc',d.timezone?.utc||'Unknown'); set('#local-time',d.timezone?.current_time?.split('T')[1]?.slice(0,5)||'Unavailable'); set('#lat',Number(d.latitude).toFixed(4)+'°'); set('#lon',Number(d.longitude).toFixed(4)+'°'); set('#marker-city',d.city||'Unknown');
    const marker=q('#marker'); marker.style.left=((Number(d.longitude)+180)/360*100)+'%'; marker.style.top=((90-Number(d.latitude))/180*100)+'%';
  }catch(e){showError(e.message||'Unable to reach the lookup service.')}finally{trace.disabled=false;trace.textContent='Trace IP →'}
}
function showError(message){error.textContent=message;error.classList.toggle('hidden',!message)}
form.addEventListener('submit',e=>{e.preventDefault();lookup()}); q('#my-ip').addEventListener('click',()=>lookup('')); document.querySelectorAll('[data-ip]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.ip;lookup(b.dataset.ip)}));
q('#copy').addEventListener('click',async()=>{await navigator.clipboard.writeText(q('#resolved-ip').textContent);const t=q('#toast');t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1600)});
