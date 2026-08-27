import { useQuery } from '@tanstack/react-query';
import { toErrorMessage } from '@/utils';
import { actualiteService } from '@/services';

export default function useActualites(page = 1, limit = 6, search = '', categorie = '') {
  const query = useQuery({
    queryKey: ['actualites', 'list', page, limit, search, categorie],
    queryFn: () => actualiteService.findAll(page, limit, search, categorie),
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error),
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
    error: toErrorMessage(query.error),
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
    error: toErrorMessage(query.error),
  };
}
