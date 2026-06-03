'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  IconTarget,
  IconCoin,
  IconChartBar,
  IconReceipt,
  IconCalendar,
} from '@tabler/icons-react';
import { Badge } from '@/components/ui';

import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

/* ── Events Data ── */

const events = [
  {
    monthAbbr: 'JUN',
    day: '5',
    title: 'Salary Negotiation Workshop',
    typeBadge: { label: 'Workshop', variant: 'primary' as const },
    meta: '7:00 PM · 234 registered',
    statusBadge: { label: 'Tomorrow', variant: 'warning' as const },
  },
  {
    monthAbbr: 'JUN',
    day: '7-8',
    title: 'Emergency Fund Bootcamp',
    typeBadge: { label: 'Bootcamp', variant: 'success' as const },
    meta: '2-day intensive · 456 registered',
    statusBadge: { label: 'This Weekend', variant: 'success' as const },
  },
  {
    monthAbbr: 'JUN',
    day: '12',
    title: 'Investing for Beginners',
    typeBadge: { label: 'Webinar', variant: 'primary' as const },
    meta: '6:30 PM · 789 registered',
    statusBadge: { label: 'Next Week', variant: 'neutral' as const },
  },
  {
    monthAbbr: 'JUN',
    day: '15-30',
    title: '30-Day Savings Challenge',
    typeBadge: { label: 'Challenge', variant: 'warning' as const },
    meta: '15 days · 1,234 joined',
    statusBadge: { label: 'Open Now', variant: 'success' as const },
  },
];

/* ── Simulations Data ── */

const simIconColors = [
  'bg-brand-primary/10 text-brand-primary',
  'bg-brand-success/10 text-brand-success',
  'bg-brand-danger/10 text-brand-danger',
  'bg-brand-warning/10 text-brand-warning',
];

const getSimulations = (currency: string) => [
  {
    Icon: IconTarget,
    title: 'Salary Negotiation Simulator',
    difficulty: { label: 'Medium', variant: 'warning' as const },
    time: '~15 min',
    description:
      'Practice negotiating a real salary offer with AI-powered scenarios',
  },
  {
    Icon: IconCoin,
    title: 'Budget Challenge',
    difficulty: { label: 'Easy', variant: 'success' as const },
    time: '~10 min',
    description:
      `Allocate a ${formatCurrency(50000, currency)} monthly salary across needs, wants, and savings`,
  },
  {
    Icon: IconChartBar,
    title: 'Investment Decision Game',
    difficulty: { label: 'Hard', variant: 'danger' as const },
    time: '~20 min',
    description:
      'Navigate 10 years of market scenarios and build a portfolio',
  },
  {
    Icon: IconReceipt,
    title: 'Debt Payoff Simulator',
    difficulty: { label: 'Medium', variant: 'warning' as const },
    time: '~12 min',
    description:
      'Find the fastest strategy to become debt-free',
  },
];

/* ── Animation Variants ── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

/* ── Component ── */

export function EventsSection() {
  const { currency } = useUserStore();
  const simulations = getSimulations(currency);

  return (
    <section className="py-20 px-4 bg-brand-surface">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ── Left: Upcoming Events ── */}
          <div>
            <p className="text-label text-brand-primary mb-2">EVENTS</p>
            <h2 className="text-display text-brand-text-primary mb-8">
              Never Miss a Learning Opportunity
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {events.map((evt, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="glass-strong rounded-xl p-4 mb-3 flex gap-4 cursor-pointer"
                >
                  {/* Date block */}
                  <div className="shrink-0 rounded-lg bg-brand-primary/10 p-3 text-center min-w-[60px]">
                    <p className="text-[10px] uppercase text-brand-primary font-semibold tracking-wider">
                      {evt.monthAbbr}
                    </p>
                    <p className="text-h2 font-bold text-brand-primary leading-tight">
                      {evt.day}
                    </p>
                  </div>

                  {/* Event info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-h3 font-medium text-brand-text-primary">
                        {evt.title}
                      </h4>
                      <Badge variant={evt.statusBadge.variant} size="sm">
                        {evt.statusBadge.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant={evt.typeBadge.variant} size="sm">
                        {evt.typeBadge.label}
                      </Badge>
                    </div>

                    <p className="text-small text-brand-text-secondary flex items-center gap-1.5">
                      <IconCalendar size={13} className="shrink-0" />
                      {evt.meta}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Interactive Learning ── */}
          <div>
            <p className="text-label text-brand-success mb-2">LEARN BY DOING</p>
            <h2 className="text-display text-brand-text-primary mb-8">
              Simulations & Challenges
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {simulations.map((sim, i) => {
                const SimIcon = sim.Icon;
                return (
                  <motion.div
                    key={i}
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="glass-strong rounded-xl p-4 mb-3 flex gap-4 cursor-pointer"
                  >
                    {/* Icon circle */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${simIconColors[i]}`}
                    >
                      <SimIcon size={20} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-h3 font-medium text-brand-text-primary mb-1">
                        {sim.title}
                      </h4>

                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge variant={sim.difficulty.variant} size="sm">
                          {sim.difficulty.label}
                        </Badge>
                        <span className="text-[11px] text-brand-text-tertiary">
                          {sim.time}
                        </span>
                      </div>

                      <p className="text-small text-brand-text-secondary leading-snug">
                        {sim.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
