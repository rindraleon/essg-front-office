import { Inbox } from 'lucide-react';
import { Button } from '../ui/button';
import type { EmptyStateProps } from '@/types';
import { cn } from '@/lib';

const EmptyState = ({
  icon,
  title = 'Aucun résultat trouvé',
  description = 'Essayez de modifier vos critères de recherche.',
  actionLabel = 'Réinitialiser les filtres',
  onAction,
  compact = false,
  className,
}: EmptyStateProps & { compact?: boolean; className?: string }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-10 px-4' : 'section-y px-4',
        'animate-fade-in',
        className
      )}
    >
      <div
        className={cn(
          'mx-auto mb-5 flex items-center justify-center rounded-2xl bg-brand-50 text-brand-500 ring-1 ring-brand-100',
          compact ? 'h-14 w-14' : 'h-20 w-20'
        )}
      >
        {icon ?? <Inbox className={cn(compact ? 'size-7' : 'size-10')} />}
      </div>
      <h3 className={cn('mb-2 font-semibold text-ink-900', compact ? 'text-h5' : 'text-h4')}>
        {title}
      </h3>
      <p
        className={cn(
          'mx-auto text-ink-500',
          compact ? 'max-w-sm text-small' : 'max-w-md text-body',
          onAction && 'mb-6'
        )}
      >
        {description}
      </p>
      {onAction && (
        <Button variant="outline" onClick={onAction} size={compact ? 'sm' : 'default'}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
