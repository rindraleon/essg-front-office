import { useCallback, useMemo, useState } from 'react';
import type { FilterGroup } from '@/components';

export const ALL = 'all';

export interface FilterDefinition<T> {
  key: string;
  label: string;
  accessor: (item: T) => string | undefined | null;
  order?: readonly string[];
  allLabel?: string;
}

interface UseSectionFiltersResult<T> {
  filtered: T[];
  groups: FilterGroup[];
  activeCount: number;
  setFilter: (key: string, value: string) => void;
  reset: () => void;
}

export function useSectionFilters<T>(
  items: T[],
  definitions: FilterDefinition<T>[]
): UseSectionFiltersResult<T> {
  const [values, setValues] = useState<Record<string, string>>({});

  const setFilter = useCallback((key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const reset = useCallback(() => setValues({}), []);

  const groups = useMemo<FilterGroup[]>(() => {
    return definitions
      .map((definition) => {
        const present = new Set<string>();
        for (const item of items) {
          const raw = definition.accessor(item);
          const trimmed = raw?.trim();
          if (trimmed) present.add(trimmed);
        }

        const ordered = definition.order
          ? [
              ...definition.order.filter((value) => present.has(value)),
              ...[...present]
                .filter((value) => !definition.order?.includes(value))
                .sort((a, b) => a.localeCompare(b)),
            ]
          : [...present].sort((a, b) => a.localeCompare(b));

        return {
          key: definition.key,
          label: definition.label,
          value: values[definition.key] ?? ALL,
          options: [
            { value: ALL, label: definition.allLabel ?? 'Tous' },
            ...ordered.map((value) => ({ value, label: value })),
          ],
        };
      })
      .filter((group) => group.options.length > 2);
  }, [items, definitions, values]);

  const filtered = useMemo(() => {
    const active = definitions.filter(
      (definition) => values[definition.key] && values[definition.key] !== ALL
    );
    if (active.length === 0) return items;

    return items.filter((item) =>
      active.every((definition) => {
        const raw = definition.accessor(item);
        return (raw ?? '').trim() === values[definition.key];
      })
    );
  }, [items, definitions, values]);

  const activeCount = groups.filter((group) => group.value !== ALL).length;

  return { filtered, groups, activeCount, setFilter, reset };
}

export default useSectionFilters;
