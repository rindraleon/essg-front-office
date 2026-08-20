import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Garde-fous du système de design.
 *
 * Ces tests lisent la feuille de styles comme du texte plutôt que de rendre
 * des composants : jsdom n'applique ni `clamp()`, ni `@media`, ni les
 * `@theme` de Tailwind 4, il ne pourrait donc rien vérifier de tout cela.
 * L'objectif n'est pas de tester le navigateur, mais d'empêcher qu'une
 * décision documentée soit défaite par inadvertance.
 */

const CSS = readFileSync(join(__dirname, 'index.css'), 'utf8');

describe('Typographie (§5)', () => {
  it('déclare exactement trois familles : affichage, interface, accent', () => {
    expect(CSS).toContain('--font-display:');
    expect(CSS).toContain('--font-sans:');
    expect(CSS).toContain('--font-tech:');
  });

  it('réserve Orbitron à l’accent technologique', () => {
    const tech = CSS.slice(CSS.indexOf('--font-tech:'), CSS.indexOf('--font-tech:') + 160);
    expect(tech).toContain('Orbitron');
    // Orbitron ne doit jamais servir de police de texte courant.
    const sans = CSS.slice(CSS.indexOf('--font-sans:'), CSS.indexOf('--font-sans:') + 200);
    expect(sans).not.toContain('Orbitron');
  });

  it('auto-héberge les polices, sans appel à un CDN tiers', () => {
    expect(CSS).toContain("@import '@fontsource-variable/orbitron/wght.css'");
    expect(CSS).not.toContain('fonts.googleapis.com');
    expect(CSS).not.toContain('fonts.gstatic.com');
  });

  it('n’utilise plus les polices retirées du système', () => {
    for (const banned of ['Oswald', 'Roboto Slab', 'Exo 2', 'Space Mono']) {
      expect(CSS).not.toContain(banned);
    }
  });

  it('exprime les niveaux de titre en clamp(), pour une montée continue', () => {
    for (const token of ['--text-display:', '--text-h1:', '--text-h2:', '--text-h3:']) {
      const line = CSS.slice(CSS.indexOf(token), CSS.indexOf(token) + 90);
      expect(line).toContain('clamp(');
    }
  });

  it('garde Caption à taille fixe : en dessous de 12px la lisibilité chute', () => {
    const line = CSS.slice(CSS.indexOf('--text-caption:'), CSS.indexOf('--text-caption:') + 60);
    expect(line).toContain('0.75rem');
    expect(line).not.toContain('clamp(');
  });

  it('respecte la hiérarchie : chaque niveau est plus petit que le précédent', () => {
    /** Borne haute (valeur desktop) d'un token exprimé en clamp(). */
    const maxOf = (token: string) => {
      const slice = CSS.slice(CSS.indexOf(token), CSS.indexOf(token) + 90);
      const match = /clamp\([^)]*,\s*([\d.]+)rem\)/.exec(slice);
      return match ? Number.parseFloat(match[1]) : Number.NaN;
    };
    const display = maxOf('--text-display:');
    const h1 = maxOf('--text-h1:');
    const h2 = maxOf('--text-h2:');
    const h3 = maxOf('--text-h3:');

    expect(display).toBeGreaterThan(h1);
    expect(h1).toBeGreaterThan(h2);
    expect(h2).toBeGreaterThan(h3);
  });

  it('bascule H5 et H6 sur la police d’interface (§5.4)', () => {
    expect(CSS).toMatch(/h5,\s*\n\s*h6\s*\{\s*\n\s*font-family: var\(--font-sans\)/);
  });
});

