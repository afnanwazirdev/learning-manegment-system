import {useApp} from '../../context/AppContext';
export default function AnnouncementList(){const {rows}=useApp(),L=rows('announcements').slice(-4).reverse();
return <div className="card"><h3>Latest announcements</h3>{L.length?L.map(r=><div className="li" key={r.id}><b>{r.title}</b><small>{r.date} · {r.text}</small></div>):<p className="empty">Nothing here yet.</p>}</div>}
