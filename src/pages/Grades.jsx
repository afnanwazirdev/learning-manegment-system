import {useApp} from '../context/AppContext';import {M} from '../data/config';import {avg,grp,grade} from '../utils';import StatCard from '../components/common/StatCard';import DataTable from '../components/common/DataTable';
export default function Grades(){const {rows}=useApp(),ex=rows('exams'),by=Object.entries(grp(ex,r=>r.subject,r=>r.marks/r.total*100)).map(([k,v])=>[k,avg(v)]);
return <><div className="stats">{by.map(([k,v])=><StatCard key={k} label={k+' · Grade '+grade({marks:v,total:100})} value={v+'%'} icon="exams"/>)}</div>
<DataTable cols={M.exams[2]} rows={ex} canEdit={false}/></>}
