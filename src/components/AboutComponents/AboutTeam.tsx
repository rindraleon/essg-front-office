import { CAMPUS_GALLERY, CARD_WIDTH_CLASS, SITE_HERO_IMAGE } from '@/constants';
import { useActiveRessourcesHumaines } from '@/hooks';
import { formatFullName, getImageUrl } from '@/utils';
import MediaCard from '../common/MediaCard';
import { MediaCardSkeletonGrid } from '../common/MediaCardSkeleton';
import RevealOnScroll from '../common/RevealOnScroll';
import ScrollableCardGrid from '../common/ScrollableCardGrid';
import SectionContent from '../common/SectionContent';

const AboutTeam = () => {
  const { ressourcesHumaines, loading, error } = useActiveRessourcesHumaines();
  const fallbackImage = CAMPUS_GALLERY[0]?.src ?? SITE_HERO_IMAGE;

  return (
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
              imageUrl={membre.photo ? getImageUrl(membre.photo) : fallbackImage}
              imageAlt={fullName}
              subtitle={membre.poste}
              description={membre.description}
              actionLabel="Voir le profil"
            />
          );
        })}
      </ScrollableCardGrid>
    </SectionContent>
  );
};

export default AboutTeam;
