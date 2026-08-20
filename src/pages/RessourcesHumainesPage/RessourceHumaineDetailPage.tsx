import {
  ArrowLeft,
  Award,
  Briefcase,
  Building2,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import Button from '@/components/compat/button';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { CtaSection, EmptyState, Breadcrumb } from '../../components';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import {
  CheckList,
  InfoTile,
  ProfileSection,
  TagCloud,
  Timeline,
} from '../../components/common/ProfileLayout';
import { useRessourceHumaineBySlug } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import { getImageUrl } from '../../utils/image.utils';
import { formatFullName, getPersonInitials } from '../../utils/name.utils';

/**
 * Fiche publique d'un membre de l'équipe.
 *
 * Présentation de type « profil professionnel » : bandeau d'identité, puis
 * sections thématiques révélées progressivement au défilement.
 *
 * Le parcours (expériences, diplômes, formations, compétences, langues) était
 * renvoyé par l'API mais absent du type TypeScript côté frontend : les données
 * arrivaient sans jamais être affichées. Elles le sont désormais.
 */
const RessourceHumaineDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { ressourceHumaine, loading, error } = useRessourceHumaineBySlug(slug || '');
  const { setTitle } = useTitle();
  useTitle(
    ressourceHumaine
      ? formatFullName(ressourceHumaine)
      : 'Ressource Humaine | ESSG',
  );

  useEffect(() => {
    if (ressourceHumaine) {
      setTitle(formatFullName(ressourceHumaine));
    }
  }, [ressourceHumaine, setTitle]);

  /* Coordonnées disponibles, converties en tuiles cliquables. */
  const contacts = useMemo(() => {
    if (!ressourceHumaine) return [];

    return [
      ressourceHumaine.email && {
        icon: <Mail className="size-5" />,
        label: 'Email',
        value: ressourceHumaine.email,
        href: `mailto:${ressourceHumaine.email}`,
      },
      ressourceHumaine.telephone && {
        icon: <Phone className="size-5" />,
        label: 'Téléphone',
        value: ressourceHumaine.telephone,
        href: `tel:${ressourceHumaine.telephone.replace(/\s+/g, '')}`,
      },
      ressourceHumaine.adresse && {
        icon: <MapPin className="size-5" />,
        label: 'Adresse',
        value: ressourceHumaine.adresse,
      },
      {
        icon: <Briefcase className="size-5" />,
        label: 'Fonction',
        value: ressourceHumaine.poste,
      },
    ].filter(Boolean) as {
      icon: React.ReactNode;
      label: string;
      value: string;
      href?: string;
    }[];
  }, [ressourceHumaine]);

  /* ─── États de chargement et d'erreur ─── */

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          {/* Squelette de même gabarit que la page finale : pas de saut. */}
          <div className="space-y-8">
            <div className="skeleton-shimmer h-64 rounded-3xl" />
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="skeleton-shimmer h-80 rounded-2xl" />
              <div className="skeleton-shimmer h-80 rounded-2xl lg:col-span-2" />
            </div>
          </div>
          <p className="sr-only">Chargement du profil…</p>
        </div>
      </div>
    );
  }

  if (error || !ressourceHumaine) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <EmptyState
            icon={<Users />}
            title="Profil introuvable"
            description="Le membre de l'équipe que vous recherchez n'existe pas ou a été supprimé."
            actionLabel="Retour à l'équipe"
            onAction={() => window.history.back()}
          />

          <div className="mt-8 text-center">
            <Button
              component={RouterLink}
              to="/ressources-humaines"
              variant="outlined"
              startIcon={<ArrowLeft className="size-4" />}
            >
              Retour à l'équipe
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Données ─── */

  const fullName = formatFullName(ressourceHumaine);
  const initials = getPersonInitials(ressourceHumaine);
  const photoUrl = ressourceHumaine.photo ? getImageUrl(ressourceHumaine.photo) : '';

  const experiences = ressourceHumaine.experiences ?? [];
  const diplomes = ressourceHumaine.diplomes ?? [];
  const formations = ressourceHumaine.formations ?? [];
  const competences = ressourceHumaine.competences ?? [];
  const langues = ressourceHumaine.langues ?? [];

  /* Chaque section démarre un peu après la précédente : le regard suit. */
  let delay = 0;
  const nextDelay = () => {
    delay += 90;
    return delay;
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {/* ═══ Bandeau d'identité ═══ */}
      <header className="relative overflow-hidden bg-brand-950 pt-24 pb-16 text-white sm:pt-28 sm:pb-20">
        {/* Décor : dégradés discrets, aucune image à charger. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(120%_110%_at_20%_0%,#27564e_0%,#173832_50%,#0b1917_100%)]" />
          <div className="absolute -right-24 -top-24 size-[28rem] rounded-full bg-[radial-gradient(circle,rgba(152,192,112,0.20),transparent_65%)] blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-7 text-center sm:flex-row sm:items-end sm:text-left">
            {/* Portrait */}
            <RevealOnScroll direction="none" className="shrink-0">
              <div className="size-36 overflow-hidden rounded-3xl border-4 border-white/15 bg-brand-900 shadow-2xl sm:size-44">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={fullName}
                    loading="eager"
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-display font-bold text-sage-300">{initials}</span>
                  </div>
                )}
              </div>
            </RevealOnScroll>

            {/* Identité */}
            <div className="min-w-0 flex-1">
              <RevealOnScroll delay={80}>
                <p className="text-caption uppercase text-sage-300">Équipe ESSG</p>
                <h1 className="mt-2 text-display text-white">{fullName}</h1>
                <p className="mt-2 flex items-center justify-center gap-2 text-body-lg text-white/85 sm:justify-start">
                  <Briefcase className="size-4 shrink-0 text-sage-300" />
                  {ressourceHumaine.poste}
                </p>
              </RevealOnScroll>

              {/* Accès direct aux coordonnées */}
              <RevealOnScroll delay={180}>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5 sm:justify-start">
                  {ressourceHumaine.email && (
                    <a
                      href={`mailto:${ressourceHumaine.email}`}
                      className="inline-flex items-center gap-2 rounded-full bg-sage-400 px-4 py-2 text-small font-semibold text-brand-950 transition-colors duration-200 hover:bg-sage-300 motion-reduce:transition-none"
                    >
                      <Mail className="size-4" />
                      Contacter
                    </a>
                  )}
                  {ressourceHumaine.telephone && (
                    <a
                      href={`tel:${ressourceHumaine.telephone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-small font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20 motion-reduce:transition-none"
                    >
                      <Phone className="size-4" />
                      Appeler
                    </a>
                  )}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </header>

      <Breadcrumb
        items={[
          { label: 'Ressources Humaines', to: '/ressources-humaines' },
          { label: fullName },
        ]}
      />

      {/* ═══ Contenu ═══ */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
          {/* ── Colonne principale ── */}
          <div className="space-y-6 lg:col-span-2">
            <ProfileSection
              title="Présentation"
              icon={<User className="size-5" />}
              delay={nextDelay()}
            >
              <p className="whitespace-pre-wrap text-body leading-7 text-ink-600">
                {ressourceHumaine.description ||
                  `${fullName} occupe le poste de ${ressourceHumaine.poste} à l'ESSG, contribuant à l'excellence académique et à la réussite des étudiants en sciences géomatiques.`}
              </p>
            </ProfileSection>

            {experiences.length > 0 && (
              <ProfileSection
                title="Parcours professionnel"
                icon={<Building2 className="size-5" />}
                count={experiences.length}
                delay={nextDelay()}
              >
                <Timeline
                  entries={experiences.map((experience) => ({
                    title: experience.poste,
                    subtitle: experience.organisation,
                    period: experience.periode,
                  }))}
                />
              </ProfileSection>
            )}

            {(diplomes.length > 0 || formations.length > 0) && (
              <ProfileSection
                title="Formation et diplômes"
                icon={<GraduationCap className="size-5" />}
                count={diplomes.length + formations.length}
                delay={nextDelay()}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  {diplomes.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-caption uppercase text-ink-400">
                        <Award className="size-3.5" />
                        Diplômes
                      </h3>
                      <CheckList items={diplomes} />
                    </div>
                  )}
                  {formations.length > 0 && (
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 text-caption uppercase text-ink-400">
                        <GraduationCap className="size-3.5" />
                        Formations
                      </h3>
                      <CheckList items={formations} />
                    </div>
                  )}
                </div>
              </ProfileSection>
            )}
          </div>

          {/* ── Colonne latérale ── */}
          <aside className="space-y-6">
            {contacts.length > 0 && (
              <ProfileSection
                title="Coordonnées"
                icon={<Mail className="size-5" />}
                delay={nextDelay()}
              >
                <div className="grid gap-3">
                  {contacts.map((contact) => (
                    <InfoTile
                      key={contact.label}
                      icon={contact.icon}
                      label={contact.label}
                      value={contact.value}
                      href={contact.href}
                    />
                  ))}
                </div>
              </ProfileSection>
            )}

            {competences.length > 0 && (
              <ProfileSection
                title="Compétences"
                icon={<Wrench className="size-5" />}
                count={competences.length}
                delay={nextDelay()}
              >
                <TagCloud items={competences} />
              </ProfileSection>
            )}

            {langues.length > 0 && (
              <ProfileSection
                title="Langues"
                icon={<Languages className="size-5" />}
                count={langues.length}
                delay={nextDelay()}
              >
                <TagCloud items={langues} />
              </ProfileSection>
            )}
          </aside>
        </div>
      </div>

      <CtaSection
        icon={<Users />}
        title="Une question pour notre équipe ?"
        description="N'hésitez pas à nous contacter pour toute question sur les formations, les admissions ou la vie de l'école."
        primaryLabel="Nous contacter"
        primaryLink="/contact"
        secondaryLabel="Découvrir les formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default RessourceHumaineDetailPage;
