'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconLock } from '@tabler/icons-react';
import { cn } from '@/lib/cn';

/* ── Data ── */

const badges = [
  { emoji: '🏅', name: 'SIP Starter', desc: 'Started your first SIP', earned: '12,456 earned' },
  { emoji: '🛡️', name: 'Safety Net', desc: 'Built emergency fund', earned: '8,234 earned' },
  { emoji: '📚', name: 'Knowledge Seeker', desc: 'Completed 10 modules', earned: '6,789 earned' },
  { emoji: '🔥', name: 'Streak Master', desc: '30-day learning streak', earned: '3,456 earned' },
  { emoji: '🏆', name: 'Community Mentor', desc: 'Helped 50 members', earned: '1,234 earned' },
  { emoji: '💎', name: 'Diamond Hands', desc: '1 year of investing', earned: '2,567 earned', locked: true },
  { emoji: '🎯', name: 'Goal Crusher', desc: 'Completed 5 goals', earned: '4,321 earned', locked: true },
  { emoji: '👑', name: 'Tribe Leader', desc: 'Top 1% contributor', earned: '234 earned', locked: true },
];

/* ── Animation Variants ── */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
};

/* ── Component ── */

export function AchievementsSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-label text-brand-primary mb-2">ACHIEVEMENTS</p>
          <h2 className="text-display text-brand-text-primary mb-3">
            Unlock Badges. Build Your Reputation.
          </h2>
          <p className="text-body text-brand-text-secondary max-w-[600px] mx-auto w-full min-w-0">
            Every milestone earns you recognition in the tribe.
          </p>
        </div>

        {/* Achievement Badges Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="flex overflow-x-auto gap-3 pb-2 snap-x md:grid md:grid-cols-4 lg:grid-cols-8 md:overflow-visible"
        >
          {badges.map((badge, i) => (
            <motion.div
              key={i}
              variants={badgeVariants}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'glass-strong rounded-xl p-4 text-center min-w-[140px] relative cursor-pointer',
                badge.locked && 'opacity-50'
              )}
            >
              {/* Lock overlay for locked badges */}
              {badge.locked && (
                <div className="absolute top-2 right-2">
                  <IconLock size={14} className="text-brand-text-tertiary" />
                </div>
              )}

              <div className="text-3xl mb-2">{badge.emoji}</div>
              <p className="text-small font-semibold text-brand-text-primary mb-0.5">
                {badge.name}
              </p>
              <p className="text-[11px] text-brand-text-tertiary leading-snug mb-1.5">
                {badge.desc}
              </p>
              <p className="text-[10px] text-brand-text-tertiary">
                {badge.earned}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
