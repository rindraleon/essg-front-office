import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, FileSpreadsheet, Search, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/common/Pagination';
import { getResultatsIndividuelsPublics, type ResultatIndividuelPublic } from '@/services';

const STATUT_LABEL: Record<string, string> = {
  admis: 'Admis',
  ajourne: 'Ajourné',
};

const STATUT_BADGE: Record<string, 'success' | 'danger'> = {
  admis: 'success',
  ajourne: 'danger',
};

interface ResultatsPublicsTableProps {
  publicationId: number;
  totalIndividuels?: number;
}

export function ResultatsPublicsTable({
  publicationId,
  totalIndividuels,
}: ResultatsPublicsTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statut, setStatut] = useState<'' | 'admis' | 'ajourne'>('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statut]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['resultats', 'public', 'individuels', publicationId, page, debouncedSearch, statut],
    queryFn: () =>
      getResultatsIndividuelsPublics(publicationId, {
        page,
        limit: 20,
        q: debouncedSearch || undefined,
        statutAcademique: statut || undefined,
      }),
  });

  const rows: ResultatIndividuelPublic[] = useMemo(() => data?.data ?? [], [data?.data]);
  const total = data?.total ?? totalIndividuels ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const hasFilters = Boolean(debouncedSearch || statut);
  const searchId = `resultats-public-search-${publicationId}`;
  const statutId = `resultats-public-statut-${publicationId}`;

  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="flex flex-col gap-3 border-b border-ink-100 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="size-4 text-brand-600" />
            <h2 className="text-lg font-semibold text-ink-900">Résultats détaillés</h2>
          </div>
          <p className="mt-1 text-small text-ink-500">
            <span data-numeric>{total}</span> étudiant(s) — consultation libre, sans code.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="sm:w-64">
            <label htmlFor={searchId} className="sr-only">
              Rechercher un étudiant
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
              <Input
                id={searchId}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Matricule, nom, prénom…"
                className="pl-9"
              />
            </div>
          </div>
          <div className="sm:w-40">
            <label htmlFor={statutId} className="sr-only">
              Filtrer par statut
            </label>
            <Select
              id={statutId}
              value={statut}
              onChange={(event) => setStatut(event.target.value as typeof statut)}
            >
              <option value="">Tous les statuts</option>
              <option value="admis">Admis</option>
              <option value="ajourne">Ajourné</option>
            </Select>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex min-h-40 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-start gap-2 px-5 py-8 text-small text-danger-700">
          <div className="flex items-center gap-2">
            <AlertCircle className="size-5" />
            <p>Impossible de charger les résultats détaillés.</p>
          </div>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-lg border border-ink-200 px-3 py-1.5 text-ink-700 hover:bg-ink-50"
          >
            Réessayer
          </button>
        </div>
      )}

      {!isLoading && !error && rows.length === 0 && (
        <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
          <FileSpreadsheet className="size-8 text-ink-300" />
          <p className="text-small font-medium text-ink-700">
            {hasFilters
              ? 'Aucun étudiant ne correspond aux filtres.'
              : 'Aucun résultat individuel disponible.'}
          </p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setStatut('');
              }}
              className="text-small font-medium text-brand-700 hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {!isLoading && !error && rows.length > 0 && (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full divide-y divide-ink-200">
              <thead className="bg-ink-50">
                <tr>
                  {['Matricule', 'Étudiant', 'Classe', 'Statut', 'Observation'].map((label) => (
                    <th
                      key={label}
                      scope="col"
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500"
                    >
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-200">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-brand-50/50">
                    <td className="whitespace-nowrap px-4 py-3 text-small font-semibold text-ink-900">
                      {row.matricule}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-small font-medium text-ink-900">
                        {row.nom} {row.prenom}
                      </p>
                      {row.periode && <p className="text-caption text-ink-500">{row.periode}</p>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-small text-ink-700">
                      {row.classe || '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {row.statutAcademique ? (
                        <Badge variant={STATUT_BADGE[row.statutAcademique] ?? 'muted'}>
                          {STATUT_LABEL[row.statutAcademique] ?? row.statutAcademique}
                        </Badge>
                      ) : (
                        <span className="text-small text-ink-500">—</span>
                      )}
                    </td>
                    <td className="max-w-56 px-4 py-3 text-small text-ink-600">
                      {row.observation || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-ink-100 md:hidden">
            {rows.map((row) => (
              <article key={row.id} className="space-y-3 px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-small font-semibold text-ink-900">
                      {row.nom} {row.prenom}
                    </p>
                    <p className="text-caption text-ink-500">
                      {row.matricule}
                      {row.classe ? ` · ${row.classe}` : ''}
                    </p>
                  </div>
                  {row.statutAcademique && (
                    <Badge variant={STATUT_BADGE[row.statutAcademique] ?? 'muted'}>
                      {STATUT_LABEL[row.statutAcademique] ?? row.statutAcademique}
                    </Badge>
                  )}
                </div>

                {row.observation && (
                  <p className="rounded-lg bg-ink-50 px-3 py-2 text-small text-ink-600">
                    {row.observation}
                  </p>
                )}
              </article>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 border-t border-ink-100 px-5 py-4 sm:flex-row sm:justify-between">
            <p className="text-small text-ink-500" aria-live="polite">
              Page {page} sur {Math.max(totalPages, 1)}
              {isFetching && !isLoading ? ' · actualisation…' : ''}
            </p>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </>
      )}
    </section>
  );
}
