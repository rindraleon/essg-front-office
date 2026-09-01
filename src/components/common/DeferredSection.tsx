import { Suspense, useEffect, useRef, useState, type ReactNode } from 'react';

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
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = ref.current;
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

  return (
    <div ref={ref} style={!shouldRender ? { minHeight } : undefined}>
      {shouldRender ? (
        <Suspense fallback={<SectionPlaceholder minHeight={minHeight} />}>{children}</Suspense>
      ) : (
        <SectionPlaceholder minHeight={minHeight} />
      )}
    </div>
  );
};

export default DeferredSection;
