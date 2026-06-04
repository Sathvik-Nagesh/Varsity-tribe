'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { IconTrophy, IconStar, IconFlame, IconTarget, IconDeviceGamepad2 } from '@tabler/icons-react';
import Link from 'next/link';

export default function HowXPWorksPage() {
  const xpSources = [
    {
      title: 'Module Completion',
      description: 'Finish learning modules to gain large amounts of XP and level up faster.',
      xp: '+500 XP per module',
      icon: <IconStar size={24} className="text-brand-primary" />,
      color: 'bg-brand-primary/10 border-brand-primary/20',
    },
    {
      title: 'Simulation Completion',
      description: 'Test your knowledge in interactive simulators.',
      xp: '+300 XP per sim',
      icon: <IconDeviceGamepad2 size={24} className="text-purple-500" />,
      color: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Daily Login',
      description: 'Log in every day to claim your daily reward.',
      xp: '+50 XP daily',
      icon: <IconTrophy size={24} className="text-amber-500" />,
      color: 'bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Streak Bonuses',
      description: 'Maintain a 7-day streak for bonus XP multipliers.',
      xp: '+200 XP bonus',
      icon: <IconFlame size={24} className="text-brand-danger" />,
      color: 'bg-brand-danger/10 border-brand-danger/20',
    },
    {
      title: 'Goal Creation',
      description: 'Set your financial goals and start tracking them.',
      xp: '+150 XP per goal',
      icon: <IconTarget size={24} className="text-brand-success" />,
      color: 'bg-brand-success/10 border-brand-success/20',
    },
  ];

  const ranks = [
    { name: 'Explorer', xp: '0 - 499 XP', current: true },
    { name: 'Saver', xp: '500 - 1,499 XP', current: false },
    { name: 'Investor', xp: '1,500 - 4,999 XP', current: false },
    { name: 'Builder', xp: '5,000 - 9,999 XP', current: false },
    { name: 'Mentor', xp: '10,000+ XP', current: false },
  ];

  return (
    <PageLayout>
      <Container className="py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-h1 mb-4">How XP Works</h1>
          <p className="text-brand-text-secondary max-w-2xl mx-auto">
            Experience Points (XP) track your financial journey. Earn XP by learning, planning, and taking action towards your financial independence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h2 className="text-h2 flex items-center gap-2">
              <IconTrophy className="text-amber-500" />
              Earning XP
            </h2>
            <div className="space-y-4">
              {xpSources.map((source) => (
                <Card key={source.title} className={`p-4 border ${source.color} flex gap-4 items-start`}>
                  <div className="p-2 bg-white/50 dark:bg-black/20 rounded-lg shrink-0">
                    {source.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-brand-text-primary">{source.title}</h3>
                    <p className="text-sm text-brand-text-secondary mt-1">{source.description}</p>
                    <div className="inline-block mt-2 text-xs font-bold px-2 py-1 bg-white/50 dark:bg-black/20 rounded">
                      {source.xp}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-h2">Rank Progression</h2>
            <Card className="p-6">
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.2rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-brand-border before:to-transparent">
                {ranks.map((rank, i) => (
                  <div key={rank.name} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-brand-surface bg-brand-surface-elevated text-brand-text-tertiary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                      {i + 1}
                    </div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-brand-border bg-brand-surface shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-brand-text-primary">{rank.name}</h4>
                      </div>
                      <p className="text-sm text-brand-text-secondary font-mono">{rank.xp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <div className="pt-4 text-center">
              <Link href="/dashboard" className="text-brand-primary font-medium hover:underline">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
