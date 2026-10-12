const Y=['Present','Absent','Late'];
export const M={students:['Students','🎓',[['name','Name'],['class','Class'],['roll','Roll no.','n'],['email','Email','e'],['phone','Mobile'],['status','Status',['Active','Inactive']]]],
teachers:['Teachers','👩‍🏫',[['name','Name'],['subject','Subject'],['email','Email','e'],['phone','Mobile'],['classes','Classes']]],
classes:['Classes & sections','🏫',[['name','Class-section'],['teacher','Class teacher'],['room','Room'],['cap','Capacity','n']]],
subjects:['Subjects','📚',[['code','Code'],['name','Subject'],['class','Class'],['teacher','Teacher']]],
attendance:['Attendance','✅',[['date','Date','d'],['student','Student'],['class','Class'],['status','Status',Y]]],
timetable:['Timetable','🗓️',[['day','Day',['Mon','Tue','Wed','Thu','Fri']],['time','Time'],['class','Class'],['subject','Subject'],['teacher','Teacher']]],
assignments:['Assignments','📝',[['title','Title'],['subject','Subject'],['class','Class'],['due','Due date','d'],['marks','Marks','n']]],
submissions:['Submissions & grading','📥',[['student','Student'],['assignment','Assignment'],['date','Submitted','d'],['score','Score','n'],['status','Status',['Submitted','Graded','Late']]]],
exams:['Exams & results','📊',[['exam','Exam'],['student','Student'],['subject','Subject'],['marks','Marks','n'],['total','Total','n'],['grade','Grade','f']]],
fees:['Fees','💳',[['student','Student'],['month','Month'],['amount','Amount (PKR)','n'],['due','Due date','d'],['status','Status',['Paid','Unpaid','Overdue']]]],
announcements:['Announcements','📢',[['title','Title'],['audience','Audience',['All','Teachers','Students']],['date','Date','d'],['text','Message','a']]],
events:['Events','🎉',[['title','Event'],['date','Date','d'],['venue','Venue'],['text','Details','a']]],
leaves:['Leave requests','🌴',[['who','Requested by'],['type','Type',['Sick','Casual','Other']],['from','From','d'],['to','To','d'],['reason','Reason','a'],['status','Status',['Pending','Approved','Rejected'],1]]],
messages:['Messages','💬',[['from','From'],['to','To'],['subject','Subject'],['text','Message','a']]],
library:['Library','📖',[['title','Title'],['author','Author'],['cat','Category'],['copies','Copies','n'],['status','Status',['Available','Issued']]]],
materials:['Learning materials','📂',[['title','Title'],['subject','Subject'],['class','Class'],['link','Link / file'],['date','Added','d']]],
sessions:['Academic sessions','🎓',[['name','Session'],['start','Start','d'],['end','End','d'],['status','Status',['Current','Past','Upcoming']]]],
dashboard:['Dashboard','🏠'],idcard:['My ID card','x'],calendar:['Calendar','x'],updates:['Updates','x'],markattendance:['Mark attendance','x'],profile:['My profile','👤'],performance:['Student performance','📈'],grades:['My grades','🏆'],lessons:['Lessons & courses','📘',[['title','Title'],['subject','Subject'],['class','Class'],['teacher','Teacher'],['type','Type',['Lesson','Video','Reading']],['date','Date','d']]],reports:['Reports','📈'],settings:['Settings','⚙️']};
export const ACC={admin:{dashboard:1,profile:1,idcard:1,calendar:1,updates:1,students:'w',teachers:'w',classes:'w',subjects:'w',lessons:'w',attendance:'w',markattendance:'w',timetable:'w',assignments:'w',submissions:'w',exams:'w',fees:'w',announcements:'w',events:'w',leaves:'w',messages:'w',library:'w',materials:'w',sessions:'w',reports:1,settings:1},
teacher:{dashboard:1,profile:1,idcard:1,calendar:1,updates:1,students:1,performance:1,classes:1,subjects:1,lessons:'w',attendance:'w',markattendance:'w',timetable:1,assignments:'w',submissions:'w',exams:'w',materials:'w',announcements:1,events:1,library:1,leaves:'w',messages:'w',reports:1},
student:{dashboard:1,profile:1,idcard:1,calendar:1,updates:1,classes:1,subjects:1,lessons:1,timetable:1,attendance:1,assignments:1,submissions:1,exams:1,grades:1,fees:1,announcements:1,events:1,materials:1,library:1,leaves:'w',messages:'w',reports:1}};
const inC=(r,u)=>u.classes.includes(r.class||r.name),mine=k=>(r,u)=>r[k]==u.name,mc=(r,u)=>r.class==u.class;
export const F={teacher:{lessons:mine('teacher'),students:inC,classes:inC,attendance:inC,assignments:inC,materials:inC,subjects:mine('teacher'),timetable:mine('teacher'),exams:(r,u)=>r.subject==u.subject,leaves:mine('who'),messages:(r,u)=>r.from==u.name||r.to==u.name,announcements:r=>r.audience!='Students'},
student:{classes:(r,u)=>r.name==u.class,subjects:mc,lessons:mc,students:mine('name'),timetable:mc,assignments:mc,materials:mc,attendance:mine('student'),submissions:mine('student'),exams:mine('student'),fees:mine('student'),leaves:mine('who'),messages:(r,u)=>r.from==u.name||r.to==u.name,announcements:r=>r.audience!='Teachers'}};
export const LK={messages:'from',leaves:'who',submissions:'student'};
export const USERS={admin:{role:'admin',name:'Principal Farah Malik'},teacher:{role:'teacher',name:'Sana Iqbal',subject:'Mathematics',classes:'8-A, 8-B'},student:{role:'student',name:'Ali Raza',class:'8-A'}};

export const GROUPS=[['Overview',['dashboard','profile','idcard','calendar','updates']],['People',['students','teachers','performance']],['Academics',['classes','subjects','lessons','timetable','markattendance','attendance','assignments','submissions','exams','grades']],['Finance',['fees']],['Communication',['announcements','events','messages','leaves']],['Resources',['library','materials','sessions']],['System',['reports','settings']]];
