import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import BackToTop from '../common/BackToTop';
import ScrollProgress from '../common/ScrollProgress';
import type { LayoutProps } from '@/types';
import { useScrollToTop } from '@/hooks';
import SocialLinks from '../common/SocialLinks';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useScrollToTop();
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-ink-50 text-ink-900">
      {/* Lien d'évitement : premier élément focusable de la page, il
          permet d'atteindre le contenu sans parcourir toute la
          navigation au clavier (WCAG 2.4.1). */}
      <a
        href="#contenu"
        className="sr-only z-[60] rounded-lg bg-brand-700 px-4 py-2 text-small font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Aller au contenu principal
      </a>
      <ScrollProgress />
      <Header />
      <main id="contenu" tabIndex={-1} className="w-full flex-1 focus:outline-none">
        <div key={location.pathname} className="page-transition">
          {children}
        </div>
      </main>
      <Footer />
      <SocialLinks fixed size={24} />
      <BackToTop />
    </div>
  );
};

export default Layout;
