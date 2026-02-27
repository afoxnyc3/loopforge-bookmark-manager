'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import BookmarkGrid from '@/components/BookmarkGrid';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import { useBookmarks } from '@/hooks/useBookmarks';
import { Bookmark } from '@/types/bookmark';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Bookmark | null>(null);

  const { bookmarks, allTags, loading, error, addBookmark, deleteBookmark } = useBookmarks({
    search,
    tag: selectedTag ?? undefined,
  });

  const handleDelete = useCallback((id: string) => {
    const bookmark = bookmarks.find((b) => b.id === id);
    if (bookmark) setDeleteTarget(bookmark);
  }, [bookmarks]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return;
    await deleteBookmark(deleteTarget.id);
    setDeleteTarget(null);
  }, [deleteTarget, deleteBookmark]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={() => setShowAddModal(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar: Tag Filter */}
          <aside className="lg:w-48 flex-shrink-0">
            <TagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          </aside>

          {/* Main content: Bookmark Grid */}
          <div className="flex-1 min-w-0">
            <BookmarkGrid
              bookmarks={bookmarks}
              loading={loading}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </main>

      {showAddModal && (
        <AddBookmarkModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (data) => {
            await addBookmark(data);
            setShowAddModal(false);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          bookmark={deleteTarget}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
