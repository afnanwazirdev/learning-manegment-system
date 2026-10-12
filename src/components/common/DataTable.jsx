import {useEffect,useRef} from 'react';import gsap from 'gsap';import Badge from './Badge';import EmptyState from './EmptyState';import Icon from './Icon';import {grade} from '../../utils';import {calm} from '../fx/motion';
export default function DataTable({cols,rows,canEdit,sort,onSort=()=>{},actionsFor=()=>[],onAction,onView,onEdit,onDelete}){const r=useRef();
useEffect(()=>{if(calm())return;const t=gsap.from(Array.from(r.current.querySelectorAll('tbody tr')).slice(0,12),{opacity:0,y:8,duration:.25,stagger:.015,clearProps:'opacity,transform'});return()=>t.kill()},[]);
const cell=(c,x)=>c[0]=='grade'?<Badge value={grade(x)}/>:Array.isArray(c[2])?<Badge value={x[c[0]]}/>:x[c[0]];
return <div className="card tw" ref={r}><table><thead><tr>{cols.map(c=><th key={c[0]}><button className="th" onClick={()=>onSort(c[0])}>{c[1]}{sort?.k==c[0]&&<Icon n={sort.d>0?'up':'down'} size={13}/>}</button></th>)}<th className="ah">Actions</th></tr></thead>
<tbody>{rows.map(x=><tr key={x.id}>{cols.map(c=><td key={c[0]}>{cell(c,x)}</td>)}<td className="x">{onView&&<button className="ia" aria-label="View details" title="View details" onClick={()=>onView(x)}><Icon n="eye" size={15}/></button>}
{actionsFor(x).map(a=><button key={a.label} className={'ia txt'+(a.danger?' del':'')} onClick={()=>onAction(a,x)}>{a.label}</button>)}
{canEdit&&<><button className="ia" aria-label="Edit" title="Edit" onClick={()=>onEdit(x)}><Icon n="edit" size={15}/></button><button className="ia del" aria-label="Delete" title="Delete" onClick={()=>onDelete(x)}><Icon n="del" size={15}/></button></>}</td></tr>)}</tbody></table>
{!rows.length&&<EmptyState canAdd={canEdit}/>}</div>}
