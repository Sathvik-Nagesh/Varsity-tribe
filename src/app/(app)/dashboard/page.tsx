'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { mockDB } from '@/services/mockDB';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import {
  IconBulb,
  IconX,
  IconPlus,
  IconShield,
  IconPlane,
  IconSchool,
  IconCar,
  IconHome,
  IconHeart,
  IconSunHigh,
  IconShoppingCart,
  IconCircleCheck,
  IconCalculator,
  IconTarget,
  IconReceipt,
  IconChartPie,
  IconArrowUp,
  IconTrophy,
} from '@tabler/icons-react';
import { useUserStore, selectPersonaTrack, selectLevel, selectRecommendedActions } from '@/stores/useUserStore';
import { useGoalStore, selectConflicts } from '@/stores/useGoalStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/cn';
import type { GoalType, PersonaTrack, UserLevel } from '@/types';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import { formatCurrency } from '@/lib/formatCurrency';

/* ─── Goal Icon Map ─────────────────────────────────────────────────── */

const goalIconMap: Record<GoalType, React.ElementType<any>> = {
  'emergency-fund': IconShield,
  travel: IconPlane,
  'higher-education': IconSchool,
  vehicle: IconCar,
  'home-down-payment': IconHome,
  wedding: IconHeart,
  retirement: IconSunHigh,
  'major-purchase': IconShoppingCart,
};

const goalColorMap: Record<GoalType, string> = {
  'emergency-fund': 'bg-blue-500/10 text-blue-500',
  travel: 'bg-amber-500/10 text-amber-500',
  'higher-education': 'bg-violet-500/10 text-violet-500',
  vehicle: 'bg-emerald-500/10 text-emerald-500',
  'home-down-payment': 'bg-rose-500/10 text-rose-500',
  wedding: 'bg-pink-500/10 text-pink-500',
  retirement: 'bg-orange-500/10 text-orange-500',
  'major-purchase': 'bg-cyan-500/10 text-cyan-500',
};

/* ─── Level Badge Variant Map ───────────────────────────────────────── */

const levelBadgeVariant: Record<UserLevel, 'neutral' | 'success' | 'primary' | 'warning' | 'danger'> = {
  seedling: 'neutral',
  sprout: 'success',
  investor: 'primary',
  strategist: 'warning',
  'tribe-leader': 'danger',
};

/* ─── Track Descriptions ────────────────────────────────────────────── */

const trackDescriptions: Record<PersonaTrack, { title: string; description: string }> = {
  student: {
    title: 'Student Track',
    description: 'Build strong financial foundations — learn budgeting, start micro-investing, and understand the power of compounding early.',
  },
  'young-professional': {
    title: 'Young Professional Track',
    description: 'Accelerate your wealth creation — master salary structuring, tax planning, and build a diversified investment portfolio.',
  },
  family: {
    title: 'Family Track',
    description: 'Secure your family\'s future — plan for education, optimize insurance, and create a robust multi-goal strategy.',
  },
  'pre-retirement': {
    title: 'Pre-Retirement Track',
    description: 'Prepare for a comfortable retirement — shift to capital preservation, understand annuities, and plan systematic withdrawals.',
  },
};

// Mock data moved to src/services/mockDB.ts

/* ─── Helpers ───────────────────────────────────────────────────────── */

