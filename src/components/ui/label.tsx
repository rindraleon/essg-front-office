import * as React from 'react';
import { cn } from '@/lib';

type LabelProps = Omit<React.ComponentProps<'label'>, 'htmlFor'> & {
  htmlFor: string;
  required?: boolean;
};

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, required, children, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn('text-small font-semibold text-ink-700 leading-none', className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden className="ml-0.5 text-danger-500">
          *
        </span>
      )}
    </label>
  )
);
Label.displayName = 'Label';

function Field({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="field" className={cn('space-y-1.5', className)} {...props} />;
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn('text-caption text-ink-500', className)}
      {...props}
    />
  );
}

function FieldError({ className, children, ...props }: React.ComponentProps<'p'>) {
  if (!children) return null;
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn('flex items-center gap-1 text-caption font-medium text-danger-600', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export { Label, Field, FieldDescription, FieldError };
