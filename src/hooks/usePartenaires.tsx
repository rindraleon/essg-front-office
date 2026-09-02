import { useQuery } from '@tanstack/react-query';
import { toErrorMessage } from '@/utils';
import { partenaireService } from '@/services';

export function usePaginatedPartenaires(page = 1, limit = 6, search = '', type = '') {
  const query = useQuery({
    queryKey: ['partenaires', 'paginated', page, limit, search, type],
    queryFn: () => partenaireService.findPaginated(page, limit, search, type),
  });
  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error),
  };
}

export default function usePartenaires() {
  const query = useQuery({
    queryKey: ['partenaires', 'list'],
    queryFn: () => partenaireService.findAll(),
  });

  return {
    partenaires: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error),
    refetch: query.refetch,
  };
}

export function usePartenaireBySlug(slug: string) {
  const query = useQuery({
    queryKey: ['partenaires', 'slug', slug],
    queryFn: () => {
      const isNumeric = /^\d+$/.test(slug);
      return isNumeric
        ? partenaireService.findOne(Number(slug))
        : partenaireService.findBySlug(slug);
    },
    enabled: Boolean(slug),
  });

  return {
    partenaire: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error),
  };
}
