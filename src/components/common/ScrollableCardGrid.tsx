import { ChevronLeft, ChevronRight } from 'lucide-react';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '@/lib';

interface ScrollableCardGridProps {
  children: React.ReactNode;
  scrollAmount?: number;
  className?: string;
  ariaLabel?: string;
  controls?: React.ReactNode;
  toolbarStart?: React.ReactNode;
  resetKey?: string;
}

const ScrollableCardGrid: React.FC<ScrollableCardGridProps> = ({
  children,
  scrollAmount,
  className = '',
  ariaLabel = 'Liste défilante',
  controls,
  toolbarStart,
  resetKey,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  const checkScrollPosition = useCallback(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;

    setIsAtStart(scrollLeft <= 2);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 2);
    setIsScrollable(scrollWidth > clientWidth + 2);
  }, []);

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    checkScrollPosition();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', checkScrollPosition);
      return () => window.removeEventListener('resize', checkScrollPosition);
    }

    const observer = new ResizeObserver(checkScrollPosition);
    observer.observe(element);
    for (const child of Array.from(element.children)) observer.observe(child);
    return () => observer.disconnect();
  }, [children, checkScrollPosition]);

  useEffect(() => {
    if (resetKey === undefined) return;
    const element = scrollContainerRef.current;
    if (!element) return;
    element.scrollTo({ left: 0, behavior: 'auto' });
    const frame = window.requestAnimationFrame(checkScrollPosition);
    return () => window.cancelAnimationFrame(frame);
  }, [resetKey, checkScrollPosition]);

  const scroll = useCallback(
    (direction: 'left' | 'right') => {
      const element = scrollContainerRef.current;
      if (!element) return;

      const firstCard = element.firstElementChild as HTMLElement | null;
      const gap = Number.parseFloat(getComputedStyle(element).columnGap || '0') || 0;
      const oneCard = firstCard ? firstCard.offsetWidth + gap : element.clientWidth;

      const amount = scrollAmount ?? oneCard;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      element.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    },
    [scrollAmount]
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scroll('left');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      scroll('right');
    }
  };

  const arrowClass =
    'grid place-items-center rounded-full border border-ink-100 bg-white text-ink-700 shadow-card ' +
    'transition-[background-color,border-color,color,opacity] duration-(--duration-quick) ease-out ' +
    'hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 ' +
    'disabled:cursor-not-allowed disabled:opacity-0 motion-reduce:transition-none';

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-3 flex min-h-10 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {toolbarStart ? (
          <div className="min-w-0 text-small text-ink-500">{toolbarStart}</div>
        ) : (
          <span aria-hidden className="hidden sm:block" />
        )}

        <div className="flex min-h-10 items-center justify-end gap-2">
          {controls}
          <button
            type="button"
            onClick={() => scroll('left')}
            disabled={!isScrollable || isAtStart}
            aria-label="Défiler vers la gauche"
            className={cn(arrowClass, 'size-10')}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            disabled={!isScrollable || isAtEnd}
            aria-label="Défiler vers la droite"
            className={cn(arrowClass, 'size-10')}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <section
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          onKeyDown={handleKeyDown}
          tabIndex={isScrollable ? 0 : -1}
          aria-label={ariaLabel}
          className={cn(
            'flex touch-pan-x overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth pb-4 motion-reduce:scroll-auto',
            'snap-x snap-proximity',
            '[-webkit-overflow-scrolling:touch]',
            'gap-4 sm:gap-5 lg:gap-6',
            'px-4 scroll-px-4 sm:px-0 sm:scroll-px-0',
            'scrollbar-hide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
            '[&>*]:shrink-0'
          )}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {children}
        </section>
      </div>
    </div>
  );
};

export default ScrollableCardGrid;
