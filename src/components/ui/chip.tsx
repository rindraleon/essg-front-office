import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';
import { cn } from '../../utils/utils';

const chipVariants = cva(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-medium whitespace-nowrap transition-colors',
  {
    variants: {
      variant: {
        default: 'border-brand-200 bg-brand-50 text-brand-700',
        sage: 'border-sage-200 bg-sage-50 text-sage-700',
        outline: 'border-ink-200 bg-white text-ink-700',
        secondary: 'border-ink-100 bg-ink-100 text-ink-600',
        white: 'border-white/30 bg-white/10 text-white',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

export interface ChipProps extends VariantProps<typeof chipVariants> {
  label?: React.ReactNode;
  icon?: React.ReactNode;
  onDelete?: () => void;
  size?: 'small' | 'medium';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Composant « chip » shadcn/ui — remplace le Chip MUI.
 * Accepte `onDelete` (affiche une croix), `icon` et les variantes de couleur.
 */
const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  onDelete,
  size = 'small',
  variant,
  className,
  style,
}) => {
  return (
    <span
      className={cn(chipVariants({ variant }), size === 'small' ? 'text-caption' : 'text-small', className)}
      style={style}
    >
      {icon && <span className="shrink-0 [&>svg]:size-3.5">{icon}</span>}
      {label}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          aria-label="Supprimer"
          className="-mr-0.5 ml-0.5 grid size-4 shrink-0 place-items-center rounded-full text-current opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
};

export { Chip, chipVariants };
