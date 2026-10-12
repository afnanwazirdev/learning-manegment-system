import {useApp} from '../../context/AppContext';
export default function FormField({col,value,locked,error}){const {people}=useApp(),[k,l,t]=col,n={name:k,defaultValue:value};
return <label>{l}{Array.isArray(t)?<select {...n}>{t.map(x=><option key={x}>{x}</option>)}</select>:t=='a'?<textarea {...n} rows={3}/>:<input {...n} list={k=='to'?'people':undefined} readOnly={locked} type={{n:'number',d:'date',e:'email'}[t]||'text'}/>}{k=='to'&&<datalist id="people">{people.map(x=><option key={x.name+x.role} value={x.name}>{x.role}</option>)}</datalist>}<span className="err">{error}</span></label>}
