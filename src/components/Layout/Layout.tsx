import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import type { LayoutProps } from '../../types/layout.types';
import { useScrollToTop } from '../../hooks';
import { gsap, prefersReducedMotion, registerGsap, ScrollTrigger } from '../../lib/gsap';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useScrollToTop();
  const location = useLocation();
  const mainRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    registerGsap();
    const node = mainRef.current;
    if (!node) return;

    if (prefersReducedMotion()) {
      gsap.set(node, { clearProps: 'all', opacity: 1, y: 0 });
      ScrollTrigger.refresh();
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      );
    }, node);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-ink-50 text-ink-900">
      <Header />
      <main ref={mainRef} className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
