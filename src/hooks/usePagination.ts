import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UsePaginationOptions {
  pageSize?: number;
}

interface UsePaginationResult<T> {
  pageItems: T[];
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
  isChanging: boolean;
}

const TRANSITION_MS = 260;

export function usePagination<T>(
  items: T[],
  { pageSize = 6 }: UsePaginationOptions = {}
): UsePaginationResult<T> {
  const [page, setPage] = useState(1);
  const [isChanging, setIsChanging] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<number | null>(null);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

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

      const node = listRef.current;
      if (node) {
        const HEADER_OFFSET = 96;
        const top = node.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      }

      if (reduceMotion) return;

      setIsChanging(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setIsChanging(false), TRANSITION_MS);
    },
    [page, totalPages]
  );

  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  return { pageItems, page, totalPages, goToPage, listRef, isChanging };
}

export default usePagination;
