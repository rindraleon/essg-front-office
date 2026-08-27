import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { getImageUrl } from '@/utils';
import useGsapReveal from '@/hooks/useGsapReveal';
import { gsap, prefersReducedMotion, registerGsap } from '@/lib';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  title?: string;
}

const ImageGallery = ({ images, alt = 'Image', title = "Galerie d'images" }: ImageGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const gridRef = useGsapReveal<HTMLElement>();
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
      { opacity: 1, scale: 1, duration: 0.36, ease: 'power2.out' }
    );
    return () => {
      tween.kill();
    };
  }, [lightboxIndex]);

  if (urls.length === 0) return null;

  return (
    <section
      ref={gridRef}
      className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
    >
      <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
          <Images className="size-4" />
        </div>
        <div>
          <h3 className="text-h5 font-semibold text-ink-900">{title}</h3>
          <p className="text-caption text-ink-500">
            {urls.length} photo{urls.length > 1 ? 's' : ''} — cliquez pour agrandir
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-4">
        {urls.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            data-gsap
            onClick={() => setLightboxIndex(index)}
            aria-label={`Agrandir l'image ${index + 1} sur ${urls.length}`}
            className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-xl border border-ink-100 bg-ink-50 transition-all duration-(--duration-hover) hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card-hover"
          >
            <img
              src={url}
              alt={`${alt} ${index + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-(--duration-reveal) group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 flex items-end justify-start bg-gradient-to-t from-ink-950/40 to-transparent p-2.5 opacity-0 transition-opacity duration-(--duration-hover) group-hover:opacity-100">
              <span className="text-caption font-semibold text-white">
                {index + 1} / {urls.length}
              </span>
            </span>
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse d'images"
          tabIndex={-1}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink-950/95 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') close();
          }}
        >
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
      )}
    </section>
  );
};

export default ImageGallery;
