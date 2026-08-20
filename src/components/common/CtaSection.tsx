import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import useGsapReveal from '../../hooks/useGsapReveal';
import AnimatedBackground from '../animations/AnimatedBackground';
import type { CtaSectionProps } from '../../types/common.types';

const CtaSection = ({
  icon,
  title,
  description,
  primaryLabel,
  primaryLink,
  primaryIsMailto = false,
  secondaryLabel,
  secondaryLink,
}: CtaSectionProps) => {
  const revealRef = useGsapReveal<HTMLElement>();

  return (
    <section ref={revealRef} data-surface="dark" className="relative overflow-hidden py-20 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-brand-700" />
      <AnimatedBackground variant="cta" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 text-center sm:px-6 lg:px-8">
        {icon && (
          <div data-gsap className="mb-5 flex justify-center">
            {icon}
          </div>
        )}
        <h2 data-gsap className="mb-4 text-h2 drop-shadow-sm text-balance">
          {title}
        </h2>
        {description && (
          <p data-gsap className="mx-auto mb-9 max-w-2xl text-h5 text-brand-100">
            {description}
          </p>
        )}
        <div data-gsap className="flex flex-col justify-center gap-4 sm:flex-row">
          {primaryIsMailto ? (
            <a href={`mailto:${primaryLink}`} className={cn(buttonVariants({ variant: 'inverted', size: 'lg' }))}>
              {primaryLabel}
              <ArrowRight className="size-4" />
            </a>
          ) : (
            <Link to={primaryLink} className={cn(buttonVariants({ variant: 'inverted', size: 'lg' }))}>
              {primaryLabel}
              <ArrowRight className="size-4" />
            </Link>
          )}
          {secondaryLabel && secondaryLink && (
            <Link
              to={secondaryLink}
              className={cn(buttonVariants({ variant: 'invertedOutline', size: 'lg' }))}
            >
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
