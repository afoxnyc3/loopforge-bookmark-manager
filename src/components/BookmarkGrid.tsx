import React from 'react';
import { Bookmark } from '@/types/bookmark';
import BookmarkCard from './BookmarkCard';
import BookmarkCardSkeleton from './BookmarkCardSkeleton';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  loading?: boolean;
  error?: string | null;
  onDelete: (id: string) => void;
  onTagClick?: (tag: string) => void;
}

export default function BookmarkGrid({
  bookmarks,
  loading = false,
  error = null,
  onDelete,
  onTagClick,
}: BookmarkGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <BookmarkCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-red-400 text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Something went wrong</h3>
        <p className="text-gray-500 text-sm max-w-sm">{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-gray-300 text-6xl mb-4">🔖</div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No bookmarks yet</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          Add your first bookmark using the button above to get started.
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
          onDelete={onDelete}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
}
