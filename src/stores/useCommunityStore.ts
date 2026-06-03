import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CommunityPost, CommunityComment } from '@/types';

/* ── Mock Data ── */

const MOCK_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    authorId: 'user_002',
    authorName: 'Rohan K.',
    authorInitials: 'RK',
    authorColor: 'bg-blue-500',
    content: 'Just completed my first SIP! Started with ₹500/month in Nifty 50 index fund. Baby steps! 🚀',
    tag: '#FirstSIP',
    tagVariant: 'primary',
    upvotes: 156,
    downvotes: 3,
    commentCount: 23,
    comments: [
      { id: 'c1', authorName: 'Priya M.', authorInitials: 'PM', authorColor: 'bg-emerald-500', content: 'Amazing start! ₹500 is how I began too. Now doing ₹10K/mo after 2 years.', upvotes: 12, createdAt: '2026-06-03T10:00:00Z' },
      { id: 'c2', authorName: 'Amit S.', authorInitials: 'AS', authorColor: 'bg-purple-500', content: 'Index funds are the smartest choice for beginners. Keep going!', upvotes: 8, createdAt: '2026-06-03T10:15:00Z' },
    ],
    bookmarked: false,
    createdAt: '2026-06-03T08:00:00Z',
  },
  {
    id: 'post_2',
    authorId: 'user_003',
    authorName: 'Priya M.',
    authorInitials: 'PM',
    authorColor: 'bg-emerald-500',
    content: 'Finally hit my 6-month emergency fund target of ₹3L. The budget tracker here really helped! The key was automating the SIP on salary day.',
    tag: '#EmergencyFund',
    tagVariant: 'success',
    upvotes: 234,
    downvotes: 1,
    commentCount: 45,
    comments: [
      { id: 'c3', authorName: 'Neha K.', authorInitials: 'NK', authorColor: 'bg-rose-500', content: 'How long did it take you? I\'m at 2 months right now.', upvotes: 5, createdAt: '2026-06-03T06:00:00Z' },
    ],
    bookmarked: false,
    createdAt: '2026-06-03T06:00:00Z',
  },
  {
    id: 'post_3',
    authorId: 'user_004',
    authorName: 'Amit S.',
    authorInitials: 'AS',
    authorColor: 'bg-purple-500',
    content: 'Used the salary negotiation simulator before my review. Got a 35% hike! This community is gold 💰',
    tag: '#CareerGrowth',
    tagVariant: 'warning',
    upvotes: 312,
    downvotes: 5,
    commentCount: 67,
    comments: [],
    bookmarked: false,
    createdAt: '2026-06-03T04:00:00Z',
  },
  {
    id: 'post_4',
    authorId: 'user_005',
    authorName: 'Neha K.',
    authorInitials: 'NK',
    authorColor: 'bg-rose-500',
    content: 'Can someone explain the difference between direct and regular mutual funds? I\'ve been investing in regular plans through my bank. Am I losing money?',
    tag: '#AskCommunity',
    tagVariant: 'neutral',
    upvotes: 89,
    downvotes: 0,
    commentCount: 34,
    comments: [
      { id: 'c4', authorName: 'Vikram R.', authorInitials: 'VR', authorColor: 'bg-amber-500', content: 'Yes! Direct plans have ~1% lower expense ratio. Over 20 years, that compounds to lakhs. Switch to direct via Coin or MFU.', upvotes: 45, createdAt: '2026-06-03T02:30:00Z' },
    ],
    bookmarked: false,
    createdAt: '2026-06-03T02:00:00Z',
  },
  {
    id: 'post_5',
    authorId: 'user_006',
    authorName: 'Vikram R.',
    authorInitials: 'VR',
    authorColor: 'bg-amber-500',
    content: 'My portfolio is up 22% this year following the asset allocation module. Sharing my breakdown: 60% equity (index + mid-cap), 25% debt (PPF + FD), 10% gold (SGBs), 5% crypto. Rebalanced quarterly.',
    tag: '#Portfolio',
    tagVariant: 'primary',
    upvotes: 445,
    downvotes: 8,
    commentCount: 78,
    comments: [],
    bookmarked: false,
    createdAt: '2026-06-02T22:00:00Z',
  },
  {
    id: 'post_6',
    authorId: 'user_007',
    authorName: 'Sneha D.',
    authorInitials: 'SD',
    authorColor: 'bg-pink-500',
    content: 'Just finished the Debt Payoff Simulator — turns out the avalanche method saves me ₹47K in interest vs minimum payments. Why didn\'t anyone teach this in school?',
    tag: '#DebtFree',
    tagVariant: 'success',
    upvotes: 198,
    downvotes: 2,
    commentCount: 31,
    comments: [],
    bookmarked: false,
    createdAt: '2026-06-02T18:00:00Z',
  },
];

/* ── Store ── */

interface CommunityState {
  posts: CommunityPost[];
  sortBy: 'hot' | 'new' | 'top';
  filterTag: string | null;

  // Actions
  setSortBy: (sort: 'hot' | 'new' | 'top') => void;
  setFilterTag: (tag: string | null) => void;
  upvotePost: (postId: string) => void;
  downvotePost: (postId: string) => void;
  addComment: (postId: string, comment: Omit<CommunityComment, 'id' | 'createdAt'>) => void;
  addPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'upvotes' | 'downvotes' | 'commentCount' | 'comments' | 'bookmarked'>) => void;
  toggleBookmark: (postId: string) => void;
  getPost: (postId: string) => CommunityPost | undefined;
  getSortedPosts: () => CommunityPost[];
}

export const useCommunityStore = create<CommunityState>()(
  persist(
    (set, get) => ({
      posts: MOCK_POSTS,
      sortBy: 'hot',
      filterTag: null,

      setSortBy: (sortBy) => set({ sortBy }),
      setFilterTag: (filterTag) => set({ filterTag }),

      upvotePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p
          ),
        })),

      downvotePost: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, downvotes: p.downvotes + 1 } : p
          ),
        })),

      addComment: (postId, comment) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  commentCount: p.commentCount + 1,
                  comments: [
                    ...p.comments,
                    { ...comment, id: `c_${Date.now()}`, createdAt: new Date().toISOString() },
                  ],
                }
              : p
          ),
        })),

      addPost: (post) =>
        set((state) => ({
          posts: [
            {
              ...post,
              id: `post_${Date.now()}`,
              createdAt: new Date().toISOString(),
              upvotes: 0,
              downvotes: 0,
              commentCount: 0,
              comments: [],
              bookmarked: false,
            },
            ...state.posts,
          ],
        })),

      toggleBookmark: (postId) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, bookmarked: !p.bookmarked } : p
          ),
        })),

      getPost: (postId) => get().posts.find((p) => p.id === postId),

      getSortedPosts: () => {
        const { posts, sortBy, filterTag } = get();
        let filtered = filterTag
          ? posts.filter((p) => p.tag === filterTag)
          : posts;

        switch (sortBy) {
          case 'new':
            return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          case 'top':
            return [...filtered].sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
          case 'hot':
          default:
            // Hot = upvotes weighted by recency
            return [...filtered].sort((a, b) => {
              const scoreA = (a.upvotes - a.downvotes) / Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / 3600000);
              const scoreB = (b.upvotes - b.downvotes) / Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / 3600000);
              return scoreB - scoreA;
            });
        }
      },
    }),
    { name: 'varsity-tribe-community' }
  )
);
