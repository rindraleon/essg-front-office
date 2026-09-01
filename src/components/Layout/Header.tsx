import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import EssG from '../../assets/files/images/logo/EssG.png';
import { buttonVariants } from '../ui/button-variants';
import { cn } from '@/lib';
import useHeaderScroll from '@/hooks/useHeaderScroll';
import { useAdmissionsOuvertes } from '@/hooks';

const NAVIGATION = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Formations', href: '/formations' },
  { name: 'Projets', href: '/projets' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'Partenaires', href: '/partenaires' },
] as const;

const NAV_LINK_CLASS =
  'relative py-2 text-small font-medium text-ink-600 transition-colors duration-(--duration-quick) hover:text-brand-700 ' +
  'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-600 ' +
  'after:origin-center after:scale-x-0 after:transition-transform after:duration-(--duration-hover) hover:after:scale-x-100';

const MOBILE_NAV_LINK_CLASS =
  'block rounded-xl px-4 py-[clamp(0.5rem,1.4vh,0.75rem)] text-small font-medium text-ink-700 transition-[background-color,color,opacity,transform] duration-(--duration-hover) ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-body ' +
  'hover:-translate-x-1 hover:bg-brand-50 hover:text-brand-700 motion-reduce:transition-none motion-reduce:hover:translate-x-0';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const admissionsOuvertes = useAdmissionsOuvertes();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const scrolled = useHeaderScroll(16);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstEl) {
          event.preventDefault();
          lastEl.focus();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    };

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    document.addEventListener('keydown', handleKeyDown);
    const firstLink = mobileMenuRef.current?.querySelector<HTMLAnchorElement>('a');
    const focusTimer = window.setTimeout(() => firstLink?.focus(), 120);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false);
    };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  let headerSurface = 'border-ink-100/70 bg-white/90 backdrop-blur-sm';
  if (scrolled) {
    headerSurface =
      'border-white/35 bg-white/40 shadow-[0_8px_28px_-18px_rgba(27,31,34,0.38)] backdrop-blur-xl backdrop-saturate-150';
  }
  if (mobileMenuOpen) {
    headerSurface = 'border-ink-100 bg-white/95 shadow-card backdrop-blur-xl';
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color,backdrop-filter] duration-(--duration-hover)',
        headerSurface
      )}
    >
      <nav className="section-shell">
        <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <Link to="/" className="flex items-center" aria-label="Retour à l'accueil">
            <img
              src={EssG}
              alt="Logo ESSG"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className={cn(
                'h-11 w-auto origin-left object-contain transition-transform duration-(--duration-hover) ease-out sm:h-12',
                'motion-reduce:transition-none',
                scrolled && 'scale-[0.88]'
              )}
            />
          </Link>

          <div className="hidden lg:flex lg:items-center lg:gap-7">
            {NAVIGATION.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(NAV_LINK_CLASS, isActive && 'text-brand-700 after:scale-x-100')
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Link to="/contact" className={cn(buttonVariants({ variant: 'outline' }))}>
              Contact
            </Link>
            {admissionsOuvertes && (
              <Link to="/admission" className={cn(buttonVariants({ variant: 'default' }))}>
                Admission
              </Link>
            )}
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className={cn(
              'relative inline-flex size-10 items-center justify-center overflow-hidden rounded-xl border border-brand-100 bg-brand-50 text-brand-800 transition-[background-color,color,transform] duration-(--duration-hover) hover:bg-brand-100 active:scale-[0.98] lg:hidden motion-reduce:transition-none motion-reduce:active:scale-100',
              mobileMenuOpen && 'border-brand-200 bg-brand-100'
            )}
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu
              className={cn(
                'absolute size-5 transition-[opacity,transform] duration-(--duration-hover) ease-out',
                mobileMenuOpen ? 'rotate-90 scale-75 opacity-0' : 'rotate-0 scale-100 opacity-100'
              )}
            />
            <X
              className={cn(
                'absolute size-5 transition-[opacity,transform] duration-(--duration-hover) ease-out',
                mobileMenuOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-75 opacity-0'
              )}
            />
          </button>
        </div>
      </nav>

      <button
        type="button"
        aria-label="Fermer le menu"
        tabIndex={mobileMenuOpen ? 0 : -1}
        onClick={closeMobileMenu}
        className={cn(
          'absolute left-0 right-0 top-full z-40 h-[calc(100dvh-4rem)] bg-ink-950/25 transition-[opacity,backdrop-filter] duration-[420ms] ease-out sm:h-[calc(100dvh-4.5rem)] lg:hidden',
          mobileMenuOpen
            ? 'opacity-100 backdrop-blur-[2px]'
            : 'pointer-events-none opacity-0 backdrop-blur-none',
          'motion-reduce:transition-none'
        )}
      />

      <div
        id="mobile-navigation"
        ref={mobileMenuRef}
        aria-hidden={!mobileMenuOpen}
        className={cn(
          'absolute right-0 top-full z-50 h-[calc(100dvh-4rem)] w-[min(18rem,calc(100vw-1.5rem))] transform-gpu overflow-hidden border-l border-ink-100 bg-white px-4 shadow-elevated will-change-transform transition-[opacity,transform] duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:h-[calc(100dvh-4.5rem)] lg:hidden',
          mobileMenuOpen
            ? 'translate-x-0 opacity-100'
            : 'pointer-events-none translate-x-[102%] opacity-0',
          'motion-reduce:transition-none'
        )}
      >
        <div className="h-full overflow-y-auto overscroll-contain">
          <div className="flex min-h-full flex-col justify-start gap-[clamp(0.2rem,0.7vh,0.4rem)] py-[clamp(0.5rem,2vh,1.25rem)]">
            {NAVIGATION.map((item, index) => (
              <NavLink
                key={item.name}
                to={item.href}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={cn(
                  MOBILE_NAV_LINK_CLASS,
                  mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                )}
                style={{ transitionDelay: mobileMenuOpen ? `${90 + index * 45}ms` : '0ms' }}
                onClick={closeMobileMenu}
              >
                {item.name}
              </NavLink>
            ))}
            <div
              className={cn(
                'mt-[clamp(0.25rem,1vh,0.75rem)] space-y-2 border-t border-ink-100 pt-[clamp(0.5rem,1.5vh,1rem)] transition-[opacity,transform] duration-(--duration-hover) ease-out motion-reduce:transition-none',
                mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              )}
              style={{ transitionDelay: mobileMenuOpen ? '380ms' : '0ms' }}
            >
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                tabIndex={mobileMenuOpen ? 0 : -1}
                className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              >
                Contact
              </Link>
              {admissionsOuvertes && (
                <Link
                  to="/admission"
                  onClick={closeMobileMenu}
                  tabIndex={mobileMenuOpen ? 0 : -1}
                  className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
                >
                  Admission
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
