import React from 'react';
import { cn } from '@/lib';

interface EyebrowProps {
  children: React.ReactNode;
  /** Surface sombre (Hero, bandeaux) : bascule sur la variante claire. */
  dark?: boolean;
  /** `pill` encadre le libellé, `plain` le laisse nu au-dessus du titre. */
  variant?: 'pill' | 'plain';
  icon?: React.ReactNode;
  className?: string;
}

/**
 * Surtitre de section.
 *
 * L'audit a relevé 15 déclinaisons manuscrites de ce même motif
 * (`text-caption font-semibold uppercase tracking-[0.14em] text-brand-700`),
 * avec des interlettrages et des couleurs légèrement différents d'une
 * page à l'autre. Ce composant en fixe la seule version autorisée.
 *
 * Il reste volontairement discret : jamais plus gros que le titre qu'il
 * introduit, jamais porteur de l'information principale.
 */
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
