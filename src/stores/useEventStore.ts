import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TribeEvent } from '@/types';

const MOCK_EVENTS: TribeEvent[] = [
  {
    id: 'evt_1',
    title: 'Salary Negotiation Workshop',
    description: 'Learn proven strategies to negotiate your salary with confidence. Interactive role-play sessions with real-world scenarios. Walk away with a personalized negotiation script.',
    type: 'workshop',
    date: '2026-06-05',
    time: '19:00',
    speakers: [
      { name: 'Meera Sharma', role: 'HR Director, TCS', initials: 'MS', color: 'bg-blue-500' },
      { name: 'Raj Patel', role: 'Career Coach', initials: 'RP', color: 'bg-emerald-500' },
    ],
    registeredCount: 234,
    maxCapacity: 500,
    isRsvped: false,
    tags: ['career', 'salary', 'negotiation'],
  },
  {
    id: 'evt_2',
    title: 'Emergency Fund Bootcamp',
    description: 'A 2-day intensive to help you build a rock-solid emergency fund. Learn how to calculate your target, automate savings, and choose the right instruments.',
    type: 'bootcamp',
    date: '2026-06-07',
    endDate: '2026-06-08',
    time: '10:00',
    speakers: [
      { name: 'Priya Menon', role: 'Financial Planner', initials: 'PM', color: 'bg-purple-500' },
    ],
    registeredCount: 456,
    maxCapacity: 300,
    isRsvped: true,
    tags: ['savings', 'emergency-fund', 'planning'],
  },
  {
    id: 'evt_3',
    title: 'Investing for Beginners',
    description: 'Everything you need to know to start investing with as little as ₹500. Covers SIPs, index funds, stocks, and building your first portfolio.',
    type: 'webinar',
    date: '2026-06-12',
    time: '18:30',
    speakers: [
      { name: 'Karthik Rangappa', role: 'Head of Education, Zerodha', initials: 'KR', color: 'bg-amber-500' },
    ],
    registeredCount: 789,
    maxCapacity: 1000,
    isRsvped: false,
    tags: ['investing', 'beginner', 'SIP'],
  },
  {
    id: 'evt_4',
    title: '30-Day Savings Challenge',
    description: 'Join 1,234 others in a month-long savings challenge. Set a daily savings target, track progress, compete on the leaderboard, and win prizes.',
    type: 'challenge',
    date: '2026-06-15',
    endDate: '2026-06-30',
    time: '00:00',
    speakers: [],
    registeredCount: 1234,
    maxCapacity: 5000,
    isRsvped: false,
    tags: ['savings', 'challenge', 'community'],
  },
  {
    id: 'evt_5',
    title: 'Tax Planning Masterclass',
    description: 'Maximize your tax savings legally. Learn about 80C, 80D, HRA, NPS, and more. Includes live tax calculation demo.',
    type: 'webinar',
    date: '2026-06-20',
    time: '19:00',
    speakers: [
      { name: 'CA Ankit Jain', role: 'Chartered Accountant', initials: 'AJ', color: 'bg-rose-500' },
    ],
    registeredCount: 567,
    maxCapacity: 800,
    isRsvped: false,
    tags: ['tax', 'planning', 'savings'],
  },
  {
    id: 'evt_6',
    title: 'Women in Finance Meetup',
    description: 'A safe space for women to discuss financial independence, investing, and career growth. Panel discussion + networking.',
    type: 'meetup',
    date: '2026-06-25',
    time: '17:00',
    speakers: [
      { name: 'Sneha Desai', role: 'Founder, WealthHer', initials: 'SD', color: 'bg-pink-500' },
      { name: 'Nandini Roy', role: 'VP Finance, Flipkart', initials: 'NR', color: 'bg-teal-500' },
    ],
    registeredCount: 178,
    maxCapacity: 200,
    isRsvped: false,
    tags: ['women', 'networking', 'career'],
  },
];

interface EventState {
  events: TribeEvent[];
  filter: 'all' | 'upcoming' | 'past' | 'rsvped';

  setFilter: (filter: 'all' | 'upcoming' | 'past' | 'rsvped') => void;
  toggleRsvp: (eventId: string) => void;
  getEvent: (eventId: string) => TribeEvent | undefined;
  getFilteredEvents: () => TribeEvent[];
}

export const useEventStore = create<EventState>()(
  persist(
    (set, get) => ({
      events: MOCK_EVENTS,
      filter: 'all',

      setFilter: (filter) => set({ filter }),

      toggleRsvp: (eventId) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  isRsvped: !e.isRsvped,
                  registeredCount: e.isRsvped ? e.registeredCount - 1 : e.registeredCount + 1,
                }
              : e
          ),
        })),

      getEvent: (eventId) => get().events.find((e) => e.id === eventId),

      getFilteredEvents: () => {
        const { events, filter } = get();
        const now = new Date();
        switch (filter) {
          case 'upcoming':
            return events.filter((e) => new Date(e.date) >= now);
          case 'past':
            return events.filter((e) => new Date(e.date) < now);
          case 'rsvped':
            return events.filter((e) => e.isRsvped);
          default:
            return events;
        }
      },
    }),
    { name: 'varsity-tribe-events' }
  )
);
