import { Link } from 'react-router-dom';
import { Button as UiButton, type ButtonProps } from '../ui/button';
import { buttonVariants } from '../ui/button-variants';
import { cn } from '@/lib';

type CompatButtonProps = Omit<ButtonProps, 'variant' | 'size'> & {
  component?: 'a' | 'button' | typeof Link | React.ElementType;
  to?: string;
  href?: string;
  target?: string;
  rel?: string;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  fullWidth?: boolean;
  variant?: 'contained' | 'outlined' | 'text' | NonNullable<ButtonProps['variant']>;
  size?: 'small' | 'medium' | 'large' | NonNullable<ButtonProps['size']>;
  sx?: unknown;
};

const variantMap: Record<string, NonNullable<ButtonProps['variant']>> = {
  contained: 'default',
  outlined: 'outline',
  text: 'link',
};

const sizeMap: Record<string, NonNullable<ButtonProps['size']>> = {
  small: 'sm',
  medium: 'default',
  large: 'lg',
};

export default function Button({
  component,
  to,
  href,
  target,
  rel,
  endIcon,
  startIcon,
  fullWidth,
  variant = 'default',
  size = 'default',
  className,
  children,
  sx: _sx,
  ...props
}: CompatButtonProps) {
  const mappedVariant = variantMap[String(variant)] ?? (variant as ButtonProps['variant']);
  const mappedSize = sizeMap[String(size)] ?? (size as ButtonProps['size']);
  const classes = cn(
    buttonVariants({ variant: mappedVariant, size: mappedSize }),
    fullWidth && 'w-full',
    className
  );

  if (component === Link || to) {
    return (
      <Link to={to || href || '#'} target={target} rel={rel} className={classes}>
        {startIcon}
        {children}
        {endIcon}
      </Link>
    );
  }

  if (component === 'a' || href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {startIcon}
        {children}
        {endIcon}
      </a>
    );
  }

  return (
    <UiButton className={classes} variant={mappedVariant} size={mappedSize} {...props}>
      {startIcon}
      {children}
      {endIcon}
    </UiButton>
  );
}
