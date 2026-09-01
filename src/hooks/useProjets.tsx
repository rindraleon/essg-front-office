import { useQuery } from '@tanstack/react-query';
import { toErrorMessage } from '@/utils';
import { projetService } from '@/services';

export function usePaginatedProjets(page = 1, limit = 6, search = '', type = '', statut = '') {
  const query = useQuery({
    queryKey: ['projets', 'paginated', page, limit, search, type, statut],
    queryFn: () => projetService.findPaginated(page, limit, search, type, statut),
  });
  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error),
  };
}

export default function useProjets() {
  const query = useQuery({
    queryKey: ['projets', 'list'],
    queryFn: () => projetService.findAll(),
  });

  return {
    projets: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error),
    refetch: query.refetch,
  };
}

export function useProjetBySlug(slug: string) {
  const query = useQuery({
    queryKey: ['projets', 'slug', slug],
    queryFn: () => projetService.findBySlug(slug),
    enabled: Boolean(slug),
  });

  return {
    projet: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error),
  };
}
