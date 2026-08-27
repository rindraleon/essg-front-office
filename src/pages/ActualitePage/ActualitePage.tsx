import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  PageHero,
  Breadcrumb,
  ActualiteCard,
  FilterToolbar,
  QueryState,
  Pagination,
 Input, Select, Skeleton } from '@/components';
import { cn } from '@/lib';
import { useActualites, useTitle } from '@/hooks';
import type { Actualite } from '@/types';

import { SITE_HERO_IMAGE } from '@/constants';

const HERO_IMAGE = SITE_HERO_IMAGE;

const CATEGORIES = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'Événement', label: 'Événement' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Partenariat', label: 'Partenariat' },
  { value: 'Vie Étudiante', label: 'Vie Étudiante' },
];

const ActualitesPage = () => {
  useTitle('Actualités | ESSG');

  const [searchTerm, setSearchTerm] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('all');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const { data, loading, error, refetch } = useActualites(page, 6, searchTerm, categorieFilter);
  const actualites: Actualite[] = useMemo(() => data?.data ?? [], [data]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const resultCount = data?.meta.total ?? 0;
  const resultText = `${resultCount} actualité${resultCount > 1 ? 's' : ''}`;

  useEffect(() => {
    setPage(1);
  }, [searchTerm, categorieFilter]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategorieFilter('all');
    setShowSearch(false);
    setShowFilters(false);
  };

  const activeFilterChips = [
    ...(searchTerm
      ? [{ key: 'search', label: `Recherche: "${searchTerm}"`, onDelete: () => setSearchTerm('') }]
      : []),
    ...(categorieFilter !== 'all'
      ? [
          {
            key: 'categorie',
            label: `Catégorie: ${categorieFilter}`,
            onDelete: () => setCategorieFilter('all'),
          },
        ]
      : []),
  ];

  return (
    <div>
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Actualités ESSG"
        title="Actualités"
        description="Suivez la vie de l'ESSG : événements, recherche, partenariats et réussites de nos étudiants."
      />
      <Breadcrumb items={[{ label: 'Actualités' }]} />

      <FilterToolbar
        resultText={resultText}
        activeFilterChips={activeFilterChips}
        hasActiveFilters={searchTerm !== '' || categorieFilter !== 'all'}
        activeFilterCount={categorieFilter !== 'all' ? 1 : 0}
        showFilters={showFilters}
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
              placeholder="Rechercher une actualité..."
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
        <Select
          label="Catégorie"
          value={categorieFilter}
          onChange={(e) => setCategorieFilter(e.target.value)}
        >
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>
      </FilterToolbar>

      <section className="section-y-tight">
        <div className="section-shell">
          <QueryState
            loading={loading}
            error={error}
            empty={!loading && !error && actualites.length === 0}
            onRetry={refetch}
            emptyTitle="Aucune actualité trouvée"
            emptyDescription="Essayez de modifier vos critères de recherche ou de réinitialiser les filtres."
            onEmptyAction={handleResetFilters}
            skeleton={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-ink-100 shadow-card"
                  >
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="space-y-3 p-5">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-4/5" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <div className="scroll-mt-24">
              <div
                className={cn(
                  'grid grid-cols-1 gap-6 transition-opacity duration-(--duration-hover) sm:grid-cols-2 lg:grid-cols-3',
                  'motion-reduce:transition-none'
                )}
              >
                {actualites.map((actu) => (
                  <ActualiteCard key={actu.id} actualite={actu} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={data?.meta.totalPages ?? 1}
                onChange={(nextPage) => {
                  setPage(nextPage);
                  window.scrollTo({ top: 420, behavior: 'smooth' });
                }}
                ariaLabel="Pagination des actualités"
                className="mt-12"
              />
            </div>
          </QueryState>
        </div>
      </section>
    </div>
  );
};

export default ActualitesPage;
