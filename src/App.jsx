import {useState,useEffect} from 'react';import {useApp} from './context/AppContext';import {ACC,M} from './data/config';
import Portals from './pages/Portals';import AuthPage from './pages/AuthPage';import Dashboard from './pages/Dashboard';import Reports from './pages/Reports';import Settings from './pages/Settings';import Profile from './pages/Profile';import Performance from './pages/Performance';import Grades from './pages/Grades';
import IdCardPage from './pages/IdCardPage';import CalendarPage from './pages/Calendar';import Updates from './pages/Updates';import MarkAttendance from './pages/MarkAttendance';import {PAGES} from './pages/modules';
import Sidebar from './components/layout/Sidebar';import Topbar from './components/layout/Topbar';import WhatsNew from './components/layout/WhatsNew';import Toast from './components/common/Toast';import Scene3D from './components/fx/Scene3D';import Reveal from './components/fx/Reveal';
const ALL={dashboard:Dashboard,reports:Reports,settings:Settings,profile:Profile,performance:Performance,grades:Grades,idcard:IdCardPage,calendar:CalendarPage,updates:Updates,markattendance:MarkAttendance,...PAGES};
export default function App(){const {user,ready}=useApp(),[hash,setHash]=useState(location.hash.slice(1)),[open,setOpen]=useState(false);
useEffect(()=>{const f=()=>{setHash(location.hash.slice(1));setOpen(false);scrollTo(0,0)};addEventListener('hashchange',f);return()=>removeEventListener('hashchange',f)},[]);
if(!ready)return <><Scene3D/><div className="splash"><div className="spin"/></div></>;
if(!user){const m=hash.match(/^portal\/(admin|teacher|student)$/);return <><Scene3D/>{m?<AuthPage key={m[1]} role={m[1]}/>:<Portals/>}<Toast/></>}
const page=ACC[user.role][hash]?hash:'dashboard',Page=ALL[page];
return <><Scene3D dim/><div className="shell"><Sidebar page={page} open={open}/><div><Topbar title={M[page][0]} onMenu={()=>setOpen(o=>!o)}/><main><Reveal key={page}><Page/></Reveal></main></div></div><WhatsNew/><Toast/></>}
