import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { getResultatPublic } from '@/services';
import { ResultatDetailCard } from '@/components/ResultatsComponents/ResultatDetailCard';
import { useTitle } from '@/hooks';

export default function ResultatDetailPage() {
  const { id } = useParams();
  const publicationId = Number(id);
  const hasValidId = Number.isInteger(publicationId) && publicationId > 0;

  const {
    data: publication,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['resultats', 'public', 'detail', publicationId],
    queryFn: () => getResultatPublic(publicationId),
    enabled: hasValidId,
  });

  useTitle(publication ? `Résultat – ${publication.titre} | ESSG` : 'Résultat | ESSG');

  if (!hasValidId || error) {
    return (
      <div className="min-h-screen bg-ink-50">
        <PageHero title="Résultat" description="Publication introuvable." />
        <div className="section-y-tight mx-auto max-w-xl px-4 sm:px-6">
          <EmptyState
            icon={<AlertCircle className="size-10 text-amber-600" />}
            title="Détails non disponibles"
            description="Cette publication n'est pas accessible en consultation publique ou n'existe pas."
          />
          <div className="mt-6">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-200 bg-ink-50 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
            >
              <ArrowLeft className="mr-2 size-4" /> Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading || !publication) {
    return (
      <div className="min-h-screen bg-ink-50">
        <PageHero title="Résultat" description="Chargement…" />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero title="Détail du résultat" description={publication.titre} />

      <Breadcrumb
        items={[{ label: 'Résultats', to: '/resultats' }, { label: publication.titre }]}
      />

      <ResultatDetailCard resultat={publication} onRefresh={() => void refetch()} />
    </div>
  );
}
