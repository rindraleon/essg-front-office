import type { ReactNode } from 'react';
import { cn } from '@/lib';
import RevealOnScroll from '../common/RevealOnScroll';

export type AboutSectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;

  centered?: boolean;
};

const AboutSection = ({
  eyebrow,
  title,
  description,
  children,
  className,
  headerClassName,
  centered = false,
}: AboutSectionProps) => (
  <section className={cn('section-y', className)}>
    <div className="section-shell">
      {(eyebrow || title || description) && (
        <RevealOnScroll
          className={cn('mb-12 max-w-2xl', centered && 'mx-auto text-center', headerClassName)}
        >
          {eyebrow && (
            <span className="text-caption font-semibold uppercase tracking-[0.14em] text-brand-700">
              {eyebrow}
            </span>
          )}
          {title && <h2 className="mt-3 text-h2 text-ink-950">{title}</h2>}
          {description && (
            <p className="mt-4 text-justified leading-7 text-ink-500">{description}</p>
          )}
        </RevealOnScroll>
      )}
      {children}
    </div>
  </section>
);

export default AboutSection;
