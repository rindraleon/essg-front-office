import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-brand-200 bg-brand-50 text-brand-800',
        outline: 'border-white/35 bg-white/10 text-white',
        muted: 'border-ink-100 bg-ink-50 text-ink-700',
        success: 'border-brand-200 bg-brand-50 text-brand-800',
        warning: 'border-amber-200 bg-amber-50 text-amber-800',
        danger: 'border-danger-100 bg-danger-50 text-danger-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
