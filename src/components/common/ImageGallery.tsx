import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import RoundCarousel from '@/components/ui/roundcarousel';
import { getImageUrl } from '@/utils';
import useGsapReveal from '@/hooks/useGsapReveal';
import { gsap, prefersReducedMotion, registerGsap } from '@/lib';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  title?: string;
}

/** Écart (px) en dessous duquel un geste pointeur est considéré comme un clic. */
const DRAG_THRESHOLD_PX = 8;

/** Détection réactive du mobile pour dimensionner les cartes du carrousel. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 639px)').matches);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 639px)');
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}

const ImageGallery = ({ images, alt = 'Image', title = "Galerie d'images" }: ImageGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const stageRef = useGsapReveal<HTMLDivElement>();
  const isMobile = useIsMobile();

  /* Geste en cours sur le carrousel : distinguer un clic d'une rotation. */
  const pointerActiveRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const lastXRef = useRef(0);

  const urls = images.map((image) => getImageUrl(image)).filter(Boolean);

  const close = useCallback(() => setLightboxIndex(null), []);
  const prev = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + urls.length) % urls.length
    );
  }, [urls.length]);
  const next = useCallback(() => {
    setLightboxIndex((current) => (current === null ? null : (current + 1) % urls.length));
  }, [urls.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') prev();
      else if (event.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, close, prev, next]);

  useEffect(() => {
    if (lightboxIndex === null || prefersReducedMotion()) return;
    registerGsap();
    const image = document.querySelector<HTMLElement>('[data-lightbox-image]');
    if (!image) return;
    const tween = gsap.fromTo(
      image,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' }
    );
    return () => {
      tween.kill();
    };
  }, [lightboxIndex]);

  /* Le cylindre 3D n'a de sens qu'à partir de deux photos : au-delà du rendu
     dégénéré (rayon infini pour une seule face), on affiche l'unique image. */
  if (urls.length === 0) return null;

  const cardWidth = isMobile ? 190 : 300;
  const cardHeight = isMobile ? 140 : 210;
  const stageHeight = isMobile ? 260 : 400;

  const handlePointerDown = (event: React.PointerEvent) => {
    pointerActiveRef.current = true;
    dragDistanceRef.current = 0;
    lastXRef.current = event.clientX;
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!pointerActiveRef.current) return;
    dragDistanceRef.current += Math.abs(event.clientX - lastXRef.current);
    lastXRef.current = event.clientX;
  };

  const handlePointerUp = () => {
    pointerActiveRef.current = false;
  };

  /* Un clic (et non un glisser) sur une face du cylindre ouvre la visionneuse.
     Le clic est re-ciblé sur le conteneur par la capture du pointeur : on
     retrouve donc la face sous le curseur via elementFromPoint. */
  const handleStageClick = (event: React.MouseEvent) => {
    if (dragDistanceRef.current > DRAG_THRESHOLD_PX) return;
    const target = document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-round-carousel-index]');
    if (!target) return;
    const index = Number(target.dataset.roundCarouselIndex);
    if (Number.isInteger(index) && index >= 0 && index < urls.length) {
      setLightboxIndex(index);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          <Images className="size-4" />
        </div>
        <div>
          <h3 className="text-h5 font-semibold text-ink-900">{title}</h3>
          <p className="text-caption text-ink-500">
            {urls.length} photo{urls.length > 1 ? 's' : ''} — glissez pour faire tourner, cliquez
            pour agrandir
          </p>
        </div>
      </div>

      {urls.length === 1 ? (
        <div className="p-5">
          <button
            type="button"
            onClick={() => setLightboxIndex(0)}
            aria-label={`Agrandir l'image 1 sur 1`}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border border-ink-100 bg-ink-50"
          >
            <img
              src={urls[0]}
              alt={alt}
              loading="lazy"
              className="max-h-[70vh] w-full object-cover transition-transform duration-(--duration-reveal) group-hover:scale-[1.02]"
            />
          </button>
        </div>
      ) : (
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onClick={handleStageClick}
          style={{ height: stageHeight }}
          className="bg-[radial-gradient(ellipse_at_center,var(--color-ink-50),var(--color-brand-50))]"
        >
          <RoundCarousel
            images={urls.map((url, index) => ({ src: url, alt: `${alt} ${index + 1}` }))}
            imageWidth={cardWidth}
            imageHeight={cardHeight}
            spacing={3}
            speed={prefersReducedMotion() ? 0 : 7}
            direction="right"
            drag
            background="transparent"
          />
        </div>
      )}

      {lightboxIndex !== null &&
        /* Portail sur <body> : un ancêtre animé (GSAP) laisse un transform
           qui ferait de lui le bloc englobant du `position: fixed` et
           décentrerait la visionneuse. Hors de cet arbre, `fixed` = viewport. */
        createPortal(
          <dialog
            open
            aria-label="Visionneuse d'images"
            className="fixed inset-0 z-[100] m-0 flex h-full w-full max-w-none items-center justify-center border-0 bg-ink-950/95 p-0 backdrop-blur-sm"
            onCancel={close}
          >
            <img
              alt=""
              aria-hidden="true"
              src={urls[lightboxIndex]}
              className="fixed inset-0 h-full w-full cursor-default object-cover opacity-0"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  close();
                }
              }}
            />
            <div className="flex h-full w-full items-center justify-center">
              <button
                type="button"
                onClick={close}
                aria-label="Fermer la visionneuse"
                className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="size-4" />
              </button>
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    prev();
                  }}
                  aria-label="Image précédente"
                  className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
                >
                  <ChevronLeft />
                </button>
              )}
              <figure className="flex max-h-full max-w-full flex-col items-center px-4">
                <img
                  loading="lazy"
                  decoding="async"
                  data-lightbox-image
                  src={urls[lightboxIndex]}
                  alt={`${alt} ${lightboxIndex + 1}`}
                  className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-elevated"
                />
                <figcaption className="mt-4 text-small font-medium text-white/80">
                  {lightboxIndex + 1} / {urls.length}
                </figcaption>
              </figure>
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    next();
                  }}
                  aria-label="Image suivante"
                  className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
                >
                  <ChevronRight />
                </button>
              )}
            </div>
          </dialog>,
          document.body
        )}
    </section>
  );
};

export default ImageGallery;
