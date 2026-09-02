import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface DeferredSectionProps {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}

const SectionPlaceholder = ({ minHeight }: { minHeight: number }) => (
  <div
    aria-hidden="true"
    className="flex items-start justify-center bg-gradient-to-b from-brand-50/30 to-white pt-20"
    style={{ minHeight }}
  >
    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-brand-100">
      <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-400 motion-reduce:animate-none" />
    </div>
  </div>
);

/**
 * Conteneur qui mesure le contenu réel une fois rendu et n'applique
 * la minHeight que pendant la phase de chargement/attente.
 * Si la section enfant retourne `null` (données absentes), le wrapper
 * ne réserve plus d'espace (hauteur nulle) — aucun vide résiduel.
 */
const DeferredSection = ({
  children,
  minHeight = 480,
  rootMargin = '700px 0px',
}: DeferredSectionProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);
  // On commence par réserver l'espace (utile avant le 1er paint), puis on
  // l'ajuste dynamiquement en fonction de la hauteur réelle du contenu.
  const [reservedHeight, setReservedHeight] = useState<number | undefined>(minHeight);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || shouldRender) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  // Une fois le rendu différé enclenché, on observe la hauteur du contenu
  // pour deux cas :
  //  1. Le chunk lazy est encore en train d'être chargé (Suspense fallback
  //     affiché) → on garde la minHeight du placeholder.
  //  2. Le composant enfant a été monté :
  //     - s'il a rendu quelque chose (hauteur > 1), on retire la minHeight
  //       pour laisser le flux naturel reprendre ;
  //     - s'il a retourné `null` (données absentes / admissions fermées),
  //       on collapse complètement le wrapper (pas d'espace résiduel).
  useLayoutEffect(() => {
    if (!shouldRender) return;
    const element = wrapperRef.current;
    if (!element) return;

    let rafId = 0;
    let observer: ResizeObserver | null = null;

    const sync = () => {
      const height = element.scrollHeight;
      if (height <= 1) {
        setReservedHeight(0);
      }
    };

    // D'abord mesurer immédiatement (ex: admissions fermées déjà connu).
    rafId = requestAnimationFrame(sync);

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        const height = element.scrollHeight;
        if (height <= 1) {
          setReservedHeight(0);
          return;
        }
        // Dès qu'un contenu non trivial est présent, on laisse le flux
        // reprendre (minHeight:undefined) pour éviter un espace double.
        setReservedHeight(undefined);
      });
      observer.observe(element);
    }

    // Timeout de sécurité : si après 5s on n'a pas eu de hauteur nulle,
    // on libère la minHeight pour éviter de contraindre le layout.
    const safetyTimer = window.setTimeout(() => {
      setReservedHeight((prev) => (prev === 0 ? 0 : undefined));
    }, 5000);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(safetyTimer);
      observer?.disconnect();
    };
  }, [shouldRender]);

  const style: React.CSSProperties = (() => {
    if (reservedHeight === 0) {
      return { minHeight: 0, height: 0, overflow: 'hidden' };
    }
    if (reservedHeight !== undefined) {
      return { minHeight: reservedHeight };
    }
    return {};
  })();

  return (
    <div ref={wrapperRef} style={style}>
      {shouldRender ? (
        <Suspense fallback={<SectionPlaceholder minHeight={minHeight} />}>{children}</Suspense>
      ) : (
        <SectionPlaceholder minHeight={minHeight} />
      )}
    </div>
  );
};

export default DeferredSection;
