let token=localStorage.getItem('lms-token');
export const getToken=()=>token;
export const setToken=t=>{token=t;t?localStorage.setItem('lms-token',t):localStorage.removeItem('lms-token')};
export async function api(path,method='GET',body){let r;
try{r=await fetch('/api'+path,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},body:body?JSON.stringify(body):undefined})}
catch{throw new Error('Cannot reach the school server. Check your internet connection and try again.')}
const j=await r.json().catch(()=>({}));if(!r.ok){const down=!j.error&&r.status>=500;const e=new Error(j.error||(down?'The school server is not running or not reachable. Start it with: npm run dev (or npm run server), then refresh.':'Something went wrong. Please try again.'));e.status=r.status;throw e}return j}
