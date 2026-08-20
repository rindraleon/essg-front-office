import React from 'react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  /** Page courante, indexée à partir de 1. */
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  /** Libellé accessible de la navigation. */
  ariaLabel?: string;
  className?: string;
}

/** Marqueur d'ellipse dans la séquence de pages. */
const GAP = 'gap' as const;
type PageEntry = number | typeof GAP;

/**
 * Séquence de pages à afficher (§9).
 *
 * On garde toujours la première et la dernière page, plus une fenêtre autour
 * de la page courante. Les trous sont comblés par une ellipse.
 *
 * La longueur du résultat est **stable** (7 entrées au maximum) : la barre
 * ne change pas de largeur d'une page à l'autre, donc les boutons ne se
 * déplacent pas sous le doigt entre deux clics.
 */
export function buildPageSequence(page: number, totalPages: number): PageEntry[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  // Jusqu'à 7 pages, tout afficher reste lisible et évite les ellipses.
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  /*
    Au-delà, la barre compte TOUJOURS 7 entrées, quelle que soit la page
    courante. Une barre qui change de largeur déplacerait les boutons sous
    le doigt entre deux clics — on cliquerait « 4 » et on obtiendrait « 5 ».

    Trois dispositions, toutes de longueur 7 :
      début   1 2 3 4 5 … 20
      milieu  1 … 9 10 11 … 20
      fin     1 … 16 17 18 19 20
  */
  const EDGE_RUN = 5;

  if (page <= 4) {
    return [
      ...Array.from({ length: EDGE_RUN }, (_, index) => index + 1),
      GAP,
      totalPages,
    ];
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

/**
 * Pagination minimaliste (§8, §9).
 *
 * Uniquement des numéros de page : pas de « Premier », « Précédent »,
 * « Suivant », « Dernier ». Ces quatre boutons occupent la moitié de la
 * barre pour une action que les numéros permettent déjà, et « Suivant » ne
 * dit pas où l'on va.
 *
 * Chaque bouton mesure 40 px de côté au minimum — au-dessus de la cible
 * tactile recommandée, y compris sur mobile où la barre reste identique.
 */
const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onChange,
  ariaLabel = 'Pagination',
  className,
}) => {
  // Une seule page : la barre n'apporterait aucune information.
  if (totalPages <= 1) return null;

  const entries = buildPageSequence(page, totalPages);

  return (
    <nav aria-label={ariaLabel} className={cn('flex justify-center', className)}>
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        {entries.map((entry, index) => {
          if (entry === GAP) {
            return (
              <li
                // Deux ellipses au maximum, à des positions fixes : l'index
                // est une clé stable ici.
                key={`gap-${index}`}
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
                // `aria-current="page"` : un lecteur d'écran annonce
                // « page courante » sans dépendre du style visuel.
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={`Page ${entry}${isCurrent ? ', page courante' : ''}`}
                data-numeric
                className={cn(
                  'grid size-10 place-items-center rounded-full border text-small',
                  'transition-[background-color,border-color,color,transform]',
                  'duration-[--duration-hover] ease-out motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                  isCurrent
                    ? 'border-brand-600 bg-brand-600 font-semibold text-white'
                    : 'border-ink-100 bg-white text-ink-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700',
                )}
              >
                {entry}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Pagination;
