import { Filter, Search, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import type { FilterToolbarProps } from '../../types/common.types';

const FilterToolbar = ({
  resultText,
  showFilters,
  activeFilterCount = 0,
  hasActiveFilters = false,
  activeFilterChips = [],
  onToggleFilters,
  onResetFilters,
  children,
  searchEnabled = false,
  showSearch = false,
  searchIsActive = false,
  onToggleSearch,
  searchContent,
}: FilterToolbarProps) => {
  const panelOpen = showSearch || showFilters;

  return (
    <div className="w-full container mx-auto flex flex-col gap-2 rounded-xl px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-small font-medium text-ink-500">{resultText}</span>
          {hasActiveFilters &&
            activeFilterChips.map((chipItem) => (
              <button
                key={chipItem.key}
                type="button"
                onClick={chipItem.onDelete}
                className="inline-flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-caption font-medium text-brand-800 transition-colors hover:bg-brand-100"
              >
                {chipItem.label}
                <X className="size-3" />
              </button>
            ))}
        </div>

        <div className="flex items-center gap-2">
          {searchEnabled && onToggleSearch && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={onToggleSearch}
              aria-label={showSearch ? 'Fermer la recherche' : 'Rechercher'}
              aria-expanded={showSearch}
              className={cn(
                'relative border-ink-200 text-ink-600',
                showSearch && 'border-brand-200 bg-brand-50 text-brand-700',
              )}
            >
              {showSearch ? <X className="size-4" /> : <Search className="size-4" />}
              {searchIsActive && !showSearch && (
                <span className="absolute right-1 top-1 size-1.5 rounded-full bg-brand-600" />
              )}
            </Button>
          )}

          <Button
            variant="outline"
            size="icon-sm"
            onClick={onToggleFilters}
            aria-label={showFilters ? 'Fermer les filtres' : 'Filtrer'}
            aria-expanded={showFilters}
            className={cn(
              'relative border-ink-200 text-ink-600',
              showFilters && 'border-brand-200 bg-brand-50 text-brand-700',
            )}
          >
            {showFilters ? <X className="size-4" /> : <Filter className="size-4" />}
            {activeFilterCount > 0 && !showFilters && (
              <Badge className="absolute -right-1.5 -top-1.5 h-4 min-w-4 px-1 text-caption">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onResetFilters}>
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {panelOpen && (
        <div className="mt-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-card animate-fade-in">
          {searchEnabled && showSearch && <div className="mb-4">{searchContent}</div>}
          {showFilters && <div>{children}</div>}
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;
