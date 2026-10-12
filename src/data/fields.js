const BG=['A+','A-','B+','B-','O+','O-','AB+','AB-','Unknown'];
export const REG={common:[['name','Full name','text',1],['email','Email address','email',1],['mobile','Mobile number','tel',1],['gender','Gender',['Male','Female','Other'],1],['dob','Date of birth','date',1],['address','Home address','text',1]],
student:[['class','Class & section (e.g. 8-A)','text',1],['guardian','Father / guardian name','text',1],['guardianMobile','Guardian mobile number','tel',1],['bloodGroup','Blood group',BG,0]],
teacher:[['subject','Subject you teach','text',1],['classes','Classes you teach (e.g. 8-A, 8-B)','text',1],['qualification','Qualification (e.g. M.Sc Physics)','text',1],['experience','Experience (years)','number',1]],
admin:[['designation','Designation',['Principal','Vice Principal','Administrator','Accountant'],1]]};
export const EDITABLE={student:['name','mobile','address','gender','dob','bio','avatar','guardian','guardianMobile','bloodGroup'],teacher:['name','mobile','address','gender','dob','bio','avatar','qualification','experience'],admin:['name','mobile','address','gender','dob','bio','avatar','designation']};
export const digits=v=>String(v||'').replace(/\D/g,'');
const ALL=Object.fromEntries(Object.values(REG).flat().map(([k,l,t,r])=>[k,[l,t,r]]));
const check=(t,v)=>t=='email'?/^\S+@\S+\.\S+$/.test(v):t=='tel'?digits(v).length>=10&&digits(v).length<=13&&/^[\d+\-\s()]+$/.test(v):t=='date'?/^\d{4}-\d{2}-\d{2}$/.test(v)&&new Date(v)<new Date():t=='number'?Number(v)>=0&&Number(v)<=60:true;
const bad=(k,v)=>{const [l,t]=ALL[k];if(Array.isArray(t))return t.includes(v)?'':`${l} has an invalid value.`;return check(t,String(v))?'':`${l} is not valid.`};
export function validateReg(role,b){for(const [k,l,t,req] of [...REG.common,...REG[role]]){const v=typeof b[k]=='string'?b[k].trim():b[k];if(req&&(v===undefined||v===null||v===''))return`${l} is required.`;if(v!==undefined&&v!==null&&v!==''){const m=bad(k,v);if(m)return m}}
return String(b.name||'').trim().length<2?'Enter your full name.':''}
export function validateEdit(role,b){for(const k of Object.keys(b)){if(!EDITABLE[role].includes(k))return'That field cannot be edited.';if(k=='bio'){if(String(b[k]).length>200)return'About me must be 200 characters or fewer.';continue}if(k=='avatar')continue;
const v=typeof b[k]=='string'?b[k].trim():b[k];if(ALL[k][2]&&(v===''||v==null))return`${ALL[k][0]} is required.`;if(v!==''&&v!=null){const m=bad(k,v);if(m)return m}}
if('name' in b&&String(b.name).trim().length<2)return'Enter your full name.';return''}
