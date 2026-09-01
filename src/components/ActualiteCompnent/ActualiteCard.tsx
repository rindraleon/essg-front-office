import { Calendar, User } from 'lucide-react';
import type { Actualite } from '@/types';
import { formatDate, getImageUrl } from '@/utils';
import MediaCard from '../common/MediaCard';

interface Props {
  actualite: Actualite;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const ActualiteCard = ({ actualite }: Props) => (
  <MediaCard
    to={`/actualites/${actualite.slug}`}
    title={actualite.titre}
    imageUrl={actualite.image ? getImageUrl(actualite.image) : FALLBACK_IMAGE}
    ratio="landscape"
    badge={actualite.categorie}
    description={actualite.resume}
    meta={[
      { icon: <Calendar className="size-3.5" />, label: formatDate(actualite.date) },
      ...(actualite.auteur
        ? [{ icon: <User className="size-3.5" />, label: actualite.auteur }]
        : []),
    ]}
    actionLabel="Lire l'article"
  />
);

export default ActualiteCard;
