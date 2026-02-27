'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import BookmarkGrid from '@/components/BookmarkGrid';
import SearchBar from '@/components/SearchBar';
import TagFilter from '@/components/TagFilter';
import AddBookmarkModal from '@/components/AddBookmarkModal';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    bookmarks,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    allTags,
    addBookmark,
    deleteBookmark,
  } = useBookmarks();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={() => setIsModalOpen(true)} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search bookmarks..."
            />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="mb-6">
            <TagFilter
              tags={allTags}
              selectedTag={selectedTag}
              onSelectTag={setSelectedTag}
            />
          </div>
        )}

        <BookmarkGrid
          bookmarks={bookmarks}
          isLoading={isLoading}
          error={error}
          onDelete={deleteBookmark}
        />
      </main>

      <AddBookmarkModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addBookmark}
      />
    </div>
  );
}
