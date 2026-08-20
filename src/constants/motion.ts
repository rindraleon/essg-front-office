/**
 * Classes de survol partagées (§7.5, §7.20).
 *
 * Ce sont des chaînes de classes Tailwind, pas des composants : un survol
 * n'a pas d'état ni de cycle de vie, l'envelopper dans un composant React
 * ajouterait un nœud DOM et un rendu pour rien.
 *
 * Toutes respectent les mêmes règles :
 *  - seuls `transform`, `opacity`, `box-shadow` et `border-color` sont
 *    animés — jamais `width`, `height`, `top` ni `left` (§7.17) ;
 *  - la durée vient de `--duration-hover` (280 ms), dans la fourchette
 *    200–350 ms du §7.14 ;
 *  - `motion-reduce:` neutralise le déplacement (§7.19).
 */

/**
 * Bouton et petit élément interactif : léger soulèvement (§7.5).
 * Volontairement pas de `scale` — sur un bouton, un agrandissement se lit
 * comme un changement de taille du libellé, ce qui est perçu comme un défaut.
 */
export const HOVER_LIFT =
  'transition-[transform,box-shadow] duration-[--duration-hover] ease-out ' +
  'hover:-translate-y-0.5 ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0';

/**
 * Grande carte : soulèvement plus marqué et agrandissement minime (§7.5).
 * Plafonné à `scale(1.01)` : au-delà, l'image de la carte se recadre
 * visiblement et le texte devient flou pendant la transition.
 */
export const HOVER_CARD =
  'transition-[transform,box-shadow,border-color] duration-[--duration-hover] ease-out ' +
  'hover:-translate-y-1 hover:scale-[1.01] ' +
  'focus-within:-translate-y-1 focus-within:scale-[1.01] ' +
  'motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100';

/**
 * Icône de flèche accompagnant un lien : glissement de 3 px (§7.5).
 * À appliquer sur le parent ; la flèche doit porter la classe `group`.
 */
export const HOVER_ICON_SLIDE =
  '[&_[data-icon-slide]]:transition-transform [&_[data-icon-slide]]:duration-[--duration-micro] ' +
  '[&_[data-icon-slide]]:ease-out hover:[&_[data-icon-slide]]:translate-x-[3px] ' +
  'motion-reduce:[&_[data-icon-slide]]:transition-none';

/**
 * Image contenue dans un cadre en `overflow-hidden` (§7.6).
 * `scale(1.03)` sur la vignette d'une carte : assez pour suggérer la
 * profondeur, assez peu pour que le sujet ne sorte pas du cadre.
 */
export const HOVER_IMAGE_ZOOM =
  'transition-transform duration-[620ms] ease-out group-hover:scale-[1.03] ' +
  'group-focus-within:scale-[1.03] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:scale-100';

/**
 * Image d'une page de détail (§7.6) : zoom plus lent et plus discret, car
 * l'image est déjà grande et le mouvement y serait autrement trop visible.
 */
export const HOVER_IMAGE_ZOOM_SLOW =
  'transition-transform duration-[900ms] ease-out group-hover:scale-[1.025] ' +
  'motion-reduce:transition-none motion-reduce:group-hover:scale-100';

/**
 * État de focus clavier, commun à tous les éléments interactifs (§7.12).
 * Ne jamais retirer l'indication de focus : c'est le seul repère dont
 * dispose une personne naviguant au clavier.
 */
export const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ' +
  'focus-visible:ring-offset-2';
