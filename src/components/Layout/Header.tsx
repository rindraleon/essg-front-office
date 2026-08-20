import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import EssG from '../../assets/files/images/logo/EssG.png';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { playIntro } from '../../animations/presets';
import useHeaderScroll from '../../hooks/useHeaderScroll';
import { useAdmissionsOuvertes } from '../../hooks/useAdmissionsSettings';
import { gsap, prefersReducedMotion, registerGsap } from '../../lib/gsap';

const NAVIGATION = [
  { name: 'Accueil', href: '/' },
  { name: 'À propos', href: '/about' },
  { name: 'Formations', href: '/formations' },
  { name: 'Actualités', href: '/actualites' },
  { name: 'Projets', href: '/projets' },
  { name: 'Partenaires', href: '/partenaires' },
] as const;

const NAV_LINK_CLASS =
  'relative py-2 text-small font-medium text-ink-600 transition-colors duration-200 hover:text-brand-700 ' +
  'after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-brand-600 ' +
  'after:origin-center after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100';

const MOBILE_NAV_LINK_CLASS =
  'block rounded-xl px-4 py-2.5 text-body font-medium text-ink-700 transition-colors duration-150 hover:bg-brand-50 hover:text-brand-700';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const admissionsOuvertes = useAdmissionsOuvertes();
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const actionsRef = useRef<HTMLDivElement | null>(null);
  const scrolled = useHeaderScroll(16);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    registerGsap();
    const ctx = gsap.context(() => {
      playIntro({
        header,
        logo: logoRef.current,
        nav: navRef.current ? Array.from(navRef.current.querySelectorAll('a')) : [],
        actions: actionsRef.current,
      });
    }, header);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const node = mobileMenuRef.current;
    if (!node || !mobileMenuOpen) return;
    registerGsap();
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // §7.11 — Navigation : 180–220 ms. Une transition plus longue sur un
      // menu se ressent directement comme une lenteur de l'interface,
      // puisqu'elle s'interpose entre le clic et l'action voulue.
      gsap.fromTo(
        node,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        node.querySelectorAll('a'),
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.18, stagger: 0.03, delay: 0.03 }
      );
    }, node);

    return () => ctx.revert();
  }, [mobileMenuOpen]);

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'border-ink-100 bg-white/95 shadow-[0_8px_24px_-18px_rgba(15,33,30,0.45)]'
          : 'border-transparent bg-white/75'
      )}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/*
          Hauteur FIXE. La version précédente animait `height`, ce qui
          force le navigateur à recalculer la mise en page de la page
          entière à chaque frame du défilement (§7.17).
          La réduction visuelle passe désormais par `scale` sur le logo :
          même effet perçu, composé par le GPU, aucun reflow.
        */}
        <div className="flex h-16 items-center justify-between sm:h-[4.5rem]">
          <Link ref={logoRef} to="/" className="flex items-center" aria-label="Retour à l'accueil">
            <img
              src={EssG}
              alt="Logo ESSG"
              className={cn(
                'h-14 w-auto origin-left object-contain transition-transform duration-300 ease-out sm:h-16',
                'motion-reduce:transition-none',
                scrolled && 'scale-[0.88]'
              )}
            />
          </Link>

          <div ref={navRef} className="hidden lg:flex lg:items-center lg:gap-7">
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

          <div ref={actionsRef} className="hidden lg:flex lg:items-center lg:gap-3">
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
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border border-brand-100 bg-brand-50 text-brand-800 transition-colors hover:bg-brand-100 lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div ref={mobileMenuRef} className="border-t border-ink-100 py-4 lg:hidden">
            <div className="space-y-1.5">
              {NAVIGATION.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={MOBILE_NAV_LINK_CLASS}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="space-y-2.5 pt-4">
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
                >
                  Contact
                </Link>
                {admissionsOuvertes && (
                  <Link
                    to="/admission"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(buttonVariants({ variant: 'default' }), 'w-full')}
                  >
                    Admission
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