function formatTrackLabel(track: string): string {
  return track
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getProgressColor(progress: number): 'danger' | 'warning' | 'primary' | 'success' {
  if (progress < 25) return 'danger';
  if (progress < 50) return 'warning';
  if (progress < 75) return 'primary';
  return 'success';
}

/* ─── Loading Skeleton ──────────────────────────────────────────────── */

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 rounded-[var(--radius-md)] bg-brand-surface-elevated" />
          <div className="h-5 w-32 rounded-[var(--radius-sm)] bg-brand-surface-elevated" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-6 w-20 rounded-[var(--radius-sm)] bg-brand-surface-elevated ml-auto" />
          <div className="h-4 w-28 rounded-[var(--radius-sm)] bg-brand-surface-elevated ml-auto" />
        </div>
      </div>

      {/* Nudge skeleton */}
      <div className="h-16 w-full rounded-[var(--radius-md)] bg-brand-surface-elevated" />

      {/* Goals skeleton */}
      <div className="space-y-3">
        <div className="h-7 w-32 rounded-[var(--radius-sm)] bg-brand-surface-elevated" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-48 rounded-[var(--radius-lg)] bg-brand-surface-elevated" />
          <div className="h-48 rounded-[var(--radius-lg)] bg-brand-surface-elevated" />
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="space-y-3">
        <div className="h-7 w-44 rounded-[var(--radius-sm)] bg-brand-surface-elevated" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-20 rounded-[var(--radius-lg)] bg-brand-surface-elevated" />
          <div className="h-20 rounded-[var(--radius-lg)] bg-brand-surface-elevated" />
          <div className="h-20 rounded-[var(--radius-lg)] bg-brand-surface-elevated" />
        </div>
      </div>

      {/* Learning skeleton */}
      <div className="space-y-3">
        <div className="h-7 w-40 rounded-[var(--radius-sm)] bg-brand-surface-elevated" />
        <div className="h-40 rounded-[var(--radius-lg)] bg-brand-surface-elevated" />
      </div>
    </div>
  );
}

/* ─── Section Wrapper ───────────────────────────────────────────────── */

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Memoized List Components ──────────────────────────────────────── */

const QuickToolsList = React.memo(({ tools }: { tools: any[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {tools.map((tool) => {
      const ToolIcon = tool.icon;
      return (
        <Link key={tool.title} href={tool.href}>
          <motion.div whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(56, 126, 209, 0.4)" }} transition={{ duration: 0.2 }} className="h-full rounded-2xl">
            <Card hoverable className="p-4 h-full cursor-pointer">
              <div className="space-y-3">
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    tool.color
                  )}
                >
                  <ToolIcon size={20} />
                </div>
                <h3 className="text-h3">{tool.title}</h3>
                <p className="text-small text-brand-text-secondary">
                  {tool.description}
                </p>
              </div>
            </Card>
          </motion.div>
        </Link>
      );
    })}
  </div>
));
QuickToolsList.displayName = 'QuickToolsList';

