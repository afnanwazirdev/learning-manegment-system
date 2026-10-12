import {useState,useEffect} from 'react';
export default function ServerStatus(){const [s,setS]=useState('...');
useEffect(()=>{fetch('/api/health').then(async r=>{const j=await r.json();setS(r.ok&&j.ok?'ok':j.error?.toLowerCase().includes('database')?'db':'bad')}).catch(()=>setS('down'))},[]);
if(s=='ok')return <p className="srv ok">● Server connected</p>;if(s=='...')return null;
return <div className="alert" role="alert"><b>{s=='bad'?'Something else is answering on /api, not the school server.':s=='db'?'The school database is not connected.':'School server is not connected.'}</b> {s=='db'?'Configure the MongoDB connection (MONGODB_URI) in the deployment environment, then refresh this page.':<>Open a terminal in the project folder, run <code>npm run dev</code>, then refresh this page.</>}</div>}
