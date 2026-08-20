import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useSectionFilters, { ALL, type FilterDefinition } from './useSectionFilters';

interface Item {
  id: number;
  niveau: string;
  mention?: string;
}

const ITEMS: Item[] = [
  { id: 1, niveau: 'Master', mention: 'Géomatique' },
  { id: 2, niveau: 'Licence', mention: 'Géomatique' },
  { id: 3, niveau: 'Doctorat', mention: 'Informatique' },
  { id: 4, niveau: 'Licence', mention: 'Informatique' },
];

const DEFINITIONS: FilterDefinition<Item>[] = [
  {
    key: 'niveau',
    label: 'Niveau',
    accessor: (item) => item.niveau,
    order: ['Licence', 'Master', 'Doctorat'],
  },
  { key: 'mention', label: 'Mention', accessor: (item) => item.mention },
];

describe('useSectionFilters', () => {
  it('ne filtre rien tant qu’aucun critère n’est choisi', () => {
    const { result } = renderHook(() => useSectionFilters(ITEMS, DEFINITIONS));
    expect(result.current.filtered).toHaveLength(4);
    expect(result.current.activeCount).toBe(0);
  });

  it('respecte la hiérarchie métier plutôt que l’ordre alphabétique', () => {
    const { result } = renderHook(() => useSectionFilters(ITEMS, DEFINITIONS));
    const niveau = result.current.groups.find((group) => group.key === 'niveau');
    // Alphabétiquement ce serait Doctorat, Licence, Master — dénué de sens.
    expect(niveau?.options.map((option) => option.value)).toEqual([
      ALL,
      'Licence',
      'Master',
      'Doctorat',
    ]);
  });

  it('ne propose que les valeurs réellement présentes dans les données', () => {
    const { result } = renderHook(() =>
      useSectionFilters(
        [
          { id: 1, niveau: 'Licence', mention: 'A' },
          { id: 2, niveau: 'Master', mention: 'B' },
        ],
        DEFINITIONS,
      ),
    );
    const niveau = result.current.groups.find((group) => group.key === 'niveau');
    // Aucun doctorat publié : l'option ne doit pas apparaître.
    expect(niveau?.options.map((option) => option.value)).not.toContain('Doctorat');
  });

  it('masque un groupe qui n’offrirait aucun choix', () => {
    const { result } = renderHook(() =>
      useSectionFilters(
        [
          { id: 1, niveau: 'Licence', mention: 'A' },
          { id: 2, niveau: 'Licence', mention: 'A' },
        ],
        DEFINITIONS,
      ),
    );
    // Une seule valeur distincte : filtrer dessus ne changerait rien.
    expect(result.current.groups).toHaveLength(0);
  });

  it('filtre sur un critère', () => {
    const { result } = renderHook(() => useSectionFilters(ITEMS, DEFINITIONS));
    act(() => result.current.setFilter('niveau', 'Licence'));
    expect(result.current.filtered.map((item) => item.id)).toEqual([2, 4]);
    expect(result.current.activeCount).toBe(1);
  });

  it('combine plusieurs critères', () => {
    const { result } = renderHook(() => useSectionFilters(ITEMS, DEFINITIONS));
    act(() => result.current.setFilter('niveau', 'Licence'));
    act(() => result.current.setFilter('mention', 'Informatique'));
    expect(result.current.filtered.map((item) => item.id)).toEqual([4]);
    expect(result.current.activeCount).toBe(2);
  });

  it('remet tout à zéro', () => {
    const { result } = renderHook(() => useSectionFilters(ITEMS, DEFINITIONS));
    act(() => result.current.setFilter('niveau', 'Master'));
    act(() => result.current.reset());
    expect(result.current.filtered).toHaveLength(4);
    expect(result.current.activeCount).toBe(0);
  });

  it('peut ne renvoyer aucun résultat sans planter', () => {
    const { result } = renderHook(() => useSectionFilters(ITEMS, DEFINITIONS));
    act(() => result.current.setFilter('niveau', 'Doctorat'));
    act(() => result.current.setFilter('mention', 'Géomatique'));
    expect(result.current.filtered).toHaveLength(0);
  });

  it('ignore les valeurs absentes plutôt que d’en faire une option vide', () => {
    const { result } = renderHook(() =>
      useSectionFilters(
        [
          { id: 1, niveau: 'Licence', mention: 'A' },
          { id: 2, niveau: 'Master', mention: undefined },
          { id: 3, niveau: 'Master', mention: '   ' },
        ],
        DEFINITIONS,
      ),
    );
    const mention = result.current.groups.find((group) => group.key === 'mention');
    expect(mention).toBeUndefined();
  });

  it('conserve l’ordre initial des éléments filtrés', () => {
    const { result } = renderHook(() => useSectionFilters(ITEMS, DEFINITIONS));
    act(() => result.current.setFilter('mention', 'Géomatique'));
    // Le tri est décidé par l'appelant : le filtre ne doit pas le défaire.
    expect(result.current.filtered.map((item) => item.id)).toEqual([1, 2]);
  });
});
