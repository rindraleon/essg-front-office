import { Toaster } from 'react-hot-toast';
import { GREEN } from '@/constants';

const AppToaster = () => (
  <Toaster
    position="top-right"
    containerStyle={{ top: 88 }}
    toastOptions={{
      duration: 5000,
      style: {
        background: 'var(--color-ink-950)',
        color: '#ffffff',
        borderRadius: '0.75rem',
        padding: '12px 16px',
        fontSize: '0.875rem',
        maxWidth: '420px',
        boxShadow: '0 8px 20px -6px rgb(15 33 30 / 0.35)',
      },
      success: {
        duration: 5000,
        iconTheme: { primary: GREEN[600], secondary: '#ffffff' },
      },
      error: {
        duration: 7000,
        iconTheme: { primary: 'var(--color-danger-500)', secondary: '#ffffff' },
      },
    }}
  />
);

export default AppToaster;
