import { ArrowDown, ArrowRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { SITE_HERO_ALT, SITE_HERO_IMAGE } from '../../constants/media';
import type { HeroSectionProps } from '../../types';


type CssVars = React.CSSProperties & Record<`--${string}`, string>;

interface ParticleData {
  id: string;
  className: string;
  style: CssVars;
}

const random = (min: number, max: number) => min + Math.random() * (max - min);

/** 28 éléments animés au total (contre 110 auparavant). */
function buildParticles(): ParticleData[] {
  const items: ParticleData[] = [];

  for (let i = 0; i < 20; i++) {
    const size = `${1 + Math.random() * 2}px`;
    items.push({
      id: `star-${i}`,
      className: 'hero-star',
      style: {
        top: `${random(0, 100)}%`,
        left: `${random(0, 100)}%`,
        width: size,
        height: size,
        '--hero-duration': `${random(2, 6)}s`,
        '--hero-delay': `${random(0, 5)}s`,
      },
    });
  }

  for (let i = 0; i < 8; i++) {
    items.push({
      id: `float-${i}`,
      className: 'hero-particle',
      style: {
        left: `${random(0, 100)}%`,
        bottom: '-10px',
        '--hero-size': `${random(2, 6)}px`,
        '--hero-duration': `${random(12, 22)}s`,
        '--hero-delay': `${random(0, 10)}s`,
      },
    });
  }

  return items;
}

const ParticleField = React.memo(() => {
  const particles = useMemo(buildParticles, []);
  return (
    // Masqué sous `md` : sur mobile, ces animations coûtent cher pour un
    // apport visuel quasi nul.
    <div className="absolute inset-0 hidden md:block" aria-hidden="true">
      {particles.map((particle) => (
        <div key={particle.id} className={particle.className} style={particle.style} />
      ))}
    </div>
  );
});
ParticleField.displayName = 'ParticleField';

const InfiniteRings: React.FC = () => (
  <div
    className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
    aria-hidden="true"
  >
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <div
        className="hero-ring"
        style={{ width: 500, height: 500, '--hero-duration': '25s' } as CssVars}
      />
      <div
        className="hero-ring hero-ring-reverse"
        style={
          {
            width: 400,
            height: 400,
            '--hero-duration': '18s',
            borderColor: 'rgb(152 192 112 / 0.2)',
            borderStyle: 'dashed',
          } as CssVars
        }
      />
      <div
        className="hero-ring"
        style={
          {
            width: 300,
            height: 300,
            '--hero-duration': '30s',
            borderColor: 'rgb(152 192 112 / 0.15)',
          } as CssVars
        }
      />
    </div>
  </div>
);

const GeodeticLayer: React.FC = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 hidden size-full opacity-[0.18] md:block"
    viewBox="0 0 1200 800"
    preserveAspectRatio="xMidYMid slice"
    fill="none"
  >
    {/* Lignes de mesure entre les stations. */}
    <g stroke="rgb(152 192 112 / 0.55)" strokeWidth="0.75">
      <path className="hero-geo-line" d="M120 620 L340 470 L610 560 L880 380 L1080 470" />
      <path className="hero-geo-line" style={{ animationDelay: '0.4s' }} d="M340 470 L420 220 L610 560" />
      <path className="hero-geo-line" style={{ animationDelay: '0.8s' }} d="M610 560 L760 180 L880 380" />
    </g>

    {/* Stations : un point plein, un cercle de tolérance autour. */}
    <g fill="rgb(152 192 112 / 0.9)">
      {[
        [120, 620],
        [340, 470],
        [610, 560],
        [880, 380],
        [1080, 470],
        [420, 220],
        [760, 180],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="2.5" />
          <circle cx={cx} cy={cy} r="9" fill="none" stroke="rgb(152 192 112 / 0.4)" strokeWidth="0.6" />
        </g>
      ))}
    </g>
  </svg>
);


const HudCrosshair: React.FC = () => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 hidden items-center justify-center opacity-[0.12] md:flex"
  >
    <div className="relative grid size-[32rem] place-items-center">
      {/* Réticule : deux axes et trois cercles de visée concentriques. */}
      <div className="absolute top-1/2 h-px w-full bg-sage-400" />
      <div className="absolute left-1/2 h-full w-px bg-sage-400" />
      <div className="absolute size-64 rounded-full border border-sage-400" />
      <div className="absolute size-40 rounded-full border border-dashed border-sage-400" />
      <div className="absolute size-24 rounded-full border border-sage-400" />

      <div data-numeric className="absolute bottom-6 font-tech text-tech text-sage-200">
        -21.4415° S · 47.0856° E
      </div>
    </div>
  </div>
);

