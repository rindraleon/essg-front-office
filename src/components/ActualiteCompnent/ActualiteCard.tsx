import { Calendar, User } from 'lucide-react';
import type { Actualite } from '../../types/actualite.types';
import { formatDate } from '../../utils/date.utils';
import { getImageUrl } from '../../utils/image.utils';
import MediaCard from '../common/MediaCard';

interface Props {
  actualite: Actualite;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1768117173988-5ebfdde4fdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

/**
 * Carte d'actualité — délègue toute la présentation à `MediaCard`, afin que
 * la page « Actualités » et la section d'accueil aient rigoureusement le même
 * rendu et le même comportement au survol.
 */
const ActualiteCard = ({ actualite }: Props) => (
  <MediaCard
    to={`/actualites/${actualite.slug}`}
    title={actualite.titre}
    imageUrl={actualite.image ? getImageUrl(actualite.image) : FALLBACK_IMAGE}
    badge={actualite.categorie}
    description={actualite.resume}
    meta={[
      { icon: <Calendar className="size-3.5" />, label: formatDate(actualite.date) },
      ...(actualite.auteur ? [{ icon: <User className="size-3.5" />, label: actualite.auteur }] : []),
    ]}
    actionLabel="Lire l'article"
  />
);

export default ActualiteCard;
