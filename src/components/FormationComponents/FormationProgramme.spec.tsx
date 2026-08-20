import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import FormationDetailContent from './FormationDetailCotent';
import type { Formation } from '../../types/formations.types';

/**
 * Affichage du programme d'une formation.
 *
 * Le back-office alimente `programme` (liste de libellés) depuis la refonte,
 * mais le composant ne lisait que `modules`, l'ancienne structure
 * `{ semestre, cours[] }` qui n'est plus renseignée. Résultat : le programme
 * saisi par l'administrateur n'apparaissait jamais sur le site public.
 *
 * Ces tests verrouillent la prise en charge des deux formats.
 */

const base: Formation = {
  id: 1,
  slug: 'geomatique',
  domaine: ['Géomatique et applications'],
  titre: 'Licence en géomatique',
  niveau: 'Licence',
  duree: '3 ans',
  description: 'Une formation complète.',
  objectifs: ['Objectif A'],
  debouches: ['Débouché A'],
  image: '',
  enVedette: false,
};

/**
 * Le composant affiche une carte « Responsable » qui interroge l'API via
 * React Query : un client dédié est nécessaire, avec les tentatives
 * désactivées pour que l'absence de réseau n'allonge pas les tests.
 */
const renderFormation = (formation: Formation) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <FormationDetailContent formation={formation} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('Programme de la formation', () => {
  it('affiche le programme alimenté par le back-office', () => {
    renderFormation({
      ...base,
      programme: ['Géodésie et systèmes de référence', 'Télédétection', 'Bases de données spatiales'],
    });

    expect(screen.getByText('Géodésie et systèmes de référence')).toBeTruthy();
    expect(screen.getByText('Télédétection')).toBeTruthy();
  });

  it('annonce le bon nombre de modules', () => {
    renderFormation({ ...base, programme: ['Module A', 'Module B'] });
    expect(screen.getByText(/2 Modules/)).toBeTruthy();
  });

  it('n’annonce aucune leçon pour un programme sous forme de liste', () => {
    // `programme` ne porte pas de sous-niveau : afficher « 0 Leçons »
    // laisserait croire à un contenu manquant.
    renderFormation({ ...base, programme: ['Module A', 'Module B'] });
    expect(screen.queryByText(/Leçons/)).toBeNull();
  });

  it('ne rend pas les modules d’une liste comme dépliables', () => {
    // Sans leçons, un accordéon s'ouvrirait sur du vide.
    renderFormation({ ...base, programme: ['Module A'] });
    const boutons = screen.queryAllByRole('button', { expanded: false });
    expect(boutons).toHaveLength(0);
  });

  it('reste compatible avec l’ancienne structure par semestre', () => {
    renderFormation({
      ...base,
      modules: [{ semestre: 'Semestre 1', cours: ['Topographie', 'Cartographie'] }],
    });

    expect(screen.getByText('Semestre 1')).toBeTruthy();
    expect(screen.getByText(/2 leçons/)).toBeTruthy();
  });

  it('rend l’ancien format dépliable, puisqu’il porte des leçons', () => {
    renderFormation({
      ...base,
      modules: [{ semestre: 'Semestre 1', cours: ['Topographie'] }],
    });
    expect(screen.queryAllByRole('button', { expanded: false }).length).toBeGreaterThan(0);
  });

  it('donne la priorité au programme sur les modules historiques', () => {
    // Une formation migrée peut porter les deux : `programme` fait foi.
    renderFormation({
      ...base,
      programme: ['Nouveau module'],
      modules: [{ semestre: 'Ancien semestre', cours: ['Ancien cours'] }],
    });

    expect(screen.getByText('Nouveau module')).toBeTruthy();
    expect(screen.queryByText('Ancien semestre')).toBeNull();
  });

  it('masque la section quand aucun programme n’est renseigné', () => {
    renderFormation(base);
    expect(screen.queryByText('Programme de la formation')).toBeNull();
  });

  it('ignore les entrées vides du programme', () => {
    // Le formulaire du back-office initialise la liste avec une ligne vide.
    renderFormation({ ...base, programme: ['Module A', '   ', ''] });
    expect(screen.getByText(/1 Module/)).toBeTruthy();
  });
});
