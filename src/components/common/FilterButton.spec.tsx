import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import FilterButton, { type FilterGroup } from './FilterButton';

const groups = (niveau = 'all'): FilterGroup[] => [
  {
    key: 'niveau',
    label: 'Niveau',
    value: niveau,
    options: [
      { value: 'all', label: 'Tous' },
      { value: 'Licence', label: 'Licence' },
      { value: 'Master', label: 'Master' },
    ],
  },
];

describe('FilterButton', () => {
  it('reste fermé au départ', () => {
    render(<FilterButton groups={groups()} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Filtrer' }).getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('ouvre et ferme le panneau au clic', () => {
    render(<FilterButton groups={groups()} onChange={vi.fn()} onReset={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Filtrer' });

    fireEvent.click(trigger);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.queryByRole('button', { name: 'Licence' })).not.toBeNull();

    fireEvent.click(trigger);
    expect(screen.queryByRole('button', { name: 'Licence' })).toBeNull();
  });

  it('signale la valeur choisie', () => {
    const onChange = vi.fn();
    render(<FilterButton groups={groups()} onChange={onChange} onReset={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Filtrer' }));
    fireEvent.click(screen.getByRole('button', { name: 'Master' }));
    expect(onChange).toHaveBeenCalledWith('niveau', 'Master');
  });

  it('marque l’option retenue avec aria-pressed', () => {
    render(<FilterButton groups={groups('Licence')} onChange={vi.fn()} onReset={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Filtrer/ }));
    expect(screen.getByRole('button', { name: 'Licence' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: 'Master' }).getAttribute('aria-pressed')).toBe(
      'false',
    );
  });

  it('affiche le nombre de filtres actifs (§20)', () => {
    render(<FilterButton groups={groups('Licence')} onChange={vi.fn()} onReset={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: /1 filtre actif/ });
    expect(trigger.textContent).toContain('1');
  });

  it('n’affiche « Réinitialiser » que lorsqu’un filtre est actif', () => {
    const { rerender } = render(
      <FilterButton groups={groups()} onChange={vi.fn()} onReset={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Filtrer' }));
    expect(screen.queryByRole('button', { name: 'Réinitialiser' })).toBeNull();

    rerender(<FilterButton groups={groups('Master')} onChange={vi.fn()} onReset={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Réinitialiser' })).not.toBeNull();
  });

  it('ferme le panneau après réinitialisation', () => {
    const onReset = vi.fn();
    render(<FilterButton groups={groups('Master')} onChange={vi.fn()} onReset={onReset} />);
    fireEvent.click(screen.getByRole('button', { name: /Filtrer/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Réinitialiser' }));
    expect(onReset).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Licence' })).toBeNull();
  });

  it('se ferme à la touche Échap', () => {
    render(<FilterButton groups={groups()} onChange={vi.fn()} onReset={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Filtrer' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('button', { name: 'Licence' })).toBeNull();
  });

  it('reste visible sans survol quand un filtre est actif', () => {
    // Sinon un utilisateur tactile ne pourrait pas retirer son propre filtre.
    render(
      <FilterButton groups={groups('Master')} onChange={vi.fn()} onReset={vi.fn()} revealOnHover />,
    );
    expect(screen.getByRole('button', { name: /Filtrer/ }).className).not.toContain('opacity-0');
  });

  it('reste accessible au tactile même en mode survol', () => {
    render(<FilterButton groups={groups()} onChange={vi.fn()} onReset={vi.fn()} revealOnHover />);
    const trigger = screen.getByRole('button', { name: 'Filtrer' });
    // Le survol ne doit jamais être l'unique moyen d'accès (§3, §19).
    expect(trigger.className).toContain('[@media(hover:none)]:opacity-100');
    expect(trigger.className).toContain('lg:group-focus-within:opacity-100');
  });
});
