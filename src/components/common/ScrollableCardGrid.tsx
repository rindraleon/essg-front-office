import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollableCardGridProps {
  children: React.ReactNode;
  scrollAmount?: number;
  className?: string;
  /** Libellé accessible de la liste défilante. */
  ariaLabel?: string;
  /**
   * Contrôles rendus à droite des flèches, dans la même barre : bouton de
   * filtre le plus souvent (§2, §21). Ils forment visuellement un seul
   * groupe avec les flèches — même hauteur, même rayon, même transition.
   */
  controls?: React.ReactNode;
  /**
   * Rendu à gauche de la barre de contrôles (compteur de résultats,
   * information de tri…). Reste lisible sur mobile, où il passe au-dessus.
   */
  toolbarStart?: React.ReactNode;
}

/**
 * Grille de cartes défilante horizontalement (§2.1).
 *
 * Largeur des cartes : portée par `CARD_WIDTH_CLASS` (`constants/layout.ts`),
 * source unique partagée par toutes les sections.
 *
 * Comportement responsive :
 *  - mobile   : une seule carte par écran, alignée par `scroll-snap`, avec
 *               deux flèches superposées aux bords — le geste tactile reste
 *               possible, mais l'affordance ne dépend plus de lui ;
 *  - tablette : deux cartes, la suivante entrevue ;
 *  - desktop  : trois à quatre cartes, flèches au-dessus de la liste.
 *
 * Débordement : le conteneur porte `overflow-x-auto` et les cartes sont en
 * `flex-none` avec une largeur exprimée en pourcentage du conteneur. Aucune
 * largeur fixe en pixels n'est utilisée, donc la page elle-même ne peut pas
 * déborder horizontalement, quelle que soit la taille du viewport.
 *
 * Accessibilité : la zone est focalisable et pilotable aux flèches du
 * clavier ; les boutons mesurent 44 px (mobile) et 40 px (desktop), soit la
 * cible tactile minimale recommandée.
 */
const ScrollableCardGrid: React.FC<ScrollableCardGridProps> = ({
  children,
  scrollAmount,
  className = '',
  ariaLabel = 'Liste défilante',
  controls,
  toolbarStart,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);
  /** Vrai si le contenu dépasse : sinon aucun contrôle n'est affiché. */
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    // Tolérance de 2px : les navigateurs arrondissent les valeurs fractionnaires.
    setIsAtStart(scrollLeft <= 2);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
    setIsScrollable(scrollWidth > clientWidth + 2);
  }, []);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    checkScrollPosition();

    // ResizeObserver plutôt qu'un écouteur `resize` : il réagit aussi
    // lorsque les cartes changent de taille (images chargées, contenu async).
    const observer = new ResizeObserver(checkScrollPosition);
    observer.observe(element);
    for (const child of Array.from(element.children)) observer.observe(child);

    return () => observer.disconnect();
  }, [children, checkScrollPosition]);

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const element = scrollContainerRef.current;
      if (!element) return;

      // Sur mobile (une carte par écran), on défile d'exactement une carte :
      // l'accroche `scroll-snap` termine le mouvement au bon endroit.
      // Au-delà, on défile de ~85 % de la largeur visible pour conserver un
      // repère de lecture entre deux pages de cartes.
      const firstCard = element.firstElementChild as HTMLElement | null;
      const gap = Number.parseFloat(getComputedStyle(element).columnGap || '0') || 0;
      const oneCard = firstCard ? firstCard.offsetWidth + gap : element.clientWidth;
      const amount = scrollAmount ?? (oneCard >= element.clientWidth * 0.75 ? oneCard : element.clientWidth * 0.85);
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      element.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [scrollAmount],
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scroll('left');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scroll('right');
    }
  };

  /** Style partagé par les quatre boutons (deux mobiles, deux desktop). */
  const arrowClass =
    'grid place-items-center rounded-full border border-ink-100 bg-white text-ink-700 shadow-card ' +
    'transition-[background-color,border-color,color,opacity] duration-200 ease-out ' +
    'hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-0 motion-reduce:transition-none';

  /*
    Barre de contrôles (§2, §21).

    Elle est rendue dès qu'il y a quelque chose à y mettre : les flèches
    n'apparaissent que si le contenu déborde, mais le bouton de filtre doit
    rester accessible même lorsque tout tient à l'écran.

    Sur mobile, `toolbarStart` passe au-dessus et les contrôles s'alignent à
    droite — les flèches y sont doublées par celles superposées à la liste.
  */
  const showToolbar = isScrollable || Boolean(controls) || Boolean(toolbarStart);

  return (
    <div className={cn('w-full', className)}>
      {showToolbar && (
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {toolbarStart ? (
            <div className="min-w-0 text-small text-ink-500">{toolbarStart}</div>
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}

          {/*
            `group` : c'est le survol de CE conteneur qui révèle le bouton de
            filtre sur desktop (§3), et non le survol du bouton lui-même —
            qui serait impossible à atteindre tant qu'il est transparent.
          */}
          <div className="group flex items-center justify-end gap-2">
            {isScrollable && (
              <>
                <button
                  type="button"
                  onClick={() => scroll('left')}
                  disabled={isAtStart}
                  aria-label="Défiler vers la gauche"
                  className={cn(arrowClass, 'hidden size-10 lg:grid')}
                >
                  <ChevronLeft className="size-5" />
                </button>

                <button
                  type="button"
                  onClick={() => scroll('right')}
                  disabled={isAtEnd}
                  aria-label="Défiler vers la droite"
                  className={cn(arrowClass, 'hidden size-10 lg:grid')}
                >
                  <ChevronRight className="size-5" />
                </button>
              </>
            )}

            {controls}
          </div>
        </div>
      )}

      <div className="relative">
        {/* Contrôles mobile/tablette : superposés aux bords de la liste.
            Ils sont indispensables ici puisqu'une seule carte est visible :
            rien d'autre n'indiquerait qu'il reste du contenu. */}
        {isScrollable && (
          <>
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={isAtStart}
              aria-label="Carte précédente"
              className={cn(
                arrowClass,
                'absolute left-1 top-1/2 z-20 size-11 -translate-y-1/2 lg:hidden',
              )}
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={isAtEnd}
              aria-label="Carte suivante"
              className={cn(
                arrowClass,
                'absolute right-1 top-1/2 z-20 size-11 -translate-y-1/2 lg:hidden',
              )}
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        {/* Indicateurs de contenu masqué (tablette et plus). */}
        {isScrollable && !isAtStart && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-10 bg-gradient-to-r from-ink-50 to-transparent lg:block"
          />
        )}
        {isScrollable && !isAtEnd && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-10 bg-gradient-to-l from-ink-50 to-transparent lg:block"
          />
        )}

        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          onKeyDown={handleKeyDown}
          role="region"
          aria-label={ariaLabel}
          tabIndex={0}
          className={cn(
            'flex overflow-x-auto overflow-y-hidden scroll-smooth pb-4 motion-reduce:scroll-auto',
            // Accroche : la carte s'aligne proprement, jamais coupée au milieu.
            'snap-x snap-mandatory',
            // Défilement tactile fluide sur iOS.
            '[-webkit-overflow-scrolling:touch]',
            // Espacement progressif selon la largeur d'écran.
            'gap-4 sm:gap-5 lg:gap-6',
            // Marge de bord sur mobile : la carte respire, et l'accroche
            // tient compte de ce décalage pour rester alignée.
            'px-4 scroll-px-4 sm:px-0 sm:scroll-px-0',
            'scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            '[&>*]:shrink-0',
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollableCardGrid;
