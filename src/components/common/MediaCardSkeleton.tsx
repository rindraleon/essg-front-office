import React from 'react';
import { Skeleton } from '../ui/skeleton';
import { CARD_WIDTH_CLASS, SKELETON_KEYS } from '@/constants';
import ScrollableCardGrid from './ScrollableCardGrid';
import { cn } from '@/lib';

interface MediaCardSkeletonProps {
  ratio?: 'portrait' | 'landscape';
  layout?: 'default' | 'home';
  className?: string;
}

export const MediaCardSkeleton: React.FC<MediaCardSkeletonProps> = ({
  ratio = 'portrait',
  layout = 'default',
  className,
}) => {
  if (layout === 'home') {
    return (
      <div
        className={cn(
          'flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white',
          className
        )}
      >
        <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
          <Skeleton className="size-full rounded-none" />
          <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-ink-950/30 to-transparent p-5 pt-12">
            <Skeleton className="h-5 w-4/5 bg-ink-200/80" />
            <Skeleton className="h-4 w-2/5 bg-ink-200/80" />
          </div>
        </div>
        <div className="min-h-[9.5rem] space-y-3 p-5">
          <Skeleton className="h-4 w-full bg-ink-100" />
          <Skeleton className="h-4 w-11/12 bg-ink-100" />
          <Skeleton className="h-4 w-4/5 bg-ink-100" />
          <Skeleton className="mt-3 h-3 w-1/2 bg-ink-100" />
        </div>
      </div>
    );
  }

  const ratioClass = ratio === 'portrait' ? 'aspect-[4/5]' : 'aspect-[4/3]';
  return (
    <div className={cn('relative overflow-hidden rounded-2xl', ratioClass, className)}>
      <Skeleton className="size-full rounded-2xl" />
      <div className="absolute inset-x-0 bottom-0 space-y-2 p-5">
        <Skeleton className="h-5 w-4/5 bg-ink-200" />
        <Skeleton className="h-4 w-2/5 bg-ink-200" />
      </div>
    </div>
  );
};

interface MediaCardSkeletonGridProps {
  count?: number;
  ratio?: 'portrait' | 'landscape';
  layout?: 'default' | 'home';
}

export const MediaCardSkeletonGrid: React.FC<MediaCardSkeletonGridProps> = ({
  count = 4,
  ratio = 'portrait',
  layout = 'default',
}) => (
  <ScrollableCardGrid className="mt-2 w-full" ariaLabel="Chargement en cours">
    {SKELETON_KEYS.slice(0, count).map((key) => (
      <MediaCardSkeleton key={key} ratio={ratio} layout={layout} className={CARD_WIDTH_CLASS} />
    ))}
  </ScrollableCardGrid>
);

export default MediaCardSkeletonGrid;
