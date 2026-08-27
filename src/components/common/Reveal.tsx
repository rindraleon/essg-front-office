import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib';

export type AnimationType = 'fade-down' | 'fade-right' | 'fade-up' | 'fade-left' | 'fade-in' | 'scale-in';

interface RevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
  as?: React.ElementType;
}

const getInitialTransform = (animation: AnimationType) => {
  switch (animation) {
    case 'fade-down':
      return 'translate3d(0, -28px, 0)';
    case 'fade-up':
      return 'translate3d(0, 28px, 0)';
    case 'fade-right':
      return 'translate3d(-28px, 0, 0)';
    case 'fade-left':
      return 'translate3d(28px, 0, 0)';
    case 'scale-in':
      return 'scale(0.95)';
    case 'fade-in':
    default:
      return 'translate3d(0, 0, 0)';
  }
};

const Reveal: React.FC<RevealProps> = ({
  children,
  animation = 'fade-up',
  duration = 700,
  delay = 0,
  className,
  as: Tag = 'div',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={elementRef as never}
      className={cn('will-change-[opacity,transform]', className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(animation),
        transition: `opacity ${duration}ms var(--ease-reveal) ${delay}ms, transform ${duration}ms var(--ease-reveal) ${delay}ms`,
      }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
