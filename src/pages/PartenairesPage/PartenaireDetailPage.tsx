import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  Calendar,
  FolderKanban,
  Globe,
  GraduationCap,
  Handshake,
  Info,
  Mail,
  Tag,
} from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import Button from '@/components/compat/button';
import { Link, Link as RouterLink, useParams } from 'react-router-dom';
import { CtaSection, EmptyState, Breadcrumb } from '../../components';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import { InfoTile, ProfileSection } from '../../components/common/ProfileLayout';
import { usePartenaireBySlug } from '../../hooks';
import useProjets from '../../hooks/useProjets';
import { useTitle } from '../../hooks/useTitle';
import { getImageUrl } from '../../utils/image.utils';

/** Icône illustrant la catégorie du partenaire. */
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Entreprise':
      return <Building2 className="size-4" />;
    case 'Institution':
      return <Globe className="size-4" />;
    case 'Organisation':
      return <GraduationCap className="size-4" />;
    default:
      return <Handshake className="size-4" />;
  }
};

const formatDate = (date?: string): string => {
  if (!date) return '';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

/** Normalise un nom pour rapprocher un projet de son partenaire. */
const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

/**
 * Fiche publique d'un partenaire.
 *
 * Reprend délibérément la structure, la hiérarchie typographique et les
 * animations de la fiche Ressource humaine : bandeau d'identité, colonne
 * principale, colonne latérale. Les deux pages partagent les mêmes
 * composants (`ProfileSection`, `InfoTile`, `RevealOnScroll`), afin que
 * l'utilisateur les perçoive comme un même système de design.
 */
const PartenaireDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { partenaire, loading, error } = usePartenaireBySlug(slug || '');
  const { projets } = useProjets();
  const { setTitle } = useTitle();
  useTitle(partenaire ? partenaire.nom : 'Partenaire | ESSG');

  useEffect(() => {
    if (partenaire) setTitle(partenaire.nom);
  }, [partenaire, setTitle]);

  /**
   * Projets rattachés à ce partenaire.
   *
   * Le lien se fait sur le nom : c'est ce que l'API expose dans le tableau
   * `partenaires` de chaque projet. La comparaison est insensible à la casse
   * et aux accents pour absorber les écarts de saisie.
   */
  const projetsAssocies = useMemo(() => {
    if (!partenaire || !projets) return [];
    const cible = normalize(partenaire.nom);
    return projets.filter((projet) =>
      (projet.partenaires ?? []).some((nom: string) => normalize(nom) === cible),
    );
  }, [partenaire, projets]);

  /* ─── Chargement et erreur ─── */

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Squelette calqué sur la mise en page finale : aucun saut. */}
          <div className="space-y-8">
            <div className="skeleton-shimmer h-64 rounded-3xl" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="skeleton-shimmer h-80 rounded-2xl lg:col-span-2" />
              <div className="skeleton-shimmer h-80 rounded-2xl" />
            </div>
          </div>
          <p className="sr-only">Chargement du partenaire…</p>
        </div>
      </div>
    );
  }

  if (error || !partenaire) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<Handshake />}
            title="Partenaire introuvable"
            description="Le partenaire que vous recherchez n'existe pas ou a été retiré."
            actionLabel="Retour aux partenaires"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/partenaires"
              variant="outlined"
              startIcon={<ArrowLeft className="size-4" />}
            >
              Retour aux partenaires
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Données ─── */

  const logoUrl = partenaire.logo ? getImageUrl(partenaire.logo) : '';
  const initiales = partenaire.nom.slice(0, 2).toUpperCase();

  /** Le contact peut être un email ou un téléphone selon la saisie. */
  const contactEstEmail = Boolean(partenaire.contact?.includes('@'));

  const infos = [
    partenaire.type && {
      icon: getTypeIcon(partenaire.type),
      label: 'Type',
      value: partenaire.type,
    },
    partenaire.secteur && {
      icon: <Tag className="size-5" />,
      label: 'Secteur',
      value: partenaire.secteur,
    },
    partenaire.pays && {
      icon: <Globe className="size-5" />,
      label: 'Pays',
      value: partenaire.pays,
    },
    partenaire.dateDebut && {
      icon: <Calendar className="size-5" />,
      label: 'Partenaire depuis',
      value: formatDate(partenaire.dateDebut),
    },
    partenaire.contact && {
      icon: <Mail className="size-5" />,
      label: 'Contact',
      value: partenaire.contact,
      href: contactEstEmail
        ? `mailto:${partenaire.contact}`
        : `tel:${partenaire.contact.replace(/\s+/g, '')}`,
    },
  ].filter(Boolean) as {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
  }[];

  /* Échelonnement des sections, identique à la fiche Ressource humaine. */
  let delay = 0;
  const nextDelay = () => {
    delay += 90;
    return delay;
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* ═══ Bandeau d'identité ═══ */}
      <header className="relative overflow-hidden bg-brand-950 pt-24 pb-16 text-white sm:pt-28 sm:pb-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_20%_0%,#27564e_0%,#173832_50%,#0b1917_100%)]" />
          <div className="absolute -right-24 -top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(152,192,112,0.20),transparent_65%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-7 text-center sm:flex-row sm:items-end sm:text-left">
            {/* Logo : fond clair, car la plupart des logos sont conçus
                pour être posés sur du blanc. */}
            <RevealOnScroll direction="none" className="shrink-0">
              <div className="grid size-36 place-items-center overflow-hidden rounded-3xl border-4 border-white/15 bg-white p-4 shadow-2xl sm:size-44">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={`Logo ${partenaire.nom}`}
                    loading="eager"
                    decoding="async"
                    className="max-h-full max-w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-h1 font-bold text-brand-600">{initiales}</span>
                )}
              </div>
            </RevealOnScroll>

            <div className="min-w-0 flex-1">
              <RevealOnScroll delay={80}>
                <p className="text-caption uppercase text-sage-300">Partenaire ESSG</p>
                <h1 className="mt-2 text-display text-white">{partenaire.nom}</h1>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {partenaire.type && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-small font-medium text-white backdrop-blur-md">
                      {getTypeIcon(partenaire.type)}
                      {partenaire.type}
                    </span>
                  )}
                  {partenaire.secteur && (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-small font-medium text-white backdrop-blur-md">
                      <Tag className="size-3.5" />
                      {partenaire.secteur}
                    </span>
                  )}
                </div>
              </RevealOnScroll>

              {partenaire.siteWeb && (
                <RevealOnScroll delay={180}>
                  <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:justify-start">
                    <a
                      href={partenaire.siteWeb}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-sage-400 px-4 py-2 text-small font-semibold text-brand-950 transition-colors duration-200 hover:bg-sage-300 motion-reduce:transition-none"
                    >
                      <Globe className="size-4" />
                      Visiter le site
                      <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                </RevealOnScroll>
              )}
            </div>
          </div>
        </div>
      </header>

      <Breadcrumb
        items={[{ label: 'Partenaires', to: '/partenaires' }, { label: partenaire.nom }]}
      />

      {/* ═══ Contenu ═══ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* ── Colonne principale ── */}
          <div className="space-y-6 lg:col-span-2">
            <ProfileSection
              title="À propos du partenaire"
              icon={<Info className="size-5" />}
              delay={nextDelay()}
            >
              <p className="whitespace-pre-wrap text-body leading-7 text-ink-600">
                {partenaire.description ||
                  `${partenaire.nom} accompagne l'ESSG dans sa mission de formation et de recherche en sciences géomatiques.`}
              </p>
            </ProfileSection>

            {/* Projets menés avec ce partenaire */}
            {projetsAssocies.length > 0 && (
              <ProfileSection
                title="Projets associés"
                icon={<FolderKanban className="size-5" />}
                count={projetsAssocies.length}
                delay={nextDelay()}
              >
                <ul className="grid gap-3 sm:grid-cols-2">
                  {projetsAssocies.map((projet) => (
                    <li key={projet.id}>
                      <Link
                        to={`/projets/${projet.slug ?? projet.id}`}
                        className="group flex h-full flex-col rounded-xl border border-ink-100 bg-ink-50/60 p-4 no-underline transition-colors duration-200 hover:border-brand-200 hover:bg-brand-50/60 motion-reduce:transition-none"
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-h4 text-ink-900">{projet.titre}</span>
                          <ArrowUpRight className="size-4 shrink-0 text-ink-400 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-brand-600 motion-reduce:transition-none" />
                        </span>
                        {projet.type && (
                          <span className="mt-1 text-caption uppercase text-ink-400">
                            {projet.type}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </ProfileSection>
            )}
          </div>

          {/* ── Colonne latérale ── */}
          <aside className="space-y-6">
            {infos.length > 0 && (
              <ProfileSection
                title="Informations"
                icon={<Handshake className="size-5" />}
                delay={nextDelay()}
              >
                <div className="grid gap-3">
                  {infos.map((info) => (
                    <InfoTile
                      key={info.label}
                      icon={info.icon}
                      label={info.label}
                      value={info.value}
                      href={info.href}
                    />
                  ))}
                </div>
              </ProfileSection>
            )}

            {partenaire.siteWeb && (
              <ProfileSection
                title="Site web"
                icon={<Globe className="size-5" />}
                delay={nextDelay()}
              >
                <InfoTile
                  icon={<Globe className="size-5" />}
                  label="Site officiel"
                  value={partenaire.siteWeb.replace(/^https?:\/\//, '')}
                  href={partenaire.siteWeb}
                  external
                />
              </ProfileSection>
            )}
          </aside>
        </div>
      </div>

      <CtaSection
        icon={<Handshake />}
        title="Devenir partenaire de l'ESSG"
        description="Rejoignez notre réseau et participez au développement des sciences géomatiques à Madagascar."
        primaryLabel="Nous contacter"
        primaryLink="/contact"
        secondaryLabel="Voir tous les partenaires"
        secondaryLink="/partenaires"
      />
    </div>
  );
};

export default PartenaireDetailPage;
