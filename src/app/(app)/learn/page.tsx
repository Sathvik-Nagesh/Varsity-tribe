'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconLock, IconCheck, IconClock, IconSparkles,
  IconCrystalBall, IconPlant2, IconBusinessplan, IconReportMoney, IconAmbulance, 
  IconBuildingBank, IconShieldLock, IconArrowRight, IconBook, IconFlame,
  IconChartPie, IconChartBar, IconCreditCard, IconCash, IconBriefcase,
  IconReceipt, IconChartLine, IconTrendingDown, IconShoppingBag
} from '@tabler/icons-react';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/cn';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import { useUserStore } from '@/stores/useUserStore';

const MODULES = [
  { id: 'm1', title: 'Financial Basics', status: 'completed', icon: '📚' },
  { id: 'm2', title: 'Emergency Fund', status: 'completed', icon: '🚑' },
  { id: 'm3', title: 'Insurance', status: 'active', icon: '☂️' },
  { id: 'm4', title: 'Investing', status: 'locked', icon: '📈' },
  { id: 'm5', title: 'Retirement', status: 'locked', icon: '🌴' },
];

const SIMULATIONS = [
  {
    id: 'sim1',
    title: 'Rent vs Buy Simulator',
    slug: 'rent-vs-buy',
    description: 'Compare the long-term financial impact of renting versus buying a home in different markets.',
    icon: IconBuildingBank,
    difficulty: 'Intermediate',
    timeMinutes: 15,
    xpReward: 250,
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-indigo-500',
    borderColor: 'group-hover:border-indigo-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim2',
    title: 'Mutual Fund Builder',
    slug: 'mutual-fund-builder',
    description: 'Construct your own mutual fund portfolio and backtest it against historical market data.',
    icon: IconChartPie,
    difficulty: 'Hard',
    timeMinutes: 20,
    xpReward: 350,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
    borderColor: 'group-hover:border-emerald-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim3',
    title: 'Index Fund Simulator',
    slug: 'index-fund-simulator',
    description: 'Learn how index funds track the market and the impact of expense ratios over decades.',
    icon: IconChartBar,
    difficulty: 'Beginner',
    timeMinutes: 10,
    xpReward: 150,
    color: 'from-purple-500/20 to-fuchsia-500/20',
    iconColor: 'text-purple-500',
    borderColor: 'group-hover:border-purple-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim4',
    title: 'Insurance Decision Simulator',
    slug: 'insurance-decision',
    description: 'Navigate different life events and choose the right insurance coverage to protect your wealth.',
    icon: IconShieldLock,
    difficulty: 'Intermediate',
    timeMinutes: 15,
    xpReward: 200,
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
    borderColor: 'group-hover:border-orange-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim5',
    title: 'Credit Score Builder',
    slug: 'credit-score-builder',
    description: 'Make financial decisions over a simulated year to build or repair your credit score.',
    icon: IconCreditCard,
    difficulty: 'Intermediate',
    timeMinutes: 20,
    xpReward: 250,
    color: 'from-sky-500/20 to-blue-500/20',
    iconColor: 'text-blue-500',
    borderColor: 'group-hover:border-blue-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim6',
    title: 'Loan Repayment Simulator',
    slug: 'loan-repayment',
    description: 'Experiment with different repayment strategies like snowball vs avalanche to clear debt faster.',
    icon: IconCash,
    difficulty: 'Beginner',
    timeMinutes: 15,
    xpReward: 150,
    color: 'from-pink-500/20 to-rose-500/20',
    iconColor: 'text-rose-500',
    borderColor: 'group-hover:border-rose-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim7',
    title: 'Retirement Planner',
    slug: 'retirement-planner',
    description: 'Calculate your FIRE number and create a roadmap to reach financial independence.',
    icon: IconPlant2,
    difficulty: 'Hard',
    timeMinutes: 25,
    xpReward: 400,
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-500',
    borderColor: 'group-hover:border-green-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim8',
    title: 'Side Hustle Simulator',
    slug: 'side-hustle',
    description: 'Balance your 9-5 job with a side hustle. Manage time, taxes, and burnout to increase income.',
    icon: IconBriefcase,
    difficulty: 'Intermediate',
    timeMinutes: 20,
    xpReward: 300,
    color: 'from-yellow-500/20 to-amber-500/20',
    iconColor: 'text-amber-500',
    borderColor: 'group-hover:border-amber-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim9',
    title: 'Tax Planning Simulator',
    slug: 'tax-planning',
    description: 'Optimize your deductions and investments to legally minimize your tax burden.',
    icon: IconReceipt,
    difficulty: 'Hard',
    timeMinutes: 30,
    xpReward: 450,
    color: 'from-slate-500/20 to-gray-500/20',
    iconColor: 'text-slate-500',
    borderColor: 'group-hover:border-slate-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim10',
    title: 'SIP Growth Simulator',
    slug: 'sip-growth',
    description: 'Visualize the power of Systematic Investment Plans through market cycles.',
    icon: IconChartLine,
    difficulty: 'Beginner',
    timeMinutes: 10,
    xpReward: 150,
    color: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-500',
    borderColor: 'group-hover:border-cyan-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim11',
    title: 'Lifestyle Inflation Simulator',
    slug: 'lifestyle-inflation',
    description: 'See how upgrading your lifestyle with each raise affects your long-term wealth.',
    icon: IconShoppingBag,
    difficulty: 'Beginner',
    timeMinutes: 15,
    xpReward: 200,
    color: 'from-violet-500/20 to-purple-500/20',
    iconColor: 'text-violet-500',
    borderColor: 'group-hover:border-violet-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim12',
    title: 'Market Crash Simulator',
    slug: 'market-crash',
    description: 'Test your nerve and portfolio strategy during historical market downturns.',
    icon: IconTrendingDown,
    difficulty: 'Hard',
    timeMinutes: 20,
    xpReward: 350,
    color: 'from-red-500/20 to-rose-500/20',
    iconColor: 'text-red-500',
    borderColor: 'group-hover:border-red-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim13',
    title: 'Salary Negotiation',
    slug: 'salary-negotiation',
    description: 'Roleplay a performance review with an AI manager. Learn proven techniques to maximize your next raise.',
    icon: IconBusinessplan,
    difficulty: 'Intermediate',
    timeMinutes: 20,
    xpReward: 300,
    color: 'from-purple-500/20 to-fuchsia-500/20',
    iconColor: 'text-purple-500',
    borderColor: 'group-hover:border-purple-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim14',
    title: 'Emergency Fund',
    slug: 'emergency-fund',
    description: 'Calculate and build your safety net against unexpected life events.',
    icon: IconAmbulance,
    difficulty: 'Beginner',
    timeMinutes: 10,
    xpReward: 150,
    color: 'from-teal-500/20 to-emerald-500/20',
    iconColor: 'text-teal-500',
    borderColor: 'group-hover:border-teal-500/50',
    category: 'Interactive Labs'
  },
  {
    id: 'sim15',
    title: 'Budget Crisis',
    slug: 'budget-crisis',
    description: 'Navigate unexpected financial shocks. Can you balance your budget when disaster strikes?',
    icon: IconReportMoney,
    difficulty: 'Hard',
    timeMinutes: 25,
    xpReward: 400,
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-500',
    borderColor: 'group-hover:border-orange-500/50',
    category: 'Simulations'
  }
];

