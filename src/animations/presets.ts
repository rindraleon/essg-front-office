import { gsap, isCompactViewport, motion, prefersReducedMotion } from '@/lib';

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

export function floatOrbs(orbs: Element[]): void {
  if (prefersReducedMotion() || orbs.length === 0) return;
  const amplitude = isCompactViewport() ? 10 : 18;
  orbs.forEach((orb, index) => {
    gsap.to(orb, {
      y: index % 2 === 0 ? -amplitude : amplitude,
      x: index % 2 === 0 ? amplitude * 0.5 : -amplitude * 0.45,
      duration: 9 + index * 1.8,
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
    { scale: 1.08, x: 12, duration: 36, ease: 'sine.inOut', yoyo: true, repeat: -1 }
  );
}

export function clearMotion(target: gsap.TweenTarget): void {
  gsap.set(target, { clearProps: 'all', opacity: 1, x: 0, y: 0, scale: 1 });
}
