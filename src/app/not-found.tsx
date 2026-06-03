'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { IconHome, IconBook, IconChartLine } from '@tabler/icons-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex max-w-lg flex-col items-center rounded-3xl border border-white/40 bg-white/60 p-8 shadow-2xl backdrop-blur-xl sm:p-12"
      >
        <div className="mb-6 flex items-center justify-center">
          <Image
            src="/logo.png"
            alt="Varsity Tribe"
            width={120}
            height={36}
            className="h-8 w-auto opacity-70 grayscale"
          />
        </div>
        
        <h1 className="mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Looks like this page invested in the wrong asset.
        </h1>
        
        <p className="mb-8 text-lg text-slate-600">
          The market is volatile, and this URL completely crashed. Don't worry, your actual portfolio is safe. Let's get you back to greener pastures.
        </p>
        
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl hover:-translate-y-0.5"
          >
            <IconHome size={20} />
            Go Home
          </Link>
          <Link
            href="/learn"
            className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/80 px-6 py-3 font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 backdrop-blur-sm"
          >
            <IconBook size={20} />
            Continue Learning
          </Link>
        </div>
      </motion.div>
      
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl filter" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl filter" />
      </div>
    </div>
  );
}
