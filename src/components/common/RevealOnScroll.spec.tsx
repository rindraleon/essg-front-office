import { act, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RevealOnScroll, { StaggerReveal } from './RevealOnScroll';

/**
 * Système d'apparition au défilement.
 *
 * Deux garanties sont vérifiées ici :
 *  - le contenu reste TOUJOURS accessible, même si l'observateur ne se
 *    déclenche jamais (repli sans `IntersectionObserver`, mouvement réduit) ;
 *  - seules `opacity` et `transform` sont animées, jamais des propriétés
 *    provoquant un recalcul de mise en page.
 */

/** Instances créées, pour déclencher les entrées manuellement. */
let observers: Array<{
  callback: IntersectionObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];

function installObserver() {
  observers = [];
  class FakeObserver {
    disconnect = vi.fn();
    observe = vi.fn();
    unobserve = vi.fn();
    callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
      observers.push({ callback, disconnect: this.disconnect });
    }
  }
  vi.stubGlobal('IntersectionObserver', FakeObserver);
}

/**
 * Simule l'entrée de l'élément dans le champ de vision.
 * `act` est nécessaire : le callback s'exécute hors du cycle React, sans lui
 * la mise à jour d'état ne serait pas répercutée sur le DOM.
 */
function enterViewport(index = 0) {
  act(() => {
    observers[index]?.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
  });
}

beforeEach(() => {
  vi.unstubAllGlobals();
  // `matchMedia` n'existe pas dans jsdom : par défaut, aucun mouvement réduit.
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  );
  installObserver();
});

describe('RevealOnScroll', () => {
  it('rend son contenu dès le départ', () => {
    // Le contenu doit exister dans le DOM même avant l'animation : masquer
    // par `opacity` le garde accessible aux lecteurs d'écran et au SEO.
    render(<RevealOnScroll>Contenu visible</RevealOnScroll>);
    expect(screen.getByText('Contenu visible')).toBeDefined();
  });

  it('part masqué puis se révèle à l’entrée dans le viewport', () => {
    render(<RevealOnScroll>Section</RevealOnScroll>);
    const element = screen.getByText('Section');

    expect(element.style.opacity).toBe('0');

    enterViewport();
    expect(element.style.opacity).toBe('1');
    expect(element.style.transform).toBe('none');
  });

  it('n’anime que opacity et transform', () => {
    render(<RevealOnScroll>Section</RevealOnScroll>);
    const transition = screen.getByText('Section').style.transition;

    expect(transition).toContain('opacity');
    expect(transition).toContain('transform');
    // Ces propriétés déclencheraient un recalcul de mise en page.
    for (const couteuse of ['width', 'height', 'top', 'left', 'margin']) {
      expect(transition).not.toContain(couteuse);
    }
  });

  it('applique le délai demandé', () => {
    render(<RevealOnScroll delay={250}>Section</RevealOnScroll>);
    expect(screen.getByText('Section').style.transition).toContain('250ms');
  });

  it('respecte prefers-reduced-motion', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    );
    render(<RevealOnScroll>Section</RevealOnScroll>);
    const element = screen.getByText('Section');

    // Visible immédiatement et sans transition.
    expect(element.style.opacity).toBe('1');
    expect(element.style.transition).toBe('none');
  });

  it('affiche le contenu si IntersectionObserver est absent', () => {
    // Sans ce repli, le contenu resterait invisible pour toujours.
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<RevealOnScroll>Section</RevealOnScroll>);
    expect(screen.getByText('Section').style.opacity).toBe('1');
  });

  it('cesse d’observer après la première apparition', () => {
    render(<RevealOnScroll>Section</RevealOnScroll>);
    enterViewport();
    // Continuer d'observer un élément déjà révélé serait du gaspillage.
    expect(observers[0].disconnect).toHaveBeenCalled();
  });

  it('continue d’observer lorsque repeat est activé', () => {
    render(<RevealOnScroll repeat>Section</RevealOnScroll>);
    enterViewport();
    expect(observers[0].disconnect).not.toHaveBeenCalled();
  });

  it('rend la balise demandée', () => {
    const { container } = render(<RevealOnScroll as="section">Section</RevealOnScroll>);
    expect(container.querySelector('section')).not.toBeNull();
  });

  it('applique un décalage différent selon la direction', () => {
    // « fade-left » : le contenu vient de la gauche, donc décalage négatif.
    const { rerender } = render(<RevealOnScroll direction="left">A</RevealOnScroll>);
    expect(screen.getByText('A').style.transform).toContain('calc(-1 * var(--reveal-distance))');

    rerender(<RevealOnScroll direction="right">A</RevealOnScroll>);
    expect(screen.getByText('A').style.transform).toContain('translate3d(var(--reveal-distance)');

    // `none` : aucun déplacement, seule l'opacité est animée.
    rerender(<RevealOnScroll direction="none">A</RevealOnScroll>);
    expect(screen.getByText('A').style.transform).toBe('');
    expect(screen.getByText('A').style.transition).toContain('opacity');
  });

  it('exprime la distance via une variable CSS, ce qui la rend responsive', () => {
    render(<RevealOnScroll>A</RevealOnScroll>);
    // La valeur n'est pas figée en pixels : les média-requêtes de
    // `styles/index.css` la réduisent sur mobile sans toucher au composant.
    expect(screen.getByText('A').style.transform).toContain('var(--reveal-distance)');
  });

  it('accepte une distance explicite en pixels', () => {
    render(<RevealOnScroll distance={40}>A</RevealOnScroll>);
    expect(screen.getByText('A').style.transform).toContain('translate3d(0, 40px, 0)');
  });

  it('anime `scale-in` sans translation', () => {
    render(<RevealOnScroll variant="scale-in">A</RevealOnScroll>);
    const element = screen.getByText('A');
    expect(element.style.transform).toBe('scale(0.96)');
    expect(element.style.transform).not.toContain('translate');
  });

  it('anime `blur-in` avec un flou, réservé aux grands visuels', () => {
    render(<RevealOnScroll variant="blur-in">A</RevealOnScroll>);
    const element = screen.getByText('A');
    expect(element.style.filter).toContain('blur(8px)');
    // `filter` doit figurer dans la transition, sinon le flou sauterait.
    expect(element.style.transition).toContain('filter');
  });

  it('n’anime jamais de propriété provoquant un recalcul de mise en page', () => {
    const variants = ['fade-up', 'fade-up-sm', 'fade-left', 'scale-in', 'blur-in'] as const;
    for (const variant of variants) {
      const { unmount } = render(<RevealOnScroll variant={variant}>A</RevealOnScroll>);
      const transition = screen.getByText('A').style.transition;
      for (const forbidden of ['width', 'height', 'top', 'left', 'margin', 'padding']) {
        expect(transition).not.toContain(forbidden);
      }
      unmount();
    }
  });

  it('réutilise la courbe partagée du système de mouvement', () => {
    render(<RevealOnScroll>A</RevealOnScroll>);
    expect(screen.getByText('A').style.transition).toContain('var(--ease-reveal)');
  });
});

