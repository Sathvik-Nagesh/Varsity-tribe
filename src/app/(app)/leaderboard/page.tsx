'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconTrophy, IconFlame, IconStar } from '@tabler/icons-react';
import { Card, Badge, Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import { Container } from '@/components/layout/Container';
import { PageLayout } from "@/components/layout/PageLayout";
import Link from 'next/link';

type LeaderboardTab = 'Top Learners' | 'Top Contributors' | 'Top Event Hosts';

const TABS: LeaderboardTab[] = ['Top Learners', 'Top Contributors', 'Top Event Hosts'];

const MOCK_LEADERS = [
  { id: 'u1', name: 'Priya Sharma', xp: 12500, rank: 1, avatar: '👩🏽', title: 'Tribe Leader' },
  { id: 'u2', name: 'Rahul Desai', xp: 11200, rank: 2, avatar: '👨🏻', title: 'Strategist' },
  { id: 'u3', name: 'Neha Gupta', xp: 9800, rank: 3, avatar: '👩🏻', title: 'Strategist' },
  { id: 'u4', name: 'Amit Kumar', xp: 8400, rank: 4, avatar: '👨🏽', title: 'Investor' },
  { id: 'u5', name: 'Sarah Khan', xp: 7200, rank: 5, avatar: '👩🏽', title: 'Investor' },
  { id: 'u6', name: 'Vikram Singh', xp: 6100, rank: 6, avatar: '👨🏼', title: 'Investor' },
  // Current user mock
  { id: 'u_curr', name: 'Alex Smith', xp: 1250, rank: 1024, avatar: '👤', title: 'Saver', isCurrentUser: true },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('Top Learners');

  const top3 = MOCK_LEADERS.filter(u => u.rank <= 3).sort((a, b) => a.rank - b.rank);
  const rank1 = top3.find(u => u.rank === 1);
  const rank2 = top3.find(u => u.rank === 2);
  const rank3 = top3.find(u => u.rank === 3);

  const others = MOCK_LEADERS.filter(u => u.rank > 3 && !u.isCurrentUser).sort((a, b) => a.rank - b.rank);
  const currentUser = MOCK_LEADERS.find(u => u.isCurrentUser);

  return (
    <PageLayout>
        <Container >
          <div className="pt-6 pb-2">
            <Link href="/dashboard" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
              Back to Dashboard
            </Link>
          </div>
          <div className="space-y-[var(--space-xl)] pb-12 w-full max-w-5xl mx-auto px-4 sm:px-6">
            {/* Header */}
            <section className="text-center pb-[var(--space-lg)]">
              <IconTrophy size={48} className="mx-auto text-brand-warning mb-4" />
              <h1 className="text-h3 sm:text-h2 font-display mb-2">Hall of Fame</h1>
              <p className="text-brand-text-secondary max-w-md mx-auto text-sm sm:text-base">
                Celebrate the top performers in the Varsity Tribe community. Learn, contribute, and climb the ranks!
              </p>
            </section>

            {/* Tabs */}
            <div className="flex justify-center mb-[var(--space-md)]">
              <div className="inline-flex flex-wrap justify-center bg-brand-surface p-1 rounded-2xl sm:rounded-full border border-brand-border gap-1">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 sm:px-4 py-2 rounded-xl sm:rounded-full text-xs sm:text-sm font-medium transition-all",
                      activeTab === tab
                        ? "bg-brand-primary text-white shadow-sm"
                        : "text-brand-text-secondary hover:text-brand-text-primary"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Podium for Top 3 */}
            <section className="mt-8 mb-12 sm:mb-16">
              <motion.div
                key={`podium-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-end justify-center gap-1 sm:gap-6 scale-[0.85] sm:scale-100 origin-bottom w-full max-w-full"
              >
                {/* Rank 2 */}
                {rank2 && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-surface-elevated rounded-full flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-4 border-[#C0C0C0] relative z-10">
                      {rank2.avatar}
                      <div className="absolute -bottom-2 sm:-bottom-3 bg-[#C0C0C0] text-black text-xs sm:text-sm font-bold w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">2</div>
                    </div>
                    <div className="h-24 sm:h-32 w-20 sm:w-28 bg-gradient-to-t from-transparent to-[#C0C0C0]/20 rounded-t-lg border-x border-t border-[#C0C0C0]/40 mt-4 flex flex-col items-center justify-start pt-3 sm:pt-4">
                      <span className="font-bold text-xs sm:text-sm text-center px-1 w-full truncate">{rank2.name}</span>
                      <span className="text-[10px] sm:text-xs text-brand-text-secondary mt-1">{rank2.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                )}

                {/* Rank 1 */}
                {rank1 && (
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-brand-surface-elevated rounded-full flex items-center justify-center text-4xl sm:text-6xl shadow-xl border-4 border-[#FFD700] relative z-10">
                      {rank1.avatar}
                      <div className="absolute -top-4 sm:-top-6"><IconFlame className="text-[#FFD700] sm:w-8 sm:h-8" size={28} /></div>
                      <div className="absolute -bottom-3 sm:-bottom-4 bg-[#FFD700] text-black text-sm sm:text-base font-bold w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-lg">1</div>
                    </div>
                    <div className="h-32 sm:h-44 w-24 sm:w-32 bg-gradient-to-t from-transparent to-[#FFD700]/20 rounded-t-lg border-x border-t border-[#FFD700]/40 mt-4 flex flex-col items-center justify-start pt-3 sm:pt-4">
                      <span className="font-bold text-sm sm:text-base text-center px-1 w-full truncate">{rank1.name}</span>
                      <span className="text-xs sm:text-sm text-brand-text-secondary mt-1">{rank1.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                )}

                {/* Rank 3 */}
                {rank3 && (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 sm:w-20 sm:h-20 bg-brand-surface-elevated rounded-full flex items-center justify-center text-2xl sm:text-4xl shadow-md border-4 border-[#CD7F32] relative z-10">
                      {rank3.avatar}
                      <div className="absolute -bottom-2 sm:-bottom-3 bg-[#CD7F32] text-white text-xs sm:text-sm font-bold w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center">3</div>
                    </div>
                    <div className="h-20 sm:h-28 w-20 sm:w-28 bg-gradient-to-t from-transparent to-[#CD7F32]/20 rounded-t-lg border-x border-t border-[#CD7F32]/40 mt-4 flex flex-col items-center justify-start pt-3 sm:pt-4">
                      <span className="font-bold text-xs sm:text-sm text-center px-1 w-full truncate">{rank3.name}</span>
                      <span className="text-[10px] sm:text-xs text-brand-text-secondary mt-1">{rank3.xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                )}
              </motion.div>
            </section>

            {/* Leaderboard Table */}
            <section className="relative w-full max-w-4xl mx-auto">
              <motion.div
                key={`table-${activeTab}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="bg-brand-surface border border-brand-border rounded-2xl overflow-hidden w-full">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-brand-border bg-white/5">
                          <th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-brand-text-secondary w-16 text-center">Rank</th>
                          <th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-brand-text-secondary">User</th>
                          <th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-brand-text-secondary hidden sm:table-cell">Title</th>
                          <th className="py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-brand-text-secondary text-right">XP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {others.map((user) => (
                          <tr key={user.id} className="border-b border-brand-border/50 hover:bg-white/5 transition-colors">
                            <td className="py-3 sm:py-4 px-4 sm:px-6 text-center font-bold text-brand-text-secondary text-sm sm:text-base">#{user.rank}</td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 min-w-0">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-surface-elevated flex items-center justify-center text-lg sm:text-xl shrink-0">
                                  {user.avatar}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-semibold text-sm sm:text-body truncate">{user.name}</span>
                                  <span className="text-xs text-brand-text-secondary sm:hidden truncate">{user.title}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 text-sm text-brand-text-secondary hidden sm:table-cell truncate">{user.title}</td>
                            <td className="py-3 sm:py-4 px-4 sm:px-6 text-right font-bold text-brand-primary text-sm sm:text-base">{user.xp.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* Sticky Current User Rank */}
            {currentUser && (
              <div className="sticky bottom-6 max-w-4xl mx-auto mt-12 z-20">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-10 rounded-[var(--radius-lg)] blur-md" />
                <Card className="relative bg-white/90 backdrop-blur-xl border-brand-primary/30 flex items-center gap-3 sm:gap-4 py-3 sm:py-4 px-4 sm:px-6 shadow-lg">
                  <div className="w-10 sm:w-12 text-center text-xs sm:text-sm font-bold text-brand-text-secondary">
                    #{currentUser.rank}
                  </div>
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-brand-surface flex items-center justify-center text-lg sm:text-xl shrink-0 border border-brand-border">
                    {currentUser.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm sm:text-body text-brand-primary truncate">You</h3>
                    <p className="text-xs text-brand-text-secondary truncate">Keep going!</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-sm sm:text-body">{currentUser.xp.toLocaleString()}</span>
                    <span className="text-[10px] sm:text-xs text-brand-text-muted block">XP</span>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Container>
      </PageLayout>
    );
}
