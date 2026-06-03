'use client';

import { Toaster } from 'sonner';

export function GlobalToaster() {
  return (
    <Toaster 
      position="top-center" 
      toastOptions={{
        className: 'rounded-xl border border-brand-border bg-white text-brand-text-primary shadow-lg',
      }}
    />
  );
}
