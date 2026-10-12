import Modal from './Modal';import Badge from './Badge';import {grade} from '../../utils';
const X={idNo:'ID number',gender:'Gender',dob:'Date of birth',address:'Address',guardian:'Guardian',guardianMobile:'Guardian mobile',bloodGroup:'Blood group',qualification:'Qualification',experience:'Experience (years)',designation:'Designation',joined:'Joined'};
export default function DetailModal({title,cols,row,onClose}){const ks=cols.map(c=>c[0]);
return <Modal onClose={onClose}><div className="modal"><h3>{title}</h3><dl className="dtl">{cols.map(c=><div key={c[0]}><dt>{c[1]}</dt><dd>{c[0]=='grade'?<Badge value={grade(row)}/>:Array.isArray(c[2])?<Badge value={row[c[0]]}/>:String(row[c[0]]||'-')}</dd></div>)}
{Object.keys(X).filter(k=>row[k]&&!ks.includes(k)).map(k=><div key={k}><dt>{X[k]}</dt><dd>{String(row[k])}</dd></div>)}</dl><div className="acts"><button className="btn" onClick={onClose}>Close</button></div></div></Modal>}
