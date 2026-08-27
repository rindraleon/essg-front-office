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
import { CompatButton as Button } from '@/components';
import { Link, Link as RouterLink, useParams } from 'react-router-dom';
import { Breadcrumb, DetailHero, EmptyState, InfoTile, ProfileSection } from '@/components';
import { usePartenaireBySlug, useProjets, useTitle } from '@/hooks';
import { getImageUrl } from '@/utils';

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

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const PartenaireDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { partenaire, loading, error } = usePartenaireBySlug(slug || '');
  const { projets } = useProjets();
  const { setTitle } = useTitle();
  useTitle(partenaire ? partenaire.nom : 'Partenaire | ESSG');

  useEffect(() => {
    if (partenaire) setTitle(partenaire.nom);
  }, [partenaire, setTitle]);

  const projetsAssocies = useMemo(() => {
    if (!partenaire || !projets) return [];
    const cible = normalize(partenaire.nom);
    return projets.filter((projet) =>
      (projet.partenaires ?? []).some((nom: string) => normalize(nom) === cible)
    );
  }, [partenaire, projets]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="section-shell section-y">
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
        <div className="section-shell section-y">
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

  const logoUrl = partenaire.logo ? getImageUrl(partenaire.logo) : '';
  const initiales = partenaire.nom.slice(0, 2).toUpperCase();

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

  let delay = 0;
  const nextDelay = () => {
    delay += 90;
    return delay;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 via-white to-brand-50/35">
      <DetailHero
        eyebrow="Partenaire ESSG"
        title={partenaire.nom}
        description={partenaire.description}
        backTo="/partenaires"
        backLabel="Tous les partenaires"
        meta={[
          ...(partenaire.type ? [{ icon: Building2, label: partenaire.type }] : []),
          ...(partenaire.secteur ? [{ icon: Tag, label: partenaire.secteur }] : []),
          ...(partenaire.pays ? [{ icon: Globe, label: partenaire.pays }] : []),
        ]}
        visual={
          <div className="grid size-40 place-items-center overflow-hidden rounded-3xl border-4 border-white/15 bg-white p-5 shadow-2xl sm:size-48">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`Logo ${partenaire.nom}`}
                loading="eager"
                decoding="async"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-display font-bold text-brand-700">{initiales}</span>
            )}
          </div>
        }
        actions={
          partenaire.siteWeb && (
            <a
              href={partenaire.siteWeb}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-2.5 text-small font-bold text-brand-950 hover:bg-brand-300"
            >
              <Globe className="size-4" />
              Visiter le site
              <ArrowUpRight className="size-4" />
            </a>
          )
        }
      />

      <Breadcrumb
        items={[{ label: 'Partenaires', to: '/partenaires' }, { label: partenaire.nom }]}
      />

      <div className="section-shell section-y-tight">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
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
                        className="group flex h-full flex-col rounded-xl border border-ink-100 bg-ink-50/60 p-4 no-underline transition-colors duration-(--duration-quick) hover:border-brand-200 hover:bg-brand-50/60 motion-reduce:transition-none"
                      >
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-h4 text-ink-900">{projet.titre}</span>
                          <ArrowUpRight className="size-4 shrink-0 text-ink-400 transition-transform duration-(--duration-quick) group-hover:-translate-y-0.5 group-hover:text-brand-600 motion-reduce:transition-none" />
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
    </div>
  );
};

export default PartenaireDetailPage;
