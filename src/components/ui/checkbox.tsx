import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type CheckboxProps = Omit<React.ComponentProps<'input'>, 'type'> & {
  label?: string;
};

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, checked, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replaceAll(/\s+/g, '-');
    return (
      <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2 text-small">
        <span className="relative inline-flex size-4 items-center justify-center">
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'flex size-4 items-center justify-center rounded border border-ink-300 bg-white transition-colors',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500/30',
              'peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-checked:text-white',
              className,
            )}
          >
            {checked ? <Check className="size-3" strokeWidth={3} /> : null}
          </span>
        </span>
        {label && <span className="text-ink-700">{label}</span>}
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
