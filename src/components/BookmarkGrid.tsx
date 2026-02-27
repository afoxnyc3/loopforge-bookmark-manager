import React from 'react';
import { Bookmark } from '@/types/bookmark';
import BookmarkCard from './BookmarkCard';
import BookmarkCardSkeleton from './BookmarkCardSkeleton';

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  isLoading?: boolean;
  error?: string | null;
  onDelete?: (id: string) => void;
}

export default function BookmarkGrid({
  bookmarks,
  isLoading = false,
  error = null,
  onDelete,
}: BookmarkGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <BookmarkCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Something went wrong</h3>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-gray-300 text-6xl mb-4">🔖</div>
        <h3 className="text-lg font-semibold text-gray-500 mb-2">No bookmarks found</h3>
        <p className="text-gray-400 text-sm">Add your first bookmark to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
