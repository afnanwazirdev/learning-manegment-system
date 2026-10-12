import {useApp} from '../../context/AppContext';
export default function EventList(){const {rows}=useApp(),L=rows('events').slice(-4).reverse();
return <div className="card"><h3>Upcoming events</h3>{L.length?L.map(r=><div className="li" key={r.id}><b>{r.title}</b><small>{r.date} · {r.venue}</small></div>):<p className="empty">Nothing here yet.</p>}</div>}
