"use client";

import { Bookmark } from "@/types/bookmark";
import BookmarkCard from "./BookmarkCard";
import BookmarkCardSkeleton from "./BookmarkCardSkeleton";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  isLoading?: boolean;
  error?: string | null;
  onDelete: (id: string) => void;
  onEdit?: (bookmark: Bookmark) => void;
}

export default function BookmarkGrid({
  bookmarks,
  isLoading = false,
  error = null,
  onDelete,
  onEdit,
}: BookmarkGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No bookmarks found</h3>
        <p className="text-gray-400 text-sm max-w-sm">
          Add your first bookmark using the button above, or try adjusting your search or tag filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
        <BookmarkCard
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
