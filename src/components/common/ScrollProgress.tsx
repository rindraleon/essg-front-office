import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Barre de progression de défilement — affichée en haut du header.
 *
 * La largeur suit la progression de la page (useScroll) avec un ressort
 * doux (useSpring). Dégradé aux couleurs de la marque.
 */
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-1 origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #2e6a5f, #5ba092, #98c070, #2e6a5f)',
        backgroundSize: '200% 100%',
        boxShadow: '0 1px 6px rgba(46, 106, 95, 0.4)',
      }}
    />
  );
};

export default ScrollProgress;
