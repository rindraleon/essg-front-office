import { useEffect, useMemo, useRef } from 'react';
import { SectionCta } from '../../components';
import RevealOnScroll from '../common/RevealOnScroll';
import PartnerChipCard from '../PartenaireComponents/PartnerChipCard';
import { usePartenaires } from '../../hooks';
import { gsap, prefersReducedMotion, registerGsap } from '../../lib/gsap';
import type { PartenairesSectionProps } from '../../types';
import type { PartenaireItem } from '../../types/partenaire.types';

const SECTION_CTA = { label: 'Voir tous nos partenaires', link: '/partenaires' } as const;

/**
 * Durées de parcours (§7.7, §7.14).
 *
 * L'écart entre les deux lignes est délibérément faible : des vitesses trop
 * différentes se lisent comme deux rubans indépendants, alors qu'un léger
 * décalage donne l'impression d'un même flux vu en perspective.
 */
const DUREE_LIGNE_1 = 32;
const DUREE_LIGNE_2 = 38;

/**
 * Amplitude de l'ondulation verticale (§7.7).
 *
 * 3 px : la ligne « respire » sans que le déplacement soit identifiable
 * comme tel. Au-delà, les cartes semblent flotter et le regard décroche.
 * Aucune rotation — le cahier l'exclut explicitement pour les cartes.
 */
const ONDULATION_PX = 3;

interface MarqueeRowProps {
  partenaires: PartenaireItem[];
  /** `-1` défile vers la gauche, `1` vers la droite. */
  direction: -1 | 1;
  durationSeconds: number;
}

/**
 * Une ligne de défilement continu.
 *
 * La liste est triplée puis animée sur exactement un tiers de sa largeur :
 * au terme du cycle, la position coïncide avec l'état initial, ce qui rend
 * la boucle invisible — pas de saut au retour au début.
 *
 * L'animation porte sur `xPercent` (donc `transform`), composé par le GPU.
 */
const MarqueeRow = ({ partenaires, direction, durationSeconds }: MarqueeRowProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const boucle = useMemo(
    () => [...partenaires, ...partenaires, ...partenaires],
    [partenaires],
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || partenaires.length === 0) return;

    // Mouvement réduit : la ligne reste lisible, simplement immobile.
    if (prefersReducedMotion()) return;

    registerGsap();

    // Départ décalé pour le sens inverse : sans cela, la ligne partirait
    // d'un vide à gauche avant que le contenu ne la rejoigne.
    const depart = direction === 1 ? -33.333 : 0;
    const arrivee = direction === 1 ? 0 : -33.333;

    gsap.set(track, { xPercent: depart });

    // Défilement principal : `linear`, seule courbe acceptable pour un
    // mouvement continu (§7.15) — toute autre produirait des à-coups
    // à chaque répétition.
    const tween = gsap.to(track, {
      xPercent: arrivee,
      duration: durationSeconds,
      ease: 'none',
      repeat: -1,
    });

    /*
      Ondulation verticale (§7.7) : très légère, de période volontairement
      différente de celle du défilement. Les deux mouvements ne se
      resynchronisent donc jamais, ce qui évite l'impression de boucle
      mécanique et donne la sensation de « flux ».

      Elle est portée par un tween distinct : GSAP compose les deux dans
      un unique `transform`, il n'y a donc pas de couche supplémentaire.
    */
    const ondulation = gsap.to(track, {
      y: direction === 1 ? ONDULATION_PX : -ONDULATION_PX,
      duration: durationSeconds / 5.5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // Pause au survol : laisse le temps de lire et de cliquer.
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

/**
 * Section « Nos partenaires » : deux lignes défilant en sens opposés.
 *
 * Les directions et les vitesses divergentes évitent la sensation mécanique
 * d'un ruban unique, et donnent une impression de profondeur.
 */
const PartenairesSection = ({
  title = 'Nos Partenaires',
  description = 'Des collaborations prestigieuses au niveau mondial',
  maxItems = 12,
  partenaires: propPartenaires,
}: PartenairesSectionProps) => {
  const { partenaires: fetched, loading: queryLoading } = usePartenaires();

  const partenaires =
    propPartenaires && propPartenaires.length > 0 ? propPartenaires : fetched;
  const loading = propPartenaires && propPartenaires.length > 0 ? false : queryLoading;

  const visibles = useMemo(
    () => partenaires.slice(0, maxItems),
    [partenaires, maxItems],
  );

  /**
   * Répartition en deux lignes.
   *
   * L'alternance pair/impair mélange les partenaires plutôt que de couper la
   * liste en deux blocs : les logos voisins ne défilent pas ensemble, ce qui
   * rend le mouvement plus organique.
   */
  const { ligne1, ligne2 } = useMemo(() => {
    if (visibles.length <= 3) return { ligne1: visibles, ligne2: [] as PartenaireItem[] };
    return {
      ligne1: visibles.filter((_, index) => index % 2 === 0),
      ligne2: visibles.filter((_, index) => index % 2 === 1),
    };
  }, [visibles]);

  /** Squelette, état vide ou ruban : rendu isolé pour éviter un ternaire imbriqué. */
  const renderContenu = () => {
    if (loading) {
      // Même hauteur que les cartes réelles : aucun saut de mise en page.
      return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
        {/*
          Dégradés latéraux : les cartes s'estompent aux bords au lieu d'être
          tranchées net, ce qui suggère la continuité du ruban.
        */}
        <div className="relative space-y-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink-50 to-transparent sm:w-28"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink-50 to-transparent sm:w-28"
          />

          <MarqueeRow partenaires={ligne1} direction={-1} durationSeconds={DUREE_LIGNE_1} />

          {ligne2.length > 0 && (
            <MarqueeRow partenaires={ligne2} direction={1} durationSeconds={DUREE_LIGNE_2} />
          )}
        </div>
      </RevealOnScroll>
    );
  };

  return (
    <section className="overflow-hidden bg-ink-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <RevealOnScroll className="mb-12 text-center">
          <h2 className="text-h2 text-ink-900">{title}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-body-lg text-ink-500">{description}</p>
        </RevealOnScroll>
      </div>

      {renderContenu()}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionCta label={SECTION_CTA.label} link={SECTION_CTA.link} />
      </div>
    </section>
  );
};

export default PartenairesSection;
