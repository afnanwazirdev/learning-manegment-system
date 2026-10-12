import {useState} from 'react';import {api} from '../../api';import {useApp} from '../../context/AppContext';
export default function LoginForm({role,onRegister}){const {signIn,say}=useApp(),[err,setErr]=useState(''),[busy,setBusy]=useState(false),[show,setShow]=useState(false);
const submit=async e=>{e.preventDefault();const f=e.target.elements;setErr('');if(!f.email.value.trim()||!f.password.value)return setErr('Enter your email and password.');setBusy(true);
try{const r=await api('/login','POST',{role,email:f.email.value,password:f.password.value});await signIn(r);say('Signed in successfully');location.hash='dashboard'}catch(x){setErr(x.message);say(x.message,'error');setBusy(false)}};
return <form noValidate onSubmit={submit}>{err&&<div className="alert" role="alert">{err}</div>}<label>Email<input name="email" type="email" autoComplete="username"/></label>
<label>Password<input name="password" type={show?'text':'password'} autoComplete="current-password"/></label>
<label className="chk"><input type="checkbox" checked={show} onChange={e=>setShow(e.target.checked)}/>Show password</label>
<button className="btn full" disabled={busy}>{busy?'Checking…':'Sign in'}</button>
<p className="mut sw">New here? <button type="button" className="lnk" onClick={onRegister}>Create an account</button></p></form>}
