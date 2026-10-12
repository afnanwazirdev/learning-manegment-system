import {useState} from 'react';import {api} from '../../api';import {useApp} from '../../context/AppContext';import {REG,validateReg} from '../../data/fields';
const sections=r=>[['Personal details',REG.common],[{student:'Student details',teacher:'Teaching details',admin:'Admin details'}[r],REG[r]]];
const strength=p=>{let s=0;if(p.length>=8)s++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p))s++;if(/\d/.test(p))s++;if(/[^A-Za-z0-9]/.test(p))s++;return s};
export default function RegisterForm({role}){const {signIn,say}=useApp(),[err,setErr]=useState({}),[busy,setBusy]=useState(false),[pw,setPw]=useState('');
const submit=async e=>{e.preventDefault();const f=e.target.elements,b={role},er={};
[...REG.common,...REG[role]].forEach(([k])=>{b[k]=f[k].value.trim()});b.password=f.password.value;if(role=='admin')b.code=f.code.value;
[...REG.common,...REG[role]].forEach(([k,,,req])=>{if(req&&!b[k])er[k]='This field is required.'});const m=Object.keys(er).length?'':validateReg(role,b);if(m){const k=[...REG.common,...REG[role]].find(([k,l])=>m.startsWith(l))?.[0]||'form';er[k]=m}
if(b.password.length<8)er.password='Use at least 8 characters.';if(b.password!==f.confirm.value)er.confirm='Passwords do not match.';if(role=='admin'&&!b.code)er.code='This field is required.';
setErr(er);if(Object.keys(er).length)return;setBusy(true);
try{const r=await api('/register','POST',b);await signIn(r);location.hash='idcard';say('Welcome! Your ID card is ready.')}catch(x){setErr({form:x.message});setBusy(false)}};
const fld=([k,l,t])=><label key={k}>{l}{Array.isArray(t)?<select name={k} defaultValue=""><option value="" disabled>Select…</option>{t.map(o=><option key={o}>{o}</option>)}</select>:<input name={k} type={t=='number'?'number':t} min={t=='number'?0:undefined} max={t=='date'?new Date().toISOString().slice(0,10):undefined} autoComplete={k=='name'?'name':k=='email'?'email':k=='mobile'?'tel':'off'}/>}<span className="err">{err[k]}</span></label>;
return <form noValidate onSubmit={submit}>{err.form&&<div className="alert" role="alert">{err.form}</div>}{Object.keys(err).some(k=>k!='form')&&<div className="alert" role="alert">Please fix the highlighted fields below.</div>}{sections(role).map(([h,fs])=><section key={h}><h4>{h}</h4><div className="fgrid">{fs.map(fld)}</div></section>)}
<section><h4>Account security</h4><div className="fgrid"><label>Password (8+ characters)<input name="password" type="password" autoComplete="new-password" onChange={e=>setPw(e.target.value)}/><span className={'meter s'+strength(pw)}><i/><i/><i/><i/></span><span className="err">{err.password}</span></label>
<label>Confirm password<input name="confirm" type="password" autoComplete="new-password"/><span className="err">{err.confirm}</span></label>
{role=='admin'&&<label className="wide">Admin access code<input name="code" type="password" autoComplete="off" placeholder="First admin: create a code. Others: enter it."/><span className="err">{err.code}</span></label>}</div></section>
<span className="err">{err.form}</span><button className="btn full" disabled={busy}>{busy?'Creating account…':'Create account & get ID card'}</button></form>}
