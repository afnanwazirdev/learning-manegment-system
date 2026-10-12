import Icon from './Icon';
export default function SearchBar({title,q,setQ,filter,f,setF,onAdd,children}){return <div className="bar"><div className="sbox"><Icon n="search" size={16}/><input aria-label={'Search '+title} placeholder={'Search '+title.toLowerCase()} value={q} onChange={e=>setQ(e.target.value)}/></div>
{filter&&<select aria-label="Filter" value={f} onChange={e=>setF(e.target.value)}><option value="">All {filter[1].toLowerCase()}</option>{filter[2].map(o=><option key={o}>{o}</option>)}</select>}
{onAdd&&<button className="btn" onClick={onAdd}><Icon n="plus" size={16}/>Add new</button>}{children}</div>}
