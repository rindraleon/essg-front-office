import { Filter, X } from 'lucide-react';
import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib';

export interface FilterGroup {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}

interface FilterButtonProps {
  groups: FilterGroup[];
  onChange: (key: string, value: string) => void;
  onReset: () => void;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({ groups, onChange, onReset, className }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const hasOptions = groups.length > 0;
  const activeCount = groups.filter((group) => group.value !== 'all').length;

  const hasActive = activeCount > 0;
  const plural = activeCount > 1 ? 's' : '';

  const triggerLabel = hasActive
    ? `Filtrer — ${activeCount} filtre${plural} actif${plural}`
    : 'Filtrer';

  useEffect(() => {
    if (!open) return;

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((current) => !current)}
        disabled={!hasOptions}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={triggerLabel}
        className={cn(
          'inline-flex h-10 min-w-[6.5rem] items-center justify-center gap-2 rounded-full border px-4',
          'text-small font-medium shadow-card disabled:cursor-not-allowed disabled:opacity-45',
          'transition-[background-color,border-color,color,opacity,transform]',
          'duration-(--duration-hover) ease-out',
          'motion-reduce:transition-none',
          'focus-visible:outline-none',
          'focus-visible:ring-2',
          'focus-visible:ring-brand-500',
          'focus-visible:ring-offset-2',
          hasActive || open
            ? 'border-brand-200 bg-brand-50 text-brand-700'
            : 'border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
        )}
      >
        <Filter className="size-4" />

        <span>Filtre</span>

        {hasActive && (
          <span
            data-numeric
            className="inline-flex size-5 items-center justify-center rounded-md bg-brand-600 text-caption font-semibold text-white"
          >
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div
          id={panelId}
          className={cn(
            'absolute right-0 top-12 z-40',
            'w-[min(20rem,calc(100vw-2rem))]',
            'rounded-2xl border border-ink-100',
            'bg-white p-4 shadow-elevated',
            'origin-top-right animate-scale-in'
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-h6 text-ink-900">Filtre</h3>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer les filtres"
              className={cn(
                'grid size-7 place-items-center rounded-full',
                'text-ink-500 transition-colors',
                'hover:bg-ink-50 hover:text-ink-900',
                'motion-reduce:transition-none'
              )}
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="space-y-4">
            {groups.map((group) => (
              <fieldset key={group.key} className="border-0 p-0">
                <legend className="mb-2 text-caption font-semibold uppercase text-ink-500">
                  {group.label}
                </legend>

                <div className="flex flex-wrap gap-1.5">
                  {group.options.map((option) => {
                    const selected = group.value === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => onChange(group.key, option.value)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-small',
                          'transition-colors',
                          'duration-(--duration-micro) ease-out',
                          'motion-reduce:transition-none',
                          'focus-visible:outline-none',
                          'focus-visible:ring-2',
                          'focus-visible:ring-brand-500',
                          'focus-visible:ring-offset-1',
                          selected
                            ? 'border-brand-600 bg-brand-600 font-medium text-white'
                            : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:bg-brand-50'
                        )}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {hasActive && (
            <button
              type="button"
              onClick={() => {
                onReset();
                setOpen(false);
              }}
              className={cn(
                'mt-4 w-full rounded-xl border border-ink-200 py-2',
                'text-small font-medium text-ink-700',
                'transition-colors',
                'hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700',
                'focus-visible:outline-none',
                'focus-visible:ring-2',
                'focus-visible:ring-brand-500',
                'motion-reduce:transition-none'
              )}
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterButton;
