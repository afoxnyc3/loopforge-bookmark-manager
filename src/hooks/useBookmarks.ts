"use client";

import { useState, useEffect, useCallback } from "react";
import { Bookmark, CreateBookmarkInput, UpdateBookmarkInput } from "@/types/bookmark";

interface UseBookmarksOptions {
  search?: string;
  tag?: string;
}

interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  createBookmark: (input: CreateBookmarkInput) => Promise<void>;
  updateBookmark: (id: string, input: UpdateBookmarkInput) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useBookmarks({ search = "", tag = "" }: UseBookmarksOptions = {}): UseBookmarksReturn {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (tag) params.set("tag", tag);
      const res = await fetch(`/api/bookmarks?${params.toString()}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to fetch bookmarks");
      }
      const data = await res.json();
      setBookmarks(data.bookmarks ?? data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [search, tag]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const createBookmark = useCallback(async (input: CreateBookmarkInput) => {
    const res = await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to create bookmark");
    }
    await fetchBookmarks();
  }, [fetchBookmarks]);

  const updateBookmark = useCallback(async (id: string, input: UpdateBookmarkInput) => {
    const res = await fetch(`/api/bookmarks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to update bookmark");
    }
    await fetchBookmarks();
  }, [fetchBookmarks]);

  const deleteBookmark = useCallback(async (id: string) => {
    const res = await fetch(`/api/bookmarks/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error ?? "Failed to delete bookmark");
    }
    await fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    createBookmark,
    updateBookmark,
    deleteBookmark,
    refetch: fetchBookmarks,
  };
}
