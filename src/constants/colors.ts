/**
 * Palette de marque exposée au JavaScript (canvas, graphiques, cartes).
 *
 * Source unique : les tokens `--color-brand-*` définis dans
 * `src/styles/index.css`, eux-mêmes dérivés du vert du logo ESSG.
 * Toute évolution de la charte se fait dans le CSS puis ici — jamais
 * en écrivant un hexadécimal dans un composant.
 */
const BRAND = {
  50: '#f5faef',
  100: '#e8f3db',
  200: '#d3e8bd',
  300: '#b7d897',
  400: '#98c070', // vert exact du logo
  500: '#78a44e',
  600: '#547c36', // remplissage des CTA — 4.87:1 sur blanc
  700: '#42612c', // liens et surtitres — 7.05:1 sur blanc
  800: '#374e27',
  900: '#2f4123',
  950: '#17220f',
} as const;

/** Anthracite ardoise du logo — neutres et surfaces sombres. */
const INK = {
  50: '#f6f7f8',
  100: '#e9ebed',
  200: '#d4d8dc',
  300: '#b0b7bd',
  400: '#848d96',
  500: '#68727c',
  600: '#586068', // gris exact du logo
  700: '#4a5158',
  800: '#3c4247',
  900: '#2b3034',
  950: '#1b1f22',
} as const;

/** Rouge du logo — réservé aux erreurs et alertes critiques. */
const DANGER = {
  50: '#fdecea',
  100: '#fbd5d1',
  500: '#e53935',
  600: '#d32f2f',
  700: '#c62828',
} as const;

export const GREEN = BRAND;
export { BRAND, INK, DANGER };
