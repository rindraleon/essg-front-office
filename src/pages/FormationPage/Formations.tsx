import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  PageHero,
  Breadcrumb,
  FilterToolbar,
  FormationCard,
  Reveal,
  QueryState,
} from '@/components';
import HonestEmptyState from '@/components/common/HonestEmptyState';
import { Input, Select, Skeleton } from '@/components';
import { useFormations, useTitle } from '@/hooks';
import type { Formation } from '@/types';
import { SITE_HERO_IMAGE } from '@/constants';

const HERO_IMAGE = SITE_HERO_IMAGE;

const NIVEAUX = [
  { value: 'all', label: 'Tous les niveaux' },
  { value: 'Licence', label: 'Licence' },
  { value: 'Master', label: 'Master' },
  { value: 'Doctorat', label: 'Doctorat' },
];

const DOMAINES = [
  { value: 'all', label: 'Tous les domaines' },
  { value: 'Géomatique et Applications', label: 'Géomatique et Applications' },
  { value: 'Géomatique et Management', label: 'Géomatique et Management' },
  { value: 'Informatique et Données Spatiales', label: 'Informatique et Données Spatiales' },
];

const SKELETON_IDS = ['sk-1', 'sk-2', 'sk-3', 'sk-4', 'sk-5', 'sk-6'];

function filterFormations(
  formations: Formation[],
  searchTerm: string,
  niveauFilter: string,
  domaineFilter: string
): Formation[] {
  const search = searchTerm.toLowerCase();
  return formations.filter((formation) => {
    const matchesSearch =
      formation.titre.toLowerCase().includes(search) ||
      formation.description.toLowerCase().includes(search);
    const matchesNiveau = niveauFilter === 'all' || formation.niveau === niveauFilter;
    const matchesDomaine = domaineFilter === 'all' || formation.domaine.includes(domaineFilter);
    return matchesSearch && matchesNiveau && matchesDomaine;
  });
}

function buildActiveFilterChips(
  searchTerm: string,
  niveauFilter: string,
  domaineFilter: string,
  clearSearch: () => void,
  clearNiveau: () => void,
  clearDomaine: () => void
) {
  const chips: { key: string; label: string; onDelete: () => void }[] = [];
  if (searchTerm)
    chips.push({ key: 'search', label: `Recherche: "${searchTerm}"`, onDelete: clearSearch });
  if (niveauFilter !== 'all')
    chips.push({ key: 'niveau', label: `Niveau: ${niveauFilter}`, onDelete: clearNiveau });
  if (domaineFilter !== 'all')
    chips.push({ key: 'domaine', label: `Domaine: ${domaineFilter}`, onDelete: clearDomaine });
  return chips;
}

const FormationsPage = () => {
  useTitle('Formations | ESSG');

  const [searchTerm, setSearchTerm] = useState('');
  const [niveauFilter, setNiveauFilter] = useState('all');
  const [domaineFilter, setDomaineFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { data, loading, error, refetch } = useFormations(1, 100);
  const formations: Formation[] = useMemo(() => data?.data ?? [], [data]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) searchInputRef.current?.focus();
  }, [showSearch]);

  const filteredFormations = useMemo(
    () => filterFormations(formations, searchTerm, niveauFilter, domaineFilter),
    [formations, searchTerm, niveauFilter, domaineFilter]
  );

  const resultCount = filteredFormations.length;
  const resultText = `${resultCount} formation${resultCount > 1 ? 's' : ''} trouvée${resultCount > 1 ? 's' : ''}`;

  const handleResetFilters = () => {
    setSearchTerm('');
    setNiveauFilter('all');
    setDomaineFilter('all');
    setShowSearch(false);
    setShowFilters(false);
  };

  const activeFilterChips = useMemo(
    () =>
      buildActiveFilterChips(
        searchTerm,
        niveauFilter,
        domaineFilter,
        () => setSearchTerm(''),
        () => setNiveauFilter('all'),
        () => setDomaineFilter('all')
      ),
    [searchTerm, niveauFilter, domaineFilter]
  );

  const hasActiveFilters = searchTerm !== '' || niveauFilter !== 'all' || domaineFilter !== 'all';
  const activeFilterCount = (niveauFilter !== 'all' ? 1 : 0) + (domaineFilter !== 'all' ? 1 : 0);
  const isEmptyFromDB = !loading && !error && formations.length === 0;

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Campus ESSG"
        title="Nos Formations"
        description="Des programmes d'excellence pour maîtriser les technologies géospatiales et bâtir votre carrière dans un secteur en pleine expansion."
        minHeight="70vh"
      />
      <Breadcrumb items={[{ label: 'Formations' }]} />

      {isEmptyFromDB ? (
        <section className="section-y-tight">
          <div className="section-shell">
            <HonestEmptyState variant="formations" />
          </div>
        </section>
      ) : (
        <>
          <FilterToolbar
            resultText={resultText}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            hasActiveFilters={hasActiveFilters}
            activeFilterChips={activeFilterChips}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onResetFilters={handleResetFilters}
            searchEnabled
            showSearch={showSearch}
            searchIsActive={searchTerm !== ''}
            onToggleSearch={() => {
              setShowSearch((prev) => !prev);
              if (showSearch) setSearchTerm('');
            }}
            searchContent={
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-600" />
                <Input
                  ref={searchInputRef}
                  placeholder="Rechercher une formation par titre ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-9"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
                    aria-label="Effacer la recherche"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Niveau"
                value={niveauFilter}
                onChange={(e) => setNiveauFilter(e.target.value)}
              >
                {NIVEAUX.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Domaine"
                value={domaineFilter}
                onChange={(e) => setDomaineFilter(e.target.value)}
              >
                {DOMAINES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </Select>
            </div>
          </FilterToolbar>

          <section className="section-y-tight">
            <div className="section-shell">
              <QueryState
                loading={loading}
                error={error}
                empty={!loading && !error && filteredFormations.length === 0}
                onRetry={refetch}
                emptyTitle={
                  formations.length === 0
                    ? 'Aucune formation publiée pour le moment'
                    : 'Aucune formation trouvée'
                }
                emptyDescription={
                  formations.length === 0
                    ? "L'offre de formation est en cours de mise à jour. Revenez prochainement ou contactez la scolarité à essg@univ-fianarantsoa.mg."
                    : 'Aucune formation ne correspond à vos critères. Modifiez vos filtres ou réinitialisez la recherche.'
                }
                onEmptyAction={formations.length === 0 ? undefined : handleResetFilters}
                emptyActionLabel={formations.length === 0 ? undefined : 'Réinitialiser les filtres'}
                skeleton={
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {SKELETON_IDS.map((id) => (
                      <div
                        key={id}
                        className="overflow-hidden rounded-2xl border border-ink-100 shadow-card"
                      >
                        <Skeleton className="h-52 w-full rounded-none" />
                        <div className="space-y-3 p-5">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-5 w-4/5" />
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <Reveal className="space-y-6">
                  {filteredFormations.map((formation) => (
                    <FormationCard key={formation.id} formation={formation} />
                  ))}
                </Reveal>
              </QueryState>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default FormationsPage;
