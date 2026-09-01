import { useEffect, useRef } from 'react';
import { revealFrom } from '@/animations';
import { gsap, motion, prefersReducedMotion, registerGsap, ScrollTrigger } from '@/lib';

interface UseScrollAnimationOptions {
  start?: string;
  once?: boolean;
}

function revealBatch(batch: Element[]): void {
  gsap.to(batch, {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    duration: motion.duration,
    stagger: motion.stagger,
    overwrite: 'auto',
  });
  batch.forEach((element) => element.classList.add('is-visible'));
}

export default function useScrollAnimation<T extends HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const ref = useRef<T | null>(null);
  const { start = 'top 88%', once = true } = options;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    registerGsap();

    if (prefersReducedMotion()) {
      node.classList.add('is-visible');
      gsap.set([node, ...node.querySelectorAll('[data-gsap]')], {
        clearProps: 'all',
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const items = Array.from(node.querySelectorAll<HTMLElement>('[data-gsap]'));
      const targets = items.length > 0 ? items : [node];

      targets.forEach((target) => {
        const kind = target.dataset.gsap;
        gsap.set(target, revealFrom(kind));
      });

      ScrollTrigger.batch(targets, {
        start,
        once,
        onEnter: revealBatch,
      });
    }, node);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [once, start]);

  return ref;
}
