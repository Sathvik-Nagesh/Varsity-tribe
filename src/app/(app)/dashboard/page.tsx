'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { mockDB } from '@/services/mockDB';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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

  const { onboardingCompleted, xp, streak, currency } = useUserStore();
  const personaTrack = useUserStore(selectPersonaTrack);
  const level = useUserStore(selectLevel);
  const recommendedActions = useUserStore(selectRecommendedActions);

  const { goals } = useGoalStore();
  const conflicts = useGoalStore(selectConflicts(50000)); // Hardcoded budget for now since it was a mock

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
          {/* ═══ A. Greeting Header & Health Score ═══ */}
          <Section delay={0}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Welcome & Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h1 className="text-h1">{greeting} 👋</h1>
                    <Badge variant="primary" size="md">
                      {formatTrackLabel(personaTrack)}
                    </Badge>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-h3 font-mono text-brand-primary">{xp} XP</span>
                    <span className="text-small text-brand-text-secondary">🔥 {streak} day streak</span>
                    <Badge variant={levelBadgeVariant[level]} size="sm">
                      {formatTrackLabel(level)}
                    </Badge>
                  </div>
                </div>
                
                {/* ═══ B. Smart Nudge Banner ═══ */}
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

              {/* Financial Health Score */}
              <div className="lg:col-span-1">
                <Card variant="elevated" className="p-5 flex flex-col h-full justify-center">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-h3">Financial Health</h3>
                    <IconShield size={24} className="text-brand-success" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-[2.5rem] font-bold leading-none text-brand-success">742</span>
                    <span className="text-body text-brand-text-tertiary mb-1">/ 1000</span>
                  </div>
                  <p className="text-small text-brand-text-secondary mt-2">Your financial foundation is looking strong!</p>
                  <ProgressBar value={74.2} max={100} color="success" size="sm" className="mt-4" />
                </Card>
              </div>
            </div>
          </Section>

          {/* ═══ C. Goals Section ═══ */}
          <Section delay={0.1}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-h2">Your Goals</h2>
                <Button variant="secondary" size="sm" icon={<IconPlus size={16} />}>
                  Add Goal
                </Button>
              </div>

              {goals.length === 0 ? (
                <Card variant="default" className="p-8 text-center">
                  <p className="text-body text-brand-text-secondary">
                    No goals yet. Add your first goal to get started!
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => {
                    const GoalIcon = goalIconMap[goal.type] as any;
                    const progress = (goal.currentAmount / goal.targetAmount) * 100;
                    const progressColor = getProgressColor(progress);

                    return (
                      <Card key={goal.id} variant="elevated" className="p-5">
                        <div className="space-y-4">
                          {/* Icon + Label */}
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                'flex h-10 w-10 items-center justify-center rounded-full',
                                goalColorMap[goal.type]
                              )}
                            >
                              <GoalIcon size={20} />
                            </div>
                            <h3 className="text-h3">{goal.label}</h3>
                          </div>

                          {/* Progress */}
                          <ProgressBar
                            value={goal.currentAmount}
                            max={goal.targetAmount}
                            color={progressColor}
                            size="md"
                          />

                          {/* Amount */}
                          <p className="text-small text-brand-text-secondary">
                            {formatCurrency(goal.currentAmount, currency)}{' '}
                            <span className="text-brand-text-tertiary">
                              of {formatCurrency(goal.targetAmount, currency)}
                            </span>
                          </p>

                          {/* SIP + projected date */}
                          <div className="flex items-center justify-between text-small text-brand-text-tertiary">
                            <span>SIP: {formatCurrency(goal.monthlySIP, currency)}/mo</span>
                            <span>
                              Target:{' '}
                              {new Date(goal.projectedCompletionDate).toLocaleDateString('en-IN', {
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>

                          {/* Milestone dots */}
                          <div className="flex items-center gap-2">
                            {goal.milestones.map((ms, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <div
                                  className={cn(
                                    'h-2.5 w-2.5 rounded-full transition-colors',
                                    ms.reached
                                      ? 'bg-brand-success'
                                      : 'bg-brand-border'
                                  )}
                                />
                                <span className="text-[10px] text-brand-text-tertiary">
                                  {ms.percent}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </Section>

          {/* ═══ D. Recommended Actions ═══ */}
          <Section delay={0.15}>
            <div className="space-y-4">
              <h2 className="text-h2">Recommended for You</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendedActions.slice(0, 3).map((action, i) => (
                  <Card key={i} hoverable className="p-4">
                    <div className="flex items-start gap-3">
                      <IconCircleCheck
                        size={20}
                        className="mt-0.5 shrink-0 text-brand-success"
                      />
                      <div className="flex-1 space-y-2">
                        <p className="text-body text-brand-text-primary">{action}</p>
                        <Button variant="primary" size="sm">
                          Start
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Section>

          {/* ═══ E. Continue Learning & Live Activity ═══ */}
          <Section delay={0.2}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-h2">Continue Learning</h2>
                <Card variant="elevated" className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
                      <IconSchool size={32} className="text-brand-primary" />
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-h3">Salary Negotiation</h3>
                        <span className="text-small font-medium text-brand-primary">75% Complete</span>
                      </div>
                      <ProgressBar value={75} max={100} color="primary" size="md" />
                      <p className="text-small text-brand-text-secondary mt-1">
                        Next up: Leveraging market data for your counter-offer.
                      </p>
                    </div>
                    <Button variant="primary" className="w-full sm:w-auto">
                      Resume
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-h2">Live Activity</h2>
                <Card variant="default" className="p-4 h-[120px] overflow-y-auto">
                  <LiveActivitiesList activities={activities} />
                </Card>
              </div>
            </div>
          </Section>

          {/* ═══ F. Quick Tools ═══ */}
          <Section delay={0.25}>
            <div className="space-y-4">
              <h2 className="text-h2">Quick Tools</h2>
              <QuickToolsList tools={tools} />
            </div>
          </Section>

          {/* ═══ G. Community Preview & Leaderboard ═══ */}
          <Section delay={0.3}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Community */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-h2">From the Community</h2>
                  <Link href="/community">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <CommunityPostsList posts={posts} />
              </div>

              {/* Leaderboard */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-h2">Top Learners</h2>
                  <Link href="/leaderboard">
                    <Button variant="ghost" size="sm">View All</Button>
                  </Link>
                </div>
                <Card variant="default" className="p-4">
                  <TopLeadersList leaders={leaders} />
                </Card>
              </div>
            </div>
          </Section>

          {/* ═══ H. Upcoming Events ═══ */}
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
