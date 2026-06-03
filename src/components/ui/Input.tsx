'use client';

import React, { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

/* ── Props ── */

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Visible label above the input */
  label?: string;
  /** Helper text shown below the input */
  helperText?: string;
  /** Error message – shows red ring & text when set */
  error?: string;
  /** Icon or element rendered inside the input, before the text */
  prefixIcon?: React.ReactNode;
  /** Icon or element rendered inside the input, after the text */
  suffixIcon?: React.ReactNode;
}

/* ── Component ── */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      prefixIcon,
      suffixIcon,
      disabled,
      className,
      id: externalId,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = externalId ?? autoId;
    const hasError = !!error;

    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        {/* ── Label ── */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-label text-brand-text-secondary"
          >
            {label}
          </label>
        )}

        {/* ── Input Wrapper ── */}
        <div
          className={cn(
            'group flex items-center gap-2',
            'rounded-[12px] border bg-brand-surface',
            'px-4 h-12',
            'transition-all duration-[var(--duration-micro)]',
            /* default border */
            !hasError && 'border-brand-border',
            /* focus-within ring */
            !hasError &&
              'focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/20',
            /* error state */
            hasError &&
              'border-brand-danger focus-within:ring-4 focus-within:ring-brand-danger/20',
            /* disabled */
            disabled && 'opacity-50 cursor-not-allowed bg-brand-surface-elevated'
          )}
        >
          {/* prefix icon */}
          {prefixIcon && (
            <span className="shrink-0 text-brand-text-tertiary">
              {prefixIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={cn(
              'flex-1 bg-transparent outline-none',
              'text-body text-brand-text-primary',
              'placeholder:text-brand-text-tertiary',
              'disabled:cursor-not-allowed'
            )}
            {...rest}
          />

          {/* suffix icon */}
          {suffixIcon && (
            <span className="shrink-0 text-brand-text-tertiary">
              {suffixIcon}
            </span>
          )}
        </div>

        {/* ── Error / Helper Text ── */}
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-small text-brand-danger"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${inputId}-helper`}
            className="text-small text-brand-text-tertiary"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
