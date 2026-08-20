import { cn } from '@/lib/utils';
import usePagination from '../../hooks/usePagination';
import Pagination from '../../components/common/Pagination';
import { FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, Skeleton, TextField } from '@/components/compat/mui';
import { Search, Users, X } from 'lucide-react';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { SelectChangeEvent } from '@/components/compat/mui';
import CtaSection from '../../components/common/CtaSection';
import EmptyState from '../../components/common/EmptyState';
import FilterToolbar from '../../components/common/FilterToolbar';
import PageHero from '../../components/common/PageHero';
import Breadcrumb from '../../components/common/Breadcrumb';
import { useRessourcesHumaines } from '../../hooks';
import { generateSlug } from '../../utils/slug.utils';
import type { RessourceHumaine } from '../../types/ressource-humaine.types';
import { RessourceHumaineCard } from '../../components';
import { SITE_HERO_IMAGE } from '../../constants/media';
import { useTitle } from '@/hooks/useTitle';
import { formatFullName } from '../../utils/name.utils';

const HERO_IMAGE = SITE_HERO_IMAGE;

const POSTES = [
  { value: 'all', label: 'Tous les postes' },
  { value: 'Enseignant', label: 'Enseignant' },
  { value: 'Administratif', label: 'Administratif' },
  { value: 'Direction', label: 'Direction' },
  { value: 'Recherche', label: 'Recherche' },
  { value: 'Autre', label: 'Autre' },
];

const RessourcesHumainesPage: React.FC = () => {
  useTitle('Ressources Humaines | ESSG');

  const { data: rhResult, loading, error } = useRessourcesHumaines(1, 100);
  const [posteFilter, setPosteFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    [rhResult],
  );

  const hasActiveFilters = posteFilter !== 'all' || searchTerm !== '';
  const activeFilterCount = posteFilter !== 'all' ? 1 : 0;

  const filteredRessourcesHumaines = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return allRessourcesHumaines.filter((rh) => {
      const matchesSearch =
        rh.nom.toLowerCase().includes(search) ||
        rh.prenom.toLowerCase().includes(search) ||
        (rh.poste || '').toLowerCase().includes(search) ||
        (rh.description || '').toLowerCase().includes(search);
      const matchesPoste = posteFilter === 'all' || rh.poste === posteFilter;
      return matchesSearch && matchesPoste;
    });
  }, [allRessourcesHumaines, posteFilter, searchTerm]);

  const resultCount = filteredRessourcesHumaines.length;
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

  const { pageItems, page, totalPages, goToPage, listRef, isChanging } =
    usePagination(filteredRessourcesHumaines, { pageSize: 9 });

  return (
    <div className="min-h-screen bg-ink-50">
      <PageHero
        image={HERO_IMAGE}
        imageAlt="Équipe ESSG"
        title="Ressources Humaines"
        description="Découvrez les hommes et femmes qui font de l'ESSG une institution d'excellence en sciences géomatiques."
        stats={[
          { value: `${allRessourcesHumaines.length}+`, label: 'Membres' },
          { value: '50+', label: 'Années d\'expérience' },
          { value: '15+', label: 'Partenaires internationaux' },
        ]}
      />

      <Breadcrumb items={[{ label: 'Ressources Humaines' }]} />

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
            <InputLabel id="poste-label">
              Poste
            </InputLabel>
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
                icon={<Users />}
                title="Aucun membre trouvé"
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
                {pageItems.map((rh) => (
                  <RessourceHumaineCard key={rh.slug || rh.id} ressourceHumaine={rh} />
                ))}
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={goToPage}
                ariaLabel="Pagination des membres"
                className="mt-12"
              />
            </div>
            )}
          </div>
        </section>
      )}

      <CtaSection
        icon={<Users />}
        title="Rejoignez notre équipe"
        description="L'ESSG recherche des talents passionnés par les sciences géomatiques. Consultez nos offres d'emploi."
        primaryLabel="Nous contacter"
        primaryLink="/contact"
        secondaryLabel="Voir les formations"
        secondaryLink="/formations"
      />
    </div>
  );
};

export default RessourcesHumainesPage;