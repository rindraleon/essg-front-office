import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Award, Briefcase, Globe2, Lightbulb, Network } from 'lucide-react';
import campusHero from '@/assets/files/images/background/Hero.webp';
import SectionHeader from '../common/SectionHeader';
import { RevealOnScroll } from '../common/RevealOnScroll';

const ChevronLeftIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

interface ValueItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}

const VALUES: ValueItem[] = [
  {
    icon: <Award className="size-7" />,
    title: 'Excellence',
    description:
      'Rechercher la qualité et la performance dans la formation et la pratique professionnelle.',
    tag: 'Rigueur & Qualité',
  },
  {
    icon: <Briefcase className="size-7" />,
    title: 'Professionnalisation',
    description:
      'Développer des compétences directement adaptées aux exigences du monde du travail.',
    tag: 'Pratique & Emploi',
  },
  {
    icon: <Globe2 className="size-7" />,
    title: 'Engagement',
    description: 'Contribuer activement au développement durable et à l’évolution des territoires.',
    tag: 'Impact Durable',
  },
  {
    icon: <Lightbulb className="size-7" />,
    title: 'Innovation',
    description:
      'Encourager l’utilisation des nouvelles technologies et des approches modernes de la géomatique.',
    tag: 'High-Tech & Spatial',
  },
  {
    icon: <Network className="size-7" />,
    title: 'Pluridisciplinarité',
    description:
      'Associer la géomatique à différents domaines pour répondre à des problématiques complexes.',
    tag: 'Synergie & Analyse',
  },
];

type CoverFlowStyle = {
  transform: string;
  opacity: number;
  zIndex: number;
  filter: string;
  isCenter: boolean;
};

function getCoverFlowStyle(offset: number, total: number): CoverFlowStyle {
  if (offset === 0) {
    return {
      transform: 'translateX(0px) scale(1) rotateY(0deg)',
      opacity: 1,
      zIndex: 30,
      filter: 'brightness(1)',
      isCenter: true,
    };
  }
  if (offset === 1) {
    return {
      transform: 'translateX(285px) scale(0.84) rotateY(-24deg)',
      opacity: 0.72,
      zIndex: 20,
      filter: 'brightness(0.96) saturate(0.9)',
      isCenter: false,
    };
  }
  if (offset === total - 1) {
    return {
      transform: 'translateX(-285px) scale(0.84) rotateY(24deg)',
      opacity: 0.72,
      zIndex: 20,
      filter: 'brightness(0.96) saturate(0.9)',
      isCenter: false,
    };
  }
  if (offset === 2) {
    return {
      transform: 'translateX(510px) scale(0.68) rotateY(-38deg)',
      opacity: 0.38,
      zIndex: 10,
      filter: 'brightness(0.9) blur(0.6px)',
      isCenter: false,
    };
  }
  if (offset === total - 2) {
    return {
      transform: 'translateX(-510px) scale(0.68) rotateY(38deg)',
      opacity: 0.38,
      zIndex: 10,
      filter: 'brightness(0.9) blur(0.6px)',
      isCenter: false,
    };
  }
  return {
    transform: 'translateX(0px) scale(0.4) rotateY(0deg)',
    opacity: 0,
    zIndex: 0,
    filter: 'brightness(0.92) blur(1.5px)',
    isCenter: false,
  };
}

const ValuesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const total = VALUES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = useCallback(
    (idx: number) => {
      setCurrentIndex(idx % total);
    },
    [total]
  );

  useEffect(() => {
    if (isHovered || total <= 1) return;
    const interval = setInterval(nextSlide, 3800);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide, total]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 45) {
      if (diff < 0) nextSlide();
      else prevSlide();
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden select-none section-y-tight"
      style={{
        backgroundColor: 'var(--color-ink-50)',
        color: 'var(--color-ink-900)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Nos valeurs"
    >
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_50%_50%,var(--color-brand-700)_1px,transparent_1px)] [background-size:24px_24px]" />
        <img
          src={campusHero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            filter: 'brightness(1.08) blur(28px)',
            opacity: 0.07,
            transform: 'scale(1.12)',
            transition: 'opacity 1000ms ease',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 38%, rgba(152,192,112,0.16) 0%, transparent 56%), radial-gradient(circle at 80% 90%, rgba(152,192,112,0.08) 0%, transparent 60%)',
          }}
        />
      </div>

      <div className="section-shell relative z-10 flex flex-col">
        <RevealOnScroll variant="fade-up">
          <SectionHeader
            eyebrow="Principes Directeurs"
            title="Nos valeurs"
            description="L’ESSG fonde sa formation et son accompagnement sur des valeurs essentielles qui guident nos étudiants et enseignants au quotidien."
          />
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={100}>
          <div
            className="relative w-full h-[380px] flex justify-center items-center mt-2"
            style={{ perspective: '1400px' }}
          >
            {VALUES.map((val, idx) => {
              const offset = (idx - currentIndex + total) % total;
              const { transform, opacity, zIndex, filter, isCenter } = getCoverFlowStyle(
                offset,
                total
              );

              return (
                <button
                  key={val.title}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-label={isCenter ? `${val.title}, carte active` : `Voir ${val.title}`}
                  aria-current={isCenter ? 'true' : undefined}
                  style={{
                    position: 'absolute',
                    width: '310px',
                    height: '340px',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: `1px solid ${isCenter ? 'var(--color-brand-200)' : 'var(--color-ink-100)'}`,
                    transform,
                    opacity,
                    zIndex,
                    filter,
                    transformOrigin: 'center center',
                    transition: 'all 800ms cubic-bezier(0.25, 1, 0.5, 1)',
                    boxShadow: isCenter
                      ? 'var(--shadow-card-hover), 0 0 0 1px rgba(152,192,112,0.08)'
                      : 'var(--shadow-card)',
                    cursor: isCenter ? 'default' : 'pointer',
                    padding: 0,
                    font: 'inherit',
                    textAlign: 'center' as const,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'radial-gradient(circle at 50% 0%, rgba(152,192,112,0.14) 0%, transparent 62%), radial-gradient(circle at 85% 88%, rgba(152,192,112,0.06) 0%, transparent 55%)',
                      zIndex: 1,
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute pointer-events-none"
                    style={{
                      width: '220px',
                      height: '220px',
                      left: '50%',
                      top: '27%',
                      transform: 'translate(-50%, -50%)',
                      background:
                        'radial-gradient(circle, rgba(152,192,112,0.18) 0%, transparent 72%)',
                      filter: 'blur(18px)',
                      zIndex: 1,
                    }}
                  />

                  <span
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      padding: '16px 16px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      textAlign: 'center',
                      zIndex: 2,
                      opacity: isCenter ? 1 : 0,
                      transform: isCenter ? 'translateY(0px)' : 'translateY(10px)',
                      transition: 'opacity 520ms ease, transform 520ms ease',
                      pointerEvents: isCenter ? 'auto' : 'none',
                    }}
                  >
                    <span style={{ textAlign: 'right', width: '100%', paddingRight: '2px' }}>
                      <span
                        className="font-tech uppercase"
                        style={{
                          display: 'inline-block',
                          fontSize: '0.66rem',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          color: 'var(--color-brand-700)',
                          background: 'var(--color-brand-50)',
                          border: '1px solid var(--color-brand-100)',
                          padding: '4px 9px',
                          borderRadius: '9999px',
                        }}
                      >
                        {val.tag}
                      </span>
                    </span>

                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '3px',
                        marginTop: 'auto',
                        paddingBottom: '2px',
                      }}
                    >
                      <span
                        className="grid place-items-center"
                        style={{
                          width: '66px',
                          height: '66px',
                          borderRadius: '9999px',
                          background: 'var(--color-brand-50)',
                          border: '1px solid var(--color-brand-200)',
                          color: 'var(--color-brand-600)',
                          boxShadow: '0 8px 24px rgba(27,31,34,0.06)',
                          marginBottom: '10px',
                        }}
                        aria-hidden="true"
                      >
                        {val.icon}
                      </span>

                      <span
                        className="font-display uppercase"
                        style={{
                          fontSize: '1.28rem',
                          fontWeight: 800,
                          letterSpacing: '-0.015em',
                          color: 'var(--color-ink-900)',
                          margin: 0,
                          lineHeight: 1.15,
                          textWrap: 'balance',
                          display: 'block',
                        }}
                      >
                        {val.title}
                      </span>

                      <span
                        aria-hidden="true"
                        style={{
                          width: '34px',
                          height: '2px',
                          backgroundColor: 'var(--color-brand-400)',
                          borderRadius: '2px',
                          margin: '6px auto 6px',
                          display: 'block',
                        }}
                      />

                      <span
                        className="text-small"
                        style={{
                          color: 'var(--color-ink-600)',
                          maxWidth: '280px',
                          margin: 0,
                          lineHeight: 1.5,
                          textWrap: 'pretty',
                          display: 'block',
                        }}
                      >
                        {val.description}
                      </span>

                      <span
                        className="flex items-center justify-between w-full"
                        style={{
                          marginTop: '12px',
                          paddingTop: '10px',
                          borderTop: '1px solid var(--color-ink-100)',
                          width: '100%',
                        }}
                      >
                        <span
                          className="font-tech"
                          style={{
                            fontSize: '0.66rem',
                            letterSpacing: '0.08em',
                            color: 'var(--color-ink-400)',
                            fontWeight: 700,
                          }}
                        >
                          0{idx + 1} / 05
                        </span>
                        <span
                          aria-hidden="true"
                          style={{
                            height: '2px',
                            width: isCenter ? '72px' : '36px',
                            borderRadius: '9999px',
                            background: isCenter
                              ? 'var(--color-brand-500)'
                              : 'var(--color-ink-200)',
                            transition: 'all 600ms cubic-bezier(0.25,1,0.5,1)',
                            display: 'block',
                          }}
                        />
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </RevealOnScroll>

        <RevealOnScroll variant="fade-up" delay={180}>
          <div
            role="tablist"
            aria-label="Pagination des valeurs"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              zIndex: 30,
              marginTop: '8px',
            }}
          >
            {VALUES.map((val, idx) => (
              <button
                key={val.title}
                type="button"
                onClick={() => goToSlide(idx)}
                role="tab"
                aria-selected={idx === currentIndex}
                aria-label={`Aller à ${val.title}`}
                style={{
                  height: '8px',
                  width: idx === currentIndex ? '28px' : '8px',
                  borderRadius: '9999px',
                  backgroundColor:
                    idx === currentIndex ? 'var(--color-brand-600)' : 'var(--color-ink-200)',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: idx === currentIndex ? '0 0 0 4px rgba(152,192,112,0.18)' : 'none',
                  transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>
        </RevealOnScroll>

        <button
          type="button"
          onClick={prevSlide}
          aria-label="Valeur précédente"
          className="hidden sm:flex"
          style={{
            position: 'absolute',
            left: '12px',
            top: '55%',
            transform: 'translateY(-50%)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.92)',
            border: '1px solid var(--color-ink-200)',
            color: 'var(--color-ink-700)',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-soft)',
            zIndex: 40,
            transition: 'all 200ms ease',
          }}
        >
          <ChevronLeftIcon />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Valeur suivante"
          className="hidden sm:flex"
          style={{
            position: 'absolute',
            right: '12px',
            top: '55%',
            transform: 'translateY(-50%)',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.92)',
            border: '1px solid var(--color-ink-200)',
            color: 'var(--color-ink-700)',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-soft)',
            zIndex: 40,
            transition: 'all 200ms ease',
          }}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
};

export default ValuesSection;
