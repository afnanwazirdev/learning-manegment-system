import {useEffect,useRef} from 'react';import gsap from 'gsap';import TiltCard from '../fx/TiltCard';import Icon from './Icon';import {calm} from '../fx/motion';
export default function StatCard({label,value,icon}){const r=useRef(),s=String(value),m=s.match(/[\d,]+/),n=m?+m[0].replace(/,/g,''):null;
useEffect(()=>{if(n===null||calm())return;const o={v:0},t=gsap.to(o,{v:n,duration:.9,ease:'power2.out',onUpdate:()=>{if(r.current)r.current.textContent=s.replace(m[0],Math.round(o.v).toLocaleString())}});return()=>t.kill()},[s]);
return <TiltCard className="stat"><span className="ico"><Icon n={icon} size={22}/></span><div><small>{label}</small><b ref={r}>{s}</b></div></TiltCard>}
