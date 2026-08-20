import { useQuery } from '@tanstack/react-query';
import { formationService } from '../services';

export default function useFormations(page = 1, limit = 10) {
  const query = useQuery({
    queryKey: ['formations', 'list', page, limit],
    queryFn: () => formationService.findAll(page, limit),
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error : query.error ? new Error('Erreur inconnue') : null,
    refetch: query.refetch,
  };
}

export function useFeaturedFormations(limit = 6) {
  const query = useQuery({
    queryKey: ['formations', 'featured', limit],
    queryFn: () => formationService.findFeatured(limit),
  });

  return {
    formations: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error : query.error ? new Error('Erreur inconnue') : null,
    refetch: query.refetch,
  };
}

export function useFormationBySlug(slug: string) {
  const query = useQuery({
    queryKey: ['formations', 'slug', slug],
    queryFn: () => formationService.findBySlug(slug),
    enabled: Boolean(slug),
  });

  return {
    formation: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error : query.error ? new Error('Erreur inconnue') : null,
    refetch: query.refetch,
  };
}
