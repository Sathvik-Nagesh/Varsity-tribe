import React from 'react';
import Link from 'next/link';
import { IconChevronRight } from '@tabler/icons-react';
import { cn } from '@/lib/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm font-medium text-slate-500 mb-6', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={item.label}>
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-brand-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-slate-900 font-semibold' : ''}>
                {item.label}
              </span>
            )}

            {!isLast && (
              <IconChevronRight size={14} className="mx-2 text-slate-400 shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