/* ───────────────────────── Composant principal ───────────────────────── */
const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'École Supérieure de Sciences Géomatiques',
  description = "Formez-vous à la géomatique, à la topographie et à l'aménagement du territoire. Une école d'excellence, au service des territoires de Madagascar.",
}) => {
  
  const titleWords = useMemo(
    () =>
      title
        .split(' ')
        .filter(Boolean)
        .map((word, index, all) => (index < all.length - 1 ? `${word}\u00A0` : word)),
    [title],
  );

  const containerRef = useRef<HTMLElement>(null);
  const layersRef = useRef<HTMLDivElement[]>([]);
  const frameRef = useRef<number | null>(null);

  const registerLayer = useCallback((element: HTMLDivElement | null) => {
    if (element && !layersRef.current.includes(element)) layersRef.current.push(element);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Pas de parallaxe sur tactile ni en mouvement réduit.
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || prefersReducedMotion) return;

    const handleMove = (event: MouseEvent) => {
      // Throttle via rAF : au plus une écriture DOM par frame.
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const x = event.clientX - window.innerWidth / 2;
        const y = event.clientY - window.innerHeight / 2;
        for (const layer of layersRef.current) {
          const depth = Number.parseFloat(layer.dataset.depth ?? '0');
          layer.style.transform = `translate3d(${x * depth}px,${y * depth}px,0)`;
        }
      });
    };

    const handleLeave = () => {
      for (const layer of layersRef.current) {
        layer.style.transform = 'translate3d(0,0,0)';
      }
    };

    container.addEventListener('mousemove', handleMove, { passive: true });
    container.addEventListener('mouseleave', handleLeave);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', handleLeave);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      data-surface="dark"
      className="relative flex min-h-[85svh] w-full items-center overflow-hidden bg-brand-650 pt-20 md:min-h-[100svh] md:pt-24"
    >
      {/* ═══ Arrière-plan ═══ */}
      <div className="absolute inset-0 z-0 bg-black">
        <div
          ref={registerLayer}
          data-depth="0.02"
          className="hero-bg hero-plx absolute inset-0 opacity-50"
        >
          <img
            src={SITE_HERO_IMAGE}
            alt={SITE_HERO_ALT}
            className="hero-blur-in h-full w-full object-cover object-center"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Voiles de lisibilité : le texte reste lisible sur toute image. */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-650 via-brand-650/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-650 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent,rgba(15,33,30,0.4)_50%,rgba(15,33,30,0.9))]" />

        <div
          ref={registerLayer}
          data-depth="0.03"
          className="hero-grid hero-plx absolute inset-0 opacity-30"
        />
        <div
          ref={registerLayer}
          data-depth="0.05"
          className="hero-topo hero-plx absolute inset-0 opacity-40"
        />

        <GeodeticLayer />
        <HudCrosshair />
        <ParticleField />
        <InfiniteRings />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 py-12 text-center md:px-8 md:py-16">
        <div
          ref={registerLayer}
          data-depth="0.03"
          className="hero-plx flex flex-col items-center"
        >
          <span
            style={{ '--hero-step': '1' } as CssVars}
            className="hero-reveal mb-6 inline-flex items-center gap-1.5 rounded-full border border-sage-400/40 bg-white/10 px-3 py-1 text-small font-medium text-sage-100 backdrop-blur-md"
          >
            <MapPin className="size-3.5" />
            Université de Fianarantsoa, Madagascar
          </span>

          <h1
            aria-label={title}
            className="mb-5 flex flex-wrap justify-center text-display text-sage-400"
          >
            {titleWords.map((word, index) => (
              <span key={`${word}-${index}`} className="hero-title-mask" aria-hidden="true">
                <span
                  className="hero-title-line"
                  style={{ '--hero-step': String(index + 2) } as CssVars}
                >
                  {word}
                </span>
              </span>
            ))}
          </h1>

          {description && (
            <p
              style={{ '--hero-step': String(titleWords.length + 2) } as CssVars}
              className="hero-reveal mb-9 max-w-[42rem] text-body-lg text-white/85"
            >
              {description}
            </p>
          )}

          {/* CTA : action principale puis action secondaire (§14). */}
          <div
            style={{ '--hero-step': String(titleWords.length + 3) } as CssVars}
            className="hero-reveal flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row"
          >
            <Link
              to="/formations"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-sage-400 px-6 text-small font-semibold text-brand-950 shadow-lg transition-colors duration-200 hover:bg-sage-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-200 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-950 motion-reduce:transition-none sm:w-auto"
            >
              Découvrir nos formations
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 text-small font-semibold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 motion-reduce:transition-none sm:w-auto"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </div>

      {/* Fondu bas : transition douce vers la section suivante */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 h-32 w-full bg-gradient-to-t from-brand-650 to-transparent" />

      <a
        href="#contenu"
        className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-white/60 transition-colors hover:text-white"
        aria-label="Défiler vers le contenu"
      >
        <span className="font-tech text-tech uppercase">
          Découvrir
        </span>
        <ArrowDown className="hero-scroll-cue size-4" />
      </a>
    </section>
  );
};

export default HeroSection;
