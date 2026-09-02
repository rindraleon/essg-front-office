import { QueryClientProvider } from '@tanstack/react-query';
import './styles/index.css';
import { AppRoutes } from '@/routes';
import { Layout } from '@/components';
import { queryClient } from '@/lib';
import { AppToaster } from '@/components';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <AppRoutes />
      </Layout>
      <AppToaster />
    </QueryClientProvider>
  );
}

export default App;
