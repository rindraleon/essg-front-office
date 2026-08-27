import { Calendar, MapPin } from 'lucide-react';
import React from 'react';
import { getImageUrl , generateSlug } from '@/utils';
import MediaCard from '../common/MediaCard';
import type { ProjetCardProps } from '@/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const ProjetCard: React.FC<ProjetCardProps> = ({ projet, detailLinkBase = '/projets' }) => {
  const slug = projet.slug || generateSlug(projet.titre);

  return (
    <MediaCard
      to={`${detailLinkBase}/${slug}`}
      title={projet.titre}
      imageUrl={projet.image ? getImageUrl(projet.image) : FALLBACK_IMAGE}
      ratio="landscape"
      badge={projet.type}
      subtitle={projet.statut}
      description={projet.description}
      meta={[
        ...(projet.annee ? [{ icon: <Calendar className="size-3.5" />, label: projet.annee }] : []),
        ...(projet.location
          ? [
              {
                icon: <MapPin className="size-3.5" />,
                label: `${projet.location.ville}, ${projet.location.pays}`,
              },
            ]
          : []),
      ]}
      actionLabel="Voir le projet"
    />
  );
};

export default ProjetCard;
