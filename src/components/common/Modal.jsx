import {useEffect,useLayoutEffect,useRef} from 'react';import {createPortal} from 'react-dom';import gsap from 'gsap';import {calm} from '../fx/motion';
export default function Modal({children,onClose}){const r=useRef();
useEffect(()=>{const k=e=>e.key=='Escape'&&onClose();document.addEventListener('keydown',k);return()=>document.removeEventListener('keydown',k)},[onClose]);
useLayoutEffect(()=>{if(calm())return;const c=gsap.context(()=>{gsap.from(r.current,{opacity:0,duration:.25});gsap.from('.modal',{y:40,scale:.92,opacity:0,duration:.3,ease:'back.out(1.4)'})},r);return()=>c.revert()},[]);
return createPortal(<div ref={r} className="ov" onMouseDown={e=>e.target===e.currentTarget&&onClose()}>{children}</div>,document.body)}
