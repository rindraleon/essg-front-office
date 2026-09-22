import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { CARD_WIDTH_CLASS, MEDIA_CARD_BORDER_STYLE, SKELETON_KEYS } from '@/constants';
import ScrollableCardGrid from './ScrollableCardGrid';
import { cn } from '@/lib';

interface MediaCardSkeletonProps {
  layout?: 'default' | 'home';
  className?: string;
}

export const MediaCardSkeleton: React.FC<MediaCardSkeletonProps> = ({
  layout = 'default',
  className,
}) => {
  const isHomeLayout = layout === 'home';

  return (
    <div
      style={MEDIA_CARD_BORDER_STYLE}
      className={cn('flex h-full flex-col overflow-hidden rounded-2xl bg-white', className)}
    >
      {/* Zone image 16/9 */}
      <div className="relative aspect-video shrink-0 overflow-hidden">
        <Skeleton className="size-full rounded-none" />
      </div>
      {/* Zone contenu */}
      <div className={cn('flex flex-1 flex-col', isHomeLayout ? 'p-5' : 'p-5 sm:p-6')}>
        <Skeleton className="h-5 w-4/5 bg-ink-100" />
        <Skeleton className="mt-1 h-5 w-3/5 bg-ink-100" />
        <div className="mt-3 space-y-2">
          <Skeleton className="h-4 w-full bg-ink-100" />
          <Skeleton className="h-4 w-11/12 bg-ink-100" />
          <Skeleton className="h-4 w-4/5 bg-ink-100" />
        </div>
        <Skeleton className="mt-3 h-3 w-1/2 bg-ink-100" />
        <Skeleton className="mt-4 h-4 w-24 bg-ink-100" />
      </div>
    </div>
  );
};

interface MediaCardSkeletonGridProps {
  count?: number;
  layout?: 'default' | 'home';
}

export const MediaCardSkeletonGrid: React.FC<MediaCardSkeletonGridProps> = ({
  count = 4,
  layout = 'default',
}) => (
  <ScrollableCardGrid className="mt-2 w-full" ariaLabel="Chargement en cours">
    {SKELETON_KEYS.slice(0, count).map((key) => (
      <MediaCardSkeleton key={key} layout={layout} className={CARD_WIDTH_CLASS} />
    ))}
  </ScrollableCardGrid>
);

export default MediaCardSkeletonGrid;
