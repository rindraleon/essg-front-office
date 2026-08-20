import { useQuery } from '@tanstack/react-query';
import partenaireService from '../services/partenaire.service';

export default function usePartenaires() {
  const query = useQuery({
    queryKey: ['partenaires', 'list'],
    queryFn: () => partenaireService.findAll(),
  });

  return {
    partenaires: query.data ?? [],
    loading: query.isLoading,
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
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
    error: query.error instanceof Error ? query.error.message : query.error ? 'Erreur inconnue' : null,
  };
}