describe('Système de mouvement (§7)', () => {
  it('centralise durées et courbes plutôt que de les répéter', () => {
    for (const token of [
      '--ease-reveal:',
      '--duration-micro:',
      '--duration-hover:',
      '--duration-reveal:',
      '--duration-hero:',
      '--stagger-step:',
      '--reveal-distance:',
    ]) {
      expect(CSS).toContain(token);
    }
  });

  it('utilise la courbe d’entrée recommandée (§7.15)', () => {
    expect(CSS).toContain('--ease-reveal: cubic-bezier(0.22, 1, 0.36, 1)');
  });

  it('respecte les fourchettes de durée du §7.14', () => {
    const ms = (token: string) => {
      const slice = CSS.slice(CSS.indexOf(token), CSS.indexOf(token) + 40);
      return Number.parseInt(/(\d+)ms/.exec(slice)?.[1] ?? '0', 10);
    };
    expect(ms('--duration-micro:')).toBeGreaterThanOrEqual(150);
    expect(ms('--duration-micro:')).toBeLessThanOrEqual(250);
    expect(ms('--duration-hover:')).toBeGreaterThanOrEqual(200);
    expect(ms('--duration-hover:')).toBeLessThanOrEqual(350);
    expect(ms('--duration-reveal:')).toBeGreaterThanOrEqual(500);
    expect(ms('--duration-reveal:')).toBeLessThanOrEqual(700);
    expect(ms('--duration-hero:')).toBeGreaterThanOrEqual(800);
    expect(ms('--duration-hero:')).toBeLessThanOrEqual(1200);
  });

  it('garde le marquee dans la fourchette 30–45 s (§7.14)', () => {
    for (const token of ['--duration-marquee-1:', '--duration-marquee-2:']) {
      const slice = CSS.slice(CSS.indexOf(token), CSS.indexOf(token) + 40);
      const seconds = Number.parseInt(/(\d+)s/.exec(slice)?.[1] ?? '0', 10);
      expect(seconds).toBeGreaterThanOrEqual(30);
      expect(seconds).toBeLessThanOrEqual(45);
    }
  });

  it('réduit distances et durées sur mobile (§7.18)', () => {
    const compact = CSS.slice(CSS.indexOf('@media (max-width: 767px)'));
    expect(compact).toContain('--reveal-distance: 14px');
    expect(compact).toContain('--stagger-step: 60px'.replace('px', 'ms'));
  });

  it('garde les déplacements dans la plage 12–32 px (§7.1)', () => {
    const distance = (token: string) => {
      const slice = CSS.slice(CSS.indexOf(token), CSS.indexOf(token) + 40);
      return Number.parseInt(/(\d+)px/.exec(slice)?.[1] ?? '0', 10);
    };
    expect(distance('--reveal-distance:')).toBeGreaterThanOrEqual(12);
    expect(distance('--reveal-distance:')).toBeLessThanOrEqual(32);
  });

  it('honore prefers-reduced-motion (§7.19)', () => {
    expect(CSS).toContain('@media (prefers-reduced-motion: reduce)');
    // Le marquee et les décors du Hero doivent y être neutralisés.
    const reduced = CSS.slice(CSS.indexOf('@media (prefers-reduced-motion: reduce)'));
    expect(reduced).toContain('animation-duration: 0.01ms !important');
  });

  it('fige les décors du Hero en mouvement réduit', () => {
    const blocks = CSS.split('@media (prefers-reduced-motion: reduce)');
    const heroBlock = blocks.find((b: string) => b.includes('.hero-geo-line'));
    expect(heroBlock).toBeDefined();
    expect(heroBlock).toContain('stroke-dashoffset: 0');
  });

  it('n’anime aucune propriété provoquant un recalcul de mise en page', () => {
    // On inspecte les seules règles `transition:` du système.
    const transitions = CSS.match(/transition:[^;]+;/g) ?? [];
    for (const rule of transitions) {
      for (const forbidden of ['width', 'height', ' top', ' left', 'margin', 'padding']) {
        expect(rule).not.toContain(forbidden);
      }
    }
  });

  it('anime le shimmer sans redécoupage ni recalcul (§7.13)', () => {
    expect(CSS).toContain('@keyframes skeleton-shimmer');
    const frames = CSS.slice(
      CSS.indexOf('@keyframes skeleton-shimmer'),
      CSS.indexOf('@keyframes skeleton-shimmer') + 200,
    );
    expect(frames).toContain('background-position');
  });
});

describe('Accessibilité (§7.12, §5.20)', () => {
  it('ne supprime jamais l’indication de focus', () => {
    expect(CSS).toContain(':focus-visible');
    expect(CSS).not.toMatch(/:focus(-visible)?\s*\{[^}]*outline:\s*(none|0)/);
  });

  it('adapte l’anneau de focus aux surfaces sombres', () => {
    expect(CSS).toContain("[data-surface='dark'] :focus-visible");
    expect(CSS).toContain('outline-color: var(--color-sage-400)');
  });

  it('borne la largeur de lecture des paragraphes (§5.8)', () => {
    expect(CSS).toContain('max-width: 65ch');
  });
});
