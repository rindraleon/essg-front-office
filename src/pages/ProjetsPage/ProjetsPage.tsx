import { cn } from '@/lib';
import { usePaginatedProjets, useTitle } from '@/hooks';
import {
  Pagination,
  EmptyState,
  FilterToolbar,
  PageHero,
  Breadcrumb,
  ProjetCard,
} from '@/components';
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
import { Rocket, Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import type { ProjetsPageProps } from '@/types';
import { generateSlug } from '@/utils';

import { SITE_HERO_IMAGE } from '@/constants';

const HERO_IMAGE = SITE_HERO_IMAGE;

const TYPES = [
  { value: 'all', label: 'Tous les types' },
  { value: 'International', label: 'International' },
  { value: 'Service public', label: 'Service public' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Innovation', label: 'Innovation' },
];

const STATUTS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'En cours', label: 'En cours' },
  { value: 'Terminé', label: 'Terminé' },
];

const ProjetsPage: React.FC<ProjetsPageProps> = (props: Readonly<ProjetsPageProps>) => {
  useTitle('Projets | ESSG');

  const {
    pageTitle = 'Nos Projets',
    pageDescription = "L'ESSG s'engage dans des projets innovants au service du développement durable et de la recherche.",
  } = props;

  const [typeFilter, setTypeFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { data, loading, error } = usePaginatedProjets(
    page,
    6,
    searchTerm,
    typeFilter,
    statutFilter
  );
  const projets = data?.data ?? [];

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, statutFilter]);

  const hasActiveFilters = typeFilter !== 'all' || statutFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = (typeFilter !== 'all' ? 1 : 0) + (statutFilter !== 'all' ? 1 : 0);

  const resultCount = data?.meta.total ?? 0;
  const resultText = `${resultCount} projet${resultCount > 1 ? 's' : ''}`;

  const handleTypeChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value);
  };

  const handleStatutChange = (event: SelectChangeEvent) => {
    setStatutFilter(event.target.value);
  };

  const handleToggleSearch = () => {
    setShowSearch((prev) => !prev);
    if (showSearch) setSearchTerm('');
  };

  const handleResetFilters = () => {
    setTypeFilter('all');
    setStatutFilter('all');
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
    ...(statutFilter !== 'all'
      ? [
          {
            key: 'statut',
            label: `Statut: ${statutFilter}`,
            onDelete: () => setStatutFilter('all'),
          },
        ]
      : []),
  ];

  useEffect(() => {
    setPage(1);
  }, [searchTerm, typeFilter, statutFilter]);

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Projets ESSG"
        title={pageTitle}
        description={pageDescription}
      />

      <Breadcrumb items={[{ label: 'Projets' }]} />

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
            placeholder="Rechercher un projet par titre ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
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
            }}
          />
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormControl fullWidth size="small">
            <InputLabel id="type-label">Type de projet</InputLabel>
            <Select
              labelId="type-label"
              label="Type de projet"
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

          <FormControl fullWidth size="small">
            <InputLabel id="statut-label">Statut</InputLabel>
            <Select
              labelId="statut-label"
              label="Statut"
              value={statutFilter}
              onChange={handleStatutChange}
            >
              {STATUTS.map((item) => (
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
            <div className="grid gap-8 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
                >
                  <Skeleton variant="rectangular" height={200} />
                  <div className="space-y-3 p-5">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="60%" />
                  </div>
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
            {resultCount === 0 ? (
              <EmptyState
                icon={<Rocket />}
                title="Aucun projet trouvé"
                description="Essayez de modifier vos critères de filtrage."
                onAction={handleResetFilters}
              />
            ) : (
              <div className="scroll-mt-24">
                <div
                  className={cn(
                    'grid gap-8 md:grid-cols-3',
                    'transition-opacity duration-(--duration-hover) motion-reduce:transition-none'
                  )}
                >
                  {projets.map((projet) => (
                    <ProjetCard
                      key={projet.id}
                      projet={{
                        ...projet,
                        slug: projet.slug || generateSlug(projet.titre),
                      }}
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
                  ariaLabel="Pagination des projets"
                  className="mt-12"
                />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProjetsPage;
