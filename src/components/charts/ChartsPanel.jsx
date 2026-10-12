import {useApp} from '../../context/AppContext';import {ACC} from '../../data/config';import {grp,avg,sum} from '../../utils';import BarChart from './BarChart';
const map=(o,f)=>Object.fromEntries(Object.entries(o).map(([k,v])=>[k,f(v)]));
export default function ChartsPanel(){const {rows,user}=useApp();
return <><BarChart title="Attendance rate by class" suffix="%" data={map(grp(rows('attendance'),r=>r.class,r=>r.status=='Present'?100:0),avg)}/>
<BarChart title="Average score by subject" suffix="%" data={map(grp(rows('exams'),r=>r.subject,r=>r.marks/r.total*100),avg)}/>
{ACC[user.role].fees?<BarChart title="Fees by status (PKR)" data={map(grp(rows('fees'),r=>r.status,r=>r.amount),a=>sum(a,x=>x))}/>:<BarChart title="Students per class" data={map(grp(rows('students'),r=>r.class,r=>1),a=>a.length)}/>}</>}
