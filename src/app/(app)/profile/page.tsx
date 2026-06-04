'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IconEdit, IconMedal, IconFlame, IconTarget, IconTrophy, 
  IconUser, IconShieldCheck, IconLock, IconActivity, IconDna
} from '@tabler/icons-react';
import { useUserStore, selectLevel } from '@/stores/useUserStore';
import { Card, Badge, Button, ProgressBar } from '@/components/ui';
import { USER_LEVELS } from '@/types';
import { cn } from '@/lib/cn';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import Link from 'next/link';

const RECENT_ACTIVITY = [
  { id: 1, title: 'Completed Salary Negotiation Lab', xp: '+50 XP', time: '2h ago' },
  { id: 2, title: 'Created Emergency Fund Goal', xp: '+25 XP', time: '1d ago' },
  { id: 3, title: 'Joined Community Discussion', xp: '+10 XP', time: '2d ago' },
];

const MOCK_GOALS = [
  { id: 1, title: 'Emergency Fund', progress: 48 },
  { id: 2, title: 'Japan Trip', progress: 10 },
  { id: 3, title: 'Retirement Fund', progress: 3 },
];

const MOCK_BADGES = [
  { id: 1, icon: '🏆', name: 'First SIP', unlocked: true },
  { id: 2, icon: '💰', name: 'Emergency Fund', unlocked: true },
  { id: 3, icon: '📈', name: 'Investor', unlocked: true },
  { id: 4, icon: '🔥', name: '7 Day Streak', unlocked: true },
  { id: 5, icon: '🎯', name: 'Goal Crusher', unlocked: false },
];

const FINANCIAL_DNA = {
  type: 'Balanced Investor',
  description: 'You take calculated risks while maintaining a strong safety net.',
  traits: ['Diversified', 'Consistent', 'Forward-thinking']
};

