import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════════════════════
   SYSTÈME D'APPARITION AU DÉFILEMENT (§7.1, §7.20)

   Fondé sur `IntersectionObserver` et n'animant que `opacity`,
   `transform` et — pour la seule variante `blur-in` — `filter` : ces
   propriétés sont composées par le GPU, donc sans reflow ni recalcul de
   mise en page.

   L'observateur se déconnecte dès le premier déclenchement — inutile de
   continuer à observer un élément déjà révélé, et cela évite que le
   contenu ne rejoue son animation à chaque passage.

   Les distances et les durées viennent de variables CSS
   (`--reveal-distance`, `--duration-reveal`) redéfinies par média-requête :
   le composant n'a donc pas à connaître la taille de l'écran pour
   appliquer le motion responsive du §7.18.
   ═══════════════════════════════════════════════════════════════════════ */

/**
 * Variantes d'entrée (§7.1).
 *
 * `up`/`down`/`left`/`right` sont conservés pour compatibilité avec le code
 * existant ; ils sont les alias respectifs de `fade-up`, `fade-down`,
 * `fade-left` et `fade-right`.
 */
export type RevealVariant =
  | 'fade-up'
  | 'fade-up-sm'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-in'
  | 'blur-in'
  | 'fade'
  // Alias historiques.
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'none';

interface VariantSpec {
  /** État initial : uniquement des propriétés composées par le GPU. */
  from: { transform?: string; filter?: string };
  /** Durée en millisecondes, ou variable CSS. */
  duration: string;
}

/**
 * Table des variantes. Les durées suivent le tableau §7.1 ; les distances
 * passent par `--reveal-distance`, ce qui les rend responsive sans que la
 * table ait à être dupliquée par point de rupture.
 */
function specFor(variant: RevealVariant, distance?: number): VariantSpec {
  /** Distance effective : valeur explicite en pixels, sinon token CSS. */
  const d = distance !== undefined ? `${distance}px` : 'var(--reveal-distance)';
  const dSm = distance !== undefined ? `${distance}px` : 'var(--reveal-distance-sm)';

  switch (variant) {
    case 'fade-up-sm':
      return { from: { transform: `translate3d(0, ${dSm}, 0)` }, duration: '500ms' };
    case 'fade-down':
    case 'down':
      return { from: { transform: `translate3d(0, calc(-1 * ${d}), 0)` }, duration: '650ms' };
    case 'fade-left':
    case 'left':
      // « fade-left » = le contenu vient de la gauche.
      return { from: { transform: `translate3d(calc(-1 * ${d}), 0, 0)` }, duration: '650ms' };
    case 'fade-right':
    case 'right':
      return { from: { transform: `translate3d(${d}, 0, 0)` }, duration: '650ms' };
    case 'scale-in':
      // Scale seul, sans translation : la carte « se pose » face à l'écran.
      return { from: { transform: 'scale(0.96)' }, duration: '700ms' };
    case 'blur-in':
      // Réservé aux grands visuels : `filter` est la seule propriété
      // coûteuse du système, elle ne doit pas être généralisée.
      return { from: { filter: 'blur(8px)', transform: 'scale(1.02)' }, duration: '900ms' };
    case 'fade':
    case 'none':
      return { from: {}, duration: 'var(--duration-reveal)' };
    default:
      // fade-up (et alias `up`) : la variante par défaut.
      return { from: { transform: `translate3d(0, ${d}, 0)` }, duration: '700ms' };
  }
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  /** Variante d'entrée (§7.1). */
  variant?: RevealVariant;
  /** @deprecated Alias de `variant`, conservé pour le code existant. */
  direction?: RevealVariant;
  /** Délai avant le départ, en millisecondes. */
  delay?: number;
  /** Amplitude en pixels. Par défaut : `--reveal-distance` (responsive). */
  distance?: number;
  /** Balise rendue (`section`, `article`, `li`…). */
  as?: React.ElementType;
  className?: string;
  /**
   * Rejoue l'animation à chaque entrée dans le viewport.
   * Désactivé par défaut : une animation qui se répète distrait le lecteur.
   */
  repeat?: boolean;
}

