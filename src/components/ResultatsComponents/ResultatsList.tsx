import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, FileSpreadsheet, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { EmptyState } from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import { getResultatsPublics, type ResultatPublication } from '@/services';
import { ResultatPublicationPanel } from './ResultatPublicationPanel';

export function ResultatsList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [type, setType] = useState('');
  const [anneeScolaire, setAnneeScolaire] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => window.clearTimeout(timer);
  }, [search]);

  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['resultats', 'public', page, limit, debouncedSearch, type, anneeScolaire],
    queryFn: () =>
      getResultatsPublics({
        page,
        limit,
        q: debouncedSearch || undefined,
        type: (type as 'excel' | 'pdf') || undefined,
        anneeScolaire: anneeScolaire.trim() || undefined,
      }),
  });

  const resultats: ResultatPublication[] = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;

  const hasFilters = Boolean(debouncedSearch || type || anneeScolaire);

  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setType('');
    setAnneeScolaire('');
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="section-y-tight">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <EmptyState
            icon={<AlertCircle className="size-10 text-red-600" />}
            title="Impossible de charger les résultats"
            description={error instanceof Error ? error.message : String(error)}
            actionLabel="Réessayer"
            onAction={() => void refetch()}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="section-y-tight">
      <div className="mx-auto max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label
                htmlFor="resultats-search"
                className="mb-1.5 block text-small font-medium text-ink-700"
              >
                Rechercher
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-400" />
                <Input
                  id="resultats-search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Intitulé, année, classe…"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="w-full lg:w-52">
              <Select
                label="Type de fichier"
                value={type}
                onChange={(event) => {
                  setType(event.target.value);
                  setPage(1);
                }}
              >
                <option value="">Tous les types</option>
                <option value="excel">Excel</option>
                <option value="pdf">PDF</option>
              </Select>
            </div>

            <div className="w-full lg:w-44">
              <label
                htmlFor="resultats-annee"
                className="mb-1.5 block text-small font-medium text-ink-700"
              >
                Année scolaire
              </label>
              <Input
                id="resultats-annee"
                value={anneeScolaire}
                onChange={(event) => {
                  setAnneeScolaire(event.target.value);
                  setPage(1);
                }}
                placeholder="2025-2026"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => void refetch()} disabled={isFetching}>
                {isFetching ? 'Actualisation…' : 'Actualiser'}
              </Button>
              {hasFilters && (
                <Button variant="ghost" onClick={resetFilters}>
                  Réinitialiser
                </Button>
              )}
            </div>
          </div>

          <p className="mt-3 text-small text-ink-500" aria-live="polite">
            {total} résultat(s) publié(s)
            {hasFilters ? ' correspondant aux filtres' : ''}
          </p>
        </div>

        {resultats.length === 0 ? (
          <div className="rounded-2xl border border-ink-100 bg-white shadow-card">
            <EmptyState
              compact
              icon={<FileSpreadsheet className="size-7" />}
              title={
                hasFilters
                  ? 'Aucun résultat ne correspond aux filtres'
                  : 'Aucun résultat publié pour le moment'
              }
              description={
                hasFilters
                  ? 'Modifiez votre recherche ou réinitialisez les filtres.'
                  : 'Les résultats de concours, examens et sélections de dossier apparaîtront ici dès leur publication.'
              }
              actionLabel={hasFilters ? 'Réinitialiser les filtres' : undefined}
              onAction={hasFilters ? resetFilters : undefined}
            />
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {resultats.map((resultat) => (
                <ResultatPublicationPanel key={resultat.id} resultat={resultat} />
              ))}
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
              <p className="text-small text-ink-500">
                Page {page} sur {Math.max(totalPages, 1)}
              </p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-small text-ink-500">
                  Par page
                  <select
                    value={limit}
                    onChange={(event) => {
                      setLimit(Number(event.target.value));
                      setPage(1);
                    }}
                    className="h-9 rounded-xl border border-ink-200 bg-white px-2 text-small text-ink-700"
                  >
                    {[5, 10, 25].map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
