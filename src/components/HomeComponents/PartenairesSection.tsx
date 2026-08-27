import { useEffect, useMemo, useRef } from 'react';
import SectionCta from '../common/SectionCta';
import SectionHeader from '../common/SectionHeader';
import RevealOnScroll from '../common/RevealOnScroll';
import PartnerChipCard from '../PartenaireComponents/PartnerChipCard';
import { usePartenaires } from '@/hooks';
import { gsap, prefersReducedMotion, registerGsap } from '@/lib';
import type { PartenairesSectionProps , PartenaireItem } from '@/types';

const SECTION_CTA = { label: 'Voir tous nos partenaires', link: '/partenaires' } as const;

const DUREE_LIGNE_1 = 32;
const DUREE_LIGNE_2 = 38;

const ONDULATION_PX = 3;

interface MarqueeRowProps {
  partenaires: PartenaireItem[];
  direction: -1 | 1;
  durationSeconds: number;
}

const MarqueeRow = ({ partenaires, direction, durationSeconds }: MarqueeRowProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const boucle = useMemo(() => [...partenaires, ...partenaires, ...partenaires], [partenaires]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || partenaires.length === 0) return;

    if (prefersReducedMotion()) return;

    registerGsap();

    const depart = direction === 1 ? -33.333 : 0;
    const arrivee = direction === 1 ? 0 : -33.333;

    gsap.set(track, { xPercent: depart });

    const tween = gsap.to(track, {
      xPercent: arrivee,
      duration: durationSeconds,
      ease: 'none',
      repeat: -1,
    });

    const ondulation = gsap.to(track, {
      y: direction === 1 ? ONDULATION_PX : -ONDULATION_PX,
      duration: durationSeconds / 5.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    const pause = () => {
      tween.pause();
      ondulation.pause();
    };
    const reprise = () => {
      tween.play();
      ondulation.play();
    };
    track.addEventListener('mouseenter', pause);
    track.addEventListener('mouseleave', reprise);
    track.addEventListener('focusin', pause);
    track.addEventListener('focusout', reprise);

    return () => {
      track.removeEventListener('mouseenter', pause);
      track.removeEventListener('mouseleave', reprise);
      track.removeEventListener('focusin', pause);
      track.removeEventListener('focusout', reprise);
      tween.kill();
      ondulation.kill();
    };
  }, [partenaires.length, direction, durationSeconds]);

  return (
    <div ref={trackRef} className="flex w-max gap-4 will-change-transform">
      {boucle.map((partenaire, index) => (
        <PartnerChipCard key={`${partenaire.id}-${index}`} partenaire={partenaire} />
      ))}
    </div>
  );
};

const PartenairesSection = ({
  title = 'Nos Partenaires',
  description = 'Des collaborations prestigieuses au niveau mondial',
  maxItems = 12,
  partenaires: propPartenaires,
}: PartenairesSectionProps) => {
  const { partenaires: fetched, loading: queryLoading } = usePartenaires();

  const partenaires = propPartenaires && propPartenaires.length > 0 ? propPartenaires : fetched;
  const loading = propPartenaires && propPartenaires.length > 0 ? false : queryLoading;

  const visibles = useMemo(() => partenaires.slice(0, maxItems), [partenaires, maxItems]);

  const { ligne1, ligne2 } = useMemo(() => {
    if (visibles.length <= 3) return { ligne1: visibles, ligne2: [] as PartenaireItem[] };
    return {
      ligne1: visibles.filter((_, index) => index % 2 === 0),
      ligne2: visibles.filter((_, index) => index % 2 === 1),
    };
  }, [visibles]);

  const renderContenu = () => {
    if (loading) {
      return (
        <div className="section-shell">
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="skeleton-shimmer h-[4.75rem] w-[17rem] shrink-0 rounded-2xl sm:w-[19rem]"
              />
            ))}
          </div>
        </div>
      );
    }

    if (visibles.length === 0) {
      return (
        <p className="px-4 text-center text-body text-ink-400">
          Aucun partenaire à afficher pour le moment.
        </p>
      );
    }

    return (
      <RevealOnScroll delay={120}>
        <div className="relative space-y-4">
          <MarqueeRow partenaires={ligne1} direction={-1} durationSeconds={DUREE_LIGNE_1} />

          {ligne2.length > 0 && (
            <MarqueeRow partenaires={ligne2} direction={1} durationSeconds={DUREE_LIGNE_2} />
          )}
        </div>
      </RevealOnScroll>
    );
  };

  return (
    <section className="overflow-hidden bg-gradient-to-br from-ink-50 via-white to-brand-50/55 section-y">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Réseau & Coopérations"
          title={title}
          description={description}
        />
      </div>

      {renderContenu()}

      <div className="section-shell">
        <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
      </div>
    </section>
  );
};

export default PartenairesSection;
