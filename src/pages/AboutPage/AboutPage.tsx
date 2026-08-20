import { Award, Eye, Flag, GraduationCap, Rocket, Users } from 'lucide-react';
import React from 'react';
import {
  PageHero,
  Breadcrumb,
  SectionContent,
  ScrollableCardGrid,
  CtaSection,
} from '../../components';
import { useActiveRessourcesHumaines, useScrollAnimation } from '../../hooks';
import { useTitle } from '../../hooks/useTitle';
import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS } from '../../constants/layout';
import { formatFullName } from '../../utils/name.utils';
import MediaCard from '../../components/common/MediaCard';
import { MediaCardSkeletonGrid } from '../../components/common/MediaCardSkeleton';

import { CAMPUS_GALLERY, SITE_HERO_IMAGE } from '../../constants/media';

const HERO_IMAGE = SITE_HERO_IMAGE;

/** Portrait de repli lorsqu'un membre n'a pas encore de photo. */
const TEAM_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const HERO_STATS = [
  { value: '2026', label: 'Année de création' },
  { value: '95%', label: "Taux d'insertion" },
  { value: '30+', label: 'Pays partenaires' },
  { value: '5/7', label: 'Ouverture' },
];

const TIMELINE = [
  {
    date: '2026',
    title: 'Création de l’ESSG',
    description:
      "Reconnue par la Loi n° 2010-001, l'École Supérieure de Sciences Géomatiques ouvre ses portes au sein de l'Université de Fianarantsoa, à Andrainjato.",
  },
  {
    date: '2026',
    title: 'Première rentrée académique',
    description:
      'Accueil des premières promotions en Licence et Master de géomatique, topographie et aménagement du territoire.',
  },
  {
    date: 'Aujourd’hui',
    title: 'Une école en plein essor',
    description:
      "Formation, recherche et innovation au service du développement : l'ESSG s'impose comme une référence des sciences géomatiques à Madagascar.",
  },
];

const VALUES = [
  {
    icon: <Award />,
    title: 'Excellence',
    description:
      'Un enseignement exigeant, des résultats mesurables et une reconnaissance internationale.',
  },
  {
    icon: <Users />,
    title: 'Professionnalisation',
    description: 'Des formations adossées aux besoins réels des territoires et des entreprises.',
  },
  {
    icon: <Rocket />,
    title: 'Innovation',
    description: 'La maîtrise des technologies spatiales, de la télédétection et du numérique.',
  },
  {
    icon: <Flag />,
    title: 'Engagement',
    description:
      'Au service du développement durable, de l’aménagement et de la gestion des territoires.',
  },
];

const OBJECTIVES = [
  'Former des experts en géomatique, topographie, cartographie et systèmes d’information géographique (SIG)',
  'Développer la recherche appliquée et l’innovation en sciences géomatiques',
  'Accompagner les collectivités et les entreprises dans l’aménagement et la gestion du territoire',
  'Renforcer la coopération nationale et internationale avec les universités et les institutions',
];


