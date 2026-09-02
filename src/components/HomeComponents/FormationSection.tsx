import { BookOpen, GraduationCap } from 'lucide-react';
import { useMemo } from 'react';
import { getImageUrl } from '@/utils';
import { CARD_WIDTH_CLASS, NIVEAU_ORDER } from '@/constants';
import SectionHeader from '../common/SectionHeader';
import SectionCta from '../common/SectionCta';
import SectionContent from '../common/SectionContent';
import ParticlesBackground from '../animations/ParticlesBackground';
import ScrollableCardGrid from '../common/ScrollableCardGrid';
import MediaCard from '../common/MediaCard';
import FilterButton from '../common/FilterButton';
import { MediaCardSkeletonGrid } from '../common/MediaCardSkeleton';
import { useFeaturedFormations } from '@/hooks';
import useSectionFilters, { type FilterDefinition } from '@/hooks/useSectionFilters';
import type { FeaturedFormationsSectionProps, Formation } from '@/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523050854058-8df90110a6f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Voir toutes les formations', link: '/formations' } as const;

const FILTERS: FilterDefinition<Formation>[] = [
  {
    key: 'niveau',
    label: 'Niveau',
    accessor: (formation) => formation.niveau,
    order: NIVEAU_ORDER,
    allLabel: 'Tous les niveaux',
  },
  {
    key: 'mention',
    label: 'Mention',
    accessor: (formation) => formation.mention || formation.domaine?.[0],
    allLabel: 'Toutes',
  },
];

const FormationsSection = ({
  title = "Formations d'excellence",
  description = "Des programmes d'excellence reconnus internationalement",
  featuredFormations: propFeaturedFormations,
}: FeaturedFormationsSectionProps) => {
  const featuredQuery = useFeaturedFormations(6);
  const formations = propFeaturedFormations ?? featuredQuery.formations;
  const loading = propFeaturedFormations ? false : featuredQuery.loading;
  const queryError =
    featuredQuery.error instanceof Error ? featuredQuery.error.message : featuredQuery.error;
  const error = propFeaturedFormations ? null : queryError;

  const sorted = useMemo(() => {
    const rank = (niveau: string) => {
      const index = NIVEAU_ORDER.indexOf(niveau as (typeof NIVEAU_ORDER)[number]);
      return index === -1 ? NIVEAU_ORDER.length : index;
    };
    return [...formations].sort(
      (a, b) => rank(a.niveau) - rank(b.niveau) || a.titre.localeCompare(b.titre, 'fr')
    );
  }, [formations]);

  const { filtered, groups, setFilter, reset } = useSectionFilters(sorted, FILTERS);

  const count = filtered.length;
  const total = sorted.length;

  const suffix = total > 1 ? 's' : '';
  const countLabel =
    count === total ? `${total} formation${suffix}` : `${count} sur ${total} formation${suffix}`;

  return (
    <SectionContent
      backgroundContent={<ParticlesBackground />}
      loading={loading}
      error={error}
      isEmpty={!loading && total === 0}
      emptyMessage="Aucune formation disponible pour le moment."
      headerContent={
        <SectionHeader eyebrow="Diplômes & Cursus LMD" title={title} description={description} />
      }
      loadingSkeletons={<MediaCardSkeletonGrid count={3} layout="home" />}
      sectionClassName="bg-gradient-to-b from-brand-50/65 via-white to-white section-y"
      fluid
      containerClassName="max-w-none"
    >
      <ScrollableCardGrid
        className="w-full"
        ariaLabel="Formations mises en avant"
        resetKey={groups.map((group) => `${group.key}:${group.value}`).join('|')}
        toolbarStart={<span aria-live="polite">{countLabel}</span>}
        controls={<FilterButton groups={groups} onChange={setFilter} onReset={reset} />}
      >
        {filtered.map((formation) => (
          <MediaCard
            key={formation.id}
            className={CARD_WIDTH_CLASS}
            layout="home"
            to={`/formations/${formation.slug ?? formation.id}`}
            title={formation.titre}
            imageUrl={formation.image ? getImageUrl(formation.image) : FALLBACK_IMAGE}
            badge={formation.niveau || 'Formation'}
            subtitle={formation.duree}
            description={formation.description || "Découvrez cette formation d'excellence."}
            meta={[
              ...(formation.mention
                ? [{ icon: <BookOpen className="size-3.5" />, label: formation.mention }]
                : []),
              ...(formation.credits
                ? [
                    {
                      icon: <GraduationCap className="size-3.5" />,
                      label: `${formation.credits} crédits`,
                    },
                  ]
                : []),
            ]}
            actionLabel="Voir la formation"
          />
        ))}
      </ScrollableCardGrid>

      {count === 0 && total > 0 && (
        <p className="py-10 text-center text-body text-ink-500">
          Aucune formation ne correspond à ces critères.{' '}
          <button
            type="button"
            onClick={reset}
            className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
          >
            Réinitialiser les filtres
          </button>
        </p>
      )}

      <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
    </SectionContent>
  );
};

export default FormationsSection;
