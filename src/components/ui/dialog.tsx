import * as React from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      // Restauration du focus à la fermeture (accessibilité)
      requestAnimationFrame(() => previouslyFocused?.focus?.());
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden="true">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full animate-fade-in motion-reduce:animate-none"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%230f172a' fill-opacity='0.55'/%3E%3C/svg%3E"
      />
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        className="absolute inset-0 backdrop-blur-[2px] animate-fade-in motion-reduce:animate-none"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>,
    document.body
  );
}

interface DialogContentProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

function DialogContent({
  className,
  size = 'md',
  children,
  ...props
}: Readonly<DialogContentProps>) {
  const sizeClass = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }[size];

  // Focus initial : premier élément focusable du dialogue
  const contentRef = React.useRef<HTMLDialogElement>(null);
  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const focusable = el.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const timer = window.setTimeout(() => focusable?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <dialog
      ref={contentRef}
      open
      className={cn(
        'relative z-10 m-0 flex w-full flex-col overflow-hidden p-0',
        'max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)]',
        'rounded-2xl border border-ink-100 bg-white text-ink-900 shadow-elevated',
        'animate-scale-in',
        'backdrop:bg-transparent',
        sizeClass,
        className
      )}
      {...props}
    >
      {children}
    </dialog>
  );
}

function DialogHeader({ className, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-start justify-between gap-4 border-b border-ink-100 px-6 py-5',
        className
      )}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn('min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-5', className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-col-reverse items-stretch gap-2 border-t border-ink-100 bg-ink-50/40 px-6 py-4 sm:flex-row sm:items-center sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  children,
  ...props
}: Readonly<React.HTMLAttributes<HTMLHeadingElement>>) {
  return (
    <h2
      className={cn(
        'font-display text-h5 font-semibold leading-tight tracking-tight text-ink-900',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

function DialogDescription({
  className,
  ...props
}: Readonly<React.HTMLAttributes<HTMLParagraphElement>>) {
  return <p className={cn('mt-1 text-small text-ink-500', className)} {...props} />;
}

function DialogClose({ onClick }: Readonly<{ onClick: () => void }>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="-m-2 inline-grid size-9 place-items-center rounded-full text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30"
      aria-label="Fermer la fenêtre"
    >
      <X className="size-4.5" aria-hidden />
    </button>
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
};
