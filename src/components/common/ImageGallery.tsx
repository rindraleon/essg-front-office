import { ChevronLeft, ChevronRight, Images, Maximize2, Pause, Play, X } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { createPortal } from 'react-dom';

import { Button } from '../ui/button';
import { cn, prefersReducedMotion } from '@/lib';
import useScrollLock from '@/hooks/useScrollLock';
import { getImageUrl } from '@/utils';
import RevealOnScroll from './RevealOnScroll';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  title?: string;
}

const SWIPE_THRESHOLD = 48;

/* Durée d'affichage d'une grande image avant passage à la suivante. */
const AUTOPLAY_DELAY_MS = 5000;

const ImageGallery = ({ images, alt = 'Image', title = "Galerie d'images" }: ImageGalleryProps) => {
  const urls = useMemo(() => images.map((image) => getImageUrl(image)).filter(Boolean), [images]);
  const count = urls.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  /* Défilement automatique : `autoplayOn` est l'intention de l'utilisateur,
     suspendue le temps que la galerie est survolée, occupe au clavier ou
     masquée par la visionneuse ou un onglet en arrière-plan. `document.hidden`
     évite qu'une galerie de retour d'onglet ne saute une image au hasard. */
  const [autoplayOn, setAutoplayOn] = useState(() => !prefersReducedMotion());
  const [suspended, setSuspended] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  const railRef = useRef<HTMLDivElement | null>(null);
  const autoplayButtonRef = useRef<HTMLButtonElement | null>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const uid = useId();
  const stageId = `${uid}-stage`;
  const titleId = `${uid}-title`;
  const tabId = (index: number) => `${uid}-tab-${index}`;

  const active = count > 0 ? Math.min(Math.max(activeIndex, 0), count - 1) : 0;
  // borné : une liste d'images qui rétrécit ne doit pas laisser un index
  // hors bornes (image vide) ni un lightbox ouvert sur rien.
  const lightbox = lightboxIndex !== null && lightboxIndex < count ? lightboxIndex : null;
  const lightboxOpen = lightbox !== null;

  useScrollLock(lightboxOpen);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(document.visibilityState === 'visible');
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

  const autoplayRunning = autoplayOn && !suspended && pageVisible && !lightboxOpen;

  /* Minuteur relancé à chaque changement d'image : la durée est donc celle
     d'une image affichée, et une navigation manuelle (flèches, miniatures,
     balayage) accorde au lecteur le temps de lire la nouvelle photo avant la
     suivante. L'arrêt est explicite plutôt que conditionnel pour éviter une
     relance surprise si `count` change. */
  useEffect(() => {
    if (!autoplayRunning || count < 2) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % count);
    }, AUTOPLAY_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [autoplayRunning, active, count]);

  // La liste d'images peut rétrécir (chargement asynchrone) : on borne l'index
  // courant au lieu de conserver une position hors bornes.
  useEffect(() => {
    if (count === 0) return;
    setActiveIndex((current) => Math.min(current, count - 1));
  }, [count]);

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const step = useCallback(
    (delta: number) => {
      if (count === 0) return;
      goTo(active + delta);
    },
    [active, count, goTo]
  );

  const openLightbox = useCallback((index: number) => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveIndex(index);
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    const restore = restoreFocusRef.current;
    restoreFocusRef.current = null;
    restore?.focus?.();
  }, []);

  const stepLightbox = useCallback(
    (delta: number) => {
      if (lightboxIndex === null || count === 0) return;
      const next = (((lightboxIndex + delta) % count) + count) % count;
      setActiveIndex(next);
      setLightboxIndex(next);
    },
    [count, lightboxIndex]
  );

  // Préchargement des voisines : la navigation reste instantanée et le
  // navigateur met en cache ce qui est déjà affiché par les miniatures.
  useEffect(() => {
    if (count < 2) return;
    [active + 1, active - 1].forEach((offset) => {
      const source = urls[((offset % count) + count) % count];
      if (source) {
        const preloader = new Image();
        preloader.src = source;
      }
    });
  }, [active, count, urls]);

  // Centrage de la miniature active dans le rail, sans faire défiler la page
  // (on déplace uniquement `scrollLeft` du conteneur).
  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRefs.current[active];
    if (!rail || !thumb) return;
    const target = thumb.offsetLeft - (rail.clientWidth - thumb.clientWidth) / 2;
    rail.scrollTo({
      left: Math.max(0, target),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }, [active, count]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === 'ArrowLeft' && count > 1) {
        event.preventDefault();
        stepLightbox(-1);
        return;
      }
      if (event.key === 'ArrowRight' && count > 1) {
        event.preventDefault();
        stepLightbox(1);
        return;
      }
      // Piège de focus : sans lui, Tab échappait au voile et explorait la page
      // située dessous alors que la visionneuse est annoncée modale.
      if (event.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex="0"]'
        );
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLightbox, count, lightboxOpen, stepLightbox]);

  useEffect(() => {
    if (lightboxOpen) closeButtonRef.current?.focus({ preventScroll: true });
  }, [lightboxOpen]);

  const handleThumbKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      const next = Math.min(active + 1, count - 1);
      goTo(next);
      thumbRefs.current[next]?.focus({ preventScroll: true });
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      const next = Math.max(active - 1, 0);
      goTo(next);
      thumbRefs.current[next]?.focus({ preventScroll: true });
    } else if (event.key === 'Home') {
      event.preventDefault();
      goTo(0);
      thumbRefs.current[0]?.focus({ preventScroll: true });
    } else if (event.key === 'End') {
      event.preventDefault();
      goTo(count - 1);
      thumbRefs.current[count - 1]?.focus({ preventScroll: true });
    }
  };

  const handleStagePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const handleStagePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start || count < 2) return;
    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    step(deltaX < 0 ? 1 : -1);
  };

  const suspendAutoplay = () => setSuspended(true);
  const resumeAutoplay = () => setSuspended(false);

  // Le focus atteint le bouton lecture/pause ne suspend pas : ce bouton est
  // précisément le contrôle de la suspension, il doit pouvoir être atteint au
  // clavier et agir. Sans cette exception, le simple tabulation le ferait
  // passer de « pause » à « lecture » sous les yeux de l'utilisateur.
  const suspendOnFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target === autoplayButtonRef.current) return;
    setSuspended(true);
  };

  // `relatedTarget` est l'élément qui reçoit le focus : sans ce test, le
  // blur d'une miniature à l'autre suspendrait la lecture à chaque clic.
  const resumeWhenFocusLeaves = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setSuspended(false);
  };

  if (count === 0) return null;

  return (
    // L'entrée en scène ne touche que opacity/transform/filter : aucun
    // décalage de mise en page (le hook GSAP précédent est remplacé).
    <RevealOnScroll variant="fade-up">
      <section
        aria-labelledby={titleId}
        onMouseEnter={suspendAutoplay}
        onMouseLeave={resumeAutoplay}
        onFocusCapture={suspendOnFocus}
        onBlurCapture={resumeWhenFocusLeaves}
        className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
      >
        <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-4 sm:px-5">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100"
          >
            <Images className="size-4" />
          </span>
          <div className="min-w-0">
            <h3 id={titleId} className="truncate text-h5 font-semibold text-ink-900">
              {title}
            </h3>
            <p className="text-caption text-ink-500">
              {count} photo{count > 1 ? 's' : ''} — cliquez pour agrandir
            </p>
          </div>

          <Button
            ref={autoplayButtonRef}
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setAutoplayOn((on) => !on)}
            disabled={count < 2}
            aria-controls={stageId}
            aria-label={
              autoplayRunning ? 'Mettre le défilement en pause' : 'Lancer le défilement automatique'
            }
            className="ml-auto shrink-0 border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-700"
          >
            {autoplayRunning ? (
              <Pause className="size-4" aria-hidden="true" />
            ) : (
              <Play className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>

        <div className="p-4 sm:p-5">
          {/* Scène principale.
            Le ratio est imposé par le conteneur, jamais déduit de l'image :
            changer de photo ne peut donc pas modifier la hauteur du bloc ni
            décaler le reste de la page. Les calques voisins sont montés en
            absolu pour obtenir un fondu sans flux supplémentaire. */}
          <div
            id={stageId}
            role="tabpanel"
            aria-labelledby={tabId(active)}
            tabIndex={0}
            className="group relative flex aspect-[16/10] touch-pan-y select-none items-stretch overflow-hidden rounded-2xl bg-ink-50 ring-1 ring-ink-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 sm:aspect-[16/9] lg:aspect-[2/1]"
            onPointerDown={handleStagePointerDown}
            onPointerUp={handleStagePointerUp}
          >
            {urls.map((url, index) => {
              const distance = Math.abs(index - active);
              if (distance > 1) return null;
              const isActive = index === active;

              return (
                <img
                  key={`${url}-${index}`}
                  src={url}
                  alt={isActive ? `${alt} ${index + 1} sur ${count}` : ''}
                  aria-hidden={!isActive}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                  className={cn(
                    'absolute inset-0 size-full object-cover',
                    'transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
                    isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                  )}
                />
              );
            })}

            <button
              type="button"
              onClick={() => openLightbox(active)}
              className="absolute inset-0 z-10 flex items-end justify-end p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400 sm:p-4"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-950/60 px-3 py-1.5 text-caption font-semibold text-white backdrop-blur-sm transition-colors duration-(--duration-hover) group-hover:bg-ink-950/80 motion-reduce:transition-none">
                <Maximize2 className="size-3.5" aria-hidden="true" />
                Agrandir
              </span>
              <span className="sr-only">
                Agrandir l’image {active + 1} sur {count}
              </span>
            </button>
          </div>

          {/* Contrôleur : grille 3 colonnes sur mobile pour que l’indicateur
            reste centré, flexion resserrée dès 640 px. Hauteur constante et
            chiffres tabulaires : l’indicateur ne « respire » pas entre
            « 9 / 10 » et « 10 / 10 ». */}
          <div className="mt-4 grid grid-cols-3 items-center gap-3 sm:flex sm:justify-center sm:gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => step(-1)}
              disabled={count < 2}
              aria-label="Image précédente"
              aria-controls={stageId}
              className="justify-self-start border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-700"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </Button>

            <p
              // Le compteur n'annonce plus rien pendant la lecture automatique :
              // une annonce toutes les 5 s interromprait la lecture en cours.
              aria-live={autoplayRunning ? 'off' : 'polite'}
              aria-atomic="true"
              className="min-w-[5.5rem] justify-self-center text-center text-small font-medium text-ink-500"
            >
              <span className="text-ink-950 tabular-nums">{active + 1}</span>
              <span className="mx-1 text-ink-300" aria-hidden="true">
                /
              </span>
              <span className="tabular-nums">{count}</span>
              <span className="sr-only">photos affichées</span>
            </p>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => step(1)}
              disabled={count < 2}
              aria-label="Image suivante"
              aria-controls={stageId}
              className="justify-self-end border-ink-200 text-ink-600 hover:border-brand-300 hover:text-brand-700"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </Button>
          </div>

          {/* Rail de miniatures : dimensions fixes, défilement horizontal
            confiné au conteneur. */}
          <div
            ref={railRef}
            role="tablist"
            aria-orientation="horizontal"
            aria-label="Miniatures de la galerie"
            onKeyDown={handleThumbKeyDown}
            className="mt-3 flex snap-x snap-mandatory gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {urls.map((url, index) => {
              const isActive = index === active;

              return (
                <button
                  key={`thumb-${url}-${index}`}
                  ref={(node) => {
                    thumbRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-controls={stageId}
                  tabIndex={isActive ? 0 : -1}
                  aria-selected={isActive}
                  aria-label={`Afficher l’image ${index + 1} sur ${count}`}
                  onClick={() => goTo(index)}
                  className={cn(
                    'h-14 w-20 shrink-0 snap-start overflow-hidden rounded-lg border-2 sm:h-16 sm:w-24',
                    'transition-[border-color,opacity,box-shadow] duration-(--duration-hover) ease-out motion-reduce:transition-none',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500/40',
                    isActive
                      ? 'border-brand-500 opacity-100 shadow-card'
                      : 'border-ink-100 opacity-60 hover:border-brand-200 hover:opacity-100'
                  )}
                >
                  <img
                    src={url}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="size-full object-cover"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {lightbox !== null &&
          portalRoot &&
          createPortal(
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-label="Visionneuse d’images"
              className="fixed inset-0 z-[100] flex animate-fade-in flex-col bg-ink-950/95 backdrop-blur-sm motion-reduce:backdrop-blur-none"
              onClick={(event) => {
                if (event.target === event.currentTarget) closeLightbox();
              }}
            >
              <div className="flex items-center justify-between gap-3 px-3 pt-3 sm:px-5 sm:pt-4">
                <p
                  aria-live="polite"
                  aria-atomic="true"
                  className="text-small font-medium text-white/80"
                >
                  <span className="tabular-nums">{lightbox + 1}</span>
                  <span className="mx-1 text-white/40" aria-hidden="true">
                    /
                  </span>
                  <span className="tabular-nums">{count}</span>
                </p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closeLightbox}
                  aria-label="Fermer la visionneuse"
                  className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-(--duration-hover) hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
                >
                  <X className="size-5" aria-hidden="true" />
                </button>
              </div>

              {/* Étage de l’image : zone flexible bornée par `min-h-0`. Le
                compteur et la barre de navigation vivent dans des rangées
                séparées, si bien que le texte ne peut plus rogner la hauteur
                disponible pour la photo. */}
              <div className="flex min-h-0 flex-1 items-center justify-center px-3 py-3 sm:px-6">
                <img
                  key={urls[lightbox]}
                  src={urls[lightbox]}
                  alt={`${alt} ${lightbox + 1} sur ${count}`}
                  decoding="async"
                  draggable={false}
                  className="max-h-full max-w-full rounded-xl object-contain shadow-elevated"
                />
              </div>

              {count > 1 && (
                <div className="flex shrink-0 items-center justify-center gap-4 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <button
                    type="button"
                    onClick={() => stepLightbox(-1)}
                    aria-label="Image précédente"
                    className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-(--duration-hover) hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                  <p className="text-caption text-white/60">Flèches ← → pour naviguer</p>
                  <button
                    type="button"
                    onClick={() => stepLightbox(1)}
                    aria-label="Image suivante"
                    className="inline-flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-(--duration-hover) hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>,
            portalRoot
          )}
      </section>
    </RevealOnScroll>
  );
};

export default ImageGallery;