export default function ProfilePage() {
  const { xp, streak, badges } = useUserStore();
  const level = useUserStore(selectLevel);
  const [activeTab, setActiveTab] = useState('Goals');

  const currentLevelIndex = USER_LEVELS.findIndex((l) => l.name.toLowerCase() === level.toLowerCase());
  const currentLevelInfo = USER_LEVELS[currentLevelIndex] || USER_LEVELS[0];
  const nextLevelInfo = USER_LEVELS[currentLevelIndex + 1];

  // Fix XP bug
  const currentXP = xp;
  const targetXP = Math.max(1, nextLevelInfo ? nextLevelInfo.minXP : currentXP);
  
  return (
    <PageLayout>
      <Container>
        <div className="space-y-[var(--space-xl)] pb-12 w-full max-w-5xl mx-auto mt-6 px-4">
          
          {/* ROW 1: Modern Profile Header (Reduced Height) */}
          <section>
            <Card variant="elevated" className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-br from-brand-surface to-brand-primary/5 border border-brand-primary/20 shadow-md">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-brand-surface-elevated border-4 border-brand-primary/20 flex items-center justify-center shadow-lg text-5xl">
                    👨🏻‍💻
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-brand-primary text-white text-xs font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-sm">
                    Lvl {currentLevelIndex + 1}
                  </div>
                </div>
                
                <div className="flex-1 text-center sm:text-left flex flex-col sm:flex-row sm:justify-between items-center sm:items-start w-full gap-4">
                  <div>
                    <h1 className="text-h2 font-display text-brand-text-primary">Alex Smith</h1>
                    <p className="text-brand-primary font-bold text-sm mt-1">{currentLevelInfo.name}</p>
                    
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4">
                      <div className="flex items-center gap-1.5 bg-brand-surface-elevated px-3 py-1.5 rounded-full border border-brand-border/60">
                        <IconTrophy size={16} className="text-brand-warning" />
                        <span className="text-xs font-semibold text-brand-text-secondary">Rank #1024</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-brand-surface-elevated px-3 py-1.5 rounded-full border border-brand-border/60">
                        <IconFlame size={16} className="text-brand-danger" />
                        <span className="text-xs font-semibold text-brand-text-secondary">{streak} Day Streak</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-brand-surface-elevated px-3 py-1.5 rounded-full border border-brand-border/60">
                        <IconTarget size={16} className="text-brand-success" />
                        <span className="text-xs font-semibold text-brand-text-secondary">3 Active Goals</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto shrink-0 mt-2 sm:mt-0">
                    <Button variant="secondary" size="sm" icon={<IconEdit size={16} />}>Edit Profile</Button>
                    <div className="text-right mt-1 w-full max-w-[220px]">
                      <div className="flex justify-between text-xs font-semibold mb-1.5 text-brand-text-secondary">
                        <span>Level {currentLevelIndex + 1}</span>
                        <span>{currentXP} / {targetXP} XP</span>
                      </div>
                      <ProgressBar value={currentXP} max={targetXP} color="primary" size="md" />
                      {nextLevelInfo && (
                        <p className="text-[10px] font-medium text-brand-text-tertiary mt-1.5 text-right">
                          {targetXP - currentXP} XP until {nextLevelInfo.name}
                        </p>
                      )}
                      <Link href="/how-xp-works" className="text-[10px] text-brand-primary font-medium mt-1 inline-block hover:underline">
                        How XP Works &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ROW 2: Financial Health & DNA */}
          <section className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card variant="default" className="p-6 md:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h4 flex items-center gap-2">
                  <IconShieldCheck className="text-brand-success" /> Financial Health Score
                </h2>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Circular Score */}
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" className="stroke-brand-border fill-none" strokeWidth="8" />
                    <circle cx="64" cy="64" r="56" className="stroke-brand-success fill-none" strokeWidth="8" strokeDasharray="351.85" strokeDashoffset={351.85 * (1 - 742 / 1000)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-brand-text-primary">742</span>
                    <span className="text-xs text-brand-text-tertiary font-bold mt-0.5">/ 1000</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-3.5 w-full">
                  {[
                    { label: 'Savings', val: 85, color: 'success' },
                    { label: 'Investing', val: 60, color: 'primary' },
                    { label: 'Learning', val: 90, color: 'warning' },
                    { label: 'Consistency', val: 75, color: 'primary' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="flex justify-between text-[11px] uppercase tracking-wider font-bold text-brand-text-secondary mb-1">
                        <span>{s.label}</span>
                        <span>{s.val}%</span>
                      </div>
                      <ProgressBar value={s.val} max={100} color={s.color as any} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card variant="default" className="p-6 md:col-span-2 bg-gradient-to-br from-brand-surface to-brand-primary/10 border-brand-primary/20 relative overflow-hidden">
              <IconDna size={120} className="absolute -right-6 -bottom-6 text-brand-primary/10 pointer-events-none" />
              <div className="flex items-center justify-between mb-4 relative z-10">
                <h2 className="text-h4 flex items-center gap-2">
                  <IconDna className="text-brand-primary" /> Financial DNA
                </h2>
              </div>
              <div className="flex flex-col h-full justify-center space-y-4 relative z-10">
                <h3 className="text-2xl font-black text-brand-primary leading-tight">{FINANCIAL_DNA.type}</h3>
                <p className="text-sm font-medium text-brand-text-secondary leading-relaxed">
                  {FINANCIAL_DNA.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {FINANCIAL_DNA.traits.map(trait => (
                    <Badge key={trait} variant="neutral" size="sm" className="bg-white/50 backdrop-blur-sm border-brand-border/60">{trait}</Badge>
                  ))}
                </div>
              </div>
            </Card>
          </section>

          {/* ROW 3: Achievements */}
          <section>
            <h2 className="text-h4 mb-4 flex items-center gap-2">
              <IconMedal className="text-brand-warning" /> Achievements
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
              {badges.map((badge) => {
                const unlocked = !!badge.earnedAt;
                return (
                  <Card key={badge.id} hoverable className={cn("p-4 text-center flex flex-col items-center justify-center gap-3 transition-all", unlocked ? "border-brand-warning/30 bg-gradient-to-b from-brand-warning/10 to-brand-surface shadow-sm" : "grayscale opacity-50 bg-brand-surface-elevated")}>
                    <div className="text-4xl relative">
                      {badge.icon}
                      {!unlocked && <IconLock size={16} className="absolute -bottom-1 -right-1 text-brand-text-tertiary bg-brand-surface rounded-full p-0.5 shadow-sm border border-brand-border" />}
                    </div>
                    <span className="text-[10px] font-bold text-brand-text-secondary uppercase tracking-wide leading-tight">{badge.name}</span>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* ROW 4: Animated Financial Journey */}
          <section>
            <h2 className="text-h4 mb-4 flex items-center gap-2">
              <IconActivity className="text-brand-primary" /> Learning Roadmap
            </h2>
            <Card variant="default" className="p-8 sm:p-10 overflow-hidden relative border-brand-border">
              <div className="absolute top-1/2 left-8 right-8 h-1.5 bg-brand-border -translate-y-1/2 rounded-full" />
              <div className="absolute top-1/2 left-8 h-1.5 bg-brand-primary -translate-y-1/2 transition-all duration-1000 rounded-full" style={{ width: `calc(${(currentLevelIndex / (USER_LEVELS.length - 1)) * 100}% - 2rem)` }} />
              
              <div className="relative flex justify-between w-full">
                {USER_LEVELS.map((lvl, idx) => {
                  const isPassed = xp >= lvl.minXP;
                  const isCurrent = lvl.name.toLowerCase() === level.toLowerCase();
                  return (
                    <div key={lvl.level} className="flex flex-col items-center gap-3 relative z-10 w-24">
                      <motion.div 
                        whileHover={isPassed || isCurrent ? { scale: 1.1 } : {}}
                        className={cn(
                          "w-14 h-14 rounded-full flex items-center justify-center text-2xl border-4 transition-colors shadow-sm bg-brand-surface",
                          isCurrent ? "border-brand-primary ring-4 ring-brand-primary/20 text-brand-primary bg-white" :
                          isPassed ? "border-brand-primary bg-brand-primary/10 text-brand-primary" :
                          "border-brand-border grayscale opacity-60 bg-brand-surface-elevated"
                        )}
                      >
                        {isPassed || isCurrent ? lvl.icon : <IconLock size={20} />}
                      </motion.div>
                      <div className="flex flex-col items-center">
                        <span className={cn(
                          "text-xs font-bold text-center",
                          isCurrent ? "text-brand-primary" : 
                          isPassed ? "text-brand-text-primary" : "text-brand-text-tertiary"
                        )}>
                          {lvl.name}
                        </span>
                        {isPassed && <span className="text-[10px] text-brand-success mt-0.5 font-bold">UNLOCKED</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          {/* ROW 5: Content Tabs (Goals, Recent Activity, Bookmarks) */}
          <section>
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 border-b border-brand-border pb-px">
              {['Goals', 'XP Activity Log', 'Bookmarks', 'Events'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-5 py-3 text-sm font-bold transition-all border-b-2 whitespace-nowrap",
                    activeTab === tab 
                      ? "border-brand-primary text-brand-primary bg-brand-primary/5 rounded-t-lg" 
                      : "border-transparent text-brand-text-secondary hover:text-brand-text-primary hover:bg-brand-surface-elevated rounded-t-lg"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'Goals' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {MOCK_GOALS.map(goal => (
                    <Card key={goal.id} hoverable className="p-5 border-brand-border">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-brand-text-primary">{goal.title}</span>
                        <Badge variant={goal.progress > 40 ? "success" : "warning"} size="sm">{goal.progress}%</Badge>
                      </div>
                      <ProgressBar value={goal.progress} max={100} color={goal.progress > 40 ? "success" : "warning"} />
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'XP Activity Log' && (
                <Card className="p-0 overflow-hidden divide-y divide-brand-border border-brand-border">
                  {RECENT_ACTIVITY.map(act => (
                    <div key={act.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-brand-surface-elevated transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                          <IconActivity size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-text-primary">{act.title}</p>
                          <p className="text-xs text-brand-text-tertiary mt-0.5 font-medium">{act.time}</p>
                        </div>
                      </div>
                      <Badge variant="success" className="font-bold">{act.xp}</Badge>
                    </div>
                  ))}
                </Card>
              )}

              {activeTab === 'Bookmarks' && (
                <Card className="py-16 text-center border-dashed border-2 border-brand-border bg-brand-surface-elevated">
                  <p className="text-brand-text-secondary font-semibold text-sm">You haven't bookmarked any lessons yet.</p>
                  <Button variant="secondary" size="sm" className="mt-4">Explore Learn</Button>
                </Card>
              )}
              
              {activeTab === 'Events' && (
                <Card className="py-16 text-center border-dashed border-2 border-brand-border bg-brand-surface-elevated">
                  <p className="text-brand-text-secondary font-semibold text-sm">Register for upcoming Tribe Events to see them here.</p>
                  <Button variant="secondary" size="sm" className="mt-4">View Events</Button>
                </Card>
              )}
            </motion.div>
          </section>

        </div>
      </Container>
    </PageLayout>
  );
}
