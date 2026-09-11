import { cn } from '@/lib';
import { useRessourcesHumaines, useTitle } from '@/hooks';
import {
  Pagination,
  FilterToolbar,
  PageHero,
  Breadcrumb,
  RessourceHumaineCard,
} from '@/components';
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
import { generateSlug, formatFullName } from '@/utils';
import type { RessourceHumaine } from '@/types';
import { SITE_HERO_IMAGE } from '@/constants';

const HERO_IMAGE = SITE_HERO_IMAGE;

const POSTES = [
  { value: 'all', label: 'Tous les postes' },
  { value: 'Enseignant', label: 'Enseignant' },
  { value: 'Administratif', label: 'Administratif' },
  { value: 'Direction', label: 'Direction' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Autre', label: 'Autre' },
];

const SKELETON_IDS = [
  'rh-sk-1',
  'rh-sk-2',
  'rh-sk-3',
  'rh-sk-4',
  'rh-sk-5',
  'rh-sk-6',
  'rh-sk-7',
  'rh-sk-8',
];

const RessourcesHumainesPage: React.FC = () => {
  useTitle('Equipes pédagogiques | ESSG');

  const [posteFilter, setPosteFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    data: rhResult,
    loading,
    error,
  } = useRessourcesHumaines(page, 6, searchTerm, posteFilter);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const allRessourcesHumaines = useMemo<RessourceHumaine[]>(
    () =>
      (rhResult?.data ?? []).map((rh) => ({
        ...rh,
        slug: rh.slug || generateSlug(formatFullName(rh)),
      })),
    [rhResult]
  );

  const hasActiveFilters = posteFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = posteFilter !== 'all' ? 1 : 0;

  const resultCount = rhResult?.meta.total ?? 0;
  const resultText = `${resultCount} membre${resultCount > 1 ? 's' : ''} trouvé${resultCount > 1 ? 's' : ''}`;

  const handlePosteChange = (event: SelectChangeEvent) => {
    setPosteFilter(event.target.value);
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchTerm('');
  };

  const handleResetFilters = () => {
    setPosteFilter('all');
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
    ...(posteFilter !== 'all'
      ? [
          {
            key: 'poste',
            label: `Poste: ${posteFilter}`,
            onDelete: () => setPosteFilter('all'),
          },
        ]
      : []),
  ];

  useEffect(() => {
    setPage(1);
  }, [searchTerm, posteFilter]);

  const isEmptyFromDB = !loading && !error && (rhResult?.meta.total ?? 0) === 0;

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Équipe ESSG"
        title="Équipes Pédagogiques"
        description="Découvrez les hommes et femmes qui font de l'ESSG une institution d'excellence en sciences géomatiques."
      />

      <Breadcrumb items={[{ label: 'Équipes Pédagogiques' }]} />

      {isEmptyFromDB ? (
        <section className="section-y-tight">
          <div className="section-shell">
            <HonestEmptyState variant="ressourcesHumaines" />
          </div>
        </section>
      ) : (
        <>
          <FilterToolbar
            resultText={resultText}
            showFilters={showFilters}
            activeFilterCount={activeFilterCount}
            hasActiveFilters={hasActiveFilters}
            onToggleFilters={() => setShowFilters((prev) => !prev)}
            onResetFilters={handleResetFilters}
            activeFilterChips={activeFilterChips}
            searchEnabled
            showSearch={showSearch}
            searchIsActive={searchTerm !== ''}
            onToggleSearch={handleToggleSearch}
            searchContent={
              <TextField
                inputRef={searchInputRef}
                fullWidth
                size="small"
                placeholder="Rechercher un membre par nom, prénom ou poste..."
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
                <InputLabel id="poste-label">Poste</InputLabel>
                <Select
                  labelId="poste-label"
                  label="Poste"
                  value={posteFilter}
                  onChange={handlePosteChange}
                >
                  {POSTES.map((item) => (
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
                {allRessourcesHumaines.length === 0 ? (
                  <div className="py-10 text-center text-ink-500">
                    Aucun membre ne correspond à vos critères.{' '}
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
                      {allRessourcesHumaines.map((rh) => (
                        <RessourceHumaineCard key={rh.slug || rh.id} ressourceHumaine={rh} />
                      ))}
                    </div>

                    <Pagination
                      page={page}
                      totalPages={rhResult?.meta.totalPages ?? 1}
                      onChange={(nextPage) => {
                        setPage(nextPage);
                        window.scrollTo({ top: 420, behavior: 'smooth' });
                      }}
                      ariaLabel="Pagination des membres"
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

export default RessourcesHumainesPage;
