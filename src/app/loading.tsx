import React from 'react';
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-brand-bg/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center animate-pulse">
        <Image
          src="/logo.png"
          alt="Varsity Tribe Loading"
          width={160}
          height={48}
          className="h-12 w-auto opacity-80"
          priority
        />
        <div className="mt-6 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
