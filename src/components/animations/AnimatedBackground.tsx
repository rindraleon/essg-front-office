import { useMemo } from 'react';
import { cn } from '@/lib';

interface AnimatedBackgroundProps {
  variant?: 'hero' | 'section' | 'cta';
  className?: string;
}

const PARTICLES = Array.from({ length: 16 }, (_, index) => ({
  id: index,
  left: `${(index * 17 + 8) % 92}%`,
  top: `${(index * 23 + 11) % 84}%`,
  size: index % 3 === 0 ? 3 : 2,
  delay: index * 0.35,
}));

const AnimatedBackground = ({ variant = 'section', className }: AnimatedBackgroundProps) => {
  const particles = useMemo(
    () => (variant === 'hero' ? PARTICLES : PARTICLES.slice(0, 8)),
    [variant]
  );

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      <div
        data-bg="gradient"
        className={cn(
          'absolute inset-0 opacity-70',
          variant === 'cta'
            ? 'bg-[radial-gradient(circle_at_20%_20%,rgba(152,192,112,0.18),transparent_42%),radial-gradient(circle_at_80%_70%,rgba(120,164,78,0.16),transparent_40%)]'
            : 'bg-[radial-gradient(circle_at_15%_20%,rgba(152,192,112,0.16),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(120,164,78,0.14),transparent_38%)]'
        )}
      />
      <div
        data-hero="orb"
        className="absolute -left-24 top-10 h-72 w-72 rounded-full opacity-25 blur-3xl md:h-96 md:w-96"
        style={{ background: 'radial-gradient(closest-side, var(--color-brand-400), transparent)' }}
      />
      <div
        data-hero="orb"
        className="absolute -right-16 bottom-0 h-64 w-64 rounded-full opacity-20 blur-3xl md:h-80 md:w-80"
        style={{ background: 'radial-gradient(closest-side, var(--color-brand-500), transparent)' }}
      />
      <div className="hidden md:block">
        {particles.map((particle) => (
          <span
            key={particle.id}
            data-bg="particle"
            className="absolute rounded-full bg-white/40"
            style={{
              left: particle.left,
              top: particle.top,
              width: particle.size,
              height: particle.size,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
