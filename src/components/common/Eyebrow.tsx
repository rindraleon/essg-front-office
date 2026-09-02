import React from 'react';
import { cn } from '@/lib';

interface EyebrowProps {
  children: React.ReactNode;
  dark?: boolean;
  variant?: 'pill' | 'plain';
  icon?: React.ReactNode;
  className?: string;
}

const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  dark = false,
  variant = 'plain',
  icon,
  className,
}) => (
  <span
    className={cn(
      'inline-flex w-fit items-center gap-2 text-caption font-semibold uppercase tracking-[0.14em]',
      variant === 'pill' && 'rounded-full border px-3.5 py-1.5',
      variant === 'pill' &&
        (dark ? 'border-brand-300/30 bg-brand-400/10' : 'border-brand-200 bg-brand-50'),
      dark ? 'text-brand-200' : 'text-brand-700',
      className
    )}
  >
    {icon && <span className="shrink-0 [&_svg]:size-3.5">{icon}</span>}
    {children}
  </span>
);

export default Eyebrow;
