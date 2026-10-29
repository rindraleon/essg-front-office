import { Download, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
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

interface ResultatPublicationPanelProps {
  resultat: ResultatPublication;
}

export function ResultatPublicationPanel({ resultat }: ResultatPublicationPanelProps) {
  const isPublicConsultation = resultat.modeConsultation === 'public';
  const showDetailsTable = isPublicConsultation && resultat.type === 'excel';
  const fichierUrl = `${API_BASE_URL}/resultats/public/${resultat.id}/fichier?download=1`;

  const renderContent = () => {
    if (showDetailsTable) {
      return (
        <ResultatsPublicsTable
          publicationId={resultat.id}
          totalIndividuels={resultat.totalIndividuels}
        />
      );
    }

    if (isPublicConsultation) {
      return (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm text-ink-600">
          <p>
            Ce résultat est publié au format PDF. Consultez ou téléchargez le document officiel.
          </p>
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
      );
    }

    return (
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink-100 bg-ink-50 px-4 py-3 text-sm text-ink-600">
        <p className="flex items-center gap-2">
          <Lock className="size-4 text-ink-400" />
          Ce résultat est protégé. Utilisez votre matricule et votre code de consultation.
        </p>
        <Link to="/resultat" className={buttonVariants({ size: 'sm', variant: 'outline' })}>
          Consulter mon résultat
        </Link>
      </div>
    );
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="border-b border-ink-100 px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-ink-900">{resultat.titre}</h2>
              <Badge variant="muted" className="text-xs">
                {TYPE_LABEL[resultat.type] ?? resultat.type}
              </Badge>
            </div>
            <p className="mt-1 truncate text-sm text-ink-500">{resultat.fichierOriginal}</p>
          </div>
          <Link
            to={`/resultats/${resultat.id}`}
            className={buttonVariants({ size: 'sm', variant: 'outline' })}
          >
            Détails
          </Link>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-xs font-medium uppercase text-ink-500">Année / Période</dt>
            <dd className="text-ink-900">
              {resultat.anneeScolaire} / {resultat.periode || '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-ink-500">Classe / formation</dt>
            <dd className="text-ink-900">{resultat.classeFormation || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-ink-500">Résultats</dt>
            <dd className="text-ink-900">
              <span data-numeric>{resultat.totalIndividuels}</span> ligne(s)
              <span className="block text-xs">
                <span className="text-brand-700">{resultat.totalAdmis} admis</span>
                {' · '}
                <span className="text-danger-700">{resultat.totalAjourne} ajourné(s)</span>
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-ink-500">Publié le</dt>
            <dd className="text-ink-900">
              {formatDate(resultat.misAJourLe)}
              <span className="block text-xs text-ink-500">{formatSize(resultat.taille)}</span>
            </dd>
          </div>
        </dl>
      </div>

      <div className="px-5 pb-5">{renderContent()}</div>
    </section>
  );
}
