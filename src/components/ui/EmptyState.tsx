import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/cn';

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-brand-border bg-brand-surface p-8 text-center',
        className
      )}
      {...props}
    >
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-surface-elevated text-brand-text-tertiary">
          {icon}
        </div>
      ) : (
        <div className="mb-4 flex items-center justify-center opacity-40 grayscale">
          <Image src="/logo.png" alt="Varsity Tribe" width={100} height={30} className="h-6 w-auto" />
        </div>
      )}
      <h3 className="mb-2 text-h3 text-brand-text-primary">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-body text-brand-text-secondary">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
