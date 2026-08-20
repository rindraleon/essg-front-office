import { cn } from '@/lib/utils';
import usePagination from '../../hooks/usePagination';
import Pagination from '../../components/common/Pagination';
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Skeleton, TextField } from '@/components/compat/mui';
import { Handshake, Search, X } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { SelectChangeEvent } from '@/components/compat/mui';

import CtaSection from '../../components/common/CtaSection';
import EmptyState from '../../components/common/EmptyState';
import FilterToolbar from '../../components/common/FilterToolbar';
import PageHero from '../../components/common/PageHero';
import Breadcrumb from '../../components/common/Breadcrumb';
import PartenaireCard from '../../components/PartenaireComponents/PartenaireCard';

import { usePartenaires } from '../../hooks';
import { generateSlug } from '../../utils/slug.utils';
import type { PartenairesPageProps, PartenaireItem } from '../../types/partenaire.types';

import { SITE_HERO_IMAGE } from '../../constants/media';
import { useTitle } from '@/hooks/useTitle';

const HERO_IMAGE = SITE_HERO_IMAGE;

const TYPES = [
  { value: 'all', label: 'Tous les types' },
  { value: 'Entreprise', label: 'Entreprise' },
  { value: 'Institution', label: 'Institution' },
  { value: 'Organisation', label: 'Organisation' },
  { value: 'Autre', label: 'Autre' },
];

const PartenairesPage: React.FC<PartenairesPageProps> = (props: Readonly<PartenairesPageProps>) => {
  useTitle('Partenaires | ESSG');

  const {
    pageTitle = 'Nos Partenaires',
    pageDescription = 'Des collaborations prestigieuses au niveau national et international pour une excellence partagée.',
  } = props;

  const { partenaires, loading, error } = usePartenaires();
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const allPartenaires = useMemo<PartenaireItem[]>(
    () =>
      partenaires.map((partenaire) => ({
        ...partenaire,
        slug: partenaire.slug || generateSlug(partenaire.nom),
      })),
    [partenaires],
  );

  const hasActiveFilters = typeFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = typeFilter !== 'all' ? 1 : 0;

  const filteredPartenaires = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return allPartenaires.filter((partenaire) => {
      const matchesSearch =
        partenaire.nom.toLowerCase().includes(search) ||
        (partenaire.secteur || '').toLowerCase().includes(search) ||
        (partenaire.description || '').toLowerCase().includes(search);
      const matchesType = typeFilter === 'all' || partenaire.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [allPartenaires, typeFilter, searchTerm]);

  const resultCount = filteredPartenaires.length;
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

  const { pageItems, page, totalPages, goToPage, listRef, isChanging } =
    usePagination(filteredPartenaires, { pageSize: 9 });

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Partenaires ESSG"
        title={pageTitle}
        description={pageDescription}
        stats={[
          { value: `${allPartenaires.length}+`, label: 'Partenaires' },
          { value: '30+', label: 'Pays' },
          { value: '100+', label: 'Projets communs' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Partenaires' }]} />

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
            <InputLabel id="type-label">
              Type de partenaire
            </InputLabel>
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
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
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
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </section>
      )}

      {!loading && !error && (
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {resultCount === 0 ? (
              <EmptyState
                icon={<Handshake />}
                title="Aucun partenaire trouvé"
                description="Essayez de modifier vos critères de filtrage."
                onAction={handleResetFilters}
              />
            ) : (
              <div ref={listRef} className="scroll-mt-24">
              {/* Fondu bref au changement de page (§23). */}
              <div
                className={cn(
                  'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                  'transition-opacity duration-[--duration-hover] motion-reduce:transition-none',
                  isChanging && 'opacity-40',
                )}
              >
                {pageItems.map((partenaire) => (
                  <PartenaireCard key={partenaire.slug || partenaire.id} partenaire={partenaire} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={goToPage}
                ariaLabel="Pagination des partenaires"
                className="mt-12"
              />
            </div>
            )}
          </div>
        </section>
      )}

      <CtaSection
        icon={<Handshake />}
        title="Devenir partenaire de l'ESSG"
        description="Rejoignez notre réseau de partenaires prestigieux et contribuez à former les talents de demain."
        primaryLabel="Contactez-nous"
        primaryLink="partenariats@essg.mg"
        primaryIsMailto
      />
    </div>
  );
};

export default PartenairesPage;
