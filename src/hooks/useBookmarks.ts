'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bookmark, CreateBookmarkInput } from '@/types/bookmark';

interface UseBookmarksOptions {
  search?: string;
  tag?: string | null;
}

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  allTags: string[];
  addBookmark: (data: CreateBookmarkInput) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useBookmarks({
  search = '',
  tag = null,
}: UseBookmarksOptions = {}): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

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
        if (!res.ok) throw new Error(`Failed to fetch bookmarks (${res.status})`);

        const data: Bookmark[] = await res.json();
        if (!cancelled) {
          setBookmarks(data);
          // Derive all unique tags from unfiltered data for sidebar
          const tagSet = new Set<string>();
          data.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
          setAllTags(Array.from(tagSet).sort());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBookmarks();
    return () => { cancelled = true; };
  }, [search, tag, version]);

  const addBookmark = useCallback(async (data: CreateBookmarkInput) => {
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Failed to create bookmark');
    }
    refetch();
  }, [refetch]);

  const deleteBookmark = useCallback(async (id: string) => {
    const res = await fetch(`/api/bookmarks/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Failed to delete bookmark');
    }
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return { bookmarks, loading, error, allTags, addBookmark, deleteBookmark, refetch };
}
