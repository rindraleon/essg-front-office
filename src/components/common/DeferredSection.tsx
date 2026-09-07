import { Suspense, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

interface DeferredSectionProps {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
}

const SectionPlaceholder = ({ minHeight }: { minHeight: number }) => (
  <div
    aria-hidden="true"
    className="flex items-start justify-center bg-gradient-to-b from-brand-50/30 to-white pt-20"
    style={{ minHeight }}
  >
    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-brand-100">
      <div className="h-full w-1/2 animate-pulse rounded-full bg-brand-400 motion-reduce:animate-none" />
    </div>
  </div>
);

const DeferredSection = ({
  children,
  minHeight = 480,
  rootMargin = '700px 0px',
}: DeferredSectionProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  const [reservedHeight, setReservedHeight] = useState<number | undefined>(minHeight);

  useEffect(() => {
    const element = wrapperRef.current;
    if (!element || shouldRender) return;
    if (typeof IntersectionObserver === 'undefined') {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin, threshold: 0.01 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  useLayoutEffect(() => {
    if (!shouldRender) return;
    const element = wrapperRef.current;
    if (!element) return;

    let rafId = 0;
    let observer: ResizeObserver | null = null;

    const sync = () => {
      const height = element.scrollHeight;
      if (height <= 1) {
        setReservedHeight(0);
      }
    };

    rafId = requestAnimationFrame(sync);

    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        const height = element.scrollHeight;
        if (height <= 1) {
          setReservedHeight(0);
          return;
        }

        setReservedHeight(undefined);
      });
      observer.observe(element);
    }

    const safetyTimer = window.setTimeout(() => {
      setReservedHeight((prev) => (prev === 0 ? 0 : undefined));
    }, 5000);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(safetyTimer);
      observer?.disconnect();
    };
  }, [shouldRender]);

  const style: React.CSSProperties = (() => {
    if (reservedHeight === 0) {
      return { minHeight: 0, height: 0, overflow: 'hidden' };
    }
    if (reservedHeight !== undefined) {
      return { minHeight: reservedHeight };
    }
    return {};
  })();

  return (
    <div ref={wrapperRef} style={style}>
      {shouldRender ? (
        <Suspense fallback={<SectionPlaceholder minHeight={minHeight} />}>{children}</Suspense>
      ) : (
        <SectionPlaceholder minHeight={minHeight} />
      )}
    </div>
  );
};

export default DeferredSection;
