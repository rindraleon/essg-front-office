import { PageHero } from '@/components/common/PageHero';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { ResultatsList } from '@/components/ResultatsComponents/ResultatsList';
import { useTitle } from '@/hooks';

export default function ResultatsGlobauxPage() {
  useTitle('Résultats publiés | ESSG');

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        title="Résultats publiés"
        description={
          "Consultez la liste des résultats de concours, examens et sélections de dossier publiés par l'établissement."
        }
      />

      <Breadcrumb items={[{ label: 'Résultats' }]} />

      <ResultatsList />
    </div>
  );
}
