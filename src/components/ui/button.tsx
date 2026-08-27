import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg',
    'text-small font-semibold outline-none select-none',
    'transition-[transform,background-color,border-color,color,box-shadow,opacity]',
    'duration-(--duration-quick) ease-out motion-reduce:transition-none',
    'focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2',
    'active:scale-[0.98] motion-reduce:active:scale-100',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform',
    '[&_svg]:duration-(--duration-micro) [&_svg]:ease-out hover:[&_svg]:translate-x-0.5',
    'motion-reduce:[&_svg]:transition-none motion-reduce:hover:[&_svg]:translate-x-0',
    "[&_svg:not([class*='size-'])]:size-4",
  ].join(' '),
  {
    variants: {
      variant: {
        default:
          'bg-brand-600 text-white shadow-none hover:bg-brand-700 hover:shadow-[0_10px_24px_-10px_rgb(84_124_54_/_0.55)]',
        contained:
          'bg-brand-600 text-white shadow-none hover:bg-brand-700 hover:shadow-[0_10px_24px_-10px_rgb(84_124_54_/_0.55)]',
        secondary: 'bg-brand-100 text-brand-800 hover:bg-brand-200',
        outline:
          'border border-brand-600 bg-transparent text-brand-600 hover:bg-brand-50 hover:border-brand-700 hover:text-brand-700',
        outlined:
          'border border-brand-600 bg-transparent text-brand-600 hover:bg-brand-50 hover:border-brand-700 hover:text-brand-700',
        ghost: 'text-brand-700 hover:bg-brand-50',
        text: 'text-brand-600 underline-offset-4 hover:underline hover:text-brand-700 px-0',
        link: 'text-brand-600 underline-offset-4 hover:underline hover:text-brand-700 px-0',
        destructive: 'bg-danger-600 text-white hover:bg-danger-700',
        /* Variantes destinées aux surfaces sombres (Hero, footer, bandeaux).
           Elles remplacent les CTA jusqu'ici recodés à la main dans
           HeroSection : même hauteur, même rayon, même typographie que le
           reste du système. */
        onDark:
          'bg-brand-400 text-brand-950 hover:bg-brand-300 focus-visible:ring-brand-300/60 focus-visible:ring-offset-brand-950',
        onDarkOutline:
          'border border-white/25 bg-white/8 text-white backdrop-blur-sm hover:border-white/45 hover:bg-white/16 focus-visible:ring-white/60 focus-visible:ring-offset-brand-950',
        inverted: 'bg-white text-brand-900 hover:bg-brand-50',
        invertedOutline:
          'border border-white/75 bg-transparent text-white hover:border-white hover:bg-white/12',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-lg px-3 text-caption',
        small: 'h-8 rounded-lg px-3 text-caption',
        medium: 'h-10 px-4 py-2',
        lg: 'h-12 rounded-lg px-6 text-body',
        large: 'h-12 rounded-lg px-6 text-body',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
