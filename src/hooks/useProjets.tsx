import { useQuery } from '@tanstack/react-query';
import { projetService } from '../services';

export default function useProjets() {
  const query = useQuery({
    queryKey: ['projets', 'list'],
    queryFn: () => projetService.findAll(),
  });

  return {
    projets: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
    refetch: query.refetch,
  };
}

export function useProjetById(id: string) {
  const query = useQuery({
    queryKey: ['projets', 'id', id],
    queryFn: () => projetService.findOne(Number(id)),
    enabled: Boolean(id),
  });

  return {
    projet: query.data ?? null,
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
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
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
  };
}
