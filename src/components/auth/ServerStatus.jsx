import {useState,useEffect} from 'react';
export default function ServerStatus(){const [s,setS]=useState('...');
useEffect(()=>{fetch('/api/health').then(r=>r.json()).then(j=>setS(j.ok?'ok':'bad')).catch(()=>setS('down'))},[]);
if(s=='ok')return <p className="srv ok">● Server connected</p>;if(s=='...')return null;
return <div className="alert" role="alert"><b>{s=='bad'?'Something else is answering on /api, not the school server.':'School server is not connected.'}</b> Open a terminal in the project folder, run <code>npm run dev</code> (the terminal must show <code>[api] ... running</code>), then refresh this page.</div>}
