import dynamic from 'next/dynamic';
import '../src/styles.css';

const ClientApp = dynamic(() => import('../src/ClientApp'), { ssr: false });

export default function AppRoot() {
  return <ClientApp />;
}
