import { Inbox } from 'lucide-react';
import { Button } from '../ui/button';
import type { EmptyStateProps } from '@/types';

const EmptyState = ({
  icon,
  title = 'Aucun résultat trouvé',
  description = 'Essayez de modifier vos critères de recherche.',
  actionLabel = 'Réinitialiser les filtres',
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="section-y text-center animate-fade-in">
      <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-50 text-brand-500 ring-1 ring-brand-100 shadow-[0_8px_24px_-12px_rgb(84_124_54_/_0.35)]">
        {icon ?? <Inbox className="size-10" />}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-ink-900">{title}</h3>
      <p className="mx-auto mb-7 max-w-md text-ink-500">{description}</p>
      {onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
