import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface StaggerGridProps {
  children: React.ReactNode;
  className?: string;
  /** Espacement entre l'apparition des enfants (secondes) */
  stagger?: number;
}

/**
 * Grille de cartes animée en cascade (stagger).
 *
 * Les enfants apparaissent au scroll, l'un après l'autre, avec un léger
 * glissement vertical. Compatible `prefers-reduced-motion`.
 */
const StaggerGrid: React.FC<StaggerGridProps> = ({ children, className = '', stagger = 0.08 }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {React.Children.map(children, (child) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="h-full"
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StaggerGrid;
