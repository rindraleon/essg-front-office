import { useQuery } from '@tanstack/react-query';
import { toErrorMessage } from '@/utils';
import { ressourceHumaineService } from '@/services';

export default function useRessourcesHumaines(page = 1, limit = 6, search = '', poste = '') {
  const query = useQuery({
    queryKey: ['ressources-humaines', 'list', page, limit, search, poste],
    queryFn: () => ressourceHumaineService.findAll(page, limit, search, poste),
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error),
    refetch: query.refetch,
  };
}

export function useActiveRessourcesHumaines(limit = 100) {
  const query = useQuery({
    queryKey: ['ressources-humaines', 'active', limit],
    queryFn: () => ressourceHumaineService.findActive(),
  });

  return {
    ressourcesHumaines: query.data ?? [],
    loading: query.isLoading,
    error: toErrorMessage(query.error),
  };
}

export function useRessourceHumaineBySlug(slug: string) {
  const query = useQuery({
    queryKey: ['ressources-humaines', 'slug', slug],
    queryFn: () => ressourceHumaineService.findBySlug(slug),
    enabled: Boolean(slug),
  });

  return {
    ressourceHumaine: query.data ?? null,
    loading: query.isLoading,
    error: toErrorMessage(query.error),
  };
}
