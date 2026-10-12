import {useState} from 'react';import {useApp} from '../../context/AppContext';
export default function PasswordForm(){const {api,say}=useApp(),[err,setErr]=useState(''),[busy,setBusy]=useState(false);
const save=async e=>{e.preventDefault();const f=e.target.elements;if(!f.cur.value)return setErr('Enter your current password.');if(f.nw.value.length<8)return setErr('New password must be at least 8 characters.');if(f.nw.value!==f.cf.value)return setErr('Passwords do not match.');
setBusy(true);try{await api('/password','POST',{current:f.cur.value,next:f.nw.value});e.target.reset();setErr('');say('Password changed')}catch(x){setErr(x.message)}setBusy(false)};
return <div className="card"><h3>Change password</h3><form noValidate onSubmit={save}><label>Current password<input name="cur" type="password" autoComplete="current-password"/></label><label>New password<input name="nw" type="password" autoComplete="new-password"/></label><label>Confirm new password<input name="cf" type="password" autoComplete="new-password"/></label>
<span className="err">{err}</span><div className="acts"><button className="btn" disabled={busy}>{busy?'Updating…':'Update password'}</button></div></form></div>}
