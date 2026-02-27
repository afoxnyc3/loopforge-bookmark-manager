"use client";

import { useState, useCallback } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import BookmarkGrid from "@/components/BookmarkGrid";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import AddBookmarkModal from "@/components/AddBookmarkModal";
import Header from "@/components/Header";
import { Bookmark } from "@/types/bookmark";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const { bookmarks, isLoading, error, createBookmark, updateBookmark, deleteBookmark } = useBookmarks({
    search,
    tag: activeTag,
  });

  const allTags = Array.from(
    new Set(bookmarks.flatMap((b) => b.tags ?? []))
  ).sort();

  const handleOpenAdd = useCallback(() => {
    setEditingBookmark(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingBookmark(null);
  }, []);

  const handleModalSubmit = useCallback(
    async (data: { url: string; title: string; tags: string[] }) => {
      if (editingBookmark) {
        await updateBookmark(editingBookmark.id, data);
      } else {
        await createBookmark(data);
      }
      handleModalClose();
    },
    [editingBookmark, createBookmark, updateBookmark, handleModalClose]
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Header onAddClick={handleOpenAdd} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        {allTags.length > 0 && (
          <div className="mb-6">
            <TagFilter tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />
          </div>
        )}
        <BookmarkGrid
          bookmarks={bookmarks}
          isLoading={isLoading}
          error={error}
          onDelete={deleteBookmark}
          onEdit={handleEdit}
        />
      </div>
      {isModalOpen && (
        <AddBookmarkModal
          bookmark={editingBookmark}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </main>
  );
}
