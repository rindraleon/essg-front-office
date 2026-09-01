import { SITE_HERO_ALT, SITE_HERO_IMAGE } from '@/constants';
import useGsapHero from '@/hooks/useGsapHero';
import AnimatedBackground from '../animations/AnimatedBackground';
import ParticlesBackground from '../animations/ParticlesBackground';
import SplitTitle from '../animations/SplitTitle';
import AnimatedNumber from './AnimatedNumber';
import type { PageHeroProps } from '@/types';

const PageHero = ({
  image = SITE_HERO_IMAGE,
  imageAlt = SITE_HERO_ALT,
  title,
  description,
  stats = [],
  minHeight = '60vh',
}: PageHeroProps) => {
  const heroRef = useGsapHero<HTMLElement>();

  return (
    <section
      ref={heroRef}
      data-surface="dark"
      className="relative overflow-hidden bg-ink-950 text-white"
    >
      <img
        data-hero="media"
        src={image || SITE_HERO_IMAGE}
        alt={imageAlt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink-950/72 via-ink-950/40 to-ink-950/82"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_66%_60%_at_50%_50%,rgb(27_31_34_/_0.42)_0%,transparent_78%)]"
      />
      <div
        data-hero="shine"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/16 to-transparent blur-2xl will-change-transform"
      />
      <AnimatedBackground variant="hero" />
      <ParticlesBackground particleCount={85} />

      <div
        className="section-shell relative flex flex-col items-center justify-center section-y text-center"
        style={{ minHeight }}
      >
        <div className="mx-auto max-w-3xl">
          <SplitTitle
            data-hero="title"
            text={title}
            className="mb-3 text-display leading-tight drop-shadow-[0_2px_16px_rgba(27,31,34,0.4)]"
          />
          <div
            data-hero="accent"
            aria-hidden="true"
            className="mx-auto mb-5 h-1 w-20 origin-center rounded-full bg-brand-400 shadow-[0_0_16px_rgba(152,192,112,0.6)]"
          />

          {description && (
            <p
              data-hero="description"
              className="mx-auto max-w-[60ch] text-body-lg leading-relaxed text-ink-100"
            >
              {description}
            </p>
          )}
        </div>

        {stats.length > 0 && (
          <div
            className="mt-12 grid w-full max-w-3xl gap-4 lg:gap-6"
            style={{ gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, minmax(0, 1fr))` }}
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                data-hero="stat"
                className="rounded-2xl border border-white/18 bg-white/12 p-4 text-center shadow-lg backdrop-blur-md transition-transform duration-(--duration-hover) hover:border-brand-300/60 hover:bg-white/16 motion-reduce:transition-none"
              >
                {stat.icon && <div className="mb-2 flex justify-center">{stat.icon}</div>}
                <AnimatedNumber value={stat.value} className="block text-h3 font-bold text-white" />
                <div className="text-small text-brand-200">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
