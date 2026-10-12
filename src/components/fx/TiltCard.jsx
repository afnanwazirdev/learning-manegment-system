import {useEffect,useRef} from 'react';import gsap from 'gsap';import {calm} from './motion';
export default function TiltCard({as:T='div',className='',max=7,children,...p}){const r=useRef();
useEffect(()=>{const el=r.current;if(calm()||matchMedia('(hover:none)').matches)return;
gsap.set(el,{transformPerspective:850});const rx=gsap.quickTo(el,'rotationX',{duration:.5,ease:'power3'}),ry=gsap.quickTo(el,'rotationY',{duration:.5,ease:'power3'}),lift=gsap.quickTo(el,'z',{duration:.4,ease:'power3'});
const mv=e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;ry((x-.5)*max*2);rx(-(y-.5)*max*2);lift(18);el.style.setProperty('--mx',x*100+'%');el.style.setProperty('--my',y*100+'%')},lv=()=>{rx(0);ry(0);lift(0)};
el.addEventListener('pointermove',mv);el.addEventListener('pointerleave',lv);return()=>{el.removeEventListener('pointermove',mv);el.removeEventListener('pointerleave',lv)}},[]);
return <T ref={r} className={'tilt '+className} {...p}>{children}</T>}
