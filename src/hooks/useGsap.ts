import { useEffect, useRef } from 'react';
import { gsap, registerGsap } from '../lib/gsap';

export default function useGsap<T extends HTMLElement>(
  animate: (context: typeof gsap, root: T) => void,
  deps: ReadonlyArray<unknown> = [],
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    registerGsap();
    const ctx = gsap.context(() => animate(gsap, root), root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