const UpcomingEventsList = React.memo(({ events }: { events: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {events.map((event) => (
      <Card key={event.id} hoverable className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-h3 text-brand-text-primary">{event.title}</h3>
            <p className="text-small text-brand-primary font-medium mt-1">{event.date}</p>
            <p className="text-small text-brand-text-secondary mt-1">
              {event.attendees} attending
            </p>
          </div>
          <Button variant="secondary" size="sm">RSVP</Button>
        </div>
      </Card>
    ))}
  </div>
));
UpcomingEventsList.displayName = 'UpcomingEventsList';

const LiveActivitiesList = React.memo(({ activities }: { activities: any[] }) => (
  <div className="space-y-3">
    {activities.map((act) => (
      <div key={act.id} className="flex items-center justify-between text-small">
        <div className="flex items-center gap-2 truncate">
          <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse shrink-0" />
          <span className="truncate">
            <strong className="text-brand-text-primary">{act.user}</strong>{' '}
            <span className="text-brand-text-secondary">{act.action}</span>
          </span>
        </div>
        <span className="text-brand-text-tertiary shrink-0 ml-2">{act.time}</span>
      </div>
    ))}
  </div>
));
LiveActivitiesList.displayName = 'LiveActivitiesList';

const CommunityPostsList = React.memo(({ posts }: { posts: any[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {posts.slice(0, 2).map((post) => (
      <Card key={post.username} variant="default" className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary text-small font-semibold">
              {post.initials}
            </div>
            <span className="text-body font-medium text-brand-text-primary">
              {post.username}
            </span>
          </div>
          <p className="text-small text-brand-text-secondary leading-relaxed">
            {post.content}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-small text-brand-text-tertiary">
              <IconArrowUp size={14} />
              <span>{post.upvotes}</span>
            </div>
            <Badge variant="neutral" size="sm">
              #{post.tag}
            </Badge>
          </div>
        </div>
      </Card>
    ))}
  </div>
));
CommunityPostsList.displayName = 'CommunityPostsList';

const TopLeadersList = React.memo(({ leaders }: { leaders: any[] }) => (
  <div className="space-y-4">
    {leaders.map((leader, index) => (
      <div key={leader.id} className="flex items-center gap-3">
        <div className="w-6 text-center font-bold text-brand-text-tertiary">
          #{index + 1}
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-surface-elevated flex items-center justify-center text-xl shrink-0">
          {leader.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-brand-text-primary truncate">
            {leader.name}
          </p>
          <p className="text-xs text-brand-text-secondary truncate">
            {leader.title}
          </p>
        </div>
        <div className="text-right shrink-0 font-bold text-brand-primary text-sm">
          {leader.xp.toLocaleString()} XP
        </div>
      </div>
    ))}
    <div className="pt-3 border-t border-brand-border">
      <div className="flex items-center justify-between text-sm">
        <span className="text-brand-text-secondary">Your Rank</span>
        <span className="font-bold text-brand-primary">#1024</span>
      </div>
    </div>
  </div>
));
TopLeadersList.displayName = 'TopLeadersList';

/* ─── Dashboard Page ────────────────────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter();
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  // Local state for mock data
  const [events, setEvents] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [leaders, setLeaders] = useState<any[]>([]);
  const [tools, setTools] = useState<any[]>([]);

  useEffect(() => {
    mockDB.getUpcomingEvents().then(setEvents);
    mockDB.getLiveActivities().then(setActivities);
    mockDB.getCommunityPosts().then(setPosts);
    mockDB.getTopLeaders().then(setLeaders);
    mockDB.getQuickTools().then(setTools);
  }, []);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const { onboardingCompleted, xp, streak, currency, financialHealthScore } = useUserStore();
  const personaTrack = useUserStore(selectPersonaTrack);
  const level = useUserStore(selectLevel);
  const recommendedActions = useUserStore(useShallow(selectRecommendedActions));

  const { goals } = useGoalStore();
  const conflicts = useGoalStore(useShallow(selectConflicts(50000))); // Hardcoded budget for now since it was a mock

  /* ── Pre-mount: skeleton ── */
  if (!mounted) return <LoadingSkeleton />;

  /* ── Post-mount: redirect if not onboarded ── */
  if (!onboardingCompleted) {
    router.push('/onboarding');
    return null;
  }

  /* ── Nudge message ── */
  const nudgeMessage =
    goals.length === 0
      ? "You haven't set any goals yet. Start with an Emergency Fund to build your safety net."
      : conflicts.length > 0
        ? conflicts[0].message
        : "You're on track! Keep up the momentum with your savings goals.";

  const greeting = getGreeting();
  const trackInfo = trackDescriptions[personaTrack];

  return (
    <PageLayout>
      <Container>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-8 pb-4"
        >
          {/* ═══ 1. Header / Greeting ═══ */}
          <Section delay={0}>
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                    {greeting}, Sathvik 👋
                  </h1>
                  <p className="text-body text-brand-text-secondary mt-1">Ready to continue your financial journey?</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="primary" size="md">
                      {formatTrackLabel(level)} • Level {Math.floor(xp / 500) + 1}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <AnimatePresence>
                {!nudgeDismissed && (
                  <motion.div
                    layout
                    exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0, padding: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-3 rounded-[var(--radius-md)] border-l-4 border-brand-primary bg-brand-primary/5 p-4"
                  >
                    <IconBulb className="mt-0.5 shrink-0 text-brand-primary" size={20} />
                    <p className="text-body text-brand-text-primary flex-1">{nudgeMessage}</p>
                    <button
                      onClick={() => setNudgeDismissed(true)}
                      className="shrink-0 rounded-[var(--radius-sm)] p-1 text-brand-text-tertiary hover:bg-brand-surface-elevated hover:text-brand-text-primary transition-colors"
                      aria-label="Dismiss nudge"
                    >
                      <IconX size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Section>

          {/* ═══ Main Dashboard Grid ═══ */}
          <Section delay={0.05}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* ─── ROW 1 ─── */}
              
              {/* Continue Learning */}
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-h3 font-semibold text-brand-text-primary">Continue Learning</h2>
                <Card variant="elevated" className="p-4 flex flex-col justify-center rounded-[var(--radius-lg)] shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <IconSchool size={20} className="text-brand-primary" />
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-brand-text-primary truncate pr-2">Investing 101</h3>
                        <span className="text-xs font-bold text-brand-primary shrink-0">75% Complete</span>
                      </div>
                      <ProgressBar value={75} max={100} color="primary" size="sm" />
                      <p className="text-xs text-brand-text-secondary truncate">
                        Next: Power of compounding.
                      </p>
                    </div>
                    <Button variant="primary" size="sm" className="shrink-0">
                      Resume
                    </Button>
                  </div>
                </Card>
              </div>

              {/* XP Widget */}
              <div className="lg:col-span-1 space-y-3">
                <h2 className="text-h3 font-semibold text-brand-text-primary">Experience</h2>
                <Card variant="elevated" className="p-4 flex flex-col justify-center rounded-[var(--radius-lg)] shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-brand-primary">{xp.toLocaleString()} XP</span>
                    <IconTrophy size={20} className="text-brand-primary" />
                  </div>
                  <ProgressBar value={xp % 500} max={500} color="primary" size="sm" />
                  <p className="text-xs text-brand-text-secondary mt-2">
                    {500 - (xp % 500)} XP to Next Level
                  </p>
                </Card>
              </div>

              {/* Streak Widget */}
              <div className="lg:col-span-1 space-y-3">
                <h2 className="text-h3 font-semibold text-brand-text-primary">Streak</h2>
                <Card variant="elevated" className="p-4 flex flex-col justify-center rounded-[var(--radius-lg)] shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl font-bold text-orange-500">{streak} Days</span>
                    <span className="text-xl">🔥</span>
                  </div>
                  <p className="text-xs text-brand-text-secondary mt-2">
                    You're on fire! Keep it up.
                  </p>
                </Card>
              </div>

              {/* ─── ROW 2 ─── */}
              
              {/* Goals Overview */}
              <div className="lg:col-span-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-h3 font-semibold text-brand-text-primary">Goals Overview</h2>
                  <Button variant="secondary" size="sm" className="h-7 text-xs px-2" icon={<IconPlus size={14} />}>
                    Add Goal
                  </Button>
                </div>
                {goals.length === 0 ? (
                  <Card variant="default" className="p-4 text-center rounded-[var(--radius-lg)] shadow-sm">
                    <p className="text-sm text-brand-text-secondary">
                      No goals yet. Add your first goal to get started!
                    </p>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.slice(0, 3).map((goal) => {
                      const GoalIcon = goalIconMap[goal.type] as any;
                      const progress = (goal.currentAmount / goal.targetAmount) * 100;
                      const progressColor = getProgressColor(progress);

                      return (
                        <Card key={goal.id} variant="elevated" className="p-4 rounded-[var(--radius-lg)] shadow-sm flex flex-col">
                          <div className="space-y-3 flex-1">
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  'flex h-8 w-8 items-center justify-center rounded-full shrink-0',
                                  goalColorMap[goal.type]
                                )}
                              >
                                <GoalIcon size={16} />
                              </div>
                              <h3 className="text-sm font-semibold truncate" title={goal.label}>{goal.label}</h3>
                            </div>
                            
                            <ProgressBar
                              value={goal.currentAmount}
                              max={goal.targetAmount}
                              color={progressColor}
                              size="sm"
                            />
                            
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-sm font-bold text-brand-text-primary">
                                {formatCurrency(goal.currentAmount, currency)}
                              </span>
                              <span className="text-xs font-semibold text-brand-text-tertiary">
                                / {formatCurrency(goal.targetAmount, currency)}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between text-[10px] text-brand-text-tertiary mt-auto pt-1">
                              <span>SIP: {formatCurrency(goal.monthlySIP, currency)}</span>
                              <span>
                                {new Date(goal.projectedCompletionDate).toLocaleDateString('en-IN', {
                                  month: 'short',
                                  year: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Financial Health */}
              <div className="lg:col-span-1 space-y-3">
                <h2 className="text-h3 font-semibold text-brand-text-primary">Financial Health</h2>
                <Card variant="elevated" className="p-4 flex flex-col justify-center relative overflow-hidden rounded-[var(--radius-lg)] shadow-sm">
                  <div className="absolute -top-4 -right-4 p-4 opacity-5">
                    <IconShield size={80} />
                  </div>
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Your Score</h3>
                      <IconShield size={16} className="text-brand-success" />
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-bold text-brand-success">{financialHealthScore || 742}</span>
                      <span className="text-xs font-bold text-brand-text-tertiary">/ 1000</span>
                    </div>
                    <ProgressBar value={(financialHealthScore || 742) / 10} max={100} color="success" size="sm" className="mt-3 mb-4" />
                    
                    <div className="flex items-center gap-2 text-xs pt-3 border-t border-brand-border mt-auto">
                      <div className="flex items-center text-brand-success font-semibold bg-brand-success/10 px-1.5 py-0.5 rounded">
                        <IconArrowUp size={12} className="mr-0.5" />
                        Top 26%
                      </div>
                      <span className="text-brand-text-tertiary ml-auto truncate">Ahead of 74%</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* ─── ROW 3 ─── */}
              
              {/* Recommended Modules */}
              <div className="lg:col-span-4 space-y-3">
                <h2 className="text-h3 font-semibold text-brand-text-primary">Recommended Next Steps</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {recommendedActions.slice(0, 4).map((action, i) => (
                    <Card key={i} hoverable className="p-3 rounded-[var(--radius-lg)] shadow-sm flex flex-col h-full">
                      <div className="flex items-start gap-2 flex-1">
                        <IconCircleCheck size={18} className="mt-0.5 shrink-0 text-brand-success" />
                        <p className="text-xs font-medium text-brand-text-primary leading-tight mb-2">{action}</p>
                      </div>
                      <div className="mt-auto pt-2">
                        <Button variant="secondary" size="sm" className="w-full text-[11px] h-7">
                          Start Action
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          </Section>

          {/* ═══ 6. Live Activity Feed ═══ */}
          <Section delay={0.2}>
            <div className="space-y-4">
              <h2 className="text-h2">Live Activity Feed</h2>
              <Card variant="default" className="p-4 rounded-2xl">
                <LiveActivitiesList activities={[
                  { id: 1, user: 'Priya', action: 'completed Investing 101', time: 'just now' },
                  { id: 2, user: 'Rahul', action: 'started SIP in Index Funds', time: '5m ago' },
                  { id: 3, user: 'Anjali', action: 'earned "Debt Free" badge', time: '12m ago' }
                ]} />
              </Card>
            </div>
          </Section>

          {/* ═══ 7. Community Activity & Leaderboard ═══ */}
          <Section delay={0.25}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Community Activity */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-h2">Community Activity</h2>
                  <Link href="/community">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <CommunityPostsList posts={posts} />
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-h2">Leaderboard</h2>
                  <Link href="/leaderboard">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <Card variant="default" className="p-4 rounded-2xl">
                  <TopLeadersList leaders={leaders} />
                </Card>
              </div>
            </div>
          </Section>
          
          {/* ═══ Additional Tools & Events ═══ */}
          <Section delay={0.3}>
            <div className="space-y-4">
              <h2 className="text-h2">Quick Tools</h2>
              <QuickToolsList tools={tools} />
            </div>
          </Section>

          <Section delay={0.35}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-h2">Upcoming Events</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <UpcomingEventsList events={events} />
            </div>
          </Section>

        </motion.div>
      </Container>
    </PageLayout>
  );
}
