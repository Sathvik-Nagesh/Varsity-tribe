'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IconSearch, IconX, IconArrowRight, IconBook, IconCalendar, IconUsers, IconCalculator } from '@tabler/icons-react';
import Fuse from 'fuse.js';

import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

// Mock search data
const getSearchData = (currency: string) => [
  { id: '1', title: 'SIP Calculator', type: 'tool', url: '/tools/sip', icon: IconCalculator, description: 'Calculate mutual fund returns' },
  { id: '2', title: 'EMI Calculator', type: 'tool', url: '/tools/emi', icon: IconCalculator, description: 'Calculate loan EMI and interest' },
  { id: '3', title: 'Retirement Planner', type: 'tool', url: '/tools/retirement', icon: IconCalculator, description: 'Plan your retirement corpus' },
  { id: '4', title: 'Portfolio Health', type: 'tool', url: '/tools/portfolio', icon: IconCalculator, description: 'Analyze asset allocation' },
  { id: '5', title: 'Salary Negotiation Workshop', type: 'event', url: '/events/evt_1', icon: IconCalendar, description: 'June 5 - Learn negotiation strategies' },
  { id: '6', title: 'Emergency Fund Bootcamp', type: 'event', url: '/events/evt_2', icon: IconCalendar, description: 'June 7 - Build your safety net' },
  { id: '7', title: 'First SIP Experience', type: 'community', url: '/community/post_1', icon: IconUsers, description: 'Rohan K. shares his first SIP journey' },
  { id: '8', title: 'Debt Payoff Simulator', type: 'simulation', url: '/learn/debt-payoff', icon: IconBook, description: 'Interactive learning simulation' },
  { id: '9', title: 'Budget Challenge', type: 'simulation', url: '/learn/budget-challenge', icon: IconBook, description: `Allocate ${formatCurrency(50000, currency)} monthly salary` },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { currency } = useUserStore();
  const searchData = getSearchData(currency);
  
  const fuse = new Fuse(searchData, {
    keys: ['title', 'description', 'type'],
    threshold: 0.3,
  });

  // Handle Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const results = query ? fuse.search(query).map(r => r.item) : searchData.slice(0, 5);

  const handleSelect = (url: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(url);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-surface-elevated border border-brand-border text-brand-text-tertiary hover:text-brand-text-secondary transition-colors text-small"
      >
        <IconSearch size={16} />
        <span>Search...</span>
        <span className="flex items-center justify-center bg-brand-surface rounded border border-brand-border px-1.5 text-[10px] font-mono ml-2">
          ⌘K
        </span>
      </button>

      {/* Mobile search icon */}
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-brand-text-secondary hover:text-brand-text-primary"
      >
        <IconSearch size={20} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[20vh] px-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Search Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-brand-surface border border-brand-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center px-4 border-b border-brand-border">
                <IconSearch size={20} className="text-brand-text-secondary" />
                <input
                  type="text"
                  placeholder="Search tools, events, community..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-brand-text-primary placeholder-brand-text-tertiary"
                  autoFocus
                />
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-brand-surface-elevated text-brand-text-tertiary">
                  <IconX size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {results.length === 0 ? (
                  <div className="p-8 text-center text-brand-text-secondary">
                    No results found for "{query}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {query === '' && (
                      <div className="px-3 py-2 text-label font-semibold text-brand-text-tertiary uppercase tracking-wider">
                        Suggested
                      </div>
                    )}
                    {results.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item.url)}
                        className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-brand-primary/5 group transition-colors text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand-surface-elevated flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                          <item.icon size={20} className="text-brand-text-secondary group-hover:text-brand-primary transition-colors" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-brand-text-primary group-hover:text-brand-primary transition-colors">
                            {item.title}
                          </div>
                          <div className="text-small text-brand-text-secondary line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                        <IconArrowRight size={16} className="text-brand-text-tertiary opacity-0 group-hover:opacity-100 group-hover:text-brand-primary transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="px-4 py-3 border-t border-brand-border bg-brand-surface-elevated/50 flex justify-between items-center text-label text-brand-text-tertiary">
                <div>Press <kbd className="px-1.5 py-0.5 rounded border border-brand-border bg-brand-surface font-mono">ESC</kbd> to close</div>
                <div className="flex items-center gap-1">Powered by <IconSearch size={12} /></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
