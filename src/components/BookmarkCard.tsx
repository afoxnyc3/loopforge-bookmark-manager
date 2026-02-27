import React, { useState } from 'react';
import { Bookmark } from '@/types/bookmark';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete?: (id: string) => void;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(bookmark.id);
    setConfirmDelete(false);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmDelete(false);
  };

  return (
    <a
      href={bookmark.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all duration-200 p-4 group relative"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
            {bookmark.title}
          </h3>
          <p className="text-sm text-gray-400 truncate mt-0.5">{getDomain(bookmark.url)}</p>
        </div>
        {onDelete && (
          <button
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 p-1 rounded"
            aria-label="Delete bookmark"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {bookmark.tags && bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {bookmark.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-300 mt-3">
        {new Date(bookmark.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>

      {confirmDelete && (
        <div
          className="absolute inset-0 bg-white/95 rounded-xl flex flex-col items-center justify-center gap-3 p-4"
          onClick={(e) => e.preventDefault()}
        >
          <p className="text-sm font-medium text-gray-700">Delete this bookmark?</p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
            <button
              onClick={handleCancelDelete}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </a>
  );
}
