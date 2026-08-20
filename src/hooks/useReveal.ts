import useGsapReveal from './useGsapReveal';

export interface RevealOptions {
  /**
   * Position de déclenchement au format ScrollTrigger (« top 88% » par
   * défaut) : l'animation démarre lorsque le haut de l'élément atteint
   * 88 % de la hauteur du viewport.
   */
  start?: string;
}

const DEFAULT_START = 'top 88%';

/**
 * Animation d'apparition d'un élément à l'entrée dans le viewport.
 *
 * Correctif : la version précédente acceptait un `IntersectionObserverInit`
 * mais l'ignorait — le ternaire sur `rootMargin` renvoyait « top 88% » dans
 * les deux branches (détecté par SonarJS `no-all-duplicated-branches`).
 * L'option est désormais réellement prise en compte, avec un type conforme
 * à ce que `useGsapReveal` attend (ScrollTrigger, pas IntersectionObserver).
 */
export default function useReveal<T extends HTMLElement>(options?: RevealOptions) {
  return useGsapReveal<T>({ start: options?.start ?? DEFAULT_START });
}
