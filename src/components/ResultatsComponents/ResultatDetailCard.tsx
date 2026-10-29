import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { API_BASE_URL } from '@/api';
import type { ResultatPublication } from '@/services';
import { ResultatsPublicsTable } from './ResultatsPublicsTable';

const TYPE_LABEL: Record<string, string> = {
  excel: 'Excel',
  pdf: 'PDF',
};

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString('fr-MG') : '—';

const formatSize = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return '—';
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
};

interface ResultatDetailCardProps {
  resultat: ResultatPublication;
  onRefresh: () => void;
}

export function ResultatDetailCard({ resultat, onRefresh }: ResultatDetailCardProps) {
  const fichierUrl = `${API_BASE_URL}/resultats/public/${resultat.id}/fichier?download=1`;
  const isPublicConsultation = resultat.modeConsultation === 'public';

  return (
    <section className="section-y-tight">
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${
          isPublicConsultation ? 'max-w-6xl' : 'max-w-3xl'
        }`}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link to="/resultats" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            ← Retour aux résultats
          </Link>
          <div className="flex gap-2">
            <Button onClick={onRefresh} size="sm" variant="outline">
              Actualiser
            </Button>
            {resultat.autorisePublicationPublique && (
              <a
                href={fichierUrl}
                className={buttonVariants({ size: 'sm' })}
                download={resultat.fichierOriginal}
              >
                <Download className="mr-2 size-4" /> Télécharger
              </a>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="border-b border-ink-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-ink-900">{resultat.titre}</h2>
            <p className="mt-1 truncate text-sm text-ink-500">{resultat.fichierOriginal}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 px-6 py-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase text-ink-500">Année / Période</p>
              <p className="text-sm text-ink-900">
                {resultat.anneeScolaire} / {resultat.periode || '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-ink-500">Classe / formation</p>
              <p className="text-sm text-ink-900">{resultat.classeFormation || '—'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-ink-500">Type de fichier</p>
              <p className="text-sm text-ink-900">{TYPE_LABEL[resultat.type] ?? resultat.type}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-ink-500">Consultation</p>
              <p className="text-sm text-ink-900">
                {resultat.modeConsultation === 'protege'
                  ? 'Protégée (matricule + code)'
                  : 'Publique (consultation libre)'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-ink-500">Publié le</p>
              <p className="text-sm text-ink-900">{formatDate(resultat.misAJourLe)}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-ink-500">Taille du fichier</p>
              <p className="text-sm text-ink-900">{formatSize(resultat.taille)}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase text-ink-500">Totaux</p>
              <p className="text-sm text-ink-900">
                <span data-numeric>{resultat.totalIndividuels}</span> résultat(s) au total
                {' • '}
                <span className="text-brand-700">{resultat.totalAdmis} admis</span>
                {' • '}
                <span className="text-danger-700">{resultat.totalAjourne} ajourné(e)s</span>
              </p>
            </div>
          </div>

          {resultat.modeConsultation === 'protege' && (
            <div className="border-t border-ink-100 bg-ink-50 px-6 py-4 text-sm text-ink-600">
              Ce résultat est protégé. Utilisez le formulaire de consultation avec votre matricule
              et votre code de consultation pour accéder à votre résultat individuel.
            </div>
          )}
        </div>

        {isPublicConsultation && resultat.type === 'excel' && (
          <ResultatsPublicsTable
            publicationId={resultat.id}
            totalIndividuels={resultat.totalIndividuels}
          />
        )}
      </div>
    </section>
  );
}
