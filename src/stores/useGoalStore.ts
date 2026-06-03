'use client';

import React from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';
import type { FinancialGoal, GoalConflict, GoalMilestone } from '@/types';
import { useUserStore } from './useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

// ─── Helpers ─────────────────────────────────────────────────────────

function createDefaultMilestones(): GoalMilestone[] {
  return [
    { percent: 25, reached: false, xpAwarded: false },
    { percent: 50, reached: false, xpAwarded: false },
    { percent: 75, reached: false, xpAwarded: false },
    { percent: 100, reached: false, xpAwarded: false },
  ];
}

function generateId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function evaluateMilestones(goal: FinancialGoal): GoalMilestone[] {
  const progressPercent = (goal.currentAmount / goal.targetAmount) * 100;

  return goal.milestones.map((m) => {
    const reached = progressPercent >= m.percent;
    if (reached && !m.reached && !m.xpAwarded) {
      if (m.percent === 100) {
        toast.success(`🎉 Congratulations! You have fully completed the ${goal.label} goal!`, { 
          duration: 5000,
          icon: React.createElement('img', { src: '/logo.png', alt: 'TRIBE', style: { height: '16px', marginRight: '4px' } })
        });
      } else {
        toast.success(`📈 Milestone Unlocked: ${m.percent}% of ${goal.label}!`, { 
          duration: 4000,
          icon: React.createElement('img', { src: '/logo.png', alt: 'TRIBE', style: { height: '16px', marginRight: '4px' } })
        });
      }
    }
    return {
      ...m,
      reached,
    };
  });
}

// ─── Mock Data ───────────────────────────────────────────────────────

const mockGoals: FinancialGoal[] = [
  {
    id: 'demo_emergency_fund',
    type: 'emergency-fund',
    label: 'Emergency Fund',
    targetAmount: 300000,
    currentAmount: 105000,
    monthlySIP: 10000,
    projectedCompletionDate: '2027-06-01',
    milestones: [
      { percent: 25, reached: true, xpAwarded: true },
      { percent: 50, reached: false, xpAwarded: false },
      { percent: 75, reached: false, xpAwarded: false },
      { percent: 100, reached: false, xpAwarded: false },
    ],
    createdAt: '2025-12-01',
  },
  {
    id: 'demo_travel',
    type: 'travel',
    label: 'Japan Trip 2027',
    targetAmount: 250000,
    currentAmount: 25000,
    monthlySIP: 8000,
    projectedCompletionDate: '2027-12-01',
    milestones: createDefaultMilestones(),
    createdAt: '2026-01-15',
  },
];

// ─── Store Types ─────────────────────────────────────────────────────

interface GoalState {
  goals: FinancialGoal[];

  addGoal: (
    goal: Omit<FinancialGoal, 'id' | 'milestones' | 'createdAt'>,
  ) => void;
  updateProgress: (goalId: string, amount: number) => void;
  removeGoal: (goalId: string) => void;
}

// ─── Store ───────────────────────────────────────────────────────────

export const useGoalStore = create<GoalState>()(
  persist(
    (set, get) => ({
      goals: mockGoals,

      addGoal: (goalInput) => {
        const newGoal: FinancialGoal = {
          ...goalInput,
          id: generateId(),
          milestones: createDefaultMilestones(),
          createdAt: new Date().toISOString().split('T')[0],
        };

        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateProgress: (goalId, amount) => {
        set((state) => {
          const goals = state.goals.map((g) => {
            if (g.id !== goalId) return g;

            const updated: FinancialGoal = {
              ...g,
              currentAmount: Math.min(g.currentAmount + amount, g.targetAmount),
            };
            updated.milestones = evaluateMilestones(updated);
            return updated;
          });

          return { goals };
        });
      },

      removeGoal: (goalId) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== goalId),
        }));
      },
    }),
    {
      name: 'varsity-tribe-goals',
    },
  ),
);

// ─── Selectors ───────────────────────────────────────────────────────

export const selectConflicts = (monthlyBudget: number) => (state: GoalState): GoalConflict[] => {
  const totalSIP = state.goals.reduce((sum, g) => sum + g.monthlySIP, 0);
  if (totalSIP > monthlyBudget) {
    const currency = useUserStore.getState().currency;
    return [{
      goalIds: state.goals.map((g) => g.id),
      totalRequired: totalSIP,
      budgetAvailable: monthlyBudget,
      message: `Your total monthly SIPs (${formatCurrency(totalSIP, currency)}) exceed your available budget (${formatCurrency(monthlyBudget, currency)}). Consider adjusting your goals.`,
    }];
  }
  return [];
};
