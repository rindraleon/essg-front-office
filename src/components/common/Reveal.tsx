import { type ReactNode } from 'react';
import useGsapReveal from '../../hooks/useGsapReveal';
import { cn } from '@/lib/utils';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delayMs?: number;
}

const Reveal = ({ children, className, delayMs = 0 }: RevealProps) => {
  const ref = useGsapReveal<HTMLDivElement>({ y: 28 });

  return (
    <div
      ref={ref}
      data-gsap
      className={cn(className)}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default Reveal;
