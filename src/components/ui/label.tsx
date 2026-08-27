import * as React from 'react';
import { cn } from '@/lib';

type LabelProps = Omit<React.ComponentProps<'label'>, 'htmlFor'> & {
  htmlFor: string;
};

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, htmlFor, ...props }, ref) => (
    <label
      ref={ref}
      htmlFor={htmlFor}
      className={cn('text-small font-medium text-ink-700 leading-none', className)}
      {...props}
    />
  )
);
Label.displayName = 'Label';

export { Label };
