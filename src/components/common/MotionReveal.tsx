import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type RevealDirection = 'up' | 'left' | 'right' | 'scale' | 'fade' | 'blur';

interface MotionRevealProps {
  children: React.ReactNode;
  /** Direction de la révélation */
  variant?: RevealDirection;
  /** Délai en secondes */
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
}

const hidden: Record<
  RevealDirection,
  { opacity: number; x?: number; y?: number; scale?: number; filter?: string }
> = {
  up: { opacity: 0, y: 32 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  scale: { opacity: 0, scale: 0.92 },
  fade: { opacity: 0 },
  blur: { opacity: 0, y: 12, filter: 'blur(8px)' },
};

/**
 * Révélation d'un bloc au scroll via framer-motion (whileInView).
 *
 * - Variantes : up / left / right / scale / fade / blur ;
 * - une seule animation, déléments respectés ;
 * - respecte prefers-reduced-motion (désactive transform/filter).
 */
const MotionReveal: React.FC<MotionRevealProps> = ({
  children,
  variant = 'up',
  delay = 0,
  className = '',
  as = 'div',
}) => {
  const reduce = useReducedMotion();
  const Component = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: reduce ? { opacity: 0 } : hidden[variant],
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
            delay,
          },
        },
      }}
    >
      {children}
    </Component>
  );
};

export default MotionReveal;
