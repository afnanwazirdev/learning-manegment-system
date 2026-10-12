import Modal from './Modal';import Icon from './Icon';import {useApp} from '../../context/AppContext';import {printIt} from '../../utils';
export default function ReceiptModal({row,onClose}){const {settings}=useApp();
return <Modal onClose={onClose}><div className="modal"><div className="print-area receipt"><h3>{settings.school}</h3><p className="mut">Fee receipt · No. {String(row.id).slice(-6).toUpperCase()}</p>
<dl className="dtl">{[['Student',row.student],['Month',row.month],['Amount','PKR '+Number(row.amount).toLocaleString()],['Due date',row.due],['Status','Paid']].map(([k,v])=><div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl><p className="mut">Thank you. This is a computer-generated receipt.</p></div>
<div className="acts"><button className="btn ghost" onClick={onClose}>Close</button><button className="btn" onClick={()=>printIt('printing')}><Icon n="print" size={16}/>Print receipt</button></div></div></Modal>}
