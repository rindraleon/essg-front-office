import { useQuery } from '@tanstack/react-query';
import { actualiteService } from '../services';

export default function useActualites(page = 1, limit = 10) {
  const query = useQuery({
    queryKey: ['actualites', 'list', page, limit],
    queryFn: () => actualiteService.findAll(page, limit),
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
    refetch: query.refetch,
  };
}

export function useRecentActualites(limit = 6) {
  const query = useQuery({
    queryKey: ['actualites', 'recent', limit],
    queryFn: () => actualiteService.findRecent(limit),
  });

  return {
    actualites: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
  };
}

export function useActualiteBySlug(slug: string) {
  const query = useQuery({
    queryKey: ['actualites', 'slug', slug],
    queryFn: () => actualiteService.findBySlug(slug),
    enabled: Boolean(slug),
  });

  return {
    actualite: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
  };
}
