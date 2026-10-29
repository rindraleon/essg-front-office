import { useState } from 'react';
import { Search, User, Key } from 'lucide-react';
import { consulterResultat, type ConsultationResultat } from '@/services';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

const STATUT_LABEL: Record<string, string> = {
  admis: 'Admis',
  ajourne: 'Ajourné',
};

const STATUT_BADGE: Record<string, 'success' | 'danger'> = {
  admis: 'success',
  ajourne: 'danger',
};

export function ResultatConsultationForm() {
  const [matricule, setMatricule] = useState('');
  const [code, setCode] = useState('');
  const [resultat, setResultat] = useState<ConsultationResultat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricule || !code) {
      setError('Le matricule et le code de consultation sont requis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResultat(null);

    try {
      const data = await consulterResultat(matricule, code);
      setResultat(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Aucun résultat publié ne correspond à ce matricule et à ce code de consultation.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="section-y-tight">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-ink-100 bg-white shadow-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-ink-900 mb-6">
            Consulter un résultat individuel
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">Matricule</label>
                <div className="flex items-center gap-2">
                  <User className="size-4 text-ink-400" />
                  <Input
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    placeholder="Ex: CON2026-001"
                    disabled={isLoading}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink-700 mb-1">
                  Code de consultation
                </label>
                <div className="flex items-center gap-2">
                  <Key className="size-4 text-ink-400" />
                  <Input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ex: CODE123"
                    disabled={isLoading}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading || !matricule || !code}
              className="w-full py-3"
            >
              <Search className="mr-2 size-4" />
              {isLoading ? 'Recherche…' : 'Consulter'}
            </Button>
          </form>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="size-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Résultat introuvable</h3>
                  <div className="mt-1 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {resultat && (
            <div className="mt-6 rounded-xl border border-ink-100 bg-ink-50 p-4">
              <h3 className="text-sm font-medium text-ink-900 mb-1">Résultat trouvé</h3>
              <p className="mb-3 text-xs text-ink-500">
                {resultat.publication.titre} · {resultat.publication.anneeScolaire}
                {resultat.publication.periode ? ` · ${resultat.publication.periode}` : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-1">
                    Matricule
                  </p>
                  <p className="text-ink-700">{resultat.individu.matricule ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-1">
                    Nom complet
                  </p>
                  <p className="text-ink-700">
                    {resultat.individu.nom ?? ''} {resultat.individu.prenom ?? ''}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-1">
                    Classe
                  </p>
                  <p className="text-ink-700">{resultat.individu.classe ?? '—'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-1">
                    Statut académique
                  </p>
                  {resultat.individu.statutAcademique ? (
                    <Badge variant={STATUT_BADGE[resultat.individu.statutAcademique] ?? 'muted'}>
                      {STATUT_LABEL[resultat.individu.statutAcademique] ??
                        resultat.individu.statutAcademique}
                    </Badge>
                  ) : (
                    <p className="text-ink-700">—</p>
                  )}
                </div>
              </div>

              {resultat.individu.observation && (
                <div className="mt-3 border-t border-ink-200 pt-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-ink-400 mb-1">
                    Observation
                  </p>
                  <p className="text-ink-700">{resultat.individu.observation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
