/* eslint-disable react-refresh/only-export-components */
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  ariaLabel?: string;
  className?: string;
}

const GAP = 'gap' as const;

type PageEntry = number | typeof GAP;

export function buildPageSequence(page: number, totalPages: number): PageEntry[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const EDGE_RUN = 5;

  if (page <= 4) {
    return [...Array.from({ length: EDGE_RUN }, (_, index) => index + 1), GAP, totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      GAP,
      ...Array.from({ length: EDGE_RUN }, (_, index) => totalPages - EDGE_RUN + 1 + index),
    ];
  }

  return [1, GAP, page - 1, page, page + 1, GAP, totalPages];
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
  ariaLabel = 'Pagination',
  className,
}) => {
  if (totalPages <= 1) return null;

  const entries = buildPageSequence(page, totalPages);
  const navigationButtonClass =
    'inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 text-small font-medium text-ink-700 transition-colors duration-(--duration-hover) hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <nav aria-label={ariaLabel} className={cn('flex justify-center', className)}>
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            className={navigationButtonClass}
            aria-label="Page précédente"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Précédent</span>
          </button>
        </li>

        {entries.map((entry, index) => {
          if (entry === GAP) {
            const gapKey = `${entries[index - 1]}-${entries[index + 1]}`;

            return (
              <li
                key={`gap-${gapKey}`}
                aria-hidden="true"
                className="grid size-10 place-items-center text-small text-ink-400"
              >
                …
              </li>
            );
          }

          const isCurrent = entry === page;

          return (
            <li key={entry}>
              <button
                type="button"
                onClick={() => onChange(entry)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${entry}${isCurrent ? ', page courante' : ''}`}
                data-numeric
                className={cn(
                  'grid size-10 place-items-center rounded-full border text-small',
                  'transition-[background-color,border-color,color,transform]',
                  'duration-(--duration-hover) ease-out motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                  isCurrent
                    ? 'border-brand-600 bg-brand-600 font-semibold text-white'
                    : 'border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700'
                )}
              >
                {entry}
              </button>
            </li>
          );
        })}

        <li>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            className={navigationButtonClass}
            aria-label="Page suivante"
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
