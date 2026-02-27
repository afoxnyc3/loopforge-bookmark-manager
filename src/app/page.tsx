'use client';

import { useState } from 'react';
import { BookmarkGrid } from '@/components/BookmarkGrid';
import { SearchBar } from '@/components/SearchBar';
import { TagFilter } from '@/components/TagFilter';
import { AddBookmarkModal } from '@/components/AddBookmarkModal';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { Bookmark } from '@/types/bookmark';

export default function HomePage() {
  const {
    bookmarks,
    allTags,
    isLoading,
    error,
    filters,
    setFilters,
    addBookmark,
    editBookmark,
    removeBookmark,
  } = useBookmarks();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Bookmark | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const handleSearchChange = (search: string) => {
    setFilters({ ...filters, search: search || undefined });
  };

  const handleTagSelect = (tag: string | null) => {
    setFilters({ ...filters, tag: tag ?? undefined });
  };

  const handleAddBookmark = async (payload: {
    url: string;
    title: string;
    tags: string[];
  }) => {
    setMutationError(null);
    try {
      await addBookmark(payload);
      setIsAddModalOpen(false);
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : 'Failed to add bookmark'
      );
    }
  };

  const handleEditBookmark = async (payload: {
    url: string;
    title: string;
    tags: string[];
  }) => {
    if (!editTarget) return;
    setMutationError(null);
    try {
      await editBookmark(editTarget.id, payload);
      setEditTarget(null);
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : 'Failed to update bookmark'
      );
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    setMutationError(null);
    try {
      await removeBookmark(id);
    } catch (err) {
      setMutationError(
        err instanceof Error ? err.message : 'Failed to delete bookmark'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔖</span>
            <h1 className="text-xl font-bold text-gray-900">Bookmark Manager</h1>
          </div>
          <button
            onClick={() => {
              setMutationError(null);
              setIsAddModalOpen(true);
            }}
            className="btn-primary"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Bookmark
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              value={filters.search ?? ''}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <div className="mb-6">
            <TagFilter
              tags={allTags}
              selectedTag={filters.tag ?? null}
              onSelectTag={handleTagSelect}
            />
          </div>
        )}

        {/* Mutation error banner */}
        {mutationError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-red-700">{mutationError}</p>
            <button
              onClick={() => setMutationError(null)}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Bookmark grid */}
        <BookmarkGrid
          bookmarks={bookmarks}
          isLoading={isLoading}
          error={error}
          onEdit={(bookmark) => {
            setMutationError(null);
            setEditTarget(bookmark);
          }}
          onDelete={handleDeleteBookmark}
        />
      </main>

      {/* Add Bookmark Modal */}
      <AddBookmarkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddBookmark}
        title="Add Bookmark"
      />

      {/* Edit Bookmark Modal */}
      <AddBookmarkModal
        isOpen={editTarget !== null}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditBookmark}
        initialValues={editTarget ?? undefined}
        title="Edit Bookmark"
      />
    </div>
  );
}
