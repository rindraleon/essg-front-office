import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import EmptyState from './EmptyState';
import { ApiError } from '@/api/types/api';

interface QueryStateProps {
  loading?: boolean;
  error?: unknown;
  empty?: boolean;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  skeleton?: React.ReactNode;
  children: React.ReactNode;
}

function getErrorCopy(error: unknown): { title: string; description: string; network: boolean } {
  if (error instanceof ApiError) {
    if (error.kind === 'network' || error.kind === 'timeout') {
      return {
        title: 'Connexion impossible',
        description: error.message,
        network: true,
      };
    }
    return {
      title: 'Une erreur est survenue',
      description: error.message,
      network: false,
    };
  }
  if (error instanceof Error) {
    return { title: 'Une erreur est survenue', description: error.message, network: false };
  }
  return {
    title: 'Une erreur est survenue',
    description: 'Impossible de charger les données pour le moment.',
    network: false,
  };
}

export default function QueryState({
  loading,
  error,
  empty,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  onEmptyAction,
  skeleton,
  children,
}: QueryStateProps) {
  if (loading) {
    return (
      skeleton ?? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
              <Skeleton className="mb-4 h-40 w-full rounded-xl" />
              <Skeleton className="mb-2 h-4 w-1/3" />
              <Skeleton className="mb-2 h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )
    );
  }

  if (error) {
    const copy = getErrorCopy(error);
    const Icon = copy.network ? WifiOff : AlertTriangle;
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center animate-fade-in">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-red-100">
          <Icon className="size-7" />
        </div>
        <div>
          <h3 className="text-h5 font-semibold text-ink-900">{copy.title}</h3>
          <p className="mt-1 max-w-md text-small text-ink-500">{copy.description}</p>
        </div>
        {onRetry && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="size-4" />
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  if (empty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return <>{children}</>;
}
