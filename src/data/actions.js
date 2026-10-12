const A=r=>r.role=='admin';
export const ACTIONS={leaves:[{label:'Approve',patch:{status:'Approved'},when:(r,u)=>A(u)&&r.status!='Approved'},{label:'Reject',patch:{status:'Rejected'},danger:1,when:(r,u)=>A(u)&&r.status!='Rejected'}],
fees:[{label:'Mark paid',patch:{status:'Paid'},when:(r,u)=>A(u)&&r.status!='Paid'},{label:'Receipt',receipt:1,when:r=>r.status=='Paid'}],
library:[{label:'Issue',patch:{status:'Issued'},when:(r,u)=>A(u)&&r.status=='Available'},{label:'Return',patch:{status:'Available'},when:(r,u)=>A(u)&&r.status=='Issued'}],
submissions:[{label:'Mark graded',patch:{status:'Graded'},when:(r,u)=>u.role!='student'&&r.status!='Graded'}],
assignments:[{label:'Submit',submit:1,when:(r,u)=>u.role=='student'}],messages:[{label:'Reply',reply:1,when:(r,u)=>r.to==u.name}],students:[{label:'ID card',card:'student'}],teachers:[{label:'ID card',card:'teacher'}]};
