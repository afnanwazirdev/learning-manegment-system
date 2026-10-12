import {createContext,useContext,useState,useEffect,useRef,useCallback} from 'react';
import {api,setToken,getToken} from '../api';import {F} from '../data/config';import {CHANGELOG} from '../data/changelog';
const Ctx=createContext();export const useApp=()=>useContext(Ctx);
export function AppProvider({children}){
const [user,setUser]=useState(null),[db,setDb]=useState({}),[settings,setSettings]=useState({school:'EduNest School',accent:'#4f46e5'}),[activity,setActivity]=useState([]),[people,setPeople]=useState([]),[ready,setReady]=useState(!getToken()),
[toast,setToast]=useState({t:'',k:''}),[theme,setTheme]=useState(localStorage.getItem('lms-theme')||'light'),[seen,setSeen]=useState(0),[wn,setWn]=useState(false),timer=useRef(),last=useRef(0);
const say=useCallback((t,k='ok')=>{setToast({t,k});clearTimeout(timer.current);timer.current=setTimeout(()=>setToast({t:'',k:''}),2800)},[]);
const logout=useCallback(()=>{setToken(null);setUser(null);setDb({});setActivity([]);location.hash=''},[]);
const refreshAct=useCallback(()=>api('/activity').then(a=>{setActivity(a);last.current=a[0]?.ts||0}).catch(()=>{}),[]);
const load=useCallback(async()=>{const b=await api('/bootstrap');setUser(b.user);setDb(b.db);setSettings(b.settings);setPeople(b.people||[]);await refreshAct();return b},[refreshAct]);
useEffect(()=>{if(!getToken())return;load().catch(()=>setToken(null)).finally(()=>setReady(true))},[load]);
useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem('lms-theme',theme)},[theme]);
useEffect(()=>{document.documentElement.style.setProperty('--pri',settings.accent)},[settings.accent]);
useEffect(()=>{if(!user)return;const k='lms-seen-'+user.id;let s=+localStorage.getItem(k);if(!s){s=Date.now();localStorage.setItem(k,s)}setSeen(s);if(localStorage.getItem('lms-ver-'+user.id)!==CHANGELOG.version)setWn(true)},[user?.id]);
useEffect(()=>{if(!user)return;const t=setInterval(async()=>{try{const a=await api('/activity'),prev=last.current;setActivity(a);last.current=a[0]?.ts||0;const fresh=a.filter(e=>e.ts>prev&&e.actor!==user.name);if(prev&&fresh.length){say(fresh[0].text);const b=await api('/bootstrap');setDb(b.db)}}catch(e){if(e.status==401)logout()}},15000);return()=>clearInterval(t)},[user?.id,logout,say]);
const markSeen=()=>{if(!user)return;const n=Date.now();localStorage.setItem('lms-seen-'+user.id,n);setSeen(n)};
const closeWn=()=>{if(user)localStorage.setItem('lms-ver-'+user.id,CHANGELOG.version);setWn(false)};
const api2={people,user,db,settings,activity,ready,toast,theme,setTheme,say,load,logout,wn,setWn,closeWn,seen,markSeen,api,
unread:activity.filter(a=>a.ts>seen&&a.actor!==user?.name),
rows:m=>{const f=(F[user?.role]||{})[m];return(db[m]||[]).filter(r=>!f||f(r,user))},
signIn:async res=>{setToken(res.token);await load()},
upsert:async(m,rec,id)=>{const row=await api('/data/'+m+(id?'/'+id:''),id?'PUT':'POST',rec);setDb(d=>({...d,[m]:id?(d[m]||[]).map(r=>r.id==id?row:r):[...(d[m]||[]),row]}));if(m=='students'||m=='teachers')load();else refreshAct();return row},
remove:async(m,id)=>{await api('/data/'+m+'/'+id,'DELETE');setDb(d=>({...d,[m]:(d[m]||[]).filter(r=>r.id!=id)}));refreshAct()},
updateProfile:async p=>{await api('/profile','PUT',p);await load()},
saveSettings:async s=>{setSettings(await api('/settings','PUT',s))}};
return <Ctx.Provider value={api2}>{children}</Ctx.Provider>}
