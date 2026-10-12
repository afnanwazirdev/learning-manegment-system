import {useApp} from '../../context/AppContext';import {ACC,M,GROUPS} from '../../data/config';import Icon from '../common/Icon';
export default function Sidebar({page,open}){const {user,settings,logout}=useApp();
return <aside className={open?'open':''}><div className="brand"><span className="logo"><Icon n="students" size={20}/></span><div>{settings.school}<small>{user.role[0].toUpperCase()+user.role.slice(1)} portal</small></div></div>
<nav>{GROUPS.map(([g,ks])=>{const L=ks.filter(k=>ACC[user.role][k]);return L.length?<div className="grp" key={g}><small>{g}</small>{L.map(k=><a key={k} href={'#'+k} className={k==page?'on':''}><Icon n={k}/><span>{M[k][0]}</span></a>)}</div>:null})}</nav>
<button className="out" onClick={logout}><Icon n="logout"/>Sign out</button></aside>}
