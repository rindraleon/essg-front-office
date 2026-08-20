import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Pagination, { buildPageSequence } from './Pagination';

describe('buildPageSequence', () => {
  it('affiche toutes les pages tant qu’elles tiennent sans ellipse', () => {
    expect(buildPageSequence(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(buildPageSequence(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('garde toujours la première et la dernière page', () => {
    const sequence = buildPageSequence(5, 10);
    expect(sequence[0]).toBe(1);
    expect(sequence[sequence.length - 1]).toBe(10);
  });

  it('insère une ellipse là où des pages sont omises', () => {
    expect(buildPageSequence(5, 10)).toContain('gap');
  });

  it('n’insère jamais d’ellipse pour une seule page manquante', () => {
    // Une ellipse qui remplace « 4 » prendrait autant de place que le
    // numéro lui-même, sans permettre d'y accéder.
    for (let page = 1; page <= 10; page += 1) {
      const sequence = buildPageSequence(page, 10);
      for (let i = 1; i < sequence.length - 1; i += 1) {
        if (sequence[i] === 'gap') {
          const before = sequence[i - 1] as number;
          const after = sequence[i + 1] as number;
          expect(after - before).toBeGreaterThan(2);
        }
      }
    }
  });

  it('garde une longueur stable, pour que les boutons ne bougent pas', () => {
    const lengths = new Set<number>();
    for (let page = 1; page <= 20; page += 1) {
      lengths.add(buildPageSequence(page, 20).length);
    }
    // La barre ne doit pas changer de largeur d'un clic à l'autre.
    expect(lengths.size).toBe(1);
  });

  it('reste croissante et sans doublon', () => {
    const sequence = buildPageSequence(6, 12).filter((e): e is number => e !== 'gap');
    expect([...sequence].sort((a, b) => a - b)).toEqual(sequence);
    expect(new Set(sequence).size).toBe(sequence.length);
  });

  it('gère les cas dégénérés', () => {
    expect(buildPageSequence(1, 0)).toEqual([]);
    expect(buildPageSequence(1, 1)).toEqual([1]);
  });
});

describe('Pagination', () => {
  it('ne s’affiche pas lorsqu’il n’y a qu’une page', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it('marque la page courante avec aria-current', () => {
    render(<Pagination page={3} totalPages={5} onChange={vi.fn()} />);
    const current = screen.getByRole('button', { name: /Page 3, page courante/ });
    expect(current.getAttribute('aria-current')).toBe('page');
  });

  it('n’applique aria-current qu’à une seule page', () => {
    render(<Pagination page={3} totalPages={5} onChange={vi.fn()} />);
    const marked = screen
      .getAllByRole('button')
      .filter((button) => button.getAttribute('aria-current') === 'page');
    expect(marked).toHaveLength(1);
  });

  it('signale le changement de page', () => {
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onChange={onChange} />);
    fireEvent.click(screen.getByRole('button', { name: /^Page 4$/ }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('n’affiche aucun bouton Précédent / Suivant / Premier / Dernier', () => {
    render(<Pagination page={3} totalPages={10} onChange={vi.fn()} />);
    for (const label of [/précédent/i, /suivant/i, /premier/i, /dernier/i]) {
      expect(screen.queryByRole('button', { name: label })).toBeNull();
    }
  });

  it('offre des cibles tactiles suffisantes', () => {
    render(<Pagination page={1} totalPages={5} onChange={vi.fn()} />);
    // `size-10` = 40 px, au-dessus de la cible tactile minimale.
    expect(screen.getByRole('button', { name: /^Page 2$/ }).className).toContain('size-10');
  });

  it('masque l’ellipse aux technologies d’assistance', () => {
    const { container } = render(<Pagination page={5} totalPages={20} onChange={vi.fn()} />);
    const gaps = container.querySelectorAll('[aria-hidden="true"]');
    expect(gaps.length).toBeGreaterThan(0);
  });

  it('nomme la navigation pour les lecteurs d’écran', () => {
    render(
      <Pagination page={1} totalPages={3} onChange={vi.fn()} ariaLabel="Pagination des projets" />,
    );
    expect(screen.getByRole('navigation', { name: 'Pagination des projets' })).toBeTruthy();
  });
});
