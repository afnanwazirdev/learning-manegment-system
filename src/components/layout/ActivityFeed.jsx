import {useApp} from '../../context/AppContext';import Icon from '../common/Icon';import {ago} from '../../utils';
export default function ActivityFeed(){const {activity}=useApp(),L=activity.slice(0,6);
return <div className="card"><h3>Latest updates</h3>{L.length?L.map(e=><div className="li feed" key={e.id}><span className="fi"><Icon n={e.coll} size={15}/></span><div><b>{e.text}</b><small>{ago(e.ts)}</small></div></div>):<p className="empty">Nothing new yet.</p>}<a className="more" href="#updates">View all updates</a></div>}
