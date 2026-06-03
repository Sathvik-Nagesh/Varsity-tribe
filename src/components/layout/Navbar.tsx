'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { IconSparkles, IconBell } from '@tabler/icons-react';
import { useUserStore, selectLevel } from '@/stores/useUserStore';
import { Badge, CommandPalette } from '@/components/ui';
import { cn } from '@/lib/cn';

const mainNavLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Learn', href: '/learn' },
  { label: 'Community', href: '/community' },
  { label: 'Events', href: '/events' },
  { label: 'Leaderboard', href: '/leaderboard' },
];

const mockNotifications = [
  { id: 1, title: 'New Course Available', time: '5m ago', read: false },
  { id: 2, title: 'You earned 50 XP!', time: '1h ago', read: true },
  { id: 3, title: 'Event starting soon: Crypto 101', time: '2h ago', read: true },
];

function AvatarDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const level = useUserStore(selectLevel);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300);
  };

  // Close when clicking a link
  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <div 
      className="relative z-50 flex items-center" 
      onMouseEnter={handleMouseEnter} 
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 transition-colors shadow-sm">
        <span className="text-sm font-semibold">AS</span>
      </button>
      
      {/* Invisible Hover Bridge */}
      <div className="absolute top-full left-0 w-full h-4" />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-[calc(100%+0.5rem)] w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg"
          >
            <div className="px-3 py-3 border-b border-slate-100 mb-2">
              <p className="text-sm font-semibold text-slate-900">Alex Smith</p>
              <p className="text-xs text-slate-500 capitalize">{level.replace('-', ' ')}</p>
            </div>
            <Link onClick={handleClick} href="/profile" className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 font-medium">Profile</Link>
            <Link onClick={handleClick} href="/goals" className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 font-medium">Goals</Link>
            <Link onClick={handleClick} href="/leaderboard" className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 font-medium">Leaderboard</Link>
            <Link onClick={handleClick} href="/labs" className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 font-medium">Labs</Link>
            <Link onClick={handleClick} href="/settings" className="block rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 font-medium">Settings</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar() {
  const { xp } = useUserStore();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 10);
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200 border-b border-slate-200 bg-white/80 backdrop-blur-[20px] shadow-sm'
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-8">
        {/* Logo */}
        <Link href="/" className="shrink-0 transition-transform duration-300 hover:scale-[1.03]">
          <Image
            src="/logo.png"
            alt="Varsity Tribe"
            width={180}
            height={50}
            className="h-10 md:h-12 w-auto"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-2 md:flex flex-1 ml-8">
          {mainNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <CommandPalette />
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-full p-2 text-slate-700 transition-colors hover:bg-slate-50"
            >
              <IconBell size={20} />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-lg"
                >
                  <h3 className="mb-2 px-2 text-sm font-semibold text-slate-900">Notifications</h3>
                  <div className="flex flex-col gap-1">
                    {mockNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "rounded-lg p-3 text-sm transition-colors hover:bg-slate-50",
                          !notif.read ? "bg-slate-50 font-medium" : "text-slate-600"
                        )}
                      >
                        <div className="mb-1 text-slate-800">{notif.title}</div>
                        <div className="text-xs text-slate-500">{notif.time}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* XP Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 border border-slate-200">
            <IconSparkles size={16} className="text-brand-primary" />
            <span className="text-small font-medium text-slate-700">{xp} XP</span>
          </div>

          {/* Avatar Dropdown */}
          <AvatarDropdown />
        </div>
      </div>
    </motion.header>
  );
}
