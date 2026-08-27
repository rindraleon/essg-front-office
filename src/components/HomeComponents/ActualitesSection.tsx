import { Calendar } from 'lucide-react';
import { useRecentActualites } from '@/hooks';
import useSectionFilters, { type FilterDefinition } from '@/hooks/useSectionFilters';
import FilterButton from '../common/FilterButton';
import type { Actualite } from '@/types';
import { getImageUrl , formatDate } from '@/utils';
import { CARD_WIDTH_CLASS } from '@/constants';
import SectionHeader from '../common/SectionHeader';
import SectionCta from '../common/SectionCta';
import SectionContent from '../common/SectionContent';
import ScrollableCardGrid from '../common/ScrollableCardGrid';
import MediaCard from '../common/MediaCard';
import { MediaCardSkeletonGrid } from '../common/MediaCardSkeleton';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Toutes les actualités', link: '/actualites' } as const;

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
          eyebrow="Vie de l'école & Recherche"
          title="Dernières Actualités"
          description="Restez informé des innovations, conférences et événements marquants de l'ESSG"
        />
      }
      loadingSkeletons={<MediaCardSkeletonGrid layout="home" />}
      sectionClassName="bg-gradient-to-br from-white via-brand-50/55 to-brand-50/45 section-y"
      fluid
      containerClassName="max-w-none"
    >
      <ScrollableCardGrid
        className="w-full"
        ariaLabel="Dernières actualités"
        resetKey={groups.map((group) => `${group.key}:${group.value}`).join('|')}
        toolbarStart={<span aria-live="polite">{countLabel}</span>}
        controls={<FilterButton groups={groups} onChange={setFilter} onReset={reset} />}
      >
        {filtered.map((actu) => (
          <MediaCard
            key={actu.id}
            className={CARD_WIDTH_CLASS}
            layout="home"
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
