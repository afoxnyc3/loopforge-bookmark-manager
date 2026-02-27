'use client';

import { BookmarkCard } from './BookmarkCard';
import type { Bookmark } from '@/types/bookmark';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-md bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-1.5">
        <div className="h-5 bg-gray-200 rounded-full w-14" />
        <div className="h-5 bg-gray-200 rounded-full w-16" />
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

export function BookmarkGrid({
  bookmarks,
  isLoading,
  error,
  onEdit,
  onDelete,
}: BookmarkGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
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
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load bookmarks</h3>
        <p className="text-sm text-gray-500 max-w-sm">{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <span className="text-3xl">🔖</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks found</h3>
        <p className="text-sm text-gray-500 max-w-sm">
          Try adjusting your search or filters, or add your first bookmark.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
