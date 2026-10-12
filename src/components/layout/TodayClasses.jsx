import {useApp} from '../../context/AppContext';import Icon from '../common/Icon';import TiltCard from '../fx/TiltCard';
const D=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],N={Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday'};
export default function TodayClasses(){const {rows}=useApp(),t=D[new Date().getDay()],day=N[t]?t:'Mon',L=rows('timetable').filter(r=>r.day==day).sort((a,b)=>a.time.localeCompare(b.time)).slice(0,6);
return <TiltCard className="card" max={4}><h3>{day==t?"Today's classes":N[day]+"'s classes"}</h3>{L.length?L.map(r=><div className="li" key={r.id}><b><Icon n="clock" size={14}/> {r.time} · {r.subject}</b><small>Class {r.class} · {r.teacher}</small></div>):<p className="empty">No classes scheduled.</p>}</TiltCard>}
