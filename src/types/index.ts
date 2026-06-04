export type GoalType =
  | 'emergency-fund'
  | 'travel'
  | 'higher-education'
  | 'vehicle'
  | 'home-down-payment'
  | 'wedding'
  | 'retirement'
  | 'major-purchase';

export type RiskProfile = 'conservative' | 'moderate' | 'balanced' | 'growth' | 'aggressive';

export type PersonaTrack = 'student' | 'young-professional' | 'family' | 'pre-retirement';

export type UserLevel = 'seedling' | 'sprout' | 'investor' | 'strategist' | 'tribe-leader';

export type AgeBracket = '18-22' | '23-28' | '29-35' | '36-45' | '46-55' | '55+';

export type IncomeRange = 'no-income' | '0-5L' | '5-10L' | '10-20L' | '20-50L' | '50L+';

export type TimeAvailable = '1-2h' | '3-5h' | '5-10h' | '10h+';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'learning' | 'community' | 'event' | 'streak';
  earnedAt?: string;
}

export interface DashboardSection {
  id: string;
  type: 'goals' | 'learning' | 'tools' | 'community' | 'events';
  priority: number;
}

export interface GoalMilestone {
  percent: 25 | 50 | 75 | 100;
  reached: boolean;
  xpAwarded: boolean;
}

export interface FinancialGoal {
  id: string;
  type: GoalType;
  label: string;
  targetAmount: number;
  currentAmount: number;
  monthlySIP: number;
  projectedCompletionDate: string;
  milestones: GoalMilestone[];
  createdAt: string;
}

export interface GoalConflict {
  goalIds: string[];
  totalRequired: number;
  budgetAvailable: number;
  message: string;
}

export interface OnboardingAnswers {
  ageBracket: AgeBracket | null;
  incomeRange: IncomeRange | null;
  currentGoals: GoalType[];
  investmentExperience: 'none' | 'beginner' | 'intermediate' | 'advanced' | null;
  riskComfort: number;
  motivation: string;
  weeklyTimeAvailable: TimeAvailable | null;
  biggestFinancialWorry: string;
}

export interface SmartNudge {
  id: string;
  type: 'goal-inactivity' | 'goal-conflict' | 'social-proof' | 'milestone-proximity';
  message: string;
  actionLabel?: string;
  actionHref?: string;
  dismissedAt?: string;
}

/* ── Community ── */

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  tag: string;
  tagVariant: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  upvotes: number;
  downvotes: number;
  commentCount: number;
  comments: CommunityComment[];
  bookmarked: boolean;
  createdAt: string;
}

export interface CommunityComment {
  id: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  content: string;
  upvotes: number;
  createdAt: string;
}

/* ── Events ── */

export interface TribeEvent {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'bootcamp' | 'webinar' | 'challenge' | 'meetup';
  date: string;
  endDate?: string;
  time: string;
  speakers: EventSpeaker[];
  registeredCount: number;
  maxCapacity: number;
  isRsvped: boolean;
  tags: string[];
}

export interface EventSpeaker {
  name: string;
  role: string;
  initials: string;
  color: string;
}

/* ── Notifications ── */

export interface Notification {
  id: string;
  type: 'goal-progress' | 'event-reminder' | 'community-reply' | 'rank-change' | 'badge-earned' | 'xp-earned';
  title: string;
  message: string;
  read: boolean;
  actionHref?: string;
  createdAt: string;
}

/* ── Bookmarks ── */

export type BookmarkType = 'post' | 'event' | 'tool' | 'module';

export interface Bookmark {
  id: string;
  type: BookmarkType;
  targetId: string;
  title: string;
  createdAt: string;
}

/* ── Financial Health ── */

export interface FinancialHealthScore {
  overall: number; // 0-1000
  breakdown: {
    emergencyFund: { score: number; label: string };
    debtRatio: { score: number; label: string };
    investments: { score: number; label: string };
    insurance: { score: number; label: string };
    savings: { score: number; label: string };
  };
}

/* ── XP Economy ── */

export type XPAction =
  | 'create-goal'      // +50
  | 'complete-goal'    // +200
  | 'attend-event'     // +100
  | 'post-comment'     // +5
  | 'answer-accepted'  // +25
  | 'complete-module'  // +75
  | 'daily-login'      // +10
  | 'streak-bonus'     // +20 per 7 days
  | 'complete-simulation' // +50
  | 'upvote-received'; // +2

export const XP_VALUES: Record<XPAction, number> = {
  'create-goal': 50,
  'complete-goal': 200,
  'attend-event': 100,
  'post-comment': 5,
  'answer-accepted': 25,
  'complete-module': 75,
  'daily-login': 10,
  'streak-bonus': 20,
  'complete-simulation': 50,
  'upvote-received': 2,
};

/* ── User Levels ── */

export interface LevelInfo {
  level: number;
  name: string;
  minXP: number;
  icon: string;
}

export const USER_LEVELS: LevelInfo[] = [
  { level: 1, name: 'Explorer', minXP: 0, icon: '🌱' },
  { level: 2, name: 'Saver', minXP: 500, icon: '🌿' },
  { level: 3, name: 'Investor', minXP: 1500, icon: '📈' },
  { level: 4, name: 'Builder', minXP: 4000, icon: '🏗️' },
  { level: 5, name: 'Mentor', minXP: 10000, icon: '🎓' },
];

/* ── Learning ── */

export interface LearningModule {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: 'basics' | 'investing' | 'planning' | 'advanced';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  xpReward: number;
  completed: boolean;
  progress: number;
}

export interface Simulation {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedMinutes: number;
  xpReward: number;
  completed: boolean;
  icon: string;
}

/* ── Search ── */

export interface SearchResult {
  id: string;
  type: 'post' | 'event' | 'tool' | 'module' | 'simulation' | 'user';
  title: string;
  description: string;
  href: string;
}

