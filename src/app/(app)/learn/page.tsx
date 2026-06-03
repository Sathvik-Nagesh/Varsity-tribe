'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconLock, IconCheck, IconPlayerPlay, IconMapPin, IconClock, IconSparkles,
  IconCrystalBall, IconPlant2, IconBusinessplan, IconReportMoney, IconAmbulance, 
  IconBuildingBank, IconKey, IconShieldLock, IconArrowRight, IconBook, IconFlame
} from '@tabler/icons-react';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { cn } from '@/lib/cn';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import { useUserStore } from '@/stores/useUserStore';

const CATEGORIES = ['All', 'Basics', 'Investing', 'Budgeting', 'Simulations'];

const SIMULATIONS = [
  {
    id: 'sim1',
    title: 'Future You Simulator',
    slug: 'future-you',
    description: 'Travel in time to see how your current financial habits shape your future lifestyle and net worth.',
    icon: IconCrystalBall,
    difficulty: 'Beginner',
    timeMinutes: 10,
    xpReward: 150,
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: 'text-indigo-500',
    borderColor: 'group-hover:border-indigo-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim2',
    title: 'Compound Interest Laboratory',
    slug: 'compound-interest',
    description: 'Experiment with the magic of compound interest. Tweak variables and watch your wealth grow exponentially.',
    icon: IconPlant2,
    difficulty: 'Beginner',
    timeMinutes: 15,
    xpReward: 200,
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
    borderColor: 'group-hover:border-emerald-500/50',
    category: 'Simulations'
  },
  {
    id: 'sim3',
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
    category: 'Simulations'
  },
  {
    id: 'sim4',
    title: 'Budget Crisis Simulator',
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
  },
];

const MODULES = [
  { id: 'm1', title: 'Financial Basics', status: 'completed', icon: '📚', category: 'Basics' },
  { id: 'm2', title: 'Emergency Fund', status: 'completed', icon: '🛡️', category: 'Basics' },
  { id: 'm3', title: 'Insurance Check', status: 'active', icon: '☂️', category: 'Basics' },
  { id: 'm4', title: 'Debt Free Path', status: 'locked', icon: '✂️', category: 'Budgeting' },
  { id: 'm5', title: 'Investing 101', status: 'locked', icon: '📈', category: 'Investing' },
  { id: 'm6', title: 'Wealth Building', status: 'locked', icon: '🏛️', category: 'Investing' },
  { id: 'm7', title: 'Retirement Prep', status: 'locked', icon: '🌴', category: 'Investing' },
];

