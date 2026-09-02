import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib';

const SHOW_AFTER = 480;

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame: number | null = null;

    const update = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        frame = null;
        setVisible(window.scrollY > SHOW_AFTER);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      aria-label="Retour en haut"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-5 right-5 z-40 grid size-11 place-items-center rounded-full',
        'border border-brand-200 bg-white text-brand-700 shadow-elevated',
        'transition-[opacity,transform,background-color,color] duration-(--duration-hover) ease-out',
        'hover:bg-brand-600 hover:text-white focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-brand-500 focus-visible:ring-offset-2 motion-reduce:transition-none',
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      )}
      tabIndex={visible ? 0 : -1}
    >
      <ArrowUp className="size-5" aria-hidden="true" />
    </button>
  );
};

export default BackToTop;
