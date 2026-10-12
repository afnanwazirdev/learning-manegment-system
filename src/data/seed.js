const d=k=>new Date(Date.now()+k*864e5).toISOString().slice(0,10);
export function seed(){let n=0;const R=a=>a.map(o=>({id:'r'+(++n),...o}));
const cl=['8-A','8-B','9-A'],sb=['Mathematics','English','Physics','Urdu','Computer Science'],tn=['Sana Iqbal','Imran Farooq','Nadia Hussain','Kamran Yousuf','Rabia Aslam'];
const S=['Ali Raza','Hina Khan','Bilal Ahmed','Zara Malik','Hamza Sheikh','Maryam Noor','Usman Ali','Ayesha Tariq','Danish Iqbal','Sana Butt','Faizan Qureshi','Iqra Shah'].map((name,i)=>({name,class:cl[i%3],roll:i+1,email:name.split(' ')[0].toLowerCase()+'@school.edu',phone:'0300-12345'+(10+i),status:'Active'}));
return{students:R(S),
teachers:R(tn.map((name,i)=>({name,subject:sb[i],email:name.split(' ')[0].toLowerCase()+'@school.edu',phone:'0321-98765'+i+'0',classes:['8-A, 8-B','8-A, 9-A','8-B, 9-A','8-A, 8-B, 9-A','9-A'][i]}))),
classes:R(cl.map((name,i)=>({name,teacher:tn[i],room:'Room '+(101+i),cap:35}))),
subjects:R(cl.flatMap(c=>sb.map((s,i)=>({code:s.slice(0,3).toUpperCase()+'-'+c,name:s,class:c,teacher:tn[i]})))),
lessons:R(cl.flatMap(c=>sb.slice(0,3).map((s,i)=>({title:s+' - Unit '+(i+1),subject:s,class:c,teacher:tn[i],type:['Lesson','Video','Reading'][i],date:d(-i)})))),
attendance:R(S.flatMap((s,i)=>[0,1,2,3,4].map(j=>({date:d(-j),student:s.name,class:s.class,status:(i*3+j)%7==0?'Absent':(i+j)%9==0?'Late':'Present'})))),
timetable:R(cl.flatMap((c,ci)=>['Mon','Tue','Wed','Thu','Fri'].flatMap((day,di)=>['08:00','09:00'].map((time,si)=>{const k=(ci+di+si)%5;return{day,time,class:c,subject:sb[k],teacher:tn[k]}})))),
assignments:R([['Algebra worksheet 4','Mathematics','8-A',3,20],['Essay: My hero','English','8-A',5,25],['Lab report: Motion','Physics','8-B',7,30],['Urdu grammar','Urdu','9-A',2,15],['Python basics quiz','Computer Science','8-A',9,10]].map(a=>({title:a[0],subject:a[1],class:a[2],due:d(a[3]),marks:a[4]}))),
submissions:R(S.slice(0,6).map((s,i)=>({student:s.name,assignment:'Algebra worksheet 4',date:d(-i),score:i%2?'':16-i,status:i%2?'Submitted':'Graded'}))),
exams:R(S.flatMap((s,i)=>[['Mid-term','Mathematics'],['Mid-term','English']].map(([exam,subject],j)=>({exam,student:s.name,subject,marks:48+(i*7+j*13)%50,total:100})))),
fees:R(S.flatMap((s,i)=>['September','October'].map((month,j)=>({student:s.name,month,amount:8500,due:d(j*30-20),status:(i+j)%4==0?'Overdue':(i+j)%3==0?'Unpaid':'Paid'})))),
announcements:R([['Parent-teacher meeting','All',-1,'Meeting on Saturday at 10 am in the main hall.'],['Staff training day','Teachers',-3,'Curriculum workshop on Monday, 2 pm.'],['Science fair entries open','Students',-2,'Submit project ideas to your science teacher by Friday.']].map(a=>({title:a[0],audience:a[1],date:d(a[2]),text:a[3]}))),
events:R([['Annual sports day',12,'Ground'],['Science fair',20,'Lab block'],['Independence Day assembly',40,'Main hall']].map(a=>({title:a[0],date:d(a[1]),venue:a[2],text:'Open to all classes.'}))),
leaves:R([{who:'Ali Raza',type:'Sick',from:d(1),to:d(2),reason:'Fever',status:'Pending'},{who:'Sana Iqbal',type:'Casual',from:d(5),to:d(5),reason:'Family event',status:'Approved'},{who:'Hina Khan',type:'Other',from:d(-4),to:d(-3),reason:'Travel',status:'Rejected'}]),
messages:R([{from:'Ali Raza',to:'Sana Iqbal',subject:'Homework doubt',text:'Could you explain question 3 of the algebra worksheet?'},{from:'Sana Iqbal',to:'Ali Raza',subject:'Re: Homework doubt',text:'Yes, see the new notes in Materials.'}]),
library:R([['Oxford Atlas','Oxford','Reference',4],['Physics Made Simple','R. Hall','Science',3],['Bano Qudsia: Raja Gidh','Bano Qudsia','Literature',2],['Python Crash Course','E. Matthes','Computing',5]].map(a=>({title:a[0],author:a[1],cat:a[2],copies:a[3],status:'Available'}))),
materials:R([['Algebra notes','Mathematics','8-A'],['Newton laws slides','Physics','8-B'],['Grammar guide','English','8-A'],['Intro to Python','Computer Science','8-A']].map(a=>({title:a[0],subject:a[1],class:a[2],link:'https://school.example/files',date:d(-2)}))),
sessions:R([{name:'2025-26',start:'2025-08-01',end:'2026-06-30',status:'Current'},{name:'2024-25',start:'2024-08-01',end:'2025-06-30',status:'Past'},{name:'2026-27',start:'2026-08-01',end:'2027-06-30',status:'Upcoming'}])}}
