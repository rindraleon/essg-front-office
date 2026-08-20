/**
 * Constantes de mise en page partagées par les sections défilantes.
 *
 * Elles vivaient dans `utils/component.utils.ts` ; ce sont des valeurs de
 * charte, pas des utilitaires : leur place est avec les autres constantes
 * visuelles (`colors.ts`, `media.ts`), aux côtés desquelles elles se
 * cherchent naturellement (§5).
 */

/**
 * Largeur des cartes placées dans un `ScrollableCardGrid`.
 *
 * Source unique : toutes les sections (Formations, Actualités, Projets,
 * Ressources humaines, Partenaires) l'utilisent, ce qui garantit un rythme
 * identique d'une section à l'autre.
 *
 *  - mobile   : 100 % de la largeur disponible — une seule carte à l'écran,
 *               conformément au comportement attendu sur petit écran ; la
 *               navigation se fait aux flèches ou au geste ;
 *  - tablette : 2 cartes visibles ;
 *  - desktop  : 3 cartes ;
 *  - large    : 4 cartes.
 *
 * Les `calc()` retranchent les gouttières (`gap`) définies par
 * `ScrollableCardGrid`, afin que la dernière carte ne soit jamais tronquée.
 * Toutes les valeurs sont relatives : la page ne peut pas déborder
 * horizontalement.
 */
export const CARD_WIDTH_CLASS = [
  'flex-none snap-start',
  'w-full',
  'sm:w-[calc((100%-1.25rem)/2)]',
  'lg:w-[calc((100%-3rem)/3)]',
  'xl:w-[calc((100%-4.5rem)/4)]',
].join(' ');

/** Clés stables pour les cartes de chargement (évite `key={index}`). */
export const SKELETON_KEYS = ['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4'] as const;
