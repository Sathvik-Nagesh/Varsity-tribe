'use client';

import React from 'react';
import * as RadixProgress from '@radix-ui/react-progress';
import { motion } from 'framer-motion';
import { cn } from '@/lib/cn';

import { safeDivide } from '@/lib/math';

/* ── Color Variants ── */

const colorStyles = {
  primary: 'bg-brand-primary',
  success: 'bg-brand-success',
  warning: 'bg-brand-warning',
  danger: 'bg-brand-danger',
} as const;

const trackColorStyles = {
  primary: 'bg-brand-primary/15',
  success: 'bg-brand-success/15',
  warning: 'bg-brand-warning/15',
  danger: 'bg-brand-danger/15',
} as const;

/* ── Size Variants ── */

const sizeStyles = {
  sm: 'h-1',      /* 4px */
  md: 'h-2',      /* 8px */
  lg: 'h-3',      /* 12px */
} as const;

/* ── Props ── */

export interface ProgressBarProps {
  /** Current value (0–100) */
  value: number;
  /** Maximum value, defaults to 100 */
  max?: number;
  color?: keyof typeof colorStyles;
  size?: keyof typeof sizeStyles;
  /** Show percentage label above the bar */
  showLabel?: boolean;
  className?: string;
}

/* ── Component ── */

function ProgressBar({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  showLabel = false,
  className,
}: ProgressBarProps) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const pct = Math.min(100, Math.max(0, safeDivide(safeValue, max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-label text-brand-text-secondary">
            Progress
          </span>
          <span className="text-label font-semibold text-brand-text-primary">
            {Math.round(pct)}%
          </span>
        </div>
      )}

      <RadixProgress.Root
        value={safeValue}
        max={max}
        className={cn(
          'relative w-full overflow-hidden rounded-full',
          trackColorStyles[color],
          sizeStyles[size]
        )}
      >
        <RadixProgress.Indicator asChild>
          <motion.div
            className={cn(
              'h-full rounded-full',
              colorStyles[color]
            )}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </RadixProgress.Indicator>
      </RadixProgress.Root>
    </div>
  );
}

ProgressBar.displayName = 'ProgressBar';

export { ProgressBar };
