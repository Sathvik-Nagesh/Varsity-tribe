import {
  IconCalculator,
  IconTarget,
  IconReceipt,
  IconChartPie,
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
  { icon: IconCalculator, title: 'SIP Calculator', description: 'Project your SIP returns', color: 'bg-brand-primary/10 text-brand-primary', href: '/tools/sip' },
  { icon: IconTarget, title: 'Goal Planner', description: 'Plan your financial goals', color: 'bg-brand-success/10 text-brand-success', href: '/tools' },
  { icon: IconReceipt, title: 'EMI Calculator', description: 'Calculate your EMIs', color: 'bg-brand-warning/10 text-brand-warning', href: '/tools/emi' },
  { icon: IconChartPie, title: 'Portfolio Check', description: 'Analyse your portfolio', color: 'bg-brand-danger/10 text-brand-danger', href: '/tools/portfolio' },
];

export const mockLeaders = [
  { id: 'u1', name: 'Priya Sharma', xp: 12500, rank: 1, avatar: '👩🏽', title: 'Tribe Leader' },
  { id: 'u2', name: 'Rahul Desai', xp: 11200, rank: 2, avatar: '👨🏻', title: 'Strategist' },
  { id: 'u3', name: 'Neha Gupta', xp: 9800, rank: 3, avatar: '👩🏻', title: 'Strategist' },
  { id: 'u4', name: 'Amit Kumar', xp: 8400, rank: 4, avatar: '👨🏽', title: 'Investor' },
  { id: 'u5', name: 'Sarah Khan', xp: 7200, rank: 5, avatar: '👩🏽', title: 'Investor' },
  { id: 'u6', name: 'Vikram Singh', xp: 6100, rank: 6, avatar: '👨🏼', title: 'Investor' },
  { id: 'u_curr', name: 'Alex Smith', xp: 1250, rank: 1024, avatar: '👤', title: 'Saver', isCurrentUser: true },
];

export const mockDB = {
  getUpcomingEvents: async () => upcomingEvents,
  getLiveActivities: async () => liveActivities,
  getCommunityPosts: async () => communityPosts,
  getTopLeaders: async () => topLeaders,
  getQuickTools: async () => quickTools,
  getMockLeaders: async () => mockLeaders,
};
