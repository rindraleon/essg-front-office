import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib';

interface ParticlesBackgroundProps {
  className?: string;
  particleCount?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

/** Vert du logo ESSG (var(--color-brand-400)), seule couleur employée par le canvas. */
const PARTICLE_RGB = '152, 192, 112';
const LINK_DISTANCE = 120;

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  className,
  particleCount = 65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarseQuery = window.matchMedia('(max-width: 767px)');

    let width = 0;
    let height = 0;
    let animationFrameId: number | null = null;
    let visible = true;

    const random = () => {
      const values = new Uint32Array(1);
      return window.crypto.getRandomValues(values)[0] / (0xffffffff + 1);
    };

    /* Le coût du rendu est quadratique (chaque particule est reliée aux
       autres). On réduit donc la densité sur mobile, où la surface est
       petite et le budget CPU/batterie plus contraint. */
    const effectiveCount = coarseQuery.matches ? Math.round(particleCount * 0.45) : particleCount;

    const resize = () => {
      const parent = canvas.parentElement;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent?.offsetWidth || window.innerWidth;
      height = parent?.offsetHeight || window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const particles: Particle[] = Array.from({ length: effectiveCount }, () => ({
      x: random() * width,
      y: random() * height,
      vx: (random() - 0.5) * 0.6,
      vy: (random() - 0.5) * 0.6,
      radius: random() * 2 + 1,
      opacity: random() * 0.5 + 0.2,
    }));

    const paint = (advance: boolean) => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < LINK_DISTANCE) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${PARTICLE_RGB}, ${0.15 * (1 - dist / LINK_DISTANCE)})`;
            ctx.lineWidth = 0.75;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        if (advance) {
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_RGB}, ${p.opacity})`;
        ctx.fill();
      }
    };

    const loop = () => {
      paint(true);
      animationFrameId = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    /* Trois garde-fous : mouvement réduit demandé par l'utilisateur,
       Hero sorti du viewport, onglet en arrière-plan. Dans ces cas la
       boucle est arrêtée au lieu de tourner indéfiniment. */
    const sync = () => {
      const shouldAnimate = !motionQuery.matches && visible && !document.hidden;

      if (shouldAnimate) {
        if (animationFrameId === null) loop();
        return;
      }

      stop();
      paint(false);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const handleResize = () => {
      resize();
      if (animationFrameId === null) paint(false);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', sync);
    motionQuery.addEventListener('change', sync);

    sync();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', sync);
      motionQuery.removeEventListener('change', sync);
    };
  }, [particleCount]);

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 size-full" />
      {/* Halo d'ambiance discret — un seul, très diffus. */}
      <div className="absolute -left-20 top-1/4 size-96 rounded-full bg-brand-500/10 blur-3xl" />
    </div>
  );
};

export default ParticlesBackground;
