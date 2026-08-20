import { useCallback, useMemo, useState } from 'react';
import type { FilterGroup } from '../components/common/FilterButton';

/** Valeur signifiant « aucun filtre sur ce critère ». */
export const ALL = 'all';

export interface FilterDefinition<T> {
  key: string;
  label: string;
  /**
   * Extrait la valeur filtrable d'un élément. Retourner `undefined` ou une
   * chaîne vide exclut l'élément des options — on ne propose jamais un
   * filtre qui ne correspond à aucune donnée réelle.
   */
  accessor: (item: T) => string | undefined | null;
  /**
   * Ordre imposé des options. Les valeurs absentes de cette liste sont
   * ajoutées ensuite, par ordre alphabétique.
   *
   * Indispensable lorsque le critère a une hiérarchie métier : trier
   * « Licence, Master, Doctorat » par ordre alphabétique donnerait
   * « Doctorat, Licence, Master », ce qui n'a aucun sens pédagogique.
   */
  order?: readonly string[];
  /** Libellé de l'option « tout ». */
  allLabel?: string;
}

interface UseSectionFiltersResult<T> {
  /** Éléments après application de tous les filtres actifs. */
  filtered: T[];
  /** Groupes prêts à être passés à `FilterButton`. */
  groups: FilterGroup[];
  /** Nombre de critères effectivement appliqués. */
  activeCount: number;
  setFilter: (key: string, value: string) => void;
  reset: () => void;
}

/**
 * Filtrage des sections de la page d'accueil (§2, §5, §6).
 *
 * Les options sont **dérivées des données réellement reçues** : si aucune
 * formation de niveau Doctorat n'est publiée, l'option n'apparaît pas. Cela
 * évite les filtres qui ne renvoient jamais rien, et rend le système
 * extensible sans liste codée en dur à maintenir.
 *
 * Un groupe dont toutes les valeurs sont identiques (ou vide) est masqué :
 * proposer un filtre à une seule option n'apporte rien.
 */
export function useSectionFilters<T>(
  items: T[],
  definitions: FilterDefinition<T>[],
): UseSectionFiltersResult<T> {
  const [values, setValues] = useState<Record<string, string>>({});

  const setFilter = useCallback((key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  }, []);

  const reset = useCallback(() => setValues({}), []);

  const groups = useMemo<FilterGroup[]>(() => {
    return definitions
      .map((definition) => {
        // Valeurs distinctes réellement présentes dans les données.
        const present = new Set<string>();
        for (const item of items) {
          const raw = definition.accessor(item);
          if (raw && raw.trim()) present.add(raw.trim());
        }

        const ordered = definition.order
          ? [
              ...definition.order.filter((value) => present.has(value)),
              ...[...present].filter((value) => !definition.order?.includes(value)).sort(),
            ]
          : [...present].sort();

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
      // Moins de deux valeurs réelles : le filtre n'offrirait aucun choix.
      .filter((group) => group.options.length > 2);
  }, [items, definitions, values]);

  const filtered = useMemo(() => {
    const active = definitions.filter(
      (definition) => values[definition.key] && values[definition.key] !== ALL,
    );
    if (active.length === 0) return items;

    return items.filter((item) =>
      active.every((definition) => {
        const raw = definition.accessor(item);
        return (raw ?? '').trim() === values[definition.key];
      }),
    );
  }, [items, definitions, values]);

  const activeCount = groups.filter((group) => group.value !== ALL).length;

  return { filtered, groups, activeCount, setFilter, reset };
}

export default useSectionFilters;
