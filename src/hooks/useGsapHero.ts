import { useEffect, useRef } from 'react';
import { clearMotion, floatOrbs, kenBurns } from '@/animations';
import { gsap, isCompactViewport, motion, prefersReducedMotion, registerGsap } from '@/lib';

export default function useGsapHero<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();

    const media = root.querySelector<HTMLElement>('[data-hero="media"]');
    const shine = root.querySelector<HTMLElement>('[data-hero="shine"]');
    const titleWords = root.querySelectorAll<HTMLElement>('[data-split="word"]');
    const title = root.querySelector<HTMLElement>('[data-hero="title"]');
    const description = root.querySelector<HTMLElement>('[data-hero="description"]');
    const actions = root.querySelector<HTMLElement>('[data-hero="actions"]');
    const stats = root.querySelectorAll<HTMLElement>('[data-hero="stat"]');
    const orbs = root.querySelectorAll<HTMLElement>('[data-hero="orb"]');
    const particles = root.querySelectorAll<HTMLElement>('[data-bg="particle"]');
    const scrollCue = root.querySelector<HTMLElement>('[data-hero="scroll"]');
    const accent = root.querySelector<HTMLElement>('[data-hero="accent"]');

    if (prefersReducedMotion()) {
      clearMotion([
        media,
        shine,
        title,
        description,
        actions,
        accent,
        scrollCue,
        ...stats,
        ...titleWords,
      ]);
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: motion.ease } });
      const compact = isCompactViewport();

      if (media) {
        timeline.fromTo(
          media,
          { scale: 1.16, opacity: 0.35 },
          { scale: 1.02, opacity: 1, duration: 2.1, ease: 'power2.out' },
          0
        );
        kenBurns(media);
      }

      if (shine) {
        timeline.fromTo(
          shine,
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 0.5, duration: 2.3 },
          0.15
        );
        gsap.to(shine, {
          xPercent: 140,
          duration: 11,
          ease: 'sine.inOut',
          repeat: -1,
          repeatDelay: 6,
          delay: 2.4,
        });
      }

      if (titleWords.length > 0) {
        timeline.fromTo(
          titleWords,
          { opacity: 0, y: compact ? 16 : 32 },
          { opacity: 1, y: 0, duration: 0.88, stagger: 0.07 },
          0.28
        );
      } else if (title) {
        timeline.fromTo(title, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, 0.28);
      }

      if (accent) {
        timeline.fromTo(
          accent,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.72 },
          0.52
        );
      }

      if (description) {
        timeline.fromTo(
          description,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.72 },
          0.5
        );
      }
      if (actions) {
        timeline.fromTo(
          actions,
          { opacity: 0, y: 16, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.72 },
          0.64
        );
      }
      if (stats.length > 0) {
        timeline.fromTo(
          stats,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.62, stagger: 0.1 },
          0.72
        );
      }
      if (scrollCue) {
        timeline.fromTo(scrollCue, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9);
        gsap.to(scrollCue, {
          y: compact ? 6 : 10,
          duration: 1.8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }

      floatOrbs([...orbs]);

      if (particles.length > 0 && !compact) {
        particles.forEach((particle, index) => {
          gsap.to(particle, {
            y: index % 2 === 0 ? -14 : 16,
            x: index % 3 === 0 ? 8 : -6,
            opacity: 0.45,
            duration: 5.5 + (index % 5),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: index * 0.14,
          });
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return ref;
}
