import {useLayoutEffect,useRef} from 'react';import gsap from 'gsap';import {calm} from './motion';
export default function Reveal({children}){const r=useRef();
useLayoutEffect(()=>{if(calm())return;const c=gsap.context(()=>{gsap.from('.stat,.card,.hero-b,.bar',{y:18,opacity:0,duration:.4,ease:'power2.out',stagger:.035,clearProps:'opacity,transform'})},r);return()=>c.revert()},[]);
return <div ref={r}>{children}</div>}
