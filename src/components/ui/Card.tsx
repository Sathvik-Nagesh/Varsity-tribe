'use client';

import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

/* ── Variant Styles ── */

const cardVariants = {
  default: 'bg-white border border-slate-200 shadow-sm',
  elevated: 'bg-white border border-slate-200 shadow-md',
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
        whileHover={hoverable ? { y: -2, scale: 1.01 } : undefined}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'rounded-2xl text-brand-text-primary overflow-hidden transition-shadow',
          cardVariants[variant],
          hoverable && 'cursor-pointer hover:shadow-lg',
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
