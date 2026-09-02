import {
  ArrowDownRight,
  Award,
  Binoculars,
  Check,
  Compass,
  Eye,
  Flag,
  GraduationCap,
  Lightbulb,
  Map,
  Rocket,
  ScanLine,
  Users,
} from 'lucide-react';
import React from 'react';
import {
  PageHero,
  Breadcrumb,
  SectionContent,
  ScrollableCardGrid,
  RevealOnScroll,
  MediaCard,
  MediaCardSkeletonGrid,
} from '@/components';
import { useActiveRessourcesHumaines, useTitle } from '@/hooks';
import { getImageUrl, formatFullName } from '@/utils';
import { CARD_WIDTH_CLASS, CAMPUS_GALLERY, SITE_HERO_IMAGE } from '@/constants';

const TIMELINE = [
  {
    step: 'Fondation',
    date: '2026',
    title: 'Naissance de l’ESSG',
    description:
      'Création de l’école au sein de l’Université de Fianarantsoa, sur le campus d’Andrainjato.',
  },
  {
    step: 'Transmission',
    date: '2026',
    title: 'Premières promotions',
    description:
      'Ouverture des parcours en Licence et Master, avec une pédagogie orientée vers la pratique.',
  },
  {
    step: 'Projection',
    date: 'Aujourd’hui',
    title: 'Un laboratoire de solutions',
    description:
      'Formation, recherche appliquée et innovation géospatiale au service des territoires malgaches.',
  },
] as const;

const VALUES = [
  {
    icon: Award,
    number: '01',
    title: 'Excellence',
    description:
      'Une culture de la précision, des standards exigeants et des résultats qui se mesurent.',
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    icon: Users,
    number: '02',
    title: 'Professionnalisation',
    description: 'Des compétences construites avec les réalités des métiers et des territoires.',
    className: '',
  },
  {
    icon: Lightbulb,
    number: '03',
    title: 'Innovation',
    description:
      'Télédétection, SIG, données spatiales et outils numériques au cœur des apprentissages.',
    className: '',
  },
  {
    icon: Flag,
    number: '04',
    title: 'Engagement',
    description:
      'Des projets utiles, responsables et tournés vers un développement territorial durable.',
    className: 'md:col-span-2',
  },
] as const;

function gallerySpan(index: number): string {
  if (index === 0) return 'lg:col-span-7';
  if (index === 1) return 'lg:col-span-5';
  return 'lg:col-span-6';
}

const OBJECTIVES = [
  'Former des experts en géomatique, cartographie, topographie et SIG',
  'Développer la recherche appliquée et l’innovation géospatiale',
  'Aider les acteurs publics et privés à mieux décider grâce à la donnée',
  'Créer des coopérations académiques et professionnelles durables',
] as const;

