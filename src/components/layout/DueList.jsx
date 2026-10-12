import {useApp} from '../../context/AppContext';import TiltCard from '../fx/TiltCard';
export default function DueList(){const {rows}=useApp(),L=[...rows('assignments')].sort((a,b)=>a.due.localeCompare(b.due)).slice(0,4);
return <TiltCard className="card" max={4}><h3>Assignments due</h3>{L.length?L.map(r=><div className="li" key={r.id}><b>{r.title}</b><small>{r.subject} · Class {r.class} · due {r.due}</small></div>):<p className="empty">No assignments yet.</p>}</TiltCard>}
