import React from 'react';
import { cn } from '@/lib/cn';

/* ── Variant Styles ── */

const variantStyles = {
  primary:
    'bg-brand-primary/10 text-brand-primary border border-brand-primary/20',
  success:
    'bg-brand-success-bg text-brand-success border border-brand-success/20',
  warning:
    'bg-brand-warning-bg text-brand-warning border border-brand-warning/20',
  danger:
    'bg-brand-danger-bg text-brand-danger border border-brand-danger/20',
  neutral:
    'bg-brand-neutral-bg text-brand-neutral border border-brand-neutral/20',
} as const;

/* ── Size Styles ── */

const sizeStyles = {
  sm: 'px-2 py-0.5 text-[11px] gap-1',
  md: 'px-2.5 py-1 text-small gap-1.5',
} as const;

/* ── Props ── */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/* ── Component ── */

function Badge({
  variant = 'primary',
  size = 'md',
  icon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

Badge.displayName = 'Badge';

export { Badge };
