'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from 'framer-motion';
import {
  IconMenu2,
  IconX,
} from '@tabler/icons-react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui';

/* ── Nav links ── */

const navLinks = [
  { label: 'Learn', href: '/learn' },
  { label: 'Tools', href: '/tools' },
  { label: 'Community', href: '/community' },
  { label: 'Events', href: '/events' },
  { label: 'Leaderboard', href: '/leaderboard' },
] as const;

/* ── Component ── */

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 10);
  });

  return (
    <>
      {/* ── Navbar ── */}
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'glass-strong shadow-sm' : 'bg-transparent'
        )}
      >
        <nav
          className={cn(
            'mx-auto flex items-center justify-between px-4 sm:px-6 transition-all duration-300',
            scrolled ? 'h-14' : 'h-16'
          )}
          style={{ maxWidth: 1200 }}
        >
          {/* Left — Logo */}
          <Link href="/" className="relative shrink-0 transition-transform duration-300 hover:scale-[1.03]">
            <Image
              src="/logo.png"
              alt="Varsity Tribe"
              width={180}
              height={50}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          {/* Center — Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="text-small font-medium text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-elevated rounded-lg px-3 py-2 transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">


            {/* Get Started — desktop */}
            <Link href="/onboarding" className="hidden md:block">
              <Button variant="primary" size="sm">
                Get Started
              </Button>
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMobileOpen(true)}
              className="inline-flex md:hidden items-center justify-center h-9 w-9 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-elevated transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <IconMenu2 size={22} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-brand-bg shadow-xl flex flex-col md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-4 h-16 border-b border-brand-border">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                >
                  <Image
                    src="/logo.png"
                    alt="Varsity Tribe"
                    width={180}
                    height={50}
                    className="h-10 md:h-12 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-elevated transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <IconX size={22} />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 flex flex-col gap-1 p-4 overflow-y-auto">
                {navLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="text-body font-medium text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-elevated rounded-lg px-3 py-3 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Drawer CTA */}
              <div className="p-4 border-t border-brand-border">
                <Link
                  href="/onboarding"
                  onClick={() => setMobileOpen(false)}
                  className="block"
                >
                  <Button variant="primary" size="md" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
