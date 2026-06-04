import { 
  IconTrophy, IconStar, IconFlame, IconTarget, 
  IconMessageCircle, IconCalendarEvent, IconUsers,
  IconChartBar, IconBriefcase, IconBuildingBank,
  IconCalculator, IconChartPie, IconSunHigh
} from '@tabler/icons-react';

export const upcomingEvents = [
  { id: 1, title: 'Mastering Tax Savings in 2026', date: 'Today, 6:00 PM', attendees: 120 },
  { id: 2, title: 'Live Q&A: First-time Home Buyers', date: 'Tomorrow, 4:00 PM', attendees: 85 },
];

export const liveActivities = [
  { id: 1, user: 'Priya', action: 'completed Emergency Fund', time: '2m ago' },
  { id: 2, user: 'Rahul', action: 'started SIP in Index Funds', time: '5m ago' },
  { id: 3, user: 'Anjali', action: 'earned "Debt Free" badge', time: '12m ago' },
];

export const communityPosts = [
  { initials: 'RK', username: 'Rohan K.', content: 'Just started my first SIP today! Feels great to finally take the plunge into investing. 🚀', upvotes: 23, tag: 'FirstSIP' },
  { initials: 'PM', username: 'Priya M.', content: 'Hit my emergency fund target! 6 months of expenses saved. Such a relief knowing it\'s there.', upvotes: 45, tag: 'EmergencyFund' },
  { initials: 'AS', username: 'Amit S.', content: 'Negotiated a 30% raise using the salary module tips. This community is gold! 💰', upvotes: 67, tag: 'SalaryNegotiation' },
];

export const topLeaders = [
  { id: 'u1', name: 'Priya Sharma', xp: 12500, avatar: '👩🏽', title: 'Tribe Leader' },
  { id: 'u2', name: 'Rahul Desai', xp: 11200, avatar: '👨🏻', title: 'Strategist' },
  { id: 'u3', name: 'Neha Gupta', xp: 9800, avatar: '👩🏻', title: 'Strategist' },
];

export const quickTools = [
  { icon: IconCalculator, title: 'SIP Growth', description: 'Project your SIP returns', color: 'bg-brand-primary/10 text-brand-primary', href: '/learn/sip-growth' },
  { icon: IconTarget, title: 'Emergency Fund', description: 'Plan your safety net', color: 'bg-brand-success/10 text-brand-success', href: '/learn/emergency-fund' },
  { icon: IconSunHigh, title: 'Retirement Planner', description: 'Plan for the future', color: 'bg-brand-warning/10 text-brand-warning', href: '/learn/retirement-planner' },
  { icon: IconChartPie, title: 'Portfolio Check', description: 'Analyse your portfolio', color: 'bg-brand-danger/10 text-brand-danger', href: '/tools/portfolio' },
];

export const mockLeaders = [
  { id: 'u1', name: 'Priya Sharma',  xp: 12500, weeklyXp: 1200, trend: 'same', rankMovement: 0,  rank: 1, avatar: '👩‍💼', title: 'Tribe Leader', level: 'Mentor',   modulesCompleted: 24, streak: 62 },
  { id: 'u2', name: 'Rahul Desai',   xp: 11200, weeklyXp: 1500, trend: 'up',   rankMovement: 2,  rank: 2, avatar: '👨‍💻', title: 'Strategist',  level: 'Builder',  modulesCompleted: 21, streak: 45 },
  { id: 'u3', name: 'Neha Gupta',    xp: 9800,  weeklyXp: 800,  trend: 'down', rankMovement: 1,  rank: 3, avatar: '👩‍⚕️', title: 'Strategist',  level: 'Builder',  modulesCompleted: 18, streak: 30 },
  { id: 'u4', name: 'Amit Kumar',    xp: 8400,  weeklyXp: 950,  trend: 'up',   rankMovement: 3,  rank: 4, avatar: '👨‍🏫', title: 'Investor',    level: 'Investor', modulesCompleted: 15, streak: 22 },
  { id: 'u5', name: 'Sarah Khan',    xp: 7200,  weeklyXp: 600,  trend: 'down', rankMovement: 2,  rank: 5, avatar: '👩‍🎓', title: 'Investor',    level: 'Investor', modulesCompleted: 13, streak: 18 },
  { id: 'u6', name: 'Vikram Singh',  xp: 6100,  weeklyXp: 1100, trend: 'up',   rankMovement: 5,  rank: 6, avatar: '👨‍🔧', title: 'Investor',    level: 'Investor', modulesCompleted: 11, streak: 14 },
  { id: 'u7', name: 'Anjali Rao',    xp: 5400,  weeklyXp: 720,  trend: 'up',   rankMovement: 1,  rank: 7, avatar: '👩‍🏫', title: 'Saver',       level: 'Saver',    modulesCompleted: 9,  streak: 9  },
  { id: 'u8', name: 'Dev Patel',     xp: 4900,  weeklyXp: 480,  trend: 'same', rankMovement: 0,  rank: 8, avatar: '👨‍💼', title: 'Saver',       level: 'Saver',    modulesCompleted: 8,  streak: 7  },
  { id: 'u_curr', name: 'Sathvik',   xp: 1950,  weeklyXp: 350,  trend: 'up',   rankMovement: 4,  rank: 124, avatar: '🧑‍💻', title: 'Explorer',  level: 'Investor', modulesCompleted: 12, streak: 14, isCurrentUser: true },
];


export const mockDB = {
  getUpcomingEvents: async () => upcomingEvents,
  getLiveActivities: async () => liveActivities,
  getCommunityPosts: async () => communityPosts,
  getTopLeaders: async () => topLeaders,
  getQuickTools: async () => quickTools,
  getMockLeaders: async () => mockLeaders,
};
