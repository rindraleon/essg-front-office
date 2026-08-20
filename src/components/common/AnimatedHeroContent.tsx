import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

/**
 * Conteneur de contenu héro animé : les enfants apparaissent en cascade
 * (stagger) au chargement. À utiliser dans HeroSection / PageHero.
 */
export const AnimatedHeroContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={containerVariants} initial={reduce ? false : 'hidden'} animate="visible">
      {children}
    </motion.div>
  );
};

/**
 * Élément individuel du héros (badge, titre, description, CTA).
 */
export const AnimatedHeroItem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div variants={itemVariants} className="[&_*]:!duration-700">
      {children}
    </motion.div>
  );
};

/**
 * Background héro animé : léger zoom lent + dégradé qui se déplace
 * (parallax subtil). S'étend derrière le contenu.
 */
export const AnimatedHeroBackground: React.FC<{
  children: React.ReactNode;
  gradient?: string;
}> = ({ children, gradient }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.15, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        {children}
      </motion.div>
      {gradient && (
        <motion.div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: gradient, backgroundSize: '200% 200%' }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </div>
  );
};

export default AnimatedHeroContainer;
