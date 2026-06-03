'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLayoutDashboard,
  IconBook,
  IconUsers,
  IconCalendarEvent,
  IconSearch,
  IconBell,
  IconUser,
  IconX,
  IconFlask,
  IconDots
} from '@tabler/icons-react';
import { cn } from '@/lib/cn';

const mainTabs = [
  { label: 'Dashboard', icon: IconLayoutDashboard, href: '/dashboard' },
  { label: 'Learn', icon: IconBook, href: '/learn' },
  { label: 'Community', icon: IconUsers, href: '/community' },
  { label: 'Events', icon: IconCalendarEvent, href: '/events' },
  { label: 'Search', icon: IconSearch, action: 'search' },
  { label: 'Notifications', icon: IconBell, action: 'notifications' },
  { label: 'Profile', icon: IconUser, href: '/profile' },
  { label: 'More', icon: IconDots, action: 'more' },
];

const mockNotifications = [
  { id: 1, title: 'New Course Available', time: '5m ago', read: false },
  { id: 2, title: 'You earned 50 XP!', time: '1h ago', read: true },
  { id: 3, title: 'Event starting soon: Crypto 101', time: '2h ago', read: true },
];

export function MobileNav() {
  const pathname = usePathname();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
        setActiveAction(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action: string) => {
    if (action === 'search') {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true }));
      setActiveAction(null);
    } else {
      setActiveAction(activeAction === action ? null : action);
    }
  };

  return (
    <>
      {/* Popovers for Mobile */}
      <AnimatePresence>

        {activeAction === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            ref={sheetRef}
            className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl border border-white/30 bg-white/70 p-4 shadow-xl backdrop-blur-[20px] md:hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Notifications</h3>
              <button onClick={() => setActiveAction(null)} className="p-1 text-slate-500 hover:text-slate-800">
                <IconX size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto no-scrollbar">
              {mockNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    "rounded-xl p-3 text-sm transition-colors",
                    !notif.read ? "bg-white/60 font-medium text-slate-900" : "bg-white/40 text-slate-600"
                  )}
                >
                  <div className="mb-1">{notif.title}</div>
                  <div className="text-xs text-slate-500">{notif.time}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeAction === 'more' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            ref={sheetRef}
            className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl border border-white/30 bg-white/70 p-4 shadow-xl backdrop-blur-[20px] md:hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">More Options</h3>
              <button onClick={() => setActiveAction(null)} className="p-1 text-slate-500 hover:text-slate-800">
                <IconX size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/leaderboard" onClick={() => setActiveAction(null)} className="rounded-xl p-3 text-sm font-medium text-slate-700 bg-white/40 hover:bg-white/60 transition-colors">
                Leaderboard
              </Link>
              <Link href="/goals" onClick={() => setActiveAction(null)} className="rounded-xl p-3 text-sm font-medium text-slate-700 bg-white/40 hover:bg-white/60 transition-colors">
                Goals
              </Link>
              <Link href="/tools" onClick={() => setActiveAction(null)} className="rounded-xl p-3 text-sm font-medium text-slate-700 bg-white/40 hover:bg-white/60 transition-colors">
                Tools
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/30 bg-white/70 backdrop-blur-[20px] md:hidden">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2 no-scrollbar">
          {mainTabs.map((tab) => {
            const isActive = tab.href === pathname || (tab.label === 'Dashboard' && pathname === '/');
            const Icon = tab.icon;
            return tab.action ? (
              <button
                key={tab.label}
                onClick={() => handleAction(tab.action!)}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors flex-shrink-0',
                  activeAction === tab.action ? 'text-blue-600' : 'text-slate-500'
                )}
              >
                <Icon size={22} stroke={activeAction === tab.action ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {tab.action === 'notifications' && mockNotifications.some(n => !n.read) && (
                  <span className="absolute right-2 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
                )}
              </button>
            ) : (
              <Link
                key={tab.label}
                href={tab.href!}
                onClick={() => setActiveAction(null)}
                className={cn(
                  'relative flex flex-col items-center gap-0.5 px-3 py-2 transition-colors flex-shrink-0',
                  isActive ? 'text-blue-600' : 'text-slate-500'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab-indicator"
                    className="absolute -top-1 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-blue-600"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={22} stroke={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{tab.label}</span>
              </Link>
            );
          })}
        </div>
        {/* Safe area for notched phones */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
