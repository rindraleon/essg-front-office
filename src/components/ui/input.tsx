import * as React from 'react';
import { cn } from '@/lib';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-small text-ink-900 shadow-sm transition-colors',
        'placeholder:text-ink-400',
        'focus-visible:border-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/20',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'file:border-0 file:bg-transparent file:text-small file:font-medium',
        className
      )}
      {...props}
    />
  )
);
Input.displayName = 'Input';

export { Input };
