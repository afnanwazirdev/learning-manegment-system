import {useApp} from '../../context/AppContext';
export default function Toast(){const {toast}=useApp();return <div id="toast" className={(toast.t?'on ':'')+(toast.k=='error'?'err':'')} role="status">{toast.t}</div>}
