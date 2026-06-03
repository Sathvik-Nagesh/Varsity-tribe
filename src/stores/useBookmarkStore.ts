import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark, BookmarkType } from '@/types';

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (type: BookmarkType, targetId: string, title: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (targetId: string) => boolean;
  getByType: (type: BookmarkType) => Bookmark[];
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (type, targetId, title) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            {
              id: `bm_${Date.now()}`,
              type,
              targetId,
              title,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== id),
        })),

      isBookmarked: (targetId) =>
        get().bookmarks.some((b) => b.targetId === targetId),

      getByType: (type) =>
        get().bookmarks.filter((b) => b.type === type),
    }),
    { name: 'varsity-tribe-bookmarks' }
  )
);
