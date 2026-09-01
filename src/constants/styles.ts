import { BRAND } from './colors';

/** Bouton « lien » discret (ex: « En savoir plus », « Lire la suite ») */
export const TEXT_LINK_BUTTON = {
  mt: 3,
  p: 0,
  minWidth: 'auto',
  color: BRAND[600],
  fontWeight: 700,
  textTransform: 'none',
  justifyContent: 'flex-start',
  alignSelf: 'flex-start',
  '&:hover': { backgroundColor: 'transparent', color: BRAND[700] },
} as const;

/** Bouton plein (CTA principal) */
export const PRIMARY_BUTTON = {
  py: 1,
  px: 2.5,
  minWidth: 'auto',
  backgroundColor: BRAND[600],
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  borderRadius: '0.75rem',
  fontSize: '0.875rem',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: BRAND[700],
    transform: 'translateY(-1px)',
    boxShadow: '0 10px 24px -10px rgba(46, 106, 95, 0.55)',
  },
} as const;

/** Carte squelette de chargement (largeur de carte standard) */
export const SKELETON_CARD_CLASS =
  'rounded-3xl overflow-hidden border border-ink-100 bg-white shadow-card';
