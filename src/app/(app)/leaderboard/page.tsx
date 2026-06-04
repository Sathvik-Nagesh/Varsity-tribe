'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockDB } from '@/services/mockDB';
import Link from 'next/link';
import {
  IconTrophy, IconFlame, IconArrowUp, IconArrowDown,
  IconMinus, IconSparkles, IconTarget, IconBook,
  IconChartLine, IconUsers, IconArrowRight, IconLock,
  IconCheck, IconX, IconChevronRight, IconClock,
} from '@tabler/icons-react';
import { cn } from '@/lib/cn';
import { Container } from '@/components/layout/Container';
import { PageLayout } from '@/components/layout/PageLayout';

// ─── Types ───────────────────────────────────────────────────────────────────
type Period = 'This Week' | 'This Month' | 'All Time';
const PERIODS: Period[] = ['This Week', 'This Month', 'All Time'];

// ─── Level System ────────────────────────────────────────────────────────────
const LEVELS = [
  { name: 'Explorer', color: 'text-slate-600',   bg: 'bg-slate-100',   border: 'border-slate-300',   minXp: 0,    maxXp: 999   },
  { name: 'Saver',    color: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-300', minXp: 1000, maxXp: 1999  },
  { name: 'Investor', color: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-300',    minXp: 2000, maxXp: 4999  },
  { name: 'Builder',  color: 'text-purple-700',  bg: 'bg-purple-50',   border: 'border-purple-300',  minXp: 5000, maxXp: 9999  },
  { name: 'Mentor',   color: 'text-amber-700',   bg: 'bg-amber-50',    border: 'border-amber-300',   minXp: 10000, maxXp: Infinity },
];
const getLevel = (xp: number) => LEVELS.find(l => xp >= l.minXp && xp <= l.maxXp) ?? LEVELS[0];
const getNextLevel = (xp: number) => {
  const idx = LEVELS.findIndex(l => xp >= l.minXp && xp <= l.maxXp);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
};

// ─── XP Sources ──────────────────────────────────────────────────────────────
const XP_SOURCES = [
  { label: 'Learning Modules',       xp: 100,  icon: IconBook        },
  { label: 'Lab Simulations',        xp: 150,  icon: IconChartLine   },
  { label: 'Advanced Labs',          xp: 250,  icon: IconSparkles    },
  { label: 'Goal Completion',        xp: 200,  icon: IconTarget      },
  { label: 'Daily Streak',           xp: 10,   icon: IconFlame, note: 'per day' },
  { label: 'Community Posts',        xp: 50,   icon: IconUsers       },
  { label: 'Events Attended',        xp: 100,  icon: IconClock       },
];

// ─── Achievements ─────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 'a1', label: 'First Goal Created',    emoji: '🎯', unlocked: true  },
  { id: 'a2', label: 'Emergency Fund Hero',   emoji: '🛡️', unlocked: true  },
  { id: 'a3', label: 'SIP Starter',           emoji: '🔄', unlocked: true  },
  { id: 'a4', label: 'Investing Explorer',    emoji: '📈', unlocked: true  },
  { id: 'a5', label: '14 Day Streak',         emoji: '🔥', unlocked: true  },
  { id: 'a6', label: 'Wealth Builder',        emoji: '💎', unlocked: false },
  { id: 'a7', label: 'Community Mentor',      emoji: '🏫', unlocked: false },
  { id: 'a8', label: '30 Day Streak',         emoji: '⚡', unlocked: false },
];

// ─── Animated Count-Up ───────────────────────────────────────────────────────
function CountUp({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(p * to));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

// ─── Rank Movement ────────────────────────────────────────────────────────────
function RankMovement({ trend, movement }: { trend: string; movement: number }) {
  if (trend === 'up' && movement > 0)
    return (
      <span className="flex items-center gap-0.5 text-emerald-600 font-bold text-xs">
        <IconArrowUp size={13} />▲{movement}
      </span>
    );
  if (trend === 'down' && movement > 0)
    return (
      <span className="flex items-center gap-0.5 text-rose-500 font-bold text-xs">
        <IconArrowDown size={13} />▼{movement}
      </span>
    );
  return <IconMinus size={14} className="text-slate-300" />;
}

// ─── Podium Card ──────────────────────────────────────────────────────────────
const PODIUM_META = [
  { place: 1, medal: '🥇', accentBorder: 'border-amber-300', accentBg: 'from-amber-50 to-white', shadow: 'shadow-amber-100', size: 'w-20 h-20', label: 'Champion', delay: 0.1 },
  { place: 2, medal: '🥈', accentBorder: 'border-slate-300', accentBg: 'from-slate-50 to-white', shadow: 'shadow-slate-100', size: 'w-16 h-16', label: 'Runner-up', delay: 0.2 },
  { place: 3, medal: '🥉', accentBorder: 'border-orange-200', accentBg: 'from-orange-50 to-white', shadow: 'shadow-orange-100', size: 'w-16 h-16', label: 'Third Place', delay: 0.3 },
];

function PodiumCard({ user, meta }: { user: any; meta: typeof PODIUM_META[0] }) {
  const lvl = getLevel(user.xp);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: meta.delay, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={cn(
        'relative flex flex-col items-center gap-3 rounded-3xl border bg-gradient-to-b p-6 text-center',
        'shadow-xl transition-shadow duration-300 hover:shadow-2xl',
        meta.accentBorder, meta.accentBg, meta.shadow,
      )}
    >
      {/* Medal */}
      <span className="text-3xl leading-none">{meta.medal}</span>

      {/* Avatar */}
      <div className={cn('rounded-full bg-white border-4 flex items-center justify-center text-3xl shadow-md', meta.accentBorder, meta.size)}>
        {user.avatar}
      </div>

      {/* Name & Level */}
      <div>
        <p className="font-bold text-slate-900 text-base leading-tight">{user.name}</p>
        <span className={cn('inline-block mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border', lvl.color, lvl.bg, lvl.border)}>
          {user.level}
        </span>
      </div>

      {/* Stats */}
      <div className="w-full space-y-1.5 border-t border-slate-100 pt-3">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Total XP</span>
          <span className="text-slate-800 font-bold">{user.xp.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">This week</span>
          <span className="text-emerald-600 font-bold">+{user.weeklyXp?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Streak</span>
          <span className="text-orange-500 font-bold flex items-center gap-0.5">
            <IconFlame size={12} />{user.streak}d
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── XP Modal ─────────────────────────────────────────────────────────────────
function XpModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <IconSparkles className="text-blue-500" size={22} />
            How XP Works
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
            <IconX size={18} className="text-slate-500" />
          </button>
        </div>
        <div className="space-y-3">
          {XP_SOURCES.map(src => {
            const Icon = src.icon;
            return (
              <div key={src.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{src.label}</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  +{src.xp} XP{src.note ? <span className="text-slate-400 font-normal"> /{src.note.replace('per ', '')}</span> : ''}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('This Week');
  const [leaders, setLeaders] = useState<any[]>([]);
  const [showXpModal, setShowXpModal] = useState(false);

  useEffect(() => { mockDB.getMockLeaders().then(setLeaders); }, []);

  const rank1 = leaders.find(u => u.rank === 1);
  const rank2 = leaders.find(u => u.rank === 2);
  const rank3 = leaders.find(u => u.rank === 3);
  const others = leaders.filter(u => u.rank > 3 && !u.isCurrentUser).sort((a, b) => a.rank - b.rank);
  const currentUser = leaders.find(u => u.isCurrentUser);

  const nextLvl = currentUser ? getNextLevel(currentUser.xp) : null;
  const xpToNext = nextLvl ? nextLvl.minXp - (currentUser?.xp ?? 0) : 0;
  const xpAboveRank = 220; // mock gap to next rank
  const currentLvl = currentUser ? getLevel(currentUser.xp) : LEVELS[0];

  // Community spotlight data (mock)
  const spotlights = [
    { label: 'Top Learner This Week', name: rank1?.name ?? '—', value: `${rank1?.weeklyXp?.toLocaleString()} XP`, emoji: '🏆' },
    { label: 'Longest Active Streak',  name: rank1?.name ?? '—', value: `${rank1?.streak} days`,                  emoji: '🔥' },
    { label: 'Most Modules Completed', name: rank1?.name ?? '—', value: `${rank1?.modulesCompleted} modules`,     emoji: '📚' },
  ];

  return (
    <PageLayout>
      <AnimatePresence>{showXpModal && <XpModal onClose={() => setShowXpModal(false)} />}</AnimatePresence>

      <Container>
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 pb-20 space-y-14">

          {/* ── Hero ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-14 text-center text-white"
          >
            {/* subtle orbs */}
            <div className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-8 right-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative z-10">
              <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}>
                <IconTrophy size={52} className="mx-auto text-amber-400 mb-4" />
              </motion.div>
              <h1 className="text-hero mb-2 text-white">Hall of Fame</h1>
              <p className="text-slate-400 text-base font-medium mb-1">Learn. Grow. Lead.</p>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Recognizing learners making the biggest impact in the community.
              </p>

              {/* Community stats */}
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  { label: 'Total Learners',     value: 12453 },
                  { label: 'XP Earned This Week', value: 284000 },
                  { label: 'Modules Completed',  value: 9820  },
                  { label: 'Active Streaks',     value: 3410  },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="rounded-2xl bg-white/5 border border-white/10 py-4 px-3"
                  >
                    <p className="text-xl font-black text-white">
                      <CountUp to={stat.value} />
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium leading-tight">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── Period Filter ── */}
          <div className="flex justify-center">
            <div className="relative inline-flex items-center rounded-full bg-slate-100 p-1 gap-1">
              {PERIODS.map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={cn(
                    'relative px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none',
                    period === p ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {period === p && (
                    <motion.span
                      layoutId="period-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10">{p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Podium ── */}
          {rank1 && rank2 && rank3 && (
            <section>
              <h2 className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
                Top Performers
              </h2>
              {/* Desktop: 2nd – 1st – 3rd layout */}
              <div className="hidden sm:grid grid-cols-3 gap-5 items-end max-w-2xl mx-auto">
                <PodiumCard user={rank2} meta={PODIUM_META[1]} />
                <PodiumCard user={rank1} meta={PODIUM_META[0]} />
                <PodiumCard user={rank3} meta={PODIUM_META[2]} />
              </div>
              {/* Mobile: stacked */}
              <div className="flex sm:hidden flex-col gap-4">
                <PodiumCard user={rank1} meta={PODIUM_META[0]} />
                <PodiumCard user={rank2} meta={PODIUM_META[1]} />
                <PodiumCard user={rank3} meta={PODIUM_META[2]} />
              </div>
            </section>
          )}

          {/* ── Your Position Card ── */}
          {currentUser && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.45 }}
              className="rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center text-3xl shadow-sm">
                      {currentUser.avatar}
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[10px] font-black rounded-full w-6 h-6 flex items-center justify-center shadow">
                      #{currentUser.rank}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-0.5">Your Position</p>
                    <h3 className="text-2xl font-black text-slate-900">Rank #{currentUser.rank}</h3>
                    <p className="text-slate-500 text-sm mt-0.5">
                      <span className="font-bold text-emerald-600">+{currentUser.weeklyXp} XP</span> this week
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="text-center rounded-2xl bg-white border border-blue-100 px-5 py-3 shadow-sm">
                    <p className="text-2xl font-black text-slate-900">{currentUser.xp.toLocaleString()}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Total XP</p>
                  </div>
                  <div className="text-center rounded-2xl bg-white border border-blue-100 px-5 py-3 shadow-sm">
                    <p className="text-2xl font-black text-amber-500 flex items-center justify-center gap-1">
                      <IconFlame size={18} />{currentUser.streak}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Day Streak</p>
                  </div>
                </div>
              </div>

              {/* Progress to next rank */}
              <div className="mt-6 rounded-2xl bg-white border border-blue-100 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700">
                    Only <span className="text-blue-600 font-bold">{xpAboveRank} XP</span> away from Rank #{currentUser.rank - 1}
                  </p>
                  {nextLvl && (
                    <span className={cn('text-xs font-bold rounded-full px-2 py-0.5 border', nextLvl.color, nextLvl.bg, nextLvl.border)}>
                      Next: {nextLvl.name}
                    </span>
                  )}
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(((currentUser.xp - (currentLvl?.minXp ?? 0)) / ((nextLvl?.minXp ?? currentUser.xp + 1) - (currentLvl?.minXp ?? 0))) * 100, 100)}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                  />
                </div>
                {nextLvl && (
                  <p className="text-xs text-slate-400 mt-1.5">{xpToNext.toLocaleString()} XP to reach {nextLvl.name}</p>
                )}
              </div>

              <Link
                href="/learn"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Continue Learning <IconArrowRight size={16} />
              </Link>
            </motion.section>
          )}

          {/* ── Full Leaderboard Table ── */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IconChartLine size={20} className="text-blue-500" />
              Full Rankings
            </h2>

            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="hidden sm:grid grid-cols-[48px_1fr_96px_100px_100px_80px_72px_64px] gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50">
                {['Rank', 'Learner', 'Level', 'Total XP', 'This Week', 'Modules', 'Streak', 'Move'].map(h => (
                  <span key={h} className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{h}</span>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={period}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {others.map((user, idx) => {
                    const lvl = getLevel(user.xp);
                    return (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                        className={cn(
                          'group flex items-center gap-2 px-4 sm:px-6 py-4',
                          'border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors',
                          'sm:grid sm:grid-cols-[48px_1fr_96px_100px_100px_80px_72px_64px]',
                        )}
                      >
                        {/* Rank */}
                        <span className="text-sm font-black text-slate-400 text-center w-12 shrink-0">
                          #{user.rank}
                        </span>

                        {/* User */}
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0 border border-slate-200">
                            {user.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.title}</p>
                          </div>
                        </div>

                        {/* Level badge */}
                        <span className={cn('hidden sm:inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold border w-fit', lvl.color, lvl.bg, lvl.border)}>
                          {user.level}
                        </span>

                        {/* Total XP */}
                        <span className="hidden sm:block text-sm font-bold text-slate-700">{user.xp.toLocaleString()}</span>

                        {/* Weekly XP */}
                        <span className="hidden sm:block text-sm font-bold text-emerald-600">+{user.weeklyXp?.toLocaleString()}</span>

                        {/* Modules */}
                        <span className="hidden sm:flex items-center gap-1 text-sm text-slate-500 font-medium">
                          <IconBook size={13} className="text-slate-300" />{user.modulesCompleted}
                        </span>

                        {/* Streak */}
                        <span className="hidden sm:flex items-center gap-1 text-sm text-orange-500 font-bold">
                          <IconFlame size={13} />{user.streak}d
                        </span>

                        {/* Movement */}
                        <div className="hidden sm:flex justify-center">
                          <RankMovement trend={user.trend} movement={user.rankMovement} />
                        </div>

                        {/* Mobile: weekly xp + movement */}
                        <div className="flex sm:hidden flex-col items-end shrink-0 gap-1">
                          <span className="text-xs font-bold text-emerald-600">+{user.weeklyXp}</span>
                          <RankMovement trend={user.trend} movement={user.rankMovement} />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

          {/* ── Two-col: Achievements + Level Path ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Achievement Gallery */}
            <section className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <IconSparkles size={20} className="text-purple-500" />
                Achievements & Badges
              </h2>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                {ACHIEVEMENTS.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={cn(
                      'flex items-center gap-4 p-3 rounded-2xl border transition-colors',
                      a.unlocked ? 'bg-slate-50 border-slate-200' : 'bg-slate-50/50 border-slate-100 opacity-60',
                    )}
                  >
                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0', a.unlocked ? 'bg-white shadow-sm border border-slate-200' : 'bg-slate-100')}>
                      {a.unlocked ? a.emoji : <IconLock size={16} className="text-slate-400" />}
                    </div>
                    <p className={cn('text-sm font-semibold flex-1', a.unlocked ? 'text-slate-800' : 'text-slate-400')}>{a.label}</p>
                    {a.unlocked
                      ? <IconCheck size={16} className="text-emerald-500 shrink-0" />
                      : <span className="text-[10px] font-bold text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">Locked</span>
                    }
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Level Progress System */}
            <section className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <IconTarget size={20} className="text-blue-500" />
                Level Path
              </h2>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                {LEVELS.map((lvl, i) => {
                  const isCurrentLevel = currentUser && getLevel(currentUser.xp)?.name === lvl.name;
                  const isUnlocked = currentUser && currentUser.xp >= lvl.minXp;
                  return (
                    <motion.div
                      key={lvl.name}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className={cn(
                        'relative flex items-center gap-4 p-4 rounded-2xl border transition-all',
                        isCurrentLevel ? `${lvl.bg} ${lvl.border} border-2 shadow-sm` : isUnlocked ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100 opacity-60',
                      )}
                    >
                      {isCurrentLevel && (
                        <span className={cn('absolute top-2 right-3 text-[10px] font-black uppercase tracking-wider', lvl.color)}>
                          You are here
                        </span>
                      )}
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black border-2 shrink-0', lvl.bg, lvl.border)}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-bold text-sm', isUnlocked ? lvl.color : 'text-slate-400')}>{lvl.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {lvl.maxXp === Infinity ? `${lvl.minXp.toLocaleString()}+ XP` : `${lvl.minXp.toLocaleString()} – ${lvl.maxXp.toLocaleString()} XP`}
                        </p>
                        {isCurrentLevel && nextLvl && (
                          <div className="mt-2 h-1.5 rounded-full bg-white/60 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min(((currentUser.xp - lvl.minXp) / (nextLvl.minXp - lvl.minXp)) * 100, 100)}%` }}
                              transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
                              className={cn('h-full rounded-full', lvl.color.replace('text-', 'bg-'))}
                            />
                          </div>
                        )}
                      </div>
                      {isUnlocked && !isCurrentLevel && <IconCheck size={16} className="text-emerald-500 shrink-0" />}
                      {!isUnlocked && <IconLock size={14} className="text-slate-300 shrink-0" />}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* ── Community Spotlights ── */}
          <section className="space-y-5">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <IconUsers size={20} className="text-emerald-500" />
              Community Spotlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {spotlights.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <p className="text-2xl mb-3">{s.emoji}</p>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{s.label}</p>
                  <p className="text-base font-bold text-slate-900">{s.name}</p>
                  <p className="text-sm font-semibold text-blue-600 mt-0.5">{s.value}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ── XP Transparency ── */}
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <IconSparkles size={20} className="text-amber-500" />
                  XP Sources
                </h2>
                <p className="text-sm text-slate-400 mt-1">Every action on TRIBE earns you XP.</p>
              </div>
              <button
                onClick={() => setShowXpModal(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Full breakdown <IconChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {XP_SOURCES.map(src => {
                const Icon = src.icon;
                return (
                  <div key={src.label} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col gap-2">
                    <div className="p-2 rounded-xl bg-white w-fit shadow-sm border border-slate-100">
                      <Icon size={16} className="text-blue-500" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-tight">{src.label}</p>
                    <p className="text-base font-black text-blue-600">+{src.xp} XP</p>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </Container>
    </PageLayout>
  );
}
