'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconArrowUp, IconMessage } from '@tabler/icons-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';

import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

/* ── Data ── */

const getDiscussions = (currency: string) => [
  {
    initials: 'RK',
    name: 'Rohan K.',
    time: '2h ago',
    content:
      `Just completed my first SIP! Started with ${formatCurrency(500, currency)}/month in Nifty 50 index fund. Baby steps! 🚀`,
    upvotes: 156,
    comments: 23,
    tag: '#FirstSIP',
    tagVariant: 'primary' as const,
    color: 'bg-blue-500',
  },
  {
    initials: 'PM',
    name: 'Priya M.',
    time: '4h ago',
    content:
      `Finally hit my 6-month emergency fund target of ${formatCurrency(300000, currency)}. The budget tracker here really helped!`,
    upvotes: 234,
    comments: 45,
    tag: '#EmergencyFund',
    tagVariant: 'success' as const,
    color: 'bg-emerald-500',
  },
  {
    initials: 'AS',
    name: 'Amit S.',
    time: '6h ago',
    content:
      'Used the salary negotiation simulator before my review. Got a 35% hike! This community is gold 💰',
    upvotes: 312,
    comments: 67,
    tag: '#CareerGrowth',
    tagVariant: 'warning' as const,
    color: 'bg-purple-500',
  },
  {
    initials: 'NK',
    name: 'Neha K.',
    time: '8h ago',
    content:
      'Can someone explain the difference between direct and regular mutual funds? Still confused.',
    upvotes: 89,
    comments: 34,
    tag: '#AskCommunity',
    tagVariant: 'neutral' as const,
    color: 'bg-rose-500',
  },
  {
    initials: 'VR',
    name: 'Vikram R.',
    time: '12h ago',
    content:
      'My portfolio is up 22% this year following the asset allocation module. Sharing my breakdown...',
    upvotes: 445,
    comments: 78,
    tag: '#Portfolio',
    tagVariant: 'primary' as const,
    color: 'bg-amber-500',
  },
];

const communityStats = [
  { value: '50,247', label: 'Total Members', active: true },
  { value: '342', label: 'Discussions Today' },
  { value: '1,247', label: 'Goals Tracked This Week' },
  { value: '89', label: 'Events Hosted' },
];

const topContributors = [
  { rank: 1, name: 'Priya M.', xp: '4,250 XP', medal: '🥇', color: 'bg-emerald-500', initials: 'PM' },
  { rank: 2, name: 'Rohan K.', xp: '3,980 XP', medal: '🥈', color: 'bg-blue-500', initials: 'RK' },
  { rank: 3, name: 'Amit S.', xp: '3,670 XP', medal: '🥉', color: 'bg-purple-500', initials: 'AS' },
  { rank: 4, name: 'Neha K.', xp: '3,445 XP', medal: '', color: 'bg-rose-500', initials: 'NK' },
  { rank: 5, name: 'Vikram R.', xp: '3,210 XP', medal: '', color: 'bg-amber-500', initials: 'VR' },
];

/* ── Animation Variants ── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

/* ── Component ── */

export function CommunitySection() {
  const { currency } = useUserStore();
  const discussions = getDiscussions(currency);

  return (
    <section className="py-20 px-4 mesh-gradient">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-label text-brand-primary mb-2">COMMUNITY</p>
          <h2 className="text-display text-brand-text-primary mb-3">
            A Thriving Community of Learners
          </h2>
          <p className="text-body text-brand-text-secondary max-w-[600px] mx-auto w-full min-w-0">
            Join discussions, share wins, learn from peers, and grow together.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column — Trending Discussions */}
          <div className="lg:col-span-3">
            <h3 className="text-h3 font-semibold mb-4">🔥 Trending Discussions</h3>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
            >
              {discussions.map((d, i) => (
                <motion.div
                  key={i}
                  variants={cardVariants}
                  className="glass-strong rounded-xl p-4 mb-3"
                >
                  {/* Top row: avatar + meta */}
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-white text-small font-semibold shrink-0',
                        d.color
                      )}
                    >
                      {d.initials}
                    </div>
                    <div className="min-w-0">
                      <span className="font-medium text-brand-text-primary">
                        {d.name}
                      </span>
                      <span className="text-[11px] text-brand-text-tertiary ml-2">
                        {d.time}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-body text-brand-text-primary mb-3 leading-relaxed">
                    {d.content}
                  </p>

                  {/* Bottom row: stats + tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-small text-brand-text-secondary">
                        <IconArrowUp size={14} />
                        {d.upvotes}
                      </span>
                      <span className="flex items-center gap-1 text-small text-brand-text-secondary">
                        <IconMessage size={14} />
                        {d.comments}
                      </span>
                    </div>
                    <Badge variant={d.tagVariant} size="sm">
                      {d.tag}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Column — Stats + Leaderboard */}
          <div className="lg:col-span-2">
            {/* Community Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5 }}
              className="glass-strong rounded-xl p-5 mb-4"
            >
              <h4 className="text-h3 font-semibold mb-4">Community Stats</h4>

              <div className="space-y-4">
                {communityStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-h3 font-bold font-mono text-brand-text-primary">
                        {stat.value}
                      </p>
                      <p className="text-small text-brand-text-secondary">
                        {stat.label}
                      </p>
                    </div>
                    {stat.active && (
                      <span className="flex items-center gap-1.5 text-[11px] text-brand-success font-medium">
                        <span className="w-2 h-2 rounded-full bg-brand-success animate-pulse" />
                        Active
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Contributors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="glass-strong rounded-xl p-5"
            >
              <h4 className="text-h3 font-semibold mb-1">🏆 Top Contributors</h4>
              <p className="text-small text-brand-text-secondary mb-4">
                This Month
              </p>

              <div className="space-y-3">
                {topContributors.map((c) => (
                  <div
                    key={c.rank}
                    className={cn(
                      'flex items-center gap-3 p-2 rounded-lg transition-colors',
                      c.rank === 1 && 'bg-brand-primary/5'
                    )}
                  >
                    <span className="text-small font-mono text-brand-text-tertiary w-5 shrink-0">
                      #{c.rank}
                    </span>
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-semibold shrink-0',
                        c.color
                      )}
                    >
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-small font-medium text-brand-text-primary truncate">
                        {c.name}
                      </p>
                      <p className="text-[11px] text-brand-text-tertiary font-mono">
                        {c.xp}
                      </p>
                    </div>
                    {c.medal && <span className="text-lg">{c.medal}</span>}
                  </div>
                ))}
              </div>

              <button className="mt-4 text-small text-brand-primary font-medium hover:underline cursor-pointer">
                View Full Leaderboard →
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
