'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  IconSearch,
  IconX,
  IconTrendingUp,
  IconUsers,
  IconSparkles,
  IconFlame,
  IconArrowRight,
  IconBook,
  IconMessageCircle,
  IconCalendarEvent,
  IconChevronRight,
} from '@tabler/icons-react';
import { cn } from '@/lib/cn';
import {
  FINANCIAL_TOPICS,
  TRENDING_TOPICS,
  COMMUNITY_POPULAR,
  type FinancialTopic,
} from '@/services/topicsDB';
import { TopicChip } from './TopicChip';

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
interface DiscoveryHubProps {
  /** Called when the user selects a topic — parent can use this to filter labs */
  onTopicSelect?: (topic: FinancialTopic | null) => void;
  /** Currently selected topic id (controlled from parent) */
  selectedTopicId?: string | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Hardcoded mock content for smart filter panel
// ──────────────────────────────────────────────────────────────────────────────
const RELATED_EVENTS: Record<string, { title: string; date: string }[]> = {
  'index-investing': [
    { title: 'Index Fund Deep-Dive Webinar', date: 'Tomorrow, 6:00 PM' },
  ],
  sips: [{ title: 'SIP vs Lump Sum — Live Q&A', date: 'Saturday, 4:00 PM' }],
  'retirement-planning': [
    { title: 'FIRE Planning Masterclass', date: 'Sunday, 5:00 PM' },
  ],
  fire: [
    { title: 'FIRE Planning Masterclass', date: 'Sunday, 5:00 PM' },
    { title: 'Early Retirement AMA', date: 'Next Monday, 7:00 PM' },
  ],
};

const TOPIC_MODULES: Record<string, string[]> = {
  'personal-finance': ['Financial Basics', 'Emergency Fund'],
  budgeting: ['Financial Basics'],
  'emergency-funds': ['Emergency Fund'],
  insurance: ['Insurance'],
  'wealth-building': ['Investing', 'Retirement'],
  'retirement-planning': ['Retirement'],
};

// ──────────────────────────────────────────────────────────────────────────────
// Trending Card
// ──────────────────────────────────────────────────────────────────────────────
function TrendingCard({
  topic,
  rank,
  onSelect,
}: {
  topic: FinancialTopic;
  rank: number;
  onSelect: (t: FinancialTopic) => void;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.07, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(topic)}
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-transparent p-5 text-left',
        'transition-all duration-300 hover:shadow-xl hover:border-current/20 cursor-pointer',
        topic.color,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{topic.emoji}</span>
        <span
          className={cn(
            'flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold',
            'bg-white/70',
            topic.textColor,
          )}
        >
          <IconTrendingUp size={11} />+{topic.growthPercent}%
        </span>
      </div>
      <div>
        <p className={cn('text-sm font-bold leading-tight', topic.textColor)}>
          {topic.label}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {topic.learnerCount.toLocaleString()} learners
        </p>
      </div>
      <div className="flex gap-3 text-[11px] text-slate-400 font-medium">
        <span className="flex items-center gap-1">
          <IconUsers size={11} />
          {topic.learnerCount.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <IconMessageCircle size={11} />
          {topic.discussionCount}
        </span>
      </div>
    </motion.button>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Smart Filter Panel
// ──────────────────────────────────────────────────────────────────────────────
function SmartFilterPanel({
  topic,
  onClose,
}: {
  topic: FinancialTopic;
  onClose: () => void;
}) {
  const relatedEvents = RELATED_EVENTS[topic.id] ?? [];
  const relatedModules = TOPIC_MODULES[topic.id] ?? [];

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{topic.emoji}</span>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{topic.label}</h3>
            <p className="text-sm text-slate-500">{topic.description}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <IconX size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Related Modules */}
        <div className="rounded-2xl bg-blue-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-blue-700">
            <IconBook size={16} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Modules</span>
          </div>
          {relatedModules.length > 0 ? (
            <ul className="space-y-2">
              {relatedModules.map((m) => (
                <li
                  key={m}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700"
                >
                  <IconChevronRight size={14} className="text-blue-400 shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">Explore the labs below for hands-on learning.</p>
          )}
        </div>

        {/* Related Simulations */}
        <div className="rounded-2xl bg-purple-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-purple-700">
            <IconSparkles size={16} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Simulations</span>
          </div>
          {topic.relatedSlugs.length > 0 ? (
            <ul className="space-y-2">
              {topic.relatedSlugs.slice(0, 3).map((slug) => (
                <li key={slug}>
                  <Link
                    href={`/learn/${slug}`}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-purple-700 transition-colors"
                  >
                    <IconChevronRight size={14} className="text-purple-400 shrink-0" />
                    {slug
                      .split('-')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">No simulations linked yet.</p>
          )}
        </div>

        {/* Community Discussions */}
        <div className="rounded-2xl bg-emerald-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-emerald-700">
            <IconMessageCircle size={16} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Community</span>
          </div>
          <div className="space-y-2">
            {topic.communityTags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/community?tag=${tag}`}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-emerald-700 transition-colors"
              >
                <span className="text-emerald-400 font-bold">#</span>
                {tag}
              </Link>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-emerald-100">
            <p className="text-xs text-slate-500 font-medium">
              {topic.discussionCount} active discussions
            </p>
          </div>
        </div>

        {/* Events */}
        <div className="rounded-2xl bg-amber-50 p-4">
          <div className="mb-3 flex items-center gap-2 text-amber-700">
            <IconCalendarEvent size={16} className="shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider">Events</span>
          </div>
          {relatedEvents.length > 0 ? (
            <ul className="space-y-3">
              {relatedEvents.map((e) => (
                <li key={e.title}>
                  <p className="text-sm font-semibold text-slate-700 leading-tight">{e.title}</p>
                  <p className="text-xs text-amber-600 mt-0.5 font-medium">{e.date}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">
              No events scheduled yet for this topic.
            </p>
          )}
          <Link
            href="/events"
            className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
          >
            View all events <IconArrowRight size={12} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main DiscoveryHub
// ──────────────────────────────────────────────────────────────────────────────
export function DiscoveryHub({ onTopicSelect, selectedTopicId }: DiscoveryHubProps) {
  const [internalSelected, setInternalSelected] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Use controlled or uncontrolled selection
  const activeTopic = selectedTopicId !== undefined ? selectedTopicId : internalSelected;

  const selectedTopic = useMemo(
    () => FINANCIAL_TOPICS.find((t) => t.id === activeTopic) ?? null,
    [activeTopic],
  );

  const filteredTopics = useMemo(() => {
    if (!search.trim()) return FINANCIAL_TOPICS;
    const q = search.toLowerCase();
    return FINANCIAL_TOPICS.filter(
      (t) =>
        t.label.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }, [search]);

  function handleTopicClick(topic: FinancialTopic) {
    const nextId = activeTopic === topic.id ? null : topic.id;
    const nextTopic = nextId ? topic : null;
    setInternalSelected(nextId);
    onTopicSelect?.(nextTopic);
  }

  function handleClear() {
    setInternalSelected(null);
    onTopicSelect?.(null);
  }

  return (
    <section className="space-y-10">
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 px-8 py-12 md:px-14 md:py-16 text-white"
      >
        {/* Decorative orbs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80 backdrop-blur-sm"
          >
            <IconSparkles size={12} />
            Discovery Hub
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="mb-4 text-3xl font-extrabold leading-tight md:text-4xl lg:text-[2.6rem]"
          >
            Explore the{' '}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              World of Finance
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="max-w-lg text-base leading-relaxed text-white/70"
          >
            Discover investing, budgeting, wealth building, retirement planning,
            and real-world financial skills through interactive learning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-8 flex flex-wrap gap-2"
          >
            {TRENDING_TOPICS.slice(0, 4).map((t) => (
              <button
                key={t.id}
                onClick={() => handleTopicClick(t)}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
              >
                <IconFlame size={12} className="text-orange-300" />
                {t.label}
              </button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* ── Topic Cloud ── */}
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="inline-block h-1 w-6 rounded-full bg-blue-500" />
            Browse Topics
          </h3>

          {/* Search */}
          <div className="relative w-full max-w-xs">
            <IconSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search topics…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              >
                <IconX size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {filteredTopics.map((topic, idx) => (
            <TopicChip
              key={topic.id}
              topic={topic}
              selected={activeTopic === topic.id}
              size="md"
              onClick={handleTopicClick}
              index={idx}
            />
          ))}
          {filteredTopics.length === 0 && (
            <p className="text-sm text-slate-400 py-4">
              No topics match &ldquo;{search}&rdquo;
            </p>
          )}
        </div>
      </div>

      {/* ── Smart Filter Panel ── */}
      <AnimatePresence mode="wait">
        {selectedTopic && (
          <SmartFilterPanel
            key={selectedTopic.id}
            topic={selectedTopic}
            onClose={handleClear}
          />
        )}
      </AnimatePresence>

      {/* ── Two columns: Trending + Community ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Trending This Week */}
        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <IconFlame size={20} className="text-orange-500" />
            Trending This Week
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {TRENDING_TOPICS.map((topic, i) => (
              <TrendingCard
                key={topic.id}
                topic={topic}
                rank={i}
                onSelect={handleTopicClick}
              />
            ))}
          </div>
        </div>

        {/* What the Community is Learning */}
        <div className="space-y-5">
          <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <IconUsers size={20} className="text-blue-500" />
            What the Community is Learning
          </h3>
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            {COMMUNITY_POPULAR.map((topic, idx) => (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
                onClick={() => handleTopicClick(topic)}
                className={cn(
                  'flex w-full items-center gap-4 px-5 py-4 text-left transition-colors',
                  'hover:bg-slate-50',
                  idx < COMMUNITY_POPULAR.length - 1 && 'border-b border-slate-100',
                )}
              >
                {/* Rank */}
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black',
                    idx === 0
                      ? 'bg-amber-100 text-amber-700'
                      : idx === 1
                        ? 'bg-slate-100 text-slate-600'
                        : idx === 2
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-slate-50 text-slate-400',
                  )}
                >
                  {idx + 1}
                </span>

                <span className="text-xl">{topic.emoji}</span>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{topic.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {topic.learnerCount.toLocaleString()} learners
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  {idx === 0 && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      #1 This Week
                    </span>
                  )}
                  {topic.growthPercent >= 20 && idx !== 0 && (
                    <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600">
                      <IconTrendingUp size={10} />+{topic.growthPercent}%
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <IconMessageCircle size={12} />
                    {topic.discussionCount}
                  </span>
                </div>

                <IconChevronRight size={16} className="text-slate-300 shrink-0" />
              </motion.button>
            ))}
          </div>

          {/* Jump to Community link */}
          <Link
            href="/community"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Join the conversation
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
