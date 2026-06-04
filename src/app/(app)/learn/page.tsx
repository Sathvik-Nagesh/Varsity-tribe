'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconLock, IconCheck, IconClock, IconSparkles,
  IconPlant2, IconBusinessplan, IconReportMoney, IconAmbulance,
  IconBuildingBank, IconShieldLock, IconArrowRight, IconBook, IconFlame,
  IconChartPie, IconChartBar, IconCreditCard, IconCash, IconBriefcase,
  IconReceipt, IconChartLine, IconTrendingDown, IconShoppingBag,
  IconTarget, IconX, IconFilter, IconChevronDown, IconChevronUp,
  IconSearch,
} from '@tabler/icons-react';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/cn';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { useUserStore } from '@/stores/useUserStore';
import { TopicChip } from '@/components/discover/TopicChip';
import {
  FINANCIAL_TOPICS, TRENDING_TOPICS,
  type FinancialTopic,
} from '@/services/topicsDB';

// ─── Data ─────────────────────────────────────────────────────────────────────
const MODULES = [
  { id: 'm1', title: 'Financial Basics', status: 'completed', icon: '📚', xp: 100, duration: '45 min' },
  { id: 'm2', title: 'Emergency Fund',   status: 'completed', icon: '🚑', xp: 100, duration: '30 min' },
  { id: 'm3', title: 'Insurance',        status: 'active',    icon: '☂️', xp: 100, duration: '60 min' },
  { id: 'm4', title: 'Investing',        status: 'locked',    icon: '📈', xp: 150, duration: '90 min' },
  { id: 'm5', title: 'Retirement',       status: 'locked',    icon: '🌴', xp: 200, duration: '75 min' },
];

