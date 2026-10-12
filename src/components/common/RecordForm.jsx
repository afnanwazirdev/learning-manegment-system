import {useState} from 'react';import {useApp} from '../../context/AppContext';import {M,LK} from '../../data/config';import {today} from '../../utils';import FormField from './FormField';
export default function RecordForm({mod,row,prefill,onSave,onClose}){const {user}=useApp(),[err,setErr]=useState({}),[busy,setBusy]=useState(false);
const C=M[mod][2].filter(c=>c[2]!='f'&&(!c[3]||user.role=='admin')),lock=c=>!row&&c[0]==LK[mod]&&(mod!='submissions'||user.role=='student');
const submit=async e=>{e.preventDefault();const er={},rec={};
C.forEach(c=>{const v=e.target.elements[c[0]].value.trim();if(!v)er[c[0]]='This field is required.';else if(c[2]=='n'&&+v<0)er[c[0]]='Enter a number of 0 or more.';else if(c[2]=='e'&&!/^\S+@\S+\.\S+$/.test(v))er[c[0]]='Enter a valid email, like name@school.edu.';rec[c[0]]=c[2]=='n'?+v:v});
setErr(er);if(Object.keys(er).length)return;setBusy(true);try{await onSave(rec)}catch(x){setErr({form:x.message});setBusy(false)}};
return <form className="modal" noValidate onSubmit={submit}><h3>{row?'Edit':'Add'} · {M[mod][0]}</h3>
{C.map(c=><FormField key={c[0]} col={c} error={err[c[0]]} locked={lock(c)} value={row?row[c[0]]:lock(c)?user.name:prefill?.[c[0]]??(c[2]=='d'?today():'')}/>)}
<span className="err">{err.form}</span><div className="acts"><button type="button" className="btn ghost" onClick={onClose}>Cancel</button><button className="btn" disabled={busy}>{busy?'Saving…':'Save'}</button></div></form>}
