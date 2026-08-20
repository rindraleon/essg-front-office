import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '../../constants/layout';
import ScrollableCardGrid from './ScrollableCardGrid';
import { cn } from '@/lib/utils';

interface MediaCardSkeletonProps {
  /** Proportion : doit correspondre à celle des cartes réelles. */
  ratio?: 'portrait' | 'landscape';
  className?: string;
}

/**
 * Silhouette d'une `MediaCard` pendant le chargement.
 *
 * Elle reprend exactement la proportion et le rayon de la carte finale : le
 * contenu réel prend donc la place du squelette sans décalage de mise en
 * page (aucun saut visuel à l'arrivée des données).
 */
export const MediaCardSkeleton: React.FC<MediaCardSkeletonProps> = ({
  ratio = 'portrait',
  className,
}) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-2xl',
      ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[4/3]',
      className,
    )}
  >
    <Skeleton className="size-full rounded-2xl" />
    <div className="absolute inset-x-0 bottom-0 space-y-2 p-5">
      <Skeleton className="h-5 w-4/5 bg-ink-200" />
      <Skeleton className="h-4 w-2/5 bg-ink-200" />
    </div>
  </div>
);

interface MediaCardSkeletonGridProps {
  /** Nombre de silhouettes (4 au maximum, une par clé stable). */
  count?: number;
  ratio?: 'portrait' | 'landscape';
}

/**
 * Rangée de silhouettes, dans le même conteneur défilant que les cartes
 * réelles. Évite de recopier la boucle de chargement dans chaque section.
 */
export const MediaCardSkeletonGrid: React.FC<MediaCardSkeletonGridProps> = ({
  count = 4,
  ratio = 'portrait',
}) => (
  <ScrollableCardGrid className="mt-2 w-full" ariaLabel="Chargement en cours">
    {SKELETON_KEYS.slice(0, count).map((key) => (
      <MediaCardSkeleton key={key} ratio={ratio} className={CARD_WIDTH_CLASS} />
    ))}
  </ScrollableCardGrid>
);

export default MediaCardSkeletonGrid;