const SIMULATIONS = [
  { id: 'sim1',  title: 'Rent vs Buy Simulator',       slug: 'rent-vs-buy',          description: 'Compare the long-term financial impact of renting versus buying a home.',           icon: IconBuildingBank, difficulty: 'Intermediate', timeMinutes: 15, xpReward: 250, color: 'from-blue-500/20 to-indigo-500/20',     iconColor: 'text-indigo-500',  borderColor: 'group-hover:border-indigo-500/50', category: 'Simulations',     reason: 'Matches your interest in Real Estate' },
  { id: 'sim2',  title: 'Mutual Fund Builder',         slug: 'mutual-fund-builder',  description: 'Construct your own mutual fund portfolio and backtest it against historical data.', icon: IconChartPie,     difficulty: 'Hard',         timeMinutes: 20, xpReward: 350, color: 'from-emerald-500/20 to-teal-500/20',    iconColor: 'text-emerald-500', borderColor: 'group-hover:border-emerald-500/50', category: 'Interactive Labs', reason: 'Next step after Financial Basics' },
  { id: 'sim3',  title: 'Index Fund Simulator',        slug: 'index-fund-simulator', description: 'Learn how index funds track the market and the impact of expense ratios.',           icon: IconChartBar,     difficulty: 'Beginner',     timeMinutes: 10, xpReward: 150, color: 'from-purple-500/20 to-fuchsia-500/20',  iconColor: 'text-purple-500',  borderColor: 'group-hover:border-purple-500/50',  category: 'Simulations' },
  { id: 'sim4',  title: 'Insurance Decision Simulator',slug: 'insurance-decision',   description: 'Navigate different life events and choose the right insurance coverage.',            icon: IconShieldLock,   difficulty: 'Intermediate', timeMinutes: 15, xpReward: 200, color: 'from-orange-500/20 to-red-500/20',      iconColor: 'text-orange-500',  borderColor: 'group-hover:border-orange-500/50',  category: 'Interactive Labs', reason: 'Because you are on the Insurance module' },
  { id: 'sim5',  title: 'Credit Score Builder',        slug: 'credit-score-builder', description: 'Make financial decisions over a simulated year to build or repair your credit score.',icon: IconCreditCard,   difficulty: 'Intermediate', timeMinutes: 20, xpReward: 250, color: 'from-sky-500/20 to-blue-500/20',        iconColor: 'text-blue-500',    borderColor: 'group-hover:border-blue-500/50',    category: 'Interactive Labs' },
  { id: 'sim6',  title: 'Loan Repayment Simulator',    slug: 'loan-repayment',       description: 'Experiment with snowball vs avalanche repayment strategies to clear debt faster.',    icon: IconCash,         difficulty: 'Beginner',     timeMinutes: 15, xpReward: 150, color: 'from-pink-500/20 to-rose-500/20',       iconColor: 'text-rose-500',    borderColor: 'group-hover:border-rose-500/50',    category: 'Simulations' },
  { id: 'sim7',  title: 'Retirement Planner',          slug: 'retirement-planner',   description: 'Calculate your FIRE number and create a roadmap to financial independence.',         icon: IconPlant2,       difficulty: 'Hard',         timeMinutes: 25, xpReward: 400, color: 'from-green-500/20 to-emerald-500/20',   iconColor: 'text-green-500',   borderColor: 'group-hover:border-green-500/50',   category: 'Interactive Labs' },
  { id: 'sim8',  title: 'Side Hustle Simulator',       slug: 'side-hustle',          description: 'Balance your 9-5 with a side hustle. Manage time, taxes, and burnout.',              icon: IconBriefcase,    difficulty: 'Intermediate', timeMinutes: 20, xpReward: 300, color: 'from-yellow-500/20 to-amber-500/20',    iconColor: 'text-amber-500',   borderColor: 'group-hover:border-amber-500/50',   category: 'Interactive Labs' },
  { id: 'sim9',  title: 'Tax Planning Simulator',      slug: 'tax-planning',         description: 'Optimize your deductions and investments to legally minimize your tax burden.',       icon: IconReceipt,      difficulty: 'Hard',         timeMinutes: 30, xpReward: 450, color: 'from-slate-500/20 to-gray-500/20',      iconColor: 'text-slate-500',   borderColor: 'group-hover:border-slate-500/50',   category: 'Interactive Labs' },
  { id: 'sim10', title: 'SIP Growth Simulator',        slug: 'sip-growth',           description: 'Visualize the power of Systematic Investment Plans through market cycles.',          icon: IconChartLine,    difficulty: 'Beginner',     timeMinutes: 10, xpReward: 150, color: 'from-cyan-500/20 to-blue-500/20',       iconColor: 'text-cyan-500',    borderColor: 'group-hover:border-cyan-500/50',    category: 'Simulations' },
  { id: 'sim11', title: 'Lifestyle Inflation Simulator',slug: 'lifestyle-inflation', description: 'See how upgrading your lifestyle with each raise affects your long-term wealth.',    icon: IconShoppingBag,  difficulty: 'Beginner',     timeMinutes: 15, xpReward: 200, color: 'from-violet-500/20 to-purple-500/20',   iconColor: 'text-violet-500',  borderColor: 'group-hover:border-violet-500/50',  category: 'Simulations' },
  { id: 'sim12', title: 'Market Crash Simulator',      slug: 'market-crash',         description: 'Test your nerve and portfolio strategy during historical market downturns.',         icon: IconTrendingDown, difficulty: 'Hard',         timeMinutes: 20, xpReward: 350, color: 'from-red-500/20 to-rose-500/20',        iconColor: 'text-red-500',     borderColor: 'group-hover:border-red-500/50',     category: 'Simulations' },
  { id: 'sim13', title: 'Salary Negotiation',          slug: 'salary-negotiation',   description: 'Roleplay a performance review. Learn proven techniques to maximise your next raise.', icon: IconBusinessplan, difficulty: 'Intermediate', timeMinutes: 20, xpReward: 300, color: 'from-purple-500/20 to-fuchsia-500/20',  iconColor: 'text-purple-500',  borderColor: 'group-hover:border-purple-500/50',  category: 'Interactive Labs' },
  { id: 'sim14', title: 'Emergency Fund',              slug: 'emergency-fund',       description: 'Calculate and build your safety net against unexpected life events.',                 icon: IconAmbulance,    difficulty: 'Beginner',     timeMinutes: 10, xpReward: 150, color: 'from-teal-500/20 to-emerald-500/20',    iconColor: 'text-teal-500',    borderColor: 'group-hover:border-teal-500/50',    category: 'Interactive Labs' },
  { id: 'sim15', title: 'Budget Crisis',               slug: 'budget-crisis',        description: 'Navigate unexpected financial shocks. Can you balance your budget when disaster strikes?', icon: IconReportMoney, difficulty: 'Hard',        timeMinutes: 25, xpReward: 400, color: 'from-orange-500/20 to-red-500/20',      iconColor: 'text-orange-500',  borderColor: 'group-hover:border-orange-500/50',  category: 'Simulations' },
];

