import { SITE_HERO_ALT, SITE_HERO_IMAGE } from '../../constants/media';
import useGsapHero from '../../hooks/useGsapHero';
import AnimatedBackground from '../animations/AnimatedBackground';
import SplitTitle from '../animations/SplitTitle';
import type { PageHeroProps } from '../../types/common.types';

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
    <section ref={heroRef} data-surface="dark" className="relative overflow-hidden bg-brand-950 text-white">
      <img
        data-hero="media"
        src={image || SITE_HERO_IMAGE}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover object-center will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-950/30 via-brand-950/28 to-brand-950/72" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,33,30,0.12)_0%,rgba(15,33,30,0.42)_80%)]" />
      <div
        data-hero="shine"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/16 to-transparent blur-2xl will-change-transform"
      />
      <AnimatedBackground variant="hero" />

      <div
        className="relative mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 sm:py-28 lg:px-8"
        style={{ minHeight }}
      >
        <div className="mx-auto max-w-3xl">
          <SplitTitle
            data-hero="title"
            text={title}
            className="mb-3 text-display leading-tight drop-shadow-[0_2px_16px_rgba(15,33,30,0.4)]"
          />
          <div
            data-hero="accent"
            aria-hidden="true"
            className="mx-auto mb-5 h-1 w-20 origin-center rounded-full bg-sage-400 shadow-[0_0_16px_rgba(152,192,112,0.6)]"
          />

          {description && (
            <p
              data-hero="description"
              className="mx-auto max-w-[60ch] text-body-lg leading-relaxed text-white/92"
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
                className="rounded-2xl border border-white/18 bg-white/12 p-4 text-center shadow-lg backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
              >
                {stat.icon && <div className="mb-2 flex justify-center">{stat.icon}</div>}
                <div className="text-h3 font-bold text-white">{stat.value}</div>
                <div className="text-small text-sage-100">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PageHero;
