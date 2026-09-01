import * as React from 'react';
import { cn } from '@/lib';
import { Input } from '../ui/input';
import { Skeleton as UiSkeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';

export function Card({
  className,
  children,
  elevation: _e,
  sx: _sx,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { elevation?: number; sx?: unknown }) {
  return (
    <div
      className={cn('rounded-2xl border border-ink-100 bg-white shadow-card', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function IconButton({
  className,
  children,
  sx: _sx,
  size: _size,
  component,
  href,
  to,
  target,
  rel,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  sx?: unknown;
  size?: string;
  component?: React.ElementType;
  href?: string;
  to?: string;
  target?: string;
  rel?: string;
}) {
  const classes = cn(
    'inline-flex size-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-50',
    className
  );
  if (component === 'a' || href || to) {
    return (
      <a href={href ?? to} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export function Chip({
  label,
  className,
  icon,
  size: _size,
  variant: _variant,
  sx: _sx,
  onDelete,
}: Readonly<{
  label?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  size?: string;
  variant?: string;
  sx?: unknown;
  onDelete?: () => void;
}>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-brand-100 bg-brand-50 px-2.5 py-0.5 text-caption font-medium text-brand-800',
        className
      )}
    >
      {icon}
      {label}
      {onDelete && (
        <button type="button" onClick={onDelete} className="ml-1" aria-label="Supprimer">
          ×
        </button>
      )}
    </span>
  );
}

export function Divider({ className }: Readonly<{ className?: string }>) {
  return <div className={cn('h-px w-full bg-ink-100', className)} />;
}

export function Skeleton({
  className,
  variant,
  width,
  height,
  sx: _sx,
}: Readonly<{
  className?: string;
  variant?: string;
  width?: string | number;
  height?: string | number;
  sx?: unknown;
}>) {
  return (
    <UiSkeleton
      className={cn(variant === 'text' ? 'h-4' : 'rounded-md', className)}
      style={{ width, height }}
    />
  );
}

export function Tooltip({
  children,
  title,
}: Readonly<{ children: React.ReactElement; title?: React.ReactNode }>) {
  return (
    <span className="inline-flex" title={typeof title === 'string' ? title : undefined}>
      {children}
    </span>
  );
}

export function Fade({
  in: visible = true,
  children,
}: {
  in?: boolean;
  children: React.ReactElement;
}) {
  return visible ? children : null;
}

export function FormControl({
  children,
  className,
  fullWidth,
  size: _size,
  required: _required,
}: React.HTMLAttributes<HTMLDivElement> & {
  fullWidth?: boolean;
  size?: string;
  required?: boolean;
}) {
  return <div className={cn(fullWidth && 'w-full', className)}>{children}</div>;
}

export function InputLabel({
  children,
  htmlFor,
}: Readonly<{ children?: React.ReactNode; htmlFor?: string; id?: string; sx?: unknown }>) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-small font-medium text-ink-700">
      {children}
    </label>
  );
}

export function InputAdornment({
  children,
}: Readonly<{ children?: React.ReactNode; position?: string; sx?: unknown }>) {
  return <span className="inline-flex items-center text-ink-400">{children}</span>;
}

export function TextField({
  label,
  className,
  fullWidth,
  multiline,
  rows,
  InputProps,
  slotProps: _slotProps,
  inputRef,
  size: _size,
  sx: _sx,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label?: string;
  fullWidth?: boolean;
  multiline?: boolean;
  rows?: number;
  InputProps?: { startAdornment?: React.ReactNode; endAdornment?: React.ReactNode };
  slotProps?: unknown;
  inputRef?: React.Ref<HTMLInputElement>;
  size?: string;
  sx?: unknown;
}) {
  const inputClass = cn(
    'w-full',
    fullWidth && 'w-full',
    InputProps?.startAdornment && 'pl-9',
    className
  );
  return (
    <div className={cn('space-y-1.5', fullWidth && 'w-full')}>
      {label && <label className="text-small font-medium text-ink-700">{label}</label>}
      <div className="relative">
        {InputProps?.startAdornment && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {InputProps.startAdornment}
          </span>
        )}
        {multiline ? (
          <Textarea
            rows={rows}
            className={inputClass}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <Input ref={inputRef} className={inputClass} {...props} />
        )}
        {InputProps?.endAdornment && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {InputProps.endAdornment}
          </span>
        )}
      </div>
    </div>
  );
}

export function Select({
  children,
  value,
  onChange,
  label,
  className,
  fullWidth,
  name,
  required,
}: Readonly<{
  children?: React.ReactNode;
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  label?: string;
  className?: string;
  fullWidth?: boolean;
  sx?: unknown;
  startAdornment?: React.ReactNode;
  labelId?: string;
  name?: string;
  required?: boolean;
}>) {
  return (
    <label className={cn('block w-full', !fullWidth && className)}>
      {label && <span className="mb-1.5 block text-small font-medium text-ink-700">{label}</span>}
      <select
        name={name}
        required={required}
        value={value ?? ''}
        className={cn(
          'flex h-10 w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-small text-ink-900',
          className
        )}
        onChange={(event) => onChange?.({ target: { value: event.target.value } })}
      >
        {children}
      </select>
    </label>
  );
}

export function MenuItem({
  children,
  value,
}: Readonly<{ children?: React.ReactNode; value?: string }>) {
  return <option value={value}>{children}</option>;
}

export type SelectChangeEvent = { target: { value: string } };
