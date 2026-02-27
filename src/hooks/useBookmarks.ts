'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bookmark, CreateBookmarkInput } from '@/types/bookmark';

interface UseBookmarksOptions {
  search?: string;
  tag?: string;
}

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  allTags: string[];
  loading: boolean;
  error: string | null;
  addBookmark: (data: CreateBookmarkInput) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  refresh: () => void;
}

export function useBookmarks({ search = '', tag }: UseBookmarksOptions = {}): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function fetchBookmarks() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (tag) params.set('tag', tag);

        const res = await fetch(`/api/bookmarks?${params.toString()}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `Request failed: ${res.status}`);
        }

        const data: Bookmark[] = await res.json();

        if (!cancelled) {
          setBookmarks(data);

          // Derive all unique tags from the full dataset for the sidebar
          const tagSet = new Set<string>();
          data.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
          setAllTags(Array.from(tagSet).sort());
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load bookmarks.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBookmarks();
    return () => { cancelled = true; };
  }, [search, tag, refreshKey]);

  const addBookmark = useCallback(async (data: CreateBookmarkInput) => {
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Failed to add bookmark.');
    }

    refresh();
  }, [refresh]);

  const deleteBookmark = useCallback(async (id: string) => {
    const res = await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error ?? 'Failed to delete bookmark.');
    }

    refresh();
  }, [refresh]);

  return { bookmarks, allTags, loading, error, addBookmark, deleteBookmark, refresh };
}
