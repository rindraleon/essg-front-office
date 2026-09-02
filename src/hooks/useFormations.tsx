import { useQuery } from '@tanstack/react-query';
import { toError } from '@/utils';
import { formationService } from '@/services';

export default function useFormations(page = 1, limit = 6) {
  const query = useQuery({
    queryKey: ['formations', 'list', page, limit],
    queryFn: () => formationService.findAll(page, limit),
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: toError(query.error),
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
    error: toError(query.error),
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
    error: toError(query.error),
    refetch: query.refetch,
  };
}
