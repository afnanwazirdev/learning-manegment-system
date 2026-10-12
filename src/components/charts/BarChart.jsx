import {useEffect,useRef} from 'react';import gsap from 'gsap';import TiltCard from '../fx/TiltCard';import {calm} from '../fx/motion';
export default function BarChart({title,data,suffix=''}){const r=useRef(),v=Object.values(data),mx=Math.max(...v,1);
useEffect(()=>{if(calm()||!r.current)return;const t=gsap.from(r.current.querySelectorAll('i'),{scaleY:0,transformOrigin:'bottom',duration:.6,stagger:.06,ease:'power3.out'});return()=>t.kill()},[v.length]);
return <TiltCard className="card" max={4}><h3>{title}</h3>{v.length?<div className="bars" ref={r}>{Object.keys(data).map(k=><div key={k}><b>{data[k].toLocaleString()}{suffix}</b><i style={{height:data[k]/mx*100+'%'}}/>{k}</div>)}</div>:<p className="empty">No data yet.</p>}</TiltCard>}
