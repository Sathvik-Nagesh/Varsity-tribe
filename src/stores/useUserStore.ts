'use client';

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type {
  AgeBracket,
  Badge,
  DashboardSection,
  GoalType,
  IncomeRange,
  OnboardingAnswers,
  PersonaTrack,
  RiskProfile,
  UserLevel,
} from '@/types';

// ─── Helper Functions ────────────────────────────────────────────────

function computeRiskProfile(
  riskComfort: number,
  investmentExperience: OnboardingAnswers['investmentExperience'],
): RiskProfile {
  const expBonus =
    investmentExperience === 'advanced'
      ? 2
      : investmentExperience === 'intermediate'
        ? 1
        : 0;

  const score = riskComfort + expBonus;

  if (score <= 2) return 'conservative';
  if (score <= 4) return 'moderate';
  if (score <= 6) return 'balanced';
  if (score <= 8) return 'growth';
  return 'aggressive';
}

function computePersonaTrack(
  ageBracket: AgeBracket | null,
  incomeRange: IncomeRange | null,
): PersonaTrack {
  if (ageBracket === '18-22' || incomeRange === 'no-income') return 'student';
  if (ageBracket === '46-55' || ageBracket === '55+') return 'pre-retirement';
  if (ageBracket === '36-45' || incomeRange === '20-50L' || incomeRange === '50L+')
    return 'family';
  return 'young-professional';
}

function computeRecommendedActions(
  personaTrack: PersonaTrack,
  currentGoals: GoalType[],
): string[] {
  const actions: string[] = [];

  switch (personaTrack) {
    case 'student':
      actions.push('Start a micro-SIP of ₹500/month');
      if (!currentGoals.includes('emergency-fund'))
        actions.push('Set up an emergency fund goal');
      actions.push('Complete the "Investing 101" module');
      break;
    case 'young-professional':
      actions.push('Increase SIP by 10% this quarter');
      if (!currentGoals.includes('emergency-fund'))
        actions.push('Build a 6-month emergency fund');
      actions.push('Explore equity mutual funds module');
      break;
    case 'family':
      actions.push('Review your insurance coverage');
      if (!currentGoals.includes('higher-education'))
        actions.push('Plan for children\'s education fund');
      actions.push('Diversify across asset classes');
      break;
    case 'pre-retirement':
      actions.push('Shift towards debt-heavy allocation');
      if (!currentGoals.includes('retirement'))
        actions.push('Set a concrete retirement corpus goal');
      actions.push('Explore the tax-planning module');
      break;
  }

  return actions.slice(0, 3);
}

function computeDashboardLayout(personaTrack: PersonaTrack): DashboardSection[] {
  const layouts: Record<PersonaTrack, DashboardSection[]> = {
    student: [
      { id: 'learning', type: 'learning', priority: 1 },
      { id: 'goals', type: 'goals', priority: 2 },
      { id: 'community', type: 'community', priority: 3 },
      { id: 'tools', type: 'tools', priority: 4 },
      { id: 'events', type: 'events', priority: 5 },
    ],
    'young-professional': [
      { id: 'goals', type: 'goals', priority: 1 },
      { id: 'tools', type: 'tools', priority: 2 },
      { id: 'learning', type: 'learning', priority: 3 },
      { id: 'community', type: 'community', priority: 4 },
      { id: 'events', type: 'events', priority: 5 },
    ],
    family: [
      { id: 'goals', type: 'goals', priority: 1 },
      { id: 'tools', type: 'tools', priority: 2 },
      { id: 'events', type: 'events', priority: 3 },
      { id: 'learning', type: 'learning', priority: 4 },
      { id: 'community', type: 'community', priority: 5 },
    ],
    'pre-retirement': [
      { id: 'tools', type: 'tools', priority: 1 },
      { id: 'goals', type: 'goals', priority: 2 },
      { id: 'learning', type: 'learning', priority: 3 },
      { id: 'events', type: 'events', priority: 4 },
      { id: 'community', type: 'community', priority: 5 },
    ],
  };

  return layouts[personaTrack];
}