export default function LearnPage() {
  const { xp, streak } = useUserStore();
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter content
  const filteredModules = activeCategory === 'All' 
    ? MODULES 
    : MODULES.filter(m => m.category === activeCategory);
    
  const filteredSimulations = activeCategory === 'All' || activeCategory === 'Simulations'
    ? SIMULATIONS 
    : SIMULATIONS.filter(s => s.category === activeCategory);

  const completedModules = MODULES.filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedModules / MODULES.length) * 100);

  return (
    <PageLayout>
      <Container>
        <div className="space-y-[var(--space-2xl)] pb-24 w-full max-w-6xl mx-auto mt-4 px-4">
          
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

          {/* Category Filters */}
          <section className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2",
                  activeCategory === cat 
                    ? "bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20" 
                    : "bg-brand-surface border-brand-border text-brand-text-secondary hover:border-brand-primary/50 hover:text-brand-text-primary hover:bg-brand-surface-elevated"
                )}
              >
                {cat}
              </button>
            ))}
          </section>

          {/* Content Area */}
          <div className="flex flex-col lg:flex-row gap-12 mt-8">
            
            {/* Main Curriculum (Duolingo Style Path) */}
            {(activeCategory === 'All' || filteredModules.length > 0) && (
              <div className="flex-1">
                <div className="flex items-center justify-between mb-8 sticky top-[80px] z-20 bg-brand-bg/80 backdrop-blur-md py-4 rounded-xl px-4 border border-brand-border">
                  <h2 className="text-h4 font-display flex items-center gap-2">
                    <IconMapPin className="text-brand-primary" /> Curriculum Path
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-brand-text-secondary hidden sm:inline">{progressPercent}% Complete</span>
                    <div className="w-24">
                      <ProgressBar value={progressPercent} max={100} color="primary" />
                    </div>
                  </div>
                </div>

                <div className="relative py-8 flex flex-col items-center">
                  {filteredModules.map((node, index) => {
                    const isCompleted = node.status === 'completed';
                    const isActive = node.status === 'active';
                    const isLocked = node.status === 'locked';
                    
                    // Sine wave offset for Duolingo path style
                    const offset = Math.sin(index * 1.5) * 80;

                    return (
                      <div key={node.id} className="relative flex flex-col items-center group w-full mb-16">
                        {/* Connecting Line (except for last item) */}
                        {index < filteredModules.length - 1 && (
                          <div 
                            className={cn(
                              "absolute w-4 -bottom-16 -z-10 rounded-full",
                              node.status === 'completed' || node.status === 'active' 
                                ? "bg-brand-primary" 
                                : "bg-brand-surface-elevated border border-brand-border/50"
                            )}
                            style={{
                              height: '70px',
                              left: `calc(50% + ${offset}px - 8px)`,
                            }}
                          />
                        )}
                        
                        <div 
                          className="flex flex-col items-center transition-transform hover:scale-105 cursor-pointer relative"
                          style={{ transform: `translateX(${offset}px)` }}
                        >
                          <motion.div 
                            whileTap={!isLocked ? { scale: 0.9 } : {}}
                            className={cn(
                              "w-24 h-24 rounded-full flex items-center justify-center text-4xl border-[6px] z-10 transition-colors shadow-xl",
                              isCompleted ? "bg-brand-primary text-white border-brand-primary/20" :
                              isActive ? "bg-white text-brand-primary border-brand-primary ring-8 ring-brand-primary/20" :
                              "bg-brand-surface-elevated border-brand-border text-brand-text-muted grayscale"
                            )}
                          >
                            {isLocked ? <IconLock size={36} /> : node.icon}
                          </motion.div>

                          {/* Floating Crown/Star for active item */}
                          {isActive && (
                            <motion.div
                              animate={{ y: [0, -5, 0] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute -top-6 text-brand-warning text-3xl drop-shadow-md"
                            >
                              👑
                            </motion.div>
                          )}
                          
                          {/* Floating Box for Title */}
                          <div className={cn(
                            "absolute top-full mt-3 w-max max-w-[160px] text-center px-4 py-2 rounded-xl border shadow-sm",
                            isActive ? "bg-brand-primary text-white border-brand-primary shadow-lg" : 
                            isCompleted ? "bg-brand-surface border-brand-border text-brand-text-primary" :
                            "bg-brand-surface/50 border-brand-border/50 text-brand-text-tertiary font-bold"
                          )}>
                            <h4 className="font-bold text-sm leading-tight">{node.title}</h4>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Immersive Simulations Sidebar */}
            {(activeCategory === 'All' || activeCategory === 'Simulations' || filteredSimulations.length > 0) && (
              <div className="w-full lg:w-[420px] shrink-0 space-y-6">
                <div className="flex items-center justify-between mb-8 sticky top-[80px] z-20 bg-brand-bg/80 backdrop-blur-md py-4 px-2">
                  <h2 className="text-h4 font-display flex items-center gap-2">
                    <IconSparkles className="text-brand-warning" /> Interactive Labs
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                  <AnimatePresence>
                    {filteredSimulations.map((sim, idx) => {
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
                          <Link href={`/labs/${sim.slug}`} className="block h-full">
                            <div className={cn(
                              "group relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden h-full shadow-sm",
                              sim.borderColor || "border-slate-200"
                            )}>
                              <div className={cn(
                                "absolute top-0 right-0 w-40 h-40 bg-gradient-to-br rounded-bl-full -z-10 opacity-30 transition-transform duration-500 group-hover:scale-125",
                                sim.color
                              )} />
                              
                              <div className="flex items-start justify-between mb-5">
                                <div className={cn("p-4 rounded-2xl bg-slate-50 shadow-sm", sim.iconColor)}>
                                  <Icon size={36} stroke={1.5} />
                                </div>
                                <Badge variant={sim.difficulty === 'Beginner' ? 'success' : sim.difficulty === 'Intermediate' ? 'warning' : 'danger'}>
                                  {sim.difficulty}
                                </Badge>
                              </div>

                              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight">{sim.title}</h3>
                              <p className="text-sm font-medium text-slate-600 mb-6 flex-grow">{sim.description}</p>

                              <div className="space-y-4 mt-auto border-t border-slate-100 pt-5">
                                <div className="flex items-center justify-between text-sm font-bold text-slate-500">
                                  <span className="flex items-center gap-1.5">
                                    <IconClock size={16} />
                                    {sim.timeMinutes}m
                                  </span>
                                  <span className="flex items-center gap-1.5 text-blue-600">
                                    <IconSparkles size={16} />
                                    +{sim.xpReward} XP
                                  </span>
                                </div>

                                <button className="w-full py-3.5 px-4 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg group-hover:bg-blue-600 group-hover:scale-[1.02]">
                                  Start Lab Simulation
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
              </div>
            )}
          </div>

        </div>
      </Container>
    </PageLayout>
  );
}
