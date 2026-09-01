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
import { CompatButton as Button } from '@/components';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  DetailHero,
  EmptyState,
  CheckList,
  InfoTile,
  ProfileSection,
  TagCloud,
  Timeline,
} from '@/components';
import { useRessourceHumaineBySlug, useTitle } from '@/hooks';
import { getImageUrl, formatFullName, getPersonInitials } from '@/utils';

const RessourceHumaineDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { ressourceHumaine, loading, error } = useRessourceHumaineBySlug(slug || '');
  const { setTitle } = useTitle();
  useTitle(ressourceHumaine ? formatFullName(ressourceHumaine) : 'Ressource Humaine | ESSG');

  useEffect(() => {
    if (ressourceHumaine) {
      setTitle(formatFullName(ressourceHumaine));
    }
  }, [ressourceHumaine, setTitle]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <div className="section-shell section-y">
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
        <div className="section-shell section-y">
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

  const fullName = formatFullName(ressourceHumaine);
  const initials = getPersonInitials(ressourceHumaine);
  const photoUrl = ressourceHumaine.photo ? getImageUrl(ressourceHumaine.photo) : '';

  const experiences = ressourceHumaine.experiences ?? [];
  const diplomes = ressourceHumaine.diplomes ?? [];
  const formations = ressourceHumaine.formations ?? [];
  const competences = ressourceHumaine.competences ?? [];
  const langues = ressourceHumaine.langues ?? [];

  let delay = 0;
  const nextDelay = () => {
    delay += 90;
    return delay;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-50 via-white to-brand-50/35">
      <DetailHero
        eyebrow="Équipe ESSG"
        title={fullName}
        description={ressourceHumaine.description}
        backTo="/ressources-humaines"
        backLabel="Toute l’équipe"
        meta={[
          { icon: Briefcase, label: ressourceHumaine.poste },
          ...(ressourceHumaine.adresse ? [{ icon: MapPin, label: ressourceHumaine.adresse }] : []),
        ]}
        visual={
          <div className="size-40 overflow-hidden rounded-3xl border-4 border-white/15 bg-brand-900 shadow-2xl sm:size-48">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={fullName}
                loading="eager"
                decoding="async"
                className="size-full object-cover object-top"
              />
            ) : (
              <div className="grid size-full place-items-center">
                <span className="text-display font-bold text-brand-300">{initials}</span>
              </div>
            )}
          </div>
        }
        actions={
          <>
            {ressourceHumaine.email && (
              <a
                href={`mailto:${ressourceHumaine.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-brand-400 px-5 py-2.5 text-small font-bold text-brand-950 hover:bg-brand-300"
              >
                <Mail className="size-4" /> Contacter
              </a>
            )}
            {ressourceHumaine.telephone && (
              <a
                href={`tel:${ressourceHumaine.telephone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] px-5 py-2.5 text-small font-semibold text-white backdrop-blur-md hover:bg-white/[0.14]"
              >
                <Phone className="size-4" /> Appeler
              </a>
            )}
          </>
        }
      />

      <Breadcrumb
        items={[{ label: 'Ressources Humaines', to: '/ressources-humaines' }, { label: fullName }]}
      />

      <div className="section-shell section-y-tight">
        <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
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
    </div>
  );
};

export default RessourceHumaineDetailPage;
