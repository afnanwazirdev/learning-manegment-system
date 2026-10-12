import { AppProvider } from './context/AppContext';
import App from './App';

export default function ClientApp() {
  return <AppProvider><App /></AppProvider>;
}
