import { Calendar } from 'lucide-react';
import { useRecentActualites } from '../../hooks';
import useSectionFilters, { type FilterDefinition } from '../../hooks/useSectionFilters';
import FilterButton from '../common/FilterButton';
import type { Actualite } from '../../types/actualite.types';
import { getImageUrl } from '../../utils/image.utils';
import { formatDate } from '../../utils/date.utils';
import { CARD_WIDTH_CLASS } from '../../constants/layout';
import { SectionHeader, SectionCta, SectionContent, ScrollableCardGrid } from '../../components';
import MediaCard from '../common/MediaCard';
import { MediaCardSkeletonGrid } from '../common/MediaCardSkeleton';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Toutes les actualités', link: '/actualites' } as const;

/**
 * Critères de filtrage (§5). Les options sont dérivées des actualités
 * réellement reçues : une catégorie sans article ne s'affiche pas.
 * L'année est extraite de la date — c'est le second axe de recherche
 * naturel pour une actualité, après la catégorie.
 */
const FILTERS: FilterDefinition<Actualite>[] = [
  {
    key: 'categorie',
    label: 'Catégorie',
    accessor: (actualite) => actualite.categorie,
    allLabel: 'Toutes',
  },
  {
    key: 'annee',
    label: 'Année',
    accessor: (actualite) => {
      const date = new Date(actualite.date);
      return Number.isNaN(date.getTime()) ? undefined : String(date.getFullYear());
    },
    allLabel: 'Toutes',
  },
];

const ActualitesSection = () => {
  const { actualites, loading, error } = useRecentActualites(8);
  const { filtered, groups, setFilter, reset } = useSectionFilters(actualites, FILTERS);

  const count = filtered.length;
  const total = actualites.length;

  /** « 4 actualités » ou « 2 sur 4 actualités » lorsqu'un filtre est posé. */
  const suffix = total > 1 ? 's' : '';
  const countLabel =
    count === total ? `${total} actualité${suffix}` : `${count} sur ${total} actualité${suffix}`;

  return (
    <SectionContent
      loading={loading}
      error={error}
      isEmpty={!loading && total === 0}
      emptyMessage="Aucune actualité disponible pour le moment."
      headerContent={
        <SectionHeader
          title="Dernières Actualités"
          description="Restez informé de la vie de l'ESSG"
        />
      }
      loadingSkeletons={<MediaCardSkeletonGrid />}
      sectionClassName="bg-gradient-to-b from-white to-ink-50 py-20"
      fluid
      containerClassName="max-w-none"
    >
      <ScrollableCardGrid
        className="w-full"
        ariaLabel="Dernières actualités"
        toolbarStart={
          <span aria-live="polite">{countLabel}</span>
        }
        controls={
          groups.length > 0 && (
            <FilterButton groups={groups} onChange={setFilter} onReset={reset} revealOnHover />
          )
        }
      >
        {filtered.map((actu) => (
          <MediaCard
            key={actu.id}
            className={CARD_WIDTH_CLASS}
            to={`/actualites/${actu.slug}`}
            title={actu.titre}
            imageUrl={actu.image ? getImageUrl(actu.image) : FALLBACK_IMAGE}
            badge={actu.categorie || 'Actualité'}
            description={actu.resume}
            meta={[{ icon: <Calendar className="size-3.5" />, label: formatDate(actu.date) }]}
            actionLabel="Lire l'article"
          />
        ))}
      </ScrollableCardGrid>

      {count === 0 && total > 0 && (
        <p className="py-10 text-center text-body text-ink-500">
          Aucune actualité ne correspond à ces critères.{' '}
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

export default ActualitesSection;