describe('StaggerReveal', () => {
  it('échelonne les délais de ses enfants', () => {
    render(
      <StaggerReveal step={100}>
        <span>Premier</span>
        <span>Deuxième</span>
        <span>Troisième</span>
      </StaggerReveal>,
    );

    // Le décalage est calculé automatiquement : ajouter un enfant n'oblige
    // pas à renuméroter les délais à la main.
    expect(screen.getByText('Premier').parentElement?.style.transition).toContain('0ms');
    expect(screen.getByText('Deuxième').parentElement?.style.transition).toContain('100ms');
    expect(screen.getByText('Troisième').parentElement?.style.transition).toContain('200ms');
  });

  it('tient compte du délai initial', () => {
    render(
      <StaggerReveal step={50} initialDelay={300}>
        <span>Premier</span>
      </StaggerReveal>,
    );
    expect(screen.getByText('Premier').parentElement?.style.transition).toContain('300ms');
  });

  it('plafonne le décalage total pour ne pas faire traîner les longues listes', () => {
    render(
      <StaggerReveal step={100}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>Item {i}</span>
        ))}
      </StaggerReveal>,
    );
    // 10 éléments × 100 ms feraient 900 ms ; le plafond est à 540 ms (§7.2).
    expect(screen.getByText('Item 9').parentElement?.style.transition).toContain('540ms');
  });

  it('rend tous les enfants', () => {
    render(
      <StaggerReveal>
        <span>A</span>
        <span>B</span>
      </StaggerReveal>,
    );
    expect(screen.getByText('A')).toBeDefined();
    expect(screen.getByText('B')).toBeDefined();
  });
});
