# Task 4: Performance, Gamification & Skeletons

- [x] Implement Skeleton Loaders: Create `src/components/ui/Skeleton.tsx` and implement them for lists, cards, and charts. Use them wherever data fetching happens.
- [x] Optimize Performance: Use `next/dynamic` to lazy load heavy charts (e.g., in `/learn/compound-interest/page.tsx` or `/learn/sip-growth/page.tsx`). Add `React.memo` to list items if necessary.
- [x] Gamification: Update the Leaderboard (`/leaderboard/page.tsx`) to show rank movement (up/down icons) and weekly XP. Restrict confetti/celebrations to ONLY fire on major milestones (Level Up, Goal Complete) using lightweight framer-motion or similar.
