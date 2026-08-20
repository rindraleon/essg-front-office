import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function registerGsap(): void {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.7,
  });
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isCompactViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

export const motion = {
  ease: 'power3.out',
  easeSoft: 'power2.out',
  duration: 0.7,
  durationFast: 0.45,
  durationSlow: 0.95,
  stagger: 0.08,
  offset: () => (isCompactViewport() ? 16 : 28),
  offsetSmall: () => (isCompactViewport() ? 10 : 18),
};

export { gsap, ScrollTrigger };
