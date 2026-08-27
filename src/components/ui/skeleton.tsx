import { cn } from '@/lib';

function Skeleton({ className, ...props }: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer rounded-md bg-ink-100', className)}
      {...props}
    />
  );
}

export { Skeleton };
