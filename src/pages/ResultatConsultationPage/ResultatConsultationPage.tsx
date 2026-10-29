import { LoaderCircle, AlertCircle } from 'lucide-react';
import { PageHero } from '@/components/common/PageHero';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { EmptyState } from '@/components/common/EmptyState';
import { useAdmissionsSettings, useTitle } from '@/hooks';
import { ResultatConsultationForm } from '@/components/ResultatsComponents/ResultatConsultationForm';

const CONSULTATION_CLOSED = () => (
  <div className="mx-auto max-w-xl px-4 section-y-tight sm:px-6">
    <EmptyState
      icon={<AlertCircle className="size-10 text-amber-600" />}
      title="Consultation des résultats indisponible"
      description={
        "Le module Résultats n'est pas activé pour le moment. Veuillez réessayer ultérieurement ou contacter l'établissement."
      }
      actionLabel="Nous contacter"
    />
  </div>
);

export default function ResultatConsultationPage() {
  useTitle('Consultation des résultats | ESSG');

  const { data: settings, isLoading: settingsLoading } = useAdmissionsSettings();
  const navigationPrincipale = settings?.navigationPrincipale ?? 'aucun';

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-ink-50">
        <PageHero
          title="Consultation des résultats"
          description="Chargement de la page..."
        />
        <div className="flex min-h-[60vh] items-center justify-center">
          <LoaderCircle className="size-8 animate-spin text-brand-600" />
        </div>
      </div>
    );
  }

  if (navigationPrincipale !== 'resultats') {
    return (
      <div className="min-h-screen bg-ink-50">
        <PageHero
          title="Consultation des résultats"
          description="Ce module n'est pas activé pour le moment."
        />
        <Breadcrumb items={[{ label: 'Résultats' }]} />
        <CONSULTATION_CLOSED />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        title="Consultation des résultats"
        description="Entrez votre matricule et votre code de consultation pour consulter votre résultat publié."
      />

      <Breadcrumb items={[{ label: 'Résultats' }]} />

      <section className="section-y-tight">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <ResultatConsultationForm />
        </div>
      </section>
    </div>
  );
}
