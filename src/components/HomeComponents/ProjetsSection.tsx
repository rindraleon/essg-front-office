import { Calendar, MapPin } from 'lucide-react';
import type { FeaturedProjetsSectionProps, ProjetItem } from '@/types';
import { useProjets } from '@/hooks';
import useSectionFilters, { type FilterDefinition } from '@/hooks/useSectionFilters';
import FilterButton from '../common/FilterButton';
import { getImageUrl } from '@/utils';
import { CARD_WIDTH_CLASS } from '@/constants';
import SectionHeader from '../common/SectionHeader';
import SectionCta from '../common/SectionCta';
import SectionContent from '../common/SectionContent';
import ParticlesBackground from '../animations/ParticlesBackground';
import ScrollableCardGrid from '../common/ScrollableCardGrid';
import MediaCard from '../common/MediaCard';
import { MediaCardSkeletonGrid } from '../common/MediaCardSkeleton';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const SECTION_CTA = { label: 'Découvrir tous nos projets', link: '/projets' } as const;

const FILTERS: FilterDefinition<ProjetItem>[] = [
  { key: 'type', label: 'Type', accessor: (projet) => projet.type, allLabel: 'Tous' },
  { key: 'statut', label: 'Statut', accessor: (projet) => projet.statut, allLabel: 'Tous' },
  { key: 'annee', label: 'Année', accessor: (projet) => projet.annee, allLabel: 'Toutes' },
];

const ProjetsSection = ({
  title = "Projets d'Excellence",
  description = "L'ESSG s'engage dans des projets innovants au service du développement et de la recherche",
}: FeaturedProjetsSectionProps) => {
  const { projets, loading, error } = useProjets();
  const { filtered, groups, setFilter, reset } = useSectionFilters(projets, FILTERS);

  const count = filtered.length;
  const total = projets.length;

  const suffix = total > 1 ? 's' : '';
  const countLabel =
    count === total ? `${total} projet${suffix}` : `${count} sur ${total} projet${suffix}`;

  return (
    <SectionContent
      backgroundContent={<ParticlesBackground />}
      loading={loading}
      error={error}
      isEmpty={!loading && total === 0}
      emptyMessage="Aucun projet disponible pour le moment."
      headerContent={
        <SectionHeader
          eyebrow="Impact & Applications Géomatiques"
          title={title}
          description={description}
        />
      }
      loadingSkeletons={<MediaCardSkeletonGrid layout="home" />}
      sectionClassName="bg-gradient-to-b from-brand-50/45 via-ink-50 to-white section-y"
      fluid
      containerClassName="max-w-none"
    >
      <ScrollableCardGrid
        className="w-full"
        ariaLabel="Projets de l'école"
        resetKey={groups.map((group) => `${group.key}:${group.value}`).join('|')}
        toolbarStart={<span aria-live="polite">{countLabel}</span>}
        controls={<FilterButton groups={groups} onChange={setFilter} onReset={reset} />}
      >
        {filtered.map((projet) => (
          <MediaCard
            key={projet.id}
            className={CARD_WIDTH_CLASS}
            layout="home"
            to={`/projets/${projet.slug}`}
            title={projet.titre}
            imageUrl={projet.image ? getImageUrl(projet.image) : FALLBACK_IMAGE}
            badge={projet.type}
            subtitle={projet.statut}
            description={projet.description}
            meta={[
              ...(projet.annee
                ? [{ icon: <Calendar className="size-3.5" />, label: projet.annee }]
                : []),
              ...(projet.location
                ? [
                    {
                      icon: <MapPin className="size-3.5" />,
                      label: `${projet.location.adresse}`,
                    },
                  ]
                : []),
            ]}
            actionLabel="Voir le projet"
          />
        ))}
      </ScrollableCardGrid>

      {count === 0 && total > 0 && (
        <p className="py-10 text-center text-body text-ink-500">
          Aucun projet ne correspond à ces critères.{' '}
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

export default ProjetsSection;
