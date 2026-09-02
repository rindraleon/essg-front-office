import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative w-full rounded-xl border px-4 py-3 text-small', {
  variants: {
    variant: {
      default: 'border-ink-100 bg-white text-ink-800',
      destructive: 'border-red-200 bg-red-50 text-red-800',
      warning: 'border-amber-200 bg-amber-50 text-amber-900',
      success: 'border-brand-200 bg-brand-50 text-brand-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Alert({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: Readonly<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h5 className={cn('mb-1 font-semibold leading-none', className)} {...props}>
      {props.children}
    </h5>
  );
}

function AlertDescription({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLParagraphElement>>) {
  return <p className={cn('text-small leading-relaxed opacity-90', className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
