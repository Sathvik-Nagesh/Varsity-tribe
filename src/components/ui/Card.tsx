'use client';

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

/* ── Variant Styles ── */

const cardVariants = {
  default: 'bg-white border border-slate-200 shadow-sm',
  elevated: 'bg-white border border-slate-200 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]',
  glass: 'bg-white/80 backdrop-blur-2xl border border-slate-200/50 shadow-sm',
} as const;

/* ── Props ── */

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: keyof typeof cardVariants;
  hoverable?: boolean;
}

/* ── Components ── */

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, className, children, ...rest }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="initial"
        whileHover={hoverable ? 'hover' : undefined}
        variants={
              hoverable
                ? {
                    initial: { y: 0, scale: 1, boxShadow: 'var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)' },
                    hover: { y: -6, scale: 1.02, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.15)', transition: { duration: 0.3, ease: 'easeOut' } },
                  }
            : undefined
        }
        className={cn(
          'rounded-[20px] text-brand-text-primary overflow-hidden',
          cardVariants[variant],
          hoverable && 'cursor-pointer transition-colors',
          className
        )}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-[var(--space-md)] md:p-[var(--space-lg)] pb-0 md:pb-0', className)}
      {...props}
    />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-h3 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-small text-brand-text-secondary', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-[var(--space-md)] md:p-[var(--space-lg)] pt-4', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-[var(--space-md)] md:p-[var(--space-lg)] pt-0 md:pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
