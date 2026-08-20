/**
 * Charte graphique ESSG — inspirée du logo (vert profond + vert sauge).
 *
 * BRAND  : couleur primaire « pin » (vert profond tiré du logo ESSG)
 * SAGE   : couleur secondaire « sauge » (vert sauge du logo ESSG, #98C070)
 * INK    : neutres très sombres pour grandes surfaces (footer, overlays)
 * GREEN  : alias de BRAND — conservé pour la compatibilité du code existant
 */

export const BRAND = {
  50: '#eff7f4',
  100: '#d9ece7',
  200: '#b6d9d0',
  300: '#8abfb3',
  400: '#5ba092',
  500: '#3d8376',
  600: '#2e6a5f',
  700: '#27564e',
  800: '#224640',
  900: '#1e3a35',
  950: '#0f211e',
} as const;

export const SAGE = {
  50: '#f7faf1',
  100: '#eef4df',
  200: '#dce9c2',
  300: '#c2d799',
  400: '#98c070',
  500: '#7fa757',
  600: '#648640',
  700: '#4f6834',
  800: '#41542d',
  900: '#374727',
  950: '#1d2712',
} as const;

export const INK = {
  50: '#f5f7f7',
  100: '#e5eaeb',
  200: '#c8d3d5',
  300: '#9fb1b4',
  400: '#6f888c',
  500: '#546c70',
  600: '#43575b',
  700: '#38474b',
  800: '#303c3f',
  900: '#1e2829',
  950: '#11191a',
} as const;

/**
 * Alias historique : tous les usages existants de `GREEN` utilisent
 * désormais la palette primaire « brand » du design system ESSG.
 */
export const GREEN = BRAND;

/** Sémantiques partagées (badges, alertes, statuts) */
export const STATUS = {
  success: { light: BRAND[50], border: BRAND[200], text: BRAND[700] },
  warning: { light: '#fef9ec', border: '#f3e2b8', text: '#92600a' },
  danger: { light: '#fef2f2', border: '#f5c6c6', text: '#b42318' },
  info: { light: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
} as const;
