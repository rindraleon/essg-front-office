import { QueryClientProvider } from '@tanstack/react-query';
import './styles/index.css';
import { AppRoutes } from './routes';
import { Layout } from './components';
import { queryClient } from './lib/query-client';
import AppToaster from './components/common/AppToaster';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <AppRoutes />
      </Layout>
      {/* Notifications : montées une seule fois pour toute l'application. */}
      <AppToaster />
    </QueryClientProvider>
  );
}

export default App;