export default function LearnPage() {
  const { streak } = useUserStore();

  const completedModules = MODULES.filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedModules / MODULES.length) * 100);

  const renderAllSimulations = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {SIMULATIONS.map((sim, idx) => {
            const Icon = sim.icon;
            return (
              <motion.div
                key={sim.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/learn/${sim.slug}`} className="block h-full">
                  <div className={cn(
                    "group relative flex flex-col rounded-2xl border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden h-full shadow-sm",
                    sim.borderColor || "border-slate-200"
                  )}>
                    <div className={cn(
                      "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br rounded-bl-full -z-10 opacity-30 transition-transform duration-500 group-hover:scale-125",
                      sim.color
                    )} />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn("p-3 rounded-2xl bg-slate-50 shadow-sm", sim.iconColor)}>
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
                        <span className="flex items-center gap-1">
                          <IconClock size={14} />
                          {sim.timeMinutes}m
                        </span>
                        <span className="flex items-center gap-1 text-blue-600">
                          <IconSparkles size={14} />
                          +{sim.xpReward} XP
                        </span>
                      </div>

                      <button className="w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg group-hover:bg-blue-600 group-hover:scale-[1.02]">
                        Start Lab
                        <IconArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <PageLayout>
      <Container>
        <div className="space-y-12 pb-24 w-full max-w-7xl mx-auto mt-4 px-4">
          
          {/* Learning Dashboard Summary */}
          <section>
            <Card variant="elevated" className="p-8 bg-gradient-to-r from-brand-primary to-brand-secondary/90 text-white overflow-hidden relative border-none shadow-lg">
              <IconBook size={200} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="text-center md:text-left">
                  <h1 className="text-h2 font-display text-white mb-2">Learning Hub</h1>
                  <p className="text-white/90 font-medium max-w-lg">
                    Master your money through bite-sized modules and interactive real-world simulations.
                  </p>
                </div>
                
                <div className="flex gap-4 sm:gap-8 bg-black/20 p-6 rounded-2xl backdrop-blur-md border border-white/10 w-full md:w-auto shrink-0 shadow-inner">
                  <div className="text-center flex-1 md:flex-none">
                    <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Modules</p>
                    <p className="text-2xl sm:text-3xl font-display text-white">{completedModules}</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center flex-1 md:flex-none">
                    <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Earned XP</p>
                    <p className="text-2xl sm:text-3xl font-display text-brand-warning">1,550</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center flex-1 md:flex-none">
                    <p className="text-white/70 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">Streak</p>
                    <p className="text-2xl sm:text-3xl font-display text-brand-danger flex items-center justify-center gap-1">
                      {streak} <IconFlame size={20} className="sm:w-6 sm:h-6" />
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Grid Layout: 35% / 65% */}
          <div className="grid grid-cols-1 lg:grid-cols-[35%_65%] gap-8 items-start">
            
            {/* Left Column: Curriculum Path */}
            <section className="space-y-6 lg:sticky lg:top-24">
              <details className="group bg-brand-surface border border-brand-border rounded-2xl overflow-hidden shadow-sm [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-display text-h5 text-brand-text-primary hover:bg-slate-50 transition-colors">
                  <span className="flex items-center gap-3">
                    <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                      <IconBook size={24} />
                    </div>
                    Curriculum Path
                  </span>
                  <span className="transition duration-300 group-open:rotate-180 bg-slate-100 p-2 rounded-full text-slate-500">
                    <svg fill="none" height="20" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="20"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                
                <div className="p-6 pt-0 border-t border-brand-border/50 bg-white">
                  <div className="flex flex-col gap-4 mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-brand-text-secondary">Progress</span>
                      <span className="text-sm font-bold text-brand-primary">{progressPercent}%</span>
                    </div>
                    <ProgressBar value={progressPercent} max={100} color="primary" />
                  </div>

                  <div className="relative border-l-2 border-slate-100 ml-6 mt-8 space-y-8 pb-4">
                    {MODULES.map((module, idx) => (
                      <div key={module.id} className="relative pl-8 group/item">
                        {/* Timeline Node */}
                        <div className={cn(
                          "absolute -left-[17px] top-1 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-transform group-hover/item:scale-110",
                          module.status === 'completed' ? "bg-brand-primary text-white" :
                          module.status === 'active' ? "bg-brand-warning text-white ring-4 ring-brand-warning/20" :
                          "bg-slate-200 text-slate-400"
                        )}>
                          {module.status === 'completed' ? <IconCheck size={14} stroke={3} /> :
                           module.status === 'locked' ? <IconLock size={14} stroke={2} /> :
                           <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        
                        <div className={cn(
                          "p-4 rounded-xl border transition-all",
                          module.status === 'completed' ? "bg-slate-50 border-slate-200" :
                          module.status === 'active' ? "bg-white border-brand-warning shadow-sm" :
                          "bg-slate-50/50 border-slate-100 opacity-75"
                        )}>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{module.icon}</span>
                            <div>
                              <h4 className={cn(
                                "font-bold leading-none mb-1",
                                module.status === 'active' ? "text-brand-text-primary" : "text-slate-700"
                              )}>
                                {module.title}
                              </h4>
                              <p className="text-xs font-medium text-slate-500 capitalize">{module.status}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            </section>

            {/* Right Column: Interactive Labs */}
            <section className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-h4 font-display flex items-center gap-2">
                  <IconSparkles className="text-brand-warning" /> 
                  Interactive Labs
                </h2>
                <Badge variant="neutral" className="font-bold">{SIMULATIONS.length} Labs</Badge>
              </div>
              
              {renderAllSimulations()}
            </section>

          </div>

        </div>
      </Container>
    </PageLayout>
  );
}
