'use client';

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

/* ── Variant & Size Maps ── */

const variantStyles = {
  primary: 'bg-blue-600 !text-white shadow-sm hover:bg-blue-700 hover:shadow-md',
  secondary: 'bg-white/50 backdrop-blur-lg text-brand-text-primary border border-slate-200 hover:bg-white/80 shadow-sm',
  ghost: 'bg-transparent text-brand-text-primary hover:bg-slate-100',
  danger: 'bg-red-600 !text-white shadow-sm hover:bg-red-700 hover:shadow-md',
} as const;

const sizeStyles = {
  sm: 'h-8 px-3 text-small gap-1.5 rounded-[var(--radius-sm)]',
  md: 'h-10 px-4 text-body gap-2 rounded-[var(--radius-md)]',
  lg: 'h-12 px-6 text-body gap-2.5 rounded-[var(--radius-md)]',
} as const;

/* ── Props ── */

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: keyof typeof variantStyles;
  size?: keyof typeof sizeStyles;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

/* ── Spinner ── */

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/* ── Component ── */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, icon, disabled, className, children, ...rest }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        initial="initial"
        animate={isDisabled ? 'disabled' : 'initial'}
        whileHover={isDisabled ? undefined : 'hover'}
        whileFocus={isDisabled ? undefined : 'focus'}
        whileTap={isDisabled ? undefined : 'tap'}
        variants={{
          initial: { scale: 1, y: 0, opacity: 1 },
          hover: { scale: 1.05, y: -2, transition: { duration: 0.15, ease: 'easeOut' } },
          focus: { scale: 1.05, y: -2, transition: { duration: 0.15, ease: 'easeOut' } },
          tap: { scale: 0.95, y: 0, transition: { duration: 0.1 } },
          disabled: { scale: 1, y: 0, opacity: 0.5 },
        }}
        className={cn(
          /* base */
          'inline-flex cursor-pointer items-center justify-center font-medium',
          'transition-colors',
          'select-none',
          /* variant + size */
          variantStyles[variant],
          sizeStyles[size],
          /* disabled */
          isDisabled && 'pointer-events-none',
          className
        )}
        {...rest}
      >
        {loading ? (
          <Spinner className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
        ) : icon ? (
          <span className="shrink-0">{icon}</span>
        ) : null}
        {children && <span>{children}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
