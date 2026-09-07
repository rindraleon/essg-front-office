import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib';

type FormFieldErrorProps = {

  id?: string;
  error?: string;
  className?: string;
};

export const FormFieldError = ({ id, error, className }: FormFieldErrorProps) => (
  <p
    id={id}
    role={error ? 'alert' : undefined}
    className={cn('flex min-h-[17px] items-center gap-1.5 text-caption text-danger-600', className)}
  >
    {error ? (
      <>
        <AlertCircle aria-hidden="true" className="size-3.5 shrink-0" />
        <span>{error}</span>
      </>
    ) : null}
  </p>
);
