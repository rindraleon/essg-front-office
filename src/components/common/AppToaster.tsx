import { Toaster } from 'react-hot-toast';
import { GREEN } from '../../constants/colors';

/**
 * Point de montage UNIQUE des notifications du site public.
 *
 * Auparavant, chaque page (Contact, Admission) montait son propre `<Toaster>`
 * avec sa propre configuration dupliquée : les toasts déclenchés depuis une
 * page sans Toaster n'apparaissaient jamais, et deux Toasters pouvaient
 * coexister lors des transitions de route.
 *
 * Monté une seule fois dans `App`, il couvre désormais toute l'application
 * avec un style unique conforme à la charte ESSG.
 */
const AppToaster = () => (
  <Toaster
    position="top-right"
    // Marge sous le header fixe, pour ne pas recouvrir la navigation.
    containerStyle={{ top: 88 }}
    toastOptions={{
      duration: 5000,
      style: {
        background: '#1e2829',
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
        // Un message d'erreur doit rester lisible plus longtemps.
        duration: 7000,
        iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
      },
    }}
  />
);

export default AppToaster;
