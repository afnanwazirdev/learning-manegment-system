import {cardInfo,COL} from './cardInfo';import {qrSvg} from './IdCard';import {initials} from '../../utils';
const img=s=>new Promise(r=>{if(!s)return r(null);const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src=s});
const T=(c,t,x,y,f,col,al='center')=>{c.font=f;c.fillStyle=col;c.textAlign=al;c.fillText(t,x,y)};
export async function downloadCard(p,role,school){const i=cardInfo(p,role),W=540,H=860,cv=document.createElement('canvas');cv.width=W*2+90;cv.height=H+60;const c=cv.getContext('2d');c.fillStyle='#e8ecf6';c.fillRect(0,0,cv.width,cv.height);
const svg=await qrSvg(school,i,role),[ph,qr]=await Promise.all([img(p.avatar),img('data:image/svg+xml;base64,'+btoa(svg))]);
const side=(x,title,sub)=>{const y=30;c.save();c.shadowColor='#0004';c.shadowBlur=30;c.fillStyle='#fff';c.beginPath();c.roundRect(x,y,W,H,36);c.fill();c.restore();c.save();c.beginPath();c.roundRect(x,y,W,H,36);c.clip();
const g=c.createLinearGradient(x,y,x+W,y+300);g.addColorStop(0,COL[role][0]);g.addColorStop(1,COL[role][1]);c.fillStyle=g;c.fillRect(x,y,W,title?290:170);c.restore();
T(c,title||'Card details',x+W/2,y+(title?90:80),'700 38px sans-serif','#fff');T(c,sub,x+W/2,y+(title?130:120),'600 20px sans-serif','#ffffffcc');return y};
const row=(x,y,k,v)=>{T(c,k,x+50,y,'600 20px sans-serif','#667085','left');T(c,String(v),x+W-50,y,'700 26px sans-serif','#0e1a38','right')};
let x=30,y=side(x,school,role.toUpperCase()+' ID CARD');c.save();c.beginPath();c.arc(x+W/2,y+270,110,0,7);c.fillStyle='#fff';c.fill();c.clip();
if(ph)c.drawImage(ph,x+W/2-104,y+166,208,208);else{c.fillStyle=COL[role][0];c.fillRect(x+W/2-104,y+166,208,208);T(c,initials(i.name),x+W/2,y+295,'700 80px sans-serif','#fff')}c.restore();
T(c,i.name,x+W/2,y+450,'800 40px sans-serif','#0e1a38');T(c,role.toUpperCase(),x+W/2,y+495,'700 22px sans-serif',COL[role][0]);
[['ID number',i.idNo],i.line,['Mobile',i.mobile],['Valid until',i.valid]].forEach((r,n)=>row(x,y+560+n*52,r[0],r[1]));if(qr)c.drawImage(qr,x+W/2-70,y+H-170,140,140);
x=W+60;y=side(x,'',school);[['Date of birth',i.dob],...i.extra,['Address',i.address]].forEach((r,n)=>row(x,y+230+n*60,r[0],r[1].length>22?r[1].slice(0,21)+'…':r[1]));
T(c,'Property of '+school+'.',x+W/2,y+H-200,'500 20px sans-serif','#667085');T(c,'If found, please return to the school office.',x+W/2,y+H-170,'500 20px sans-serif','#667085');
c.fillStyle='#0e1a38';c.fillRect(x+W/2-120,y+H-90,240,2);T(c,'Authorized signature',x+W/2,y+H-60,'500 18px sans-serif','#667085');
const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download=`id-card-${i.idNo}.png`;a.click()}
