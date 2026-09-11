import { cn } from '@/lib';
import { usePaginatedPartenaires, useTitle } from '@/hooks';
import { Pagination, FilterToolbar, PageHero, Breadcrumb, PartenaireCard } from '@/components';
import HonestEmptyState from '@/components/common/HonestEmptyState';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  CompatSelect as Select,
  CompatSkeleton as Skeleton,
  TextField,
  type SelectChangeEvent,
} from '@/components';
import { Search, X } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { generateSlug } from '@/utils';
import type { PartenairesPageProps, PartenaireItem } from '@/types';

import { SITE_HERO_IMAGE } from '@/constants';

const HERO_IMAGE = SITE_HERO_IMAGE;

const TYPES = [
  { value: 'all', label: 'Tous les types' },
  { value: 'Entreprise', label: 'Entreprise' },
  { value: 'Institution', label: 'Institution' },
  { value: 'Organisation', label: 'Organisation' },
  { value: 'Autre', label: 'Autre' },
];

const SKELETON_IDS = [
  'part-sk-1',
  'part-sk-2',
  'part-sk-3',
  'part-sk-4',
  'part-sk-5',
  'part-sk-6',
  'part-sk-7',
  'part-sk-8',
];

const PartenairesPage: React.FC<PartenairesPageProps> = (props: Readonly<PartenairesPageProps>) => {
  useTitle('Partenaires | ESSG');

  const {
    pageTitle = 'Nos Partenaires',
    pageDescription = 'Des collaborations prestigieuses au niveau national et international pour une excellence partagée.',
  } = props;

  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data, loading, error } = usePaginatedPartenaires(page, 6, searchTerm, typeFilter);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const allPartenaires = useMemo<PartenaireItem[]>(
    () =>
      (data?.data ?? []).map((partenaire) => ({
        ...partenaire,
        slug: partenaire.slug || generateSlug(partenaire.nom),
      })),
    [data]
  );

  const hasActiveFilters = typeFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = typeFilter !== 'all' ? 1 : 0;

  const resultCount = data?.meta.total ?? 0;
  const resultText = `${resultCount} partenaire${resultCount > 1 ? 's' : ''} trouvé${resultCount > 1 ? 's' : ''}`;

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchTerm('');
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setSearchTerm('');
    setShowSearch(false);
    setShowFilters(false);
  };

  const activeFilterChips = [
    ...(searchTerm
      ? [
          {
            key: 'search',
            label: `Recherche: "${searchTerm}"`,
            onDelete: () => setSearchTerm(''),
          },
        ]
      : []),
    ...(typeFilter !== 'all'
      ? [
          {
            key: 'type',
            label: `Type: ${typeFilter}`,
            onDelete: () => setTypeFilter('all'),
          },
        ]
      : []),
  ];

  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter]);

  const isEmptyFromDB = !loading && !error && (data?.meta.total ?? 0) === 0;

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Partenaires ESSG"
        title={pageTitle}
        description={pageDescription}
      />

      <Breadcrumb items={[{ label: 'Partenaires' }]} />

      {isEmptyFromDB ? (
        <section className="section-y-tight">
          <div className="section-shell">
            <HonestEmptyState variant="partenaires" />
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
            onToggleSearch={handleToggleSearch}
            searchContent={
              <TextField
                inputRef={searchInputRef}
                fullWidth
                size="small"
                placeholder="Rechercher un partenaire par nom, secteur ou description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                          <X />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            }
          >
            <div className="max-w-xs">
              <FormControl fullWidth size="small">
                <InputLabel id="type-label">Type de partenaire</InputLabel>
                <Select
                  labelId="type-label"
                  label="Type de partenaire"
                  value={typeFilter}
                  onChange={handleTypeChange}
                >
                  {TYPES.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </FilterToolbar>

          {loading && (
            <section className="section-y-tight">
              <div className="section-shell">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {SKELETON_IDS.map((id) => (
                    <div
                      key={id}
                      className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card"
                    >
                      <div className="mb-4 flex justify-center">
                        <Skeleton variant="circular" width={80} height={80} />
                      </div>
                      <Skeleton variant="text" width="70%" className="mx-auto" />
                      <Skeleton variant="text" width="40%" className="mx-auto" />
                      <Skeleton variant="text" width="90%" className="mx-auto mt-4" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {error && (
            <section className="section-y-tight">
              <div className="section-shell">
                <div className="text-center">
                  <p className="text-danger-600">{error}</p>
                </div>
              </div>
            </section>
          )}

          {!loading && !error && (
            <section className="section-y-tight">
              <div className="section-shell">
                {allPartenaires.length === 0 ? (
                  <div className="py-10 text-center text-ink-500">
                    Aucun partenaire ne correspond à vos critères.{' '}
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="font-medium text-brand-700 underline underline-offset-4 hover:text-brand-800"
                    >
                      Réinitialiser les filtres
                    </button>
                  </div>
                ) : (
                  <div className="scroll-mt-24">
                    <div
                      className={cn(
                        'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
                        'transition-opacity duration-(--duration-hover) motion-reduce:transition-none'
                      )}
                    >
                      {allPartenaires.map((partenaire) => (
                        <PartenaireCard
                          key={partenaire.slug || partenaire.id}
                          partenaire={partenaire}
                        />
                      ))}
                    </div>

                    <Pagination
                      page={page}
                      totalPages={data?.meta.totalPages ?? 1}
                      onChange={(nextPage) => {
                        setPage(nextPage);
                        window.scrollTo({ top: 420, behavior: 'smooth' });
                      }}
                      ariaLabel="Pagination des partenaires"
                      className="mt-12"
                    />
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default PartenairesPage;
