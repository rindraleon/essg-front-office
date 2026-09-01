import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  ExternalLink,
  Facebook,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

import EssG from '../../assets/files/images/logo/EssG.png';
import type { FooterProps, SocialItem } from '@/types';
import { useAdmissionsOuvertes } from '@/hooks';

const SOCIAL_ICONS = {
  web: Globe,
  linkedin: Linkedin,
  facebook: Facebook,
} as const;

const DEFAULT_PROPS = {
  companyName: 'ESSG' as const,

  navLinks: [
    { label: 'Accueil', to: '/' },
    { label: 'À propos', to: '/about' },
    { label: 'Formations', to: '/formations' },
    { label: 'Projets', to: '/projets' },
    { label: 'Actualités', to: '/actualites' },
    { label: 'Partenaires', to: '/partenaires' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Admission', to: '/admission' },
  ],

  contact: {
    email: 'essg@univ-fianarantsoa.mg',
    phone: '+261 38 18 282 49',
    address: 'Andrainjato, Université de Fianarantsoa, Madagascar',
  },

  socials: [
    { href: 'https://www.essg.sn', kind: 'web' as const, ariaLabel: 'Site officiel ESSG' },
    {
      href: 'https://www.linkedin.com/company/essg',
      kind: 'linkedin' as const,
      ariaLabel: 'LinkedIn ESSG',
    },
    {
      href: 'https://www.facebook.com/profile.php?id=61588935937597',
      kind: 'facebook' as const,
      ariaLabel: 'Facebook ESSG',
    },
  ],
};

const LINK_CLASS =
  'text-ink-300 transition-colors duration-(--duration-quick) hover:text-white focus-visible:outline-none focus-visible:text-white';

const SocialIcon = ({ kind }: { kind: SocialItem['kind'] }) => {
  const IconComponent = SOCIAL_ICONS[kind as keyof typeof SOCIAL_ICONS] || ExternalLink;
  return <IconComponent className="size-4" strokeWidth={1.8} />;
};

const Footer = ({
  companyName = DEFAULT_PROPS.companyName,
  navLinks = DEFAULT_PROPS.navLinks,
  contact = DEFAULT_PROPS.contact,
  socials = DEFAULT_PROPS.socials,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const admissionsOuvertes = useAdmissionsOuvertes();
  const visibleNavLinks = admissionsOuvertes
    ? navLinks
    : navLinks.filter((item) => item.to !== '/admission');

  return (
    <footer data-surface="dark" className="relative isolate overflow-hidden bg-ink-950 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="select-none whitespace-nowrap text-[6rem] font-black leading-none tracking-[-0.08em] text-white/[0.035] sm:text-[9rem] lg:text-[12rem]">
          {companyName}
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-brand-400/[0.07] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full bg-brand-500/[0.07] blur-3xl"
      />

      <div className="section-shell relative py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 transition-transform duration-(--duration-hover) hover:scale-[1.04]"
              aria-label="Accueil ESSG"
            >
              <img
                src={EssG}
                alt="Logo ESSG"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain"
              />
            </Link>

            <div className="min-w-0">
              <p className="text-body font-bold leading-tight tracking-tight text-white">
                {companyName}
              </p>
              <p className="text-caption leading-5 text-ink-400">
                École Supérieure de Sciences Géomatiques
              </p>
            </div>
          </div>

          <nav aria-label="Navigation du pied de page" className="lg:pt-1">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-small lg:justify-center">
              {visibleNavLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={LINK_CLASS}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 lg:pt-0.5">
            {socials.map((social) => (
              <a
                key={`${social.kind}-${social.href}`}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.ariaLabel}
                className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] text-ink-300 transition-[color,border-color,background-color,transform] duration-(--duration-hover) hover:border-brand-400/30 hover:bg-brand-400/10 hover:text-brand-300"
              >
                <SocialIcon kind={social.kind} />
              </a>
            ))}

            <Link
              to="/contact"
              className="group ml-1 inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-400/25 bg-brand-400/[0.08] px-3 text-caption font-medium text-brand-300 transition-colors duration-(--duration-hover) hover:border-brand-400/40 hover:bg-brand-400/[0.14] hover:text-brand-200"
            >
              Nous contacter
              <ArrowUpRight className="size-3.5 transition-transform duration-(--duration-hover) group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>
          </div>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/[0.07] pt-5 text-small text-ink-300">
          {contact.address && (
            <li className="flex items-center gap-2">
              <MapPin className="size-4 shrink-0 text-brand-400/80" strokeWidth={1.8} />
              <span className="leading-5">{contact.address}</span>
            </li>
          )}

          {contact.phone && (
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-brand-400/80" strokeWidth={1.8} />
              <a href={`tel:${contact.phone.replaceAll(/\s+/g, '')}`} className={LINK_CLASS}>
                {contact.phone}
              </a>
            </li>
          )}

          {contact.email && (
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-brand-400/80" strokeWidth={1.8} />
              <a href={`mailto:${contact.email}`} className={`${LINK_CLASS} break-all`}>
                {contact.email}
              </a>
            </li>
          )}
        </ul>

        <div className="mt-5 flex flex-col gap-2 border-t border-white/[0.07] pt-4 text-caption text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} {companyName}. Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link to="/mentions-legales" className={LINK_CLASS}>
              Mentions légales
            </Link>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />
            <Link to="/politique-confidentialite" className={LINK_CLASS}>
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
