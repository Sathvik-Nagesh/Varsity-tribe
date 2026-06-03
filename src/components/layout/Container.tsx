import React from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'max-w-[1400px] mx-auto w-full px-4 md:px-6 lg:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
