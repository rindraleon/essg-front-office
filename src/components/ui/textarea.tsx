import * as React from 'react';
import { cn } from '@/lib';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-28 w-full rounded-xl border border-ink-200 bg-white px-3.5 py-2.5 text-small text-ink-900 shadow-[0_1px_0_rgba(27,31,34,0.02)]',
        'placeholder:text-ink-400 placeholder:text-small',
        'transition-[border-color,box-shadow] duration-(--duration-fast) ease-(--ease-out-soft)',
        'hover:border-ink-300',
        'focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/15',
        'disabled:cursor-not-allowed disabled:bg-ink-50 disabled:opacity-60',
        'aria-invalid:border-danger-400 aria-invalid:ring-danger-500/15',
        'resize-y',
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = 'Textarea';

export { Textarea };
