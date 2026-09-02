import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib';

type FormFieldErrorProps = {
  /** id du message, référencé par aria-describedby du champ. */
  id?: string;
  error?: string;
  className?: string;
};

/**
 * Message d'erreur sous un champ de formulaire.
 * La hauteur d'une ligne est toujours réservée afin d'éviter tout saut de
 * layout quand l'erreur apparaît (UX stable), avec icône + couleur + texte
 * (l'erreur ne dépend jamais de la couleur seule).
 */
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