// ─── SimulationCard ────────────────────────────────────────────────────────────
function SimulationCard({ sim, className }: { sim: any; className?: string }) {
  const Icon = sim.icon;
  return (
    <Link href={`/learn/${sim.slug}`} className={cn('block h-full w-full', className)}>
      <div className={cn(
        'group relative flex flex-col rounded-2xl border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden h-full shadow-sm',
        sim.borderColor || 'border-slate-200',
      )}>
        <div className={cn('absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-bl-full -z-10 opacity-30 transition-transform duration-500 group-hover:scale-125', sim.color)} />
        <div className="flex items-start justify-between mb-4">
          <div className={cn('p-3 rounded-2xl bg-slate-50 shadow-sm', sim.iconColor)}>
            <Icon size={28} stroke={1.5} />
          </div>
          <Badge variant={sim.difficulty === 'Beginner' ? 'success' : sim.difficulty === 'Intermediate' ? 'warning' : 'danger'} className="text-xs">
            {sim.difficulty}
          </Badge>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-tight">{sim.title}</h3>
        <p className="text-xs font-medium text-slate-600 mb-4 flex-grow line-clamp-2">{sim.description}</p>
        <div className="space-y-3 mt-auto border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1"><IconClock size={14} />{sim.timeMinutes}m</span>
            <span className="flex items-center gap-1 text-blue-600"><IconSparkles size={14} />+{sim.xpReward} XP</span>
          </div>
          <button className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg group-hover:bg-blue-600 group-hover:scale-[1.02]">
            Start Lab <IconArrowRight size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}

// ─── Compact Discovery Hub (inline, collapsible) ───────────────────────────────
function CompactDiscoveryHub({
  onTopicSelect,
  activeTopic,
}: {
  onTopicSelect: (t: FinancialTopic | null) => void;
  activeTopic: FinancialTopic | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? FINANCIAL_TOPICS.filter(t => t.label.toLowerCase().includes(q)) : FINANCIAL_TOPICS;
  }, [search]);

  function handleChip(topic: FinancialTopic) {
    onTopicSelect(activeTopic?.id === topic.id ? null : topic);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header row — always visible */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <IconSearch size={16} />
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">Explore Financial Topics</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTopic
                ? <span className="text-blue-600 font-semibold">Filtering by: {activeTopic.emoji} {activeTopic.label}</span>
                : `${FINANCIAL_TOPICS.length} topics · Filter labs by subject`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Trending pills preview */}
          {!expanded && (
            <div className="hidden sm:flex gap-2">
              {TRENDING_TOPICS.slice(0, 3).map(t => (
                <span key={t.id} className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold border', t.color, t.textColor)}>
                  🔥 {t.label}
                </span>
              ))}
            </div>
          )}
          {activeTopic && (
            <button
              onClick={e => { e.stopPropagation(); onTopicSelect(null); }}
              className="p-1 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <IconX size={14} />
            </button>
          )}
          {expanded
            ? <IconChevronUp size={18} className="text-slate-400 shrink-0" />
            : <IconChevronDown size={18} className="text-slate-400 shrink-0" />}
        </div>
      </button>

      {/* Expandable body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-slate-100 pt-4 space-y-5">
              {/* Search + clear */}
              <div className="relative">
                <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search topics…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-9 w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute left-[calc(theme(maxWidth.xs)-1.5rem)] top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <IconX size={14} />
                  </button>
                )}
              </div>

              {/* Trending */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">🔥 Trending This Week</p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TOPICS.map((t, i) => (
                    <TopicChip key={t.id} topic={t} selected={activeTopic?.id === t.id} size="sm" onClick={handleChip} index={i} />
                  ))}
                </div>
              </div>

              {/* All topics */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">All Topics</p>
                <div className="flex flex-wrap gap-2">
                  {filtered.map((t, i) => (
                    <TopicChip key={t.id} topic={t} selected={activeTopic?.id === t.id} size="sm" showCount={false} onClick={handleChip} index={i} />
                  ))}
                  {filtered.length === 0 && <p className="text-sm text-slate-400">No topics match &ldquo;{search}&rdquo;</p>}
                </div>
              </div>

              {/* Community learning signals */}
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Community is learning</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[...FINANCIAL_TOPICS].sort((a, b) => b.learnerCount - a.learnerCount).slice(0, 5).map((t, i) => (
                    <button key={t.id} onClick={() => handleChip(t)} className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-700 transition-colors font-medium">
                      <span className="font-black text-slate-300 w-3">#{i + 1}</span>
                      <span>{t.emoji}</span>
                      <span>{t.label}</span>
                      <span className="text-slate-400">{(t.learnerCount / 1000).toFixed(1)}k</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LearnPage() {
  const { streak } = useUserStore();
  const [activeTopic, setActiveTopic] = useState<FinancialTopic | null>(null);

  const completedModulesList = MODULES.filter(m => m.status === 'completed');
  const activeModule = MODULES.find(m => m.status === 'active');
  const completedModulesCount = completedModulesList.length;
  const progressPercent = Math.round((completedModulesCount / MODULES.length) * 100);
  const nextModule = MODULES.find(m => m.status === 'locked');
  const recommendedSims = SIMULATIONS.filter(s => s.reason).slice(0, 3);

  const filteredSimulations = useMemo(() => {
    if (!activeTopic) return SIMULATIONS;
    return SIMULATIONS.filter(sim => activeTopic.relatedSlugs.includes(sim.slug));
  }, [activeTopic]);

  return (
    <PageLayout>
      <Container>
        <div className="space-y-10 pb-24 w-full max-w-7xl mx-auto mt-4 px-4">

          {/* ── 1. Continue Learning (highest priority — first thing seen) ── */}
          {activeModule && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-100 rounded-lg text-orange-500">
                  <IconTarget size={18} />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Continue Learning</h2>
              </div>
              <Card className="p-6 md:p-7 border-orange-200 bg-gradient-to-br from-white via-orange-50/30 to-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-orange-100/60 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                <div className="flex items-center gap-5 z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-orange-100 flex items-center justify-center text-3xl shrink-0">
                    {activeModule.icon}
                  </div>
                  <div>
                    <Badge variant="warning" className="mb-1.5">Active Module</Badge>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">{activeModule.title}</h3>
                    <p className="text-slate-500 text-sm">Pick up where you left off.</p>
                  </div>
                </div>
                <button className="w-full sm:w-auto px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-orange-500/25 flex items-center justify-center gap-2 group shrink-0 z-10">
                  Resume Module <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Card>
            </motion.section>
          )}

          {/* ── 2. Learning Progress Summary ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
          >
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {[
                { label: 'Modules Done',  value: `${completedModulesCount} / ${MODULES.length}`, color: 'text-blue-600' },
                { label: 'Earned XP',     value: '1,550',                                         color: 'text-amber-600' },
                { label: 'Streak',        value: `${streak}d 🔥`,                                  color: 'text-orange-500' },
                { label: 'Progress',      value: `${progressPercent}%`,                            color: 'text-emerald-600' },
              ].map(stat => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <p className={cn('text-xl font-black', stat.color)}>{stat.value}</p>
                  <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Slim global progress bar */}
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 flex items-center gap-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Overall Progress</p>
              <div className="flex-1">
                <ProgressBar value={progressPercent} max={100} color="primary" className="h-2" />
              </div>
              <p className="text-sm font-black text-blue-600 whitespace-nowrap">{progressPercent}%</p>
            </div>
          </motion.section>

          {/* ── 3. Curriculum Journey ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                  <IconBook size={18} />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Your Learning Path</h2>
              </div>
              <Badge variant="success" className="font-bold">{completedModulesCount} completed</Badge>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="relative border-l-2 border-slate-100 ml-4 space-y-4 pb-1">
                {MODULES.map((module, idx) => (
                  <div key={module.id} className="relative pl-7 group/item">
                    {/* Timeline dot */}
                    <div className={cn(
                      'absolute -left-[13px] top-2 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center transition-transform duration-200 group-hover/item:scale-110',
                      module.status === 'completed' ? 'bg-blue-500 text-white' :
                      module.status === 'active'    ? 'bg-orange-400 text-white ring-4 ring-orange-200' :
                                                      'bg-slate-200 text-slate-400',
                    )}>
                      {module.status === 'completed' ? <IconCheck size={11} stroke={3} /> :
                       module.status === 'locked'    ? <IconLock size={11} stroke={2} /> :
                       <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>

                    {/* Module card */}
                    <div className={cn(
                      'flex items-center justify-between gap-4 p-3.5 rounded-xl border transition-all',
                      module.status === 'completed' ? 'bg-slate-50 border-slate-200' :
                      module.status === 'active'    ? 'bg-white border-orange-300 shadow-sm' :
                                                      'bg-slate-50/50 border-slate-100 opacity-70',
                    )}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{module.icon}</span>
                        <div>
                          <p className={cn('font-bold text-sm', module.status === 'active' ? 'text-slate-900' : 'text-slate-700')}>
                            {module.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1"><IconClock size={10} />{module.duration}</span>
                            <span>·</span>
                            <span className="text-blue-500 font-semibold">+{module.xp} XP</span>
                          </p>
                        </div>
                      </div>
                      <span className={cn(
                        'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shrink-0',
                        module.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        module.status === 'active'    ? 'bg-orange-100 text-orange-700' :
                                                        'bg-slate-100 text-slate-500',
                      )}>
                        {module.status === 'completed' ? 'Done' : module.status === 'active' ? 'Active' : 'Locked'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── 4. Recommended Next Step ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-purple-50 rounded-lg text-purple-600">
                <IconSparkles size={18} />
              </div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Recommended Next Steps</h2>
            </div>
            <div className="flex gap-5 overflow-x-auto pb-3 -mx-1 px-1 snap-x hide-scrollbar">
              {recommendedSims.map(sim => (
                <div key={sim.id} className="min-w-[280px] max-w-[300px] snap-center flex-shrink-0 flex flex-col gap-2">
                  <div className="pl-2 border-l-2 border-purple-400">
                    <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Why this?</p>
                    <p className="text-xs font-medium text-slate-600">{sim.reason}</p>
                  </div>
                  <SimulationCard sim={sim} className="h-[300px]" />
                </div>
              ))}
            </div>
          </motion.section>

          {/* ── 5. Interactive Labs ── */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                  <IconBusinessplan size={18} />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Interactive Labs</h2>
              </div>
              <div className="flex items-center gap-2">
                {activeTopic && (
                  <button
                    onClick={() => setActiveTopic(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <IconFilter size={12} />{activeTopic.label}<IconX size={12} />
                  </button>
                )}
                <Badge variant="neutral" className="font-bold">
                  {filteredSimulations.length} {activeTopic ? 'matched' : 'Labs'}
                </Badge>
              </div>
            </div>

            {filteredSimulations.length === 0 && activeTopic && (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                <p className="text-slate-500 font-medium mb-2">No labs match &ldquo;{activeTopic.label}&rdquo; yet.</p>
                <button onClick={() => setActiveTopic(null)} className="text-sm text-blue-600 font-semibold hover:underline">Clear filter</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredSimulations.map((sim, idx) => (
                  <motion.div
                    key={sim.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ delay: idx * 0.03, duration: 0.25 }}
                    className="h-full"
                  >
                    <SimulationCard sim={sim} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.section>

          {/* ── Divider ── */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Explore & Discover</p>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* ── 6. Discovery Hub (compact, collapsible) ── */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
          >
            <CompactDiscoveryHub onTopicSelect={setActiveTopic} activeTopic={activeTopic} />
          </motion.section>

        </div>
      </Container>
    </PageLayout>
  );
}