function computeLevel(xp: number): UserLevel {
  if (xp >= 10000) return 'tribe-leader';
  if (xp >= 4000) return 'strategist';
  if (xp >= 1500) return 'investor';
  if (xp >= 500) return 'sprout';
  return 'seedling';
}

// ─── Store Types ─────────────────────────────────────────────────────

interface UserState {
  // Onboarding
  onboardingAnswers: OnboardingAnswers;
  onboardingCompleted: boolean;

  // Derived
  riskProfile: RiskProfile;
  personaTrack: PersonaTrack;
  recommendedActions: string[];
  dashboardLayout: DashboardSection[];

  // Gamification
  xp: number;
  level: UserLevel;
  streak: number;
  badges: Badge[];

  // Preferences
  currency: 'INR' | 'USD' | 'EUR' | 'GBP';

  // Financial Health
  financialHealthScore: number;
  financialHealthBreakdown: {
    emergencyFund: { score: number; label: string };
    debtRatio: { score: number; label: string };
    investments: { score: number; label: string };
    insurance: { score: number; label: string };
    savings: { score: number; label: string };
  };

  // Actions
  setOnboardingField: <K extends keyof OnboardingAnswers>(
    field: K,
    value: OnboardingAnswers[K],
  ) => void;
  completeOnboarding: (answers: OnboardingAnswers) => void;
  addXP: (amount: number) => void;
  recalculateHealthScore: () => void;
  setCurrency: (currency: 'INR' | 'USD' | 'EUR' | 'GBP') => void;
}

// ─── Default Values ──────────────────────────────────────────────────

const defaultOnboardingAnswers: OnboardingAnswers = {
  ageBracket: null,
  incomeRange: null,
  currentGoals: [],
  investmentExperience: null,
  riskComfort: 5,
  motivation: '',
  weeklyTimeAvailable: null,
  biggestFinancialWorry: '',
};

// ─── Store ───────────────────────────────────────────────────────────

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // Onboarding
      onboardingAnswers: { ...defaultOnboardingAnswers },
      onboardingCompleted: false,

      // Derived (defaults before onboarding)
      riskProfile: 'moderate',
      personaTrack: 'young-professional',
      recommendedActions: [],
      dashboardLayout: computeDashboardLayout('young-professional'),

      // Gamification
      xp: 0,
      level: 'seedling',
      streak: 0,
      badges: [],

      // Preferences
      currency: 'INR',

      financialHealthScore: 742,
      financialHealthBreakdown: {
        emergencyFund: { score: 85, label: 'Good' },
        debtRatio: { score: 45, label: 'Needs Improvement' },
        investments: { score: 92, label: 'Excellent' },
        insurance: { score: 60, label: 'Fair' },
        savings: { score: 88, label: 'Good' },
      },

      // ── Actions ──────────────────────────────────────────────

      setOnboardingField: (field, value) =>
        set((state) => ({
          onboardingAnswers: { ...state.onboardingAnswers, [field]: value },
        })),

      completeOnboarding: (answers) => {
        const riskProfile = computeRiskProfile(answers.riskComfort, answers.investmentExperience);
        const personaTrack = computePersonaTrack(answers.ageBracket, answers.incomeRange);
        const recommendedActions = computeRecommendedActions(personaTrack, answers.currentGoals);
        const dashboardLayout = computeDashboardLayout(personaTrack);

        set({
          onboardingAnswers: answers,
          onboardingCompleted: true,
          riskProfile,
          personaTrack,
          recommendedActions,
          dashboardLayout,
        });
      },

      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = computeLevel(newXP);
          
          if (newLevel !== state.level) {
            toast.success(`🚀 Level Up! Welcome to ${newLevel} level.`, { 
              duration: 5000,
              icon: React.createElement('img', { src: '/logo.png', alt: 'TRIBE', style: { height: '16px', marginRight: '4px' } })
            });
          } else {
            toast.success(`✨ +${amount} XP earned!`, { 
              duration: 3000,
              icon: React.createElement('img', { src: '/logo.png', alt: 'TRIBE', style: { height: '16px', marginRight: '4px' } })
            });
          }

          return { xp: newXP, level: newLevel };
        }),
      
      recalculateHealthScore: () => set((state) => ({ ...state })),

      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'varsity-tribe-user',
    },
  ),
);