/**
 * Révèle son contenu lorsqu'il entre dans le champ de vision.
 *
 * @example
 * <RevealOnScroll as="section" variant="fade-up" delay={120}>…</RevealOnScroll>
 */
export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  variant,
  direction,
  delay = 0,
  distance,
  as: Tag = 'div',
  className,
  repeat = false,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [immediate, setImmediate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Mouvement réduit : le contenu s'affiche directement, sans transition.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setImmediate(true);
      setVisible(true);
      return;
    }

    // Environnement sans IntersectionObserver : on affiche plutôt que de
    // risquer un contenu définitivement invisible.
    if (typeof IntersectionObserver === 'undefined') {
      setImmediate(true);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setVisible(false);
        }
      },
      {
        // Déclenchement légèrement avant l'entrée réelle : l'animation est
        // déjà en cours quand l'élément devient visible, ce qui la rend
        // naturelle plutôt que soudaine.
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.05,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [repeat]);

  const spec = specFor(variant ?? direction ?? 'fade-up', distance);
  const animated = ['opacity', spec.from.transform && 'transform', spec.from.filter && 'filter']
    .filter(Boolean)
    .join(', ');

  return (
    <Tag
      ref={ref as never}
      className={cn('will-change-[opacity,transform]', className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : spec.from.transform,
        filter: visible ? 'none' : spec.from.filter,
        transition: immediate
          ? 'none'
          : `${animated
              .split(', ')
              .map((prop) => `${prop} ${spec.duration} var(--ease-reveal) ${delay}ms`)
              .join(', ')}`,
      }}
    >
      {children}
    </Tag>
  );
};

interface StaggerProps {
  children: React.ReactNode;
  /**
   * Écart entre deux enfants successifs, en millisecondes.
   * Par défaut, la valeur suit `--stagger-step` (90 ms desktop, 60 ms
   * mobile) — passer une valeur explicite désactive cette adaptation.
   */
  step?: number;
  /** Délai avant le premier enfant. */
  initialDelay?: number;
  variant?: RevealVariant;
  /** @deprecated Alias de `variant`. */
  direction?: RevealVariant;
  distance?: number;
  as?: React.ElementType;
  className?: string;
}

/** Écart par défaut, aligné sur `--stagger-step` (§7.2). */
const DEFAULT_STEP = 90;
const DEFAULT_STEP_COMPACT = 60;

/**
 * Révèle ses enfants l'un après l'autre.
 *
 * Le décalage est calculé ici plutôt que renseigné à la main sur chaque
 * élément : ajouter ou retirer un enfant n'oblige pas à renuméroter les
 * délais.
 *
 * Le total est plafonné à 540 ms (§7.2) : au-delà, le dernier élément d'une
 * longue liste apparaîtrait si tard que l'utilisateur aurait déjà commencé à
 * lire, ce qui donnerait l'impression d'un contenu qui traîne.
 */
export const StaggerReveal: React.FC<StaggerProps> = ({
  children,
  step,
  initialDelay = 0,
  variant,
  direction,
  distance,
  as: Tag = 'div',
  className,
}) => {
  const items = React.Children.toArray(children);

  const compact =
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;
  const effectiveStep = step ?? (compact ? DEFAULT_STEP_COMPACT : DEFAULT_STEP);
  const MAX_TOTAL = 540;

  return (
    <Tag className={className}>
      {items.map((child, index) => (
        <RevealOnScroll
          // L'index est une clé légitime ici : la liste est ordonnée et
          // rendue telle quelle, sans réordonnancement possible.
          key={index}
          variant={variant ?? direction}
          distance={distance}
          delay={initialDelay + Math.min(index * effectiveStep, MAX_TOTAL)}
        >
          {child}
        </RevealOnScroll>
      ))}
    </Tag>
  );
};

export default RevealOnScroll;