const AboutPage: React.FC = () => {
  useTitle('À propos');
  const { ressourcesHumaines, loading, error } = useActiveRessourcesHumaines();
  const teamFallbackImage = CAMPUS_GALLERY[0]?.src ?? SITE_HERO_IMAGE;

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-ink-50)]">
      <PageHero
        image={SITE_HERO_IMAGE}
        imageAlt="Campus de l'École Supérieure de Sciences Géomatiques"
        title="A propos"
        description="L’ESSG forme une nouvelle génération de professionnels capables de convertir la donnée géographique en décisions utiles, durables et responsables."
        minHeight="72vh"
        stats={[
          {
            value: '2026',
            label: 'Année de création',
            icon: <Compass className="mx-auto size-5 text-brand-300" />,
          },
          {
            value: '2',
            label: 'Cycles de formation',
            icon: <GraduationCap className="mx-auto size-5 text-brand-300" />,
          },
          {
            value: '1',
            label: 'Campus à Andrainjato',
            icon: <Map className="mx-auto size-5 text-brand-300" />,
          },
        ]}
      />
      <Breadcrumb items={[{ label: 'À propos' }]} />

      <section className="section-y">
        <div className="section-shell grid items-center gap-14 lg:grid-cols-[.92fr_1.08fr] ">
          <RevealOnScroll variant="fade-left" className="relative min-h-[30rem]">
            <div className="absolute left-0 top-0 w-[72%] overflow-hidden rounded-3xl shadow-elevated">
              <img
                loading="lazy"
                decoding="async"
                src={CAMPUS_GALLERY[0]?.src ?? SITE_HERO_IMAGE}
                alt={CAMPUS_GALLERY[0]?.alt ?? 'Campus ESSG'}
                className="aspect-[4/5] w-full object-cover transition-transform duration-(--duration-section) hover:scale-[1.03] motion-reduce:transform-none"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[52%] overflow-hidden rounded-2xl border-[6px] border-[var(--color-ink-50)] shadow-elevated">
              <img
                loading="lazy"
                decoding="async"
                src={CAMPUS_GALLERY[1]?.src ?? SITE_HERO_IMAGE}
                alt={CAMPUS_GALLERY[1]?.alt ?? 'Vue du campus ESSG'}
                className="aspect-[4/3] w-full object-cover transition-transform duration-(--duration-section) hover:scale-[1.04] motion-reduce:transform-none"
              />
            </div>
            <div className="absolute right-[5%] top-[8%] rounded-2xl border border-white/70 bg-white/85 p-4 shadow-card backdrop-blur-xl">
              <ScanLine className="mb-2 size-5 text-brand-600" />
              <strong className="block font-tech text-small text-ink-900">21.4415° S</strong>
              <span className="text-caption text-ink-500">Andrainjato</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="fade-right" delay={120}>
            <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
              <Binoculars className="size-4" />
              Notre identité
            </span>
            <h2 className="mt-4 max-w-2xl text-h2 text-ink-950">
              Une école où la science rencontre les enjeux réels du territoire
            </h2>
            <p className="mt-6 max-w-2xl text-body-lg leading-8 text-ink-600">
              L’École Supérieure de Sciences Géomatiques de l’Université de Fianarantsoa développe
              des compétences en géomatique, cartographie, télédétection et systèmes d’information
              géographique.
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-ink-500">
              Notre approche relie les fondamentaux scientifiques, la maîtrise des technologies et
              l’expérience de terrain afin que chaque étudiant sache observer, analyser et agir.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-card">
                <strong className="font-tech text-h4 text-brand-700">DATA</strong>
                <span className="mt-1 block text-caption text-ink-500">
                  Comprendre avec précision
                </span>
              </div>
              <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-card">
                <strong className="font-tech text-h4 text-brand-700">IMPACT</strong>
                <span className="mt-1 block text-caption text-ink-500">
                  Décider avec responsabilité
                </span>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-white section-y">
        <div className="section-shell">
          <RevealOnScroll className="mb-10 max-w-2xl">
            <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
              Notre cap
            </span>
            <h2 className="mt-3 text-h2 text-ink-950">Une vision claire, une mission concrète</h2>
          </RevealOnScroll>

          <div className="grid gap-5 lg:grid-cols-2">
            <RevealOnScroll variant="fade-left">
              <article className="group relative min-h-72 overflow-hidden rounded-3xl bg-brand-950 p-7 text-white sm:p-9">
                <div className="absolute -right-16 -top-16 size-56 rounded-full border border-brand-300/20 transition-transform duration-(--duration-section) group-hover:scale-125 motion-reduce:transform-none" />
                <div className="absolute -right-4 top-4 size-36 rounded-full border border-brand-300/15" />
                <Eye className="size-8 text-brand-300" />
                <span className="mt-12 block font-tech text-caption tracking-[0.18em] text-brand-300">
                  VISION
                </span>
                <h3 className="mt-3 max-w-lg text-h3">
                  Devenir une référence géomatique de l’océan Indien
                </h3>
                <p className="mt-4 max-w-xl leading-7 text-white/62">
                  Faire de la connaissance spatiale un levier d’innovation et de résilience pour les
                  territoires.
                </p>
              </article>
            </RevealOnScroll>
            <RevealOnScroll variant="fade-right" delay={100}>
              <article className="group relative min-h-72 overflow-hidden rounded-3xl border border-brand-100 bg-brand-50 p-7 sm:p-9">
                <ArrowDownRight className="absolute right-7 top-7 size-8 text-brand-300 transition-transform duration-(--duration-hover) group-hover:translate-x-1 motion-reduce:transform-none" />
                <Rocket className="size-8 text-brand-700" />
                <span className="mt-12 block font-tech text-caption tracking-[0.18em] text-brand-700">
                  MISSION
                </span>
                <h3 className="mt-3 max-w-lg text-h3 text-ink-950">
                  Former, expérimenter et accompagner
                </h3>
                <p className="mt-4 max-w-xl leading-7 text-ink-600">
                  Préparer des professionnels autonomes, développer la recherche appliquée et
                  soutenir les acteurs du développement territorial.
                </p>
              </article>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="section-shell">
          <RevealOnScroll className="text-center">
            <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
              Notre trajectoire
            </span>
            <h2 className="mt-3 text-h2 text-ink-950">Une école jeune, pensée pour durer</h2>
          </RevealOnScroll>
          <div className="relative mt-14 grid gap-6 lg:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-transparent via-brand-300 to-transparent lg:block" />
            {TIMELINE.map((item, index) => (
              <RevealOnScroll key={item.title} delay={index * 100} className="relative">
                <article className="group h-full rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-[transform,box-shadow,border-color] duration-(--duration-hover) hover:border-brand-200 hover:shadow-card-hover motion-reduce:transform-none">
                  <div className="relative z-10 grid size-16 place-items-center rounded-full border-[6px] border-[var(--color-ink-50)] bg-brand-700 font-tech text-small font-bold text-white shadow-lg">
                    0{index + 1}
                  </div>
                  <span className="mt-7 block text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                    {item.step} · {item.date}
                  </span>
                  <h3 className="mt-2 text-h5 text-ink-950">{item.title}</h3>
                  <p className="mt-3 text-small leading-6 text-ink-500">{item.description}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-50 section-y">
        <div className="section-shell">
          <RevealOnScroll className="mb-12 max-w-2xl">
            <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
              Notre culture
            </span>
            <h2 className="mt-3 text-h2 text-ink-950">
              Quatre valeurs qui orientent chaque décision
            </h2>
          </RevealOnScroll>
          <div className="grid auto-rows-[minmax(14rem,auto)] gap-4 md:grid-cols-4">
            {VALUES.map(({ icon: Icon, number, title, description, className }, index) => (
              <RevealOnScroll key={title} delay={index * 70} className={className}>
                <article className="group relative h-full overflow-hidden rounded-2xl border border-brand-100 bg-white p-6 transition-[transform,box-shadow,border-color] duration-(--duration-hover) hover:border-brand-300 hover:shadow-card-hover motion-reduce:transform-none">
                  <span className="absolute right-5 top-3 font-tech text-[4rem] font-bold leading-none text-brand-950/[0.04]">
                    {number}
                  </span>
                  <div className="grid size-12 place-items-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 transition-transform duration-(--duration-hover) group-hover:rotate-3 group-hover:scale-105 motion-reduce:transform-none">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-8 text-h5 text-ink-950">{title}</h3>
                  <p className="mt-3 max-w-md text-small leading-6 text-ink-500">{description}</p>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink-950 section-y text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(152,192,112,.14),transparent_30%)]" />
        <div className="relative section-shell grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] ">
          <RevealOnScroll variant="fade-left">
            <span className="inline-flex items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em] text-brand-300">
              <GraduationCap className="size-4" />
              Nos objectifs
            </span>
            <h2 className="mt-4 max-w-xl text-h2">
              Transformer la maîtrise technique en capacité d’action
            </h2>
            <div className="mt-8 space-y-4">
              {OBJECTIVES.map((objective, index) => (
                <div
                  key={objective}
                  className="group flex items-start gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-colors duration-(--duration-hover) hover:bg-white/[0.07]"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-300/15 font-tech text-caption text-brand-300">
                    {index + 1}
                  </span>
                  <p className="leading-7 text-white/72">{objective}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>
          <RevealOnScroll
            variant="scale-in"
            delay={120}
            className="relative mx-auto aspect-square w-full max-w-md"
          >
            <div className="absolute inset-0 rounded-full border border-white/10" />
            <div className="absolute inset-[13%] animate-[spin_28s_linear_infinite] rounded-full border border-dashed border-brand-300/25 motion-reduce:animate-none" />
            <div className="absolute inset-[27%] rounded-full border border-brand-300/25 bg-brand-300/[0.06]" />
            <div className="absolute inset-0 grid place-items-center text-center">
              <div>
                <Map className="mx-auto size-10 text-brand-300" />
                <strong className="mt-4 block font-tech tracking-[0.15em]">TERRITOIRE</strong>
                <span className="mt-1 block text-caption text-white/45">
                  Observer · Analyser · Agir
                </span>
              </div>
            </div>
            {[
              ['left-[9%] top-[27%]', 'MESURE'],
              ['right-[2%] top-[48%]', 'DONNÉE'],
              ['bottom-[8%] left-[35%]', 'DÉCISION'],
            ].map(([position, label]) => (
              <span
                key={label}
                className={`absolute ${position} rounded-full border border-white/10 bg-ink-950 px-3 py-1.5 font-tech text-[0.6rem] tracking-wider text-brand-300`}
              >
                {label}
              </span>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      <SectionContent
        loading={loading}
        error={error}
        isEmpty={!loading && ressourcesHumaines.length === 0}
        emptyMessage="L'équipe sera présentée prochainement."
        headerContent={
          <RevealOnScroll className="mb-12 text-center">
            <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
              Les expertises
            </span>
            <h2 className="mt-3 text-h2 text-ink-950">Notre équipe pédagogique</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ink-500">
              Des enseignants-chercheurs et professionnels engagés dans la réussite de chaque
              promotion.
            </p>
          </RevealOnScroll>
        }
        loadingSkeletons={<MediaCardSkeletonGrid />}
        sectionClassName="bg-white section-y"
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
                imageUrl={membre.photo ? getImageUrl(membre.photo) : teamFallbackImage}
                imageAlt={fullName}
                subtitle={membre.poste}
                description={membre.description}
                actionLabel="Voir le profil"
              />
            );
          })}
        </ScrollableCardGrid>
      </SectionContent>

      <section className="section-y">
        <div className="section-shell">
          <RevealOnScroll className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
                Le cadre d’étude
              </span>
              <h2 className="mt-3 text-h2 text-ink-950">Le campus, sous un autre angle</h2>
            </div>
            <p className="max-w-md text-small leading-6 text-ink-500">
              Un environnement universitaire ouvert sur les reliefs et les enjeux territoriaux de
              Madagascar.
            </p>
          </RevealOnScroll>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
            {CAMPUS_GALLERY.map((image, index) => (
              <RevealOnScroll key={image.src} delay={index * 70} className={gallerySpan(index)}>
                <figure className="group relative overflow-hidden rounded-2xl bg-ink-100 shadow-card">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    decoding="async"
                    width={900}
                    height={675}
                    className={`w-full object-cover transition-transform duration-(--duration-section) group-hover:scale-[1.04] motion-reduce:transform-none ${index < 2 ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/75 via-transparent to-transparent opacity-75 transition-opacity duration-(--duration-hover) group-hover:opacity-100" />
                  <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 text-small font-semibold text-white">
                    <span>{image.alt}</span>
                    <Check className="size-4 text-brand-300" />
                  </figcaption>
                </figure>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
