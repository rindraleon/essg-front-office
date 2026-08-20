import { useQuery } from '@tanstack/react-query';
import { ressourceHumaineService } from '../services';

export default function useRessourcesHumaines(page = 1, limit = 10) {
  const query = useQuery({
    queryKey: ['ressources-humaines', 'list', page, limit],
    queryFn: () => ressourceHumaineService.findAll(page, limit),
  });

  return {
    data: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
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
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
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
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
  };
}
