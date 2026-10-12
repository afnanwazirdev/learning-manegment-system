export const COL={student:['#4338ca','#7c3aed'],teacher:['#0f766e','#14b8a6'],admin:['#b45309','#f59e0b']};
export function cardInfo(p,role){const y=new Date().getFullYear();return{name:p.name,idNo:p.idNo||'-',mobile:p.mobile||p.phone||'-',valid:'Dec '+(y+1),dob:p.dob||'-',address:p.address||'-',
line:role=='student'?['Class',p.class||'-']:role=='teacher'?['Subject',p.subject||'-']:['Designation',p.designation||'-'],
extra:role=='student'?[['Guardian',p.guardian||'-'],['Guardian mobile',p.guardianMobile||'-'],['Blood group',p.bloodGroup||'-']]:role=='teacher'?[['Qualification',p.qualification||'-'],['Experience',(p.experience??'-')+' yrs']]:[['Email',p.email||'-']]}}
