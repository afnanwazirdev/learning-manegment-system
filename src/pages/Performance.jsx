import {useApp} from '../context/AppContext';import {avg,grp} from '../utils';import Badge from '../components/common/Badge';import BarChart from '../components/charts/BarChart';
export default function Performance(){const {rows}=useApp(),ex=rows('exams'),at=rows('attendance');
const L=rows('students').map(s=>{const e=ex.filter(x=>x.student==s.name).map(x=>x.marks/x.total*100),a=at.filter(x=>x.student==s.name).map(x=>x.status=='Present'?100:0),sc=e.length?avg(e):null,ap=a.length?avg(a):null;
return{id:s.id,name:s.name,class:s.class,sc,ap,tag:sc===null?'No data':sc>=80?'Excellent':sc>=60&&(ap===null||ap>=75)?'Good':'Needs attention'}});
const byClass=Object.fromEntries(Object.entries(grp(L.filter(x=>x.sc!==null),r=>r.class,r=>r.sc)).map(([k,v])=>[k,avg(v)]));
return <><div className="grid2" style={{marginBottom:18}}><BarChart title="Average score by class" suffix="%" data={byClass}/></div>
<div className="card tw"><table><thead><tr><th>Student</th><th>Class</th><th>Average score</th><th>Attendance</th><th>Standing</th></tr></thead><tbody>{L.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.class}</td><td>{r.sc===null?'-':r.sc+'%'}</td><td>{r.ap===null?'-':r.ap+'%'}</td><td><Badge value={r.tag}/></td></tr>)}</tbody></table>{!L.length&&<div className="empty">No students in your classes yet.</div>}</div></>}
