import { gsap, isCompactViewport, motion, prefersReducedMotion } from '../lib/gsap';

export function revealFrom(kind: string | null | undefined) {
  const compact = isCompactViewport();
  switch (kind) {
    case 'left':
      return { opacity: 0, x: compact ? -14 : -28, y: 0, scale: 1 };
    case 'right':
      return { opacity: 0, x: compact ? 14 : 28, y: 0, scale: 1 };
    case 'scale':
      return { opacity: 0, x: 0, y: 12, scale: 0.97 };
    case 'image':
      return { opacity: 0, x: 0, y: 0, scale: 1.08 };
    default:
      return { opacity: 0, x: 0, y: motion.offset(), scale: 1 };
  }
}

export function playIntro(targets: {
  header?: Element | null;
  logo?: Element | null;
  nav?: Element[];
  actions?: Element | null;
}): gsap.core.Timeline | null {
  if (prefersReducedMotion()) return null;

  const timeline = gsap.timeline({ defaults: { ease: motion.easeSoft } });
  if (targets.header) {
    timeline.fromTo(targets.header, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, 0);
  }
  if (targets.logo) {
    timeline.fromTo(targets.logo, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.08);
  }
  if (targets.nav && targets.nav.length > 0) {
    timeline.fromTo(
      targets.nav,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.04 },
      0.16,
    );
  }
  if (targets.actions) {
    timeline.fromTo(targets.actions, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.35 }, 0.24);
  }
  return timeline;
}

export function floatOrbs(orbs: Element[]): void {
  if (prefersReducedMotion() || orbs.length === 0) return;
  const amplitude = isCompactViewport() ? 10 : 18;
  orbs.forEach((orb, index) => {
    gsap.to(orb, {
      y: index % 2 === 0 ? -amplitude : amplitude,
      x: index % 2 === 0 ? amplitude * 0.5 : -amplitude * 0.45,
      duration: 7 + index * 1.4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
  });
}

export function kenBurns(media: Element | null): void {
  if (!media || prefersReducedMotion() || isCompactViewport()) return;
  gsap.fromTo(
    media,
    { scale: 1.02, x: 0 },
    { scale: 1.08, x: 12, duration: 28, ease: 'sine.inOut', yoyo: true, repeat: -1 },
  );
}

export function clearMotion(target: gsap.TweenTarget): void {
  gsap.set(target, { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1 });
}
