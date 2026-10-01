import { Filter, Search, X } from 'lucide-react';
import { useId } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { cn } from '@/lib';
import type { FilterToolbarProps } from '@/types';

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
  const panelId = useId();
  const searchPanelId = `${panelId}-recherche`;
  const filtersPanelId = `${panelId}-filtres`;

  return (
    <div
      role="region"
      aria-label="Filtres et recherche"
      className="section-shell flex flex-col gap-3 py-3 sm:py-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <span
            aria-live="polite"
            aria-atomic="true"
            className="shrink-0 text-small font-medium text-ink-500"
          >
            {resultText}
          </span>
          {hasActiveFilters &&
            activeFilterChips.map((chipItem) => (
              <button
                key={chipItem.key}
                type="button"
                onClick={chipItem.onDelete}
                aria-label={`Retirer le filtre ${chipItem.label}`}
                className="inline-flex min-h-9 max-w-[min(100%,18rem)] items-center gap-1.5 truncate rounded-full border border-brand-100 bg-brand-50 py-1 pl-3 pr-2 text-caption font-medium text-brand-800 transition-colors duration-(--duration-quick) hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 sm:min-h-8 motion-reduce:transition-none"
              >
                <span className="truncate">{chipItem.label}</span>
                <X className="size-3.5 shrink-0" aria-hidden="true" />
              </button>
            ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {searchEnabled && onToggleSearch && (
            <Button
              variant="outline"
              size="icon"
              onClick={onToggleSearch}
              aria-label={showSearch ? 'Fermer la recherche' : 'Rechercher'}
              aria-expanded={showSearch}
              aria-controls={showSearch ? searchPanelId : undefined}
              className={cn(
                // Cible tactile confortable sur mobile, densité d'origine
                // dès 640 px pour préserver l'identité visuelle du desktop.
                'border-ink-200 text-ink-600 sm:size-8',
                showSearch && 'border-brand-200 bg-brand-50 text-brand-700'
              )}
            >
              {showSearch ? <X className="size-4" /> : <Search className="size-4" />}
              {searchIsActive && !showSearch && (
                <span
                  aria-hidden="true"
                  className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-brand-600 sm:right-1 sm:top-1"
                />
              )}
            </Button>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={onToggleFilters}
            aria-label={showFilters ? 'Fermer les filtres' : 'Filtrer'}
            aria-expanded={showFilters}
            aria-controls={showFilters ? filtersPanelId : undefined}
            className={cn(
              'border-ink-200 text-ink-600 sm:size-8',
              showFilters && 'border-brand-200 bg-brand-50 text-brand-700'
            )}
          >
            {showFilters ? <X className="size-4" /> : <Filter className="size-4" />}
            {activeFilterCount > 0 && !showFilters && (
              <Badge
                className="absolute -right-1.5 -top-1.5 h-4 min-w-4 px-1 text-caption"
                aria-hidden="true"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onResetFilters} className="max-sm:h-10">
              Réinitialiser
            </Button>
          )}
        </div>
      </div>

      {panelOpen && (
        <div
          className="animate-fade-in rounded-2xl border border-ink-100 bg-white p-4 shadow-card sm:p-5"
          role="region"
          aria-label="Panneau de recherche et de filtres"
        >
          {searchEnabled && showSearch && (
            <div id={searchPanelId} className="mb-4">
              {searchContent}
            </div>
          )}
          {showFilters && <div id={filtersPanelId}>{children}</div>}
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;
