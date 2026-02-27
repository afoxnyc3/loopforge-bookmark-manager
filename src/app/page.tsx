'use client';

import { useState } from 'react';
import BookmarkGrid from '@/components/BookmarkGrid';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { bookmarks, loading, error, allTags, addBookmark, deleteBookmark } =
    useBookmarks({ search, tag: selectedTag });

  const handleTagClick = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-gray-900 shrink-0">🔖 Bookmarks</h1>
          <div className="flex-1 max-w-md">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Bookmark
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar */}
        {allTags.length > 0 && (
          <aside className="w-48 shrink-0">
            <TagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={handleTagClick}
            />
          </aside>
        )}

        {/* Grid */}
        <main className="flex-1 min-w-0">
          <BookmarkGrid
            bookmarks={bookmarks}
            loading={loading}
            error={error}
            onDelete={deleteBookmark}
            onTagClick={handleTagClick}
          />
        </main>
      </div>

      {/* Add Bookmark Modal */}
      {showModal && (
        <AddBookmarkModal
          onClose={() => setShowModal(false)}
          onAdd={async (data) => {
            await addBookmark(data);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
