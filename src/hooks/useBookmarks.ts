'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createBookmark,
  deleteBookmark,
  fetchBookmarks,
  updateBookmark,
} from '@/lib/api';
import type {
  Bookmark,
  BookmarkFilters,
  CreateBookmarkPayload,
  UpdateBookmarkPayload,
} from '@/types/bookmark';

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  allTags: string[];
  isLoading: boolean;
  error: string | null;
  filters: BookmarkFilters;
  setFilters: (filters: BookmarkFilters) => void;
  addBookmark: (payload: CreateBookmarkPayload) => Promise<void>;
  editBookmark: (id: string, payload: UpdateBookmarkPayload) => Promise<void>;
  removeBookmark: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useBookmarks(): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookmarkFilters>({});
  const refreshCountRef = useRef(0);

  const load = useCallback(async (currentFilters: BookmarkFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchBookmarks(currentFilters);
      setBookmarks(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load, refreshCountRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = useCallback(() => {
    refreshCountRef.current += 1;
    load(filters);
  }, [filters, load]);

  const addBookmark = useCallback(
    async (payload: CreateBookmarkPayload) => {
      const newBookmark = await createBookmark(payload);
      setBookmarks((prev) => [newBookmark, ...prev]);
    },
    []
  );

  const editBookmark = useCallback(
    async (id: string, payload: UpdateBookmarkPayload) => {
      const updated = await updateBookmark(id, payload);
      setBookmarks((prev) =>
        prev.map((b) => (b.id === id ? updated : b))
      );
    },
    []
  );

  const removeBookmark = useCallback(async (id: string) => {
    await deleteBookmark(id);
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags))
  ).sort();

  return {
    bookmarks,
    allTags,
    isLoading,
    error,
    filters,
    setFilters,
    addBookmark,
    editBookmark,
    removeBookmark,
    refresh,
  };
}
