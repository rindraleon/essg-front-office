import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonVariants } from '../ui/button-variants';
import { cn } from '@/lib';

interface ViewDetailsButtonProps {
  to: string;
  label?: string;
  ariaLabel?: string;
  className?: string;
  variant?: 'link' | 'default' | 'outline';
}

const ViewDetailsButton = ({
  to,
  label = 'Voir le détail',
  ariaLabel,
  className,
  variant = 'link',
}: ViewDetailsButtonProps) => {
  return (
    <Link
      to={to}
      aria-label={ariaLabel ?? label}
      className={cn(
        buttonVariants({ variant }),
        variant === 'link' && 'mt-2 justify-start px-0',
        className
      )}
    >
      {label}
      <ArrowRight className="size-4" />
    </Link>
  );
};

export default ViewDetailsButton;
