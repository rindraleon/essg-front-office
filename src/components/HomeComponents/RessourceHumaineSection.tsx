import { Mail, Phone } from 'lucide-react';
import { useActiveRessourcesHumaines } from '@/hooks';
import { getImageUrl, formatFullName } from '@/utils';
import { CARD_WIDTH_CLASS } from '@/constants';
import SectionHeader from '../common/SectionHeader';
import SectionContent from '../common/SectionContent';
import ParticlesBackground from '../animations/ParticlesBackground';
import ScrollableCardGrid from '../common/ScrollableCardGrid';
import SectionCta from '../common/SectionCta';
import MediaCard from '../common/MediaCard';
import { MediaCardSkeletonGrid } from '../common/MediaCardSkeleton';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const SECTION_CTA = { label: 'Découvrir tous les membres', link: '/ressources-humaines' } as const;

const RessourceHumaineSection = () => {
  const { ressourcesHumaines, loading, error } = useActiveRessourcesHumaines();

  return (
    <SectionContent
      backgroundContent={<ParticlesBackground />}
      loading={loading}
      error={error}
      isEmpty={!loading && ressourcesHumaines.length === 0}
      emptyMessage="Aucun membre de l'équipe disponible pour le moment."
      headerContent={
        <SectionHeader
          eyebrow="Corps Professoral & Encadrement"
          title="Notre Équipe"
          description="Des enseignants-chercheurs et experts qualifiés au service de l'excellence académique"
        />
      }
      loadingSkeletons={<MediaCardSkeletonGrid layout="home" />}
      sectionClassName="bg-gradient-to-br from-brand-50/55 via-white to-brand-50/40 section-y"
      fluid
      containerClassName="max-w-none"
    >
      <ScrollableCardGrid className="mt-2 w-full" ariaLabel="Membres de l'équipe">
        {ressourcesHumaines.map((membre) => {
          const fullName = formatFullName(membre);

          return (
            <MediaCard
              key={membre.id}
              className={CARD_WIDTH_CLASS}
              layout="home"
              to={`/ressources-humaines/${membre.slug}`}
              title={fullName}
              imageUrl={membre.photo ? getImageUrl(membre.photo) : FALLBACK_IMAGE}
              imageAlt={fullName}
              subtitle={membre.poste}
              description={membre.description}
              meta={[
                ...(membre.email
                  ? [{ icon: <Mail className="size-3.5" />, label: membre.email }]
                  : []),
                ...(membre.telephone
                  ? [{ icon: <Phone className="size-3.5" />, label: membre.telephone }]
                  : []),
              ]}
              actionLabel="Voir le profil"
            />
          );
        })}
      </ScrollableCardGrid>

      <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
    </SectionContent>
  );
};

export default RessourceHumaineSection;
