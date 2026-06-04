import { z } from 'zod';

export const GoalSchema = z.object({
  type: z.enum([
    'emergency-fund',
    'travel',
    'higher-education',
    'vehicle',
    'home-down-payment',
    'wedding',
    'retirement',
    'major-purchase'
  ]),
  label: z.string().min(1).max(100),
  targetAmount: z.number().positive(),
  currentAmount: z.number().nonnegative(),
  monthlySIP: z.number().nonnegative(),
  projectedCompletionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD")
});

export const ProfileUpdateSchema = z.object({
  ageBracket: z.enum(['18-22', '23-28', '29-35', '36-45', '46-55', '55+']).nullable(),
  incomeRange: z.enum(['no-income', '0-5L', '5-10L', '10-20L', '20-50L', '50L+']).nullable(),
  currentGoals: z.array(z.enum([
    'emergency-fund',
    'travel',
    'higher-education',
    'vehicle',
    'home-down-payment',
    'wedding',
    'retirement',
    'major-purchase'
  ])),
  investmentExperience: z.enum(['none', 'beginner', 'intermediate', 'advanced']).nullable(),
  riskComfort: z.number().min(1).max(10),
  motivation: z.string().max(1000),
  weeklyTimeAvailable: z.enum(['1-2h', '3-5h', '5-10h', '10h+']).nullable(),
  biggestFinancialWorry: z.string().max(1000),
});

export const CommunityPostSchema = z.object({
  content: z.string().min(1).max(2000),
  tag: z.string().max(50),
});

export const XPAwardSchema = z.number().positive();
