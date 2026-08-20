import { Clock, GraduationCap } from 'lucide-react';
import { useMemo } from 'react';
import { getImageUrl } from '../../utils/image.utils';
import { CARD_WIDTH_CLASS } from '../../constants/layout';
import { NIVEAU_ORDER } from '../../constants/formation';
import { SectionHeader, SectionCta, SectionContent, ScrollableCardGrid } from '../../components';
import MediaCard from '../common/MediaCard';
import FilterButton from '../common/FilterButton';
import { MediaCardSkeletonGrid } from '../common/MediaCardSkeleton';
import { useFeaturedFormations } from '../../hooks';
import useSectionFilters, { type FilterDefinition } from '../../hooks/useSectionFilters';
import type { FeaturedFormationsSectionProps } from '../../types';
import type { Formation } from '../../types/formations.types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1523050854058-8df90110a6f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Voir toutes les formations', link: '/formations' } as const;

/**
 * Critères de filtrage. Déclarés hors du composant : une nouvelle référence
 * à chaque rendu invaliderait les `useMemo` du hook de filtrage.
 */
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

  /**
   * Tri par niveau (§4).
   *
   * L'ordre suit la hiérarchie pédagogique (Licence → Master → Doctorat), et
   * non l'ordre alphabétique qui donnerait « Doctorat, Licence, Master ».
   * À niveau égal, on retombe sur le titre pour que l'affichage reste
   * déterministe d'un chargement à l'autre.
   */
  const sorted = useMemo(() => {
    const rank = (niveau: string) => {
      const index = NIVEAU_ORDER.indexOf(niveau as (typeof NIVEAU_ORDER)[number]);
      // Un niveau inconnu est placé en fin de liste plutôt qu'en tête.
      return index === -1 ? NIVEAU_ORDER.length : index;
    };
    return [...formations].sort(
      (a, b) => rank(a.niveau) - rank(b.niveau) || a.titre.localeCompare(b.titre, 'fr'),
    );
  }, [formations]);

  const { filtered, groups, setFilter, reset } = useSectionFilters(sorted, FILTERS);

  const count = filtered.length;
  const total = sorted.length;

  /** « 4 formations » ou « 2 sur 4 formations » lorsqu'un filtre est posé. */
  const suffix = total > 1 ? 's' : '';
  const countLabel =
    count === total ? `${total} formation${suffix}` : `${count} sur ${total} formation${suffix}`;

  return (
    <SectionContent
      loading={loading}
      error={error}
      isEmpty={!loading && total === 0}
      emptyMessage="Aucune formation disponible pour le moment."
      headerContent={<SectionHeader title={title} description={description} />}
      loadingSkeletons={<MediaCardSkeletonGrid count={3} />}
      sectionClassName="bg-white py-20"
      fluid
      containerClassName="max-w-none"
    >
      <ScrollableCardGrid
        className="w-full"
        ariaLabel="Formations mises en avant"
        toolbarStart={
          <span aria-live="polite">{countLabel}</span>
        }
        controls={
          groups.length > 0 && (
            <FilterButton groups={groups} onChange={setFilter} onReset={reset} revealOnHover />
          )
        }
      >
        {filtered.map((formation) => (
          <MediaCard
            key={formation.id}
            className={CARD_WIDTH_CLASS}
            to={`/formations/${formation.slug ?? formation.id}`}
            title={formation.titre}
            imageUrl={formation.image ? getImageUrl(formation.image) : FALLBACK_IMAGE}
            // Le niveau reste visible sur chaque carte (§4).
            badge={formation.niveau || 'Formation'}
            subtitle={formation.mention || formation.domaine?.[0]}
            description={formation.description || "Découvrez cette formation d'excellence."}
            meta={[
              ...(formation.duree
                ? [{ icon: <Clock className="size-3.5" />, label: formation.duree }]
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

      {/* Filtre trop restrictif : on l'indique plutôt que d'afficher un vide. */}
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
