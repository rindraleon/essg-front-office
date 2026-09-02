import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface DetailPageSkeletonProps {
  label?: string;
  layout?: 'article' | 'split';
}

const DetailPageSkeleton: React.FC<DetailPageSkeletonProps> = ({
  label = 'Chargement…',
  layout = 'article',
}) => (
  <div className="min-h-screen bg-ink-50">
    <div className="section-shell section-y">
      <div className="space-y-8">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-72 rounded-3xl sm:h-80" />

        {layout === 'article' ? (
          <div className="mx-auto max-w-3xl space-y-4">
            <Skeleton className="h-9 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Skeleton className="h-9 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        )}
      </div>

      <output className="sr-only">{label}</output>
    </div>
  </div>
);

export default DetailPageSkeleton;
