import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification } from '@/types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'goal-progress',
    title: 'Goal Update',
    message: 'Your Emergency Fund is now 48% complete! Keep it up!',
    read: false,
    actionHref: '/goals',
    createdAt: '2026-06-03T10:00:00Z',
  },
  {
    id: 'n2',
    type: 'event-reminder',
    title: 'Event Tomorrow',
    message: 'Salary Negotiation Workshop starts tomorrow at 7:00 PM.',
    read: false,
    actionHref: '/events/evt_1',
    createdAt: '2026-06-03T09:00:00Z',
  },
  {
    id: 'n3',
    type: 'rank-change',
    title: 'Rank Up!',
    message: 'You moved to rank #8 on the leaderboard!',
    read: false,
    actionHref: '/leaderboard',
    createdAt: '2026-06-03T08:00:00Z',
  },
  {
    id: 'n4',
    type: 'community-reply',
    title: 'New Reply',
    message: 'Priya M. replied to your post about first SIP.',
    read: true,
    actionHref: '/community/post_1',
    createdAt: '2026-06-02T18:00:00Z',
  },
  {
    id: 'n5',
    type: 'badge-earned',
    title: 'Badge Earned! 🏅',
    message: 'You earned the "SIP Starter" badge!',
    read: true,
    actionHref: '/profile',
    createdAt: '2026-06-02T12:00:00Z',
  },
  {
    id: 'n6',
    type: 'xp-earned',
    title: '+50 XP',
    message: 'You earned 50 XP for creating a new goal.',
    read: true,
    createdAt: '2026-06-02T10:00:00Z',
  },
];

interface NotificationState {
  notifications: Notification[];
  unreadCount: () => number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: MOCK_NOTIFICATIONS,

      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: `n_${Date.now()}`,
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    { name: 'varsity-tribe-notifications' }
  )
);
