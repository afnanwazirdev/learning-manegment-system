import {useState,useEffect} from 'react';import QRCode from 'qrcode';import {cardInfo,COL} from './cardInfo';import {initials} from '../../utils';
export const qrSvg=(school,i,role)=>QRCode.toString(`${school}|${i.idNo}|${i.name}|${role}`,{type:'svg',margin:1,width:110});
export default function IdCard({p,role,school}){const i=cardInfo(p,role),[qr,setQr]=useState('');
useEffect(()=>{qrSvg(school,i,role).then(setQr).catch(()=>{})},[school,i.idNo,i.name,role]);
const R=([k,v])=><div key={k}><small>{k}</small><b>{v}</b></div>,st={'--c1':COL[role][0],'--c2':COL[role][1]};
return <div className="idsheet print-area"><div className="idc" style={st}><div className="idh"><b>{school}</b><small>{role.toUpperCase()} ID CARD</small></div>
<div className="idph">{p.avatar?<img src={p.avatar} alt={p.name}/>:initials(p.name)}</div><h3>{i.name}</h3><span className="idrole">{role}</span>
<div className="idrows">{[['ID number',i.idNo],i.line,['Mobile',i.mobile],['Valid until',i.valid]].map(R)}</div><div className="idqr" dangerouslySetInnerHTML={{__html:qr}}/></div>
<div className="idc back" style={st}><div className="idh"><b>Card details</b><small>{school}</small></div><div className="idrows">{[['Date of birth',i.dob],...i.extra,['Address',i.address]].map(R)}</div>
<p className="idnote">This card is the property of {school}. If found, please return it to the school office.</p><div className="idsig"><span/>Authorized signature</div></div></div>}
