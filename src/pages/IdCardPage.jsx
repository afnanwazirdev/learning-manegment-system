import {useApp} from '../context/AppContext';import IdCard from '../components/idcard/IdCard';import Icon from '../components/common/Icon';import {downloadCard} from '../components/idcard/drawCard';import {printIt} from '../utils';
export default function IdCardPage(){const {user,settings,say}=useApp();
return <div className="idpage"><div className="card"><h3>Your digital ID card</h3><p className="mut">Generated automatically from your registration. Keep your profile up to date and the card updates too.</p>
<IdCard p={user} role={user.role} school={settings.school}/><div className="acts" style={{justifyContent:'center'}}><button className="btn ghost" onClick={()=>printIt('printing')}><Icon n="print" size={16}/>Print</button>
<button className="btn" onClick={()=>downloadCard(user,user.role,settings.school).catch(()=>say('Could not create the image. Try Print instead.','error'))}><Icon n="download" size={16}/>Download PNG</button></div></div></div>}
