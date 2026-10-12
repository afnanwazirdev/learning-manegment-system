const SB=['Mathematics','English','Physics','Urdu','Computer Science'],TN=['Sana Iqbal','Imran Farooq','Nadia Hussain','Kamran Yousuf','Rabia Aslam'];
const id=()=>'p'+Math.random().toString(36).slice(2,9),d=k=>new Date(Date.now()+k*864e5).toISOString().slice(0,10);
export function make(role,u,db){const prov=db.prov||[];if(role=='admin'||!u.email||prov.includes(u.email))return null;const o={prov:[...prov,u.email]};
const add=(k,rows)=>{o[k]=[...(o[k]||db[k]||[]),...rows.map(r=>({id:id(),...r}))]};
const ensure=c=>{if((o.timetable||db.timetable).some(t=>t.class==c))return;
add('classes',[{name:c,teacher:TN[0],room:'TBA',cap:35}]);add('timetable',['Mon','Tue','Wed','Thu','Fri'].map((day,i)=>({day,time:'08:00',class:c,subject:SB[i],teacher:TN[i]})));
add('subjects',SB.map((s,i)=>({code:s.slice(0,3).toUpperCase()+'-'+c,name:s,class:c,teacher:TN[i]})));
add('assignments',SB.slice(0,2).map((s,i)=>({title:s+' practice set',subject:s,class:c,due:d(4+i),marks:20})));
add('lessons',SB.slice(0,3).map((s,i)=>({title:s+' - Unit 1',subject:s,class:c,teacher:TN[i],type:['Lesson','Video','Reading'][i],date:d(-i)})));
add('materials',SB.slice(0,2).map(s=>({title:s+' notes',subject:s,class:c,link:'https://school.example/files',date:d(-1)})))};
if(role=='student'){ensure(u.class);
add('attendance',[0,1,2,3,4].map(j=>({date:d(-j),student:u.name,class:u.class,status:j==3?'Absent':'Present'})));
add('exams',SB.slice(0,4).map((s,i)=>({exam:'Mid-term',student:u.name,subject:s,marks:62+i*8,total:100})));
add('fees',['September','October'].map((m,j)=>({student:u.name,month:m,amount:8500,due:d(j*30-20),status:j?'Unpaid':'Paid'})));
add('submissions',[{student:u.name,assignment:'Mathematics practice set',date:d(-1),score:'',status:'Submitted'}]);
add('messages',[{from:TN[0],to:u.name,subject:'Welcome',text:'Welcome to class! Check Materials for this week.'}])}
else{const cls=u.classes.split(',').map(x=>x.trim()).filter(Boolean);cls.forEach(ensure);
add('subjects',cls.map(c=>({code:u.subject.slice(0,3).toUpperCase()+'-'+c,name:u.subject,class:c,teacher:u.name})));
add('timetable',cls.flatMap(c=>['Mon','Wed','Fri'].map(day=>({day,time:'10:00',class:c,subject:u.subject,teacher:u.name}))));
add('assignments',cls.map(c=>({title:u.subject+' homework',subject:u.subject,class:c,due:d(6),marks:20})));
add('lessons',cls.map(c=>({title:u.subject+' - Introduction',subject:u.subject,class:c,teacher:u.name,type:'Lesson',date:d(0)})));
add('exams',db.students.filter(s=>cls.includes(s.class)).slice(0,12).map((s,i)=>({exam:'Mid-term',student:s.name,subject:u.subject,marks:55+(i*9)%40,total:100})))}
return o}
