import { Globe, Mail } from 'lucide-react';
import React from 'react';
import { getImageUrl , generateSlug } from '@/utils';
import MediaCard from '../common/MediaCard';
import type { PartenaireCardProps } from '@/types';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1521737711867-e3b97375f902?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';

const PartenaireCard: React.FC<PartenaireCardProps> = ({ partenaire }) => (
  <MediaCard
    to={`/partenaires/${partenaire.slug ?? generateSlug(partenaire.nom)}`}
    title={partenaire.nom}
    imageUrl={partenaire.logo ? getImageUrl(partenaire.logo) : FALLBACK_IMAGE}
    imageAlt={`Logo de ${partenaire.nom}`}
    imageFit="contain"
    ratio="landscape"
    badge={partenaire.type}
    subtitle={partenaire.secteur}
    description={partenaire.description}
    meta={[
      ...(partenaire.siteWeb
        ? [{ icon: <Globe className="size-3.5" />, label: partenaire.siteWeb }]
        : []),
      ...(partenaire.contact
        ? [{ icon: <Mail className="size-3.5" />, label: partenaire.contact }]
        : []),
    ]}
    actionLabel="Voir le partenaire"
  />
);

export default PartenaireCard;