const AboutPage: React.FC = () => {
  useTitle('À propos');
  const pageRef = useScrollAnimation<HTMLDivElement>();

  const { ressourcesHumaines, loading, error } = useActiveRessourcesHumaines();

  return (
    <div ref={pageRef} className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="À propos de l'ESSG"
        title="À propos de l'ESSG"
        description="Découvrez l'École Supérieure de Sciences Géomatiques : son histoire, sa mission, ses valeurs et son engagement au service de l'excellence académique et du développement territorial."
        stats={HERO_STATS}
      />
      <Breadcrumb items={[{ label: 'À propos' }]} />

      
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div data-gsap="left">
              <span className="mb-3 block text-caption font-semibold uppercase tracking-wider text-brand-700">
                Présentation
              </span>
              <h2 className="mb-4 text-h2 text-ink-900">
                Une école d'excellence en sciences géomatiques
              </h2>
              <p className="mb-4 leading-7 text-ink-500">
                L'École Supérieure de Sciences Géomatiques (ESSG) de l'Université de Fianarantsoa,
                Madagascar, est un établissement d'enseignement supérieur spécialisé dans la
                formation, la recherche et l'innovation en géomatique, cartographie, télédétection
                et systèmes d'information géographique (SIG).
              </p>
              <p className="leading-7 text-ink-500">
                Située à Andrainjato, au cœur du campus universitaire, l'ESSG forme les experts de
                demain, capables de répondre aux défis de l'aménagement du territoire, de la gestion
                des ressources et du développement durable.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div data-gsap="right" className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Eye className="size-4" />
                </div>
                <h3 className="mb-2 text-h5 font-bold text-ink-900">Notre vision</h3>
                <p className="text-small leading-6 text-ink-500">
                  Être une référence régionale et internationale en sciences géomatiques, moteur
                  d'innovation au service des territoires.
                </p>
              </div>
              <div data-gsap="right" className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sage-50 text-sage-700 ring-1 ring-sage-100">
                  <Rocket className="size-4" />
                </div>
                <h3 className="mb-2 text-h5 font-bold text-ink-900">Notre mission</h3>
                <p className="text-small leading-6 text-ink-500">
                  Former des professionnels compétents et engagés, développer la recherche appliquée
                  et accompagner les acteurs du territoire.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-gsap className="mb-12 text-center">
            <span className="mb-3 block text-caption font-semibold uppercase tracking-wider text-brand-700">
              Historique
            </span>
            <h2 className="text-h2 text-ink-900">
              Les grandes étapes
            </h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-8">
            {TIMELINE.map((step, index) => (
              <div key={step.title} data-gsap="left" className="relative flex gap-5">
                {index < TIMELINE.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[1.35rem] top-12 h-[calc(100%-2rem)] w-px bg-ink-100"
                  />
                )}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white shadow-[0_6px_16px_-6px_rgba(46,106,95,0.7)]">
                  <span className="text-small font-bold">{index + 1}</span>
                </div>
                <div className="min-w-0 pt-0.5">
                  <div className="mb-1 text-caption font-bold uppercase tracking-wider text-brand-600">
                    {step.date}
                  </div>
                  <h3 className="mb-1 text-h5 font-bold text-ink-900">{step.title}</h3>
                  <p className="leading-7 text-ink-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div data-gsap className="mb-12 text-center">
            <span className="mb-3 block text-caption font-semibold uppercase tracking-wider text-brand-700">
              Nos valeurs
            </span>
            <h2 className="text-h2 text-ink-900">
              Ce qui nous guide
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink-500">
              Quatre valeurs fondatrices structurent l'ensemble de nos formations et de nos actions.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <div
                key={value.title}
                data-gsap
                className="group rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-transform duration-300 group-hover:scale-[1.03]">
                  {value.icon}
                </div>
                <h3 className="mb-2 text-h5 font-bold text-ink-900">{value.title}</h3>
                <p className="text-small leading-6 text-ink-500">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div data-gsap="left">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-caption font-semibold uppercase tracking-wider text-sage-300 ring-1 ring-white/20">
                <GraduationCap />
                Nos objectifs
              </span>
              <h2 className="mb-6 text-h2">
                Une école tournée vers l'avenir
              </h2>
              <ul className="space-y-4">
                {OBJECTIVES.map((objective) => (
                  <li key={objective} className="flex items-start gap-3">
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-400/20 text-caption font-bold text-sage-300 ring-1 ring-sage-400/40">
                      ✓
                    </span>
                    <span className="leading-7 text-sage-50/90">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  data-gsap="scale"
                  className="rounded-2xl border border-white/15 bg-white/10 p-6 text-center backdrop-blur-sm"
                >
                  <div className="text-h2 font-bold">{stat.value}</div>
                  <div className="mt-1 text-small text-sage-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionContent
        loading={loading}
        error={error}
        isEmpty={!loading && ressourcesHumaines.length === 0}
        emptyMessage="L'équipe sera présentée prochainement."
        headerContent={
          <div className="mb-12 text-center">
            <span className="mb-3 block text-caption font-semibold uppercase tracking-wider text-brand-700">
              L'équipe
            </span>
            <h2 className="text-h2 text-ink-900">
              Notre équipe pédagogique
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink-500">
              Des enseignants-chercheurs et des professionnels passionnés au service de votre
              réussite.
            </p>
          </div>
        }
        loadingSkeletons={<MediaCardSkeletonGrid />}
        sectionClassName="py-16"
        containerClassName="w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12"
      >
        <ScrollableCardGrid className="mt-2 w-full" ariaLabel="Équipe pédagogique">
          {ressourcesHumaines.map((membre) => {
            const fullName = formatFullName(membre);

            return (
              <MediaCard
                key={membre.id}
                className={CARD_WIDTH_CLASS}
                to={`/ressources-humaines/${membre.slug ?? membre.id}`}
                title={fullName}
                imageUrl={membre.photo ? getImageUrl(membre.photo) : TEAM_FALLBACK_IMAGE}
                imageAlt={fullName}
                subtitle={membre.poste}
                description={membre.description}
                actionLabel="Voir le profil"
              />
            );
          })}
        </ScrollableCardGrid>
      </SectionContent>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <span className="mb-3 block text-caption font-semibold uppercase tracking-wider text-brand-700">
              Galerie
            </span>
            <h2 className="text-h2 text-ink-900">
              Notre campus en images
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {CAMPUS_GALLERY.map((image) => (
              <figure
                key={image.src}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 shadow-card"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-ink-100">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={675}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </div>
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 to-transparent px-4 pb-3 pt-8 text-small font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {image.alt}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaSection
        icon={<GraduationCap />}
        title="Rejoignez l'ESSG"
        description="Découvrez nos formations d'excellence en sciences géomatiques et démarrez votre parcours."
        primaryLabel="Voir les formations"
        primaryLink="/formations"
        secondaryLabel="Postuler maintenant"
        secondaryLink="/admission"
      />
    </div>
  );
};

export default AboutPage;
