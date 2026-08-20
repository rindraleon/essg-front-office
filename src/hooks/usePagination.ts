import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UsePaginationOptions {
  /** Nombre d'éléments par page. */
  pageSize?: number;
}

interface UsePaginationResult<T> {
  /** Éléments de la page courante. */
  pageItems: T[];
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
  /**
   * À poser sur le conteneur de la liste. Le changement de page y ramène le
   * regard, plutôt qu'en haut du document.
   */
  listRef: React.RefObject<HTMLDivElement | null>;
  /**
   * Vrai pendant la brève transition de changement de page. À utiliser pour
   * atténuer la liste (§23) : le contenu ne se substitue pas d'un coup.
   */
  isChanging: boolean;
}

/** Durée du fondu de transition (§23 : 250–400 ms). */
const TRANSITION_MS = 260;

/**
 * Pagination côté client, avec repositionnement et transition (§10).
 *
 * Trois comportements que la pagination seule ne couvre pas :
 *
 *  1. **Repositionnement** — au changement de page, on remonte en haut de la
 *     *liste*, pas du document. Remonter tout en haut ferait repasser par le
 *     hero et les filtres à chaque clic ; rester en place laisserait
 *     l'utilisateur au milieu d'un contenu entièrement renouvelé.
 *  2. **Transition** — la liste s'atténue brièvement, ce qui signale que le
 *     contenu a changé. Sans cela, sur deux pages de structure identique,
 *     rien n'indique visuellement que le clic a produit un effet.
 *  3. **Borne automatique** — si le filtrage réduit le nombre de pages sous
 *     la page courante, on revient à la dernière page valide au lieu
 *     d'afficher une liste vide.
 */
export function usePagination<T>(
  items: T[],
  { pageSize = 9 }: UsePaginationOptions = {},
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);
  const [isChanging, setIsChanging] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  // Le filtrage peut réduire le nombre de pages sous la page courante.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const goToPage = useCallback(
    (next: number) => {
      const target = Math.min(Math.max(1, next), totalPages);
      if (target === page) return;

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      setPage(target);

      // Remontée vers le haut de la liste, décalée de l'en-tête collant
      // pour que la première carte ne soit pas masquée par celui-ci.
      const node = listRef.current;
      if (node) {
        const HEADER_OFFSET = 96;
        const top = node.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      }

      if (reduceMotion) return;

      // Fondu bref : retour visuel que le contenu a changé (§23).
      setIsChanging(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsChanging(false), TRANSITION_MS);
    },
    [page, totalPages],
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  return { pageItems, page, totalPages, goToPage, listRef, isChanging };
}

export default usePagination;
