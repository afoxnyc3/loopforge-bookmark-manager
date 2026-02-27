import React from 'react';

interface HeaderProps {
  onAddClick: () => void;
}

export default function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔖</span>
          <h1 className="text-xl font-bold text-gray-900">Bookmarks</h1>
        </div>
        <button
          onClick={onAddClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Bookmark
        </button>
      </div>
    </header>
  );
}
