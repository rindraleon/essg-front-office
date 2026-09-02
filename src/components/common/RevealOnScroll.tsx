import React, { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib';

export type RevealVariant =
  | 'fade-up'
  | 'fade-up-sm'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-in'
  | 'blur-in'
  | 'fade'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'none';

interface VariantSpec {
  from: { transform?: string; filter?: string };
  duration: string;
}

function specFor(variant: RevealVariant, distance?: number): VariantSpec {
  const d = distance !== undefined ? `${distance}px` : 'var(--reveal-distance)';
  const dSm = distance !== undefined ? `${distance}px` : 'var(--reveal-distance-sm)';

  switch (variant) {
    case 'fade-up-sm':
      return {
        from: { transform: `translate3d(0, ${dSm}, 0)` },
        duration: '650ms',
      };

    case 'fade-down':
    case 'down':
      return {
        from: { transform: `translate3d(0, calc(-1 * ${d}), 0)` },
        duration: '850ms',
      };

    case 'fade-left':
    case 'left':
      return {
        from: { transform: `translate3d(calc(-1 * ${d}), 0, 0)` },
        duration: '850ms',
      };

    case 'fade-right':
    case 'right':
      return {
        from: { transform: `translate3d(${d}, 0, 0)` },
        duration: '850ms',
      };

    case 'scale-in':
      return {
        from: { transform: 'scale(0.96)' },
        duration: '900ms',
      };

    case 'blur-in':
      return {
        from: {
          filter: 'blur(8px)',
          transform: 'scale(1.02)',
        },
        duration: '1150ms',
      };

    case 'fade':
    case 'none':
      return {
        from: {},
        duration: 'var(--duration-reveal)',
      };

    default:
      return {
        from: { transform: `translate3d(0, ${d}, 0)` },
        duration: '900ms',
      };
  }
}

interface RevealOnScrollProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  direction?: RevealVariant;
  delay?: number;
  distance?: number;
  as?: React.ElementType;
  className?: string;
  repeat?: boolean;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  variant,
  direction,
  delay = 0,
  distance,
  as: Tag = 'div',
  className,
  repeat = false,
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [immediate, setImmediate] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setImmediate(true);
      setVisible(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setImmediate(true);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);

          if (!repeat) {
            observer.disconnect();
          }
        } else if (repeat) {
          setVisible(false);
        }
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.05,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [repeat]);

  const spec = specFor(variant ?? direction ?? 'fade-up', distance);

  const animated = ['opacity', spec.from.transform && 'transform', spec.from.filter && 'filter']
    .filter(Boolean)
    .join(', ');

  return (
    <Tag
      ref={ref as never}
      className={cn('will-change-[opacity,transform]', className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : spec.from.transform,
        filter: visible ? 'none' : spec.from.filter,
        transition: immediate
          ? 'none'
          : `${animated
              .split(', ')
              .map((prop) => `${prop} ${spec.duration} var(--ease-reveal) ${delay}ms`)
              .join(', ')}`,
      }}
    >
      {children}
    </Tag>
  );
};

interface StaggerProps {
  children: React.ReactNode;
  step?: number;
  initialDelay?: number;
  variant?: RevealVariant;
  direction?: RevealVariant;
  distance?: number;
  as?: React.ElementType;
  className?: string;
}

const DEFAULT_STEP = 90;
const DEFAULT_STEP_COMPACT = 60;

export const StaggerReveal: React.FC<StaggerProps> = ({
  children,
  step,
  initialDelay = 0,
  variant,
  direction,
  distance,
  as: Tag = 'div',
  className,
}) => {
  const items = React.Children.toArray(children);
  const uid = React.useId();
  let itemCounter = 0;

  const compact = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  const effectiveStep = step ?? (compact ? DEFAULT_STEP_COMPACT : DEFAULT_STEP);

  const MAX_TOTAL = 540;

  return (
    <Tag className={className}>
      {items.map((child) => {
        const itemKey =
          React.isValidElement(child) && child.key
            ? String(child.key)
            : `${uid}-item-${itemCounter++}`;

        const index = itemCounter - 1;

        return (
          <RevealOnScroll
            key={itemKey}
            variant={variant ?? direction}
            distance={distance}
            delay={initialDelay + Math.min(index * effectiveStep, MAX_TOTAL)}
          >
            {child}
          </RevealOnScroll>
        );
      })}
    </Tag>
  );
};

export default RevealOnScroll;
