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
import type { FooterProps, SocialItem } from '../../types/footer.types';
import { useAdmissionsOuvertes } from '../../hooks/useAdmissionsSettings';

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
    { label: 'Admission', to: '/admission' },
  ],

  contact: {
    email: 'contact@essg.sn',
    phone: '+261 38 18 282 49',
    address: 'ESSG e-atiala Andrainjato Université Fianarantsoa, Madagascar',
  },

  socials: [
    {
      href: 'https://www.essg.sn',
      kind: 'web' as const,
      ariaLabel: 'Site officiel ESSG',
    },
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

  const SocialIcon = ({ kind }: { kind: SocialItem['kind'] }) => {
    const IconComponent = SOCIAL_ICONS[kind as keyof typeof SOCIAL_ICONS] || ExternalLink;

    return <IconComponent className="size-[17px]" strokeWidth={1.8} />;
  };

  return (
    <footer data-surface="dark" className="relative isolate overflow-hidden bg-ink-950 text-white">
      {/* Large ESSG typography */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -bottom-12 left-1/2
          -translate-x-1/2
          select-none
          whitespace-nowrap
          text-[18rem]
          font-black
          leading-none
          tracking-[-0.08em]
          text-white/[0.025]
          sm:text-[22rem]
          lg:text-[30rem]
        "
      >
        ESSG
      </div>

      {/* Green atmospheric glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -top-48 left-1/3
          h-[32rem] w-[32rem]
          rounded-full
          bg-sage-400/[0.08]
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -bottom-40 right-0
          h-[28rem] w-[28rem]
          rounded-full
          bg-brand-500/[0.08]
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          left-0 top-0
          h-0 w-0
          border-b-[150px]
          border-l-[150px]
          border-b-transparent
          border-l-sage-400/[0.13]
          sm:border-b-[190px]
          sm:border-l-[190px]
          lg:border-b-[230px]
          lg:border-l-[230px]
        "
      />

      {/* Inner triangle line */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          left-0 top-0
          h-0 w-0
          border-b-[115px]
          border-l-[115px]
          border-b-transparent
          border-l-white/[0.035]
          sm:border-b-[145px]
          sm:border-l-[145px]
          lg:border-b-[175px]
          lg:border-l-[175px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          bottom-0 right-0
          h-0 w-0
          border-l-[150px]
          border-t-[150px]
          border-l-transparent
          border-t-sage-400/[0.10]
          sm:border-l-[190px]
          sm:border-t-[190px]
          lg:border-l-[230px]
          lg:border-t-[230px]
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          bottom-0 right-0
          h-0 w-0
          border-l-[115px]
          border-t-[115px]
          border-l-transparent
          border-t-white/[0.035]
          sm:border-l-[145px]
          sm:border-t-[145px]
          lg:border-l-[175px]
          lg:border-t-[175px]
        "
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link
              to="/"
              className="
                group mb-6 inline-flex
                items-center gap-4
                rounded-2xl
                border border-white/[0.07]
                bg-white/[0.035]
                px-4 py-3
                backdrop-blur-md
                transition-all duration-300
                hover:border-sage-400/20
                hover:bg-white/[0.06]
              "
            >
              <div
                className="
                  flex size-14 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-white
                  p-1.5
                  shadow-[0_10px_35px_rgba(0,0,0,0.25)]
                  transition-transform duration-300
                  group-hover:scale-[1.03]
                "
              >
                <img src={EssG} alt="Logo ESSG" className="h-full w-full object-contain" />
              </div>

              <div>
                <p className="text-h5 font-bold tracking-tight text-white">{companyName}</p>

                <p className="mt-0.5 max-w-[240px] text-caption leading-5 text-ink-300">
                  École Supérieure de Sciences Géomatiques
                </p>
              </div>
            </Link>

            <div className="max-w-xl">
              <p className="text-small leading-7 text-ink-300">
                L&apos;ESSG est un établissement d&apos;enseignement supérieur spécialisé dans la
                formation, la recherche et l&apos;innovation en sciences géomatiques, cartographie,
                télédétection et systèmes d&apos;information géographique.
              </p>

              <p className="mt-4 text-small leading-7 text-ink-400">
                Excellence académique, professionnalisation et ouverture vers les technologies
                spatiales et numériques.
              </p>
            </div>

            {/* Socials */}
            {socials.length > 0 && (
              <div className="mt-7">
                <p className="mb-3 text-caption font-semibold uppercase tracking-[0.18em] text-sage-300/80">
                  Nous suivre
                </p>

                <div className="flex flex-wrap gap-2.5">
                  {socials.map((social) => (
                    <a
                      key={`${social.kind}-${social.href}`}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.ariaLabel}
                      className="
                        group flex size-10
                        items-center justify-center
                        rounded-xl
                        border border-white/[0.08]
                        bg-white/[0.04]
                        text-ink-300
                        backdrop-blur-md
                        transition-all duration-300
                        hover:-translate-y-1
                        hover:border-sage-400/30
                        hover:bg-sage-400/10
                        hover:text-sage-300
                        hover:shadow-[0_10px_30px_rgba(152,192,112,0.10)]
                      "
                    >
                      <SocialIcon kind={social.kind} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div
              className="
                rounded-2xl
                border border-white/[0.06]
                bg-white/[0.025]
                p-5
                backdrop-blur-sm
              "
            >
              <h3 className="mb-5 flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.18em] text-sage-300">
                <span className="h-px w-5 bg-sage-400/60" />
                Navigation
              </h3>

              <ul className="space-y-1">
                {visibleNavLinks.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className="
                        group flex items-center justify-between
                        rounded-lg
                        px-2 py-2
                        text-small text-ink-300
                        transition-all duration-200
                        hover:bg-white/[0.04]
                        hover:text-white
                      "
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className="
                            h-1 w-1 rounded-full
                            bg-sage-400
                            opacity-0
                            transition-all duration-200
                            group-hover:opacity-100
                          "
                        />

                        {item.label}
                      </span>

                      <ArrowUpRight
                        className="
                          size-3.5
                          -translate-x-1
                          opacity-0
                          transition-all duration-200
                          group-hover:translate-x-0
                          group-hover:opacity-60
                        "
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div
              className="
                rounded-2xl
                border border-white/[0.06]
                bg-white/[0.025]
                p-5
                backdrop-blur-sm
              "
            >
              <h3 className="mb-5 flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.18em] text-sage-300">
                <span className="h-px w-5 bg-sage-400/60" />
                Contact
              </h3>

              <ul className="space-y-4">
                {/* Address */}
                <li className="flex gap-3">
                  <div
                    className="
                      mt-0.5 flex size-9 shrink-0
                      items-center justify-center
                      rounded-lg
                      border border-white/[0.07]
                      bg-white/[0.04]
                      text-sage-300
                    "
                  >
                    <MapPin className="size-4" strokeWidth={1.8} />
                  </div>

                  <p className="text-small leading-6 text-ink-300">{contact.address}</p>
                </li>

                {/* Phone */}
                {contact.phone && (
                  <li className="flex gap-3">
                    <div
                      className="
                        flex size-9 shrink-0
                        items-center justify-center
                        rounded-lg
                        border border-white/[0.07]
                        bg-white/[0.04]
                        text-sage-300
                      "
                    >
                      <Phone className="size-4" strokeWidth={1.8} />
                    </div>

                    <a
                      href={`tel:${contact.phone.replaceAll(/\s+/g, '')}`}
                      className="
                        flex items-center
                        text-small text-ink-300
                        transition-colors
                        hover:text-white
                      "
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}

                {/* Email */}
                <li className="flex gap-3">
                  <div
                    className="
                      flex size-9 shrink-0
                      items-center justify-center
                      rounded-lg
                      border border-white/[0.07]
                      bg-white/[0.04]
                      text-sage-300
                    "
                  >
                    <Mail className="size-4" strokeWidth={1.8} />
                  </div>

                  <a
                    href={`mailto:${contact.email}`}
                    className="
                      flex items-center
                      break-all
                      text-small text-ink-300
                      transition-colors
                      hover:text-white
                    "
                  >
                    {contact.email}
                  </a>
                </li>
              </ul>

              {/* CTA */}
              <Link
                to="/contact"
                className="
                  group mt-6
                  flex w-full
                  items-center justify-between
                  rounded-xl
                  border border-sage-400/20
                  bg-sage-400/[0.08]
                  px-4 py-3
                  text-small font-medium
                  text-sage-300
                  transition-all duration-300
                  hover:border-sage-400/30
                  hover:bg-sage-400/[0.13]
                  hover:text-sage-200
                "
              >
                <span>Demande d&apos;information</span>

                <ArrowUpRight
                  className="
                    size-4
                    transition-transform duration-300
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </div>
        </div>

        {/* =========================================================
            BOTTOM BAR
        ========================================================= */}

        <div
          className="
            mt-12
            border-t border-white/[0.08]
            pt-7
          "
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-caption leading-5 text-ink-400">
              © {currentYear} {companyName}. Tous droits réservés.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption">
              <Link
                to="/mentions-legales"
                className="
                  text-ink-400
                  transition-colors duration-200
                  hover:text-white
                "
              >
                Mentions légales
              </Link>

              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-white/20" />

              <Link
                to="/politique-confidentialite"
                className="
                  text-ink-400
                  transition-colors duration-200
                  hover:text-white
                "
              >
                Politique de confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
