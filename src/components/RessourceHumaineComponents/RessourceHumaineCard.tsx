import { Mail, Phone } from 'lucide-react';
import React from 'react';
import { getImageUrl } from '../../utils/image.utils';
import { formatFullName } from '../../utils/name.utils';
import MediaCard from '../common/MediaCard';
import type { RessourceHumaine } from '../../types/ressource-humaine.types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const RessourceHumaineCard: React.FC<{ ressourceHumaine: RessourceHumaine }> = ({
  ressourceHumaine,
}) => {
  const fullName = formatFullName(ressourceHumaine);

  return (
    <MediaCard
      to={`/ressources-humaines/${ressourceHumaine.slug ?? ressourceHumaine.id}`}
      title={fullName}
      imageUrl={ressourceHumaine.photo ? getImageUrl(ressourceHumaine.photo) : FALLBACK_IMAGE}
      imageAlt={fullName}
      subtitle={ressourceHumaine.poste}
      description={ressourceHumaine.description}
      meta={[
        ...(ressourceHumaine.email
          ? [{ icon: <Mail className="size-3.5" />, label: ressourceHumaine.email }]
          : []),
        ...(ressourceHumaine.telephone
          ? [{ icon: <Phone className="size-3.5" />, label: ressourceHumaine.telephone }]
          : []),
      ]}
      actionLabel="Voir le profil"
    />
  );
};

export default RessourceHumaineCard;
