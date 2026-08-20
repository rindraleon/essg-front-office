import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import MediaCard from './MediaCard';

const renderCard = (props: Partial<React.ComponentProps<typeof MediaCard>> = {}) =>
  render(
    <MemoryRouter>
      <MediaCard
        to="/formations/geomatique"
        title="Licence en géomatique"
        imageUrl="/images/geomatique.webp"
        {...props}
      />
    </MemoryRouter>,
  );

describe('MediaCard', () => {
  it('affiche le titre en permanence', () => {
    renderCard();
    expect(screen.queryByText('Licence en géomatique')).not.toBeNull();
  });

  it('rend la carte entière cliquable vers la page de détail', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/formations/geomatique');
    // Le pseudo-élément `after` étend la zone cliquable à toute la carte.
    expect(link.className).toContain('after:inset-0');
  });

  it('reprend le titre comme texte alternatif par défaut', () => {
    renderCard();
    expect(screen.getByAltText('Licence en géomatique')).not.toBeNull();
  });

  it('accepte un texte alternatif distinct du titre', () => {
    renderCard({ imageAlt: 'Étudiants en relevé topographique' });
    expect(screen.getByAltText('Étudiants en relevé topographique')).not.toBeNull();
  });

  it('rend les informations complémentaires dans le DOM (révélées au survol)', () => {
    renderCard({
      description: 'Trois ans pour maîtriser la donnée spatiale.',
      meta: [{ label: '3 ans' }],
    });

    expect(screen.queryByText('Trois ans pour maîtriser la donnée spatiale.')).not.toBeNull();
    expect(screen.queryByText('3 ans')).not.toBeNull();
  });

  it('n’anime que l’opacité et la transformation du bloc révélé', () => {
    const { container } = renderCard({ description: 'Une description.' });
    const details = container.querySelector('[data-card-details]');

    expect(details?.className).toContain('transition-[opacity,transform]');
    // Aucune animation de dimension : pas de reflow ni de saut de hauteur.
    expect(details?.className).not.toContain('transition-[height');
  });

  it('affiche le badge et le sous-titre lorsqu’ils sont fournis', () => {
    renderCard({ badge: 'Licence', subtitle: 'Géomatique et applications' });
    expect(screen.queryByText('Licence')).not.toBeNull();
    expect(screen.queryByText('Géomatique et applications')).not.toBeNull();
  });

  it('n’affiche pas de bloc révélé quand il n’y a rien à révéler', () => {
    const { container } = renderCard();
    expect(container.querySelector('[data-card-details]')).toBeNull();
  });

  it('affiche les logos en entier plutôt que recadrés', () => {
    renderCard({ imageFit: 'contain', imageAlt: 'Logo' });
    expect(screen.getByAltText('Logo').className).toContain('object-contain');
  });

  it('recadre les photos par défaut', () => {
    renderCard();
    expect(screen.getByAltText('Licence en géomatique').className).toContain('object-cover');
  });

  it('décrit l’action dans le libellé accessible du lien', () => {
    renderCard({ actionLabel: 'Voir la formation' });
    expect(screen.getByRole('link').getAttribute('aria-label')).toBe(
      'Licence en géomatique — voir la formation',
    );
  });
});
