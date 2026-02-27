'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Bookmark } from '@/types/bookmark';

const API_BASE = '/api/bookmarks';

export function useBookmarks() {
  const [allBookmarks, setAllBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error(`Failed to fetch bookmarks: ${res.status}`);
      const data = await res.json();
      setAllBookmarks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookmarks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const bookmarks = useMemo(() => {
    let filtered = allBookmarks;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((b) => b.title.toLowerCase().includes(q));
    }
    if (selectedTag) {
      filtered = filtered.filter((b) => b.tags?.includes(selectedTag));
    }
    return filtered;
  }, [allBookmarks, searchQuery, selectedTag]);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    allBookmarks.forEach((b) => b.tags?.forEach((t) => tagSet.add(t)));
    return Array.from(tagSet).sort();
  }, [allBookmarks]);

  const addBookmark = useCallback(
    async (data: { url: string; title: string; tags: string[] }) => {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to add bookmark');
      }
      const newBookmark: Bookmark = await res.json();
      setAllBookmarks((prev) => [newBookmark, ...prev]);
    },
    []
  );

  const deleteBookmark = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to delete bookmark');
    }
    setAllBookmarks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  return {
    bookmarks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    allTags,
    addBookmark,
    deleteBookmark,
    refetch: fetchBookmarks,
  };
}
