import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Sparkles } from 'lucide-react';

import Reveal from '../common/Reveal';
import { SITE_HERO_ALT, SITE_HERO_IMAGE } from '@/constants';
import { cn } from '@/lib';
import { buttonVariants } from '../ui/button-variants';
import type { HeroSectionProps } from '@/types';

import ParticlesBackground from '../animations/ParticlesBackground';

const HeroSection: React.FC<HeroSectionProps> = ({
  title = 'École Supérieure des Sciences Géomatiques',
  primaryButton = { text: 'Explorer les formations', link: '/formations' },
  secondaryButton = { text: 'Déposer ma candidature', link: '/admission' },
}) => {
  return (
    <section
      data-surface="dark"
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center justify-center overflow-hidden bg-ink-950 section-y-tight text-white"
    >
      <img
        src={SITE_HERO_IMAGE}
        alt={SITE_HERO_ALT}
        className="hero-home-image absolute inset-0 -z-40 size-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-gradient-to-b from-ink-950/70 via-ink-950/34 to-ink-950/80"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_62%_58%_at_50%_50%,rgb(27_31_34_/_0.46)_0%,rgb(27_31_34_/_0.28)_55%,transparent_78%)]"
      />

      <ParticlesBackground particleCount={85} />

      {/* Trame géospatiale discrète */}
      <div className="hero-home-grid pointer-events-none absolute inset-0 -z-10 opacity-20" />

      <div className="section-shell relative z-10 flex w-full max-w-5xl flex-col items-center text-center">
        {/* Rattachement institutionnel */}
        <Reveal animation="fade-down" duration={700} delay={80}>
          <div className="mb-6 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-white/20 bg-ink-950/40 px-4 py-2 backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-brand-400" />
            </span>
            <span className="font-tech text-[0.72rem] font-semibold tracking-wider text-brand-200">
              Université de Fianarantsoa · Madagascar
            </span>
          </div>
        </Reveal>

        {/* Titre */}
        <Reveal animation="fade-down" duration={800} delay={180}>
          <h1 className="text-display text-balance text-white drop-shadow-[0_2px_12px_rgb(27_31_34_/_0.6)]">
            {title}
          </h1>
        </Reveal>

        {/* Slogan statique */}
        <Reveal animation="fade-up" duration={700} delay={320} className="w-full">
          <p className="mx-auto mt-6 max-w-3xl text-h2 font-medium text-ink-100">
            Formez les experts de demain!
          </p>
        </Reveal>

        {/* CTA */}
        <Reveal
          animation="fade-up"
          duration={600}
          delay={620}
          className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
        >
          <Link
            to={primaryButton.link}
            className={cn(
              buttonVariants({ variant: 'onDark', size: 'lg' }),
              'group w-full sm:w-auto'
            )}
          >
            <GraduationCap className="size-4.5" />
            <span>{primaryButton.text}</span>
            <ArrowRight className="size-4" />
          </Link>

          <Link
            to={secondaryButton.link}
            className={cn(
              buttonVariants({ variant: 'onDarkOutline', size: 'lg' }),
              'w-full sm:w-auto'
            )}
          >
            <Sparkles className="size-4 text-brand-300" />
            <span>{secondaryButton.text}</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
};

export default HeroSection;
